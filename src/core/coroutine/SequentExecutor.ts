/**
* 顺序执行器
*/
/// 
module riggerIOC {
	export class SequentExecutor {
		private static get pool(): Pool {
			if (!this.mPool) this.mPool = new Pool();
			return this.mPool;
		}
		private static mPool: Pool
		private static readonly _sign: string = "_sign_sequent_executor";

		private mExecutors: IWaitableExecutor[] = []
		private mSingleHandlers: riggerIOC.Handler[] = []
		private mCompleteHandler: riggerIOC.Handler = null
		private mCompleteHandlerArgs: any[] = [];
		private mSingleHandlerArgs: any[] = []
		private mCursor: number = -1;

		constructor() {
		}

		/** 
		 * 创建一个实例
		*/
		public static create(): SequentExecutor {
			return SequentExecutor.pool.getItemByClass<SequentExecutor>(SequentExecutor._sign,
				SequentExecutor)
		}

		/** 
		 * 回收
		*/
		public recover(): void {
			SequentExecutor.pool.recover(SequentExecutor._sign, this);
		}

		/**
		 * 
		 * @param ifWaitUnFinised 
		 * @param ifSingleCallback 
		 * @param ifTotalCallback 
		 */
		public async execute(ifWaitUnFinised: boolean = false, 
			ifSingleCallback:boolean = true, ifTotalCallback:boolean = true): Promise<any> {
			if (this.mCursor < 0) {
				let executors: IWaitableExecutor[] = this.mExecutors;
				let singleArgs: any[] = this.mSingleHandlerArgs;
				let singleHandlers: Handler[] = this.mSingleHandlers;
				this.mCursor = 0;

				for (; this.mCursor < executors.length; ++this.mCursor) {
					executors[this.mCursor].execute();
					await waitFor(executors[this.mCursor]);
					singleHandlers[this.mCursor] 
						&& singleHandlers[this.mCursor].runWith(singleArgs[this.mCursor]);
				}

				if (executors.length > 0)
					this.mCompleteHandler && this.mCompleteHandler.runWith(this.mCompleteHandlerArgs)

				// 游标归位
				this.mCursor = -1;
			}
			// 如果已经在执行了			
			else{
				this.cancel()
				await this.execute(ifWaitUnFinised, ifSingleCallback, ifTotalCallback)
			}

		}

		/** 
		 * @TODO
		*/
		public cancel(ifSingleCallback: boolean = true, ifTotalCallback: boolean = true): void {
			if(this.mCursor < 0) return;
			this.mExecutors[this.mCursor].cancel()
		}

		/** 
		 * 析构函数，释放所有资源
		*/
		public dispose() {
			this.mCompleteHandler && this.mCompleteHandler.recover();
			this.mCompleteHandler = null;

			// 回收
			this.mExecutors.forEach(exe => exe.dispose());
			this.mExecutors = [];

			this.mSingleHandlers.forEach((handler) => handler.recover());
			this.mSingleHandlers = [];

			this.mCompleteHandlerArgs = [];

			this.mSingleHandlerArgs = [];
		}

		/**
		 * 增加一个执行体
		 * @param waitable 执行体
		 * @param handler 执行完成后的回调
		 * @param args 回调参数
		 */
		public add(waitable: IWaitableExecutor, handler: Handler = null, args: any[] = []): SequentExecutor {
			this.mExecutors.push(waitable);
			this.mSingleHandlers.push(handler);
			this.mSingleHandlerArgs.push(args);

			return this;
		}

		/**
		 * 设置完成时的回调，此回调是在所有执行队列都执行完成后才会回调
		 * @param handler 回调
		 * @param args 参数
		 */
		public setCompleteHandler(handler: Handler, args: any[] = []): SequentExecutor {
			this.mCompleteHandler && this.mCompleteHandler.recover();
			this.mCompleteHandler = handler;

			this.mCompleteHandlerArgs = args;

			return this;
		}
	}
}