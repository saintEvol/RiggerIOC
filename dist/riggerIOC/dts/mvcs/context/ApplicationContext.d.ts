declare module riggerIOC {
    /**
     * 应用上下文，表示一个应用
     * 可以等待应用启动完成
     */
    abstract class ApplicationContext extends BaseWaitable implements IContext {
        /**
         * 注入追踪信息
         */
        injectionTracks: InjectionTrack[];
        protected static appIdsMap: {
            [appId: string]: any;
        };
        /**
         * 全局的注入追踪信息（不属于任何一个App)
         */
        static globalInjectionTracks: InjectionTrack[];
        static getApplication(appId: string | number): ApplicationContext;
        analyser: ApplicationContextAnalyser;
        /**
         * 释放appID,只在debug模式下有效
         * @param appId
         */
        static freeAppId(appId: string | number): void;
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
        private disposing;
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
    class AnalyseResult {
        stickInsts: InjectionTrack[];
        instsWithInjectionError: InjectionTrack[];
        instsWithDisposeError: InjectionTrack[];
        analyseReport: string;
    }
    class ApplicationContextAnalyser {
        appId: string | number;
        injectionTracks: InjectionTrack[];
        constructor(app: ApplicationContext);
        /**
         * 分析
         */
        analyze(): AnalyseResult;
        /**
         * 获取未释放的追踪信息
         */
        readonly stickyInsts: InjectionTrack[];
        /**
         * 注入发生错误的实例
         */
        readonly injectErrorInsts: InjectionTrack[];
        /**
         * 析构发生错误的实例
         */
        readonly disposeErrorInsts: InjectionTrack[];
    }
}
