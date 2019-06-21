/*
* name;
*/
class SearchEnemyCommand extends riggerIOC.WaitableCommand {
    constructor() {
        super();
    }

    async execute() {
        console.log(`[time:${Laya.Browser.now()}]start to search enemy!`);
        await riggerIOC.waitForSeconds(1000);
        this.done();

    }

    onCancel(): void {

    }
}