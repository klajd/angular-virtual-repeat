(function () {
    'use strict';

    angular.module('app', [
        'ui.bootstrap',
    ]);

    angular.module('app')
        .controller('AppController', AppController);

    AppController.$inject = ['$scope'];
    function AppController(scope) {
        var vm = this;
        vm.active = 2;
        vm.tabs = [
            { title: 'Validate', template: 'validate-simple.html' },
            { title: 'Validate Special', template: 'validate-special.html' },
            { title: 'Validate Custom', template: 'validate-custom.html' }
        ];

        vm.$onInit = function () {

        };

    }

})();