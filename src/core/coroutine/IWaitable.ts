/**
* name 
*/
module riggerIOC{
	export interface IWaitable{
		isDone():boolean;
		done():void;
		setDoneCallback(fun:Function):void
	}
}