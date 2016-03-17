'use strict';

var _Area = require('Area');

var _Area2 = _interopRequireDefault(_Area);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

(function (global, factory) {
  if (typeof module !== 'undefined' && (typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') {
    module.exports = factory();
  } else if (typeof define === 'function' && (define.amd || define.cmd)) {
    define(function () {
      return factory();
    });
  } else {
    global.AreaSelector = factory();
  }
})(window, function () {
  return _Area2.default;
});