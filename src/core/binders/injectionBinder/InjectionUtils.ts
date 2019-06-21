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
	/**
	 * 类装饰器，使类可以自动释放
	 * 当用此装饰器装饰了类型时：
	 * 1. 当其所属注入器被释放时，会自动调用对象的dispose()进行释放(如果有实现)
	 * 2. 释放时，会自动将注入的属性置为null
	 */
	export function autoDispose(constructor: any) {
		// constructor[`$autoDispose`] = "!!!!!!!!!!";
		// 检查是否有实现dispose方法
		let protoType = constructor.prototype;
		if (!protoType) {
			throw new Error("has no prototype");
		}

		if (protoType["$autoDis"]) return;		

		let fun = protoType.dispose;
		// if (!fun) {
		// 	throw new Error(`You must implement dispose() to use autoDispose`);
		// }

		// if (typeof (fun) !== "function") {
		// 	throw new Error(`You must implement dispose() to use autoDispose`);
		// }


		// 获取注入的字段
		// let injections: string[] = InjectionBinder.instance.getRegisteredInjection(protoType);
		// hack dispose方法		
		protoType.dispose = hackDispose(fun);
		protoType["$autoDis"] = true;

	}

	export function needAutoDispose(obj: any): boolean {
		if (!obj) return false;
		return obj["$autoDis"];
	}

	export function doAutoDispose(obj:any) {
		obj.dispose();
	}

	function hackDispose(disposeFun: Function) {
		return function (): void {
			disposeFun && disposeFun.apply(this);
			let injections: string[] = InjectionBinder.instance.getRegisteredInjection(this);
			if (injections && injections.length > 0) {
				for (let i: number = 0; i < injections.length; ++i) {
					console.log(`clear injection in obj, attr:${injections[i]}, value:${this[injections[i]]}`);
					this[injections[i]] = null;
				}
			}
		}
	}

	/**
	 * 注入装饰器
	 * @param ctr 
	 */
	export function inject(ctr: any) {
		return function (target: any, attrName: string, descripter?: any) {
			// console.log(`in inject, attr:${attrName}, ctr:${ctr}`);
			if (descripter) {
				doInjectGetterSetter(ctr, target, attrName, descripter);
			}
			else {
				doInjectAttr(ctr, target, attrName);
			}
		}
	}

	/**
	 * 反向映射装饰器,即以字段的值为键，以字段的键为值建立一个新的字段，只推荐常量用
	 */
	export function retrievAble(v?: number) {
		return function (target: any, keyStr: string) {
			// console.log(`key str:${keyStr}, v:${v}`);
			v = v || target[keyStr];
			target[v] = keyStr;
		}
	}

	/**
	 * 注入的属性的键
	 */
	const injectionAttrKey = "$$";

	/**
	 * 对getter/setter方法进行注入
	 * @param key 
	 * @param taget 
	 * @param attrName 
	 * @param descripter 
	 */
	function doInjectGetterSetter(key: any, target: any, attrName: string, descripter: any) {
		let k: string = injectionAttrKey + attrName;
		// 注册需要注入的属性名/存取器器名
		InjectionBinder.instance.registerInjection(target, attrName);
		descripter.get = function () {
			let v = this[k];
			if (v === null || v === undefined) {
				let info: InjectionBindInfo = InjectionBinder.instance.bind(key);
				v = this[k] = info.getInstance();
				info = null;
			}
			return v;
		};
		descripter.set = function (v) {
			this[k] = v;
		}
	}

	/**
	 * 对成员属性进行注入
	 * @param key 构造函数
	 * @param target 原型对象
	 * @param attrName 属性名
	 */
	function doInjectAttr(key: any, target: any, attrName: string) {
		let k: string = injectionAttrKey + attrName;
		// 注册需要注入的属性名/存取器器名
		InjectionBinder.instance.registerInjection(target, attrName);
		Object.defineProperty(target, attrName, {
			get: function () {
				let v = this[k];
				if (v === null || v === undefined) {
					let info: InjectionBindInfo = InjectionBinder.instance.bind(key);
					v = this[k] = info.getInstance();
					info = null;
				}
				return v;
			},
			set: function (v) {
				this[k] = v;
			},
			enumerable: true,
			configurable: true
		});
	}
}