/**
* name 
*/
module riggerIOC{
	export class Signal<T>{
		constructor(){

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
		on(caller:any, method:Function, ...args:any[]){
			this.makeSureListenerManager();
			this.listenerMgr.on(caller, method, args, false);
		}

		/**
		 * 注册一次性回调
		 * @param caller 
		 * @param method 
		 * @param args 
		 */
		once(caller:any, method:Function, ...args:any[]){
			this.makeSureListenerManager();
			this.listenerMgr.on(caller, method, args, true);
		}

		/**
		 * 取消回调
		 * @param caller 
		 * @param method 
		 */
		off(caller:any, method:Function){
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