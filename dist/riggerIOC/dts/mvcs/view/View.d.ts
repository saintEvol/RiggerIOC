/**
* 视图抽象基类
*/
declare module riggerIOC {
    abstract class View {
        constructor();
        abstract onInit(): void;
        abstract onShow(): void;
        abstract onHide(): void;
        abstract onDispose(): void;
    }
}
