angular
    .module('ngVirtualRepeat')
    .directive(NgVirtualRepeatDirective);

NgVirtualRepeatDirective.$inject = ['$log', '$rootElement'];
function NgVirtualRepeatDirective($log, $rootElement) {
    return {
        restrict: 'A',
        link: link
    };

    function link(scope, element, attrs) {
    }
}