/**
* name
*/
declare module riggerIOC {
    /**
     * 模块启动完成的命令
     */
    class ModuleDoneCommand extends Command {
        constructor();
        execute(): void;
        private moduleContext;
        setModuleContext(moduleContext: ModuleContext): void;
    }
}
