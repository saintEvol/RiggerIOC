declare module riggerIOC {
    interface Action {
        (): void;
    }
    interface OneParamsAction {
        (p?: any): void;
    }
    /**
     * 等下一帧，注意，这里的帧是指浏览器的帧（一般为4MS），而非游戏帧
     */
    function waitForNextFrame(): Promise<{}>;
    function waitForSeconds(ms: number, conditinHandler?: Handler | Action, args?: any[]): Promise<any>;
    /**
     * 等待命令执行完成
     * @param waitable
     */
    function waitFor(waitable: IWaitable): Promise<{}>;
}
