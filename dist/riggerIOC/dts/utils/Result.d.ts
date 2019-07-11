declare module riggerIOC {
    /**
     * 表示结果
     */
    class Result<ResultType = any, ErrorType = any> {
        /**
         * 执行结果
         */
        result: ResultType;
        /**
         * 失败或打断原因，同 error
         */
        readonly reason: ErrorType;
        /**
         * 失败或打断原因
         */
        error: ErrorType;
        constructor(result?: ResultType, error?: ErrorType);
        readonly isOk: boolean;
        readonly isFailed: boolean;
    }
}
