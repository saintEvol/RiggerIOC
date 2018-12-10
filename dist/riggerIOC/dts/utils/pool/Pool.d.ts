declare module riggerIOC {
    class Pool {
        constructor();
        protected objectPool: {};
        /**
         * 根据对象类型标识字符，获取对象池。
         * @param sign 对象类型标识字符。
         * @return 对象池。
         */
        getPoolBySign(sign: string): Array<any>;
        /**
         * 清除对象池的对象。
         * @param sign 对象类型标识字符。
         */
        clearBySign(sign: string): void;
        /**
         * 将对象放到对应类型标识的对象池中。
         * @param sign 对象类型标识字符。
         * @param item 对象。
         */
        recover<T>(sign: string, item: T): void;
        /**
         * <p>根据传入的对象类型标识字符，获取对象池中此类型标识的一个对象实例。</p>
         * <p>当对象池中无此类型标识的对象时，则根据传入的类型，创建一个新的对象返回。</p>
         * @param sign 对象类型标识字符。
         * @param cls 用于创建该类型对象的类。
         * @return 此类型标识的一个对象。
         */
        getItemByClass<T>(sign: string, cls: any): T;
        /**
         * <p>根据传入的对象类型标识字符，获取对象池中此类型标识的一个对象实例。</p>
         * <p>当对象池中无此类型标识的对象时，则使用传入的创建此类型对象的函数，新建一个对象返回。</p>
         * @param sign 对象类型标识字符。
         * @param createFun 用于创建该类型对象的方法。
         * @return 此类型标识的一个对象。
         */
        getItemByCreateFun<T>(sign: string, createFun: Function): T;
        /**
         * 根据传入的对象类型标识字符，获取对象池中已存储的此类型的一个对象，如果对象池中无此类型的对象，则返回 null 。
         * @param sign 对象类型标识字符。
         * @return 对象池中此类型的一个对象，如果对象池中无此类型的对象，则返回 null 。
         */
        getItem<T>(sign: string): T;
    }
}
