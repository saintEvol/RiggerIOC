/**
* 消息与命令的绑定器
* 一个消息可以同时绑定多个命令(即一个消息可以导致多个命令的执行)
* 但一个命令不能同时被绑定到多个消息
*/
module riggerIOC {
	export class EventCommandBinder implements CommandBinder {
		constructor() {

		}

		private commandsMap: {};

		/**
		 * 绑定消息
		 * @param msg 
		 */
		public bind(msg: number | string): EventCommandBindInfo {
			if (!this.commandsMap) this.commandsMap = {};
			let info: EventCommandBindInfo = this.findBindInfo(msg);
			if (!info) return this.commandsMap[msg] = new EventCommandBindInfo(msg);
			return info;
		}

		/**
		 * 查找绑定消息
		 * @param msg 
		 */
		public findBindInfo(msg: string | number): EventCommandBindInfo {
			let info: EventCommandBindInfo = this.commandsMap[msg];
			if (info) return info;
			return null;
		}
	}
}