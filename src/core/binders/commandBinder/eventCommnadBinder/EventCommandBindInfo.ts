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
module riggerIOC {
	export class EventCommandBindInfo implements CommandBindInfo {

		public message: number | string = null;
		public bindTuples: CommandBindTuple[];

		constructor(msg: number | string) {
			this.message = msg;
			this.bindTuples = [];
		}

		/**
		 * 绑定到指定命令
		 * @param cls 
		 */
		public to(cls: any): EventCommandBindInfo {
			let infos: CommandBindTuple[] = this.bindTuples;
			let len: number = infos.length;
			let tuple: CommandBindTuple;
			for (var i: number = 0; i < len; ++i) {
				tuple = infos[i];
				if (tuple.ctr === cls) {
					return this;
				}
			}
			infos.push(new CommandBindTuple(cls));
			return this;
		}

		public toValue(value:any):CommandBindInfo{
			// TODO 等待实现
			return this;
		}

		public once(): CommandBindInfo {
			return this;
		}

		public inSequence(): CommandBindInfo {
			return this;
		}


		/**
		 * 将绑定设置为单例模式
		 * ！！！对于Command而言，其总是单例的，此接口只是为了提醒使用者
		 */
		public toSingleton(): InjectionBindInfo {
			throw new Error("command is always Singleton.");

		}
	}
}