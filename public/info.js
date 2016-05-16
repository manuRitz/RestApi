//angular.js infoController
function info($scope, $http) {
    var app = require('../server').app;

    $http.get(app.url).success(function(data) {
            $scope.infos = data;
        });
}