import WebGL = Laya.WebGL;
// 程序入口
class GameMain {
    constructor() {
        Laya.init(600, 400, WebGL);
        // let t: Laya.TimeLine
        // this.testSeq();
        // this.test()
        this.testApp();
    }

    private async testApp() {
        let app: riggerIOC.ApplicationContext = new MyAppContext();
        await app.launch();
        console.log(`launch finished`);

        await riggerIOC.waitForSeconds(5000);
        console.log(`[time:${Laya.Browser.now()}]now stop app`);
        await app.dispose();


        while (true) {
            let tracks = app.analyser.stickyInsts;
            for (var i: number = 0; i < tracks.length; ++i) {
                console.log(`${tracks[i]}`);
            }

            let ret = app.analyser.analyze();
            console.log(ret.analyseReport);
            await riggerIOC.waitForSeconds(2000);
        }
        // console.log(`[time:${Laya.Browser.now()}]stop app finished`)
        // await riggerIOC.waitForSeconds(2000);
        // console.log(`[time:${Laya.Browser.now()}]restart`);
        // app = new MyAppContext();
        // await riggerIOC.waitForSeconds(9040);
        // console.log(`[time:${Laya.Browser.now()}]stop app again`);
        // await app.dispose();
        // app = new MyAppContext();

    }

    async testSeq() {
        let seq: riggerIOC.TaskExecutor = new riggerIOC.TaskExecutor();
        seq.setCompleteHandler(riggerIOC.Handler.create(this, this.onSeqComplete, ["total"]))
        seq.setCancelHandler(riggerIOC.Handler.create(this, this.onSeqCanceled, ["total"]))

        let comHandler: riggerIOC.Handler = riggerIOC.Handler.create(this, this.onTaskComplete, null, false);
        let cancelHandler: riggerIOC.Handler = riggerIOC.Handler.create(this, this.onTaskCanceled, null, false);

        let t1: riggerIOC.WaitForTime = new riggerIOC.WaitForTime();
        t1.forMSeconds(2000, false);
        seq.add(t1, comHandler, ["t1"], cancelHandler, ["t1"]);

        let t2: riggerIOC.WaitForTime = new riggerIOC.WaitForTime();
        t2.forSeconds(3, false);
        seq.add(t2, comHandler, ["t2"], cancelHandler, ["t2"])

        let t3: riggerIOC.WaitForTime = new riggerIOC.WaitForTime();
        t3.reset();
        t3.forSeconds(7, false);
        seq.add(t3, comHandler, ["t3"], cancelHandler, ["t3"])

        // setTimeout(this.interrupt, 2500, seq);
        await seq.execute();
        console.log("===complete===")


    }

    async test() {
        await null;
        console.log("await null ");

        let t: riggerIOC.WaitForTime = new riggerIOC.WaitForTime();
        console.log("before wait for 5");
        await t.forSeconds(5).wait();
        console.log("after wait for 5");
        setTimeout(() => {
            t.cancel("test cancel");
        }, 4000);
        t.reset();
        let ret = await t.forMSeconds(5000).wait();
        if (ret.isFailed) {
            console.log("after wait for 5000 failed or canceled:" + ret.reason);
        }
        else {
            console.log("after wait for 5000 success");
        }

    }

    async testFrame() {
        let frame: riggerIOC.WaitForTime = new riggerIOC.WaitForTime();
        while (true) {
            console.log("after a frame");
            await frame.forever().wait();
        }
    }

    testConcat(): void {
        let arr1 = [1, 2, 3];
        let ret = [].concat(arr1, 1);
        console.log("ret:" + ret.toString())
        console.log("arr1:" + arr1.toString())
    }

    private onSeqComplete(): void {
        console.log(`[time:${Laya.Browser.now()}]seq exec complete!`);
    }

    private onSeqCanceled(): void {
        console.log(`[time:${Laya.Browser.now()}]seq exec canceled`);
    }

    private onTaskComplete(taskName: string) {
        console.log(`[time:${Laya.Browser.now()}]task:${taskName} complete`);
    }

    private onTaskCanceled(taskName: string, reason) {
        console.log(`[time:${Laya.Browser.now()}]task:${taskName} canceled, reason:${reason}`);

    }

    private interrupt(container: riggerIOC.TaskExecutor) {
        container.cancel("just a test");
    }
}