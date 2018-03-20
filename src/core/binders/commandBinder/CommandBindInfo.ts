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
 * 绑定信息类
 */
module riggerIOC{
	export abstract class CommandBindInfo{
		constructor(){

		}

		/**
		 * 将信号绑定到命令，可以重复执行以绑定到多个命令
		 * @param cmdCls 
		 */
		public abstract to(cmdCls:any):CommandBindInfo;

		/**
		 * 绑定到值
		 * @param cmdValue 
		 */
		public abstract toValue(cmdValue:any):CommandBindInfo;

		/**
		 * 设置为一次性绑定
		 */
		public abstract once():CommandBindInfo;

		/**
		 * 设置为顺序命令
		 */
		public abstract inSequence():CommandBindInfo;
	}
}