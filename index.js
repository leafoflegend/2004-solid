"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var delay = function (time) { return new Promise(function (res) {
    setTimeout(res, time);
}); };
var Door = /** @class */ (function () {
    function Door() {
        var _this = this;
        this.doorOpen = false;
        this.DOOR_OPENING_LENGTH = 1000;
        this.open = function () { return new Promise(function (res, rej) {
            if (_this.doorOpen)
                rej(new Error('Door is already open.'));
            setTimeout(function () {
                _this.doorOpen = true;
                res(true);
            }, _this.DOOR_OPENING_LENGTH);
        }); };
        this.close = function () { return new Promise(function (res, rej) {
            if (!_this.doorOpen)
                rej(new Error('Door is already closed.'));
            setTimeout(function () {
                _this.doorOpen = false;
                res(false);
            }, _this.DOOR_OPENING_LENGTH);
        }); };
        this.checkDoorOpen = function () { return _this.doorOpen; };
    }
    return Door;
}());
var Floors = /** @class */ (function () {
    function Floors(min, max, powerSupply) {
        var _this = this;
        this.TIME_PER_FLOOR = 300;
        this.checkCurrentFloor = function () { return _this.floorRange.current; };
        this.checkIfFloorInBounds = function (floor) {
            return !(floor < _this.floorRange.min || floor > _this.floorRange.max);
        };
        this.goTo = function (floor) { return new Promise(function (res, rej) {
            var isPowerRemaining = _this.powerSupply.checkIfPowerRemaining(_this.floorRange.current, floor);
            if (!isPowerRemaining)
                rej(new Error("Not enough power remaining to go to floor " + floor + "."));
            var isFloorInBounds = _this.checkIfFloorInBounds(floor);
            if (!isFloorInBounds)
                rej(new Error("Floor " + floor + " does not exist in this elevator system."));
            setTimeout(function () {
                _this.floorRange.current = floor;
                res(true);
            }, Math.abs(_this.floorRange.current - floor) * _this.TIME_PER_FLOOR);
        }); };
        this.floorRange = {
            min: min,
            max: max,
            current: 0,
        };
        this.powerSupply = powerSupply;
    }
    return Floors;
}());
var PowerSupply = /** @class */ (function () {
    function PowerSupply(startingPower) {
        var _this = this;
        this.COST_PER_FLOOR = 1;
        this.RECHARGE_SPEED = 5000;
        this.checkIfPowerRemaining = function (currentFloor, floor) {
            var distance = Math.abs(currentFloor - floor);
            var cost = distance * _this.COST_PER_FLOOR;
            return cost < _this.powerRemaining;
        };
        this.checkCurrentPower = function () { return _this.powerRemaining; };
        this.goTo = function (currentFloor, floor) {
            var cost = Math.abs(currentFloor - floor) * _this.COST_PER_FLOOR;
            _this.powerRemaining -= cost;
        };
        this.powerRemaining = startingPower;
        setInterval(function () {
            ++_this.powerRemaining;
        }, this.RECHARGE_SPEED);
    }
    return PowerSupply;
}());
var Elevator = /** @class */ (function () {
    function Elevator(startingPower, min, max) {
        var _this = this;
        this.checkCurrentFloor = function () { return _this.floors.checkCurrentFloor(); };
        this.goToFloor = function (floor) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // TODO: Introduce a queueing system to plan the next floor.
                        if (this.doors.checkDoorOpen())
                            throw new Error('Door is currently open, cannot change floors yet.');
                        console.log('Going to floor: ', floor);
                        return [4 /*yield*/, this.floors.goTo(floor)];
                    case 1:
                        _a.sent();
                        console.log('Arrived at floor: ', floor);
                        // TODO: Would need to calculate the cost of power in advance for opening and closing, and ensure we could do this on top of the elevator move itself.
                        console.log('Opening doors...');
                        return [4 /*yield*/, this.doors.open()];
                    case 2:
                        _a.sent();
                        console.log('Doors opened.');
                        return [4 /*yield*/, delay(2000)];
                    case 3:
                        _a.sent();
                        console.log('Doors closing...');
                        return [4 /*yield*/, this.doors.close()];
                    case 4:
                        _a.sent();
                        console.log('Doors closed.');
                        return [2 /*return*/];
                }
            });
        }); };
        var powerSupply = new PowerSupply(startingPower);
        var floors = new Floors(min, max, powerSupply);
        // TODO: Doors cost power too!
        var doors = new Door();
        this.floors = floors;
        this.doors = doors;
    }
    return Elevator;
}());
var QueueableElevator = /** @class */ (function (_super) {
    __extends(QueueableElevator, _super);
    function QueueableElevator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return QueueableElevator;
}(Elevator));
var elevator = new Elevator(100, 0, 25);
var start = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('Starting Floor: ', elevator.checkCurrentFloor());
                return [4 /*yield*/, elevator.goToFloor(13)];
            case 1:
                _a.sent();
                console.log('Floor After Move 1: ', elevator.checkCurrentFloor());
                return [4 /*yield*/, elevator.goToFloor(20)];
            case 2:
                _a.sent();
                console.log('Floor After Move 2: ', elevator.checkCurrentFloor());
                return [2 /*return*/];
        }
    });
}); };
start();
