module.exports = function (app) {
    var wineController = require('./controllers/wineController');

    app.get('/wines', wineController.getWine);
    app.get('/wines/:id', wineController.getWineById);

    app.post('/wines', wineController.postWine);

    app.put('/wines/:id', wineController.putWine);

    app.del('/wines/:id', wineController.deleteWine);
};


