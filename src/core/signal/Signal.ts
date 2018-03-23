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
	export class Signal<T>{
		constructor(){

		}

		dispose(){
			this.listenerMgr && this.listenerMgr.dispose();
			this.listenerMgr = null;
		}

		/**
		 * 派发信号
		 * @param arg 
		 */
		dispatch(arg?:T){
			if(this.listenerMgr) this.listenerMgr.execute(arg);
		}

		private listenerMgr:ListenerManager;

		/**
		 * 注册回调
		 * @param caller 
		 * @param method 
		 * @param args 
		 */
		on(caller:any, method:(arg:T, ...args:any[]) => any, ...args:any[]){
			this.makeSureListenerManager();
			this.listenerMgr.on(caller, method, args, false);
		}

		/**
		 * 注册一次性回调
		 * @param caller 
		 * @param method 
		 * @param args 
		 */
		once(caller:any, method:(arg:T, ...args:any[]) => any, ...args:any[]){
			this.makeSureListenerManager();
			this.listenerMgr.on(caller, method, args, true);
		}

		/**
		 * 取消回调
		 * @param caller 
		 * @param method 
		 */
		off(caller:any, method:(arg:T, ...args:any[]) => any){
			if(this.listenerMgr) this.listenerMgr.off(caller, method);
		}

		/**
		 * 保证ListenerManager可用
		 */
		private makeSureListenerManager(){
			if(!this.listenerMgr) this.listenerMgr = new ListenerManager();			
		}
	}
}