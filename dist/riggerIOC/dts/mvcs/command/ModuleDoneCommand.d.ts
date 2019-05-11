/// <reference path="WaitableCommand.d.ts" />
/**
* name
*/
declare module riggerIOC {
    /**
     * 模块启动完成的命令
     */
    class ModuleDoneCommand extends WaitableCommand {
        constructor();
        execute(): void;
        private moduleContext;
        setModuleContext(moduleContext: ModuleContext): void;
    }
}
