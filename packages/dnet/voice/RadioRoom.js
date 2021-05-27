class RadioRoom {
    constructor(name) {
        this.name = name;

        this._players = new Set();
    }

    get players() {
        return Array.from(this._players);
    }

    get metaData() {
        return {
            name: this.name
        }
    }

    onJoin(player) {
        try {
            if (!this._players.has(player)) {
                player.call('voice.radioConnect', [this.metaData, ...this.players]);
                mp.players.call(this.players, 'voice.radioConnect', [this.metaData, player]);

                player.radioRoom = this.name;
                this._players.add(player);
            }
        } catch(e) {
            console.log(`room ${this.name} onJoin ${player.name}`, e);
        }
    }

    onQuit(player) {
        try {
            if (this._players.has(player)) {
                player.call('voice.radioDisconnect', [this.metaData, ...this.players]);
                mp.players.call(this.players, 'voice.radioDisconnect', [this.metaData, player]);

                player.radioRoom = '';
                this._players.delete(player);
            }
        } catch(e) {
            console.log(`room ${this.name} onQuit ${player.name}`, e);
        }
    }

    enableMic(player) {
        try {
            if (this._players.has(player)) {
                mp.players.call(this.players, 'voice:toogleRadioMic', [player, true]);
            }
        } catch(e) {
            console.log(`room ${this.name} enableMic ${player.name}`, e);
        }
    }

    disableMic(player) {
        try {
            if (this._players.has(player)) {
                mp.players.call(this.players, 'voice:toogleRadioMic', [player, false]);
            }
        } catch(e) {
            console.log(`room ${this.name} disableMic ${player.name}`, e);
        }
    }

    onRemove() {
        mp.players.call(this.players, 'voice.radioDisconnect', [this.metaData]);
        this._players.clear();
    }
}

module.exports = RadioRoom;