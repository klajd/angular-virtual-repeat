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
                cellHeight: '@?',
                cellWidth: '@?',
                watchSize: '@?'
            }
        };

        function link(scope, element, attrs) {
            var viewport = findParent(element, 'ng-virtual-repeat-container');
            var container = viewport.find('div').eq(0);
            var scrollTop = 0;
            var scrollLeft = 0;
            var visibleRows = 0;
            var visibleCols = 0;
            scope.watchSize = scope.watchSize === undefined ? true : false;
            scope.cellHeight = parseInt(scope.cellHeight) || 40;
            scope.cellWidth = parseInt(scope.cellWidth) || 70;
            viewport.css({
                overflow: 'scroll',
                width: '100%',
                height: '600px'
            });

            scope.$watch('matrix', function onMatrixChange(newValue, oldValue) {
                if (newValue === undefined)
                    element.empty();
                else
                    render();
            });

            viewport.bind('scroll', function onViewportScroll(event) {
                scrollTop = event.target.scrollTop;
                scrollLeft = event.target.scrollLeft;

                render(true);
            });

            if (scope.cellWidth || scope.cellHeight)
                scope.$watchGroup(['cellHeight', 'cellWidth'], function onCellSizeChange(newValue, oldValue) {
                    render();
                });

            if (scope.watchSize)
                scope.$watch(function getViewPortSize() {
                    return viewport[0].clientHeight + viewport[0].clientWidth;
                }, function onSizeChange() {
                    render();
                });

            /**
             * Calculate parameters and render the template to the view.
             * @param {Boolean} isScroll - prevent visibleRows and visibleCols calculation
             */
            function render(isScroll) {
                var matrix = scope.matrix;

                if (!matrix) return;

                element.empty();

                if (!isScroll) {
                    visibleRows = Math.ceil(viewport[0].clientHeight / scope.cellHeight);
                    visibleCols = Math.ceil(viewport[0].clientWidth / scope.cellWidth);
                }

                var startRow = Math.floor(scrollTop / scope.cellHeight);
                var StartCol = Math.floor(scrollLeft / scope.cellWidth);
                var endRow = startRow + visibleRows + 1;
                var endCol = StartCol + visibleCols + 1;
                var totalRows = matrix.length;
                var totalCols = matrix[0].length;
                if (endRow > totalRows) endRow = totalRows;
                if (endCol > totalCols) endCol = totalCols;

                element.append(generateTemplate(matrix, [startRow, StartCol], [endRow, endCol]));

                container.css({ 'padding-top': startRow * scope.cellHeight + 'px' });
                container.css({ 'height': totalRows * scope.cellHeight + 'px' });
                container.css({ 'padding-left': StartCol * scope.cellWidth + 'px' });
                container.css({ 'width': totalCols * scope.cellWidth + 'px' });
                //console.debug('renderd', { paddingTop: startRow * scope.cellHeight, caller: arguments.callee.caller.name });
            }
        }

        /**
         * Generate table html template from matrix in the diplay port
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
                template += trElement + '</tr>';
            }
            return template;
        }

        /**
         * Find parent element by selector.
         * @param {jqElement} element - current element.
         * @param {String} selector - class selector.
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