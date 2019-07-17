/**
* 视图抽象基类
*/
declare module riggerIOC {
    interface View {
        onInit(): void;
        onShow(): void;
        onHide(): void;
        onDispose(): void;
    }
}
