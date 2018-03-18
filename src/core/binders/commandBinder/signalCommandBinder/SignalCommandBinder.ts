/**
* name 
*/
module riggerIOC{
	export class SignalCommandBinder implements CommandBinder{
		constructor(){

		}

		
		/**
		 * 绑定一个信号
		 * 绑定后，信号将被注入为单例模式，并且同时会立即产生一个实例
		 * @param cls 
		 */
		bind(cls:any):SignalCommandBindInfo{
			// 将信号注入为单例,并返回对应的命令绑定信息
			return new SignalCommandBindInfo(InjectionBinder.instance.bind(cls).toSingleton().getInstance<Signal<any>>());
		}
	}
}