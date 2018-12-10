/**
 * 信号与命令的绑定信息类
 */
declare module riggerIOC {
    class SignalCommandBindInfo {
        constructor(signal: Signal<any>);
        dispose(): void;
        /**
         * 绑定的信号
         */
        private bindSignal;
        /**
         * 绑定的命令的构造函数列表
         */
        private commandsCls;
        /**
         * 是否是一次性命令
         */
        private isOnce;
        /**
         * 是否要按队列顺序执行
         */
        private isInSequence;
        /**
         * 将信号绑定到命令，可以重复执行以绑定到多个命令
         * @param cmdCls
         */
        to(cmdCls: any): SignalCommandBindInfo;
        /**
         * 绑定到值，此时会自动进行单例绑定
         * @param value
         */
        toValue(value: any): this;
        /**
         * 设置为一次性绑定
         */
        once(): SignalCommandBindInfo;
        /**
         * 设置为顺序命令
         */
        inSequence(): SignalCommandBindInfo;
        private onSignal;
        /**
         * 执行绑定的命令
         * @param arg
         */
        private executeCommands;
    }
}
