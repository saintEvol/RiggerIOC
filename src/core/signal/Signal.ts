/**
* name 
*/
module riggerIOC{
	export class Signal<T>{
		constructor(){

		}


		dispatch(arg?:T){
			if(this.listenerMgr) this.listenerMgr.execute(arg);
		}

		private listenerMgr:ListenerManager;

		on(caller:any, method:Function, ...args:any[]){
			this.makeSureListenerManager();
			this.listenerMgr.on(caller, method, args, false);
		}

		once(caller:any, method:Function, ...args:any[]){
			this.makeSureListenerManager();
			this.listenerMgr.on(caller, method, args, true);
		}

		off(caller:any, method:Function){
			if(this.listenerMgr) this.listenerMgr.off(caller, method);
		}

		private makeSureListenerManager(){
			if(!this.listenerMgr) this.listenerMgr = new ListenerManager();			
		}
	}
}