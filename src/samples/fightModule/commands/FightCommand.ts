/*
* name;
*/
///<reference path='../models/FightModel.ts'/>
class FightCommand extends riggerIOC.Command{
    constructor(){
        super();
    }

    @riggerIOC.inject(FightModel)
    private fightModel:FightModel;

    async execute(){
        console.log("start to fight");
        while (this.fightModel.isLive()) {
            this.fightModel.subHp(10);
            console.log(`[time:${Laya.Browser.now()}]be hitted and hurt:10, now  hp:${this.fightModel.hp}`);            
            await riggerIOC.waitForSeconds(2000);
            // await riggerIOC.waitForNextFrame();
        }

        this.done();
    }
}