var gpio = require('onoff').Gpio;

var binds = [
    {"led":69,"button":44}
];
var led, button;

function setLedMode(web_state) {
    if (web_state == "led-on" || web_state == "led-off") {
        var new_state, pin_value;
        if (web_state == "led-on") {
            new_state = "led-off";
            pin_value = 0;
        } else {
            new_state = "led-on";
            pin_value = 1;
        }
        led.write(pin_value, function () {
            global.socket.emit("dev-state", new_state)
        });
    }
}

function holdPins(){
    led = new gpio(69, 'out');
    led.writeSync(0);

    button = new gpio(44, 'in', 'both');
    button.watch(function(err, value) {
        if(value == 0){
            var pin_value = led.readSync();
            var dev_state = pin_value == 1 ? "led-on" : "led-off";
            setLedMode(dev_state);
        }
    });
}

function releasePins() {
    led.unexport();
    button.unexport();
}

module.exports.setLedMode = setLedMode;
module.exports.releasePins = releasePins;
module.exports.holdPins = holdPins;