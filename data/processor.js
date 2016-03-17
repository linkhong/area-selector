'use strict';

var fs = require('fs');


fs.readFile("./address.txt", "utf8", function(err, data) {
  if (err) throw err;
  data = data.split("\r\n");
  var address = {};
  data.forEach(str => {
    var code = str.slice(0, 6),
      name = str.slice(6);
    if (["县", "市辖区", "台湾省", "香港特别行政区", "澳门特别行政区"].indexOf(name) > -1) return;

    if (/\D{3,}族自治/.test(name)) {
      // 积石山保安族东乡族撒拉族自治县 ==>积石山
      name = name.replace(/(苗族|水族|纳西族|侗族|蒙古族|满族|回族|达斡尔族|朝鲜族|畲族|土家族|瑶族|壮族|各族|佬族|毛南族|黎族|羌族|彝族|藏族|布依族|哈尼族|傣族|拉祜族|佤族|布朗族|白族|景颇族|怒族|傈僳族|普米族|独龙族|裕固族|哈萨克族|保安族|东乡族|土族|撒拉族|族)+自治(区|县|州|旗)$/, "");
    } else if (/^\D{1,3}族自治/.test(name)) {
      // 东乡族自治县 ==> 东乡族
      name = name.replace(/自治(区|县|州|旗)/, "");
    } else if (/(锡伯|蒙古|哈萨克|塔吉克|维吾尔)自治/.test(name)) {
      // 巴音郭楞蒙古自治州 ==> 巴音郭楞
      name = name.replace(/(锡伯|蒙古|哈萨克|塔吉克|维吾尔)自治(县|区|州)/, "");
      if (name === "内") name = "内蒙古";
    } else if (/(西藏|克孜勒苏柯尔克孜|鄂伦春|鄂温克)/.test(name)) {
      // 西藏自治区 ==>西藏
      name = name.replace(/自治(区|旗|州)/, "");
    } else if (/\D{2,}(新区|地区)$/.test(name)) {
      name = name.slice(0, name.length - 2);
    } else if (/\D{2,}(市|省|区|县|旗)$/.test(name)) {
      name = name.slice(0, name.length - 1);
    }
    address[code] = name;
  });

  var area = {};

  var direct_controlled_arr = [];
  var four_direct = [110000, 120000, 310000, 500000]; //北京，天津，上海，重庆

  Object.keys(address).forEach(code => {
    // 1级
    if (parseInt(code) % 10000 === 0) {
      area[code] = {
        name: address[code],
        subs: {}
      };
      // 4个直辖市的下级为本身
      if (four_direct.indexOf(parseInt(code)) > -1) {
        area[code]["subs"][code] = {
          name: address[code].slice(0, 2),
          subs: {}
        }
      }
      return;
    }
    // 2级
    // 虽然为第三极但归为第二级
    if (address[code] === "省直辖县级行政区划" || address[code] === "自治区直辖县级行政区划") {
      direct_controlled_arr.push(code.slice(0, 4));
      return;
    }
    var code_first_4 = code.slice(0, 4);
    if (direct_controlled_arr.indexOf(code_first_4) > -1) {
      var pro_code = Math.floor(parseInt(code) / 10000) * 10000;
      area[pro_code]["subs"][code] = {
        name: address[code],
        subs: {}
      };
      return;
    }

    if (parseInt(code) % 100 === 0) {
      // 343400 ==> 340000
      var pro_code = Math.floor(parseInt(code) / 10000) * 10000;
      area[pro_code]['subs'][code] = {
        name: address[code],
        subs: {}
      };
      return;
    }


    // 3级
    var pro_code = Math.floor(code / 10000) * 10000,
      city_code = Math.floor(code / 100) * 100;
    if (four_direct.indexOf(pro_code) > -1) {
      // 属于4个直辖市
      area[pro_code]["subs"][pro_code]["subs"][code] = address[code];
      return;
    }
    area[pro_code]["subs"][city_code]["subs"][code] = address[code];

  });





  fs.writeFile('./area.json', JSON.stringify(area, 2), function(err) {
    if (err) throw err;
    console.log("输出完成");
  });

})
