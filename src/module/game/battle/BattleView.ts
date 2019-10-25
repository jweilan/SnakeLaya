import { ui } from "../../../ui/layaMaxUI";
import Camera2D from "../../utils/Camera2D";
import Snake from "../snake/Snake";
import GameConfig from "../../../GameConfig";
import Rocker from "../../utils/Rocker";
import ToolCMD from "../../../config/ToolCMD";
import GameData from "../../data/GameData";
import worldMaps from "../../utils/worldMaps";

export default class BattleView extends ui.gameMainUI{

    static instance:BattleView;
    
    snakeSelf:Snake; //蛇
    constructor(){
        super();
        BattleView.instance=this;
        this.init();
        this._addEvent();
    }
    init():void{
        Rocker.instance.init(this.rockerMove,this.rockerBox);//操作杆

        this.snakeSelf=new Snake(GameConfig.width/2,GameConfig.height/2,"player");
        this.gameBox.addChild(this.snakeSelf);
        this.scoreText.changeText(this.snakeSelf.snakeEatBeanNum+"");
        this.map.graphics.drawRect(0,0,3000,1500,"#FFF");

        Camera2D.instance.start(this.worldMap); 
        Camera2D.instance.focus(this.snakeSelf);

        Laya.stage.on(ToolCMD.ROCKER_MOVE,this,this._getRockerAngle);


        var htmlCanvas:Laya.HTMLCanvas=this.drawToCanvas(750,1334,0,0);
        htmlCanvas.toBase64("image/png",0.9,function(data){
            console.log(data);
        })

    }

    private _addEvent():void{
        //加速
        this.speedBtn.on(Laya.Event.MOUSE_DOWN,this,this._onSpeedBtn);
        this.speedBtn.on(Laya.Event.MOUSE_UP,this,this._onSpeedBtn);

        //重新开始
        this.again.on(Laya.Event.CLICK,this,this.createPlayer);
        
    }
    /**
     * 重新生成自己蛇
     */
    createPlayer():void{
        this.snakeSelf=new Snake(GameConfig.width/2,GameConfig.height/2,"player");
        this.gameBox.addChild(this.snakeSelf);
        Camera2D.instance.focus(this.snakeSelf);
        GameData.allSnakeList.push(BattleView.instance.snakeSelf);
        this.scoreText.changeText(this.snakeSelf.snakeEatBeanNum+"");
        this.showUI(UIName.GAME);
    }
    /**
     * 加速的方法回调
     * @param e 
     */
    private _onSpeedBtn(e:Laya.Event):void{
        if(e.type=="mousedown"){
            this.snakeSelf.speedNow="fast";
        }else{
            this.snakeSelf.speedNow="slow";
        }
    }
    /**
     * 摇杆的回调函数
     * @param angle 弧度
     */
    private _getRockerAngle(angle):void{
        this.snakeSelf.upMove(Laya.Utils.toAngle(angle));
    }
    /**
     * 游戏实时数据
     */
    private _renderUIData():void{
       this.snakeNumText.changeText(GameData.allSnakeList.length+"");
       this.beanNumText.changeText(GameData.beanList.length+"");
       this.scoreText.changeText(this.snakeSelf.snakeEatBeanNum+"");
    }
    /**
     * 更换UI
     */
    showUI(uiname):void{
        switch(uiname){
            case UIName.BEGINUI:
                break;
            case UIName.GAME:
                this.gameOver.visible=false;
                break;
            case UIName.OVERUI:
                this.gameOver.visible=true;
                break;
        }
    }
    Update():void{
        Camera2D.instance.update();
        this.snakeSelf.update();
        this._renderUIData();
    }

}
export enum UIName{
    BEGINUI,
    GAME,
    OVERUI,
}