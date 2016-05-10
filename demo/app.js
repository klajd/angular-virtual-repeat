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
        vm.grid = generateGrid(1000, 1000);
        vm.$onInit = init;
        vm.generateGrid = generateGrid;

        function init() {
            vm.rows = 1000;
            vm.cols  = 1000;
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

})();