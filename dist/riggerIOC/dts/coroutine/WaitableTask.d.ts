/**
* 一个可以等待的任务基类
*/
declare module riggerIOC {
    class WaitableTask<T> extends BaseWaitable {
        protected mContent: T;
        constructor(content?: T);
        dispose(): void;
        /**
         * 获取任务内容
         */
        /**
        * 设置任务内容
        */
        content: T;
        /**
         * 设置任务内容
         */
        setContent(content: T): WaitableTask<T>;
    }
}
