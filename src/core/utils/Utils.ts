module riggerIOC {
    export class Utils {
        /**
         * 判断给定值是否是字符串
         * @param val 
         */
        public static isString(val: any): val is string{
            return typeof val === "string";
        }

        /**
         * 是否是数组
         */
        public static isArray(arr: any): arr is Array<any> {
            return arr instanceof Array;
        }

        /**
         * 检查是否为空或未定义
         */
        public static isNullOrUndefined(obj: any) {
            return obj === null || obj === undefined;
        }

        /**
         * 字符串是否为空或空串
         */
        public static isNullOrEmpty(str: string): boolean {
            return Utils.isNullOrUndefined(str) || str.length <= 0;
        }

        /**
         * 判断值是否是一个数字(而不管是否可以转化成一个数字)
         * @param {any} value 
         */
        public static isNumber(value: any): value is number {
            if (Utils.isNullOrUndefined(value)) return false;
            if (Utils.isString(value)) return false;
            return !isNaN(value);
        }
    }
}