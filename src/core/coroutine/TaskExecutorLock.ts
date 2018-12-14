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
* 任务执行器的并行锁
* 辅助确保所有任务并行执行时，都执行完毕或被打断
*/
module riggerIOC {
	export class TaskExecutorLock extends BaseWaitable {
		protected totalTaskNum: number = 0;
		protected doneNum: number = 0;
		protected canceledNum: number = 0;

		constructor(totalNum: number) {
			super();
			this.totalTaskNum = totalNum;
			this.doneNum = 0;
			this.canceledNum = 0;
		}

		adjustTotalNum(num: number): void {
			this.totalTaskNum = num;
			this.check();
		}

		done() {
			++this.doneNum;
			this.check();
		}

		cancel() {
			++this.canceledNum;
			this.check();
		}

		protected check() {
			if (this.doneNum + this.canceledNum >= this.totalTaskNum) {
				if (this.canceledNum > 0) {
					super.cancel();
				}
				else {
					super.done();
				}
			}
		}
	}
}