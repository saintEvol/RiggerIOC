/*
* name;
*/
///<reference path='../models/FightModel.ts'/>
///<reference path='./BaseFightCommand.ts'/>
class FightCommand extends BaseFightCommand {
    @riggerIOC.inject(NamesConfig.GOD)
    private god: People;
    static idx: number = 1;
    constructor() {
        super();
        console.log(`construct Fight Command`);
    }

    @riggerIOC.inject(FightModel)
    private fightModel: FightModel;

    async execute() {
        console.log("start to fight");
        this.god.whoAmI();
        let temp = FightCommand.idx++;
        while (!this.isCanceled()) {
            if (this.fightModel.isLive(temp)) {
                this.fightModel.subHp(10);
                console.log(`[time:${Laya.Browser.now()}]be hitted and hurt:10, now  hp:${this.fightModel.hp}`);
                await riggerIOC.waitForSeconds(2000);
                // await riggerIOC.waitForNextFrame();
            }
            else{
                break;
            }

        }

        this.done();
        return this;
    }

    onCancel(): void {
        console.log(`cancel fight command`);
    }

    dispose():void{
        console.log(`now dispose fight command`);
        super.dispose();
    }
}