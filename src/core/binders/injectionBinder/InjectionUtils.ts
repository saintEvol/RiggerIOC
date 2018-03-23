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
	function doInjectGetterSetter(key: any, taget: any, attrName: string, descripter: any) {
		let info: InjectionBindInfo = InjectionBinder.instance.bind(key);
		let k: string = injectionAttrKey + attrName;
		descripter.get = function () {
			let v = this[k];
			if (v === null || v === undefined) {
				v = this[k] = info.getInstance();
				// info = null;
			}
			return v;
		};
		descripter.set = function (v) {
			this[k] = v;
		}
	}

	/**
	 * 对成员属性进行注入
	 * @param key 
	 * @param target 
	 * @param attrName 
	 */
	function doInjectAttr(key: any, target: any, attrName: string) {
		let info: InjectionBindInfo = InjectionBinder.instance.bind(key);
		let k: string = injectionAttrKey + attrName;
		Object.defineProperty(target, attrName, {
			get: function () {
				let v = this[k];
				if (v === null || v === undefined) {
					v = this[k] = info.getInstance();
					// info = null;
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