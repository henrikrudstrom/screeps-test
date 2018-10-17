const getPixels = require('get-pixels');
let px;
getPixels('./server-tests/test-map.png', (err, pixels) => {
  console.log(pixels.get(10, 1, 1));
})
console.log(px)
