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
        var params = req.params;
        var year = params.year;
        var name = params.name;
        var type = params.type;
        var country = params.country;

        if (year) {
            mongoose.model('wines').find({'year': year}, function (err, wine) {
                res.send(wine);
            })
        } else if (name) {
            mongoose.model('wines').find({'name': name}, function (err, wine) {
                res.send(wine);
            })
        } else if (type) {
            mongoose.model('wines').find({'type': type}, function (err, wine) {
                res.send(wine);
            })
        } else if (country) {
            mongoose.model('wines').find({'country': country}, function (err, wine) {
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
            if (err) {
                res.send(400, {'error': 'UNKNOWN_OBJECT'});
            } else {
                res.send(wine);
            }
        });
    };

    //post a wine and validate params
    this.postWine = function (req, res, next) {
        var newWine = new Wine(req.params);

        newWine.save(function (err, data) {
            if (err) {
                console.log(err);


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

                if (err.name === 'CastError') {
                    errMessage.validation[err.path] = 'INVALID';
                }


                res.send(400, errMessage);
            } else {
                res.send(data);
            }
        });
    };

    //update a wine by id and validate params
    this.putWine = function (req, res) {
        mongoose.model('wines').findOneAndUpdate({'_id': req.params.id}, {$set: req.params}, {runValidators: true}, function (err, data) {
            if (err) {
                console.log(err);


                if (err.name === 'CastError') {
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
        mongoose.model('wines').findOne({'_id': req.params.id}, function (err, data) {
            if (err) {
                res.send(400, {error: 'UNKNOWN_OBJECT'});
            } else {
                data.remove();
                res.send({success: true});
            }
        })
    };
    return this;

};

module.exports = new wineController();