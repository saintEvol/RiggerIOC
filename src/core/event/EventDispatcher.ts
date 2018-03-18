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
	export class EventDispatcher{
		constructor(){
			this.eventsMap = {};//{key:[]}
		}

		private eventsMap:{};
		dispatch(eventName:string | number, ...args:any[]){
			let listenerMgr:ListenerManager = this.eventsMap[eventName];
			if(!listenerMgr) return;
			let e:Event = new Event(listenerMgr);
			listenerMgr.execute(e, ...args);
		}

		on(eventName:string | number, caller:any, method:Function, ...args:any[]):Handler{
			let listenerMgr:ListenerManager = this.eventsMap[eventName];
			if(!listenerMgr) listenerMgr = this.eventsMap[eventName] = new ListenerManager();
			return listenerMgr.on(caller, method, args);
		}

		off(eventName:string | number, caller:any, method:Function){
			let listenerMgr:ListenerManager = this.eventsMap[eventName];
			if(!listenerMgr) return;
			return listenerMgr.off(caller, method);
		}

		dispose(){
			this.clear();
			this.eventsMap = null;
		}

		private clear(){
			for(var k in this.eventsMap){
				this.eventsMap[k].dispose();
				delete this.eventsMap[k];
			}
		}
	}
}