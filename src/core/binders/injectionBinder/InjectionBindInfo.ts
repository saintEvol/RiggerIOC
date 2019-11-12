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
	export enum BindInfoKeyType {
		CONSTRUCTOR = 1,
		STRING = 2
	}

	export class InjectionBindInfo {
		public appId: string | number = null;
		public cls: Function | string = null;
		public get realClass(): any {
			if (this.mBindCls) return this.mBindCls;
			if (this.keyType == BindInfoKeyType.STRING) return null;
			return this.cls;
		}
		private mBindCls: any = null;
		private isSingleton: boolean = false;
		private keyType: BindInfoKeyType;
		// private isAutoDispose: boolean = false;

		/**
		 * 实例，只有当为单例模式时才会给此字段赋值
		 */
		private get instance(): any {
			return this.mInstance;
		}
		private set instance(v: any) {
			// 先将新值引用计数+1
			if (v) {
				addRefCount(v)
			}

			// 再将原来的值的引用计数-1
			let oldV = this.mInstance;
			if (oldV) {
				addRefCount(oldV, -1);
			}

			this.mInstance = v;
		}
		private mInstance: any = null;

		/**
		 * 是否注入类的实例
		 */
		public get hasInstance(): boolean {
			return !!this.instance;
		}

		constructor(ctr: Function | string, keyType: BindInfoKeyType = BindInfoKeyType.CONSTRUCTOR) {
			this.init(ctr, keyType);
		}

		public dispose() {
			this.cls = null;
			this.mBindCls = null;
			// if (riggerIOC.needAutoDispose(this.instance)) {
			// 	riggerIOC.doAutoDispose(this.instance);
			// }
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
			let rc = this.realClass;
			if (rc) {
				let inst: T = new (this.realClass)();

				if (this.isSingleton) {
					this.instance = inst;
				}
				return inst;
			}
			return null;
		}

		/**
		 * 获取实例(Debug版)
		 */
		public getInstanceDebug<T>(): T {
			if (this.isToValue) return this.instance;
			if (this.instance) return this.instance;
			let rc = this.realClass;
			if (rc) {
				// 给对象的原型链写入appID信息，防止构造过程中因为引用了注入类型导致自己被加入全局追踪池
				let pt = rc["prototype"];
				let old;
				if (pt) {
					old = riggerIOC.getAppId(pt);
					riggerIOC.setAppId(pt, this.appId);
				}
				let inst: T = new (this.realClass)();

				// 还原
				if (pt) {
					riggerIOC.setAppId(pt, old);
				}

				// 插入追踪信息
				riggerIOC.setAppId(inst, this.appId);
				riggerIOC.insertInjectionTrack(inst);

				if (this.isSingleton) {
					this.instance = inst;
				}
				
				return inst;
			}

			return null;
		}


		/**
		 * 绑定到值，此时会自动进行单例绑定
		 * 可以绑定为null 或 undefined
		 * 
		 * 此函数为toValue的Debug版
		 * @param value 
		 */
		public toValueDebug(value: any): InjectionBindInfo {
			this.isToValue = true;
			this.toSingleton();
			this.instance = value;

			// 插入追踪信息
			if (value) {
				riggerIOC.setAppId(value, this.appId);
				riggerIOC.insertInjectionTrack(value, false);
			}

			return this;
		}

		private init(ctr: Function | string, keyType: BindInfoKeyType = BindInfoKeyType.CONSTRUCTOR):void{
			this.cls = ctr;
			this.keyType = keyType;
		}

		private initDebug(ctr: Function | string, keyType: BindInfoKeyType = BindInfoKeyType.CONSTRUCTOR): void{
			this.cls = ctr;
			this.keyType = keyType;

			// DEBUG追踪信息
			let id;
			switch (keyType) {
				case BindInfoKeyType.CONSTRUCTOR:
					id = ctr["name"];
					break;
				default:
					id = ctr;
					break;
			}
			this["riggerIOC_identifier"] = id;
		}

	}

	export function setInjectinBindInfoDebug() {
		InjectionBindInfo.prototype.toValue = InjectionBindInfo.prototype.toValueDebug;
		InjectionBindInfo.prototype.getInstance = InjectionBindInfo.prototype.getInstanceDebug;
		InjectionBindInfo.prototype["init"] = InjectionBindInfo.prototype["initDebug"];
	}

}