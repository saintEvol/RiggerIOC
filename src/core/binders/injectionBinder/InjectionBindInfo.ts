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
	export class InjectionBindInfo {
		public cls: any = null;
		public get realClass(): any {
			if (this.mBindCls) return this.mBindCls;
			return this.cls;
		}
		private mBindCls: any = null;
		private isSingleton: boolean = false;

		/**
		 * 实例，只有当为单例模式时才会给此字段赋值
		 */
		private instance: any = null;

		/**
		 * 是否注入类的实例
		 */
		public get hasInstance(): boolean {
			return !!this.instance;
		}

		constructor(ctr: Function) {
			this.cls = ctr;
		}

		public dispose() {
			this.cls = null;
			this.mBindCls = null;
			this.instance = null;
		}

		/**
		 * 绑定到目标类
		 * @param ctr 目标类的构造函数 
		 */
		public to(ctr: Function): InjectionBindInfo {
			// 不能绑定到自身
			if (ctr === this.cls) throw new Error("can not bind to self.");

			this.mBindCls = ctr;
			return this;
		}

		private isToValue: boolean = false;
		/**
		 * 绑定到值，此时会自动进行单例绑定
		 * 可以绑定为null 或 undefined
		 * @param value 
		 */
		public toValue(value: any): InjectionBindInfo {
			this.isToValue = true;
			this.toSingleton();
			this.instance = value;
			return this;
		}

		/**
		 * 将绑定设置为单例模式
		 */
		public toSingleton(): InjectionBindInfo {
			this.isSingleton = true;
			return this;
		}

		/**
		 * 获取实例
		 */
		public getInstance<T>(): T {
			if (this.isToValue) return this.instance;
			if (this.instance) return this.instance;
			let inst: T = new (this.realClass)();
			// let cls = this.realClass
			// if (this.mBindCls) {
			// 	inst = new this.mBindCls();
			// }else if(this.cls){
			// 	inst = new this.cls();
			// }

			if (this.isSingleton) {
				this.instance = inst;
			}
			return inst;
		}
	}
}