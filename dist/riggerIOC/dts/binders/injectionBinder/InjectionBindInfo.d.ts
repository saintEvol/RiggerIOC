declare module riggerIOC {
    class InjectionBindInfo {
        cls: any;
        readonly realClass: any;
        private mBindCls;
        private isSingleton;
        /**
         * 实例，只有当为单例模式时才会给此字段赋值
         */
        private instance;
        /**
         * 是否注入类的实例
         */
        readonly hasInstance: boolean;
        constructor(ctr: Function);
        dispose(): void;
        /**
         * 绑定到目标类
         * @param ctr 目标类的构造函数
         */
        to(ctr: Function): InjectionBindInfo;
        /**
         * 绑定到值，此时会自动进行单例绑定
         * @param value
         */
        toValue(value: any): InjectionBindInfo;
        /**
         * 将绑定设置为单例模式
         */
        toSingleton(): InjectionBindInfo;
        /**
         * 获取实例
         */
        getInstance<T>(): T;
    }
}
