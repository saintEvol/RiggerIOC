/**
* name 
*/
module riggerIOC {
	export class InjectionBindInfo {
		public cls: any = null;
		private bindedCls: any = null;
		private isSingleton: boolean = false;

		/**
		 * 实例，只有当为单例模式时才会给此字段赋值
		 */
		private instance: any = null;

		constructor(ctr: Function) {
			this.cls = ctr;
		}

		public dispose(){
			this.cls = null;
			this.bindedCls = null;
			this.instance = null;
		}

		/**
		 * 绑定到目标类
		 * @param ctr 目标类的构造函数 
		 */
		public to(ctr: Function): InjectionBindInfo {
			// 不能绑定到自身
			if (ctr === this.cls) throw new Error("can not bind to self.");

			this.bindedCls = ctr;
			return this;
		}

		/**
		 * 绑定到值，此时会自动进行单例绑定
		 * @param value 
		 */
		public toValue(value:any){
			this.toSingleton();
			this.instance = value;

		}

		/**
		 * 将绑定设置为单例模式
		 */
		public toSingleton(): InjectionBindInfo {
			this.isSingleton = true;
			return this;
		}

		/**
		 * 获取实例
		 */
		public getInstance<T>(): T {
			if (this.instance) return this.instance;
			let inst:T;
			if (this.bindedCls) {
				inst = new this.bindedCls();
			}else if(this.cls){
				inst = new this.cls();
			}

			if (this.isSingleton) {
				this.instance = inst;
			}
			return inst;
		}
	}
}