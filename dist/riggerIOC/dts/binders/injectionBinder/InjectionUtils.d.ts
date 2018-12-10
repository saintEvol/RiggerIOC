declare module riggerIOC {
    function inject(ctr: any): (target: any, attrName: string, descripter?: any) => void;
}
