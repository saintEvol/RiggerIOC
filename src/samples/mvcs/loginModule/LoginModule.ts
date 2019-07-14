/*
* name;
*/
@riggerIOC.autoDispose
class LoginModule extends riggerIOC.ModuleContext {
    @riggerIOC.inject(StartLoginSignal)
    private startLoginSignal: StartLoginSignal;

    @riggerIOC.inject(LoginSuccessSignal)
    private loginSuccessSignal: LoginSuccessSignal;

    @riggerIOC.inject(LoginSuccessSignal)
    private loginSuccessSignal1: LoginSuccessSignal;

    constructor(app: riggerIOC.ApplicationContext) {
        super(app);
    }

    onStart(): void {
        console.log(`now start login module`)
        this.startLoginSignal.dispatch(1);
        this.loginSuccessSignal.on(this, this.onLoginSuccess);
    }

    dispose():void{
        console.log(`now dispose login module`)
        super.dispose();
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

    private async onLoginSuccess(playerId: number) {
        console.log(`[time:${Laya.Browser.now()}]login module init finished, and logined player:${playerId}`);
        await riggerIOC.waitForSeconds(5000);

        this.loginSuccessSignal1;
        this.loginSuccessSignal = null;
        this.applicationContext.analyser;
        this.done();
    }
}