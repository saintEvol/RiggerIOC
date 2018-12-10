/**
* 一个可以使用协程等待的基类
*/
module riggerIOC {
	export class BaseWaitable<T = null> implements riggerIOC.IWaitable {
		constructor(content: T = null) {
			this.mContent = content;
		}

		dispose(): void {
			this.mContent = null;
			this.mReason = null;
			this.mResult = null;
			this.mDoneCallback = null;
			this.mCanceledCallback = null;
			this.waitingTask = null;
		}

		protected mContent: T = null;
		protected mIsDone: boolean = false;
		protected mResult: any = null;
		protected mDoneCallback: OneParamsAction;


		protected mIsCanceled: boolean = false;
		protected mReason: any = null;
		protected mCanceledCallback: OneParamsAction

		protected waitingTask: Promise<any> = null;

		/** 
		 * 任务是否已经完成
		*/
		isDone(): boolean {
			return this.mIsDone;
		}

		/** 
		 * 是否取消了
		*/
		isCanceled(): boolean {
			return this.mIsCanceled;
		}

		/** 
		 * 是否正在等待
		*/
		isWaitting(): boolean{
			return this.waitingTask != null;
		}

		/** 
		 * 开启任务,开启之后，进行等待状态
		*/
		protected startTask(...args): BaseWaitable<T> {
			this.mIsDone = false;
			this.mIsCanceled = false;
			this.mResult = null;
			this.mReason = null;

			return this;
		}

		getResult(): any {
			return this.mResult;
		}

		getReason(): any {
			return this.mReason;
		}

		/**
		 * 等待任务完成
		 * @param args 
		 */
		wait(...args): Promise<any> {
			if(this.isWaitting()) return this.waitingTask;
			if (this.mIsDone) return this.mResult;
			if (this.mIsCanceled) return this.mReason;

			this.waitingTask = waitFor(this.startTask());
			return this.waitingTask;
		}

		/** 
		 * 任务完成
		*/
		done(result = null): void {
			this.mIsDone = true;
			this.mResult = result;

			if(this.mDoneCallback){
				this.mDoneCallback(result);
				this.reset();
			}

			this.mDoneCallback = null;
			this.mCanceledCallback = null;
			this.mIsCanceled = false;
			this.waitingTask = null;
		}

		cancel(reason = null): void {
			this.mIsCanceled = true;
			this.mReason = reason;

			if(this.mCanceledCallback){
				this.mCanceledCallback(reason);
				this.reset();
			}

			this.mCanceledCallback = null;
			this.mDoneCallback = null;
			this.mIsDone = false;
			this.waitingTask = null;
		}

		reset():BaseWaitable<T>{
			this.mIsCanceled = false;
			this.mIsDone = false;
			this.mResult = null;
			this.mReason = null;

			return this;
		}

		setDoneCallback(fun: OneParamsAction): void {
			this.mDoneCallback = fun;
		}

		setCancelCallback(act: OneParamsAction): void {
			this.mCanceledCallback = act;
		}
	}
}