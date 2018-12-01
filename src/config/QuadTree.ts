// 四叉树的实现
export default class Quadtree{
    private MAX_OBJECTS:number = 10;
    private MAX_LEVELS:number = 5;

    private level:number;           // 子节点深度
    private objects:any;            // 物体数组
    private bounds:Laya.Rectangle;  // 区域边界
    private nodes:Array<Quadtree>=[]; 

    constructor(level:number,bounds:Laya.Rectangle){
        this.level=level;
        this.bounds=bounds;
        this.objects=[];
        this.nodes=[];
    }
    // clear, split, getIndex, insert和 retrieve
    clear():void{
        this.objects=[];

        for(var i=0;i<this.nodes.length;i++){
            this.nodes[i].clear();
            this.nodes[i]=null;
        }
    }
    //将当前节点分割成4个节点。。
    split():void{
       var w = this.bounds.width/2,
           h = this.bounds.height/2,
           x = this.bounds.x,
           y = this.bounds.y;
       this.nodes[0]=new Quadtree(this.level+1,new Laya.Rectangle(x+w,y,w,h));
       this.nodes[1]=new Quadtree(this.level+1,new Laya.Rectangle(x,y,w,h));
       this.nodes[2]=new Quadtree(this.level+1,new Laya.Rectangle(x,y+h,w,h));
       this.nodes[3]=new Quadtree(this.level+1,new Laya.Rectangle(x+w,y+h,w,h));
    }
    //得到这个节点的索引
    getIndex(pRect:Laya.Rectangle):number{
        var index=-1;
        // 中线
        var v=this.bounds.x+this.bounds.width/2,
            h=this.bounds.y+this.bounds.height/2;
        
        var t=pRect.y<h&&pRect.y+pRect.height<h,// 完全在上面
            b=pRect.y>h,// 完全在下面
            r=pRect.x>v,//右边
            l=pRect.x+pRect.width<v;//左边
        if(r){
            if(t)index=0;
            if(b)index=3;
        }else if(l){
            if(t)index=1;
            if(b)index=2;
        }
        return index;
    }
    // 插入
    insert(obj:any):void{
        if(obj==undefined)return;
        if(obj instanceof Array){
            for(var i=0;i<obj.length;i++){
                this.insert(obj[i]);
            }
            return;
        }
        if(this.nodes.length){
            var index=this.getIndex(obj);
            if(index!=-1){
                this.nodes[index].insert(obj);
                return;
            }
        }
        this.objects.push(obj);
        if(this.objects.length>this.MAX_OBJECTS&&this.level<this.MAX_LEVELS){
            if(this.nodes[0]==null){
                this.split();
            }
            var i=0;
            while(i<this.objects.length){
                var ind=this.getIndex(this.objects[i]);
                if(ind!=-1){
                    this.nodes[ind].insert((this.objects.splice(i,1))[0]);
                }else{
                    i++;
                }
            }
        }

    }
    //所有可能和指定物品碰撞的物体
    retrieve(returnedObjects,obj):any{
        if(typeof obj === undefined){
            console.log("underfined object");
            return;
        }
        var index=this.getIndex(obj);
        if(index!=-1 && this.nodes.length){
            this.nodes[index].retrieve(returnedObjects,obj);
        }
        for(var i=0;i<this.objects.length;i++){
            returnedObjects.push(this.objects[i]);
        }
        return returnedObjects;
    }
}