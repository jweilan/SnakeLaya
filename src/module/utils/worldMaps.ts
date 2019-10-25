export default class worldMap{
    private worldObj:Laya.Sprite;
    constructor(sp:Laya.Sprite){
        this.worldObj=sp;
        this.init();
        // this.width=this.row*this.gridWidth;
        // this.height=this.col*this.gridWidth;
    }
    private row:number=300;
    private col:number=300;
    private gridWidth:number=11;

    init():void{
        // for(var i=0;i<this.row;i++){
        //     for(var j=0;j<this.col;j++){
        //         var sp=new Laya.Sprite();
        //             sp.width=this.gridWidth;
        //             sp.height=this.gridWidth;
        //             sp.pos(i*this.gridWidth,j*this.gridWidth);
        //             sp.loadImage("images/map-tile.jpg")
        //         this.worldObj.addChild(sp);
        //     }
        // }
        this.worldObj.cacheAs="normal"
    }
}