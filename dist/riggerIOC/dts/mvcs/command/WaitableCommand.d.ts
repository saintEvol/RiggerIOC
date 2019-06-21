/// <reference path="../../coroutine/SafeWaitable.d.ts" />
/**
 * 这是一个可等待的命令（异步)
 */
declare module riggerIOC {
    abstract class WaitableCommand extends SafeWaitable implements ICommand {
        cancel(reason?: any): void;
        /**
         * 执行命令
         */
        abstract execute(...arg: any[]): void;
        onCancel(reason?: any): void;
    }
}
