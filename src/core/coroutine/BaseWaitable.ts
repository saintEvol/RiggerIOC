/**
* 一个可以使用协程等待的基类
*/
module riggerIOC{
	export class BaseWaitable implements riggerIOC.IWaitable{
		constructor(){

		}

		protected mIsDone:boolean = false;
		protected mCallback:Function;

		public reset():IWaitable{
			this.mIsDone = false;
			this.mCallback = null;

			return this;
		}

		isDone():boolean{
			return this.mIsDone;
		}

		done():void{
			this.mIsDone = true;
			this.mCallback && this.mCallback();
			// this.reset();
			this.mCallback = null;
		}

		setDoneCallback(fun:Function):void{
			this.mCallback = fun;
		}
	}
}