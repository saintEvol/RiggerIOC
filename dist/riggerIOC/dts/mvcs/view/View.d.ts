/**
* 视图抽象基类
*/
declare module riggerIOC {
    abstract class View {
        constructor();
        abstract onInit(): void;
        abstract onShown(): void;
        abstract onHide(): void;
        abstract dispose(): void;
    }
}
