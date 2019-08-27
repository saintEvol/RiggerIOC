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
		private stringBindedMap: { [bindId: string]: InjectionBindInfo } = {};
		/**
		 * 绑定一个类或字符串,不会重复绑定，如果已经存在绑定信息，则仅仅返回原来的绑定信息
		 *
		 * @param ctrOrStr 要绑定类的构造函数,推荐绑定抽象类
		 * @return 返回对应的绑定信息 
		 */
		public bind(ctrOrStr: Function | string): InjectionBindInfo {
			if(Utils.isString(ctrOrStr)){
				return this.bindString(ctrOrStr);
			}
			else {
				return this.bindClass(ctrOrStr);
			}
		}

		public bindClass(cls: Function): InjectionBindInfo {
			// console.log("bind");
			if (!cls) return null;
			// 查找是否已经有绑定过了
			let info: InjectionBindInfo = this.findClassBindInfo(cls);
			if (!info) {
				let id: number | string = InjectionWrapper.wrap(cls);
				info = new InjectionBindInfo(cls);
				this.bindedMap[id] = info;
			}

			return info;
		}

		/**
		 * 对字符串进行绑定
		 * @param str 
		 */
		public bindString(str: string): InjectionBindInfo {
			if (!str) return null;
			let info: InjectionBindInfo = this.findStringBindInfo(str);
			if(!info) {
				this.stringBindedMap[str] = info = new InjectionBindInfo(str, BindInfoKeyType.STRING);
			}

			return info;
		}

		private registerKey: string = "_register_key";
		public registerInjection(target: any, attName: string): void {
			let arr: string[] = target[this.registerKey];
			if (!arr) arr = target[this.registerKey] = [];
			arr.push(attName);
		}

		public getRegisteredInjection(target: any): string[] {
			if (!target) return []
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
		 * @param ctrOrStr 
		 */
		public unbind(ctrOrStr: any): void {
			if(Utils.isString(ctrOrStr)) {
				this.unbindString(ctrOrStr);
			}
			else {
				this.unbindClass(ctrOrStr);
			}
		}

		public unbindString(str: string): void{
			this.disposeStringBindInfo(str);
		}

		public unbindClass(ctr: Function): void {
			this.disposeClassBindInfo(ctr);
		}

		/**
		 * 从绑定列表中找到指定的绑定信息
		 * @param ctrOrStr 指定的构造函数或字符串，是绑定信息的键
		 */
		public findBindInfo(ctrOrStr: string | Function): InjectionBindInfo {
			if(Utils.isString(ctrOrStr)){
				return this.findStringBindInfo(ctrOrStr)
			}
			return this.findClassBindInfo(ctrOrStr);
		}

		public findClassBindInfo(ctr: Function): InjectionBindInfo {
			if (!ctr) return null;
			if (!this.bindedMap) return null;
			let id: number | string = InjectionWrapper.getId(ctr);
			if (!id) return null;
			return this.bindedMap[id];
		}

		/**
		 * 查找给定字符串的绑定信息
		 * @param str 
		 */
		public findStringBindInfo(str: string): InjectionBindInfo {
			if (!str) return null;
			if (!this.stringBindedMap) return null;
			return this.stringBindedMap[str];
		}

		private disposeBindInfo(clsOrStr: Function | string): void {
			if(Utils.isString(clsOrStr)) {
				this.disposeStringBindInfo(clsOrStr);
			}
			else {
				this.disposeClassBindInfo(clsOrStr);
			}
		}

		private disposeClassBindInfo(cls: Function):void{
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

		private disposeStringBindInfo(str: string): void{
			if (!str) return;
			let info: InjectionBindInfo = this.stringBindedMap[str];
			if(info) {
				info.dispose();
				delete this.stringBindedMap[str];
			}
			info = null;
		}
	}
}