/**
* name 
*/
module riggerIOC{
	export abstract class ModuleContext implements IContext{
		private applicationContext:ApplicationContext;

		constructor(appContext:ApplicationContext){
			this.applicationContext = appContext;

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

		abstract bindInjections():void;
		abstract bindCommands():void;
		abstract bindMediators():void;

	}
}