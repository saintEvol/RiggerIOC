/**
* name 
*/
module riggerIOC{
	export abstract class CommandBindInfo{
		constructor(){

		}

		/**
		 * 将信号绑定到命令，可以重复执行以绑定到多个命令
		 * @param cmdCls 
		 */
		public abstract to(cmdCls:any):CommandBindInfo;

		/**
		 * 设置为一次性绑定
		 * @param cmdCls 
		 */
		public abstract once(cmdCls:any):CommandBindInfo;

		/**
		 * 设置为顺序命令
		 */
		public abstract inSequence():CommandBindInfo;
	}
}