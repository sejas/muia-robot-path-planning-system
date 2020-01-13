var a = 4
var b = a
function P(i,j){return {i,j}}
function P_FROM_POS(x){
    var i = Math.floor((x+1)/a)
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
        console.log(row_elems)
    }
}
function r(matrix,position){
    var point = P_FROM_POS(position)
    var i = point.i
    var j = point.j
    var currentDistance = matrix[position]
    if (!point_in_range(point)){
        return m
    }
    console.log('initpoint: ', P(i,j))
    var neighbours = [
        // TOP ROW
        P(i-1,j-1),
        P(i-1,j),
        P(i-1,j+1),
        // CURRENT ROW
        P(i,j-1),
        P(i,j+1),
        // NEXT ROW
        P(i+1,j-1),
        P(i+1,j),
        P(i+1,j+1)
    ]
    neighbours.forEach(n => {
      var next = POS_FROM_POINT(n)
      console.log('NEXT',n, next, n.i> 0 && n.i < a,  n.j> 0 && n.j < b,  0 === m[next])  
      if (  point_in_range(n) && 0 === m[next] ){
        m[next] = currentDistance + 1
      }
    });
    printMatrix(m)
    return m
}


var m = [
0,0,0,0,
0,0,0,0,
0,0,0,0,
0,0,0,0,
]

var START_POSITION = 10
m[START_POSITION] = 1
for(var position = START_POSITION; position<m.length; position++){
    m = r(m, position)
}
