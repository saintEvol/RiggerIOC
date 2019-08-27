/**
 * 注入绑定器类
 */
declare module riggerIOC {
    class InjectionBinder {
        static readonly instance: InjectionBinder;
        private static mInstance;
        constructor();
        private bindedMap;
        private stringBindedMap;
        /**
         * 绑定一个类或字符串,不会重复绑定，如果已经存在绑定信息，则仅仅返回原来的绑定信息
         *
         * @param ctrOrStr 要绑定类的构造函数,推荐绑定抽象类
         * @return 返回对应的绑定信息
         */
        bind(ctrOrStr: Function | string): InjectionBindInfo;
        bindClass(cls: Function): InjectionBindInfo;
        /**
         * 对字符串进行绑定
         * @param str
         */
        bindString(str: string): InjectionBindInfo;
        private registerKey;
        registerInjection(target: any, attName: string): void;
        getRegisteredInjection(target: any): string[];
        /**
         * 进行注入
         * @param obj
         */
        inject(obj: any): void;
        /**
         * 解绑
         * @param ctrOrStr
         */
        unbind(ctrOrStr: any): void;
        unbindString(str: string): void;
        unbindClass(ctr: Function): void;
        /**
         * 从绑定列表中找到指定的绑定信息
         * @param ctrOrStr 指定的构造函数或字符串，是绑定信息的键
         */
        findBindInfo(ctrOrStr: string | Function): InjectionBindInfo;
        findClassBindInfo(ctr: Function): InjectionBindInfo;
        /**
         * 查找给定字符串的绑定信息
         * @param str
         */
        findStringBindInfo(str: string): InjectionBindInfo;
        private disposeBindInfo;
        private disposeClassBindInfo;
        private disposeStringBindInfo;
    }
}
