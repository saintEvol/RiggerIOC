/*
 * Copyright 2018 Yang Wu.
 *
 *	Licensed under the Apache License, Version 2.0 (the "License");
 *	you may not use this file except in compliance with the License.
 *	You may obtain a copy of the License at
 *
 *		http://www.apache.org/licenses/LICENSE-2.0
 *
 *		Unless required by applicable law or agreed to in writing, software
 *		distributed under the License is distributed on an "AS IS" BASIS,
 *		WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *		See the License for the specific language governing permissions and
 *		limitations under the License.
 */
/**
* 一个可以使用协程等待的基础实现
* @autoDispose
*/
module riggerIOC {
	@riggerIOC.autoDispose
	export class BaseWaitable implements riggerIOC.IWaitable {
		constructor() {
		}

		/**
		 * 析构，析构时会先执行 cancel以退出执行
		 */
		dispose(): void {
			this.cancel();

			this.mReason = null;
			this.mResult = null;
			this.mDoneCallback = null;
			this.mCanceledCallback = null;
			this.waitingTask = null;
		}

		// protected mContent: T = null;
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
		isWaitting(): boolean {
			return this.waitingTask != null;
		}

		/** 
		 * 开启任务,开启之后，进行等待状态
		*/
		protected startTask(...args): BaseWaitable {
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
			if (this.isWaitting()) return this.waitingTask;
			if (this.mIsDone) return this.mResult;
			if (this.mIsCanceled) return this.mReason;

			this.waitingTask = waitFor(this);
			this.startTask(...args);
			if (!this.waitingTask) {
				// 可能在开始任务时直接就完成了
				if (this.mIsDone) return this.mResult;
				if (this.mIsCanceled) return this.mReason;
			}

			return this.waitingTask;
		}

		/** 
		 * 任务完成
		*/
		done(result = null): void {
			if (this.mIsDone) return;
			if (this.mIsCanceled) return;

			this.mIsDone = true;
			this.mResult = result;

			if (this.mDoneCallback) {
				this.mDoneCallback(result);
				// this.reset();
			}

			this.mDoneCallback = null;
			this.mCanceledCallback = null;
			this.mIsCanceled = false;
			this.waitingTask = null;
		}

		/**
		 * 取消执行
		 * @param reason 
		 */
		cancel(reason = null): void {
			if (this.mIsCanceled) return;
			if (this.mIsDone) return;

			this.mIsCanceled = true;
			this.mReason = reason;

			if (this.mCanceledCallback) {
				this.mCanceledCallback(reason);
				// this.reset();
			}

			this.mCanceledCallback = null;
			this.mDoneCallback = null;
			this.mIsDone = false;
			this.waitingTask = null;
		}

		/**
		 * 重置，使得可以再次使用
		 * 如果正在等待，则重置无效，需要先手动打断
		 */
		reset(): BaseWaitable {
			if(this.isWaitting()) return this;
			
			this.mIsCanceled = false;
			this.mIsDone = false;
			this.mResult = null;
			this.mReason = null;
			this.mCanceledCallback = null;
			this.mDoneCallback = null;
			this.waitingTask = null;

			return this;
		}

		/**
		 * 供框架的协程库调用
		 * @param fun 
		 */
		setDoneCallback(fun: OneParamsAction): void {
			this.mDoneCallback = fun;
		}

		/**
		 * 供框架的协程库调用
		 * 
		 * @param act 
		 */
		setCancelCallback(act: OneParamsAction): void {
			this.mCanceledCallback = act;
		}
	}
}