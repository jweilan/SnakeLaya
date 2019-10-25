/**
 * 道具视图
 */
export default class BeanView extends Laya.Sprite implements IView{
    constructor(){
        super();
    }
    private _score:number=1;
    public get score():number{
        return this._score;
    }
    build(x,y,src,w,score):void{
        this.loadImage(src);
        this.width=w;
        this.height=w;
        this.pos(x,y);
        this.pivot(w/2,w/2);
        this._score=score;
    }
    addEvent():void{

    }
    removeEvent():void{

    }
    destroy():void{
        this.removeSelf();
        Laya.Pool.recover("bean",this);
    }
}