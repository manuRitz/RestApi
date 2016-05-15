function wineController() {
    var Wine = require('../models/wine');
    var mongoose = require('../db').mongoose;

    var ValidationErrors = {
        REQUIRED: 'required',
        NOTNUMBER: 'user defined',
        ENUMNOTVALID: 'enum'
    };

    //get all wines
    this.getWine = function (req, res) {
        //search parameters available
        if (req.params) {
            //validate search parameters
            var params = req.params;
            for (var param in req.params) {
                if (param !== 'year' && param !== 'name' && param !== 'type' && param !== 'country') {
                    delete params[param];
                }
            }
            mongoose.model('wines').find(params, function (err, wine) {
                res.send(wine);
            })
        } else {
            mongoose.model('wines').find(function (err, wine) {
                res.send(wine);
            })
        }
    };
    //gat a wine by id
    this.getWineById = function (req, res) {
        mongoose.model('wines').findOne({'_id': req.params.id}, function (err, wine) {
            if (wine === null || err) {
                res.send(400, {'error': 'UNKNOWN_OBJECT'});
            } else {
                res.send(wine);
            }
        });
    };

    //post a wine and validate params
    this.postWine = function (req, res, next) {
        var newWine = new Wine(req.params);

        newWine.save(function (err, wine) {
            if (err) {
                var errMessage = {
                    error: 'VALIDATION_ERROR',
                    validation: {}
                };

                for (var errName in err.errors) {
                    switch (err.errors[errName].kind) {
                        case ValidationErrors.REQUIRED:
                            errMessage.validation[errName] = 'MISSING';
                            break;
                        case ValidationErrors.ENUMNOTVALID:
                            errMessage.validation[errName] = 'INVALID';
                            break;
                        case ValidationErrors.NOTNUMBER:
                            errMessage.validation[errName] = 'INVALID';
                            break;
                    }
                }
                res.send(400, errMessage);
            } else {
                res.send(wine);
            }
        });
    };

    //update a wine by id and validate params
    this.putWine = function (req, res) {
        mongoose.model('wines').findOneAndUpdate({'_id': req.params.id}, {$set: req.params}, {runValidators: true}, function (err, wine) {
            if (wine === null || err) {
                if (wine === null || err.name === 'CastError') {
                    res.send(400, {'error': 'UNKNOWN_OBJECT'});
                }

                var errMessage = {
                    error: 'VALIDATION_ERROR',
                    validation: {}
                };

                for (var errName in err.errors) {
                    switch (err.errors[errName].kind) {
                        case ValidationErrors.REQUIRED:
                            errMessage.validation[errName] = 'MISSING';
                            break;
                        case ValidationErrors.ENUMNOTVALID:
                            errMessage.validation[errName] = 'INVALID';
                            break;
                        case ValidationErrors.NOTNUMBER:
                            errMessage.validation[errName] = 'INVALID';
                            break;
                    }
                }
                res.send(400, errMessage);
            } else {
                Wine.findOne({'_id': req.params.id}, function (err, data) {
                    res.send(data);
                });
            }
        })
    };

    //delete a wine by id
    this.deleteWine = function (req, res, next) {
        mongoose.model('wines').findOne({'_id': req.params.id}, function (err, wine) {
            if (wine === null || err) {
                res.send(400, {error: 'UNKNOWN_OBJECT'});
            } else {
                wine.remove();
                res.send({success: true});
            }
        })
    };
    return this;
};

module.exports = new wineController();