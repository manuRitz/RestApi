//angular.js infoController
function info($scope, $http) {
    $http.get(window.location.href + '/info').success(function(data) {
            $scope.infos = data;
        });
}