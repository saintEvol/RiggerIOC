/**
* name 
*/
module riggerIOC{
	export abstract class Command{
		public doneCallBack:Function;
		public get isDone():boolean{
			return this.mIsDone;
		}
		private mIsDone:boolean = false;
		/**
		 * 执行命令
		 */
		abstract execute(arg?:any):void;

		protected done(){
			this.mIsDone = true;
			this.doneCallBack && this.doneCallBack();
		}
	}
}