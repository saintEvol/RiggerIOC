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
	export var debug: boolean = false;

	export class InjectionTrackOwnerShip {
		constructor() {

		}

		/**
		 * 被引用了多少次(当前)
		 */
		refNum: number = 0;

		/**
		 * 被注入的名字（总）
		 */
		totalInjectionNames: string[] = [];

		/**
		 * 至查询时仍然被注入的名字(当前)
		 */
		injectionName: string[] = [];

		add(name: string): void {
			++this.refNum;
			this.totalInjectionNames.push(name);
			this.injectionName.push(name);
		}

		remove(name: string): void {
			--this.refNum;
			this.injectionName = this.injectionName.filter(v => v !== name);
		}

	}

	/**
	 * 注入跟踪信息，用于调试
	 */
	export class InjectionTrack {
		constructor(inst: any, isInjected: boolean = true) {
			this.inst = inst;
			this.isInjected = isInjected;
			this.typeName = inst.constructor.name;
		}

		/**
		 * 此对象是否是直接注入产生
		 */
		public isInjected: boolean = true;

		/**
		 * 类名
		 */
		public typeName: string = null;

		/**
		 * 实例对象
		 */
		public inst: any = null;

		/**
		 * 曾被注入到过的对象的追踪信息
		 */
		public owners: InjectionTrack[] = [];

		/**
		 * 当前的所有权关系描述
		 */
		public ownershipStates: InjectionTrackOwnerShip[] = [];

		/**
		 * 析构错误
		 */
		public disposeError: Error = null;

		/**
		 * 所有仍然粘住未释放的所有者(仍然引用本对象的所有者)
		 * 
		 */
		public get stickyOwners(): [InjectionTrack, InjectionTrackOwnerShip][] {
			let ret: [InjectionTrack, InjectionTrackOwnerShip][] = [];
			for (var i: number = 0; i < this.ownershipStates.length; ++i) {
				if (this.ownershipStates[i].refNum > 0) {
					ret.push([this.owners[i], this.ownershipStates[i]]);
				}
			}

			return ret;
		}

		toString(): string {
			let ret: string = "";
			ret += `========= ${this.typeName} =========\r\n`;
			ret += `是否由注入产生:\t\t${this.isInjected ? "是" : "否"}\r\n`;
			ret += `App Id: \t\t${riggerIOC.getAppId(this.inst)}\r\n`;
			ret += `引用计数:\t\t${riggerIOC.getRefCount(this.inst)}\r\n`;
			// 生成被引用情况
			let refDetails: string = "";
			let stickOwners: [InjectionTrack, InjectionTrackOwnerShip][] = this.stickyOwners;
			for (var i: number = 0; i < stickOwners.length; ++i) {
				let fieldNames: string = "";
				for (var j: number = 0; j < stickOwners[i][1].injectionName.length; ++j) {
					fieldNames += stickOwners[i][1].injectionName[j] + ", ";
				}
				if (fieldNames.length > 0) {
					fieldNames = fieldNames.substring(0, fieldNames.length - 1);
				}
				refDetails += `${stickOwners[i][0].typeName} : ${stickOwners[i][1].refNum} => [${fieldNames}] ,`;
			}
			if(refDetails.length <= 0) refDetails = "无";
			ret += `现在被谁引用(sticky):\t${refDetails}\r\n`;

			let error: Error = this.disposeError;
			ret += `析构错误: \t\t${error ? error.stack : "无"}`;

			return ret;
		}


		/**
		 * 曾经被哪些对象注入过
		 */
		// public children: any[] = [];
	}

	/**
	 * 插入指定对象的注入追踪信息，如果已有，则无操作
	 * @param obj 
	 * @param isInjected 
	 */
	export function insertInjectionTrack(obj: any, isInjected: boolean = true): InjectionTrack {
		let track = riggerIOC.getInjectionTrack(obj);
		if (track) return track;

		track = new InjectionTrack(obj, isInjected);
		let injectionTracks: InjectionTrack[] = riggerIOC.getInjectionTrackPool(obj);
		injectionTracks.push(track);

		return track;
	}

	/**
	 * 获取指定对象的追踪信息，可能返回null
	 * @param obj 
	 */
	export function getInjectionTrack(obj: any, pool: InjectionTrack[] = null): InjectionTrack {
		let injectionTracks: InjectionTrack[];
		if (pool) {
			injectionTracks = pool;
		}
		else {
			injectionTracks = riggerIOC.getInjectionTrackPool(obj);
		}

		// 是否已经有了
		let idx = injectionTracks.findIndex((v, i, arr) => v.inst == obj);
		if (idx >= 0) return injectionTracks[idx];
		return null;
	}

	export function getInjectionTrackPool(obj: any): InjectionTrack[] {
		let injectionTracks: InjectionTrack[];
		let appId = riggerIOC.getAppId(obj);
		if (!appId) {
			injectionTracks = ApplicationContext.globalInjectionTracks;
		}
		else {
			injectionTracks = ApplicationContext.getApplication(appId).injectionTracks;
		}

		return injectionTracks;
	}

	export function setAppId(obj: any, appId: string | number): void {
		if (!obj) return;
		obj["debug_app_id"] = appId;
	}

	export function getAppId(obj: any): string | number {
		if (!obj) return null;
		return obj["debug_app_id"];
	}

	export function addOwnerShip(obj: any, attrName: string, owner: any, acc: number = 1, ifInjected: boolean = false) {
		// todo 如果此时没有obj的track，可能意味着，此obj是手动创建的
		let track: InjectionTrack = riggerIOC.insertInjectionTrack(obj, ifInjected);
		// if(!track) track = riggerIOC.insertInjectionTrack(obj, ifInjected)
		let owners: InjectionTrack[] = track.owners;
		let ownershipStates: InjectionTrackOwnerShip[] = track.ownershipStates;
		let idx: number = owners.findIndex(e => e.inst == owner);
		if (idx < 0 && acc < 0) {
			throw new Error(`try to minus owner ship num , while could not find, obj:${obj.constructor.name}, owner:${owner.constructor.name}`)
		}

		if (idx < 0) {
			// 初始化
			let ownerTrack: InjectionTrack = riggerIOC.insertInjectionTrack(owner, ifInjected);
			owners.push(ownerTrack);

			// 初始化关系描述
			let ownerShip: InjectionTrackOwnerShip = new InjectionTrackOwnerShip();
			ownershipStates.push(ownerShip);

			idx = owners.length - 1;
		}

		if (acc > 0) {
			ownershipStates[idx].add(attrName);
		}
		else {
			ownershipStates[idx].remove(attrName);
		}

		if (ownershipStates[idx].refNum < 0) {
			throw new Error(`owner ship state less than 0, obj:${obj.constructor.name}, attrName:${attrName}, owner:${owner.constructor.name}`)
		}

	}

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


		// 获取注入的字段
		// let injections: string[] = InjectionBinder.instance.getRegisteredInjection(protoType);
		// hack dispose方法		
		protoType.dispose = riggerIOC.hackDispose(fun);
		protoType["$autoDis"] = true;

	}

	/**
	 * 是否满足自动释放的条件（引用计数,是否设置了自动释放)
	 * @param obj 
	 */
	export function needAutoDispose(obj: any): boolean {
		if (!obj) return false;
		return (!obj[REF_COUNT_KEY] || obj[REF_COUNT_KEY] <= 0) && obj["$autoDis"]
	}

	export function doAutoDispose(obj: any) {
		obj.dispose();
	}

	export function hackDispose(disposeFun: Function) {
		return function (): void {
			disposeFun && disposeFun.apply(this);
			let injections: string[] = InjectionBinder.instance.getRegisteredInjection(this);
			if (injections && injections.length > 0) {
				for (let i: number = 0; i < injections.length; ++i) {
					// console.log(`clear injection in obj:${this.constructor}, attr:${injections[i]}, value:${this[injections[i]]}`);
					this[injections[i]] = null;
				}
			}
		}
	}

	/**
	 * 此版本会记录析构过程中出现的错误
	 * @param disposeFun 
	 */
	export function hackDisposeDebug(disposeFun: Function) {
		return function (): void {
			setDisposeError(this, null);
			try {
				disposeFun && disposeFun.apply(this);
				let injections: string[] = InjectionBinder.instance.getRegisteredInjection(this);
				if (injections && injections.length > 0) {
					for (let i: number = 0; i < injections.length; ++i) {
						// console.log(`clear injection in obj:${this.constructor}, attr:${injections[i]}, value:${this[injections[i]]}`);
						this[injections[i]] = null;
					}
				}
			} catch (error) {
				setDisposeError(this, error);
			}
		}
	}

	export function getDisposeError(obj: any): Error {
		if (!obj) return null;
		let track: InjectionTrack = riggerIOC.getInjectionTrack(obj);
		if(!track) return null;
		return track.disposeError;
	}

	export function setDisposeError(obj, error: Error): void {
		if (!obj) return;
		let track: InjectionTrack = riggerIOC.getInjectionTrack(obj);
		if(!track) track = riggerIOC.insertInjectionTrack(obj, false);
		track.disposeError = error
	}

	/**
	 * 注入装饰器
	 * @param ctr 
	 */
	export function inject(ctr: any) {
		return function (target: any, attrName: string, descripter?: any) {
			// console.log(`in inject, attr:${attrName}, ctr:${ctr}`);
			if (descripter) {
				riggerIOC.doInjectGetterSetter(ctr, target, attrName, descripter);
			}
			else {
				riggerIOC.doInjectAttr(ctr, target, attrName);
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

	const REF_COUNT_KEY: string = "$ref_num";
	export function addRefCount(obj: any, acc: number = 1) {
		if (!obj[REF_COUNT_KEY]) {
			obj[REF_COUNT_KEY] = 0;
		}

		obj[REF_COUNT_KEY] += acc;

		// 如果引用计数<=0,则检查是否要析构
		if (obj[REF_COUNT_KEY] <= 0) {
			delete obj[REF_COUNT_KEY];
			// 是否需要自动析构
			if (needAutoDispose(obj)) {
				doAutoDispose(obj);
			}
		}
	}

	export function getRefCount(obj: any): number {
		return obj[REF_COUNT_KEY] || 0;
	}

	export function clearRefCount(obj: any) {
		delete obj[REF_COUNT_KEY];
		// 是否需要自动析构
		if (needAutoDispose(obj)) {
			doAutoDispose(obj);
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
	export function doInjectGetterSetter(key: any, target: any, attrName: string, descripter: any) {
		let k: string = injectionAttrKey + attrName;
		// 注册需要注入的属性名/存取器器名
		InjectionBinder.instance.registerInjection(target, attrName);
		descripter.get = function () {
			let v = this[k];
			if (v === null || v === undefined) {
				let info: InjectionBindInfo = InjectionBinder.instance.bind(key);
				// 使用setter赋值，可以统一维护引用计数器
				v = this[attrName] = info.getInstance();
				info = null;
			}
			return v;
		};
		descripter.set = function (v) {
			// 先将新值引用计数+1
			// 如果先减旧值计数，可能触发其析构
			if (v) {
				addRefCount(v)
			}

			// 再将原来的值的引用计数-1
			let oldV = this[k];
			if (oldV) {
				addRefCount(oldV, -1);
			}

			this[k] = v;
		}
	}



	/**
	 * 对getter/setter方法进行注入 
	 * @param key 
	 * @param taget 
	 * @param attrName 
	 * @param descripter 
	 */
	function doInjectGetterSetterDebug(key: any, target: any, attrName: string, descripter: any) {
		let k: string = injectionAttrKey + attrName;
		// 注册需要注入的属性名/存取器器名
		InjectionBinder.instance.registerInjection(target, attrName);
		descripter.get = function () {
			let v = this[k];
			if (v === null || v === undefined) {
				let info: InjectionBindInfo = InjectionBinder.instance.bind(key);
				// 使用setter赋值，可以统一维护引用计数器
				v = this[attrName] = info.getInstance();
				info = null;
			}
			return v;
		};
		descripter.set = function (v) {
			// 先将新值引用计数+1
			// 如果先减旧值计数，可能触发其析构
			if (v) {
				addRefCount(v);
				// 更新新值的追踪信息
				riggerIOC.addOwnerShip(v, attrName, this);
			}

			// 再将原来的值的引用计数-1
			let oldV = this[k];
			if (oldV) {
				addRefCount(oldV, -1);
				// 更新旧值追踪信息
				riggerIOC.addOwnerShip(oldV, attrName, this, -1);
			}

			this[k] = v;
		}
	}

	/**
	 * 对成员属性进行注入
	 * @param key 构造函数
	 * @param target 原型对象
	 * @param attrName 属性名
	 */
	export function doInjectAttr(key: any, target: any, attrName: string) {
		let k: string = injectionAttrKey + attrName;
		// 注册需要注入的属性名/存取器器名
		InjectionBinder.instance.registerInjection(target, attrName);
		Object.defineProperty(target, attrName, {
			get: function () {
				let v = this[k];
				if (v === null || v === undefined) {
					let info: InjectionBindInfo = InjectionBinder.instance.bind(key);
					// 使用setter赋值，可以统一维护引用计数器					
					v = this[attrName] = info.getInstance();
					info = null;
				}
				return v;
			},
			set: function (v) {
				// 先将新值引用计数+1
				// 如果先减旧值计数，可能触发其析构
				if (v) {
					addRefCount(v)
				}

				// 再将原来的值的引用计数-1
				let oldV = this[k];
				if (oldV) {
					addRefCount(oldV, -1);
				}

				this[k] = v;
			},
			enumerable: true,
			configurable: true
		});
	}

	/**
	 * 对成员属性进行注入 (Debug版)
	 * @param key 构造函数
	 * @param target 原型对象
	 * @param attrName 属性名
	 */
	function doInjectAttrDebug(key: any, target: any, attrName: string) {
		let k: string = injectionAttrKey + attrName;
		// 注册需要注入的属性名/存取器器名
		InjectionBinder.instance.registerInjection(target, attrName);
		Object.defineProperty(target, attrName, {
			get: function () {
				let v = this[k];
				if (v === null || v === undefined) {
					let info: InjectionBindInfo = InjectionBinder.instance.bind(key);
					// 使用setter赋值，可以统一维护引用计数器					
					v = this[attrName] = info.getInstance();
					info = null;
				}
				return v;
			},
			set: function (v) {
				// 先将新值引用计数+1
				// 如果先减旧值计数，可能触发其析构
				if (v) {
					addRefCount(v);
					// 更新新值的追踪信息
					riggerIOC.addOwnerShip(v, attrName, this);
				}

				// 再将原来的值的引用计数-1
				let oldV = this[k];
				if (oldV) {
					addRefCount(oldV, -1);
					// 更新旧值追踪信息
					riggerIOC.addOwnerShip(oldV, attrName, this, -1);
				}

				this[k] = v;
			},
			enumerable: true,
			configurable: true
		});
	}

	export function setDebug(): void {
		riggerIOC.debug = true;
		riggerIOC.hackDispose = riggerIOC.hackDisposeDebug;
		riggerIOC.doInjectAttr = doInjectAttrDebug;
		riggerIOC.doInjectGetterSetter = doInjectGetterSetterDebug;
		riggerIOC.setInjectinBindInfoDebug();
	}

	if (riggerIOC.debug || (window && window["riggerIOC-debug"])) {
		riggerIOC.setDebug();
	}
}