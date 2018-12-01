import Snake from "./Snake";
import Quadtree from "../config/Quadtree";

/**
 * 游戏数据
 */
export default class GameData{
    static beanList:Array<Laya.Sprite>=[]; //小豆子对象
    static beanQuad:Quadtree; //使用四叉树存储小豆子对象。。优化。
    static allSnakeList:Array<Snake>=[];//蛇对象数组
    static maxSnakeNum:number=10;
    static allHistorySnakeNum:number=0;
}
