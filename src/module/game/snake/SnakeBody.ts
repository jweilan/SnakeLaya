export default class SnakeBody extends Laya.Rectangle{
    private cmd:Laya.DrawCircleCmd;
    constructor(x,y,fillColor,radius){
        super();
        
    }
    init():void{
        this.cmd=new Laya.DrawCircleCmd();
        this.cmd.radius=10;
        

    }

}