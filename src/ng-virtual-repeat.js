(function () {
    "use strict";

    angular.module('ngVirtualRepeat', []);

    angular
        .module('ngVirtualRepeat')
        .directive('ngVirtualRepeat', NgVirtualRepeatDirective);

    NgVirtualRepeatDirective.$inject = [];
    function NgVirtualRepeatDirective() {
        return {
            restrict: 'A',
            link: link,
            scope: {
                matrix: '=ngVirtualRepeat'
            }
        };

        function link(scope, element, attrs) {
            var viewport = findParent(element, 'ng-virtual-repeat-container');
            var container = viewport.find('div').eq(0);
            var scrollTop = 0;
            var scrollLeft = 0;
            var visibleRows = 0;
            var visibleCols = 0;
            var cellWidth = 0;
            var cellHeight = 0;
            var watchSize = attrs.watchSize === undefined ? false : true;
            viewport.css({
                overflow: 'scroll',
                width: '100%',
                height: '600px'
            });

            calculateCellSize();

            scope.$watch('matrix', function onMatrixChange(newValue, oldValue) {
                if (newValue === undefined)
                    element.empty();
                else
                    render();
            });

            viewport.bind('scroll', function onViewportScroll(event) {
                scrollTop = event.target.scrollTop;
                scrollLeft = event.target.scrollLeft;

                render();
            });

            if (watchSize)
                scope.$watch(function getViewPortSize() {
                    return viewport[0].clientHeight + viewport[0].clientWidth;
                }, function onSizeChange() {
                    render();
                });

            /**
             * Calculate cell size by faking a dummy td.
             */
            function calculateCellSize() {
                var dummyCell = element.append('<tr><td></td></tr>').find('td')[0];
                cellWidth = dummyCell.offsetWidth;
                cellHeight = dummyCell.offsetHeight;
            }

            /**
             * Calculate parameters and render the template to the view.
             */
            function render() {
                var matrix = scope.matrix;

                if (!matrix) return;

                element.empty();
                visibleRows = Math.ceil(viewport[0].clientHeight / cellHeight);
                visibleCols = Math.ceil(viewport[0].clientWidth / cellWidth);

                var startRow = Math.floor(scrollTop / cellHeight);
                var StartCol = Math.floor(scrollLeft / cellWidth);
                var endRow = startRow + visibleRows + 1;
                var endCol = StartCol + visibleCols + 1;
                var totalRows = matrix.length;
                var totalCols = matrix[0].length;
                if (endRow > totalRows) endRow = totalRows;
                if (endCol > totalCols) endCol = totalCols;

                element.append(generateTemplate(matrix, [startRow, StartCol], [endRow, endCol]));

                container.css({ 'padding-top': startRow * cellHeight + 'px' });
                container.css({ 'height': totalRows * cellHeight + 'px' });
                container.css({ 'padding-left': StartCol * cellWidth + 'px' });
                container.css({ 'width': totalCols * cellWidth + 'px' });
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