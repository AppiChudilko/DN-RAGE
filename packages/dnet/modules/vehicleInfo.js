let methods = require('./methods');
let mysql = require('./mysql');
let enums = require('../enums');

let vehicleInfo = exports;

vehicleInfo.loadAll = function() {
    methods.debug('vehicleInfo.loadAll');
    mysql.executeQuery(`SELECT id, display_name, class_name, class_name_ru, hash, stock, stock_full, fuel_full, fuel_min, fuel_type, type, price, sb, sm FROM veh_info ORDER BY display_name ASC`, function (err, rows, fields) {
        rows.forEach(function (item) {
            enums.vehicleInfo.push(item);
        });
        methods.debug('Vehicle Info Loaded: ' + enums.vehicleInfo.length);
    });
};