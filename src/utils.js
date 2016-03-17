export var addListener = (function () {
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
export var removeListener = (function () {
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
export function getObjectLength(obj) {
  var len = 0;
  for (var temp in obj) {
    len++;
  }
  return len;
}

export function preventDefault(event) {
  if (event.stopPropagation) {
    event.stopPropagation();
  } else {
    event.cancelBubble = true;
  }
}

export function getNode(id) {
  return document.getElementById(id);
}
