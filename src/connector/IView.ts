interface IView{
     build(...arg:any[]):void;
     addEvent():void;
     removeEvent():void;
     destroy():void;
}