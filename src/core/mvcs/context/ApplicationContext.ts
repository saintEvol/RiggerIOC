/**
* 整个应用的上下文
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

		protected initializeModuleContexts(){
			for(var i:number = 0; i < this.modules.length; ++i){
				this.injectionBinder.bind(this.modules[i]).toValue(new this.modules[i](this));
			}
		}

		protected addModuleContext(contextCls:any){
			this.modules.push(contextCls);
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