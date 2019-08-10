/**
* 一个可以使用协程等待的基础实现
* @autoDispose
*/
declare module riggerIOC {
    class BaseWaitable implements riggerIOC.IWaitable {
        constructor();
        /**
         * 析构，析构时会先执行 cancel以退出执行
         */
        dispose(): void;
        protected mIsDone: boolean;
        protected mResult: any;
        protected mDoneCallback: OneParamsAction;
        protected mIsCanceled: boolean;
        protected mReason: any;
        protected mCanceledCallback: OneParamsAction;
        protected waitingTask: Promise<any>;
        /**
         * 任务是否已经完成
        */
        isDone(): boolean;
        /**
         * 是否取消了
        */
        isCanceled(): boolean;
        /**
         * 是否正在等待
        */
        isWaitting(): boolean;
        /**
         * 开启任务,开启之后，进行等待状态
        */
        protected startTask(...args: any[]): BaseWaitable;
        getResult(): any;
        getReason(): any;
        /**
         * 等待任务完成
         * @param args
         */
        wait(...args: any[]): Promise<any>;
        /**
         * 任务完成
        */
        done(result?: any): void;
        /**
         * 取消执行
         * @param reason
         */
        cancel(reason?: any): void;
        /**
         * 重置，使得可以再次使用
         * 如果正在等待，则重置无效，需要先手动打断
         */
        reset(): BaseWaitable;
        /**
         * 供框架的协程库调用
         * @param fun
         */
        setDoneCallback(fun: OneParamsAction): void;
        /**
         * 供框架的协程库调用
         *
         * @param act
         */
        setCancelCallback(act: OneParamsAction): void;
    }
}
