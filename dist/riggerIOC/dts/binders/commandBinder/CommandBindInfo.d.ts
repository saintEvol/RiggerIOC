/**
 * 绑定信息类
 */
declare module riggerIOC {
    abstract class CommandBindInfo {
        constructor();
        /**
         * 将信号绑定到命令，可以重复执行以绑定到多个命令
         * @param cmdCls
         */
        abstract to(cmdCls: any): CommandBindInfo;
        /**
         * 绑定到值
         * @param cmdValue
         */
        abstract toValue(cmdValue: any): CommandBindInfo;
        /**
         * 设置为一次性绑定
         */
        abstract once(): CommandBindInfo;
        /**
         * 设置为顺序命令
         */
        abstract inSequence(): CommandBindInfo;
    }
}
