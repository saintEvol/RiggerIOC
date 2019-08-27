class People {
    public name:string = null;
    constructor(key: string = "") {
        this.name = key;
    }

    public whoAmI():void {
        console.log(`i am ${this.name}`);
    }
}