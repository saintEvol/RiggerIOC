/*
 * Copyright 2018 Yang Wu.
 *
 *	Licensed under the Apache License, Version 2.0 (the "License");
 *	you may not use this file except in compliance with the License.
 *	You may obtain a copy of the License at
 *
 *		http://www.apache.org/licenses/LICENSE-2.0
 *
 *		Unless required by applicable law or agreed to in writing, software
 *		distributed under the License is distributed on an "AS IS" BASIS,
 *		WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *		See the License for the specific language governing permissions and
 *		limitations under the License.
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
	 * @param waitable 
	 */
	export function waitFor(waitable:IWaitable){
		return new Promise(resolve =>{
			if(waitable.isDone()){
				resolve();
			}
			else{
				waitable.setDoneCallback(resolve);				
			}
		})
	}
}