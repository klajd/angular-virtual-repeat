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

            scope.watchSize = scope.watchSize === undefined ? true : false;
            scope.cellHeight = parseInt(scope.cellHeight) || 40;
            scope.cellWidth = parseInt(scope.cellWidth) || 70;
            // TODO make possible to watch in case of viewport resize
            var visibleRows = Math.ceil(viewport[0].clientHeight / scope.cellHeight);
            var visibleCols = Math.ceil(viewport[0].clientWidth / scope.cellWidth);

            scope.$watch('matrix', onMatrixChange);
            viewport.bind('scroll', onViewportScroll);

            if (scope.cellWidth || scope.cellHeight)
                scope.$watchGroup(['cellHeight', 'cellWidth'], onCellSizeChange);

            if (scope.watchSize)
                scope.$watch(getViewPortSize, onSizeChange);


            function onMatrixChange(newValue, oldValue) {
                if (newValue === undefined) {
                    element.empty();
                } else {
                    render(scope.matrix, [0, 0]);
                }
            }

            function onCellSizeChange(newValue, oldValue) {
                visibleRows = Math.ceil(viewport[0].clientHeight / scope.cellHeight);
                visibleCols = Math.ceil(viewport[0].clientWidth / scope.cellWidth);
                var startCell = [
                    Math.floor(scrollTop / scope.cellHeight),
                    Math.floor(scrollLeft / scope.cellWidth)
                ];

                render(scope.matrix, startCell);
            }

            function getViewPortSize() {
                return viewport[0].clientHeight + viewport[0].clientWidth;
            }

            function onSizeChange() {
                visibleRows = Math.ceil(viewport[0].clientHeight / scope.cellHeight);
                visibleCols = Math.ceil(viewport[0].clientWidth / scope.cellWidth);
                var startCell = [
                    Math.floor(scrollTop / scope.cellHeight),
                    Math.floor(scrollLeft / scope.cellWidth)
                ];

                render(scope.matrix, startCell);
            }

            function onViewportScroll(event) {
                scrollTop = event.target.scrollTop;
                scrollLeft = event.target.scrollLeft;
                var startCell = [
                    Math.floor(event.target.scrollTop / scope.cellHeight),
                    Math.floor(event.target.scrollLeft / scope.cellWidth),
                ];

                render(scope.matrix, startCell);
            }

            function render(matrix, startCell) {
                if (!matrix) return;

                console.debug('is renering ...');
                element.empty();

                var startRow = startCell[0];
                var StartCol = startCell[1];
                var endRow = startCell[0] + visibleRows + 1;
                var endCol = startCell[1] + visibleCols + 1;
                var totalRows = matrix.length;
                var totalCols = matrix[0].length;
                if (endRow > totalRows) endRow = totalRows;
                if (endCol > totalCols) endCol = totalCols;

                element.append(generateTemplate(matrix, startCell, [endRow, endCol]));

                container.css({ 'padding-top': startRow * scope.cellHeight + 'px' });
                container.css({ 'height': totalRows * scope.cellHeight + 'px' });
                container.css({ 'padding-left': StartCol * scope.cellWidth + 'px' });
                container.css({ 'width': totalCols * scope.cellWidth + 'px' });
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
                    trElement += ['<td>', matrix[r][c] , '</td>'].join('');
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