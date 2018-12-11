/**
* 一个可以等待的任务基类
*/
module riggerIOC {
	export class WaitableTask<T> extends BaseWaitable {
		protected mContent: T = null;
		constructor(content: T = null) {
			super();
			this.setContent(content);
		}

		dispose():void{
			this.mContent = null;
			super.dispose();
		}

		/**
		 * 获取任务内容
		 */
		public get content():T{
			return this.mContent;
		}

		/**
		 * 设置任务内容
		 */
		public set content(content: T){
			this.setContent(content);
		}

		/**
		 * 设置任务内容
		 */
		setContent(content: T): WaitableTask<T>{
			this.mContent = content;
			return this;
		}
	}
}