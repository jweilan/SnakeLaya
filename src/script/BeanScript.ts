import GameUI from "./GameUI";

/**
 * 食物的脚本
 */
export default class BeanScript extends Laya.Script{
    constructor(){
        super();
    }
    onEnable():void{
    //    var sp:Laya.Sprite=this.owner as Laya.Sprite;
    }
    onTriggerEnter():void{
        //碰到就消失
        this.owner.removeSelf();
    }
    onDestroy():void{
        Laya.Pool.recover("bean",this.owner);
    }
}