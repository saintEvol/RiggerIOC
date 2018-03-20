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
module riggerIOC{
	export class SignalCommandBinder implements CommandBinder{
		constructor(){

		}

		/**
		 * 绑定一个信号
		 * 绑定后，信号将被注入为单例模式，并且同时会立即产生一个实例
		 * @param cls 
		 */
		bind(cls:any):SignalCommandBindInfo{
			// 将信号注入为单例,并返回对应的命令绑定信息
			return new SignalCommandBindInfo(InjectionBinder.instance.bind(cls).toSingleton().getInstance<Signal<any>>());
		}
	}
}