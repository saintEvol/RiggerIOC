/**
* 一个可以使用协程等待的基类
*/
module riggerIOC {
	export class BaseWaitable implements riggerIOC.IWaitable {
		constructor() {
		}

		protected mIsDone: boolean = true;
		protected mCallback: Function;

		public reset(): IWaitable {
			this.mIsDone = true;
			this.mCallback = null;

			return this;
		}

		/** 
		 * 任务是否已经完成
		*/
		isDone(): boolean {
			return this.mIsDone;
		}

		/** 
		 * 开启任务,开启之后，进行等待状态
		*/
		startTask(): BaseWaitable {
			if (!this.mIsDone) return;
			this.mIsDone = false;

			return this;
		}

		/**
		 * 等待任务完成
		 * @param args 
		 */
		wait(...args): Promise<any> {
			return waitFor(this);
		}

		/** 
		 * 任务完成
		*/
		done(): void {
			this.mIsDone = true;
			this.mCallback && this.mCallback();
			// this.reset();
			this.mCallback = null;
		}

		setDoneCallback(fun: Function): void {
			this.mCallback = fun;
		}
	}
}