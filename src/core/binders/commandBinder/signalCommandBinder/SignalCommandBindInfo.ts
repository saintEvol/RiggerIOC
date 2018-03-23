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
 * 信号与命令的绑定信息类
 */
module riggerIOC{
	class CommandInfo {
		cls:any;
		inst:any;
	}
	export class SignalCommandBindInfo{

		constructor(signal:Signal<any>){
			this.commandsCls = [];
			this.bindSignal = signal;
			this.isOnce = false;
			this.isInSequence = false;
			signal.on(this, this.onSignal);
		}

		public dispose(){
			this.bindSignal.off(this, this.onSignal);
			this.bindSignal.dispose();
			this.bindSignal = null;
			this.commandsCls = null;
		}

		/**
		 * 绑定的信号
		 */
		private bindSignal:Signal<any>;

		/**
		 * 绑定的命令的构造函数列表
		 */
		private commandsCls:CommandInfo[];

		/**
		 * 是否是一次性命令
		 */
		private isOnce:boolean;

		/**
		 * 是否要按队列顺序执行
		 */
		private isInSequence:boolean;

		/**
		 * 将信号绑定到命令，可以重复执行以绑定到多个命令
		 * @param cmdCls 
		 */
		public to(cmdCls:any):SignalCommandBindInfo{
			this.commandsCls.push({cls:cmdCls, inst:null});
			return this;
		}

		/**
		 * 绑定到值，此时会自动进行单例绑定
		 * @param value 
		 */
		public toValue(value:any){
			// this.toSingleton();
			this.commandsCls.push({cls:null, inst:value});
			return this;
		}

		/**
		 * 设置为一次性绑定
		 */
		public once():SignalCommandBindInfo{
			this.isOnce = true;
			return this;
		}

		/**
		 * 设置为顺序命令
		 */
		public inSequence():SignalCommandBindInfo{
			this.isInSequence = true;
			return this;
		}

		private onSignal(arg?:any){
			this.executeCommands(arg);
		}

		/**
		 * 执行绑定的命令
		 * @param arg 
		 */
		private async executeCommands(arg?:any){
			for(var i:number = 0; i < this.commandsCls.length; ++i){
				let cmd:Command;
				let cmdInfo:CommandInfo = this.commandsCls[i];
				if(cmdInfo.inst){
					cmd = cmdInfo.inst;
				}else{
					cmd = new cmdInfo.cls();
				} 

				cmd.execute(arg);
				if(this.isInSequence){
					await waitFor(cmd);
				}
			}

			// 如果是一次性的，则释放
			if(this.isOnce) this.dispose();
		}
	}
}