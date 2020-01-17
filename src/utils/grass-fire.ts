import {MapData, Distance, DistanceData} from './image-data'
import {Point, Position} from './point'
import SizeMap from './size-map'

export type Path = Array<Point>
// const TEST_M1 = [
//     0,'x','x',0,
//     0,'x','x',0,
//     0,'x','x',0,
//     0, 0,  0, 0,
//     ].map(e => e==='x'?Infinity:e) as Array<0|1>
    
type VisitedMap = Array<true|false>
let distance_arr:DistanceData = []
let visited_arr:VisitedMap = new Array(distance_arr.length).fill(false)
export const setAuxiliarArrays = (matrix:MapData):[DistanceData, VisitedMap] => {
    // SizeMap.getInstance().setSize(4, 4)
    // distance_arr = [...TEST_M1].map(e=>e? Infinity: e)//[...matrix].map(e=>e? Infinity: e)
    distance_arr = [...matrix].map(e=>e===1? Infinity: e)
    visited_arr = new Array(distance_arr.length).fill(false)
    printMatrix(distance_arr)
    return [distance_arr, visited_arr]
}


function visited(position:number){
    return visited_arr[position]
}
function visit(position:number){
    visited_arr[position] = true
}
function visited_point(point:Point){
    return visited(point.position)
}

const isWall = (point:Point) => (distance_arr[point.position] === Infinity)

/**
 * Calculate distance in a map following the GRASS FIRE ALGORITHM
 * @param matrix 
 * @param goalPoint 
 */
export function grassFire(matrix:MapData, goalPoint:Point):DistanceData{
    const [distance_arr, ] = setAuxiliarArrays(matrix)
    var nextPointsToExplore = [goalPoint]

    while (nextPointsToExplore.length > 0){
        var currentPoint:Point = nextPointsToExplore.shift() as Point
        var currentPosition:Position = currentPoint.position
        var currentDistance:Distance = distance_arr[currentPosition]
        // eslint-disable-next-line no-loop-func
        !visited_point(currentPoint) && currentPoint.neighbours.forEach(n => {
            if (n.inRange && !visited_point(n) && !isWall(n)){
                distance_arr[n.position] = currentDistance +1
                nextPointsToExplore.push(n)
            }
        })
        visit(currentPosition)
        printMatrix(distance_arr, goalPoint.position)
    }
    return distance_arr
}

/**
 * SEARCH PATH similar to gradient descent, searching for the minimum neighbour point each time
 * @param grassFireMatrix 
 * @param startPoint 
 * @param goalPoint 
 */
export function searchPath(grassFireMatrix:DistanceData, startPoint:Point, goalPoint:Point){
    const pathPoints:Path = [startPoint]
    let goalReached = false
    let isReachable = true
    let currentPoint = startPoint

    console.log('searchPath START: ', startPoint, grassFireMatrix[startPoint.position])
    console.log('searchPath GOAL: ', goalPoint, grassFireMatrix[goalPoint.position])
    if(grassFireMatrix[startPoint.position] === 0 ){
       alert('GOAL POINT IS NOT REACHABLE')
       return []
    }
    printMatrix(grassFireMatrix, goalPoint.position, startPoint.position)
    while (!goalReached && isReachable && currentPoint.inRange){
        const neighbours = currentPoint.neighbours
        // eslint-disable-next-line no-loop-func
        let distances = neighbours.map(n => {
            if (n.inRange && !isWall(n)){
                return grassFireMatrix[n.position]
            }
            return Infinity
        })
        let minDistanceIndex = distances.indexOf(Math.min(...distances))
        currentPoint = neighbours[minDistanceIndex]
        pathPoints.push(currentPoint)
        if(currentPoint.i === goalPoint.i && currentPoint.j === goalPoint.j  ){
            goalReached = true
        }
        console.log('pathPoints', pathPoints.length)
        if(pathPoints.length > 100000){
            return []
        }
    }
    return pathPoints
}




// AUX PRINT MATRIX

export function printMatrix(m:DistanceData, GOAL_POSITION=-1, START_POSITION=-1, path:Array<Point> = []){
    if(m.length>625){
        return null
    }
    console.log('=============')
    var pathPositions = path.map(point => point.position)
    const a = SizeMap.getInstance().a
    const b = SizeMap.getInstance().b
    for (var row = 0; row < a ;row++){
        var row_elems = []
        for (var col = 0; col < b ;col++){
            var next = row*a+col
            var charToShow = m[next]+''
            if(pathPositions.includes(next)){
                charToShow = '--'
            }
            if(START_POSITION === next){
                charToShow = 'SS'
            }else if(GOAL_POSITION === next){
                charToShow = 'GG'
            }
            row_elems.push(charToShow)
        }
        console.log(''+row_elems.map(e => e==='Infinity'?'XX':e))
    }
}