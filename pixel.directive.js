(function () {
    'use strict';

    angular.module('app')
        .directive('pixel', pixelDirective);

    function pixelDirective() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: link
        };
        function link(scope, element, attrs, ngModel) {

            ngModel.$formatters.push(function (viewmodel) {
                if (!viewmodel) return viewmodel;

                return parseInt(viewmodel.toString().replace('px', ''));
            });

            ngModel.$parsers.push(function (model) {
                if (!model) return model;

                return model + 'px';
            });
        }
    }

})();