/*
* name;
*/
@riggerIOC.autoDispose
class LoginSuccessfulCommand extends riggerIOC.Command{
    constructor(){
        super();
    }

    @riggerIOC.inject(LoginSuccessSignal)
    private succSignal: LoginSuccessSignal;

    execute(playerId: number):void{
        console.log(`[time:${Laya.Browser.now()}] now ${playerId} login successful`);
        this.succSignal.dispatch(playerId);
        
        // this.done();
    }
}