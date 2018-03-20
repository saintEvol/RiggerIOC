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
	export abstract class ModuleContext implements IContext, IWaitable{
		private applicationContext:ApplicationContext;
		private mIsDone:boolean = false;
		private doneCallback:Function;	

		/**
		 * 模块初始化（启动）完成后的回调命令
		 */	
		protected doneCommand:ModuleDoneCommand;

		constructor(appContext:ApplicationContext){
			this.applicationContext = appContext;

			this.doneCommand = new ModuleDoneCommand();
			this.doneCommand.setModuleContext(this);
			
			this.bindInjections();
			this.bindCommands();
			this.bindMediators();
		}

		dispose(){
			this.applicationContext = null;
		}

		public get injectionBinder():InjectionBinder{
			return this.getInjectionBinder();
		}

		public get commandBinder():CommandBinder{
			return this.getCommandBinder();
		}

		/**
		 * 获取注入绑定器
		 */
		public getInjectionBinder():InjectionBinder{
			return this.applicationContext.getInjectionBinder();
		}

		/**
		 * 获取命令绑定器
		 */
		public getCommandBinder():CommandBinder{
			return this.applicationContext.getCommandBinder();
		}

		public isDone():boolean{
			return this.mIsDone;
		}
		
		public done(){
			this.mIsDone = true;
			this.doneCallback && this.doneCallback();
		}

		public setDoneCallback(f:Function):void{
			this.doneCallback= f;
		}

		abstract bindInjections():void;
		abstract bindCommands():void;
		abstract bindMediators():void;

	}
}