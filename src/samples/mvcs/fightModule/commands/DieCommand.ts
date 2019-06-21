/*
* name;
*/
class DieCommand extends riggerIOC.WaitableCommand{
    constructor(){
        super();
    }

    execute(){
        console.log(`[time:${Laya.Browser.now()}]fightr die`);
        this.done();
        
        return this
    }

    onCancel(r):void{
        
    }
}