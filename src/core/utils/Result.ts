module riggerIOC {
    /**
     * 表示结果
     */
    export class Result<T = any, M = any>{
        result: T;
        error: M;

        constructor(result: T = null, error: M = null) {
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