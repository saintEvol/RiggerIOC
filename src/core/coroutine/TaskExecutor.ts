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
* 任务执行器
*/
/// 
module riggerIOC {
	export class TaskExecutor {
		private static get pool(): Pool {
			if (!this.mPool) this.mPool = new Pool();
			return this.mPool;
		}
		private static mPool: Pool
		private static readonly _sign: string = "_sign_sequent_executor";

		/**
		 * 所有需要执行的任务
		 */
		private mTasks: BaseWaitable[] = [];

		/**
		 * 每一个任务执行后的回调
		 */
		private mSingleHandlers: riggerIOC.Handler[] = [];
		private mSingleHandlerArgs: any[] = [];

		/**
		 * 每一个任务被取消后的回调
		 */
		private mSingleCancelHandlers: riggerIOC.Handler[] = [];
		private mSingleCancelHandlerArgs: any[] = [];

		/**
		 * 所有任务执行完成后的回调
		 */
		private mCompleteHandler: riggerIOC.Handler = null;
		private mCompleteHandlerArgs: any[] = [];

		/**
		 * 所有任务取消完成后的回调
		 */
		private mCancelHandler: riggerIOC.Handler = null;
		private mCancelHandlerArgs: any[] = [];

		/**
		 * 当前正在执行的任务的游标 
		 */
		private mCursor: number = -1;

		/**
		 * 异步执行任务时的同步锁(保证所有任务执行完成后才会调用总的回调)
		 */
		protected syncLock: TaskExecutorLock = null;

		/**
		 * 异步执行任务时的计时器列表，用于保证每个任务之间的间隔
		 */
		private timers: {} = null;

		constructor() {
		}

		/** 
		 * 创建一个实例
		*/
		public static create(): TaskExecutor {
			return TaskExecutor.pool.getItemByClass<TaskExecutor>(TaskExecutor._sign,
				TaskExecutor)
		}

		/**
		 * 是否正在执行任务
		 */
		public get isRunning(): boolean {
			return this.mCursor >= 0 || this.syncLock != null;
		}

		/**
		 * 重置
		 */
		public reset(): TaskExecutor {
			this.dispose();
			return this;
		}

		/** 
		 * 回收
		*/
		public recover(): void {
			this.reset();
			TaskExecutor.pool.recover(TaskExecutor._sign, this);
		}

		/**
		 * 执行任务，如果已经有任务正在执行，则会先打断之前的任务
		 * @param ifSingleCallback 
		 */
		public async execute(): Promise<any> {
			if (!this.isRunning) {
				let executors: BaseWaitable[] = this.mTasks;
				let singleArgs: any[] = this.mSingleHandlerArgs;
				let singleHandlers: Handler[] = this.mSingleHandlers;
				let cancelHandlers: Handler[] = this.mSingleCancelHandlers;
				let cancelArgs: any[] = this.mSingleCancelHandlerArgs;
				this.mCursor = 0;
				// let tempCursor: number = this.mCursor;

				let canceled: boolean = false;
				let cancelReason: any = null;
				for (; this.mCursor < executors.length; ++this.mCursor) {
					// executors[this.mCursor].execute();
					try {
						let ret = await executors[this.mCursor].wait();
						singleHandlers[this.mCursor]
							&& singleHandlers[this.mCursor].runWith([].concat(singleArgs[this.mCursor], ret));
					} catch (reason) {
						canceled = true;
						cancelReason = reason;

						cancelHandlers[this.mCursor]
							&& cancelHandlers[this.mCursor].runWith([].concat(cancelArgs[this.mCursor], reason));

						break;
					}
				}

				// 执行后面未执行任务的取消回调
				if (canceled) {
					for (var i: number = this.mCursor + 1; i < this.mSingleCancelHandlers.length; ++i) {
						this.mSingleCancelHandlers[i]
							&& this.mSingleCancelHandlers[i].runWith([].concat(this.mSingleCancelHandlerArgs[i], cancelReason));
					}

					this.mCancelHandler
						&& this.mCancelHandler.runWith([].concat(this.mCancelHandlerArgs, cancelReason));
				}
				else {
					this.mCompleteHandler && this.mCompleteHandler.runWith(this.mCompleteHandlerArgs)
				}

				// 游标归位
				this.mCursor = -1;
			}
			// 如果已经在执行了			
			else {
				this.cancel();
				await this.execute()
			}

		}

		/** 
		 * 异步执行
		*/
		public async executeAsync(interval: number = null): Promise<any> {
			if (!this.isRunning) {
				if (interval == null || interval == undefined || interval < 0) interval = 0;

				this.syncLock = new TaskExecutorLock(this.mTasks.length);
				let totalWait = this.syncLock.wait();
				this.mCursor = 0;

				for (; this.mCursor < this.mTasks.length; ++this.mCursor) {
					this.executeSingle(this.mCursor, this.mCursor * interval);
					// ++realTaskNum;
				}

				try {
					await totalWait;
					this.mCompleteHandler && this.mCompleteHandler.runWith(this.mCompleteHandlerArgs);
				} catch (error) {
					this.mCancelHandler && this.mCancelHandler.runWith(this.mCancelHandlerArgs);
				}

				// 清除计时器
				this.clearTimer();

				this.syncLock.dispose();
				this.syncLock = null;
				this.mCursor = -1;
			}
			else {
				this.cancel();
				await this.executeAsync(interval);
			}
		}


