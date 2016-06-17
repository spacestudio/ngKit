"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var Config = (function () {
    function Config() {
        this.defaultOptions = {
            authentication: {
                endpoints: {
                    check: '',
                    forogotPassword: '',
                    getUser: '',
                    login: '',
                    register: '',
                }
            },
            authorization: {},
            http: {
                baseUrl: '',
            },
            rest: {
                baseUrl: '',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            },
            token: {}
        };
    }
    Config.prototype.getOptions = function () {
        return this.options;
    };
    Config.prototype.get = function (key, override) {
        if (override) {
            return override;
        }
        return key.split('.').reduce(function (o, i) { return o[i]; }, this.options);
    };
    Config.prototype.setOptions = function (options) {
        this.options = Object.assign(this.defaultOptions, options);
        return this.options;
    };
    Config = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], Config);
    return Config;
}());
exports.Config = Config;
