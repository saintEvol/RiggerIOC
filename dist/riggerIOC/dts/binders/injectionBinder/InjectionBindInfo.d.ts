declare module riggerIOC {
    class InjectionBindInfo {
        appId: string | number;
        cls: any;
        readonly realClass: any;
        private mBindCls;
        private isSingleton;
        /**
         * 实例，只有当为单例模式时才会给此字段赋值
         */
        private instance;
        private mInstance;
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
        private isToValue;
        /**
         * 绑定到值，此时会自动进行单例绑定
         * 可以绑定为null 或 undefined
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
