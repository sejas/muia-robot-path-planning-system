import SizeMap from './size-map'
import { Click } from './click';

export type Position = number

export class Point {
    i: number;
    j: number;

    constructor(i:number,j:number) {
        this.i = i;
        this.j = j;
    }

    static FROM_POS(x:number){
        const a = SizeMap.getInstance().a
        var i = Math.floor((x)/a)
        var j = x-a*i
        return new Point(i, j)
    }
    static FROM_CLICK(click:Click, canvas:HTMLCanvasElement){
        const i = click.x-canvas.offsetLeft
        const j = click.y-canvas.offsetTop
        return new Point(i,j)
    }

    static POS_FROM_POINT(p:Point){
        const a = SizeMap.getInstance().a
        return p.i*a+p.j
    }
    static POINT_IN_RANGE(p:Point){
        const a = SizeMap.getInstance().a
        const b = SizeMap.getInstance().b
        return p.i>= 0 && p.i < a && p.j>= 0 && p.j < b
    }

    get position(){
        return Point.POS_FROM_POINT(this)
    }
    get inRange(){
       return Point.POINT_IN_RANGE(this)
    }

    get neighbours(){
        return [
            // UP
            new Point(this.i-1,this.j),
            // LEFT
            new Point(this.i,this.j-1),
            // RIGHT
            new Point(this.i,this.j+1),
            // DOWN
            new Point(this.i+1,this.j),
        ]
    }
}
