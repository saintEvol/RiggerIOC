/**
* name 
*/
module riggerIOC{
	export interface IWaitable{
		/** 
		 * 是否已经执行完成
		*/
		isDone():boolean;

		/** 
		 * 指示自己已经完成
		*/
		done():void;

		/**
		 * 设置完成后的回调
		 * @param fun 
		 */
		setDoneCallback(fun:Action):void
	}

	export class WaitableContainer<T> extends BaseWaitable{

	}

	export interface IWaitableExecutor extends IWaitable{
		execute(...args: any[]):void
		cancel():void
		dispose():void
	}
}