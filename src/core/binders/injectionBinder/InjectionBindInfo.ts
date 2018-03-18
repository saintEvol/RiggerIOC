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
		private bindedCls: any = null;
		private isSingleton: boolean = false;

		/**
		 * 实例，只有当为单例模式时才会给此字段赋值
		 */
		private instance: any = null;

		constructor(ctr: Function) {
			this.cls = ctr;
		}

		public dispose(){
			this.cls = null;
			this.bindedCls = null;
			this.instance = null;
		}

		/**
		 * 绑定到目标类
		 * @param ctr 目标类的构造函数 
		 */
		public to(ctr: Function): InjectionBindInfo {
			// 不能绑定到自身
			if (ctr === this.cls) throw new Error("can not bind to self.");

			this.bindedCls = ctr;
			return this;
		}

		/**
		 * 绑定到值，此时会自动进行单例绑定
		 * @param value 
		 */
		public toValue(value:any){
			this.toSingleton();
			this.instance = value;

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
			if (this.instance) return this.instance;
			let inst:T;
			if (this.bindedCls) {
				inst = new this.bindedCls();
			}else if(this.cls){
				inst = new this.cls();
			}

			if (this.isSingleton) {
				this.instance = inst;
			}
			return inst;
		}
	}
}