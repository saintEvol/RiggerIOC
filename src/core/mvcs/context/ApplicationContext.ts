/*
 * Copyright 2018 Yang Wu.
 *
 *	Licensed under the Apache License, Version 2.0 (the "License");
 *	you may not use this file except in compliance with the License.
 *	You may obtain a copy of the License at
 *
 *		http://www.apache.org/licenses/LICENSE-2.0
 *
 *		Unless required by applicable law or agreed to in writing, software
 *		distributed under the License is distributed on an "AS IS" BASIS,
 *		WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *		See the License for the specific language governing permissions and
 *		limitations under the License.
 */
module riggerIOC {
	// export class InjectionStatistics {
	// 	constructor(id: string | number, owner?: any, fromConstructor?: any, toConstructor?: any) {
	// 		this.id = id;
	// 		this.owner = owner;
	// 		this.fromConstructor = fromConstructor;
	// 		this.toConstructor = toConstructor;
	// 	}

	// 	dispose() {
	// 		this.owner = this.fromConstructor = this.toConstructor = null;
	// 	}

	// 	id: string | number;
	// 	owner: any;
	// 	fromConstructor: any;
	// 	toConstructor: any;
	// }

	/**
	 * 应用上下文，表示一个应用
	 * 可以等待应用启动完成
	 */
	export abstract class ApplicationContext extends BaseWaitable implements IContext {

		/**
		 * 注入追踪信息
		 */
		public injectionTracks: InjectionTrack[];
		protected static appIdsMap: { [appId: string]: any };

		/**
		 * 全局的注入追踪信息（不属于任何一个App)
		 */
		public static globalInjectionTracks: InjectionTrack[] = [];

		public static getApplication(appId: string | number): ApplicationContext {
			return ApplicationContext.appIdsMap[appId];
		}

		public analyser: ApplicationContextAnalyser;

		/**
		 * 释放appID,只在debug模式下有效
		 * @param appId 
		 */
		public static freeAppId(appId: string | number): void {
			if (!riggerIOC.debug) return;
			delete ApplicationContext.appIdsMap[appId];
		}

		/**
		 * 当前自增的appId
		 */
		private static mNowAppId: number = 1;
		/**
		 * 分配一个有效的appId;
		 */
		protected static mallocAppId(): number {
			if (!ApplicationContext.isAppIdValid(ApplicationContext.mNowAppId)) {
				++ApplicationContext.mNowAppId;
				return ApplicationContext.mallocAppId();
			}
			else {
				return ApplicationContext.mNowAppId;
			}

		}

		/**
		 * 检查appID是否有效
		 * @param appId 
		 */
		public static isAppIdValid(appId: string | number): boolean {
			if (!ApplicationContext.appIdsMap) return true;
			return !ApplicationContext.appIdsMap[appId];
		}

		/**
		 * appId
		 */
		public appId: number | string;

		protected get injectionBinder(): ApplicationInjectionBinder {
			if (!this.mInjectionBinder) {
				this.mInjectionBinder = new ApplicationInjectionBinder(this.appId, InjectionBinder.instance, this);
			}
			return this.mInjectionBinder;
		}

		@inject(CommandBinder)
		protected commandBinder: CommandBinder;

		@inject(MediationBinder)
		protected mediationBinder: MediationBinder;

		private modules: any[];
		private modulesInstance: ModuleContext[];

		/**
		 * @param appId 应用ID，如果不传入，则自动生成,必须全局唯一
		 * @param ifStartImmediatly 是否立刻启动应用,默认为true
		 */
		constructor(appId?: string | number, ifLaunchImmediatly: boolean = true) {
			super();
			this.injectionTracks = [];
			this.disposing = false;

			// 分配appId
			if (appId == null || appId == undefined) {
				appId = ApplicationContext.mallocAppId();
			}
			else {
				if (!ApplicationContext.isAppIdValid(appId)) {
					throw new Error(`"${appId}" is not a valid app id.`);
				}
			}
			this.appId = appId;
			if (!ApplicationContext.appIdsMap) ApplicationContext.appIdsMap = {};
			ApplicationContext.appIdsMap[appId] = this;

			if (riggerIOC.debug) {
				this.analyser = new ApplicationContextAnalyser(this);
			}

			// 绑定命令绑定器，默认绑定为SignalCommandBinder
			this.bindCommandBinder();
			this.bindMediationBinder();

			this.onInit();

			if (ifLaunchImmediatly) {
				this.launch();
			}
		}

		launch(): Promise<any> {
			return this.wait();
		}

		/**
		 * 应用模块初始化回调
		 */
		public onInit() {

		}

		// exit(): Promise<any> {
		// 	return 
		// }

		private disposing: boolean = false;
		public async dispose() {
			if (this.disposing) return;
			this.disposing = true;
			if (!riggerIOC.debug) {
				delete ApplicationContext.appIdsMap[this.appId];
			}

			for (var i: number = this.modules.length - 1; i >= 0; --i) {
				this.injectionBinder.unbind(this.modules[i]);
				// let inst: ModuleContext = this.modulesInstance[i];
				// 实例可能比类型少
				// if(inst){
				// 	await inst.dispose();
				// }
			}

			// this.injectionBinder = null;
			this.modules = null;
			this.modulesInstance = null;

			// this.commandBinder.dispose();
			this.commandBinder.dispose();
			this.commandBinder = null;

			this.mediationBinder.dispose();
			this.mediationBinder = null;

			// 清除绑定信息
			if (this.mInjectionBinder) {
				this.mInjectionBinder.dispose();
				this.mInjectionBinder = null
			}

			super.dispose();
		}

