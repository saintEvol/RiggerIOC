declare module riggerIOC {
    var debug: boolean;
    class InjectionTrackOwnerShip {
        constructor();
        /**
         * 被引用了多少次(当前)
         */
        refNum: number;
        /**
         * 被注入的名字（总）
         */
        totalInjectionNames: string[];
        /**
         * 至查询时仍然被注入的名字(当前)
         */
        injectionName: string[];
        add(name: string): void;
        remove(name: string): void;
    }
    /**
     * 注入跟踪信息，用于调试
     */
    class InjectionTrack {
        constructor(inst: any, isInjected?: boolean);
        /**
         * 此对象是否是直接注入产生
         */
        isInjected: boolean;
        /**
         * 类名
         */
        typeName: string;
        /**
         * 实例对象
         */
        inst: any;
        /**
         * 曾被注入到过的对象的追踪信息
         */
        owners: InjectionTrack[];
        /**
         * 当前的所有权关系描述
         */
        ownershipStates: InjectionTrackOwnerShip[];
        /**
         * 注入错误
         */
        injectError: Error;
        /**
         * 析构错误
         */
        disposeError: Error;
        /**
         * 是否已经被析构
         */
        disposeFlag: boolean;
        /**
         * 所有仍然粘住未释放的所有者(仍然引用本对象的所有者)
         *
         */
        readonly stickyOwners: [InjectionTrack, InjectionTrackOwnerShip][];
        toString(): string;
    }
    /**
     * 插入指定对象的注入追踪信息，如果已有，则无操作
     * @param obj
     * @param isInjected
     */
    function insertInjectionTrack(obj: any, isInjected?: boolean): InjectionTrack;
    /**
     * 获取指定对象的追踪信息，可能返回null
     * @param obj
     */
    function getInjectionTrack(obj: any, pool?: InjectionTrack[]): InjectionTrack;
    function getInjectionTrackPool(obj: any): InjectionTrack[];
    function setAppId(obj: any, appId: string | number): void;
    function getAppId(obj: any): string | number;
    /**
     *
     * @param obj
     * @param attrName
     * @param owner
     * @param acc
     * @param ifInjected
     */
    function addOwnerShip(obj: any, attrName: string, owner: any, acc?: number, ifInjected?: boolean): void;
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
    function hackDispose(disposeFun: Function): () => void;
    /**
     * 此版本会记录析构过程中出现的错误
     * @param disposeFun
     */
    function hackDisposeDebug(disposeFun: Function): () => void;
    function getDisposeError(obj: any): Error;
    function setDisposeError(obj: any, error: Error): void;
    /**
     * 获取该对象是否已经被析构过
     * @param obj
     */
    function getDisposeFlag(obj: any): boolean;
    /**
     * 设置析构标记
     * @param obj
     * @param flag
     */
    function setDisposeFlag(obj: any, flag?: boolean): void;
    /**
     * 注入装饰器
     * @param ctr
     */
    function inject(ctr: Function | string): (target: any, attrName: string, descripter?: any) => void;
    /**
     * 反向映射装饰器,即以字段的值为键，以字段的键为值建立一个新的字段，只推荐常量用
     */
    function retrievAble(v?: number): (target: any, keyStr: string) => void;
    function addRefCount(obj: any, acc?: number): void;
    function getRefCount(obj: any): number;
    function clearRefCount(obj: any): void;
    /**
     * 对getter/setter方法进行注入
     * @param key
     * @param taget
     * @param attrName
     * @param descripter
     */
    function doInjectGetterSetter(key: any, target: any, attrName: string, descripter: any): void;
    /**
     * 对成员属性进行注入
     * @param key 构造函数
     * @param target 原型对象
     * @param attrName 属性名
     */
    function doInjectAttr(key: Function | string, target: any, attrName: string): void;
    function setDebug(): void;
}
