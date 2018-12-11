/**
* 顺序执行器
*/
declare module riggerIOC {
    class TaskExecutor {
        private static readonly pool;
        private static mPool;
        private static readonly _sign;
        /**
         * 所有需要执行的任务
         */
        private mTasks;
        /**
         * 每一个任务执行后的回调
         */
        private mSingleHandlers;
        private mSingleHandlerArgs;
        /**
         * 每一个任务被取消后的回调
         */
        private mSingleCancelHandlers;
        private mSingleCancelHandlerArgs;
        /**
         * 所有任务执行完成后的回调
         */
        private mCompleteHandler;
        private mCompleteHandlerArgs;
        /**
         * 所有任务取消完成后的回调
         */
        private mCancelHandler;
        private mCancelHandlerArgs;
        /**
         * 当前正在执行的任务的游标
         */
        private mCursor;
        /**
         * 异步执行任务时的同步锁(保证所有任务执行完成后才会调用总的回调)
         */
        protected syncLock: TaskExecutorLock;
        /**
         * 异步执行任务时的计时器列表，用于保证每个任务之间的间隔
         */
        private timers;
        constructor();
        /**
         * 创建一个实例
        */
        static create(): TaskExecutor;
        /**
         * 是否正在执行任务
         */
        readonly isRunning: boolean;
        /**
         * 重置
         */
        reset(): TaskExecutor;
        /**
         * 回收
        */
        recover(): void;
        /**
         * 执行任务，如果已经有任务正在执行，则会先打断之前的任务
         * @param ifSingleCallback
         */
        execute(): Promise<any>;
        /**
         * 异步执行
        */
        executeAsync(interval?: number): Promise<any>;
        /**
         *
         * @param ifTotalCallback
         * 如果没有任务正在执行，则调用此接口没有任何效果
         */
        cancel(reason?: any): TaskExecutor;
        /**
         * 析构函数，释放所有资源
         * 析构之前会先调用一次cancel(),打断所有正在执行的任务
        */
        dispose(): void;
        /**
         *
         * @param waitable
         * @param completeHandler
         * @param args
         * @param cancelHandler
         * @param cancelArgs
         */
        add(waitable: BaseWaitable, completeHandler?: Handler, args?: any[], cancelHandler?: Handler, cancelArgs?: any[]): TaskExecutor;
        /**
         * 设置完成时的回调，此回调是在所有执行队列都执行完成后才会回调
         * @param handler 回调
         * @param args 参数
         */
        setCompleteHandler(handler: Handler, args?: any[]): TaskExecutor;
        /**
         * 设置取消时的回调
         * @param handler
         * @param args
         */
        setCancelHandler(handler: Handler, args?: any[]): TaskExecutor;
        private executeSingle;
        private addTimer;
        private clearTimer;
    }
}
