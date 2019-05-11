/// <reference path="../../coroutine/BaseWaitable.d.ts" />
/**
 * 这是一个可等待的命令（异步)
 */
declare module riggerIOC {
    abstract class WaitableCommand extends BaseWaitable implements ICommand {
        /**
         * 执行命令
         */
        abstract execute(...arg: any[]): void;
    }
}
