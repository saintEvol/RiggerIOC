declare module riggerIOC {
    /**
     * 一个可以安全打断的可等类型
     * 此类型的可等待对象，在正常执行或被打断时都返回一个 Result<T, M>类型的对象
     */
    class SafeWaitable<T = any, U = any> extends BaseWaitable {
        done(reason?: any): void;
        cancel(reason?: any): void;
    }
}
