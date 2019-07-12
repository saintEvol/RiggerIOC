/*
* name;
*/
class StartLoginSignal extends riggerIOC.Signal<number>{
    constructor() {
        super();
        console.log(`now constructor StartLoginSignal`)
    }

    dispose(): void {
        console.log("now dispose StartLoginSignal");
        super.dispose();
    }
}