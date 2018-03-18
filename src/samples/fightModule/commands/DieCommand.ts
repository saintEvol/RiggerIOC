/*
* name;
*/
class DieCommand extends riggerIOC.Command{
    constructor(){
        super();
    }

    execute(){
        console.log(`[time:${Laya.Browser.now()}]fightr die`);
        this.done();
    }
}