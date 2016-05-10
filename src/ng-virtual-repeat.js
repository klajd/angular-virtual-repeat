angular
    .module('ngVirtualRepeat')
    .directive('ngVirtualRepeat', NgVirtualRepeatDirective);

NgVirtualRepeatDirective.$inject = ['$log', '$rootElement'];
function NgVirtualRepeatDirective($log, $rootElement) {
    return {
        restrict: 'A',
        link: link,
        scope: {
            data: '=ngVirtualRepeat'
        }
    };

    function link(scope, element, attrs) {
        var viewport = findParent(element, 'ng-virtual-repeat-container');
        var container = viewport.find('div').eq(0);
        var renderOffset = 20;  //how element to render out of the viewport
        var rowHeight = 37;
        var rowWidth = 0;
        var scrollTop = 0;
        var scrollLeft = 0;
        var rendered = [];
        var data = scope.data;
        var matrix = {
            data: data,
            rows: {
                // rendered: undefined,
                total: data.length,
                active: 0,
                visible: 0,
                firstActive: 0,
                first: 0
            },
            cols: {
                // rendered: undefined,
                total: data.length > 0 ? data[0].length : 0,
                active: 0,
                visible: 0,
                firstActive: 0,
                first: 0
            }
        };

        scope.$watch(function () { return matrix; }, render, true);

        // row height calculate
        // var td = element.find('td')[0];
        // rowHeight = td.clientHeight;
        // console.log(td.clientHeight, td.clientWidth);
        container.css({ 'padding-top': matrix.rows.first * rowHeight + 'px' });
        container.css({ 'height': matrix.rows.total * rowHeight + 'px' });
        var i = 0;
        viewport.bind('scroll', function onViewportScroll(event) {
            var isHorizontal = scrollTop === event.target.scrollTop;
            var isVertical = scrollLeft === event.target.scrollLeft;

            scrollTop = event.target.scrollTop;
            scrollLeft = event.target.scrollLeft;

            // cols
            // TODO

            // if (isVertical && needLoad) {

            // }

            // rows
            var m = {
                data: matrix.data
            };

            m.rows = {
                first: Math.floor(scrollTop / rowHeight),
                firstActive: 0, // CALCULATE
                active: 0,
                visible: Math.ceil(viewport[0].clientHeight / rowHeight),
                total: matrix.rows.total
            };

            m.cols = {}

            // if (isHorizontal && needLoadHorizontal) {

            // }

            console.log(m.rows.first)

            render(m, matrix);
            matrix.rows = m.rows;
        });

        function render(matrix, oldMatrix) {
            if (!matrix) return;

            // source change
            // if (matrix.data != oldMatrix.data) {
            //   element.empty();
            // }

            // is first render for matrix
            if (rendered.length === 0) {
                var start = 0;
                var end = 20;
                var startCol = 0;
                var endCol = 50;

                for (var r = start; r < end; r++) {
                    var trElement = angular.element('<tr>');
                    for (var c = startCol; c < endCol; c++) {
                        trElement.append(['<td>', matrix.data[r][c], '</td>'].join(''));
                    }
                    rendered.push(trElement);
                    element.append(trElement);
                }
                return;
            }
            var movedVertical = matrix.rows.first - oldMatrix.rows.first;
            var movedHorizontal = matrix.cols.first - oldMatrix.cols.first;

            if (movedVertical) {
                var bottom = movedVertical > 0;
                var delta = Math.abs(movedVertical);
                var removeAction = bottom ? 'shift' : 'pop';
                var appendAction = bottom ? 'push' : 'unshift';
                var domAction = bottom ? 'append' : 'prepend';

                delta = delta > matrix.rows.total ? matrix.rows.total : delta;
                delta = delta > 20 ? 20 : delta;

                // buffer teknik
                for (var i = 0; i < delta; i++) {
                    var removed = rendered[removeAction]();
                    removed.remove();

                    var rowIndex = matrix.rows.first + matrix.rows.visible + i;
                    //console.debug(matrix.rows.first, rowIndex);
                    var appended = getRow(rowIndex, 0, 50);
                    element[domAction](appended);
                    rendered[appendAction](appended);
                    // console.debug(rowIndex, appended);
                }

            }

            container.css({ 'padding-top': matrix.rows.first * rowHeight + 'px' });
            container.css({ 'height': matrix.rows.total * rowHeight + 'px' });

            //viewport[0].scrollTop = viewport[0].clientHeight + viewport[0].scrollHeight;

            if (movedHorizontal) {
                // var right = movedHorizontal > 0;
                // TODO

            }

            function getRow(rowIndex, startCol, endCol) {
                var trElement = angular.element('<tr>');
                for (var c = startCol; c < endCol; c++) {
                    trElement.append(['<td>', matrix.data[rowIndex][c], '</td>'].join(''));
                }
                return trElement;
            }

        }

        //var viewportStyle = window.getComputedStyle(td);
        // var rH = computeRowHeight(td);
    }

    function appendRow(row, rowIndex) {
        var tr = "<tr>";
        angular.forEach(row, function (cell, index) {

            //TODO remove
            if (index === 0)
                tr += ['<td class="row-count">', rowIndex, '</td>'].join('');

            if (index > 50)
                return;

            tr += ['<td>', cell, '</td>'].join('');
        });

        tr += '</tr>';
        return tr;
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
        return parent;
    }

    /**
     * Clip the range.
     */
    function clip(value, min, max) {
        if (angular.isArray(value)) {
            return angular.forEach(value, function (v) {
                return clip(v, min, max);
            });
        }
        return Math.max(min, Math.min(value, max));
    }

}