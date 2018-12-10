declare module riggerIOC {
    abstract class ApplicationContext implements IContext {
        protected readonly injectionBinder: InjectionBinder;
        protected commandBinder: CommandBinder;
        protected mediationBinder: MediationBinder;
        private modules;
        constructor();
        dispose(): void;
        getInjectionBinder(): InjectionBinder;
        getCommandBinder(): CommandBinder;
        getMediationBinder(): MediationBinder;
        protected initializeModuleContexts(): Promise<void>;
        protected addModuleContext(contextCls: any): ApplicationContext;
        abstract bindInjections(): void;
        abstract bindCommands(): void;
        abstract registerModuleContexts(): void;
        protected bindCommandBinder(): void;
        protected bindMediationBinder(): void;
    }
}
