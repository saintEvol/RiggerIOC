declare module riggerIOC {
    interface IContext {
        getInjectionBinder(): InjectionBinder;
        getCommandBinder(): CommandBinder;
        bindInjections(): void;
        bindCommands(): void;
        dispose(): void;
    }
}
