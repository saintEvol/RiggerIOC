/**
* name
*/
declare module riggerIOC {
    class WaitForTime extends BaseWaitable {
        protected waitingMSeconds: number;
        constructor();
        /**
         * 设置要等待的秒数，并开始计时
         * 如果未设置任何时间就开始等待，则会永远等待直到被打断(WaitForTime.cancel())
         * @param seconds
         */
        forSeconds(seconds: number, immediately?: boolean): WaitForTime;
        private timerId;
        /**
         * 设置要等待的毫秒数, 并开始计时
         * 如果未设置任何时间就开始等待，则会永远等待直到被打断(WaitForTime.cancel())
         * @param mSeconds
         */
        forMSeconds(mSeconds: number, immediately?: boolean): WaitForTime;
        /**
         * 等一帧
        */
        forFrame(): WaitForTime;
        /**
         * 持续等待直到被打断
        */
        forever(): WaitForTime;
        /**
         * 开始等待，等待之前应该先设置好时间，
         * 如果未设置时间，则会一直等待，直到被打断，效果同:forever().wait()
        */
        wait(): Promise<any>;
        /**
         * 取消等待
         * @param reason
         */
        cancel(reason?: any): void;
    }
}
