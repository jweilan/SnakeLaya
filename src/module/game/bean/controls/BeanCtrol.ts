import BeanView from "../BeanView";
/**
 * 食物产品管理器。。
 */
export default class BeanCtrol{
    static instance:BeanCtrol;
    constructor(){
        BeanCtrol.instance=this;
    }
    /**
     * 创建一个指定位置的道具。
     */
    createBean(x,y,w,col:number=Math.round(Math.random()*7+1),score:number=1):BeanView{
       var src="images/bean"+col+".png";
       var bean=new BeanView();
           bean.build(x,y,src,w,score)
       return bean;
    }
}