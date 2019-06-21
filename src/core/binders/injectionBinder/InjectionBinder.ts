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
 * 注入绑定器类
 */
module riggerIOC {
	export class InjectionBinder {
		// private nowBindId: number = 1;
		public static get instance(): InjectionBinder {
			if (!InjectionBinder.mInstance) {
				InjectionBinder.mInstance = new InjectionBinder();
			}

			return InjectionBinder.mInstance;
		}
		private static mInstance: InjectionBinder;

		constructor() {

		}

		private bindedMap: { [bindId: string]: InjectionBindInfo } = {};
		/**
		 * 绑定一个类,类不会重复绑定，如果已经存在绑定信息，则仅仅返回原来的绑定信息
		 *
		 * @param ctr 要绑定类的构造函数,推荐绑定抽象类
		 * @return 返回对应的绑定信息 
		 */
		public bind(cls: any): InjectionBindInfo {
			// console.log("bind");
			if (!cls) return null;
			// 查找是否已经有绑定过了
			let info: InjectionBindInfo = this.findBindInfo(cls);
			if (!info) {
				let id: number | string = InjectionWrapper.wrap(cls);
				info = new InjectionBindInfo(cls);
				this.bindedMap[id] = info;
			}

			return info;
		}

		private registerKey: string = "_register_key";
		public registerInjection(target: any, attName: string): void {
			let arr: string[] = target[this.registerKey];
			if (!arr) arr = target[this.registerKey] = [];
			arr.push(attName);
		}

		public getRegisteredInjection(target:any): string[]{
			if(!target) return []
			return target[this.registerKey] || [];
		}

		/**
		 * 进行注入
		 * @param obj 
		 */
		public inject(obj: any): void {
			let prototype = obj["__proto__"];
			let arr: string[] = prototype[this.registerKey];
			if (!arr || arr.length <= 0) return;
			let len: number = arr.length;
			for (var i: number = 0; i < len; ++i) {
				obj[arr[i]];
			}
		}

		/**
		 * 解绑
		 * @param cls 
		 */
		public unbind(cls: any): void {
			// console.log("unbind");
			this.disposeBindInfo(cls);
		}

		/**
		 * 从绑定列表中找到指定的绑定信息
		 * @param ctr 指定的构造函数，是绑定信息的键
		 */
		public findBindInfo(ctr: Function): InjectionBindInfo {
			if (!ctr) return null;
			if (!this.bindedMap) return null;
			let id: number | string = InjectionWrapper.getId(ctr);
			if (!id) return null;
			return this.bindedMap[id];
		}

		// protected getBindId(cls: any): number {
		// 	return cls[InjectionBinder.BIND_ID_KEY];
		// }

		private disposeBindInfo(cls: any): void {
			if (!cls) return;
			let id: number | string = InjectionWrapper.getId(cls);
			if (!id) return;
			let info: InjectionBindInfo = this.bindedMap[id];
			if (info) {
				info.dispose();
				delete this.bindedMap[id];
			}
			info = null;
		}
	}
}