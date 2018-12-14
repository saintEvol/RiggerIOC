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
* 可被异步等待的接口
*/
module riggerIOC{
	export interface IWaitable{
		reset():IWaitable;

		/** 
		 * 是否已经执行完成
		*/
		isDone():boolean;

		/**
		 * 是否中断了
		 */
		isCanceled():boolean;

		/** 
		 * 获取执行结果
		*/
		getResult():any;

		/** 
		 * 获取中断原因
		*/
		getReason():any;

		/** 
		 * 指示自己已经完成
		*/
		done(result?: any):void;

		/** 
		 * 退出
		*/
		cancel(reason?: any):void;

		/**
		 * 设置完成后的回调
		 * @param fun 
		 */
		setDoneCallback(fun:Action):void

		/**
		 * 设置中断的回调
		 * @param fun 
		 */
		setCancelCallback(fun: Action):void
	}
}