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
	export abstract class CommandBinder {
		constructor(injectionBinder: InjectionBinder) {
			this.injectionBinder = injectionBinder;
			this.bindInfos = [];
		}

		/**
		 * 注入绑定器
		 */
		protected injectionBinder: InjectionBinder;
		protected bindInfos: CommandBindInfo[];

		abstract bind(cls: any): CommandBindInfo;
		abstract unbind(cls: any): void;

		dispose(): void {
			for (let i: number = this.bindInfos.length - 1; i >= 0; --i) {
				this.bindInfos[i].dispose();
			}
			this.bindInfos = [];
			
			this.injectionBinder = null;
		}
	}
}