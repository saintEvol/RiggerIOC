/*
* name;
*/
class LoginSuccessSignal extends riggerIOC.Signal<number>{
    constructor(){
        super();
    }

    dispose():void{
        console.log(`now dispose LoginSuccesSignal`)
        super.dispose();
    }
}