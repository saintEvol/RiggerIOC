/**
* name 
*/
module riggerIOC{
	export async function startCoroutine(caller:any, method:Function, ...args:any[]){
		await method.apply(caller, args);
	}

	/**
	 * 等下一帧，注意，这里的帧是指浏览器的帧（一般为4MS），而非游戏帧
	 */
	export function waitForNextFrame(){
		return new Promise(resolve => {
			setTimeout(resolve, 0);
		})
	}

	export function waitForSeconds(ms:number){
		return new Promise(resolve => {
			setTimeout(resolve, ms);
		})
	}

	/**
	 * 等待命令执行完成
	 * @param cmd 
	 */
	export function waitForCommand(cmd:Command){
		return new Promise(resolve =>{
			if(cmd.isDone){
				resolve();
			}
			else{
				cmd.doneCallBack = resolve;				
			}
		})
	}
}