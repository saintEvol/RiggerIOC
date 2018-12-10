/// <reference path="../../coroutine/BaseWaitable.d.ts" />
declare module riggerIOC {
    /**
     * 模块上下文
     * 模块上下文初始化（启动）完成后，需要通过以下语句显式（在onStart）通知：
     * 		this.doneCommand.execute()
     * 或
     * 		this.done()
    */
    abstract class ModuleContext extends BaseWaitable implements IContext {
        private applicationContext;
        /**
         * 模块初始化（启动）完成后的回调命令
         * 在上下文启动完成后，可以通过执行此命令通知框架
         */
        protected doneCommand: ModuleDoneCommand;
        constructor(appContext: ApplicationContext);
        dispose(): void;
        /**
         * 绑定注入
         */
        abstract bindInjections(): void;
        /**
         * 绑定命令
         */
        abstract bindCommands(): void;
        /**
         * 绑定界面与Mediator
         */
        abstract bindMediators(): void;
        /**
         * 模块启动时的回调
         */
        protected abstract onStart(): void;
        readonly injectionBinder: InjectionBinder;
        readonly commandBinder: CommandBinder;
        readonly mediationBinder: MediationBinder;
        /**
         * 获取注入绑定器
         */
        getInjectionBinder(): InjectionBinder;
        /**
         * 获取命令绑定器
         */
        getCommandBinder(): CommandBinder;
        getMediationBinder(): MediationBinder;
        start(): void;
    }
}
