/**
* 视图的中介类
*/
declare module riggerIOC {
    abstract class Mediator {
        abstract onInit(): void;
        abstract onShow(): void;
        abstract onHide(): void;
        abstract onDispose(): void;
    }
}
