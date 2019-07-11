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
module riggerIOC {
	class CommandInfo {
		cls: any;
		inst: Command;
	}
	export class SignalCommandBindInfo {

		constructor(signal: Signal<any>, injectionBinder: InjectionBinder = null) {
			this.appInjectionBinder = injectionBinder;
			this.commandsCls = [];
			this.bindSignal = signal;
			this.isOnce = false;
			this.isInSequence = false;
			signal.on(this, this.onSignal);
		}

		/**
		 * 析构时会取消信号的监听，但不会直接析构信号
		 */
		public dispose() {
			this.appInjectionBinder = null;
			this.bindSignal && this.bindSignal.off(this, this.onSignal);
			// this.bindSignal.dispose();
			this.bindSignal = null;
			this.commandsCls = [];

			//是否有正在执行的命令序列
			if (this.executingCommand) {
				this.executingCommand.cancel("canceled by riggIOC");
			}
		}

		public get injectionBinder(): InjectionBinder{
			return this.appInjectionBinder || InjectionBinder.instance;
		}
		protected appInjectionBinder: InjectionBinder = null;

		/**
		 * 绑定的信号
		 */
		private bindSignal: Signal<any>;

		/**
		 * 绑定的命令的构造函数列表
		 */
		private commandsCls: CommandInfo[];

		/**
		 * 是否是一次性命令
		 */
		private isOnce: boolean;

		/**
		 * 是否要按队列顺序执行
		 */
		private isInSequence: boolean;

		/**
		 * 将信号绑定到命令，可以重复执行以绑定到多个命令
		 * @param cmdCls 
		 */
		public to(cmdCls: any): SignalCommandBindInfo {
			this.injectionBinder.bind(cmdCls);
			this.commandsCls.push({ cls: cmdCls, inst: null });

			return this;
		}

		/**
		 * 绑定到值，此时会自动进行单例绑定
		 * 绑定到值的命令，在命令绑定器回收时，会自动析构命令
		 * @param value 
		 */
		public toValue(value: Command) {
			// this.toSingleton();
			// InjectionBinder.instance.bind(cmdCls);			
			this.commandsCls.push({ cls: null, inst: value });
			return this;
		}

		/**
		 * 设置为一次性绑定
		 */
		public once(): SignalCommandBindInfo {
			this.isOnce = true;
			return this;
		}

		/**
		 * 设置为顺序命令
		 */
		public inSequence(): SignalCommandBindInfo {
			this.isInSequence = true;
			return this;
		}

		private onSignal(arg?: any) {
			if (this.isInSequence) {
				this.executeWaitableCommands(arg);
			}
			else {
				this.executeCommands(arg);
			}
		}

		/**
		 * 执行绑定的命令, 如果命令序列中有WaitableCommand会抛错
		 * @param arg 
		 */
		private executeCommands(arg: any) {
			let ret = null;
			let cmd: ICommand;
			let cmdInfo: CommandInfo;
			let canDispose: boolean = false;
			let injectionInfo: InjectionBindInfo;
			for (var i: number = 0; i < this.commandsCls.length; ++i) {
				cmdInfo = this.commandsCls[i];
				if (cmdInfo.inst) {
					cmd = cmdInfo.inst;
				} else {
					injectionInfo = this.injectionBinder.bind(cmdInfo.cls);
					canDispose = injectionInfo.isInstanceTemporary();
					cmd = injectionInfo.getInstance() as ICommand;
				}

				ret = cmd.execute(arg, ret);
				if (riggerIOC.needAutoDispose(cmd) && canDispose) {
					riggerIOC.doAutoDispose(cmd);
					canDispose = false;
				}
			}

			// 如果是一次性的，则释放
			if (this.isOnce) this.dispose();
		}

		private executingCommand: WaitableCommand = null;
		private async executeWaitableCommands(arg: any) {
			let ret = null;
			let cmd: ICommand;
			let cmdInfo: CommandInfo;
			let canDispose: boolean;
			let injectionBindInfo: InjectionBindInfo;

			for (var i: number = 0; i < this.commandsCls.length; ++i) {
				cmdInfo = this.commandsCls[i];
				if (cmdInfo.inst) {
					cmd = cmdInfo.inst;
				} else {
					injectionBindInfo = this.injectionBinder.bind(cmdInfo.cls);
					canDispose = injectionBindInfo.isInstanceTemporary();
					cmd = injectionBindInfo.getInstance() as ICommand;
				}

				// arg = arg == null || arg == undefined ? [] : arg;
				if (cmd instanceof WaitableCommand) {
					this.executingCommand = cmd;
					cmd.execute(arg, ret);
					let result: Result = await cmd.wait();

					if (riggerIOC.needAutoDispose(cmd) && canDispose) {
						riggerIOC.doAutoDispose(cmd);
					}

					if (result.isOk) {
						ret = result.result;
						this.executingCommand = null;
					}
					else {
						// 执行失败打断,停止后续执行
						this.executingCommand = null;
						break;
					}
				}
				else {
					ret = cmd.execute(arg, ret);

					if (riggerIOC.needAutoDispose(cmd) && canDispose) {
						riggerIOC.doAutoDispose(cmd);
					}
				}

			}

			cmd = cmdInfo = null;
			this.executingCommand = null;

			// 如果是一次性的，则释放
			if (this.isOnce) this.dispose();
		}
	}
}