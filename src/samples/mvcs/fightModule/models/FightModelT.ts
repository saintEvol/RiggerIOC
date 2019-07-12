///<reference path = "../servers/FightServer.ts" />
class FightModelT extends riggerIOC.Model{

    // @riggerIOC.inject(FightServer)
    // private fightServer: FightServer

    constructor(){
        super()
        // this.fightServer;
    }

    dispose():void{
        console.log(`now dispose FightModelT`)
        super.dispose();
    }
}