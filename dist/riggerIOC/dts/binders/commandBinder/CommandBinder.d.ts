declare module riggerIOC {
    abstract class CommandBinder {
        constructor(injectionBinder: InjectionBinder);
        /**
         * 注入绑定器
         */
        protected injectionBinder: InjectionBinder;
        protected bindInfos: CommandBindInfo[];
        abstract bind(cls: any): CommandBindInfo;
        abstract unbind(cls: any): void;
        dispose(): void;
    }
}
