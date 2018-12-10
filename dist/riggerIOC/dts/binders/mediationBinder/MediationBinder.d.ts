/**
* Mediator绑定器
*/
declare module riggerIOC {
    class MediationBinder {
        constructor();
        private mInfos;
        private bindTuples;
        /**
         *
         *
         * @param cls
         */
        bind(cls: any): MediationBindInfo;
        /**
         * 根据视图信息获取其绑定的Mediator实例
         * @param viewCls 视图类的构造函数
         * @param view 视图的实例
         */
        createAndAttach(viewCls: any, view: View): Mediator;
        /**
         * 将视图与mediator分离
         * @param view
         * @param mediator
         */
        detach(view: View, mediator: Mediator): void;
        /**
         * 获取已经和视图绑定的mediator实例
         * @param view
         */
        getAttachedMediatorInstance(view: View): Mediator;
        /**
         * 查找绑定信息
         * @param viewCls
         */
        private findBindInfo;
        private addBindTuple;
    }
}
