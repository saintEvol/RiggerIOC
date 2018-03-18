/**
* name 
*/
module riggerIOC{
	export class CommandBindTuple{
		ctr:any;
		inst:Command;
		constructor(cls:any){
			this.ctr = cls;
			this.inst = null;
		}
	}
}