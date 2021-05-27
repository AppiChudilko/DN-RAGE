// "Borrowed" from attachments resource, credits to ragempdev

let weapons = require('../weapons');

function serializeComponentSet(dataSet) {
    return (Array.from(dataSet).map((hash) => (hash.toString(36)))).join("|");
}

/**
 * Adds the specified component to the player's specified weapon.
 * @param  {Number} weaponHash    The weapon's hash.
 * @param  {Number} componentHash The component's hash.
 * @throws {TypeError} If any of the arguments is not a number.
 */
mp.Player.prototype.giveWeaponComponent = function(weaponHash, componentHash) {
    if (!Number.isInteger(weaponHash) || !Number.isInteger(componentHash)) throw new TypeError("Non number argument(s) passed to giveWeaponComponent.");
    if (!this.__weaponComponents.hasOwnProperty(weaponHash)) this.__weaponComponents[weaponHash] = new Set();
    this.__weaponComponents[weaponHash].add(componentHash);

    if (this.weapon === weaponHash) {
        this.setVariable("currentWeaponComponents", weaponHash.toString(36) + "." + serializeComponentSet(this.__weaponComponents[weaponHash]));
    } else {
        mp.players.callInRange(this.position, mp.config["stream-distance"], "updatePlayerWeaponComponent", [this, weaponHash.toString(36), componentHash.toString(36), false]);
    }
};

/**
 * Returns whether the player's specified weapon has the specified component or not.
 * @param  {Number}  weaponHash    The weapon's hash.
 * @param  {Number}  componentHash The component's hash.
 * @returns {Boolean}
 * @throws {TypeError} If any of the arguments is not a number.
 */
mp.Player.prototype.hasWeaponComponent = function(weaponHash, componentHash) {
    if (!Number.isInteger(weaponHash) || !Number.isInteger(componentHash)) throw new TypeError("Non number argument(s) passed to hasWeaponComponent.");
    return this.__weaponComponents.hasOwnProperty(weaponHash) ? this.__weaponComponents[weaponHash].has(componentHash) : false;
};

/**
 * Returns the components of the player's specified weapon.
 * @param  {Number}  weaponHash    The weapon's hash.
 * @returns {Number[]} An array of component hashes.
 * @throws {TypeError} If weaponHash argument is not a number.
 */
mp.Player.prototype.getWeaponComponents = function(weaponHash) {
    if (!Number.isInteger(weaponHash)) throw new TypeError("Non number argument passed to getWeaponComponents.");
    return this.__weaponComponents.hasOwnProperty(weaponHash) ? Array.from(this.__weaponComponents[weaponHash]) : [];
};

/**
 * Removes the specified component from the player's specified weapon.
 * @param  {Number} weaponHash    The weapon's hash.
 * @param  {Number} componentHash The component's hash.
 * @throws {TypeError} If any of the arguments is not a number.
 */
mp.Player.prototype.removeWeaponComponent = function(weaponHash, componentHash) {
    if (!Number.isInteger(weaponHash) || !Number.isInteger(componentHash)) throw new TypeError("Non number argument(s) passed to removeWeaponComponent.");

    if (this.__weaponComponents.hasOwnProperty(weaponHash)) {
        this.__weaponComponents[weaponHash].delete(componentHash);

        if (this.weapon === weaponHash) {
            this.setVariable("currentWeaponComponents", weaponHash.toString(36) + "." + serializeComponentSet(this.__weaponComponents[weaponHash]));
        } else {
            mp.players.callInRange(this.position, mp.config["stream-distance"], "updatePlayerWeaponComponent", [this, weaponHash.toString(36), componentHash.toString(36), true]);
        }
    }
};

/**
 * Removes all components of the player's specified weapon.
 * @param  {Number}  weaponHash    The weapon's hash.
 * @throws {TypeError} If weaponHash argument is not a number.
 */
