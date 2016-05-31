# NG Virtual Repeat
Bind only visible data to html using viewport.  
[Live Demo](http://klajd.github.io/angular-virtual-repeat)

## Install

    npm install angular-virtual-repeat

## Usage
The vm.matrix is a matrix (an array with arrays).  
The directive generates table element by calculating the viewport named **ng-virtual-repeat-container**.  
The cell-height and cell-width attributes are optional.

```javascript
angular.module('app', [
    'ngVirtualRepeat'
]);
```

```javascript
vm.matrix = [
  ["0, 0", "0, 1", "0, 2" ...]  
  ["1, 0", "1, 1", "1, 2" ...]  
  ["2, 0", "2, 1", "2, 2" ...]  
  ...
];
```

```html
<div class="ng-virtual-repeat-container">
    <div>
        <table>
            <tbody ng-virtual-repeat="vm.matrix" [watch-size="true"]>
            </tbody>
        </table>
    </div>
</div>
```

## Options

- `ng-virtual-repeat-container` : the class of the parent div to serve as a viewport default css: overflow: scroll, width: 100%, height: 600px
- `ng-virtual-repeat`   : matrix object, the directive itself
- `watch-size`          : bool, default: false, watch for viewport resize if source data are immutable

## Demo 
[Live Demo](http://klajd.github.io/angular-virtual-repeat) or clone and run.

    npm install
    bower install
    
    npm start

## Build

    gulp build
    

## Note
This implementation lack of posibility to add header in the table.  
But a common solution is to add headers in separate div and simply sync with scroll events if needed.

## Author 
You are wellcome to add additional feature and make pull request :smile: