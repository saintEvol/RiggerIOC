/// <reference path="../pool/Pool.d.ts" />
declare module riggerIOC {
    class Handler {
        static readonly pool: Pool;
        private static m_pool;
        protected _id: number;
        readonly caller: any;
        private _caller;
        readonly method: Function;
        private _method;
        readonly ifOnce: boolean;
        private _ifOnce;
        readonly args: any[];
        private _args;
        constructor(caller: any, func: Function, args?: any[], once?: boolean);
        dispose(): void;
        private static riggerHandlerSign;
        static create(caller: any, fun: Function, args?: any[], once?: boolean): Handler;
        /**
         * 将一个RiggerHandler回收到对象池
         * @param handler
         */
        static recover(handler: Handler): void;
        /**
         * 替换
         * @param caller
         * @param method
         * @param args
         * @param once
         */
        replace(caller: any, method: Function, args?: any[], once?: boolean): void;
        /**
         * 将自身回收至对象池
         */
        recover(): void;
        once(): void;
        /**
         * 是否可以覆盖
         * @param caller
         * @param method
         */
        canReplace(caller: any, method: any): boolean;
        /**
         * 无参执行
         */
        run(): any;
        /**
         *
         */
        /**
         * 带参执行
         * @param args
         */
        runWith(args: any[]): any;
    }
}
