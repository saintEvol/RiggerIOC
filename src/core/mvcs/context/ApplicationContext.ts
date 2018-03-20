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
module riggerIOC{
	export abstract class ApplicationContext implements IContext{
		private injectionBinder:InjectionBinder;

		@inject(CommandBinder)
		private commandBinder:CommandBinder;

		private modules:any[];

		constructor(){
			this.injectionBinder = InjectionBinder.instance;
			// 注入自身
			// this.injectionBinder.bind(ApplicationContext).toValue(this);

			// 绑定命令绑定器，默认绑定为SignalCommandBinder
			this.bindCommandBinder();

			// 绑定用户的注入
			this.bindInjections();
			// 绑定用户的命令
			this.bindCommands();

			this.modules = [];
			// 注册模块
			this.registerModuleContexts();
			// 实例化所有的模块
			this.initializeModuleContexts();
		}

		public dispose(){
			for(var i:number = 0; i < this.modules.length; ++i){
				this.injectionBinder.unbind(this.modules[i]);
			}
			this.injectionBinder = null;
			this.modules = null;
			this.commandBinder = null;
		}

		public getInjectionBinder():InjectionBinder{
			return this.injectionBinder;
		}

		public getCommandBinder():CommandBinder{
			return this.commandBinder;
		}

		protected async initializeModuleContexts(){
			let m:ModuleContext;
			for(var i:number = 0; i < this.modules.length; ++i){
				m = new this.modules[i](this);
				this.injectionBinder.bind(this.modules[i]).toValue(m);
				await waitFor(m);
			}
		}

		protected addModuleContext(contextCls:any):ApplicationContext{
			this.modules.push(contextCls);
			return this;
		}

		abstract bindInjections():void;

		abstract bindCommands():void;

		abstract registerModuleContexts():void;

		protected bindCommandBinder():void{
			// 绑定 命令绑定器，并设置为单例
			this.injectionBinder.bind(CommandBinder).to(SignalCommandBinder).toSingleton();
		}
	}
}