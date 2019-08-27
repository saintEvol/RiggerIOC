module riggerIOC {
	export class ApplicationInjectionBinder extends InjectionBinder {
		public appId: string | number;
		protected infos: { [bindId: string]: InjectionBindInfo } = {};
		protected stringBindInfos: { [bindId: string]: InjectionBindInfo } = {};
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


		public bind(ctrOrStr: Function | string): InjectionBindInfo {
			let info: InjectionBindInfo;
			if (Utils.isString(ctrOrStr)) {
				info = this.injectionBinder.bindString(ctrOrStr);
				this.addStringBindInfo(ctrOrStr, info);
			}
			else {
				info = this.injectionBinder.bindClass(ctrOrStr);
				this.addClassBindInfo(ctrOrStr, info);
			}

			return info;
		}

		/**
		 * debug 版
		 * @param ctrOrStr 
		 */
		public bindDebug(ctrOrStr: Function | string): InjectionBindInfo {
			let info: InjectionBindInfo;
			if (Utils.isString(ctrOrStr)) {
				info = this.injectionBinder.bindString(ctrOrStr);
				this.addStringBindInfo(ctrOrStr, info);
			}
			else {
				info = this.injectionBinder.bindClass(ctrOrStr);
				this.addClassBindInfo(ctrOrStr, info);
			}

			info.appId = this.appId;

			return info;
		}

		/**
		 * 注册注入
		 * @param target 
		 * @param attName 
		 */
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
		 * @param ctrOrStr 
		 */
		public unbind(ctrOrStr: Function | string): void {
			if (Utils.isString(ctrOrStr)) {
				this.unbindString(ctrOrStr);
			}
			else {
				this.unbindClass(ctrOrStr);
			}
		}

		public unbindClass(ctr: Function): void {
			this.removeClassBindInfo(ctr);
			this.injectionBinder.unbindClass(ctr);
		}

		public unbindString(str: string): void {
			this.removeStringBindInfo(str);
			this.injectionBinder.unbindString(str);
		}



		/**
		 * 从绑定列表中找到指定的绑定信息
		 * @param ctrOrStr 指定的构造函数或字符串，是绑定信息的键
		 */
		public findBindInfo(ctrOrStr: Function | string): InjectionBindInfo {
			return this.injectionBinder.findBindInfo(ctrOrStr);
		}

		dispose(): void {
			for (let k in this.infos) {
				this.unbindClass(this.infos[k].cls as Function);
			}

			for (let k in this.stringBindInfos) {
				this.unbindString(this.stringBindInfos[k].cls as string);
			}

			this.infos = {};
			this.stringBindInfos = {};
			this.injectionBinder = null;
			this.owner = null;
		}

		/**
		 * 增加绑定信息
		 * @param ctrOrStr 
		 * @param info 
		 */
		// private addBindInfo(ctrOrStr: Function | string, info: InjectionBindInfo): void {
		// 	if (Utils.isString(ctrOrStr)) {
		// 		this.addStringBindInfo(ctrOrStr, info);
		// 	}
		// 	else {
		// 		this.addClassBindInfo(ctrOrStr, info);
		// 	}
		// }

		private addStringBindInfo(str: string, info: InjectionBindInfo): void {
			if (!this.stringBindInfos) this.stringBindInfos = {};
			this.stringBindInfos[str] = info;
		}

		private addClassBindInfo(ctr: Function, info: InjectionBindInfo): void {
			if (!this.infos) this.infos = {};
			let bindId: string | number = InjectionWrapper.getId(ctr);
			this.infos[bindId] = info;
		}

		/**
		 * 移除绑定信息
		 * @param ctrOrStr 
		 */
		// private removeBindInfo(ctrOrStr: Function | string): void {
		// 	if (Utils.isString(ctrOrStr)) {
		// 		this.removeStringBindInfo(ctrOrStr);
		// 	}
		// 	else {
		// 		this.removeClassBindInfo(ctrOrStr);
		// 	}
		// }

		private removeStringBindInfo(str: string): void {
			delete this.stringBindInfos[str];
		}

		private removeClassBindInfo(ctr: Function): void {
			delete this.infos[InjectionWrapper.getId(ctr)];
		}
	}

	export function setApplicationInjectionBinderDebug() {
		ApplicationInjectionBinder.prototype.bind = ApplicationInjectionBinder.prototype.bindDebug;
	}
}