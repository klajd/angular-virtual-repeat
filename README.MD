# NG Virtual Repeat
Bind only visible data to html using viewport.  
[Live Demo](http://klajd.github.io/angular-virtual-repeat)

## Install

    npm install angular-virtual-repeat

## Usage
The vm.matrix is an matrix (an array with arrays).  
The directive generates table element by calculating the viewport.  
The cell-height and cell-width attributes are optional.

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
            <tbody ng-virtual-repeat="vm.matrix" [cell-height="40"] [cell-width="70"]>
            </tbody>
        </table>
    </div>
</div>
```

## Options


## Demo 

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