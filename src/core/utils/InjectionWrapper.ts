module riggerIOC {
    export class InjectionWrapper {

        private static NOW_ID: number = 1;
        private static readonly ID_KEY: string = "$iocid";
        public static wrap(klass: any): string | number {
            if (!klass) return null;
            // 使用hasOwnProperty进行判断，防止误取到其父类的
            if (klass.hasOwnProperty(InjectionWrapper.ID_KEY)) return klass[InjectionWrapper.ID_KEY];

            let id: number = InjectionWrapper.mallocId();
            klass[InjectionWrapper.ID_KEY] = id;

            return id;
        }

        public static unWrap(klass: any): void {
            delete klass[InjectionWrapper.ID_KEY];
        }

        public static getId(klass: any): string | number {
            if(!klass.hasOwnProperty(InjectionWrapper.ID_KEY)) return null;
            return klass[InjectionWrapper.ID_KEY];
        }

        private static mallocId(): number {
            return InjectionWrapper.NOW_ID++;
        }
    }
}