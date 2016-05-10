(function () {
    "use strict";

    angular
        .module('ngVirtualRepeat')
        .directive('ngVirtualRepeat', NgVirtualRepeatDirective);

    NgVirtualRepeatDirective.$inject = [];
    function NgVirtualRepeatDirective() {
        return {
            restrict: 'A',
            link: link,
            scope: {
                matrix: '=ngVirtualRepeat',
                cellHeight: '@',
                cellWidth: '@'
            }
        };

        function link(scope, element, attrs) {
            var viewport = findParent(element, 'ng-virtual-repeat-container');
            var container = viewport.find('div').eq(0);

            scope.cellHeight = parseInt(scope.cellHeight) || 40;
            scope.cellWidth = parseInt(scope.cellWidth) || 70;
            // TODO make possible to watch in case of viewport resize
            var visibleRows = Math.ceil(viewport[0].clientHeight / scope.cellHeight);
            var visibleCols = Math.ceil(viewport[0].clientWidth / scope.cellWidth);

            scope.$watch('matrix', function (newValue, oldValue) {
                // visibleRows = Math.ceil(viewport[0].clientHeight / scope.cellHeight);
                // visibleCols = Math.ceil(viewport[0].clientWidth / scope.cellWidth);
                if (newValue === undefined) {
                    element.empty();
                    element.append('<tr><td></td><tr>');
                } else {
                    render(scope.matrix, [0, 0]);
                }
            });

            viewport.bind('scroll', function onViewportScroll(event) {
                var startCell = [
                    Math.floor(event.target.scrollTop / scope.cellHeight),
                    Math.floor(event.target.scrollLeft / scope.cellWidth),
                ];

                render(scope.matrix, startCell);
            });

            function render(matrix, startCell) {
                if (!matrix) return;

                element.empty();

                var startRow = startCell[0]
                var StartCol = startCell[1]
                var endRow = startCell[0] + visibleRows + 1;
                var endCol = startCell[1] + visibleCols + 1;
                var totalRows = matrix.length;
                var totalCols = matrix[0].length;
                if (endRow > totalRows) endRow = totalRows;
                if (endCol > totalCols) endCol = totalCols;

                element.append(generateTemplate(matrix, startCell, [endRow, endCol]));

                container.css({ 'padding-top': startRow * scope.cellHeight + 'px' });
                container.css({ 'height': (totalRows - visibleRows) * scope.cellHeight + 'px' });
                container.css({ 'padding-left': StartCol * scope.cellWidth + 'px' });
                container.css({ 'width': (totalCols - visibleCols) * scope.cellWidth + 'px' });
            }
        }

        /**
         * Generate table html template from matrix and the diplay port
         * @param {Object} matrix - the matrix handling data.
         * @param {Array} start - the top left koordinate of matrix where begin display
         * @param {Array} end - the bottom right koordinate of the matrix where ends display
         * @returns {String} - the html generated tempalte.
         */
        function generateTemplate(matrix, start, end) {
            var template = '';
            for (var r = start[0]; r < end[0]; r++) {
                var trElement = '<tr>';
                for (var c = start[1]; c < end[1]; c++) {
                    trElement += ['<td>', matrix[r][c], '</td>'].join('');
                }
                template += trElement;
            }
            return template;
        }
        
        // TODO remove
        function generateJqTemplate(){
            // for (var r = start; r < end; r++) {
            //     var trElement = angular.element('<tr>');
            //     for (var c = startCol; c < endCol; c++) {
            //         trElement.append(['<td>', matrix.data[r][c], '</td>'].join(''));
            //     }
            //     element.append(trElement);
            // }
        }

        /**
         * Find parent element by selector.
         * @param {jqElement} element - current element.
         * @param {string} selector - class selector.
         * @returns {jqElement} - the parent element found or undefined if none.
         */
        function findParent(element, selector) {
            if (!element) return;
            if (!selector)
                //todo refactor error
                throw new Error('findParent, selector not specified');

            var parent = element.parent();
            while (parent) {

                if (parent.hasClass(selector))
                    return parent;

                parent = parent.parent();
            }
            return;
        }

    }
})();