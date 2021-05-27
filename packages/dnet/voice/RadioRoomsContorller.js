const RadioRoom = require('./RadioRoom');

class RadioRoomsContorller {
  constructor() {

    /**
    * Description
    * @type {Map<string, RadioRoom>}
    */
    this.rooms = new Map();
  }

  createRoom(name) {
    this.rooms.set(name, new RadioRoom(name));
    console.log(`[RadioRoomsContorller] created room - ${name}`);
  }

  removeRoom(name) {
    if (this.rooms.has(name)) {
      const room = this.rooms.get(name);

      room.onRemove();
      this.rooms.delete(name);
    }
  }

  hasRoom(name) {
    return this.rooms.has(name);
  }

    enableMic(name, player) {
      try {
        if (this.rooms.has(name)) {
          const room = this.rooms.get(name);
  
          room.enableMic(player);
  
          console.log(`[RadioRoomsContorller] player ${player.name} enableMic to - ${name}`);
        }
      } catch (e) {
        console.log('enableMic controller', e);
      }
    }

    disableMic(name, player) {
      try {
        if (this.rooms.has(name)) {
          const room = this.rooms.get(name);
  
          room.disableMic(player);
  
          console.log(`[RadioRoomsContorller] player ${player.name} disableMic to - ${name}`);
        }
      } catch (e) {
        console.log('disableMic controller', e);
      }
    }

  onJoin(name, player) {
    try {
      if (this.rooms.has(name)) {
        const room = this.rooms.get(name);

        room.onJoin(player);

        console.log(`[RadioRoomsContorller] player ${player.name} connected to - ${name}`);
      }
    } catch (e) {
      console.log('onJoin controller', e);
    }
  }

  onQuit(name, player) {
    try {
      if (this.rooms.has(name)) {
        const room = this.rooms.get(name);

        room.onQuit(player);

        console.log(`[RadioRoomsContorller] player ${player.name} disconnected from - ${name}`);
      }
    } catch (e) {
      console.log('onQuit controller', e);
    }
  }
}

module.exports = new RadioRoomsContorller();