$(function(){
    var socket = io();

    socket.on('disconnect', function () {
        console.log("CONNECTION LOST");
        $("svg").attr("class", "frozen");
    });

    socket.on('connect', function () {
        console.log("CONNECTION ESTABLISHED");
        $("svg").attr("class", null);
    });

    socket.on('dev-state', function (dev_state) {
        $("svg > g#"+dev_state.id+" > rect[class^='led']").attr("class",dev_state.state);
    });

    $("svg rect[class^='led-']").click(function(){
        var svg = $(this).parents("svg");
        if(svg.attr("class") != "frozen") {
            var state = $(this).attr("class") == "led-on" ? "led-on" : "led-off";
            var id = $(this).parent().attr("id");
            var web_state = {"id":id,"state":state};

            socket.emit('web-state', web_state);
        }
    })
});