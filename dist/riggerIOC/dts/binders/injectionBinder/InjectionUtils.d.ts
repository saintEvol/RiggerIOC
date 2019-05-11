declare module riggerIOC {
    /**
     * 注入装饰器
     * @param ctr
     */
    function inject(ctr: any): (target: any, attrName: string, descripter?: any) => void;
    /**
     * 反向映射装饰器,即以字段的值为键，以字段的键为值建立一个新的字段，只推荐常量用
     */
    function retrievAble(v?: number): (target: any, keyStr: string) => void;
}
