declare module riggerIOC {
    /**
     * 应用上下文，表示一个应用
     * 可以等待应用启动完成
     */
    abstract class ApplicationContext extends BaseWaitable implements IContext {
        protected static appIdsMap: {
            [appId: string]: any;
        };
        /**
         * 当前自增的appId
         */
        private static mNowAppId;
        /**
         * 分配一个有效的appId;
         */
        protected static mallocAppId(): number;
        /**
         * 检查appID是否有效
         * @param appId
         */
        static isAppIdValid(appId: string | number): boolean;
        /**
         * appId
         */
        protected appId: number | string;
        protected readonly injectionBinder: InjectionBinder;
        protected commandBinder: CommandBinder;
        protected mediationBinder: MediationBinder;
        private modules;
        /**
         *
         * @param ifStartImmediatly 是否立刻启动应用,默认为true
         * @param appId 应用ID，如果不传入，则自动生成,必须全局唯一
         */
        constructor(appId?: string | number, ifLaunchImmediatly?: boolean);
        launch(): Promise<any>;
        dispose(): void;
        getInjectionBinder(): InjectionBinder;
        getCommandBinder(): CommandBinder;
        getMediationBinder(): MediationBinder;
        protected startTask(...args: any[]): BaseWaitable;
        protected initializeModuleContexts(): Promise<void>;
        protected addModuleContext(contextCls: any): ApplicationContext;
        abstract bindInjections(): void;
        abstract bindCommands(): void;
        abstract registerModuleContexts(): void;
        protected bindCommandBinder(): void;
        protected bindMediationBinder(): void;
    }
}
