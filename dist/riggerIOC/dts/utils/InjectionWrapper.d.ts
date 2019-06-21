declare module riggerIOC {
    class InjectionWrapper {
        private static NOW_ID;
        private static readonly ID_KEY;
        static wrap(klass: any): string | number;
        static unWrap(klass: any): void;
        static getId(klass: any): string | number;
        private static mallocId;
    }
}
