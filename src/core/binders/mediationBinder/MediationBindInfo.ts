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
* Mediation的绑定信息
*/
module riggerIOC {
	export class MediationBindInfo {
		/**
		 * 绑定的视图类构造函数
		 */
		public get viewConstructor(): any {
			return this.mViewConstructor;
		}
		private mViewConstructor: any;

		/**
		 * 与视图绑定的中介类
		 */
		public get bindMediatorConstructor(): any {
			return this.mBindMediatorConstructor;
		}
		private mBindMediatorConstructor: any;

		constructor(cls: any) {
			InjectionWrapper.wrap(cls);
			this.mViewConstructor = cls;
		}

		/**
		 * 将视图绑定到中介类
		 * @param mediatorCls 
		 */
		to(mediatorCls: any): MediationBindInfo {
			this.mBindMediatorConstructor = mediatorCls;
			return this;
		}

		dispose(): void {
			this.mViewConstructor = null;
			this.mBindMediatorConstructor = null;
		}
	}
}