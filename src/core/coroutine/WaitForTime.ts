/**
* name 
*/
module riggerIOC {
	export class WaitForTime extends BaseWaitable {
		protected waitingMSeconds: number = null;

		constructor() {
			super();
		}

		/**
		 * 设置要等待的秒数，并开始计时
		 * 如果未设置任何时间就开始等待，则会永远等待直到被打断(WaitForTime.cancel())
		 * @param seconds 
		 */
		forSeconds(seconds: number, immediately: boolean = true): WaitForTime {
			return this.forMSeconds(seconds * 1000, immediately)
		}

		private timerId: number = null;
		/**
		 * 设置要等待的毫秒数, 并开始计时
		 * 如果未设置任何时间就开始等待，则会永远等待直到被打断(WaitForTime.cancel())
		 * @param mSeconds 
		 */
		forMSeconds(mSeconds: number, immediately: boolean = true): WaitForTime {
			if (this.timerId !== null) return;

			if (immediately) {
				this.waitingMSeconds = null;
				let obj: WaitForTime = this;
				this.timerId = setTimeout(() => {
					obj.timerId = null;
					obj.done();
					obj = null;
				}, mSeconds)
			}
			else {
				this.waitingMSeconds = mSeconds
			}


			return this;
		}

		/** 
		 * 等一帧
		*/
		forFrame(): WaitForTime {
			return this.forMSeconds(0);
		}

		/** 
		 * 持续等待直到被打断
		*/
		forever(): WaitForTime {
			if(this.timerId) clearTimeout(this.timerId)
			this.timerId = null;
			this.waitingMSeconds = null;

			return this;
		}

		/** 
		 * 开始等待，等待之前应该先设置好时间，
		 * 如果未设置时间，则会一直等待，直到被打断，效果同:forever().wait()
		*/
		wait() {
			if (this.timerId == null && this.waitingMSeconds != null && !this.isWaitting) {
				this.forMSeconds(this.waitingMSeconds);
			}
			return super.wait()
		}

		/**
		 * 取消等待
		 * @param reason 
		 */
		cancel(reason?) {
			this.waitingMSeconds = null;
			if (this.timerId !== null) clearTimeout(this.timerId);
			this.timerId = null;
			super.cancel(reason);
		}
	}
}