		public getInjectionBinder(): InjectionBinder {
			return this.injectionBinder;
		}

		public getCommandBinder(): CommandBinder {
			return this.commandBinder;
		}
		protected mInjectionBinder: ApplicationInjectionBinder = null;

		public getMediationBinder(): MediationBinder {
			return this.mediationBinder;
		}

		protected startTask(...args: any[]): BaseWaitable {
			super.startTask(...args);
			// this.injectionBinder = InjectionBinder.instance;
			// 注入自身
			// this.injectionBinder.bind(ApplicationContext).toValue(this);

			// 绑定用户的注入
			this.bindInjections();
			// 绑定用户的命令
			this.bindCommands();

			this.modules = [];

			// 注册模块
			this.registerModuleContexts();
			// 实例化所有的模块
			this.initializeModuleContexts();

			return this;
		}

		protected async initializeModuleContexts() {
			this.modulesInstance = [];
			let m: ModuleContext;
			for (var i: number = 0; i < this.modules.length; ++i) {
				// 获取模块的绑定类
				let info: InjectionBindInfo = this.injectionBinder.bind(this.modules[i]);
				m = new info.realClass(this);
				this.modulesInstance.push(m);
				info.toValue(m);
				m.start();
				await m.wait();
			}

			this.done();
		}

		protected addModuleContext(contextCls: any): ApplicationContext {
			this.modules.push(contextCls);
			return this;
		}

		abstract bindInjections(): void;

		abstract bindCommands(): void;

		abstract registerModuleContexts(): void;

		protected bindCommandBinder(): void {
			// 绑定 命令绑定器
			this.injectionBinder.bind(CommandBinder).toValue(new SignalCommandBinder(this.injectionBinder));
		}

		protected bindMediationBinder(): void {
			this.injectionBinder.bind(MediationBinder).toValue(new MediationBinder(this.injectionBinder));
		}
	}

	export class ApplicationContextAnalyser {
		public appId: string | number;
		public injectionTracks: InjectionTrack[] = []
		constructor(app: ApplicationContext) {
			this.appId = app.appId;
			this.injectionTracks = app.injectionTracks;
		}

		/**
		 * 分析
		 */
		public analyze(): string {
			// 未释放的
			let stickyInsts = this.stickyInsts;
			let ret = "======= 尚未释放的对象 ======\r\n"
			for (var i: number = 0; i < stickyInsts.length; ++i) {
				ret += stickyInsts[i].toString() + "\r\n";
			}

			ret += "======= 注入时发生了错误的对象 ======\r\n"
			let errorInsts = this.injectErrorInsts;
			if (errorInsts.length > 0) {
				for (var i: number = 0; i < errorInsts.length; ++i) {
					ret += errorInsts[i].toString() + "\r\n";
				}
			}
			else{
				ret += "\r\n"
			}


			ret += "====== 析构时发生错误的对象 =====\r\n"
			errorInsts = this.disposeErrorInsts;
			for (var j: number = 0; j < errorInsts.length; ++j) {
				ret += errorInsts[j].toString() + "\r\n";
			}

			return ret;
		}

		/**
		 * 获取未释放的追踪信息
		 */
		public get stickyInsts(): InjectionTrack[] {
			let ret: InjectionTrack[] = [];
			let total: InjectionTrack[] = this.injectionTracks.concat(ApplicationContext.globalInjectionTracks);
			for (var i: number = 0; i < total.length; ++i) {
				let tempTrack: InjectionTrack = total[i];
				let refCount = riggerIOC.getRefCount(tempTrack.inst);
				if (refCount > 0) {
					ret.push(tempTrack);
				}
			}

			return ret;
		}

		/**
		 * 注入发生错误的实例
		 */
		public get injectErrorInsts(): InjectionTrack[] {
			let ret: InjectionTrack[] = [];
			let total: InjectionTrack[] = this.injectionTracks.concat(ApplicationContext.globalInjectionTracks);
			for (var i: number = 0; i < total.length; ++i) {
				let tempTrack: InjectionTrack = total[i];
				let error: Error = tempTrack.injectError
				if (error) {
					ret.push(tempTrack);
				}
			}

			return ret;
		}

		/**
		 * 析构发生错误的实例
		 */
		public get disposeErrorInsts(): InjectionTrack[] {
			let ret: InjectionTrack[] = [];
			let total: InjectionTrack[] = this.injectionTracks.concat(ApplicationContext.globalInjectionTracks);
			for (var i: number = 0; i < total.length; ++i) {
				let tempTrack: InjectionTrack = total[i];
				let error: Error = tempTrack.disposeError
				if (error) {
					ret.push(tempTrack);
				}
			}

			return ret;
		}

	}
}