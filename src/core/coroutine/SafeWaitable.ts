module riggerIOC {
    /**
     * 一个可以安全打断的可等类型
     * 此类型的可等待对象，在正常执行或被打断时都返回一个 Result<T, M>类型的对象
     */
    export class SafeWaitable<ResultType = any, ErrorType = any> extends BaseWaitable {
        done(reason: ResultType = null): void {
            if (this.mIsCanceled) return;
            if (this.mIsDone) return;

            this.mIsDone = true;

            // 执行结果
            let result: Result<ResultType, ErrorType> = new Result();
            result.result = reason;
            this.mResult = result;

            if (this.mDoneCallback) {
                this.mDoneCallback(this.mResult);
            }

            this.mCanceledCallback = null;
            this.mDoneCallback = null;
            this.mIsCanceled = false;
            this.waitingTask = null;
        }

        cancel(reason: ErrorType = null): void {
            if (this.mIsCanceled) return;
            if (this.mIsDone) return;

            this.mIsCanceled = true;

            let result: Result<ResultType, ErrorType> = new Result();
            if (reason == null || reason == undefined) {
                result.error = <any>(new Error());
            }
            else {
                result.error = reason;
            }
            this.mReason = result;

            if (this.mDoneCallback) {
                this.mDoneCallback(this.mReason);
            }

            this.mCanceledCallback = null;
            this.mDoneCallback = null;
            this.mIsDone = false;
            this.waitingTask = null;
        }

        wait(...args: any[]): Promise<Result<ResultType, ErrorType>> {
            return super.wait(...args);
        }
    }
}