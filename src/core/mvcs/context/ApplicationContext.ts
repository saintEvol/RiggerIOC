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
	/**
	 * 应用上下文，表示一个应用
	 * 可以等待应用启动完成
	 */
	export abstract class ApplicationContext extends BaseWaitable implements IContext {
		protected static appIdsMap: { [appId: string]: any };
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
		protected appId: number | string;

		protected get injectionBinder(): InjectionBinder {
			return InjectionBinder.instance;
		}

		@inject(CommandBinder)
		protected commandBinder: CommandBinder;

		@inject(MediationBinder)
		protected mediationBinder: MediationBinder;

		private modules: any[];
		private modulesInstance: ModuleContext[];

		/**
		 * 
		 * @param ifStartImmediatly 是否立刻启动应用,默认为true
		 * @param appId 应用ID，如果不传入，则自动生成,必须全局唯一
		 */
		constructor(appId?: string | number,  ifLaunchImmediatly: boolean = true) {
			super();

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
			ApplicationContext.appIdsMap[appId] = true;

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

		public async dispose() {
			for (var i: number = this.modules.length - 1; i >= 0; --i) {
				this.injectionBinder.unbind(this.modules[i]);
				await this.modulesInstance[i].dispose();
			}

			// this.injectionBinder = null;
			this.modules = null;
			this.modulesInstance = null;

			this.commandBinder = null;
			this.mediationBinder = null;
		}

		public getInjectionBinder(): InjectionBinder {
			return this.injectionBinder;
		}

		public getCommandBinder(): CommandBinder {
			return this.commandBinder;
		}

		public getMediationBinder(): MediationBinder {
			return this.mediationBinder;
		}

		protected startTask(...args: any[]): BaseWaitable {
			super.startTask(...args);
			// this.injectionBinder = InjectionBinder.instance;
			// 注入自身
			// this.injectionBinder.bind(ApplicationContext).toValue(this);

			// 绑定命令绑定器，默认绑定为SignalCommandBinder
			this.bindCommandBinder();
			this.bindMediationBinder();

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
			// 绑定 命令绑定器，并设置为单例
			this.injectionBinder.bind(CommandBinder).to(SignalCommandBinder).toSingleton();
		}

		protected bindMediationBinder(): void {
			this.injectionBinder.bind(MediationBinder).toSingleton();
		}
	}
}