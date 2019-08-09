declare module riggerIOC {
    class Signal<T> {
        constructor();
        dispose(): void;
        /**
         * 派发信号, 派发信号时附带的参数将被追加到监听函数的参数列表最末尾
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
        on(caller: any, method: (...args: (any | T)[]) => any, args?: any[], recoverBefore?: boolean): void;
        /**
         * 注册一次性回调
         * @param caller
         * @param method
         * @param args
         */
        once(caller: any, method: (...args: (any | T)[]) => any, args?: any[], recoverBefore?: boolean): void;
        /**
         * 取消回调
         * @param caller
         * @param method
         */
        off(caller: any, method: (...args: (any | T)[]) => any): void;
        /**
         * 保证ListenerManager可用
         */
        private makeSureListenerManager;
    }
}
