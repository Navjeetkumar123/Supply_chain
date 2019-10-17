var app = angular.module('MyApp', ['ngRoute','angularUtils.directives.dirPagination']).config(
    ['$routeProvider', function($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'partials/supplier.html',
        }).when('/supplier', {
            templateUrl: 'partials/supplier.html',
        }).when('/manufacturer', {
            templateUrl: 'partials/manufacturer.html',
        }).when('/logistics', {
            templateUrl: 'partials/logistics.html',
        }).when('/distributor', {
            templateUrl: 'partials/distributor.html',
        }).when('/retailer', {
            templateUrl: 'partials/retailer.html',
        }).when('/viewTransaction', {
            templateUrl: 'partials/viewTransaction.html',
        }).when('/verificationUI', {
            templateUrl: 'partials/verificationUI.html',
        }).when('/viewExplorer', {
            templateUrl: 'partials/viewExplorer.html',
        })       
       
    }]);


app.directive('fileModel', ['$parse', function($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            element.bind('change', function() {
                scope.$apply(function() {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);