		/**
		 * 
		 * @param ifTotalCallback 
		 * 如果没有任务正在执行，则调用此接口没有任何效果
		 */
		public cancel(reason = null): TaskExecutor {
			if (!this.isRunning) return;
			if (this.syncLock) {
				for (var i: number = 0; i < this.mTasks.length; ++i) {
					this.mTasks[i].cancel(reason);
				}
				if(this.timers){
					for(var k in this.timers){
						this.timers[k].cancel(reason);
					}
					this.timers = null;
				}

			}
			else {
				this.mTasks[this.mCursor].cancel(reason);
			}

			return this;
		}

		/** 
		 * 析构函数，释放所有资源
		 * 析构之前会先调用一次cancel(),打断所有正在执行的任务
		*/
		public dispose() {
			this.cancel();

			// this.mCompleteHandler && this.mCompleteHandler.recover();
			this.mCompleteHandler = null;
			this.mCompleteHandlerArgs = [];

			// this.mCancelHandler && this.mCancelHandler.recover();
			this.mCancelHandler = null;
			this.mCancelHandlerArgs = [];

			// 回收
			// this.mTasks.forEach(exe => exe.dispose());
			this.mTasks = [];

			// this.mSingleHandlers.forEach((handler) => handler.recover());
			this.mSingleHandlers = [];
			this.mSingleHandlerArgs = [];

			// this.mSingleCancelHandlers.forEach(Handler => Handler.recover());
			this.mSingleCancelHandlers = [];
			this.mSingleCancelHandlerArgs = [];

			this.syncLock && this.syncLock.dispose();
			this.syncLock = null;

			this.clearTimer();
		}

		/**
		 * 
		 * @param waitable 
		 * @param completeHandler 
		 * @param args 
		 * @param cancelHandler 
		 * @param cancelArgs 
		 */
		public add(waitable: BaseWaitable, completeHandler: Handler = null, args: any[] = [],
			cancelHandler: Handler = null, cancelArgs: any[] = []): TaskExecutor {
			this.mTasks.push(waitable);

			this.mSingleHandlers.push(completeHandler);
			this.mSingleHandlerArgs.push(args);

			this.mSingleCancelHandlers.push(cancelHandler);
			this.mSingleCancelHandlerArgs.push(cancelArgs);

			return this;
		}

		/**
		 * 设置完成时的回调，此回调是在所有执行队列都执行完成后才会回调
		 * @param handler 回调
		 * @param args 参数
		 */
		public setCompleteHandler(handler: Handler, args: any[] = []): TaskExecutor {
			// this.mCompleteHandler && this.mCompleteHandler.recover();
			this.mCompleteHandler = handler;

			this.mCompleteHandlerArgs = args;

			return this;
		}

		/**
		 * 设置取消时的回调
		 * @param handler 
		 * @param args 
		 */
		public setCancelHandler(handler: Handler, args: any[] = []): TaskExecutor {
			// this.mCancelHandler && this.mCancelHandler.recover();
			this.mCancelHandler = handler;
			this.mCancelHandlerArgs = args

			return this;
		}

		private async executeSingle(idx: number, delay: number): Promise<any> {
			let cancel: riggerIOC.Handler = this.mSingleCancelHandlers[idx];
			let cancelArgs = this.mSingleCancelHandlerArgs[idx];

			if (delay > 0) {
				try {
					let timer: WaitForTime = this.addTimer(idx);
					await timer.forMSeconds(delay).wait();
					timer = null;
				} catch (reason) {
					cancel.runWith([].concat(cancelArgs, reason));
					this.syncLock.cancel();
					return;
				}
			}

			if (idx < 0 || idx >= this.mTasks.length) return;
			let exe: BaseWaitable = this.mTasks[idx];
			let handler: riggerIOC.Handler = this.mSingleHandlers[idx];
			let args = this.mSingleCancelHandlerArgs[idx];

			try {
				let ret = await exe.wait();
				handler && handler.runWith([].concat(args, ret));
				this.syncLock.done();
			} catch (reason) {
				cancel && cancel.runWith([].concat(cancelArgs, reason));
				this.syncLock.cancel();
			}
		}

		private addTimer(idx: number): WaitForTime {
			let timer: WaitForTime = new WaitForTime();
			if (!this.timers) this.timers = {};
			this.timers[idx] = timer;
			return timer;
		}

		private clearTimer():void{
			if(!this.timers) return;
			for(var k in this.timers){
				// console.log("k in timer:" + k);
				this.timers[k].dispose();
				this.timers[k] = null;
				delete this.timers[k];
			}

			this.timers = null;
		}
	}
}