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
* 一个可以等待的任务基类
*/
module riggerIOC {
	export class WaitableTask<T> extends BaseWaitable {
		protected mContent: T = null;
		constructor(content: T = null) {
			super();
			this.setContent(content);
		}

		dispose():void{
			this.mContent = null;
			super.dispose();
		}

		/**
		 * 获取任务内容
		 */
		public get content():T{
			return this.mContent;
		}

		/**
		 * 设置任务内容
		 */
		public set content(content: T){
			this.setContent(content);
		}

		/**
		 * 设置任务内容
		 */
		setContent(content: T): WaitableTask<T>{
			this.mContent = content;
			return this;
		}
	}
}