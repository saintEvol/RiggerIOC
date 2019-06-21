module riggerIOC {
	export class ApplicationInjectionBinder extends InjectionBinder {
		public appId: string | number;
		protected infos: { [bindId: string]: InjectionBindInfo } = {};
		protected injectionBinder: InjectionBinder;
		constructor(appId: string | number, injectionBinder: InjectionBinder | ApplicationInjectionBinder) {
			super();
			this.appId = appId;
			if (injectionBinder instanceof ApplicationInjectionBinder) {
				this.injectionBinder = injectionBinder.injectionBinder;
			}
			else {
				this.injectionBinder = injectionBinder;
			}
		}

		public bind(cls: any): InjectionBindInfo {
			let info: InjectionBindInfo = this.injectionBinder.bind(cls);
			info.appId = this.appId;
			if (!this.infos) this.infos = {};
			this.infos[InjectionWrapper.getId(cls)] = info;

			return info;
		}

		public registerInjection(target: any, attName: string): void {
			this.injectionBinder.registerInjection(target, attName);
		}

		/**
		 * 进行注入
		 * @param obj 
		 */
		public inject(obj: any): void {
			this.injectionBinder.inject(obj);
		}

		/**
		 * 解绑
		 * @param cls 
		 */
		public unbind(cls: any) {
			this.injectionBinder.unbind(cls);
			delete this.infos[InjectionWrapper.getId(cls)];
		}

		/**
		 * 从绑定列表中找到指定的绑定信息
		 * @param ctr 指定的构造函数，是绑定信息的键
		 */
		public findBindInfo(ctr: Function): InjectionBindInfo {
			return this.injectionBinder.findBindInfo(ctr);
		}

		dispose(): void {
			for(let k in this.infos){
				this.unbind(this.infos[k].cls);
			}

			this.infos = {};
			this.injectionBinder = null;
		}
	}
}