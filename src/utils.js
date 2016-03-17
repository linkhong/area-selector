exports.addListener = (function () {
  if (Element.prototype.addEventListener) {
    return function (element, type, handler) {
      element.addEventListener(type, handler, false);
    }
  } else {
    return function (element, type, handler) {
      element.attachEvent("on" + type, handler);
    }
  }
})();
exports.removeListener = (function () {
  if (Element.prototype.addEventListener) {
    return function (element, type, handler) {
      element.removeEventListener(type, handler, false);
    }
  } else {
    return function (element, type, handler) {
      element.detachEvent("on" + type, handler);
    }
  }
})();
// utils
exports.getObjectLength = function (obj) {
  var len = 0;
  for (var temp in obj) {
    len++;
  }
  return len;
}

exports.preventDefault = function (event) {
  if (event.stopPropagation) {
    event.stopPropagation();
  } else {
    event.cancelBubble = true;
  }
}

exports.getNode = function(id) {
  return document.getElementById(id);
}
