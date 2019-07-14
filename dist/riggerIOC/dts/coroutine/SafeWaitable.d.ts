declare module riggerIOC {
    /**
     * 一个可以安全打断的可等待类型
     * 此类型的可等待对象，在正常执行或被打断时都返回一个 Result<T, M>类型的对象
     */
    class SafeWaitable<ResultType = any, ErrorType = any> extends BaseWaitable {
        done(reason?: ResultType): void;
        cancel(reason?: ErrorType): void;
        wait(...args: any[]): Promise<Result<ResultType, ErrorType>>;
        /**
         * 获取原因(打断,出错等)
         */
        getReason(): ErrorType;
        /**
         * 获取结果
         */
        getResult(): ResultType;
    }
}
