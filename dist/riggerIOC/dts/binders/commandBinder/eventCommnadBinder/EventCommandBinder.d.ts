/**
* 消息与命令的绑定器
* 一个消息可以同时绑定多个命令(即一个消息可以导致多个命令的执行)
* 但一个命令不能同时被绑定到多个消息
*/
declare module riggerIOC {
    class EventCommandBinder extends CommandBinder {
        constructor(injectionBinder: InjectionBinder);
        private commandsMap;
        dispose(): void;
        /**
         * 绑定消息
         * @param msg
         */
        bind(msg: number | string): EventCommandBindInfo;
        unbind(event: string | number): void;
        /**
         * 查找绑定消息
         * @param msg
         */
        findBindInfo(msg: string | number): EventCommandBindInfo;
    }
}
