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
	export class SignalCommandBinder extends CommandBinder {

		/**
		 * 绑定一个信号
		 * 绑定后，信号将被注入为单例模式，并且同时会立即产生一个实例
		 * @param cls 
		 */
		bind(cls: { new(): Signal<any> }): SignalCommandBindInfo {
			// 将信号注入为单例,并返回对应的命令绑定信息
			let info: SignalCommandBindInfo = new SignalCommandBindInfo(
				this.injectionBinder.bind(cls).toSingleton().getInstance<Signal<any>>(), this.injectionBinder);
			this.bindInfos.push(info);
			return info;
		}

		unbind(sigObj: Signal<any>, ifAll: boolean = false): void {
			throw new Error("not implemented");
			// for (let i: number = 0; i < this.bindInfos.length; ++i) {
			// 	if()
			// }
		}
	}
}