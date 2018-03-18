/*
* name;
*/
class FightModel extends riggerIOC.Model{
    constructor(){
        super();
    }

    dispose(){

    }

    subHp(hp:number){
        this.fighter.hp = Math.max(0, this.fighter.hp - hp);
    }

    isLive():boolean{
        return this.fighter.hp > 0;
    }

    public get hp():number{
        return this.fighter.hp;
    }

    private fighter:FighterInfo;
    setFighterInfo(name:string, hp:number){
        console.log(`[time:${Laya.Browser.now()}]set fighter info,name:${name}, hp:${hp}`);
        
        if(!this.fighter) return this.fighter = new FighterInfo(name, hp);
        this.fighter.name = name;
        this.fighter.hp = hp;
    }
}