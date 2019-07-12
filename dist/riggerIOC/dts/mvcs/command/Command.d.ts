/// <reference path="../../coroutine/BaseWaitable.d.ts" />
declare module riggerIOC {
    interface ICommand {
        /**
         * ????
         */
        execute(...arg: any[]): any;
    }
    abstract class Command implements ICommand {
        abstract execute(...arg: any[]): any;
        dispose(): void;
    }
}
