import GameUI, { UIName } from "./GameUI";
import GameConfig from "../GameConfig";
import GameData from "./GameData";
import ToolUtils from "../config/ToolUtils";

/**
 * 蛇类
 */
export default class Snake extends Laya.Sprite{
    id:string;
    AI:boolean=false; //是否为ai;

    bodyList:Array<Laya.Sprite>=[];//蛇身数组
    snakeEatBeanNum:number=20;//蛇身长度
    oneBodyBeanNum:number=5;//吃几颗豆增加一节身体
    snakeColNum:number;//蛇颜色。。

    speedObj={"slow":4,"fast":6,"rotation":0}//蛇移动速度
    speedNow:string="slow";
    
    kill:boolean=false;//是否挂了
    InvincibleSecond:boolean=true;//无敌3秒

    pathList:Array<Object>=[];//蛇头移动轨迹数组（以最小单位1建立数组）,队列
    nameText:Laya.Text;

    constructor(x,y,id,col:number=Math.round(Math.random()*4+1)){
        super();
        this.id=id;
        this.snakeColNum=col;
        this.zOrder=1;
        this.width=40;
        this.height=40;
        this.pivot(20,20);
        this.pos(x,y);

        this.nameText=new Laya.Text();
        this.nameText.text=this.id;
        this.nameText.pos(20,20);
        this.nameText.pivot(20,40);
        this.addChild(this.nameText);

        this.init();
        
        Laya.timer.once(3000,this,this._changeInvin);
    }
    private _changeInvin():void{//取消无敌状态
        this.InvincibleSecond=false;
    }
    init():void{
        this.loadImage("images/head"+this.snakeColNum+".png");
        //初始化蛇身
        for(var i=0;i<Math.floor(this.snakeEatBeanNum/this.oneBodyBeanNum);i++){
            this._addBody(this.x,this.y);
        }
    }
    /**
     * 添加一节身体
     * @param x 
     * @param y 
     */
    private _addBody(x,y):void{
        var sp=new Laya.Sprite();
            sp.loadImage("images/body"+this.snakeColNum+".png");
            sp.pivot(20,20);
            sp.pos(x,y);
        this.bodyList.unshift(sp);
        GameUI.instance.gameBox.addChild(sp);
    }
    //蛇身移动
    private _bodyMove():void{
        var obj;
        for(var i=0;i<this.bodyList.length;i++){
            obj=this.pathList[20*i]
            if(obj){
                this.bodyList[i].pos(obj.x,obj.y);
            }
        }
        this.pathList.splice(this.bodyList.length*20);
        this._checkSnakeBody();
    }
    //检查蛇身
    private _checkSnakeBody():void{
        var len=Math.floor(this.snakeEatBeanNum/this.oneBodyBeanNum)-this.bodyList.length;
        if(len){
            var obj=this.pathList.pop();
            this._addBody(obj["x"],obj["y"]);
        }
    }
    //判断有无吃到东西。。。
    private _checkEatProp():void{
        for(let i=0;i<GameData.beanList.length;i++){
            if((ToolUtils.getDistance(this.x,this.y,GameData.beanList[i].x,GameData.beanList[i].y)-GameData.beanList[i].width/2)<30){
                var bean=GameData.beanList.splice(i,1)
                Laya.Tween.to(bean[0],{
                    x:this.x,
                    y:this.y
                },30,null,Laya.Handler.create(null,function(obj){
                    obj.removeSelf();
                },bean));
                this.snakeEatBeanNum++;
            }
        }
    }
    //改变方向
    upMove(angle):void{
        this.rotation=angle
        this.speedObj["rotation"]=Laya.Utils.toRadian(angle);
        this.nameText.rotation=-angle;
    }
    //销毁自身
    destroy():void{
        this.kill=true;
        for(var i=0;i<this.bodyList.length;i++){
            // GameUI.instance.gameBox.removeChild(this.bodyList[i]);
            this.bodyList[i].removeSelf();
            this.removeSelf();
        }
    }
    update():void{
        if(this.kill)return;
        var speed=this.speedObj[this.speedNow],
            old={x:this.x,y:this.y};

        this.x+=speed*Math.cos(this.speedObj["rotation"]);
        this.y+=speed*Math.sin(this.speedObj["rotation"]);
        if(this.x<20)this.x=20;
        if(this.x>2980)this.x=2980;
        if(this.y<20)this.y=20;
        if(this.y>1480)this.y=1480;

        for(var i=0;i<speed;i++){//记录每次走过的坐标。。1为单位
            var x=(this.x-old.x)*i/speed+old.x,
                y=(this.y-old.y)*i/speed+old.y;
            this.pathList.unshift({x:x,y:y})
        }
        this._bodyMove();
        this._checkEatProp();
    }
}