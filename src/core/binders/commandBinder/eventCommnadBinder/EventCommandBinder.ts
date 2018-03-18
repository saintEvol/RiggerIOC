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