/**
* name 
*/
///<reference path="../signals/InitFighterInfoSignal.ts" />
class FightServer extends riggerIOC.Server {
	@riggerIOC.inject(InitFighterInfoSignal)
	private initSignal:InitFighterInfoSignal;
	constructor(){
		super();
		this.init();
	}

	async init(){
		await riggerIOC.waitForSeconds(1000);
		let info:FighterInfo = new FighterInfo("Laya", 100);
		this.initSignal.dispatch(info);

	}

	dispose() {
	}
}