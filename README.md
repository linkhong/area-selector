# area-selector
中国大陆省市区三联选择器。
无依赖，支持IE8及以上，部分使用了es2015语法，使用babel转译。

## 地区数据
地区数据从[2017年2月中华人民共和国县以上行政区划代码](http://www.mca.gov.cn/article/sj/tjbz/a/2017/0327/2017%E5%B9%B42%E6%9C%88%E4%B8%AD%E5%8D%8E%E4%BA%BA%E6%B0%91%E5%85%B1%E5%92%8C%E5%9B%BD%E5%8E%BF%E4%BB%A5%E4%B8%8A%E8%A1%8C%E6%94%BF%E5%8C%BA%E5%88%92%E4%BB%A3%E7%A0%81.html)收集, 位于data文件夹下，同时有processor.js用来转换成插件所使用的格式。
使用方法`node ./processor.js`,会在data文件下下生成area.json.

##使用方法
可以直接使用script标签引用或：
```
import AreaSelector from 'areaselector.js';
//or
var AreaSelector = require("areaselector.js")
```

```
	var instance = new AreaSelector({
    	sep:"/",
    	callback:function(){
			//完成选择后调用
		},
        target:"#area_input",
    	area:{
        	province:430000,
        	city:430900,
        	district:430903
        }
    });
```
如果已经选择过地区，可以在初始化时传入或异步获取后传入
```
var instance = new AreaSelector({
	target:"#area_input",
    area:{
        	province:430000,
        	city:430900,
        	district:430903
        }
});
//or
setTimeout(function(){
	instance.setArea({
        	province:430000,
        	city:430900,
        	district:430903
        })
},2000)
```
##APIS
1. instance.getAreasCode()
	获取当前的地区码，返回格式为`{province: 430000, city: 430900, district: 430903}`
2. instance.getAreaString(separator)
	获取当前的地区名，格式为`"湖南/益阳/赫山"`,参数`separator`为字符串，默认为在初始化传入的sep或"/"
3. instance.setArea(area)
	更新地区码，area格式为object或array,格式为:
    ```
  		{
        	province:430000,
        	city:430900,
        	district:430903
        }
      [430000,430900,430903]//顺序为province, city, district
    ```
4. instance.show()
	显示插件
5. instance.hide()
	隐藏插件

## 自定义样式
已经在areaSelector.css定义了一些空白样式，可直接套用。
