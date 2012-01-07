# sc4node
sc4node is a library for node.js which enables to execute and comunicate with 
SuperCollider programming language (sclang).

## How to Install
    npm install sc4node

## How to use
```js
var sc = require('sc4node');

// invoke 'sclang' and attach stdout handler. 
var sclang = new sc.Sclang('/Applications/SuperCollider/', function (data) {
  console.log('sclang stdout: ' + data);
});
```
You may find more usage in ./example/app.js

## License 
sc4node is released under the GNU General Public License (GPL) version 3, 
see the file 'COPYING' for more information.
