"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getObjectLength = getObjectLength;
exports.preventDefault = preventDefault;
exports.getNode = getNode;
var addListener = exports.addListener = (function () {
  if (Element.prototype.addEventListener) {
    return function (element, type, handler) {
      element.addEventListener(type, handler, false);
    };
  } else {
    return function (element, type, handler) {
      element.attachEvent("on" + type, handler);
    };
  }
})();
var removeListener = exports.removeListener = (function () {
  if (Element.prototype.addEventListener) {
    return function (element, type, handler) {
      element.removeEventListener(type, handler, false);
    };
  } else {
    return function (element, type, handler) {
      element.detachEvent("on" + type, handler);
    };
  }
})();
// utils
function getObjectLength(obj) {
  var len = 0;
  for (var temp in obj) {
    len++;
  }
  return len;
}

function preventDefault(event) {
  if (event.stopPropagation) {
    event.stopPropagation();
  } else {
    event.cancelBubble = true;
  }
}

function getNode(id) {
  return document.getElementById(id);
}