/*
* name;
*/
class LoginModule extends riggerIOC.ModuleContext {
    @riggerIOC.inject(StartLoginSignal)
    private startLoginSignal: StartLoginSignal;

    @riggerIOC.inject(LoginSuccessSignal)
    private loginSuccessSignal: LoginSuccessSignal;

    constructor(app: riggerIOC.ApplicationContext) {
        super(app);
    }

    onStart(): void {
        this.startLoginSignal.dispatch(1);
        this.loginSuccessSignal.on(this, this.onLoginSuccess);
    }

    bindCommands(): void {
        this.commandBinder.
        bind(StartLoginSignal).
        to(StartLoginCommand).to(LoginSuccessfulCommand).inSequence();

    }

    bindInjections(): void {
        this.injectionBinder.bind(LoginSuccessSignal).toSingleton();
    }

    bindMediators(): void {

    }

    private onLoginSuccess(playerId: number):void{
        console.log(`[time:${Laya.Browser.now()}]login module init finished, and logined player:${playerId}`);
        
        this.done();
    }
}