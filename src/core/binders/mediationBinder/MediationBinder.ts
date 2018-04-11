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

/**
* Mediator绑定器
*/
module riggerIOC {
	export class MediationBinder {
		constructor() {

		}

		private mInfos: MediationBindInfo[];
		private bindTuples:ViewMediatorTuple[];

		/**
		 * 
		 * 
		 * @param cls 
		 */
		bind(cls: any): MediationBindInfo {
			if (!this.mInfos) this.mInfos = [];
			let info: MediationBindInfo = this.findBindInfo(cls);
			if (!info) {
				info = new MediationBindInfo(cls);
				this.mInfos.push(info);
			}

			return info;
		}

		/**
		 * 根据视图信息获取其绑定的Mediator实例
		 * @param viewCls 视图类的构造函数
		 * @param view 视图的实例
		 */
		public createAndAttach(viewCls: any, view: View): Mediator {
			let info: MediationBindInfo = this.findBindInfo(viewCls);
			if (!info) return null;
			if (!info.bindMediatorConstructor) return null;

			// 注入VIEW
			let injectionInfo: InjectionBindInfo = InjectionBinder.instance.bind(viewCls);
			if (!injectionInfo.hasInstance) {
				injectionInfo.toValue(view);
			}
			let inst: Mediator = InjectionBinder.instance.bind(info.bindMediatorConstructor).getInstance<Mediator>();
			InjectionBinder.instance.inject(inst);
			// 取消绑定
			injectionInfo.toValue(null);
			this.addBindTuple(view, inst);

			return inst;
		}

		/**
		 * 将视图与mediator分离
		 * @param view 
		 * @param mediator 
		 */
		public detach(view:View, mediator:Mediator){
			let tuples:ViewMediatorTuple[] = this.bindTuples;
			if(!tuples) return;
			let len:number = tuples.length;
			if(len <= 0) return;
			let temp:ViewMediatorTuple[] = [];
			for(var i:number = 0; i < len; ++i){
				if(tuples[i].view === view){
					tuples[i].dispose();
				}
				else{
					temp.push(tuples[i]);
				}
			}

			this.bindTuples = temp;
		}

		/**
		 * 获取已经和视图绑定的mediator实例
		 * @param view 
		 */
		public getAttachedMediatorInstance(view:View):Mediator{
			let tuples:ViewMediatorTuple[] = this.bindTuples;
			if(!tuples) return null;
			let len:number = tuples.length;
			if(len <= 0) return null;
			for(var i:number = 0; i < len; ++i){
				if(tuples[i].view === view){
					return tuples[i].mediator;
				}
			}

			return null;
		}

		/**
		 * 查找绑定信息
		 * @param viewCls 
		 */
		private findBindInfo(viewCls: any): MediationBindInfo {
			let infos: MediationBindInfo[] = this.mInfos;
			if (!infos || infos.length <= 0) return null;
			let len: number = infos.length;
			for (var i: number = 0; i < len; ++i) {
				if (viewCls === infos[i].viewConstructor) return infos[i];
			}

			return null;
		}

		private addBindTuple(view:View, mediator:Mediator):void{
			if(!this.bindTuples) this.bindTuples = [];
			this.bindTuples.push(new ViewMediatorTuple(view, mediator));
		}

	}
}