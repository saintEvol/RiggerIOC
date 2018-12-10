/**
* 顺序执行器
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
		private mTasks: BaseWaitable<any>[] = [];

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
		private mcancelHandlerArgs: any[] = [];

		/**
		 * 当前正在执行的任务的游标 
		 */
		private mCursor: number = -1;

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
			return this.mCursor >= 0;
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
				let executors: BaseWaitable<any>[] = this.mTasks;
				let singleArgs: any[] = this.mSingleHandlerArgs;
				let singleHandlers: Handler[] = this.mSingleHandlers;
				let cancelHandlers: Handler[] = this.mSingleCancelHandlers;
				let cancelArgs: any[] = this.mSingleCancelHandlerArgs;
				this.mCursor = 0;
				let tempCursor: number = this.mCursor;

				for (; this.mCursor < executors.length; ++this.mCursor, tempCursor = this.mCursor) {
					// executors[this.mCursor].execute();
					try {
						let ret = await executors[tempCursor].wait();
						singleHandlers[tempCursor]
							&& singleHandlers[tempCursor].runWith([].concat(singleArgs[tempCursor], ret));
					} catch (reason) {
						// cancelHandlers[tempCursor]
						// 	&& cancelHandlers[tempCursor].runWith([].concat(cancelArgs[tempCursor], reason));
					}

					if (!this.isRunning) {
						break;
					}

				}

				if (this.isRunning && executors.length > 0)
					this.mCompleteHandler && this.mCompleteHandler.runWith(this.mCompleteHandlerArgs)

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
		 * 
		 * @param ifTotalCallback 
		 */
		public cancel(reason = null): TaskExecutor {
			if (!this.isRunning) return;

			let tempCursor: number = this.mCursor;
			this.mCursor = -1;
			this.mTasks[tempCursor].cancel(reason);

			for (var i: number = tempCursor; i < this.mSingleCancelHandlers.length; ++i) {
				this.mSingleCancelHandlers[i]
					&& this.mSingleCancelHandlers[i].runWith([].concat(this.mSingleCancelHandlerArgs[i], reason));
			}

			if (this.mCancelHandler) {
				this.mCancelHandler && this.mCancelHandler.runWith(this.mcancelHandlerArgs);
			}

			return this;
		}

		/** 
		 * 析构函数，释放所有资源
		*/
		public dispose() {
			this.cancel();

			this.mCompleteHandler && this.mCompleteHandler.recover();
			this.mCompleteHandler = null;
			this.mCompleteHandlerArgs = [];			

			this.mCancelHandler && this.mCancelHandler.recover();
			this.mCancelHandler = null;
			this.mcancelHandlerArgs = [];

			// 回收
			this.mTasks.forEach(exe => exe.dispose());
			this.mTasks = [];

			this.mSingleHandlers.forEach((handler) => handler.recover());
			this.mSingleHandlers = [];
			this.mSingleHandlerArgs = [];			

			this.mSingleCancelHandlers.forEach(Handler => Handler.recover());
			this.mSingleCancelHandlers = [];
			this.mSingleCancelHandlerArgs = [];
		}

		/**
		 * 
		 * @param waitable 
		 * @param completeHandler 
		 * @param args 
		 * @param cancelHandler 
		 * @param cancelArgs 
		 */
		public add(waitable: BaseWaitable<any>, completeHandler: Handler = null, args: any[] = [],
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
			this.mCompleteHandler && this.mCompleteHandler.recover();
			this.mCompleteHandler = handler;

			this.mCompleteHandlerArgs = args;

			return this;
		}

		/**
		 * 设置取消时的回调
		 * @param handler 
		 * @param args 
		 */
		public setCancelHandler(handler: Handler, args: any[] = []): TaskExecutor{
			this.mCancelHandler && this.mCancelHandler.recover();
			this.mCancelHandler = handler;
			this.mcancelHandlerArgs = args

			return this;
		}
	}
}