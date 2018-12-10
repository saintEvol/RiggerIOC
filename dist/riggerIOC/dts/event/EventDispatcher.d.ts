declare module riggerIOC {
    class EventDispatcher {
        constructor();
        private eventsMap;
        dispatch(eventName: string | number, ...args: any[]): void;
        on(eventName: string | number, caller: any, method: Function, ...args: any[]): Handler;
        off(eventName: string | number, caller: any, method: Function): void;
        dispose(): void;
        private clear;
    }
}
