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

    $("svg rect[class^='led-']").click(function(){
        var svg = $(this).parents("svg");
        if(svg.attr("class") != "frozen") {
            var selected_led = $(this);
            var web_state = selected_led.attr("class") == "led-on" ? "led-on" : "led-off";

            socket.emit('web-state', web_state);

            socket.on('dev-state', function (dev_state) {
                if (dev_state == "led-on" || dev_state == "led-off") {
                    selected_led.attr("class", dev_state);
                }
            });
        }
    })
});