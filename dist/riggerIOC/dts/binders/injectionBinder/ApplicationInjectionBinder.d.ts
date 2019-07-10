declare module riggerIOC {
    class ApplicationInjectionBinder extends InjectionBinder {
        appId: string | number;
        protected infos: {
            [bindId: string]: InjectionBindInfo;
        };
        protected injectionBinder: InjectionBinder;
        protected owner: any;
        constructor(appId: string | number, injectionBinder: InjectionBinder | ApplicationInjectionBinder, owner?: any);
        bind(cls: any): InjectionBindInfo;
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
        dispose(): void;
    }
}
