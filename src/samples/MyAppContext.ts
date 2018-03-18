/*
* name;
*/
class MyAppContext extends riggerIOC.ApplicationContext {
    constructor() {
        super();
    }

    bindInjections(): void{
        console.log(`bind app level injections.`);
        
    }

    bindCommands(): void{
        console.log(`bind app level commands.`);
    }

    registerModuleContexts(): void{
        this.addModuleContext(FightModule)
    }

}