/**
* name
*/
declare module riggerIOC {
    interface IWaitable {
        reset(): IWaitable;
        /**
         * 是否已经执行完成
        */
        isDone(): boolean;
        /**
         * 是否中断了
         */
        isCanceled(): boolean;
        /**
         * 获取执行结果
        */
        getResult(): any;
        /**
         * 获取中断原因
        */
        getReason(): any;
        /**
         * 指示自己已经完成
        */
        done(result?: any): void;
        /**
         * 退出
        */
        cancel(reason?: any): void;
        /**
         * 设置完成后的回调
         * @param fun
         */
        setDoneCallback(fun: Action): void;
        /**
         * 设置中断的回调
         * @param fun
         */
        setCancelCallback(fun: Action): void;
    }
}
