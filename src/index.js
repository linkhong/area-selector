//import AreaSelector from 'Area';
var AreaSelector = require("./Area.js");
(function (global, factory) {
  if (typeof module !== 'undefined' && typeof exports === 'object') {
    module.exports = factory();
  } else if (typeof define === 'function' && (define.amd || define.cmd)) {
    define(function () {
      return factory();
    });
  } else {
    global.AreaSelector = factory();
  }
})(window,function() {
  return AreaSelector;
});
