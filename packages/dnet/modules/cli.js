"use strict";

const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function ParseCmd(s) {
    var args = s.split(" ");
    var cmd = args[0].toLowerCase();
    var params = [];
    var joinMode = false;
    for (var i = 0; i < args.length; i++) {
        if (args[i].charAt(0) === '"') {
            var param = args[i].replace('"', '');
            params.push(param);
            joinMode = true;
        } else if (args[i].charAt(args[i].length - 1) === '"') {
            var param = args[i].replace('"', '');
            params[params.length - 1] += " " + param;
            joinMode = false;
        } else if (joinMode) {
            params[params.length - 1] += " " + param;
        } else {
            params.push(args[i]);
        }
    }
    var res = '';
    switch (cmd) {
        case "kick":
            mp.players.forEach(player => {
                if (player.name.toLowerCase() == params[1].toLowerCase()) {
                    player.kick("Console");
                    res = " Player " + player.socialClub + " was kicked!";
                }
            });
            break;
        case "status":
            res = "\n Players: " + mp.players.length + "/" + mp.players.size + "\n Vehicles: " + mp.vehicles.length + "\n Objects: " + mp.objects.length + "\n Weather: " + mp.world.weather + "\n Game Time: " + mp.world.time.hour + ":" + mp.world.time.minute + "\n Uptime: " + process.uptime() + "\n";
            break;
        case "online":
            res = "\n Online: " + mp.players.length + "/" + mp.players.size + "\n ";
            mp.players.forEach(player => {
                res += player.name + " | " + player.ip + " | " + player.ping + "\n ";
            });
            break;
        default:
            res = " Unknown command!";
            break;
    }
    return res;
}

rl.on('line', (s) => {
    var res = ParseCmd(s);
    console.log(res);
});
