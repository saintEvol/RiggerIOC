declare module riggerIOC {
    class Signal<T> {
        constructor();
        dispose(): void;
        /**
         * 派发信号
         * @param arg
         */
        dispatch(arg?: T): void;
        private listenerMgr;
        /**
         * 注册回调
         * @param caller
         * @param method
         * @param args
         */
        on(caller: any, method: (arg: T, ...args: any[]) => any, ...args: any[]): void;
        /**
         * 注册一次性回调
         * @param caller
         * @param method
         * @param args
         */
        once(caller: any, method: (arg: T, ...args: any[]) => any, ...args: any[]): void;
        /**
         * 取消回调
         * @param caller
         * @param method
         */
        off(caller: any, method: (arg: T, ...args: any[]) => any): void;
        /**
         * 保证ListenerManager可用
         */
        private makeSureListenerManager;
    }
}
