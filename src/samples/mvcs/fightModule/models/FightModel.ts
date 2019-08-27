/*
* name;
*/
///<reference path = "./FightModelT.ts" />
class FightModel extends riggerIOC.Model {

    @riggerIOC.inject(FightModelT)
    private modelT: FightModelT

    constructor() {
        super();
        this.modelT;
        // FightModel.insts.push(this);
    }

    dispose() {
        console.log('in fight model dispose, set fighter null')
        this.fighter = null;
        // throw new Error("a dispose error for testing");
        super.dispose();
    }

    subHp(hp: number) {
        this.fighter.hp = Math.max(0, this.fighter.hp - hp);
    }

    isLive(test: number): boolean {
        console.log('fight command idx:' + test);
        return this.fighter.hp > 0;
    }

    public get hp(): number {
        return this.fighter.hp;
    }

    private fighter: FighterInfo;
    setFighterInfo(name: string, hp: number) {
        console.log(`[time:${Laya.Browser.now()}]set fighter info,name:${name}, hp:${hp}`);

        if (!this.fighter) return this.fighter = new FighterInfo(name, hp);
        this.fighter.name = name;
        this.fighter.hp = hp;
    }
}