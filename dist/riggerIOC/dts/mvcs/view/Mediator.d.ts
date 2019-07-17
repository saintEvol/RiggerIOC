/**
* 视图的中介类
*/
declare module riggerIOC {
    interface Mediator {
        onInit(): void;
        onShow(): void;
        onHide(): void;
        onDispose(): void;
    }
}
