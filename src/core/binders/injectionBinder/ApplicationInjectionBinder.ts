module riggerIOC {
	export class ApplicationInjectionBinder extends InjectionBinder {
		public appId: string | number;
		protected infos: { [bindId: string]: InjectionBindInfo } = {};
		protected injectionBinder: InjectionBinder;
		protected owner: any;
		constructor(appId: string | number, injectionBinder: InjectionBinder | ApplicationInjectionBinder, owner?: any) {
			super();
			this.appId = appId;
			this.owner = owner;
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
			let bindId: string | number = InjectionWrapper.getId(cls);
			this.infos[bindId] = info;

			// 如果是debug状态，则进行统计
			if (ApplicationContext.debug) {
				let app: ApplicationContext = ApplicationContext.getApplication(this.appId);
				let old = app.injectionStatistics[bindId] || [];
				// 移除owner一样的
				let owner = this.owner;
				old = old.filter((v, idx, arr) => v.owner !== owner);
				old.push(new InjectionStatistics(bindId, owner, cls));
				app.injectionStatistics[bindId] = old;
			}

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
			for (let k in this.infos) {
				this.unbind(this.infos[k].cls);
			}

			this.infos = {};
			this.injectionBinder = null;
			this.owner = null;
		}
	}
}