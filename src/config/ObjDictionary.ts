/**
 * 对象字典
 */
export default class ObjDictionary{
    constructor(){
        this._container=new Object();
        this._length=0;
    }
    private _container:Object;

    public get container():Object{
        return this._container;
    }
    private _length:number;
    public get length():number{
        return this._length;
    }
    public add(key:any,value:any):void{
        if(!this.containsKey(key)){
            this._length++;
            this._container[key]=value;
        }
    }
    public reset(key:any,value:any):void{
        if(this.containsKey(key)){
            this._container[key]=value;
        }else{
            console.log("已经有了。。")
        }
    }
    public remove(key:any):void{
        if(this._container.hasOwnProperty(key)){
            this._container[key]=null;
            this._length--;
        }
    }
    public get(key:any):any{
        return this._container[key];
    }
    public containsKey(key:any):boolean{
        return this._container.hasOwnProperty(key);
    }
    public clear():void{
        this._length=0;
        this._container=null;

    }

}