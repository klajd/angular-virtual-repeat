(function () {
    'use strict';

    angular.module('app', [
        'component.demo',
        'ngVirtualRepeat'
    ]);

    angular.module('app').run(function ($rootScope) {
        $rootScope.config = {
            tabs: [
                { title: 'Home', template: 'home.html' },
            ]
        };
    });

})();