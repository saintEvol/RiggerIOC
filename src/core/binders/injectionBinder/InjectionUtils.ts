/**
* name 
*/
module riggerIOC{
	export function inject(ctr:any){
		return function(target:any, attrName:string, descripter?:any){
			// console.log(`in inject, attr:${attrName}, ctr:${ctr}`);
			if(descripter){
				doInjectGetterSetter(ctr, target, attrName, descripter);
			}
			else{
				doInjectAttr(ctr, target, attrName);
			}
		}
	}

	/**
	 * 对getter/setter方法进行注入
	 * @param key 
	 * @param taget 
	 * @param attrName 
	 * @param descripter 
	 */
	function doInjectGetterSetter(key:any, taget:any, attrName:string, descripter:any){
		let info:InjectionBindInfo = InjectionBinder.instance.bind(key);
		descripter.get = function(){
			return info.getInstance();
		}
	}

	/**
	 * 对成员属性进行注入
	 * @param key 
	 * @param target 
	 * @param attrName 
	 */
	function doInjectAttr(key:any, target:any, attrName:string){
		let info:InjectionBindInfo = InjectionBinder.instance.bind(key);
		Object.defineProperty(target, attrName, {
        get: function () {
            return info.getInstance();
        },
        enumerable: true,
        configurable: true
    	});
	}
}