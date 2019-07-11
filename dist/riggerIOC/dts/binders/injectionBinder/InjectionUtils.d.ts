declare module riggerIOC {
    /**
     * 类装饰器，使类可以自动释放
     * 当用此装饰器装饰了类型时：
     * 1. 当其所属注入器被释放时，会自动调用对象的dispose()进行释放(如果有实现)
     * 2. 释放时，会自动将注入的属性置为null
     */
    function autoDispose(constructor: any): void;
    /**
     * 是否满足自动释放的条件（引用计数,是否设置了自动释放)
     * @param obj
     */
    function needAutoDispose(obj: any): boolean;
    function doAutoDispose(obj: any): void;
    /**
     * 注入装饰器
     * @param ctr
     */
    function inject(ctr: any): (target: any, attrName: string, descripter?: any) => void;
    /**
     * 反向映射装饰器,即以字段的值为键，以字段的键为值建立一个新的字段，只推荐常量用
     */
    function retrievAble(v?: number): (target: any, keyStr: string) => void;
    function addRefCount(obj: any, acc?: number): void;
}
