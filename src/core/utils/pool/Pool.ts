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
module riggerIOC{
	export class Pool {
		constructor(){
			this.objectPool = {};
		}

		protected objectPool:{} = {};
		/**
         * 根据对象类型标识字符，获取对象池。
         * @param sign 对象类型标识字符。
         * @return 对象池。
         */
        getPoolBySign(sign: string): Array<any>{
			let arr:any[] = this.objectPool[sign];
			if(!arr) {
				this.objectPool[sign] = arr = [];

			}
			return arr;
		}

        /**
         * 清除对象池的对象。
         * @param sign 对象类型标识字符。
         */
        clearBySign(sign: string): void{
			delete this.objectPool[sign];
		}
        /**
         * 将对象放到对应类型标识的对象池中。
         * @param sign 对象类型标识字符。
         * @param item 对象。
         */
        recover(sign: string, item: any): void{
			let old:any[] = this.getPoolBySign(sign);
			old.push(item);
			
		}
        /**
         * <p>根据传入的对象类型标识字符，获取对象池中此类型标识的一个对象实例。</p>
         * <p>当对象池中无此类型标识的对象时，则根据传入的类型，创建一个新的对象返回。</p>
         * @param sign 对象类型标识字符。
         * @param cls 用于创建该类型对象的类。
         * @return 此类型标识的一个对象。
         */
        getItemByClass<T>(sign: string, cls: any): T{
			let obj:T = this.getItem<T>(sign);
			if(obj) return obj;
			return new cls();
		}
        /**
         * <p>根据传入的对象类型标识字符，获取对象池中此类型标识的一个对象实例。</p>
         * <p>当对象池中无此类型标识的对象时，则使用传入的创建此类型对象的函数，新建一个对象返回。</p>
         * @param sign 对象类型标识字符。
         * @param createFun 用于创建该类型对象的方法。
         * @return 此类型标识的一个对象。
         */
        getItemByCreateFun<T>(sign: string, createFun: Function): T{
			let obj:T = this.getItem<T>(sign);
			if(obj) return obj;
			return createFun();
		}
        /**
         * 根据传入的对象类型标识字符，获取对象池中已存储的此类型的一个对象，如果对象池中无此类型的对象，则返回 null 。
         * @param sign 对象类型标识字符。
         * @return 对象池中此类型的一个对象，如果对象池中无此类型的对象，则返回 null 。
         */
        getItem<T>(sign: string): T{
			let pool:T[] = this.getPoolBySign(sign);
			if(pool.length <= 0) return null;
			return pool.pop();
		}
	}
}