module riggerIOC {
    /**
     * 表示结果
     */
    export class Result<ResultType = any, ErrorType = any>{
        result: ResultType;
        error: ErrorType;

        constructor(result: ResultType = null, error: ErrorType = null) {
            this.result = result;
            this.error = error;
        }

        isOk(): boolean {
            return this.error == null || this.error == undefined;
        }

        isFailed(): boolean {
            return !this.isOk();
        }
    }
}