declare module riggerIOC {
    class SignalCommandBinder implements CommandBinder {
        constructor();
        /**
         * 绑定一个信号
         * 绑定后，信号将被注入为单例模式，并且同时会立即产生一个实例
         * @param cls
         */
        bind(cls: any): SignalCommandBindInfo;
    }
}
