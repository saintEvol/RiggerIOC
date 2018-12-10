/**
* Mediation的绑定信息
*/
declare module riggerIOC {
    class MediationBindInfo {
        /**
         * 绑定的视图类构造函数
         */
        readonly viewConstructor: any;
        private mViewConstructor;
        /**
         * 与视图绑定的中介类
         */
        readonly bindMediatorConstructor: any;
        private mBindMediatorConstructor;
        constructor(cls: any);
        /**
         * 将视图绑定到中介类
         * @param mediatorCls
         */
        to(mediatorCls: any): MediationBindInfo;
    }
}
