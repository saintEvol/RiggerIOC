declare module riggerIOC {
    abstract class CommandBinder {
        abstract bind(cls: any): CommandBindInfo;
    }
}
