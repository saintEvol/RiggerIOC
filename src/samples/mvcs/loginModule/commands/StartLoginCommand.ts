/*
* name;
*/
@riggerIOC.autoDispose
class StartLoginCommand extends riggerIOC.WaitableCommand {

    // @riggerIOC.inject(LoginSuccessSignal)
    // private successLoginSignal: LoginSuccessSignal;
    constructor(){
        super();
    }

    async execute(playerId: number) {
        console.log(`[time:${Laya.Browser.now()}]now player:${playerId} try to login.`);
        await riggerIOC.waitForSeconds(2000);
        // this.successLoginSignal.dispatch(playerId);
        this.done();        
    }

    onCancel():void{
        
    }
}