/*
* name;
*/
///<reference path="../models/FightModel.ts" />
///<reference path="../signals/StartFightSignal.ts" />

class InitFighterInfoCommand extends riggerIOC.WaitableCommand {
    constructor() {
        super();
    }

    @riggerIOC.inject(FightModel)
    private model: FightModel;

    @riggerIOC.inject(StartFightSignal)
    private startFightSignal: StartFightSignal;

    async execute(info: FighterInfo) {
        console.log(`now set fighter info, fight mode idx:${this.model.selfIdx}`)
        this.model.setFighterInfo(info.name, info.hp);
        await riggerIOC.waitForSeconds(1000);
        if (!this.isCanceled()) {
            this.startFightSignal.dispatch();
        }
        else {
            console.log(`canceled InitFighterInfoCommand`)
        }

    }

    onCancel(): void {
        console.log(`on InitFighterInfoCommand canceled`)

    }
}