/**
* 视图的中介类
*/
declare module riggerIOC {
    abstract class Mediator {
        abstract onInit(): void;
        abstract onShown(): void;
        abstract onHide(): void;
        abstract dispose(): void;
    }
}
