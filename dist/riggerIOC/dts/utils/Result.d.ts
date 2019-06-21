declare module riggerIOC {
    /**
     * 表示结果
     */
    class Result<T = any, M = any> {
        result: T;
        error: M;
        constructor(result?: T, error?: M);
        isOk(): boolean;
        isFailed(): boolean;
    }
}
