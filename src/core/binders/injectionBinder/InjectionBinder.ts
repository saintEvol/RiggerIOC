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
module riggerIOC{
	export class InjectionBinder{
		public static get instance():InjectionBinder{
			if(!InjectionBinder.mInstance){
				InjectionBinder.mInstance = new InjectionBinder();
			}

			return InjectionBinder.mInstance;
		}
		private static mInstance:InjectionBinder;
		
		constructor(){

		}

		private bindedArray:InjectionBindInfo[];
		/**
		 * 绑定一个类,类不会重复绑定，如果已经存在绑定信息，则仅仅返回原来的绑定信息
		 *
		 * @param ctr 要绑定类的构造函数,推荐绑定抽象类
		 * @return 返回对应的绑定信息 
		 */
		public bind(cls:any){
			// console.log("bind");
			
			// 查找是否已经有绑定过了
			let info:InjectionBindInfo = this.findBindInfo(cls);
			if(!info) {
				info = new InjectionBindInfo(cls);
				if(!this.bindedArray) this.bindedArray = [];				
				this.bindedArray.push(info);
			}

			return info;
		}

		/**
		 * 解绑
		 * @param cls 
		 */
		public unbind(cls:any){
			// console.log("unbind");
			this.disposeBindInfo(cls);
		}

		/**
		 * 从绑定列表中找到指定的绑定信息
		 * @param ctr 指定的构造函数，是绑定信息的键
		 */
		public findBindInfo(ctr:Function):InjectionBindInfo{
			if(!ctr) return null;
			if(!this.bindedArray) return null;

			let info:InjectionBindInfo;
			let arr:InjectionBindInfo[] = this.bindedArray;
			let len:number = arr.length;
			for (var i = 0; i < len; i++) {
				info = arr[i];
				if(info.cls === ctr) return info;
			}

			return null;
		}

		private disposeBindInfo(cls:any){
			if(!cls) return;
			let arr:InjectionBindInfo[] = this.bindedArray;			
			if(!arr) return;
			let len:number = arr.length;
			if(len <= 0) return;

			let temp:InjectionBindInfo[] = [];
			let info:InjectionBindInfo;
			for(var i:number = 0; i < len; ++i){
				info = arr[i];
				if(info.cls !== cls){
					info.dispose();
					temp.push(info);
				}
			}

			this.bindedArray = temp;
		}
	}
}