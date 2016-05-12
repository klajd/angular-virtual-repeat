(function () {
    'use strict';

    angular.module('app', [
        'ui.bootstrap',
        'ngVirtualRepeat'
    ]);

    angular.module('app')
        .controller('AppController', AppController);

    AppController.$inject = ['$scope'];
    function AppController(scope) {
        var vm = this;
        vm.active = 0;
        vm.tabs = [
            { title: 'Home', template: 'grid.html' }
        ];

        vm.rows = 1000;
        vm.cols = 1000;
        vm.styles = {
            width: '800px',
            height: '500px'
        };
        vm.cellStyle = {
            width: 70,
            height: 40
        };
        vm.grid = undefined;
        vm.apply = apply;
        vm.getRenderedCellCount = getRenderedCellCount;
        vm.$onInit = init;

        function init() {
            apply();
        }

        function apply() {
            vm.rows = parseInt(vm.rows || 0);
            vm.cols = parseInt(vm.cols || 0);
            if (vm.rows * vm.cols > 1000000) {
                alert('Cant process a matrix bigger than 1,000,000 cells :(.');
                return;
            }
            vm.grid = generateGrid(vm.rows, vm.cols);
        }

        function getRenderedCellCount() {
            return (Math.floor(vm.styles.height.replace('px', '') / vm.cellStyle.height) + 1) * (Math.floor(vm.styles.width.replace('px', '') / vm.cellStyle.width) + 1);
        }

        function generateGrid(size, cols) {
            var res = [];

            for (var i = 0; i < size; i++) {
                var row = [];
                for (var j = 0; j < cols; j++) {
                    row.push('[' + i + ', ' + j + ']');
                    // row.push((Math.random() * 100 + 50));
                }
                res.push(row);
            }
            return res;
        }

    }

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