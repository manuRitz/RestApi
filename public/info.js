'use strict';

/**
 * angular.js infoController
 * @param {scope} $scope scope
 * @param {http} $http http
 * @returns {void}
 */
function info($scope, $http) {
    $http.get(window.location.href + '/info').success(function(data) {
            $scope.infos = data;
        });
}