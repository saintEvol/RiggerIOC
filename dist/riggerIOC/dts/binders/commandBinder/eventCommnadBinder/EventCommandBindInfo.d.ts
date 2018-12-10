declare module riggerIOC {
    class EventCommandBindInfo implements CommandBindInfo {
        message: number | string;
        bindTuples: CommandBindTuple[];
        constructor(msg: number | string);
        /**
         * 绑定到指定命令
         * @param cls
         */
        to(cls: any): EventCommandBindInfo;
        toValue(value: any): CommandBindInfo;
        once(): CommandBindInfo;
        inSequence(): CommandBindInfo;
        /**
         * 将绑定设置为单例模式
         * ！！！对于Command而言，其总是单例的，此接口只是为了提醒使用者
         */
        toSingleton(): InjectionBindInfo;
    }
}
