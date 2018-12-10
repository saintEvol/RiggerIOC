/**
 * 注入绑定器类
 */
declare module riggerIOC {
    class InjectionBinder {
        static readonly instance: InjectionBinder;
        private static mInstance;
        constructor();
        private bindedArray;
        /**
         * 绑定一个类,类不会重复绑定，如果已经存在绑定信息，则仅仅返回原来的绑定信息
         *
         * @param ctr 要绑定类的构造函数,推荐绑定抽象类
         * @return 返回对应的绑定信息
         */
        bind(cls: any): InjectionBindInfo;
        private registerKey;
        registerInjection(target: any, attName: string): void;
        /**
         * 进行注入
         * @param obj
         */
        inject(obj: any): void;
        /**
         * 解绑
         * @param cls
         */
        unbind(cls: any): void;
        /**
         * 从绑定列表中找到指定的绑定信息
         * @param ctr 指定的构造函数，是绑定信息的键
         */
        findBindInfo(ctr: Function): InjectionBindInfo;
        private disposeBindInfo;
    }
}
