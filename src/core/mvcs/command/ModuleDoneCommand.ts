/**
* name 
*/
module riggerIOC{
	/**
	 * 模块启动完成的命令
	 */
	export class ModuleDoneCommand extends Command{
		constructor(){
			super();
		}

		execute(){
			this.moduleContext && this.moduleContext.done();
		}

		private moduleContext:ModuleContext;
		setModuleContext(moduleContext:ModuleContext){
			this.moduleContext = moduleContext;
		}
	}
}