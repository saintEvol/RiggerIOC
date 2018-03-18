/**
* name 
*/
module riggerIOC{
	export abstract class CommandBinder {
		abstract bind(cls:any):CommandBindInfo;	
	}
}