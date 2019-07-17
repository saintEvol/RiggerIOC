/**
* 视图的中介类
*/
declare module riggerIOC {
    abstract class Mediator {
        abstract onInit(): void;
        abstract onShow(): void;
        abstract onHide(): void;
        abstract onDispose(): void;
        /**
         * 析构函数，此函数供框架使用，请勿手动调动和覆盖
         */
        dispose(): void;
    }
}
