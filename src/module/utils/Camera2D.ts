import GameConfig from "../../GameConfig";


/*
 * @Description: 2d相机跟随
 * @Author: jwei 
 * @Date: 2018-11-22 12:03:19
 * @LastEditTime: 2018-11-23 10:58:41
 * @LastEditors: Please set LastEditors
 */
export default class Camera2D{
    //单例
    private static _instance: Camera2D;
    public static get instance(): Camera2D {
        this._instance = this._instance || new Camera2D;
        return this._instance
    }
    // 视窗
    private _cameraView:Laya.Rectangle;
    public get cameraView():Laya.Rectangle{
        return this._cameraView;
    }
    private _scene:Laya.Sprite;
    private _focusTarget:Laya.Sprite;
    private _mapW=3000;
    private _mapH=1500;

    constructor(){
    }
    start(scene:Laya.Sprite):void{
       this._scene=scene;
       this._cameraView=new Laya.Rectangle(0,0,GameConfig.width,GameConfig.height);
       this._scene.scrollRect=this._cameraView;
    }

    /**
     * @msg: 绑定主视角
     * @param {type} 
     * @return: 
     */
    public focus(target:Laya.Sprite):void{
        this._focusTarget=target;
        this._cameraView.x=this._focusTarget.x-(GameConfig.width>>1);
        this._cameraView.y=this._focusTarget.y-(GameConfig.height>>1);
    }
    
    /**
     * @msg:实时更新 
     * @param {type} 
     * @return: 
     */
    public update():void{
        if(this._focusTarget){
            if(this._focusTarget.x>0 && (this._focusTarget.x-GameConfig.width/2) < this._mapW){
                this._cameraView.x=this._focusTarget.x-(GameConfig.width>>1);
            }
            if(this._focusTarget.y>(GameConfig.height>>1) || (this._focusTarget.y+GameConfig.height/2) < this._mapH){
                this._cameraView.y=this._focusTarget.y-(GameConfig.height>>1);
            }
        }
    }

}