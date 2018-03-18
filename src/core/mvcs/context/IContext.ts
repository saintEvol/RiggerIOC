/**
* name 
*/
module riggerIOC{
	export interface IContext{
		getInjectionBinder():InjectionBinder;
		getCommandBinder():CommandBinder;

		bindInjections():void;
		bindCommands():void;
		dispose():void;
	}
}