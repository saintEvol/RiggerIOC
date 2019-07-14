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
///<reference path = "../../coroutine/BaseWaitable.ts" />
module riggerIOC {
	/** 
	 * 模块上下文
	 * 模块上下文初始化（启动）完成后，需要通过以下语句显式（在onStart）通知：
	 * 		this.doneCommand.execute()
	 * 或
	 * 		this.done()
	*/
	@riggerIOC.autoDispose
	export abstract class ModuleContext extends BaseWaitable implements IContext {
		protected applicationContext: ApplicationContext;

		/**
		 * 模块初始化（启动）完成后的回调命令
		 * 在上下文启动完成后，可以通过执行此命令通知框架
		 */
		protected doneCommand: ModuleDoneCommand;

		constructor(appContext: ApplicationContext) {
			super();
			this.applicationContext = appContext;

			this.doneCommand = new ModuleDoneCommand();
			this.doneCommand.setModuleContext(this);

			this.bindInjections();
			this.bindCommands();
			this.bindMediators();

			this.onInit();
		}

		/**
		 * 各种注入完成之后调用，模块生命周期内只调用一次
		 */
		onInit(): void {

		}

		dispose() {
			this.doneCommand.dispose();
			this.doneCommand = null;
			// 
			// if(this.mInjectionBinder){
			// 	this.mInjectionBinder.dispose();
			// 	this.mInjectionBinder = null;
			// }
			this.applicationContext = null;
			super.dispose();
		}

		/**
		 * 绑定注入
		 */
		abstract bindInjections(): void;

		/**
		 * 绑定命令
		 */
		abstract bindCommands(): void;

		/**
		 * 绑定界面与Mediator
		 */
		abstract bindMediators(): void;

		/**
		 * 模块启动时的回调
		 */
		protected abstract onStart(): void;

		public get injectionBinder(): ApplicationInjectionBinder {
			// if(!this.mInjectionBinder){
			// 	this.mInjectionBinder = new ApplicationInjectionBinder(this.applicationContext.appId, this.applicationContext.getInjectionBinder(), this)
			// }
			// return this.mInjectionBinder;
			return this.applicationContext.getInjectionBinder() as ApplicationInjectionBinder;
		}
		// protected mInjectionBinder: ApplicationInjectionBinder = null;

		public get commandBinder(): CommandBinder {
			return this.getCommandBinder();
		}

		public get mediationBinder(): MediationBinder {
			return this.getMediationBinder();
		}

		/**
		 * 获取注入绑定器
		 */
		public getInjectionBinder(): InjectionBinder {
			return this.injectionBinder;
		}

		/**
		 * 获取命令绑定器
		 */
		public getCommandBinder(): CommandBinder {
			return this.applicationContext.getCommandBinder();
		}

		public getMediationBinder(): MediationBinder {
			return this.applicationContext.getMediationBinder();
		}

		public start(): void {
			super.startTask();
			this.onStart();
		}
	}
}