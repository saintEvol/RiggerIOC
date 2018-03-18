/*
* name;
*/
function classDeco() {
    console.log("class deco");
}

function attrDeco<T>(ctr, attrName, desc) {
    // console.log(`attrName:${attrName}`);

}

function bind<T>(){
    let c:{new():T}
    console.log("bind");
    
}

function test(a: any) {
    console.log("a:" + a);

}

function test1(a:test.TestClass){

}

interface ITestClass {

}

abstract class AbsTestClass{
    public abstract test();
}
module test {


    export class TestClass {
        constructor() {
            // this.name = "";
            test(AbsTestClass);
            bind<ITestClass>();
        }

        public get name(): string {
            return;
        }
    }

    export class TestClassA<T> implements TestClass, AbsTestClass{
        private static count:number = 0;
        constructor(){
            ++TestClassA.count;
        } 
        
        public get name():string{
            return "Test Class A";
        }

        public test(){
            console.log(`test in test class a i am ${this.name}, and the conut is:${TestClassA.count}`);
        }
    }

    class C extends TestClassA<number>{

    }

    
}
