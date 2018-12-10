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
        // 分别添加登录模块和战斗模块
        // 战斗模块会等登录模块完全初始化完成后才会开始进行初始化
        // 添加登陆模块
        this.addModuleContext(LoginModule);        
        // 添加战斗模块
        this.addModuleContext(FightModule);
    }

}