mp.Player.prototype.removeAllWeaponComponents = function(weaponHash) {
    if (!Number.isInteger(weaponHash)) throw new TypeError("Non number argument passed to removeAllWeaponComponents.");

    if (this.__weaponComponents.hasOwnProperty(weaponHash)) {
        if (this.weapon === weaponHash) {
            this.setVariable("currentWeaponComponents", weaponHash.toString(36) + ".");
        } else {
            mp.players.callInRange(this.position, mp.config["stream-distance"], "resetPlayerWeaponComponents", [this, weaponHash.toString(36)]);
        }

        delete this.__weaponComponents[weaponHash];
    }
};

/**
 * Resets all components of the player's all weapons.
 */
mp.Player.prototype.resetAllWeaponComponents = function() {
    if (this.__weaponComponents.hasOwnProperty(this.weapon)) this.setVariable("currentWeaponComponents", this.weapon.toString(36) + ".");
    mp.players.callInRange(this.position, mp.config["stream-distance"], "nukePlayerWeaponComponents", [this]);

    this.__weaponComponents = {};
};

/**
 * Sets the tint of the player's specified weapon.
 * @param {Number} weaponHash The weapon hash.
 * @param {Number} tintIndex  The tint index.
 * @throws {TypeError} If any of the arguments is not a number.
 */
mp.Player.prototype.setWeaponTint = function(weaponHash, tintIndex) {
    if (!Number.isInteger(weaponHash) || !Number.isInteger(tintIndex)) throw new TypeError("Non number argument(s) passed to setWeaponTint.");

    this.__weaponTints[weaponHash] = tintIndex;
    if (this.weapon === weaponHash) this.setVariable("currentWeaponTint", `${weaponHash.toString(36)}|${tintIndex}`);
    else mp.players.callInRange(this.position, mp.config["stream-distance"], "updatePlayerWeaponTint", [this, `${weaponHash.toString(36)}|${tintIndex}`]);
};

/**
 * Gets the tint of the player's specified weapon.
 * @param  {Number} weaponHash The weapon hash.
 * @returns {Number}            Tint of the specified weapon.
 * @throws {TypeError} If weaponHash argument is not a number.
 */
mp.Player.prototype.getWeaponTint = function(weaponHash) {
    if (!Number.isInteger(weaponHash)) throw new TypeError("Non number argument passed to getWeaponTint.");
    return this.__weaponTints.hasOwnProperty(weaponHash) ? this.__weaponTints[weaponHash] : 0;
};

/**
 * Returns an object that contains all weapon tints of the player. Key: weapon hash | Value: tint index
 * @returns {Object}
 */
mp.Player.prototype.getAllWeaponTints = function() {
    return this.__weaponTints;
};

/**
 * Resets tints of the player's all weapons.
 */
mp.Player.prototype.resetAllWeaponTints = function() {
    if (this.__weaponTints.hasOwnProperty(this.weapon)) this.setVariable("currentWeaponTint", `${this.weapon.toString(36)}|0`);
    else mp.players.callInRange(this.position, mp.config["stream-distance"], "updatePlayerWeaponTint", [this, `${this.weapon.toString(36)}|0`]);
    this.__weaponTints = {};
};

// Events
mp.events.add("playerJoin", (player) => {
    player.__weaponComponents = {};
    player.__weaponTints = {};
});

mp.events.add("playerWeaponChange", (player, oldWeapon, newWeapon) => {
    let newWeaponInt32 = weapons.getHashByInt64(newWeapon);
    player.setVariable("currentWeaponComponents", newWeaponInt32.toString(36) + "." + (player.__weaponComponents.hasOwnProperty(newWeaponInt32) ? serializeComponentSet(player.__weaponComponents[newWeaponInt32]) : ""));
    player.setVariable("currentWeaponTint", `${newWeaponInt32.toString(36)}|${player.__weaponTints.hasOwnProperty(newWeaponInt32) ? player.__weaponTints[newWeaponInt32] : 0}`);
});