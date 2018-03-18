/**
* 事件派发器 
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