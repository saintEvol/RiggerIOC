/**
* name 
*/
///<reference path="../signals/InitFighterInfoSignal.ts" />
///<reference path="../models/FightModel.ts" />

class FightServer extends riggerIOC.Server {
	@riggerIOC.inject(FightModel)
	private model: FightModel;

	@riggerIOC.inject(InitFighterInfoSignal)
	private initSignal:InitFighterInfoSignal;
	constructor(){
		super();
		this.init();
	}

	async init(){
		this.model;
		await riggerIOC.waitForSeconds(1000);
		let info:FighterInfo = new FighterInfo("Laya", 100);
		this.initSignal.dispatch(info);

	}

	dispose() {
		console.log(`now dispose fight server`);
		super.dispose();
	}
}