declare module riggerIOC {
    class Event {
        private listenerManager;
        constructor(mgr: ListenerManager);
        stop(): void;
    }
}
