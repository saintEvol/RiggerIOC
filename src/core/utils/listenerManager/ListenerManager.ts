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
	export class ListenerManager{
		constructor(){
		}

		dispose(){
			this.stopped = false;
			this.clear();
		}

		private handlers:Handler[];
		public on(caller:any, method:Function, args:any[], once:boolean = false):Handler{
			if(!this.handlers) this.handlers = [];
			let handler:Handler = new Handler(caller, method, args, once);
			this.handlers.push(handler);
			return handler;
		}

		/**
		 * 解除回调
		 * @param caller 
		 * @param method 
		 */
		public off(caller:any, method:Function){
			if(!this.handlers || this.handlers.length <= 0) return;
			
			let tempHandlers:Handler[] = [];
			for (var i = 0; i < this.handlers.length; i++) {
				var handler = this.handlers[i];
				if(handler.caller === caller && handler.method === method){
					handler.recover();
					break;
				}
				else{
					tempHandlers.push(handler);
				}
			}

			// 把剩下的放回
			++i;
			for(; i < this.handlers.length; ++i){
				tempHandlers.push(this.handlers[i]);
			}
			this.handlers = tempHandlers;
		}

		/**
		 * 解除所有回调
		 * @param caller 
		 * @param method 
		 */
		public offAll(caller:any, method:Function){
			if(!this.handlers || this.handlers.length <= 0) return;

			let temp:Handler[] = [];
			let handlers:Handler[] = this.handlers;
			let len:number = handlers.length;
			for(var i:number = 0; i < len; ++i){
				if(caller !== handlers[i].caller || method !== handlers[i].method){
					temp.push(handlers[i]);
				}
				else{
					handlers[i].recover();
				}
			}

			this.handlers = temp;
		}

		/**
		 * 清除所有回调
		 */
		public clear(){
			if(!this.handlers || this.handlers.length <= 0) return;
			
			for (var i = 0; i < this.handlers.length; i++) {
				var handler = this.handlers[i];
				handler.recover();
			}
			this.handlers = null;
		}

		private stopped:boolean = false;
		public stop(){
			this.stopped = true;
		}
		public execute(...args:any[]){
			if(!this.handlers || this.handlers.length <= 0) return;			
			let handlers:Handler[] = this.handlers;
			let len:number = handlers.length;
			let handler:Handler;
			let temp:Handler[] = [];
			let i:number = 0;
			
			for(; i < len; ++i){
				if(this.stopped) break;

				handler = handlers[i];
				handler.runWith(args);
				if(handler.method){
					temp.push(handler);
				}
			}
			for(; i < len; ++i){
				temp.push(handlers[i]);
			}

			this.stopped = false;

			this.handlers = temp;
			handler = null;
			handlers = null;
			temp = null;
		}
	}
}