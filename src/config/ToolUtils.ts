/**
 * 工具函数
 */
export default class ToolUtils{
    /**
     * 得到两点的距离。。
     * @param x1 
     * @param y1 
     * @param x2 
     * @param y2 
     */
    static getDistance(x1,y1,x2,y2):number{
        return Math.sqrt(Math.pow(x1-x2,2)+Math.pow(y1-y2,2));
    }
}