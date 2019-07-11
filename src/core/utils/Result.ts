module riggerIOC {
    /**
     * 表示结果
     */
    export class Result<ResultType = any, ErrorType = any>{
        /**
         * 执行结果
         */
        result: ResultType;

        /**
         * 失败或打断原因，同 error
         */
        public get reason(): ErrorType{
            return this.error;
        }

        /**
         * 失败或打断原因
         */
        error: ErrorType;

        constructor(result: ResultType = null, error: ErrorType = null) {
            this.result = result;
            this.error = error;
        }

        get isOk(): boolean {
            return this.error == null || this.error == undefined;
        }

        get isFailed(): boolean {
            return !this.isOk;
        }
    }
}