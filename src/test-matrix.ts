// STARTING GRASSFIRE ALGORITHM

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
function printMatrix(m){
    for (var row = 0; row < a ;row++){
        var row_elems = []
        for (var col = 0; col < b ;col++){
            var next = row*a+col
            row_elems.push(m[next])
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

function grassFire(matrix, position){
    function getNeighbourPoints (point) {
        var i = point.i
        var j = point.j
        return [
            // ROW ABOVE
            P(i-1,j),
            // CURRENT ROW
            P(i,j-1),
            P(i,j+1),
            // ROW BELOW
            P(i+1,j),
        ]
    }
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


var START_POSITION = 3 // 24
console.log('FINAL MATRIX2: ')
printMatrix(grassFire(m, START_POSITION))