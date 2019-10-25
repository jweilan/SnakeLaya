import BeanView from "../game/bean/BeanView";
import Snake from "../game/snake/Snake";
/**
 * 游戏数据
 */
export default class GameData{
    static beanList:Array<BeanView>=[]; //小豆子对象
    static allSnakeList:Array<Snake>=[];//蛇对象数组
    static maxSnakeNum:number=10;
    static allHistorySnakeNum:number=0;
}
