/**
* 任务执行器的并行锁
* 辅助确保所有任务并行执行时，都执行完毕或被打断
*/
module riggerIOC{
	export class TaskExecutorLock extends BaseWaitable{
		protected totalTaskNum:number = 0;
		protected doneNum: number = 0;
		protected canceledNum: number = 0;

		constructor(totalNum:number){
			super();
			this.totalTaskNum = totalNum;
			this.doneNum = 0;
			this.canceledNum = 0;
		}

		adjustTotalNum(num: number):void{
			this.totalTaskNum = num;
			this.check();
		}

		done(){
			++this.doneNum;
			this.check();
		}

		cancel(){
			++this.canceledNum;
			this.check();
		}

		protected check(){
			if(this.doneNum + this.canceledNum >= this.totalTaskNum){
				if(this.canceledNum > 0){
					super.cancel();
				}
				else{
					super.done();
				}
			}
		}
	}
}