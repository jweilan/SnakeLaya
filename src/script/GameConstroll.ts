import GameUI, { UIName } from "./GameUI";
import GameConfig from "../GameConfig";
import ToolUtils from "../config/ToolUtils";
import Snake from "./Snake";
import QuadTree from "../config/Quadtree";
import GameData from "./GameData";
import ObjDictionary from "../config/ObjDictionary";
/**
 * 游戏控制脚本
 */
export default class GameConstroll extends Laya.Script{
    /** @prop {name:Bean,tips:"道具",type:Prefab} */
    Bean:Laya.Prefab;

    private _gameBox:Laya.Sprite;
    private _beanQuadTree:QuadTree=null;//用四叉树保存道具，优化碰撞检测
    private _snakeAiObjList:ObjDictionary=new ObjDictionary();
    constructor(){
        super();
    }
    onEnable():void{
        this._gameBox = this.owner["gameBox"] as Laya.Sprite;
        this._beanQuadTree = new QuadTree(3,new Laya.Rectangle(0,0,3000,1500));
        this._createBean();
        this._createSnakeAi();
    }
     /**
     *  随机生成一个道具
     */
    private _randomCreateBean(x,y,col:number=Math.floor(Math.random()*5+1),w:number=Math.floor(Math.random()*5+5)):void{
        var bean:Laya.Sprite = Laya.Pool.getItemByCreateFun("bean",this.Bean.create,this.Bean);
            bean.loadImage("images/bean"+col+".png");
            bean.width=w;
            bean.height=w;
            bean.pos(x,y);
        GameData.beanList.push(bean);
        this._beanQuadTree.insert(bean);
        this._gameBox.addChild(bean);
    }
    /**
     * 在容器里生成蛇,默认ai蛇
     */
    private _randomCreateSnake(x,y,name:string,ai:boolean=true):void{
        var snake = new Snake(x,y,name);
            snake.AI=ai;
            GameUI.instance.gameBox.addChild(snake);
            GameData.allSnakeList.push(snake); 
            GameData.allHistorySnakeNum++;
            if(ai)this._snakeAiObjList.add(name,snake);
    }
    /**
     * 生成一堆道具
     */
    private _createBean():void{
        for(var i=0;i<300;i++){
            this._randomCreateBean(Math.random()*3000,Math.random()*1500);
        }
    }
    /**
     * 检测道具数量，补充
     */
    private _checkBean():void{
        while(GameData.beanList.length<300){
            this._randomCreateBean(Math.random()*3000,Math.random()*1500);
        }
    }
    /**
     * 检测AI蛇数量，补充。
     */
    private _checkAiSanke():void{
        while(this._snakeAiObjList.length<GameData.maxSnakeNum){
            this._randomCreateSnake(Math.random()*2500+100,Math.random()*1000+100,"snake"+GameData.allHistorySnakeNum);
        }
    }
    /**
     * 生成AI蛇
     */
    private _createSnakeAi():void{
        for(var i=0;i<GameData.maxSnakeNum;i++){
           this._randomCreateSnake(i*200,i*200,"snake"+i);
        }
        GameData.allSnakeList.push(GameUI.instance.snakeSelf);
        Laya.timer.loop(3000,this,this._snakeAiAction);
    }
    /**
     * AI蛇运动
     */
    private _snakeAiAction():void{
        for(var i=0;i<GameData.allSnakeList.length;i++){
            var snake=GameData.allSnakeList[i];
            if(snake.AI){
                GameData.allSnakeList[i].upMove(180 - Math.random() * 360);
                GameData.allSnakeList[i].speedNow=Math.random()<0.9?"slow":"fast";
            }
        }
    }
    /**
     * 蛇之间的碰撞检测
     */
    private _snakeCollision():void{
        var head,bodys,body;
        for(var i=0;i<GameData.allSnakeList.length;i++){
            head=GameData.allSnakeList[i];
            for(var j=0;j<GameData.allSnakeList.length;j++){
                bodys=GameData.allSnakeList[j];
                if(head!=bodys&&!head.InvincibleSecond&&!bodys.InvincibleSecond){//不是同一条蛇，且不能有蛇是无敌的。。
                    //如果是碰头了。。就一起消失。。
                    for(var k=1;k<bodys.bodyList.length;k++){
                        body=bodys.bodyList[k];
                        if(ToolUtils.getDistance(head.x,head.y,body.x,body.y)<=40){
                            console.log(head.id+"碰到了"+bodys.id);
                            this._snakeKillChangeBean(head);

                            if(!head.AI){GameUI.instance.showUI(UIName.OVERUI)}
                            else this._snakeAiObjList.remove(head.id);

                            head.destroy();
                            GameData.allSnakeList.splice(i,1);
                            return;
                        }
                    }
                }
            }
        }
        
    }
    /**
     * 蛇死后留下的道具
     */
    private _snakeKillChangeBean(sn:Snake):void{
        for(var i=0;i<sn.bodyList.length;i++){
            var body=sn.bodyList[i];
            this._randomCreateBean(body.x,body.y,sn.snakeColNum,Math.floor(Math.random()*15+5));
        }
    }
   
    onUpdate():void{
        GameUI.instance.Update();
        for(var i=0;i<GameData.allSnakeList.length;i++){
            var snake=GameData.allSnakeList[i];
            if(snake.AI){
                snake.update();
            }
        }
        this._checkBean();
        this._checkAiSanke();
        this._snakeCollision();
    }
}