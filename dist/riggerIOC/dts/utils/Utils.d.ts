declare module riggerIOC {
    class Utils {
        /**
         * 判断给定值是否是字符串
         * @param val
         */
        static isString(val: any): val is string;
        /**
         * 是否是数组
         */
        static isArray(arr: any): arr is Array<any>;
        /**
         * 检查是否为空或未定义
         */
        static isNullOrUndefined(obj: any): boolean;
        /**
         * 字符串是否为空或空串
         */
        static isNullOrEmpty(str: string): boolean;
        /**
         * 判断值是否是一个数字(而不管是否可以转化成一个数字)
         * @param {any} value
         */
        static isNumber(value: any): value is number;
    }
}
