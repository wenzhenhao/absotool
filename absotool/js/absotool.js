// 请确保实例化前selector是绝对定位，还有记得引入jQuery
"use strict"
function AbsoTool(selector, options) {
	var _public = new Object(); //会return
	var _private = new Object();
	// jQuery selector
	_public.selector;
	_public.options = {};

	// 类似F12 inspect。用一个带有backgroud-color的与element同宽同高的div盖在上面
	_public.options.rect = {
		backgroundColor: "#0000ff",
		opacity: 0.2,
		alwaysTop: true,
	}

	// 类似F12 inspect。帮助对齐的辅助线
	_public.options.line = {
		borderWidth: 1,
		borderColor: "red",
		borderStyle: "solid",
		opacity: 0.5,
		outerTangent: true,  //true: 外切, false: 内切
	}

	// 用wasd或方向键调宽高、offset().top和offset().left、z-index时的步长
	_public.options.step;	//init时默认为_public.options.stepArr[_public.options.stepIndex]
	_public.options.stepArr = [1,100];
	_public.options.stepIndex = 0;

	// 调用addBackgroundColor [X + 3] 时，为没有backgroud-color的selector加backgroud-color
	_public.options.bgColors = [
		'aliceblue',
		'beige',
		'cadetblue',
		'darkblue',
		'firebrick',
		'gainsboro',
	];

	// 开启showTips [Z + T] 时，可显示在调element的宽高、offset().top和offset().left、z-index
	_public.options.tips = {
		topLeft:{
			top: -10,
			left: 0,
			fontSize: 12,
			color: "white",
			backgroundColor: "black",
			opacity: 1,
			padding: 2,
			format: "[top,left] : [{top},{left}]",           // html格式，会把值替换到{top}和{left}
		},
		widthHeight:{
			top: 10,
			left: 0,
			fontSize: 12,
			color: "white",
			backgroundColor: "black",
			opacity: 1,
			padding: 2,
			format: "[width,height] : [{width},{height}]",   // html格式，会把值替换到{width}和{height}
		},
		zIndex: {
			top: 10,
			left: 0,
			fontSize: 12,
			color: "white",
			backgroundColor: "black",
			opacity: 1,
			padding: 2,
			format: "z-index : {zIndex}",                    // html格式，会把值替换到{zIndex}
		}
	}

	//改变打印的格式
	_public.options.widthHeightReverse = false,	// false: [width,height], true: [height, width]
	_public.options.topLeftReverse = false,     // false: [top,left], true: [left, top]
	//拖放结束打印data
	_public.options.printAfterDrag = true,		// mouseup print data
	_public.options.boundary = false;			// 邊界

	// 比较重要的配置
	_public.config = {
		// 功能开关 
		funcSwitch: {
			printKeyCode: "off",
			showTips: "on",
			// 下面这三个只能同一时间开启一个
			adjustWidthHeight: "off",
			adjustTopLeft: "on",
			adjustZindex: "off",
		},

		// 快捷键 [keycode1, keycode2,...]。注意防止按键冲突
		// 如果觉得设置不合理不顺手，可以先按[Z + H]开启printKeyCode打印出keycode，然后设置你的快捷键
		funcKeyCode: {
			init: [90,49]                       // [Z + 1] 初始化。拖动单个元素，按ctrl可以多选
			, stop: [90,192]				    // [Z + `] 停止
			, printKeyCode: [90,72]				// [Z + H] keyup时打印出keycode
			
			, adjustWidthHeight: [90,50]		// [Z + 2] 用wasd或方向键调整宽高
			, adjustTopLeft: [90,51]			// [Z + 3] 用wasd或方向键调整offset().top和offset().left
			, adjustZindex: [90,52]	            // [Z + 4] 用wasd或方向键调整z-index
			, switchStep: [90,81]               // [Z + Q] 切换_public.options.step的值，以上3个功能共用_public.options.step
			, showTips: [90,84]                 // [Z + T] 类似F12的inspect，有宽高，top和left，z-index的提示

			, showDisplayNone: [88,49]			// [X + 1] show()那些实例化时display:none的selector，type=hidden可能获取不到
			, hideDisplayNone: [88,50]			// [X + 2] hide()[X + 1]
			, addBackgroundColor: [88,51]       // [X + 3] 为那些实例化时没有bg的selector加_public.options.bgColors
			, removeBackgroundColor: [88,52]	// [X + 4] remove[X + 3]

			//  C 方法
			//  20191025 C方法之後都可以ctrl + v 貼數據
			, getCss: [67,49]           		// [C + 1] 複製樣式到剪貼板，可按ctrl + v 貼到css文件
			, getWidthHeight: [67,50]           // [C + 2] 打印selector的宽高，也会返回JSON.stringfy()。打印格式为：[[width,height]]
			, getTopLeft: [67,51]				// [C + 3] 打印display不为none的selector的offset().top和offset().left，也会返回JSON.stringfy()。打印格式为：[[top,left]]
			, getZindex: [67,52]                // [C + 4] 打印selector的z-index，也会返回JSON.stringfy()。打印格式为：[z-index]
			, getWidth: [67,53]	                // [C + 5] 打印selector的width，也会返回JSON.stringfy()。打印格式为：[width]
			, getHeight: [67,54]                // [C + 6] 打印selector的width，也会返回JSON.stringfy()。打印格式为：[height]
			, getTop: [67,55]					// [C + 7] 打印display不为none的selector的width，也会返回JSON.stringfy()。打印格式为：[top]
			, getLeft: [67,56]                  // [C + 8] 打印display不为none的selector的width，也会返回JSON.stringfy()。打印格式为：[height]
			, getCurrentTarget: [67,84]         // [C + T] 打印在调element的信息，也会返回JSON.stringfy()。包括[width,height]，[top,left]，[z-index]

			// 调用以get开头的方法，除去getCurrentTarget之外，都会把相应的数据保存在localStorage
			// 所以在你F5之后可以调用一下方法来还原它们的位置，大小，z-index
			, setCssRule: [86,49]				// [V + 1] 還原大小，位置，z-index
			, setWidthHeight: [86,50]           // [V + 2] 根据localStorage来还原 大小
			, setTopLeft: [86,51]               // [V + 3] 根据localStorage来还原 位置
			, setZindex: [86,52]                // [V + 4] 根据localStorage来还原 z-index

		},
		keyCode: {
			// shift + wasd 可以同时调selector，而不是只调单个元素
			up: [38,87]                         // 上 或 W
			, right: [39,68]                    // 右 或 D
			, down: [40,83]                     // 下 或 S
			, left: [37,65]                     // 左 或 A
			, shift: [16,72]                    // shift
			, ctrl: [17]                        // ctrl + 左键 = 多选， 然后wasd
		},
		
	}

	// private variable
	_private.prefix = "absotool-";
	_private.selector_arr = [];
	_private.that;

	_private.container;
	_private.container_offset;
	// _private.container_margin;  // margin可在offset中體現出來
	_private.container_cx;
	_private.container_cy;
	_private.container_position;

	_private.w;
	_private.h;

	_private.padding;
	_private.margin;

	_private.outerw;
	_private.outerh;

	_private.cx = 0;
	_private.cy = 0;
	_private.id = _private.prefix + "drag-id";
	_private.rect_class = _private.prefix + "drag-rect";
	_private.line_class = _private.prefix + "drag-line";
	_private.tips_class = _private.prefix + "drag-tips";
	_private.adjust_css;
	_private.key_pressed = [];

	_private.not_visible = [];
	_private.not_bgcolor = [];
	_private.radio_func = [
		["adjustWidthHeight", "adjustTopLeft", "adjustZindex"],
	];
	_private.working = false;
	_private.ctrl_class = "drag-group";
	_private.ctrl_rect_class = "drag-group-rect";
	_private.ls = {
		prefix: "absotool_",
		wh: "width_height",
		tl: "top_left",
		zIndex: "z-index",
		css: "css",
	}
	// private variable end


	//-----------  public functions: you can call them on Console ------------------------------------------
	/**
	 * 监听键盘， 功能快捷键
	 * @return {[type]} [description]
	 */
	_public.initListen = function(){
		$(document).bind("keydown", _private.listenFunc)
		$(document).bind("keyup", _private.listenFunc)

	}

	/**
	 * set options 合并_public 和 用户的options
	 * @param {[type]} options [description]
	 */
	_public.setOptions = function(options){
		if(_private.isObj(options)){
			delete options.selector;
			_public.options = _private.extend(_public.options, options);
		}

	}

	/**
	 * addSelector 使能
	 * @param {[type]} s jq selector(s)
	 */
	_public.addSelector = function(s){
		_private.selector_arr =_private.merge(_private.selector_arr, s)
		_private.selector_arr = _private.arrayUnique(_private.selector_arr);
		_public.selector = _private.selector_arr;
		_private.bindSelector();
		_private.output(_private.selector_arr, "addSelector");
	}

	/**
	 * removeSelector
	 * @param  {[type]} s [description]
	 * @return {[type]}   [description]
	 */
	_public.removeSelector = function(s){
		_private.unbindSelector()
		_private.selector_arr = _private.diff(_private.selector_arr, s);
		_private.selector_arr = _private.arrayUnique(_private.selector_arr);
		_public.selector = _private.selector_arr;
		_private.bindSelector();
		_private.output(_private.selector_arr, "removeSelector");
	}

	//-------------------- Z functions -------------------------------------------
	/**
	 * init之后，那些selectors才有相应的功能
	 * @return {[type]} [description]
	 */
	_public.init = function(){
		_private.output("absotool init start");
		_public.setOptions(options);
		_public.options.step = _public.options.stepArr[_public.options.stepIndex];
		_public.addSelector(selector);
		_private.initFunc();
		$(document).unbind("click", _private.ctrlControl).bind("click", _private.ctrlControl);
		// _private.output(_private.selector_arr);
		_private.output("absotool init done. you can drag now.");
	}

	/**
	 * 停止所有selector的所有功能，但是没有unbind _private.listenFunc
	 * @return {[type]} [description]
	 */
	_public.stop = function(){
		console.log("absotool stop")
		_private.unbindSelector();
		_private.stopAjust();
		$(document).unbind("click", _private.ctrlControl);
		_private.working = false;

	}



	/**
	 * change step's value like playing cs
	 * @return {[type]} [description]
	 */
	_public.switchStep = function(){
		_public.options.step = _public.options.stepArr[(++_public.options.stepIndex) % _public.options.stepArr.length];
		if(_public.options.stepIndex > _public.options.stepArr.length) _public.options.stepIndex = 0;
		_private.output("step is " + _public.options.step + " now.")
	}

	/**
	 * there is a reason for it to exist
	 * @return {[type]} [description]
	 */
	_public.printKeyCode = function(){
		// print key's keycode you pressed
	}

	/**
	 * you can wasd width & height now
	 * @param  {[type]} on [description]
	 * @return {[type]}    [description]
	 */
	_public.adjustWidthHeight = function(on){
		var css = "";
		if(on)  css = "wh";
		_private.adjustCss(css);
	}

	/**
	 * you can wasd top & left now
	 * @param  {[type]} on [description]
	 * @return {[type]}    [description]
	 */
	_public.adjustTopLeft = function(on){
		var css = "";
		if(on){
			css = "tl";
		}  
		_private.adjustCss(css);
	}

	/**
	 * you cans wasd z-index now
	 * @return {[type]} [description]
	 */
	_public.adjustZindex = function(){
		_private.adjustCss("z-index");
	}

	/**
	 * if you need to know that stuff or is it bordering you
	 * @param  {[type]} on [description]
	 * @return {[type]}    [description]
	 */
	_public.showTips = function(on){
		if(on){
			$("." + _private.tips_class).show();
			var offset = $(_private.that).offset();
			_private.drawTips(_private.that);
		}else{
			$("." + _private.tips_class).hide();
		} 
	}
	//-------------------- Z functions end -------------------------------------------


	// ------------------- X functions ------------------------------------------------
	/**
	 * if you sexy then show it
	 * @return {[type]} [description]
	 */
	_public.showDisplayNone = function(){
		$(_private.not_visible).each(function(i, v){
			$(v).show();
		})
		// console.log(_private.not_visible)
		_private.output("showDisplayNone");
	}

	/**
	 * but i hope i never see them again
	 * @return {[type]} [description]
	 */
	_public.hideDisplayNone = function(){
		$(_private.not_visible).each(function(i, v){
			$(v).hide();
		})
		_private.output("hideDisplayNone");
	}

	/**
	 * what a colorful world
	 * @return {[type]} [description]
	 */
	_public.addBackgroundColor = function(){
		_private.bgcolor(true);
		_private.output("addBackgroundColor");
	}

	/**
	 * what a mess
	 * @return {[type]} [description]
	 */
	_public.removeBackgroundColor = function(){
		_private.bgcolor(false);
		_private.output("removeBackgroundColor");
	}
	// ---------------- X functions end ------------------------------------------------
	
	// ---------------- C functions  ------------------------------------------------
	
	/**
	 * copy css into clipborad
	 * @return {[type]} [description]
	 */
	_public.getCss = function(){
		var css = {};
		// show出來才能拿到offset
		_public.showDisplayNone();
		$(_private.selector_arr).each(function(i1, v1){
			$(v1).each(function(i2, v2){
				var k = '.' + v2.className.split(' ').join('.');
				var offset = $(v2).offset();
				var w = $(v2).innerWidth();
				var h = $(v2).innerHeight();
				var z = $(v2).css("z-index");
				if(_private.container_position == "relative"){
					offset.top -= (_private.container_cy + _private.margin[0]);
					offset.left -= (_private.container_cx + _private.margin[3]);
				}
				css[k] = `{
	position: absolute;
	top: ${offset.top}px;
	left: ${offset.left}px;
	width: ${w}px;
	height: ${h}px;
	z-index: ${z};
}
`
			})
		})
		// console.log(css);
		// console.log(JSON.stringify(css));
		_private.setData('css', css);
		_public.hideDisplayNone();

		_private.output('--- copy css into clipboard, you can paste into .css ---');
		_private.copy2cb(css, 'css')
		

	}

	/**
	 * print [[widths,heights]] for you
	 * @return {[type]} [description]
	 */
	_public.getWidthHeight = function(){
		var data = _private.getwh();
		if(_public.options.widthHeightReverse){
			var label = 'height & width';
		}else{
			var label = 'width & height';
		}
		_private.output(data, label);
		_private.copy2cb(data, 'array');
		

	}

	/**
	 * especially print [widths] for you
	 * @return {[type]} [description]
	 */
	_public.getWidth = function(){
		var data = _private.getwh(0);
		_private.output(data, 'width');
		_private.copy2cb(data, 'array');
	}

	/**
	 * especially print [heights] for you
	 * @return {[type]} [description]
	 */
	_public.getHeight = function(){
		var data = _private.getwh(1);
		_private.output(data, 'height');
		_private.copy2cb(data, 'array');
	}

	/**
	 * print [[tops,lefts]] for you
	 * @return {[type]} [description]
	 */
	_public.getTopLeft = function(){
		var data = _private.gettl();
		if(_public.options.topLeftReverse){
			var label = 'left & top';
		}else{
			var label = 'top & left';
		}
		_private.output(data, label);
		_private.copy2cb(data, 'array');
	}

	/**
	 * especially print [tops] for you
	 * @return {[type]} [description]
	 */
	_public.getTop = function(){
		var data = _private.gettl(0);
		_private.output(data, 'top');
		_private.copy2cb(data, 'array');
	}

	/**
	 * especially print [lefts] for you
	 * @return {[type]} [description]
	 */
	_public.getLeft = function(){
		var data = _private.gettl(1);
		_private.output(data, 'top');
		_private.copy2cb(data, 'array');
	}


	/**
	 * print [z-indexs] for you
	 * @return {[type]} [description]
	 */
	_public.getZindex = function(){
		var data = _private.getZindex();
		_private.output(data, 'z-index');
		_private.copy2cb(data, 'array');
	}

	/**
	 * print [width,height], [top,left], z-index of you lately click
	 * @return {[type]} [description]
	 */
	_public.getCurrentTarget = function(){
		var obj = {};
		var offset = $(_private.that).offset()
		if(_private.container_position == "relative"){
			offset.top -= (_private.container_cy + _private.margin[0]);
			offset.left -= (_private.container_cx +  + _private.margin[3]);
		}
		obj["top & left"] = [offset.top, offset.left];
		obj["width & height"] = [$(_private.that).innerWidth(), $(_private.that).innerHeight()];
		obj["z-index"] = $(_private.that).css("z-index");
		_private.output(obj, "currentTarget");
		return JSON.stringify(obj);
	}
	// ---------------- C functions end ------------------------------------------------
	
	// ---------------- V functions  ------------------------------------------------
	/**
	 * where there is a get, there is a set
	 */
	_public.setCssRule = function(){
		_private.output("setCssRule");
		_private.setCss(_private.ls.css);
	}
	_public.setWidthHeight = function(){
		_private.output("setWidthHeight");
		_private.setCss(_private.ls.wh, ["width", "height"]);
	}

	_public.setTopLeft = function(){
		_private.output("setTopLeft");
		_private.setCss(_private.ls.tl, ["top", "left"]);
	}

	_public.setZindex = function(){
		_private.output("setZindex");
		_private.setCss(_private.ls.zIndex);
	}
	// ---------------- V functions end ------------------------------------------------
	// 




	// ----------------- privatx4e functions: **** ----------------------------------
	/**
	 * 
	 * bind mousedown
	 * @return {[type]} [description]
	 */
	_private.bindSelector = function(){
		$(_private.selector_arr).each(function(index, val){
			// console.log($(val).css("display"));
			// console.log($(val).css("background-color"));
			// console.log($(val).css("display"));
			// if($(val).css("display") == "none"){
			// 	_private.not_visible.push(val);
			// }
			// if($(val).css("background-color") == "rgba(0, 0, 0, 0)"){
			// 	_private.not_bgcolor.push(val);
			// }
			// $(val).attr("draggable", true).unbind("mousedown", _private.bindDragEvent).bind("mousedown", _private.bindDragEvent);


			$(val).each(function(i, v){
				if($(v).css("display") == "none"){
					_private.not_visible.push(v);
				}
				if($(v).css("background-color") == "rgba(0, 0, 0, 0)"){
					_private.not_bgcolor.push(v);
				}
				$(v).attr("draggable", true).unbind("mousedown", _private.bindDragEvent).bind("mousedown", _private.bindDragEvent)
			})
		})
	}

	/**
	 * unbind mousedown
	 * @return {[type]} [description]
	 */
	_private.unbindSelector = function(){
		$(_private.selector_arr).each(function(index, val){
			$(val).attr("draggable", false).unbind("mousedown", _private.bindDragEvent)
			// $(val).each(function(i, v){
			// 	$(v).attr("draggable", false).unbind("mousedown", _private.bindDragEvent)
			// })
		})
	}


	_private.ctrlControl = function(){
		if(!_private.ifPressedAny(_public.config.keyCode.ctrl)){
			$("." + _private.rect_class).remove();
			$("." + _private.line_class).remove();
			$("." + _private.tips_class).remove();
			$("." + _private.ctrl_rect_class).remove();
			$("." + _private.ctrl_class).removeClass(_private.ctrl_class);
		}
	}

	/**
	 * 默认开启某些功能
	 * turn on some function
	 * @return {[type]} [description]
	 */
	_private.initFunc = function(){
		for (var i = 0; i < _private.radio_func.length; i++) {
			for (var j = 0; j < _private.radio_func[i].length; j++) {
				if(_private.ifon(_private.radio_func[i][j])){
					var f = "_public." + _private.radio_func[i][j];
					f = eval(f);
					f(1);
					break;
				}
			}
			
		}
	}

	// ------------------ adjust ---------------------------------------
	/**
	 * have to work now. you have to click a element
	 * @param  {[type]} css that trouble you are dealling with
	 * @return {[type]}     [description]
	 */
	_private.adjustCss = function(css){
		_private.adjust_css = css;
		// _private.stopAjust();
		if(!_private.working){
			$(document).bind("keydown", _private.listenAjust);
			_private.working = "hell yeah";
		}
	}
	_private.adjustwh = function(css, add){
		var val;
		var step = add ? _public.options.step : -_public.options.step;

		$(_private.getSelector()).each(function(i, v){
			val = parseFloat($(v).css(css));
			$(v).css(css, val + step);
		})

	}

	_private.adjusttl = function(css, add){
		var val;
		var step = add ? _public.options.step : -_public.options.step;
		// console.log(step)
		$(_private.getSelector()).each(function(i, v){
			val = parseFloat($(v).offset()[css] - $(v).css("margin-" + css).replace(/px/g, ""));
			if(css == "top"){
				val = val - (_private.container_cy);
			}else{
				val = val - (_private.container_cx);
			}
			
			$(v).css(css, val + step);
		})

	}
	_private.adjustzindex = function(add){
		var val;
		var step = add ? _public.options.step : -_public.options.step
		$(_private.getSelector()).each(function(i, v){
			val = parseFloat($(v).css("z-index")) ? parseFloat($(v).css("z-index")) : 0;
			$(v).css("z-index", val + step);
		})
	}

	// ------------------ adjust end ---------------------------------------
	
	// ------------------ get -----------------------------------------
	//拿宽高
	_private.getwh = function(index, single){
		var obj = {};
		if(single){
			obj[single] = [];
			$(single).each(function(i2, v2){
				var w = $(v2).innerWidth();
				var h = $(v2).innerHeight();
				obj[single].push([w, h]);
			})
		}else{
			$(_private.selector_arr).each(function(i1, v1){
				obj[v1] = [];
				$(v1).each(function(i2, v2){
					var w = $(v2).innerWidth();
					var h = $(v2).innerHeight();
					obj[v1].push([w, h]);
				})
			})
		}
		_private.setData(_private.ls.wh, obj);

		var data;
		if(index === 0){
			data = _private.sliceObj(obj, index);
		}else if(index === 1){
			data = _private.sliceObj(obj, index);
		}else if(_public.options.widthHeightReverse){
			data = _private.reverseObj(obj);
		}else{
			data = obj;
		}
		return data;
	}

	//拿offset
	_private.gettl = function(index, single){
		var obj = {};
		_public.showDisplayNone();
		if(single){
			obj[single] = [];
			$(single).each(function(i2, v2){
				var os = $(v2).offset();
				if(_private.container_position == "relative"){
					os.top -= _private.container_cy;
					os.left -= _private.container_cx;
				}
				obj[single].push([os.top, os.left]);
			})
		}else{
			$(_private.getVisibleSelector()).each(function(i1, v1){
				obj[v1] = [];
				$(v1).each(function(i2, v2){
					var os = $(v2).offset();
					if(_private.container_position == "relative"){
						os.top -= _private.container_cy;
						os.left -= _private.container_cx;
					}
					obj[v1].push([os.top, os.left]);
				})
			})
		}
		_public.hideDisplayNone();
		_private.setData(_private.ls.tl, obj);

		var data;
		if(index === 0){
			data = _private.sliceObj(obj, index);
		}else if(index === 1){
			data = _private.sliceObj(obj, index);
		}else if(_public.options.topLeftReverse){
			data = _private.reverseObj(obj);
		}else{
			data = obj;
		}

		return data;
	}

	_private.getZindex = function(){
		var obj = {}
		$(_private.getVisibleSelector()).each(function(i1, v1){
			obj[v1] = [];
			$(v1).each(function(i2, v2){
				var z = $(v2).css("z-index");
				obj[v1].push(parseFloat(z) ? parseFloat(z) : z);
			})
		})
		_private.setData(_private.ls.zIndex, obj);

		var data = obj;

		return data;
	}
	// ------------------ get end-----------------------------------------

	// ---------------- listenXXX --------------------------------------------
	/**
	 * press sth, not the red button
	 * @param  {[type]} e [description]
	 * @return {[type]}   [description]
	 */
	_private.listenFunc = function(e){
		if(e){
			if(e.type == "keydown"){
				_private.key_pressed[e.keyCode] = true;

				_private.hitFunc("init", _public.init);

				if(_public.selector){
					_private.hitFunc("stop", _public.stop);
					_private.hitFunc("printKeyCode", _public.printKeyCode, true);
					_private.hitFunc("showTips", _public.showTips, true);

					try{
						_private.hitFunc("adjustWidthHeight", _public.adjustWidthHeight, true);
						_private.hitFunc("adjustTopLeft", _public.adjustTopLeft, true);
						_private.hitFunc("adjustZindex", _public.adjustZindex, true);
						_private.hitFunc("getCurrentTarget", _public.getCurrentTarget);
					}catch(e){
						// console.log(e)
						_private.output("maybe you haven't click a element.")
					}

					_private.hitFunc("switchStep", _public.switchStep);

					_private.hitFunc("getCss", _public.getCss);
					_private.hitFunc("getWidthHeight", _public.getWidthHeight);
					_private.hitFunc("getWidth", _public.getWidth);
					_private.hitFunc("getHeight", _public.getHeight);
					_private.hitFunc("getTopLeft", _public.getTopLeft);
					_private.hitFunc("getLeft", _public.getLeft);
					_private.hitFunc("getTop", _public.getTop);
					_private.hitFunc("getZindex", _public.getZindex);

					_private.hitFunc("showDisplayNone", _public.showDisplayNone);
					_private.hitFunc("hideDisplayNone", _public.hideDisplayNone);
					_private.hitFunc("addBackgroundColor", _public.addBackgroundColor);
					_private.hitFunc("removeBackgroundColor", _public.removeBackgroundColor);
				}else{
					// _private.output("please init or addSelector first.")
				}


				_private.hitFunc("setCssRule", _public.setCssRule);
				_private.hitFunc("setWidthHeight", _public.setWidthHeight);
				_private.hitFunc("setTopLeft", _public.setTopLeft);
				_private.hitFunc("setZindex", _public.setZindex);


			}else if(e.type == "keyup"){ 
				_private.key_pressed[e.keyCode] = false;
				if(_private.ifon("printKeyCode")) console.log(e.keyCode);
	
			}
		}
	}


	/**
	 * show me how you wasd
	 * @param  {[type]} e [description]
	 * @return {[type]}   [description]
	 */
	_private.listenAjust = function(e){
		// console.log(e)
		if(e){
			var val;
			var hit = false;
			switch(_private.adjust_css){
				case "wh":
					
					if(_private.ifexist(e.keyCode, _public.config.keyCode.up)){
						//按 上
						_private.adjustwh("height", false);
						hit = true;
					}else if(_private.ifexist(e.keyCode, _public.config.keyCode.down)){
						//按 下
						_private.adjustwh("height", true);
						hit = true;
					}else if(_private.ifexist(e.keyCode, _public.config.keyCode.left)){
						//按 左
						_private.adjustwh("width", false);
						hit = true;
					}else if(_private.ifexist(e.keyCode, _public.config.keyCode.right)){
						//按 右
						_private.adjustwh("width", true);
						hit = true;
					}


					break;
				case "tl":

					if(_private.ifexist(e.keyCode, _public.config.keyCode.up)){
						//按 上
						_private.adjusttl("top", false);
						hit = true;
					}else if(_private.ifexist(e.keyCode, _public.config.keyCode.down)){
						//按 下
						_private.adjusttl("top",true);
						hit = true;
					}else if(_private.ifexist(e.keyCode, _public.config.keyCode.left)){
						//按 左
						_private.adjusttl("left", false);
						hit = true;
					}else if(_private.ifexist(e.keyCode, _public.config.keyCode.right)){
						//按 右
						_private.adjusttl("left", true);
						hit = true;
					}

					break;
				case "z-index":
					if(_private.ifexist(e.keyCode, _public.config.keyCode.up)){
						//按 上
						_private.adjustzindex(true);
						hit = true;
					}else if(_private.ifexist(e.keyCode, _public.config.keyCode.down)){
						//按 下
						_private.adjustzindex(false);
						hit = true;
					}

					break;
				default:
					break;
			}


			if(hit){
				try{
					_private.calOuterwh();
					_private.drawLines(_private.that, 1);
					_private.drawWhichRect(true)
					if(_private.ifon("showTips")) _private.drawTips(_private.that);
				}catch(e){
					// console.log(e);
					_private.output("maybe you haven't click a element.");
				}

				
			}
			
			
		}
	}

	// ---------------- listenXXX end --------------------------------------------

	/**
	 * if you press the cheat code or not
	 * @param  {[type]}   name     function's name
	 * @param  {Function} callback call it
	 * @param  {[type]}   sw       if it has a switch
	 * @return {[type]}            [description]
	 */
	_private.hitFunc = function(name, callback, sw){
		var num = _public.config.funcKeyCode[name].length;
		var hit = true;
		for (var i = 0; i < num; i++) {
			if(!_private.key_pressed[_public.config.funcKeyCode[name][i]]){
				hit = false;
				break;
			}
		}

		if(hit){
			if(sw){
				_private.switchFunc(name, callback)
			}else{
				callback();
			}
			
		}
	}



	/**
	 * turn on or off the function
	 * @param  {[type]}   name     function's name
	 * @param  {Function} callback call it or me
	 * @return {[type]}            [description]
	 */
	_private.switchFunc = function(name, callback){
		var on = true;
		if(_public.config.funcSwitch[name] == "on"){
			_public.config.funcSwitch[name] = "off";
			on = false;
		}else{
			var index = _private.ifRadioFunc(name, _private.radio_func);
			if(index > -1){
				for (var i = 0; i < _private.radio_func[index].length; i++) {
					_public.config.funcSwitch[_private.radio_func[index][i]] = "off";
				}
			}
			_public.config.funcSwitch[name] = "on";
		}
		var str = "function " + name + " is " + _public.config.funcSwitch[name] + " now.";
		_private.output(str);
		callback(on);
	}

	/**
	 * that's right, you can adjust its family in th same time
	 * @return {[type]} [description]
	 */
	_private.getSelector = function(family){
		if($("." + _private.ctrl_class).length > 0){
			return "." + _private.ctrl_class;
		}

		if(_private.ifPressedAny(_public.config.keyCode.shift) || family){
			for (var i = _private.selector_arr.length - 1; i >= 0; i--) {
				if($(_private.that).hasClass(_private.selector_arr[i].replace(".", ""))){
					return _private.selector_arr[i];
				} 
				var id = $(_private.that).attr("id");
				if(id == _private.selector_arr[i].replace("#", "")){
					return _private.selector_arr[i];
				}
			}
		}
		
		return _private.that;
	}

	/**
	 * get some open guys
	 * @return {[type]} [description]
	 */
	_private.getVisibleSelector = function(){
		var arr = [];
		$(_private.selector_arr).each(function(index, val){
			if($(val).css("display") != "none"){
				arr.push(val);
			}
		})
		return arr;
	}

	/**
	 * get margin or padding
	 * @param  {[type]} css [description]
	 * @return {[type]}     [description]
	 */
	_private.getmp = function(el, css){
		var arr = [0,0,0,0];
		var str = $(el).css(css).replace(/px/g, "");
		var temp = str.split(" ");

		if(temp.length == 1){
			arr.fill(parseFloat(temp[0]));
		}else{
			arr = [];
			temp.forEach(function(v, i){
				arr.push(parseFloat(v));
			})
		}
		return arr;
	}

	/**
	 * width or height + padding + border
	 * @return {[type]} [description]
	 */
	_private.calOuterwh = function(){
		// 差border
		// _private.outerw = _private.padding[1] + _private.padding[3] + _private.w;
		// _private.outerh = _private.padding[0] + _private.padding[2] + _private.h;
		// 不包含margin
		_private.outerw = $(_private.that).outerWidth(false);
		_private.outerh = $(_private.that).outerHeight(false);
	}

	/**
	 * paint or reset
	 * @param  {[type]} flag [description]
	 * @return {[type]}      [description]
	 */
	_private.bgcolor = function(flag){
		var len = _public.options.bgColors.length;
		if(flag){
			$(_private.not_bgcolor).each(function(index, val){
				$(val).css({
					"background-color": _public.options.bgColors[index % len],
				})
			})
		}else{
			$(_private.not_bgcolor).each(function(index, val){
				$(val).css({
					"background-color": "rgba(0, 0, 0, 0)",
				})
			})
		}
		
	}

	/**
	 * stay what/where them belong
	 * @param {[type]} name [description]
	 * @param {[type]} keys [description]
	 */
	_private.setCss = function(name, keys){
		var data = _private.getData(name);

		var len;
		switch(name){
			case _private.ls.wh:
			case _private.ls.tl:
				for(var k in data){
					len = data[k];
					$(k).each(function(i, v){
						for (var j = 0; j < keys.length; j++) {
							$(v).css(keys[j], data[k][i][j] + "px");
						}
					})
				}
				break;
			case _private.ls.zIndex:
				for(var k in data){
					len = data[k];
					$(k).each(function(i, v){
						$(v).css(name, data[k][i]);		
					})
				}
				break;
			case _private.ls.css:
				var style = document.createElement("style");
				style.type = "text/css";
				try{
					for(var k in data){
						style.appendChild(document.createTextNode(k + data[k]));
					}
					
				} catch (e){
					style.styleSheet.cssText = '';
					for(var k in data){
						style.styleSheet.cssText += k + data[k] + ' ';
					}
				}
				var head = document.getElementsByTagName("head")[0];
				head.appendChild(style);
				_private.output('--- add css rules ---');
				console.log(style);
				break;
			default:
				break;
		}
		
	}

	/**
	 * 
	 * @return {[type]} [description]
	 */
	_private.stopAjust = function(){
		$(document).unbind("keydown", _private.listenAjust);
	}


	// ---------------------- F12 inspect ------------------------

	_private.drawRect = function(that, id, cls, keyboard){
		var offset = $(that).offset();
		var outerWidth = $(that).outerWidth(false);
		var outerHeight = $(that).outerHeight(false);
		if($("#" + id).length < 1){
			$("body").append('<div id="' + id + '" class="' + cls + '"></div>');

		}

		$("#" + id).css({
			width: outerWidth,
			height: outerHeight,
			position: "absolute",
			top: offset.top,
			left: offset.left,
			background: _public.options.rect.backgroundColor,
			opacity: _public.options.rect.opacity,
			
		})
		if(_public.options.rect.alwaysTop){
			$("#" + id).css({
				"z-index": parseFloat($(that).css("z-index")) ? parseFloat($(that).css("z-index"))+1 : "auto",
			})
		}
		
		
	}

	_private.drawLines = function(that){
		var offset = $(that).offset();
		var outerWidth = $(that).outerWidth(false);
		var outerHeight = $(that).outerHeight(false);
		if($("." + _private.line_class).length < 4){
			var i = 0;
			do {
				$("body").append('<div id="' + _private.line_class + '-' + i + '" class="' + _private.line_class + '"></div>');
				i++;
			} while (i < 4)
		}
		// 相切类型
		var tangentOffset
		if(_public.options.line.outerTangent){
			tangentOffset = [-_public.options.line.borderWidth, 0, -_public.options.line.borderWidth, 0];
		}else{
			tangentOffset = [0, -_public.options.line.borderWidth, 0, -_public.options.line.borderWidth];
		}

		//上1
		$("#" + _private.line_class + "-0").css({
			width: 0,
			// height: window.innerHeight,
			height: $(_private.container).height(),
			position: "absolute",
			// top: 0,
			top: $(_private.container).offset().top,
			left: offset.left + tangentOffset[0],
			opacity: _public.options.line.opacity,
			"border-left": _public.options.line.borderWidth + "px " + _public.options.line.borderStyle + " " + _public.options.line.borderColor,
		})

		// 上2
		$("#" + _private.line_class + "-1").css({
			width: 0,
			// height: window.innerHeight,
			height: $(_private.container).height(),
			position: "absolute",
			// top: 0,
			top: $(_private.container).offset().top,
			left: offset.left + outerWidth + tangentOffset[1],
			opacity: _public.options.line.opacity,
			"border-right": _public.options.line.borderWidth + "px  " + _public.options.line.borderStyle + " " + _public.options.line.borderColor,
		})

		// 左1
		$("#" + _private.line_class + "-2").css({
			// width: window.innerWidth,
			width: $(_private.container).width(),
			height: 0,
			position: "absolute",
			top: offset.top + tangentOffset[2], 
			// left: 0,
			left: $(_private.container).offset().left,
			opacity: _public.options.line.opacity,
			"border-top": _public.options.line.borderWidth + "px  " + _public.options.line.borderStyle + " " + _public.options.line.borderColor,
		})

		// 左2
		$("#" + _private.line_class + "-3").css({
			// width: window.innerWidth,
			width: $(_private.container).width(),
			height: 0,
			position: "absolute",
			top: offset.top + outerHeight + tangentOffset[3],
			// left: 0,
			left: $(_private.container).offset().left,
			opacity: _public.options.line.opacity,
			"border-bottom": _public.options.line.borderWidth + "px  " + _public.options.line.borderStyle + " " + _public.options.line.borderColor,
		})
		
	}


	_private.moveRect = function(x, y){
		if(_public.options.boundary){
			var pos = _private.get_mousemove_position(y - _private.cy + _private.container_cy, x - _private.cx + _private.container_cx);			
		}else{
			// var pos = [y - _private.cy + _private.container_cy, x - _private.cx + _private.container_cx];
			var pos = [y - _private.cy, x - _private.cx];
		}
		$("#" + _private.id).css({
			top: pos[0],
			left: pos[1],
		})

	}

	_private.moveLines = function(x, y){
		// 相切类型
		var tangentOffset
		if(_public.options.line.outerTangent){
			// tangentOffset = [-_public.options.line.borderWidth + _private.container_cx, 0 + _private.container_cx, -_public.options.line.borderWidth + _private.container_cy,  + _private.container_cy];
			tangentOffset = [-_public.options.line.borderWidth + 0, 0 + 0, -_public.options.line.borderWidth + 0,  + 0];
		}else{
			// tangentOffset = [0 + _private.container_cx, -_public.options.line.borderWidth + _private.container_cx, 0 + _private.container_cy, -_public.options.line.borderWidth + _private.container_cy];
			tangentOffset = [0 + 0, -_public.options.line.borderWidth + 0, 0 + 0, -_public.options.line.borderWidth + 0];
		}
		// //上1
		$("#" + _private.line_class + "-0").css({
			left: x - _private.cx + tangentOffset[0],
		})

		// //上2
		$("#" + _private.line_class + "-1").css({
			left: x - _private.cx + _private.outerw + tangentOffset[1],
		})

		// //左1
		$("#" + _private.line_class + "-2").css({
			top: y - _private.cy + tangentOffset[2],
		})

		// //左2
		$("#" + _private.line_class + "-3").css({
			top: y - _private.cy + _private.outerh + tangentOffset[3],
		})
	}

	_private.drawWhichRect = function(keyboard){
		var len = $("." + _private.ctrl_class).length;
		if(len){
			$("." + _private.ctrl_class).each(function(index, val){
				var id = _private.ctrl_rect_class + "-" + index;
				_private.drawRect(val, id, _private.ctrl_rect_class, keyboard);
				
			})
		}else{
			_private.drawRect(_private.that, _private.id, _private.rect_class, keyboard);
		}
	}


	// ------------------- F12 inspect ----------------------------------

	// ------------------- tips --------------------------------
	_private.drawTips = function(that){

		var offset = $(that).offset();
		var outerWidth = $(that).outerWidth(false);
		var outerHeight = $(that).outerHeight(false);
		$("." + _private.tips_class).remove();

		var id1 = _private.id + "-top-left";
		var id2 = _private.id + "-width-height";
		var id3 = _private.id + "-zIndex";

		var ele1 = '<div id="' + id1 + '" class="' + _private.tips_class+ '"></div>';
		var ele2 = '<div id="' + id2 + '" class="' + _private.tips_class+ '"></div>';
		var ele3 = '<div id="' + id3 + '" class="' + _private.tips_class+ '"></div>';
		$("body").append(ele1).append(ele2).append(ele3);

		var arr1 = [
			parseFloat(offset.top - (_private.container_cy + _private.margin[0])),
			parseFloat(offset.left - (_private.container_cx + _private.margin[3]))
		];

		var arr2 = [
			outerWidth,
			outerHeight
		];

		var zindex = parseFloat($(_private.that).css("z-index")) ? parseFloat($(_private.that).css("z-index")) : 0;
		var arr3 = [zindex];

		var html1 = _private.formatter("tl", _public.options.tips.topLeft.format, arr1);
		var html2 = _private.formatter("wh", _public.options.tips.widthHeight.format, arr2);
		var html3 = _private.formatter("z-index", _public.options.tips.zIndex.format, arr3);


		//先渲染出来拿它的高
		//html() first to get its height
		$("#" + id1).html(html1).css({
			"font-size": _public.options.tips.topLeft.fontSize,
			"font-family": _public.options.tips.topLeft.fontFamily,
			"background-color": _public.options.tips.topLeft.backgroundColor,
			opacity: _public.options.tips.topLeft.opacity,
			color: _public.options.tips.topLeft.color,
			padding: _public.options.tips.topLeft.padding,
			margin: _public.options.tips.topLeft.margin,
			height: _public.options.tips.topLeft.height,

		}).css({
			position: "absolute",
			top: offset.top - $("#" + id1).outerHeight(false) + _public.options.tips.topLeft.top,
			left: offset.left,
		})

		$("#" + id2).html(html2).css({
			"font-size": _public.options.tips.widthHeight.fontSize,
			"font-family": _public.options.tips.widthHeight.fontFamily,
			"background-color": _public.options.tips.widthHeight.backgroundColor,
			opacity: _public.options.tips.widthHeight.opacity,
			color: _public.options.tips.widthHeight.color,
			padding: _public.options.tips.widthHeight.padding,
			margin: _public.options.tips.widthHeight.margin,
			height: _public.options.tips.widthHeight.height,
		}).css({
			position: "absolute",
			top: offset.top + _private.outerh + _public.options.tips.widthHeight.top,
			left: offset.left,
		})

		$("#" + id3).html(html3).css({
			"font-size": _public.options.tips.zIndex.fontSize,
			"font-family": _public.options.tips.zIndex.fontFamily,
			"background-color": _public.options.tips.zIndex.backgroundColor,
			opacity: _public.options.tips.zIndex.opacity,
			color: _public.options.tips.zIndex.color,
			padding: _public.options.tips.zIndex.padding,
			margin: _public.options.tips.zIndex.margin,
			height: _public.options.tips.zIndex.height,
		}).css({
			position: "absolute",
			top: offset.top + _private.outerh + _public.options.tips.zIndex.top + $("#" + id2).outerHeight(false) + _public.options.tips.zIndex.top,
			left: offset.left,
		})

	}

	_private.moveTips = function(x, y){
		var id1 = _private.id + "-top-left";
		var id2 = _private.id + "-width-height";
		var id3 = _private.id + "-zIndex";

		var arr1 = [
			parseFloat(y - (_private.cy + _private.container_cy)),
			parseFloat(x - (_private.cx + _private.container_cx))
		];

		var arr2 = [
			_private.outerw,
			_private.outerh
		];


		var html1 = _private.formatter("tl", _public.options.tips.topLeft.format, arr1);
		var html2 = _private.formatter("wh", _public.options.tips.widthHeight.format, arr2);
		// var html3 = _private.formatter("wh", _public.options.tips.zIndex.format, arr3);

		$("#" + id1).html(html1).css({
			top: y - (_private.cy - 0)  - $("#" + id1).outerHeight(false) + _public.options.tips.topLeft.top,
			left: x - (_private.cx - 0),
		})

		$("#" + id2).html(html2).css({
			top: y - (_private.cy - 0)  + _private.outerh  + _public.options.tips.widthHeight.top,
			left: x - (_private.cx - 0),
		})

		$("#" + id3).css({
			top: y - (_private.cy - 0)  + _private.outerh  + _public.options.tips.widthHeight.top + $("#" + id2).outerHeight(false) + _public.options.tips.zIndex.top,
			left: x - (_private.cx - 0),
		})
	}

	// ----------------------- tips end ---------------------



	// --------------------- localStorage ----------------------
	/**
	 * save
	 * @param {[type]} name  [description]
	 * @param {[type]} value [description]
	 */
	_private.setData = function(name, value){
		localStorage.setItem(_private.ls.prefix + name, JSON.stringify(value));
	}

	/**
	 * get
	 * @param  {[type]} name [description]
	 * @return {[type]}      [description]
	 */
	_private.getData = function (name) {
	  var data = JSON.parse(localStorage.getItem(_private.ls.prefix + name));
	  if (data == null) return {};
	  return data;
	}
	// --------------------- localStorage end ----------------------
	// 
	// --------------------- drag -------------------------------------------
	_private.bindDragEvent = function(e){
		// console.log(e)
		e.preventDefault();
		var type = e.type;
		switch(type){
			case "mousedown":
				_private.that = this;
				// _private.container = $(this).parent();
				_private.container = $(this).offsetParent();
				// console.log(_private.container);
				if(_private.ifPressedAny(_public.config.keyCode.ctrl)){
					$(_private.that).addClass(_private.ctrl_class);
					
				}else{
					$(_private.selector_arr).each(function(key, val){
						$(val).removeClass(_private.ctrl_class);
					})
					$("." + _private.ctrl_rect_class).remove();
				}
				_private.dragstart(e);
				break;
			case "mousemove":
				_private.dragmove(e);
				break;
			case "mouseup":
				_private.dragend(e);
				break;
		}
	}

	_private.setBindMoveEnd = function(isset){
		if(isset){
			$(document).bind("mousemove", _private.bindDragEvent);
			$(document).bind("mouseup", _private.bindDragEvent);
		}else{
			$(document).unbind("mousemove");
			$(document).unbind("mouseup");
		}
	}

	_private.dragstart = function(e){

		var offset = $(_private.that).offset()
		var x = e.originalEvent.pageX;
		var y = e.originalEvent.pageY;

		_private.w = $(_private.that).innerWidth();
		_private.h = $(_private.that).innerHeight();

		// _private.padding = _private.getmp(_private.that, "padding");
		_private.margin = _private.getmp(_private.that, "margin");

		_private.container_offset = _private.container.offset();
		_private.container_position = _private.container.css("position");
		// _private.container_margin = _private.getmp(_private.container, "margin");
		switch(_private.container_position){
			// 相對時，拿樣式的時候要減去container_cx和container_cy
			case "relative":
				_private.container_cx = _private.container_offset.left;
				_private.container_cy = _private.container_offset.top;
				// _private.container_cx = 0;
				// _private.container_cy = 0;
				break;
			case "static":
				_private.container_cx = 0;
				_private.container_cy = 0;
				break;
			case "absolute":
				_private.container_cx = _private.container_offset.left;
				_private.container_cy = _private.container_offset.top;
				// _private.container_cx = 0;
				// _private.container_cy = 0;
				break;
			default:
				_private.container_cx = 0;
				_private.container_cy = 0;
				break;
		}
		// parent border好像也有影響
		_private.container_cy += parseFloat($(_private.container).css("border-top"));
		_private.container_cx += parseFloat($(_private.container).css("border-left"));
		// console.log(_private.container_position)
		// console.log(_private.container_cy, _private.container_cx);
		// _private.cy = y - offset.top + _private.container_cx;
		// _private.cx = x - offset.left + _private.container_cy;
		_private.cy = y - offset.top;
		_private.cx = x - offset.left;

		_private.calOuterwh();


		_private.drawLines(_private.that);
		_private.drawWhichRect();


		
		if(_private.ifon("showTips")){
			_private.drawTips(_private.that);
		}
		_private.setBindMoveEnd(true);
	}

	_private.dragmove = function(e){
		var x = e.originalEvent.pageX;
		var y = e.originalEvent.pageY;

		if(_public.options.boundary){
			var pos = _private.get_mousemove_position(y - (_private.cy + _private.margin[0] + _private.container_cy), x - (_private.cx + _private.margin[3] + _private.container_cx));
		}else{
			var pos = [y - (_private.cy + _private.margin[0] + _private.container_cy), x - (_private.cx + _private.margin[3] + _private.container_cx)];
		}

		$(_private.that).css({
			top: pos[0],
			left: pos[1],
		})

		_private.moveLines(x, y);
		_private.moveRect(x, y);
		if(_private.ifon("showTips")){
			_private.moveTips(x, y);
		}

	}

	_private.dragend = function(e){
		var x = e.originalEvent.pageX;
		var y = e.originalEvent.pageY;

		$("#" + _private.id).remove();
		$("." + _private.line_class).remove();
		$("." + _private.tips_class).remove();

		if(_public.options.printAfterDrag){
			_public.getCurrentTarget();
		}

		_private.setBindMoveEnd(false);
	}
	// --------------------- drag end-------------------------------------------
	//
	// ----------------- operation --------------------------------------
	/**
	 * extend options
	 * @param  {[type]} default_options [description]
	 * @param  {[type]} options         custom options
	 * @return {[type]}                 [description]
	 */
	_private.extend = function(default_options,options){
		try{
			for(var key in options){
				if(_private.isObj(options[key])){
					default_options[key] = _private.extend(default_options[key], options[key])
				}else{
					default_options[key] = options[key];
				}
			}
		}catch(e){
			console.log(e)
		}

		return default_options;
	}

	/**
	 * 是否为对象
	 * @param  {[type]}  obj [description]
	 * @return {Boolean}     [description]
	 */
	_private.isObj = function(obj){
		return typeof(obj) == "object" && Array.isArray(obj) != true;
	}

	/**
	 * if a funSwitch is on
	 * @param  {[type]} name [description]
	 * @return {[type]}      [description]
	 */
	_private.ifon = function(name){
		return _public.config.funcSwitch[name] == "on";
	}

	/**
	 * [ifexist description]
	 * @param  {[type]} code     [description]
	 * @param  {[type]} code_arr [description]
	 * @return {[type]}          [description]
	 */
	_private.ifexist = function(code,  code_arr){
		for (var i = 0; i < code_arr.length; i++) {
			if(code_arr[i] == code){
				return true;
			}
		}
		return false;
	}

	/**
	 * greed is not so good
	 * @param  {[type]} name [description]
	 * @param  {[type]} arr  [description]
	 * @return {[type]}      [description]
	 */
	_private.ifRadioFunc = function(name, arr){
		for (var i = 0; i < arr.length; i++) {
			for (var j = 0; j < arr[i].length; j++) {
				if(arr[i][j] == name) {
					return i;
					
				}
			}
		}
		return -1
	}

	/**
	 * 替换tips格式
	 * @param  {[type]} type   wh || tl || z-index
	 * @param  {[type]} format 格式
	 * @param  {[type]} arr   用于替换的数组 array
	 * @return {[type]}        返回string. $(id).html(string)
	 */
	_private.formatter = function(type, format, arr){
		switch(type){
			case "wh":
				format = format.replace(/{width}/, `${arr[0]}`);
				format = format.replace(/{height}/, `${arr[1]}`);
				break;
			case "tl":
				format = format.replace(/{top}/, `${arr[0]}`);
				format = format.replace(/{left}/, `${arr[1]}`);
				break;
			case "z-index":
				format = format.replace(/{zIndex}/, `${arr[0]}`);
				break;
			default:
				break;
		}
		return format;
	}
	/**
	 * 并集，未去重复
	 * merge, need unqiue
	 * @param  {[type]} arg1 [description]
	 * @param  {[type]} arg2 [description]
	 * @return {[type]}      [description]
	 */
	_private.merge = function(arg1, arg2){
		switch(typeof(arg2)){
			case "string":
				arg2 = arg2.split(",");

			case "object":
				for(var key in arg2){
					arg1.push(arg2[key]);
				}
				break;
			default:
					_private.output("selector wrong type");
					return false;
				break;
		}
		return arg1;
	}

	/**
	 * 去重复
	 * @param  {[type]} arr [description]
	 * @return {[type]}     [description]
	 */
	_private.arrayUnique = function(arr){
		var u = [];
		for (var i = 0; i < arr.length; i++) {
			if(u.indexOf(arr[i]) == -1){
				u.push(arr[i]);
			}
		}
		return u;
	}

	/**
	 * 差集
	 * diff
	 * @param  {[type]} arg1 [description]
	 * @param  {[type]} arg2 [description]
	 * @return {[type]}      [description]
	 */
	_private.diff = function(arg1, arg2){
		switch(typeof(arg2)){
			case "string":
				arg2 = arg2.split(",");
				
			case "object":
				for(var key in arg2){
					var index = arg1.indexOf(arg2[key])
					if(index > -1){
						arg1.splice(index, 1);
					}
				}
				break;
			default:
					_private.output("selector wrong type");
					return false;
				break;
		}
		return arg1;
	}
	
	/**
	 * yeah, slice pm like a youtiao, eggplant
	 * @param  {[type]} obj   [description]
	 * @param  {[type]} index [description]
	 * @return {[type]}       [description]
	 */
	_private.sliceObj = function(obj, index){
		var newobj = {};
		for(var key in obj){
			newobj[key] = [];
			for (var i = 0, len = obj[key].length; i < len; i++) {
				newobj[key].push(obj[key][i][index]);
			}
			
		}
		return newobj;
	}

	/**
	 * print sth
	 * @param  {[type]} arg     [description]
	 * @param  {[type]} comment [description]
	 * @return {[type]}         [description]
	 */
	_private.output = function(arg, comment, css=0){
		var type = typeof(arg);
		if(type == "string"){
			console.log(arg)
		}else if(type == "object"){
			if(comment){
				console.log("--- " + comment + " start ---")
			}
			for(var k in arg){
				console.log(k + " = " + JSON.stringify(arg[k]));
			}
			if(comment){
				console.log("--- " + comment + "  end  ---")
			}
		}
	}

	_private.reverseObj = function(obj){
		for (var key in obj) {
			for (var i = 0; i < obj[key].length; i++) {
				obj[key][i].reverse();
			}
		}
		return obj;
	}

	_private.ifPressedAny = function(arr){
		for (var i = 0; i < arr.length; i++) {
			if(_private.key_pressed[arr[i]]){
				return true;
			}
		}
		return false;
	}



	/**
	 * copy data into clipboard base on type
	 * @param  {[type]} data [description]
	 * @param  {[type]} type [description]
	 * @return {[type]}      [description]
	 */
	_private.copy2cb = function(data, type){
		var text = '';
		switch(type){
			case 'css':
				for(var key in data){
					text += (key + ' ' + data[key]);
				}
				break;
			case 'array':
				for(var key in data){
					text += key.substr(1) + " = " + JSON.stringify(data[key]) + ";\n";
				}
				break;
		}
		var textarea = document.createElement("textarea");
		textarea.value = text;
		document.body.appendChild(textarea);
		textarea.select();
		document.execCommand("copy", false, null);
		textarea.remove();
		return text;

	}

	/**
	 * enough freedom
	 * @param  {[type]} top  [description]
	 * @param  {[type]} left [description]
	 * @return {[type]}      [description]
	 */
	_private.get_mousemove_position = function(top, left){
		var new_top = Math.max(0, top);
		new_top = Math.min(_private.container.outerHeight(false) - _private.h, new_top)

		var new_left = Math.max(0, left);
		new_left = Math.min(_private.container.outerWidth(false) - _private.w, new_left)

		return [new_top, new_left];
	}

	_private.get_boder_width = function(border){

	}
	// ----------------- operation end --------------------------------------
	
	return _public;

}
