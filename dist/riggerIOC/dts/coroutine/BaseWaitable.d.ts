/**
* 一个可以使用协程等待的基类
*/
declare module riggerIOC {
    class BaseWaitable implements riggerIOC.IWaitable {
        constructor();
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
        cancel(reason?: any): void;
        reset(): BaseWaitable;
        setDoneCallback(fun: OneParamsAction): void;
        setCancelCallback(act: OneParamsAction): void;
    }
}
