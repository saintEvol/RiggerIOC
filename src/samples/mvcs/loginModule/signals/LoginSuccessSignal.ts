/*
* name;
*/
class LoginSuccessSignal extends riggerIOC.Signal<number>{
    constructor(){
        super();
        console.log(`now constructor StartLoginSignal`);
    }

    dispose():void{
        console.log(`now dispose LoginSuccesSignal`)
        super.dispose();
    }
}