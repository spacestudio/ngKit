"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var http_1 = require('@angular/http');
var ngkit_1 = require('./src/ngkit');
var config_1 = require('./src/config');
var services_1 = require('./src/services');
__export(require('./src/ngkit'));
__export(require('./src/config'));
__export(require('./src/services'));
exports.NGKIT_PROVIDERS = [
    ngkit_1.ngKit,
    services_1.Authentication,
    services_1.Authorization,
    config_1.Config,
    services_1.RestClient,
    services_1.HttpClient,
    http_1.HTTP_PROVIDERS,
    services_1.Token,
];
