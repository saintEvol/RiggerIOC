/**
* name 
*/
module riggerIOC{
	export class Event{
		private listenerManager:ListenerManager;
		constructor(mgr:ListenerManager){
			this.listenerManager = mgr;
		}

		public stop(){
			this.listenerManager && this.listenerManager.stop();
		}

		// public pause(){

		// }
	}
}