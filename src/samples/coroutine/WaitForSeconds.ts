/*
* name;
*/
class WaitForSeconds extends riggerIOC.BaseWaitable{
    constructor(){
        super()
    }

    startTask(){
        super.startTask();
        setTimeout(this.onTimeOut, 2000, this);
        return this;
    }

    onTimeOut(obj: riggerIOC.BaseWaitable){
        console.log("on time out");
        obj.cancel(1)
        
    }
}