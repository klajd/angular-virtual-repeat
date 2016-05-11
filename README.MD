# NG Virtual Repeat
Bind only visible data to html using viewport.  
[Live Demo](http://klajd.github.io/angular-virtual-repeat)

## Usage
The vm.grid is an matrix (an array with arrays).  
The directive generates table element by calculating the viewport.  
The cell-height and cell-width attributes are optional.

```html
<div class="ng-virtual-repeat-container">
    <div>
        <table>
            <tbody ng-virtual-repeat="vm.grid" [cell-height="40"] [cell-width="70"]>
            </tbody>
        </table>
    </div>
</div>
```

## Demo 

    npm install
    bower install
    
    npm start

## Build

    gulp build
    
