import ToolCMD from "../../config/ToolCMD";

/*
 * @Description: 操作杆
 * @Author:jwei
 * @Date: 2018-11-22 12:04:22
 * @LastEditTime: 2018-11-23 10:44:05
 * @LastEditors: Please set LastEditors
 */
export default class Rocker{
    //单例
    private static _instance: Rocker;
    public static get instance(): Rocker {
        this._instance = this._instance || new Rocker;
        return this._instance
    }
    
    //记录中心点。。
    private _centerPosition:Laya.Point;
    //大圆
    private _bigSp:Laya.Sprite;
    //小圆
    private _minSp:Laya.Sprite;
    //多点触控，记录当前触控id
    private _touchId:number=-1;
    
    constructor(){
    }   
    /**
     * @msg: 初始化参数
     * @param {type} 
     * @return: 
     */
    init(sp:Laya.Sprite,spBox:Laya.Sprite):Laya.Sprite{
        this._centerPosition=new Laya.Point();
        this._centerPosition.x=sp.x;
        this._centerPosition.y=sp.y;
        
        this._bigSp=spBox;
        this._minSp=sp;

        sp.on(Laya.Event.MOUSE_DOWN,this,this._onTouchDown);
        return spBox;
    }
    /**
     * @msg：刚按下执行的方法
     * @param {type} 
     * @return: 
     */
    private _onTouchDown(ent:Laya.Event):void{
        if(this._touchId==-1){
            this._touchId=ent.touchId;
            Laya.stage.on(Laya.Event.MOUSE_MOVE,this,this._onTouchMove);
            Laya.stage.on(Laya.Event.MOUSE_UP,this,this._onTouchUp);
        }
    }
    /**
     * @msg:移动执行的方法 
     * @param {type} 
     * @return: 
     */
    private _onTouchMove(ent:Laya.Event):void{
        if(this._touchId!=-1 && ent.touchId == this._touchId){
            var R2=this._bigSp.width/2-this._minSp.width/2;
            var R=Math.sqrt(Math.pow(ent.stageX-this._centerPosition.x,2)+Math.pow(ent.stageY-this._centerPosition.y,2));
            //是否大于两圆半径之和
            if(R>R2)R=R2;
            var cs=Math.atan2(ent.stageY-this._centerPosition.y,ent.stageX-this._centerPosition.x)
            var cx=R*Math.cos(cs)+this._centerPosition.x,
                cy=R*Math.sin(cs)+this._centerPosition.y;
                this._minSp.pos(cx,cy);
            Laya.stage.event(ToolCMD.ROCKER_MOVE,cs);
        }
    }
    /**
     * @msg: 手抬起,中心的圆要弹回去
     * @param {type} 
     * @return: 
     */
    private _onTouchUp(ent:Laya.Event):void{
        //判断是否有按下和当前抬起的是否为原来那个点。
        if(this._touchId!=-1 && ent.touchId == this._touchId){
            this._touchId=-1;
            Laya.stage.off(Laya.Event.MOUSE_MOVE,this,this._onTouchMove)
            Laya.stage.off(Laya.Event.MOUSE_UP,this,this._onTouchUp);
            Laya.Tween.to(this._minSp,{
                x:this._centerPosition.x,
                y:this._centerPosition.y,
            },100);
        }
    }
}
