'use strict';

/**
 * controller to manage information about REST API
 * @returns {InfoController} return InfoController
 */
function InfoController() {

    /**
     * get info about api
     * @param {request} req request
     * @param {response} res response
     * @returns {void}
     */
    this.getInfo = function (req, res) {
        var app = require('../server').app;

        var info = [];

        for (var key in app.router.mounts) {
            if (app.router.mounts.hasOwnProperty(key)) {
                var val = app.router.mounts[key];
                if (val.name.match('wines')) {
                    var obj = {
                        type: val.method,
                        name: val.name,
                        path: val.spec.path
                    };
                    info.push(obj);
                }
            }
        }
        res.send(info);
    }
    return this;
}

module.exports = new InfoController();