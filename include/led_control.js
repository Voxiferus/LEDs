var gpio = require('onoff').Gpio;

var binds = [
    {"id":"couple_1","led":69,"button":47},
    {"id":"couple_2","led":68,"button":46},
    {"id":"couple_3","led":67,"button":45},
    {"id":"couple_4","led":66,"button":44}
];

function setLedMode(web_state) {
    var couple = binds.filter(function(value){
        if(value.id == web_state.id){return true}
    });
    if (couple.length == 1 && (web_state.state == "led-on" || web_state.state == "led-off")) {
        var new_state, pin_value;
        if (web_state.state == "led-on") {
            new_state = "led-off";
            pin_value = 0;
        } else {
            new_state = "led-on";
            pin_value = 1;
        }
        couple[0].led_gpio.write(pin_value, function () {
            var message = {"id":web_state.id,"state":new_state};
            global.socket.broadcast.emit("dev-state", message);
            global.socket.emit("dev-state", message)
        });
    }
}

function sendPinsState(){
    binds.forEach(function(couple){
        var dev_state= {"id":couple.id,"state":couple.led_gpio.readSync() == 1 ? "led-on" : "led-off"};
        global.socket.emit("dev-state", dev_state)
    })
}

function holdPins(){
    binds.map(function(couple) {
        couple.led_gpio = new gpio(couple.led, 'out');
        couple.state = couple.led_gpio.readSync() == 0 ? "led-off" : "led-on";

        couple.button_gpio = new gpio(couple.button, 'in', 'both');
        couple.button_gpio.watch(function (err, value) {
            if (value == 0) {
                //console.log("BUTTON PRESSED: "+couple.id);
                var current_couple = binds.filter(function(value){
                    if(value.id == couple.id){return true}
                });
                var current_state = current_couple[0].led_gpio.readSync() == 1 ? "led-on" : "led-off";
                setLedMode({"id":couple.id,"state":current_state});
            }
        });

        return couple;
    })
}

function getBindsInfo(){
    return binds.map(function(value){
        return {"id":value.id}
    });
}

function releasePins() {
    binds.forEach(function(value){
        value.led_gpio.unexport();
        value.button_gpio.unexport();
    })
}

module.exports.setLedMode = setLedMode;
module.exports.releasePins = releasePins;
module.exports.holdPins = holdPins;
module.exports.getBindsInfo = getBindsInfo;
module.exports.sendPinsState = sendPinsState;