/**
 * 信号与命令的绑定信息类
 */
declare module riggerIOC {
    class SignalCommandBindInfo {
        constructor(signal: Signal<any>, injectionBinder?: InjectionBinder);
        /**
         * 析构时会取消信号的监听，但不会直接析构信号
         */
        dispose(): void;
        readonly injectionBinder: InjectionBinder;
        protected appInjectionBinder: InjectionBinder;
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
         * 绑定到值的命令，在命令绑定器回收时，会自动析构命令
         * @param value
         */
        toValue(value: Command): this;
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
         * 执行绑定的命令, 如果命令序列中有WaitableCommand会抛错
         * @param arg
         */
        private executeCommands;
        private executingCommand;
        private executeWaitableCommands;
    }
}
