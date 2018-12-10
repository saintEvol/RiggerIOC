/*
* name;
*/
///<reference path="../models/FightModel.ts" />
///<reference path="../signals/StartFightSignal.ts" />

class InitFighterInfoCommand extends riggerIOC.Command{
    constructor(){
        super();
    }

    @riggerIOC.inject(FightModel)
    private model:FightModel;

    @riggerIOC.inject(StartFightSignal)
    private startFightSignal:StartFightSignal;

    async execute(info:FighterInfo){
        this.model.setFighterInfo(info.name, info.hp);
        await riggerIOC.waitForSeconds(1000);
        this.startFightSignal.dispatch();

    }
}