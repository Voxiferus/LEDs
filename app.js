var express = require("express");
var control = require ("./include/led_control");
var path = require('path');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

control.holdPins();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
    res.render('index',{binds:control.getBindsInfo()});
});

io.on('connection', function(socket){
    console.log('USER CONNECTED');

    global.socket = socket;

    global.socket.emit("binds-info",control.getBindsInfo());
    control.sendPinsState();
    //global.socket.emit("dev-state","led-off");

    global.socket.on('web-state',function(web_state){
        //console.log(web_state);
        control.setLedMode(web_state);
    });

    global.socket.on('disconnect', function(){
        console.log('USER DISCONNECTED');
    });
});

http.listen(3000,function(){
    console.log("LISTENING");
});

function exit() {
    led.unexport();
    button.unexport();
    process.exit();
}

process.on('SIGINT', function(){
    control.releasePins();
    process.exit();
});
