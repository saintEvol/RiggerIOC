/**
* name 
*/
class FightModule extends riggerIOC.ModuleContext {
	constructor(appContext: riggerIOC.ApplicationContext) {
		super(appContext);
	}

	bindInjections(): void {
		console.log(`bind module level injections.`);
		this.injectionBinder.bind(DummyModel).to(ChildDummyModel).toSingleton();
		
		this.injectionBinder.bind(FightModel).toSingleton();
		this.injectionBinder.bind(FightServer).toValue(new FightServer());
	}

	bindCommands(): void {
		console.log(`bind module level commands.`);
		this.commandBinder.bind(InitFighterInfoSignal).to(InitFighterInfoCommand);
		this.commandBinder.bind(StartFightSignal).to(SearchEnemyCommand).to(FightCommand).to(DieCommand).inSequence();
	}

	bindMediators(): void {
		console.log(`bind module level mediators.`);
	}

}