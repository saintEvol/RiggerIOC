module riggerIOC {
    export class InjectionWrapper {

        private static NOW_ID: number = 1;
        private static readonly ID_KEY: string = "$iocid";
        public static wrap(klass: any): string | number {
            if (!klass) return null;
            if (klass[InjectionWrapper.ID_KEY]) return klass[InjectionWrapper.ID_KEY];

            let id: number = InjectionWrapper.mallocId();
            klass[InjectionWrapper.ID_KEY] = id;

            return id;
        }

        public static unWrap(klass: any): void {
            delete klass[InjectionWrapper.ID_KEY];
        }

        public static getId(klass: any): string | number {
            return klass[InjectionWrapper.ID_KEY];
        }

        private static mallocId(): number {
            return InjectionWrapper.NOW_ID++;
        }
    }
}