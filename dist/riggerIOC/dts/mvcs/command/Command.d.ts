/// <reference path="../../coroutine/BaseWaitable.d.ts" />
declare module riggerIOC {
    abstract class Command extends BaseWaitable {
        /**
         * 执行命令
         */
        abstract execute(arg?: any): void;
    }
}
