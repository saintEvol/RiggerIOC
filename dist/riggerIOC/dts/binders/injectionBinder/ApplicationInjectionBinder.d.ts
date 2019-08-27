declare module riggerIOC {
    class ApplicationInjectionBinder extends InjectionBinder {
        appId: string | number;
        protected infos: {
            [bindId: string]: InjectionBindInfo;
        };
        protected stringBindInfos: {
            [bindId: string]: InjectionBindInfo;
        };
        protected injectionBinder: InjectionBinder;
        protected owner: any;
        constructor(appId: string | number, injectionBinder: InjectionBinder | ApplicationInjectionBinder, owner?: any);
        bind(ctrOrStr: Function | string): InjectionBindInfo;
        /**
         * debug 版
         * @param ctrOrStr
         */
        bindDebug(ctrOrStr: Function | string): InjectionBindInfo;
        /**
         * 注册注入
         * @param target
         * @param attName
         */
        registerInjection(target: any, attName: string): void;
        /**
         * 进行注入
         * @param obj
         */
        inject(obj: any): void;
        /**
         * 解绑
         * @param ctrOrStr
         */
        unbind(ctrOrStr: Function | string): void;
        unbindClass(ctr: Function): void;
        unbindString(str: string): void;
        /**
         * 从绑定列表中找到指定的绑定信息
         * @param ctrOrStr 指定的构造函数或字符串，是绑定信息的键
         */
        findBindInfo(ctrOrStr: Function | string): InjectionBindInfo;
        dispose(): void;
        /**
         * 增加绑定信息
         * @param ctrOrStr
         * @param info
         */
        private addStringBindInfo;
        private addClassBindInfo;
        /**
         * 移除绑定信息
         * @param ctrOrStr
         */
        private removeStringBindInfo;
        private removeClassBindInfo;
    }
    function setApplicationInjectionBinderDebug(): void;
}
