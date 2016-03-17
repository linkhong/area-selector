'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

var _utils = require('utils');

var _areaData = require('areaData');

var _areaData2 = _interopRequireDefault(_areaData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// 常量
var PROVINCE = "province",
    CITY = "city",
    DISTRICT = "district";
var AREACLASS = "area-selector-wrap",
    AREASHOWCLASS = "area-selector-wrap show",
    AREAHIDECLASS = "area-selector-wrap hide";

function AreaSelector(options) {
  var _area;

  if (!options._target) throw new Error("areaSelector need a _target node");

  this._options = {
    separator: options.separator || "/",
    callback: typeof options.callback === "function" ? options.callback : function () {
      return false;
    }
  };
  // 触发节点
  this._target = document.querySelector(options._target);
  // 是否未初始化
  this._firstClick = true;
  // 默认地区码
  this.area = (_area = {}, _defineProperty(_area, PROVINCE, null), _defineProperty(_area, CITY, null), _defineProperty(_area, DISTRICT, null), _area);

  this._isAreaChange = true;
  // 默认tab视图
  this._type = PROVINCE;

  // 缓存的控件
  this._areaElement = null;
  this._provinceTab = this._cityTab = this._districtTab = this._provincePanel = this._cityPanel = this._districtPanel = null;
  // id
  this.id = +new Date();

  if (options.area) {
    this.setArea(options.area);
  }
  this.init();
}

/*初始化控件 start*/
AreaSelector.prototype.init = function () {
  var _this = this;

  // 点击其它区域隐藏
  var hide = function hide() {
    _this._show();
    (0, _utils.removeListener)(document, "click", hide);
  };

  (0, _utils.addListener)(this._target, "click", function (event) {
    (0, _utils.preventDefault)(event);
    // 第一次点击初始化模板
    if (_this._firstClick) {
      _this._firstClick = false;
      // 生成模板并缓存7个常用节点
      _this._template();
      _this._cacheNode();
      _this._show(true);
      _this._updateBaseOnAreaCode();

      (0, _utils.addListener)(_this._areaElement, "click", function (evt) {
        (0, _utils.preventDefault)(evt);
        _this._clickHandler(evt._target || evt.srcElement);
      });
    } else {
      _this._show(true);
    }
    // 其它位置点击隐藏控件
    (0, _utils.addListener)(document, "click", hide);
  }, false);
};

AreaSelector.prototype._clickHandler = function (dom) {
  var _area2, _area3;

  var type = null;
  if (dom.nodeName === "DD") {
    // id: area_province_140000_1452048804587
    var code;

    var _dom$id$split = dom.id.split("_");

    var _dom$id$split2 = _slicedToArray(_dom$id$split, 3);

    type = _dom$id$split2[1];
    code = _dom$id$split2[2];

    code = parseInt(code);
  } else if (dom.nodeName === "A") {
    type = "tab";
    var targetType = dom.id.split("_")[2]; //id: area_tab_province_1452049109976
  }
  switch (type) {
    case PROVINCE:
      this.area = (_area2 = {}, _defineProperty(_area2, PROVINCE, code), _defineProperty(_area2, CITY, null), _defineProperty(_area2, DISTRICT, null), _area2);
      this._type = CITY;
      break;
    case CITY:
      this.area = (_area3 = {}, _defineProperty(_area3, PROVINCE, this.area[PROVINCE]), _defineProperty(_area3, CITY, code), _defineProperty(_area3, DISTRICT, null), _area3);
      this._type = DISTRICT;
      break;
    case DISTRICT:
      this.area[DISTRICT] = code;
      break;
    case "tab":
      this._type = targetType;
      this._isAreaChange = false;
      break;
  }
  this._updateView();
};
/*初始化控件 end*/
/*初始模板生成 start*/
AreaSelector.prototype._template = function () {
  var target = this._target;
  var top = target.offsetTop + target.clientHeight + 5 + "px",
      left = target.offsetLeft + "px";
  var provinces = this._generatePanelNodes(PROVINCE, _areaData2.default);
  var tpl = '\n                <div class="area-selector">\n                  <div class="area-selector-header">\n                    <a href="javascript:;" style="cursor: pointer;" class="area-selector-tab active" id="' + this._generateTabId(PROVINCE) + '">省份</a>\n                    <a href="javascript:;" class="area-selector-tab" id="' + this._generateTabId(CITY) + '">城市</a>\n                    <a href="javascript:;" class="area-selector-tab" id="' + this._generateTabId(DISTRICT) + '">县区</a>\n                  </div>\n                  <div class="area-selector-content">\n                    <div class="area-selector-panel active" id="' + this._generatePanelId(PROVINCE) + '">\n                      ' + provinces + '\n                    </div>\n                    <div class="area-selector-panel" id="' + this._generatePanelId(CITY) + '"></div>\n                    <div class="area-selector-panel" id="' + this._generatePanelId(DISTRICT) + '"></div>\n                  </div>\n                </div>\n                ';
  var box = document.createElement("div");
  box.className = AREACLASS;
  box.id = "area_selector_" + this.id;
  box.innerHTML = tpl;
  box.style.top = top;
  box.style.left = left;
  document.body.appendChild(box);
};

AreaSelector.prototype._updateBaseOnAreaCode = function () {
  if (!this.area[PROVINCE]) return;
  //console.log(this.area);
  if (this.area[PROVINCE]) {
    (0, _utils.getNode)(this._generateNodeId(PROVINCE, this.area[PROVINCE])).className = "select";
    this._renderCities();
  }
  //console.log(this.area);

  if (this.area[PROVINCE] && this.area[CITY]) {
    (0, _utils.getNode)(this._generateNodeId(CITY, this.area[CITY])).className = "select";
    this._renderDistricts();
  }
  //console.log(this.area);

  if (this.area[PROVINCE] && this.area[CITY] && this.area[DISTRICT]) {
    (0, _utils.getNode)(this._generateNodeId(DISTRICT, this.area[DISTRICT])).className = "select";
  }
  //console.log(this.area);
  this._type = PROVINCE;
  this._changeTab();
  // this._updateTargetView();
};
/*初始模板生成 end*/

/*视图更新 start*/
AreaSelector.prototype._updateView = function () {
  if (!this._isAreaChange) {
    this._changeTab();
    this._isAreaChange = true;
    return;
  }
  var selectElement;

  //改变视图的选择状态
  function changeSelectBlock(panel, blockId) {
    var selectElement = panel.querySelector(".select");
    if (selectElement) selectElement.className = "";
    (0, _utils.getNode)(blockId).className = "select";
  }

  // 按 市区 城市 省份 的顺序判断
  if (this._type === DISTRICT && this.area[DISTRICT]) {
    // 选择市区后
    changeSelectBlock(this._districtPanel, this._generateNodeId(DISTRICT, this.area[DISTRICT]));
    this._updateTargetView();
    this.hide();
    return;
  }

  if (this._type === DISTRICT && this.area[CITY]) {
    // 选择城市后
    changeSelectBlock(this._cityPanel, this._generateNodeId(CITY, this.area[CITY]));
    this._renderDistricts();
    this._changeTab();
    this._updateTargetView();
    return;
  }

  if (this._type === CITY && this.area[PROVINCE]) {
    // 选择省份后
    changeSelectBlock(this._provincePanel, this._generateNodeId(PROVINCE, this.area[PROVINCE]));
    this._renderCities();
    this._changeTab();
    this._updateTargetView();
  }
};

AreaSelector.prototype._renderCities = function () {
  var cityData = this._getAreaData(this.area[PROVINCE])["subs"];
  this._cityPanel.innerHTML = this._generatePanelNodes(CITY, cityData);
  /*
   * 4个直辖市时直接跳过城市选择
   *
   * "110000": {
   *     "name": "北京", //省
   *     "subs": {
   *       "110000": {
   *         "name": "北京", //市
   *         "subs": {
   *           "110101": "东城",  //区
   *           "110102": "西城"
   *         }
   *       }
   *     }
   * }
   * */
  if ((0, _utils.getObjectLength)(cityData) === 1) {
    for (var cityCode in cityData) {
      this.area[CITY] = parseInt(cityCode);
      this._type = DISTRICT;
      this._renderDistricts();
      var id = this._generateNodeId(CITY, cityCode);
      (0, _utils.getNode)(id).className = "select";
    }
  }
};

AreaSelector.prototype._renderDistricts = function () {
  var districtData = this._getAreaData(this.area[PROVINCE], this.area[CITY])["subs"];
  this._districtPanel.innerHTML = this._generatePanelNodes(DISTRICT, districtData);
  // 省直辖县区时完成选择
  if ((0, _utils.getObjectLength)(districtData) === 0) {
    this._type = CITY;
    this.hide();
  }
};

AreaSelector.prototype._changeTab = function () {
  if (!this.area[PROVINCE]) return;
  // 未选择省份时无法切换到城市
  if (!this.area[PROVINCE] && this._type === CITY) return;
  // 未选择城市时无法切换到县区
  if (!this.area[CITY] && this._type === DISTRICT) return;
  // 选择了直辖省县区时无法切换到县区
  // 111111:{
  //  name:"直辖县区":
  //  subs:{}
  // }

  var isDirect = this.area[CITY] && (0, _utils.getObjectLength)(this._getAreaData(this.area[PROVINCE], this.area[CITY])["subs"]) === 0;
  if (this._type === DISTRICT && isDirect) return;
  // 更新tab的hover 鼠标效果
  this._cityTab.style.cursor = this.area.province ? "pointer" : "default";
  this._districtTab.style.cursor = this.area.city && !isDirect ? "pointer" : "default";

  var tabId = this._generateTabId(this._type),
      panelId = this._generatePanelId(this._type);

  this._areaElement.querySelector(".area-selector-tab.active").className = "area-selector-tab";
  this._areaElement.querySelector(".area-selector-panel.active").className = "area-selector-panel";

  (0, _utils.getNode)(tabId).className = "area-selector-tab active";
  (0, _utils.getNode)(panelId).className = "area-selector-panel active";
};

AreaSelector.prototype._updateTargetView = function () {
  var area = [];
  if (this.area[PROVINCE]) {
    area.push(this._getAreaData([this.area[PROVINCE]]).name);
  }
  if (this.area[CITY]) {
    // 4个直辖市时不添加城市
    if (this.area[PROVINCE] !== this.area[CITY]) {
      area.push(this._getAreaData(this.area[PROVINCE], this.area[CITY]).name);
    }
  }
  if (this.area[DISTRICT]) {
    area.push(this._getAreaData(this.area[PROVINCE], this.area[CITY], this.area[DISTRICT]));
  }

  var target = this._target;
  try {
    //input node
    target.innerText = area.join(this._options.separator);
  } catch (e) {}
  target.value = area.join(this._options.separator);
  // this._changeTab();
};
/*视图更新 end*/

/*工具函数 start*/
AreaSelector.prototype._show = function (condition) {
  if (condition) {
    this._areaElement.className = AREASHOWCLASS;
  } else {
    this._areaElement.className = AREAHIDECLASS;
  }
};

AreaSelector.prototype._generatePanelNodes = function (type, data) {
  var str = "";
  for (var code in data) {
    var name = data[code].name || data[code];
    str += '\n        <dd title="' + name + '" id="' + this._generateNodeId(type, code) + '">\n          ' + name + '\n        </dd>\n      ';
  }

  return '\n      <dl>' + str + '</dl>\n    ';
};

AreaSelector.prototype._cacheNode = function () {

  this._areaElement = (0, _utils.getNode)("area_selector_" + this.id);

  this._provinceTab = (0, _utils.getNode)(this._generateTabId(PROVINCE));
  this._cityTab = (0, _utils.getNode)(this._generateTabId(CITY));
  this._districtTab = (0, _utils.getNode)(this._generateTabId(DISTRICT));

  this._provincePanel = (0, _utils.getNode)(this._generatePanelId(PROVINCE));
  this._cityPanel = (0, _utils.getNode)(this._generatePanelId(CITY));
  this._districtPanel = (0, _utils.getNode)(this._generatePanelId(DISTRICT));
};

AreaSelector.prototype._generateTabId = function (type) {
  return "area_tab_" + type + "_" + this.id;
};

AreaSelector.prototype._generatePanelId = function (type) {
  return "area_panel_" + type + "_" + this.id;
};

AreaSelector.prototype._generateNodeId = function (type, code) {
  return "area_" + type + "_" + code + "_" + this.id;
};

AreaSelector.prototype._getAreaData = function (provinceCode, cityCode, districtCode) {
  var ret = null;
  if (provinceCode) {
    ret = _areaData2.default[provinceCode];
  }
  if (provinceCode && cityCode) {
    ret = ret["subs"][cityCode];
  }
  if (provinceCode && cityCode && districtCode) {
    ret = ret["subs"][districtCode];
  }
  return ret;
};
/*工具函数 end*/

/*用户api start*/
AreaSelector.prototype.getAreasCode = function () {
  return this.area;
};

AreaSelector.prototype.getAreasString = function (separator) {
  var areas = [];
  if (this.area[PROVINCE]) {
    areas.push(_areaData2.default[this.area[PROVINCE]].name);
  }
  if (this.area[CITY]) {
    if (this.area[PROVINCE] !== this.area[CITY]) {
      areas.push(_areaData2.default[this.area[PROVINCE]]["subs"][this.area[CITY]].name);
    }
  }
  if (this.area[DISTRICT]) {
    areas.push(_areaData2.default[this.area[PROVINCE]]["subs"][this.area[CITY]]["subs"][this.area[DISTRICT]]);
  }
  return areas.join(separator || this._options.separator);
};

AreaSelector.prototype.setArea = function (area) {
  var _area4;

  var codeArr = [null, null, null];
  if (Object.prototype.toString.call(area) === "[object Object]") {
    codeArr[0] = area[PROVINCE];
    codeArr[1] = area[CITY];
    codeArr[2] = area[DISTRICT];
  } else if (Object.prototype.toString.call(area) === "[object Array]") {
    codeArr[0] = area[0];
    codeArr[1] = area[1];
    codeArr[2] = area[2];
  } else {
    console.warn("请传入object或array格式的地区码");
    return;
  }
  var isValidProvince = codeArr[0] in _areaData2.default,
      isValidCity = isValidProvince && codeArr[1] in this._getAreaData(codeArr[0])["subs"],
      isValidDistrict = isValidCity && codeArr[2] in this._getAreaData(codeArr[0], codeArr[1])["subs"];
  if (!isValidProvince) {
    console.warn("不合法的地区码");
    return;
  }

  this.area = (_area4 = {}, _defineProperty(_area4, PROVINCE, parseInt(codeArr[0])), _defineProperty(_area4, CITY, isValidCity ? parseInt(codeArr[1]) : null), _defineProperty(_area4, DISTRICT, isValidDistrict ? parseInt(codeArr[2]) : null), _area4);
  this._updateTargetView();
  if (!this._firstClick) {
    // 涉及到对控件的dom操作，确保在生成后才执行
    this._updateBaseOnAreaCode();
  }
};

AreaSelector.prototype.hide = function () {
  this._options.callback();
  this._show(false);
};

AreaSelector.prototype.show = function () {
  this._target.click();
};
/*用户api end*/

exports.default = AreaSelector;
