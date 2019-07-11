declare module riggerIOC {
    /**
     * 表示结果
     */
    class Result<ResultType = any, ErrorType = any> {
        result: ResultType;
        error: ErrorType;
        constructor(result?: ResultType, error?: ErrorType);
        isOk(): boolean;
        isFailed(): boolean;
    }
}
