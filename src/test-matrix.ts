// STARTING GRASSFIRE ALGORITHM
var GOAL_POSITION = 3 // 24
var START_POSITION = 0 // 24
var m = [
    0,Infinity,Infinity,0,0,0,
    0,Infinity,Infinity,0,0,0,
    0,Infinity,Infinity,0,0,0,
    0,Infinity,Infinity,0,0,0,
    0,Infinity,Infinity,0,0,0,
    0,0,0,0,0,0,
    ]

var a = Math.sqrt(m.length)
var b = a
function P(i,j){return {i,j}}
function P_FROM_POS(x){
    var i = Math.floor((x)/a)
    var j = x-a*i
    return {i,j}
}
function POS_FROM_POINT(p){
    return p.i*a+p.j
}
function point_in_range(n){
    return n.i>= 0 && n.i < a && n.j>= 0 && n.j < b
}
function printMatrix(m, path = []){
    var pathPositions = path.map(point => POS_FROM_POINT(point))
    for (var row = 0; row < a ;row++){
        var row_elems = []
        for (var col = 0; col < b ;col++){
            var next = row*a+col
            var charToShow = m[next]
            if(pathPositions.includes(next)){
                charToShow = '-'
            }
            if(START_POSITION === next){
                charToShow = 'S'
            }else if(GOAL_POSITION === next){
                charToShow = 'G'
            }

            row_elems.push(charToShow)
        }
        console.log(''+row_elems.map(e => e===Infinity?'x':e))
    }
}

var visited_arr = [...m]
function visited(position){
    return visited_arr[position] === Infinity
}
function visited_point(point){
    return visited(POS_FROM_POINT(point))
}
function visit(position){
    visited_arr[position] = Infinity
}
function getNeighbourPoints (point) {
    var i = point.i
    var j = point.j
    return [
        // UP
        P(i-1,j),
        // LEFT
        P(i,j-1),
        // RIGHT
        P(i,j+1),
        // DOWN
        P(i+1,j),
    ]
}
function grassFire(matrix, position){
    var startPoint = P_FROM_POS(position)
    var nextPointsToExplore = [startPoint]

    while (nextPointsToExplore.length > 0){
        var currentPoint = nextPointsToExplore.shift()
        var currentPosition = POS_FROM_POINT(currentPoint)
        var currentDistance = matrix[currentPosition]
        visit(currentPosition)
        // eslint-disable-next-line no-loop-func
        getNeighbourPoints(currentPoint).forEach(n => {
            if (point_in_range(n) && !visited_point(n)){
                m[POS_FROM_POINT(n)] = currentDistance +1
                nextPointsToExplore.push(n)
            }
        })
    }
    return m
}

function searchPath(grassFireMatrix, positionStart, positionGoal){
    var startPoint = P_FROM_POS(positionStart)
    var goalPoint = P_FROM_POS(positionGoal)
    var pathPoints = [startPoint]

    var goalReached = false
    var isReachable = true

    var currentPoint = startPoint
    while (!goalReached && isReachable){
        // var currentPosition = POS_FROM_POINT(currentPoint)
        // visit(currentPosition)
        // eslint-disable-next-line no-loop-func
        var neighbours = getNeighbourPoints(currentPoint)
        var distances = neighbours.map(n => {
            if (point_in_range(n)){
                return m[POS_FROM_POINT(n)]
            }
            return Infinity
        })
        var minDistanceIndex = distances.indexOf(Math.min(...distances))
        currentPoint = neighbours[minDistanceIndex]
        pathPoints.push(currentPoint)
        if(currentPoint.i === goalPoint.i && currentPoint.j === goalPoint.j  ){
            goalReached = true
        }
        console.log('neighbours', neighbours)
        console.log('distances', distances)
        console.log('min', currentPoint)
    }
    return pathPoints
}

// CALCULATE MATRIX
console.log('FINAL MATRIX: ')
printMatrix(grassFire(m, GOAL_POSITION))

// CALCULATE PATH
var path = searchPath(m, START_POSITION, GOAL_POSITION)
console.log('PATH: ', path)
printMatrix(m, path)