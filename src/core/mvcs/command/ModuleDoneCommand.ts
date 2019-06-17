/**
* name 
*/
/// <reference path = "./WaitableCommand.ts" />
module riggerIOC {
	/**
	 * 模块启动完成的命令
	 */
	export class ModuleDoneCommand extends WaitableCommand {
		constructor() {
			super();
		}

		execute() {
			this.moduleContext && this.moduleContext.done();
			this.done();
		}

		private moduleContext: ModuleContext;
		setModuleContext(moduleContext: ModuleContext) {
			this.moduleContext = moduleContext;
		}

		dispose(): void {
			this.moduleContext = null;		
			super.dispose();	
		}
	}
}