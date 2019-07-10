declare module riggerIOC {
    class InjectionStatistics {
        constructor(id: string | number, owner?: any, fromConstructor?: any, toConstructor?: any);
        dispose(): void;
        id: string | number;
        owner: any;
        fromConstructor: any;
        toConstructor: any;
    }
    /**
     * 应用上下文，表示一个应用
     * 可以等待应用启动完成
     */
    abstract class ApplicationContext extends BaseWaitable implements IContext {
        /**
         * 是否开启debug，开启debug后会开启很多调试信息
         */
        static debug: boolean;
        private static mDebug;
        injectionStatistics: {
            [id: string]: InjectionStatistics[];
        };
        protected static appIdsMap: {
            [appId: string]: any;
        };
        static getApplication(appId: string | number): ApplicationContext;
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
        appId: number | string;
        protected readonly injectionBinder: ApplicationInjectionBinder;
        protected commandBinder: CommandBinder;
        protected mediationBinder: MediationBinder;
        private modules;
        private modulesInstance;
        /**
         * @param appId 应用ID，如果不传入，则自动生成,必须全局唯一
         * @param ifStartImmediatly 是否立刻启动应用,默认为true
         */
        constructor(appId?: string | number, ifLaunchImmediatly?: boolean);
        launch(): Promise<any>;
        /**
         * 应用模块初始化回调
         */
        onInit(): void;
        dispose(): Promise<void>;
        getInjectionBinder(): InjectionBinder;
        getCommandBinder(): CommandBinder;
        protected mInjectionBinder: ApplicationInjectionBinder;
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
