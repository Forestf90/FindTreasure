var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');
var http =require('http');

var players =0;
var max=0;
licznik =true;
app.listen(80);

function pole(wr) {
    this.hide=true;
    this.value=wr ;
}


grid =[];
function fillGrid(){

    for(var i=0 ;i <10 ; i++){
        grid[i]=[];
    }
    for(var i=0 ;i< 10 ; i++){

        for(var j=0 ; j<10  ; j++){
            temp = new pole(0)
            grid[i][j] =temp;
        }
    }


    for(var i=0; i<10 ;i++){
        var x=Math.floor(Math.random() * 10) +0
        var y=Math.floor(Math.random() * 10) +0
        if(grid[x][y].value==0){
            grid[x][y].value=11
        }
        else i--
    }

    for(var i=0; i<40 ;i++){
        var x=Math.floor(Math.random() * 10) +0
        var y=Math.floor(Math.random() * 10) +0
        var w=Math.floor(Math.random() * 10) +0
        if(grid[x][y].value==0){
            grid[x][y].value =w
        }
        else i--
    }

}
fillGrid();
function handler (req, res) {
    fs.readFile(__dirname + '/index.html',
        function (err, data) {
            if (err) {
                res.writeHead(500)
                return res.end('Error loading index.html')
            }
            res.writeHead(200)
            res.end(data)
        });
}

io.on('connection', function (socket) {
    if(licznik){
        licznik=false
        setTimeout(endTime ,4*60000);
    }
    socket.emit('news',grid)
    players++
    console.log(players)

    socket.on('klik', function (data) {
        var x = data.mx
        var y =data.my
        if(!grid[y][x].hide) return
        grid[y][x].hide= false
        socket.emit('news',grid)
        socket.broadcast.emit('news' , grid)
        socket.emit("points" ,grid[y][x].value)
    });

    socket.on('wyj', function (data) {
        players--
        if(max<data)max=data
        if(players==0) {

            socket.broadcast.emit('endGame', max)
            socket.emit('endGame', max)
        }
    });

    function endTime(){
        socket.broadcast.emit('endGame', max)
        console.log("time end")
    };

});
