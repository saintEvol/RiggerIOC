/**
* 任务执行器的并行锁
* 辅助确保所有任务并行执行时，都执行完毕或被打断
*/
declare module riggerIOC {
    class TaskExecutorLock extends BaseWaitable {
        protected totalTaskNum: number;
        protected doneNum: number;
        protected canceledNum: number;
        constructor(totalNum: number);
        adjustTotalNum(num: number): void;
        done(): void;
        cancel(): void;
        protected check(): void;
    }
}
