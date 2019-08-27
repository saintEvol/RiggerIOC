/*
* name;
*/
@riggerIOC.autoDispose
class StartLoginCommand extends riggerIOC.WaitableCommand {

    // @riggerIOC.inject(LoginSuccessSignal)
    // private successLoginSignal: LoginSuccessSignal;
    @riggerIOC.inject(NamesConfig.LUCY)
    private lucy: Girl;

    @riggerIOC.inject(NamesConfig.BOB)
    private bob: Boy;

    @riggerIOC.inject(NamesConfig.GOD)
    private god: People;

    constructor(){
        super();
    }

    async execute(playerId: number) {
        console.log(`>>>> test string bind`);
        this.lucy.whoAmI();
        this.bob.whoAmI();
        this.god.name = ">>> GOD <<<";
        console.log(`[time:${Laya.Browser.now()}]now player:${playerId} try to login.`);
        await riggerIOC.waitForSeconds(2000);
        // this.successLoginSignal.dispatch(playerId);
        this.done();        
    }

    onCancel():void{
        
    }
}