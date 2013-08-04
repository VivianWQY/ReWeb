var Core = window.Core || { };
Core.ACTIVE = { AcDesk: 0, GetMain: function() { return $(document.body); } };
Core.Debug = (function() {
    var content, model;
    var cl = function(ctt, callback) {
        var self = this;
        Core.WindowBase.call(this, { content: ctt, title: "调试", min_title: "调试" });
        var oldclose = self.Close;
        this.Close = function() {
            oldclose();
            callback && callback();
        };
    };
    return {
        write: function(msg) {
            if (!Core.CONFIG.TUpDebugKey) {
                return;
            }
            if (!model) {
                content = $(document.createElement("textarea"));
                content.css({ width: "100%", height: "100%" });
                model = new cl(content, function () { model = false; });
                model.Open();
            }
            content.val(content.val() + msg + "\n");
        }
    };
})();
Core.CONFIG = {
    TwinkTime: 70,
    TwinkCount: 3,
    MsgTimeout: 2000,
    ActiveClass: "window-current",
    WindowMinWidth: 400,
    WindowMinHeight: 300, 
    JSPath: {
        FUp: "../static/js/swfup.js?v=99",
        JPlayer: "static/js/jquery.jplayer.min.js?v=2015", 
        JPProxy: "static/js/jplayer_proxy.js?v=2015"
    },
    FUpSWF: "../static/swfup.swf?v=5.0",
    FUpDebug: true,
    HTML5: (typeof (Worker) !== "undefined"),
    IsWindows: true,
    IsWindowNT: (navigator.userAgent.indexOf("Windows NT") != -1), 
    IsMac: (navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform == "Macintosh") || (navigator.platform == "MacIntel"),
    IsOOF: (function() {
        var res = { state: false };
        if ($.browser.webkit) {
            var nav = navigator.appVersion;
            var str = /115Chrome\/[^\s]*/.exec(nav);
            if (str) {
                res.state = true;
                var arr = $.trim(str.join("")).split("/");
                if (arr.length > 1) {
                    res.version = arr[1];
                    if (arr[1] == "1.0.2" || arr[1] == "1.0.3") {
                        res.is_first = true;
                    }
                }
            }
        }
        return res;
    })()
};
(function(config) {
    for (var k in config) {
        Core.CONFIG[k] = config[k];
    }
})({
     UpEngine: 0, 
     FUpImg: UPLOAD_CONFIG.app_root + "static/img/v4_up_btn.png?v=2", 
     FUpRsa1: "", 
     FUpRsa2: "", 
     FUpErrMsg: { 
         "-100": "文件数量已超限制", 
         "-110": "大小不能超过%1",
         "-120": "不能上传空文件", 
         "-130": "无效的文件类型",
         "-200": "网络不正常，上传中断", 
         "-210": "上传地址丢失", 
         "-220": "网络异常", 
         "-230": "不安全的上传",
         "-240": "上传限制超标",
         "-250": "上传失败", 
         "-260": "未找到指定的文件",
         "-270": "文件验证失败",
         "-280": "文件列队取消", 
         "-290": "上传已停止", 
         "-300": "服务器异常" 
     }, TUpSp: "0", TUpDomId: "js_ocx_control_object", TUpFFVersion: "", TUpMacVersion: "", TUpUnixVersion: "", TUpTestVersion: { }, TUploadServer: "", TDeleteServer: "", TSelectCount: 20, TUpRefashFreq: 50, TUpIsProxy: 0, TUpReTryCount: 15, TUpSleepTime: 2, OpenUpDir: [1, 2, 3, 4, 9, 49]
});
Core.WinHistory = (function() {
    var _list = { };
    var _cache = { };
    var _random = 0;
    var _zIndex = 99;
    var _old_active;
    var _bindState = false;
    var status = (function() {
        var _stockTemp = '<li key="{key}"><b>{text}</b></li>';
        var _minTemp = '<li key="{key}"><b>{text}</b></li>';
        var getBox = function(statusType) { return statusType == 0 ? $(Core.CONFIG.StockStatus) : $(Core.CONFIG.MinStatus); };
        return {
            add: function(win) {
                if (win.Setting.is_not_min_title) {
                    return;
                }
                var dom = $(String.formatmodel((win.StatusType == 0 ? _stockTemp : _minTemp), { key: win.Key, text: win.Setting.min_title }));
                dom.find("b").bind("click", function(e) {
                    if (!win.IsActive) {
                        win.Open();
                    } else {
                        win.Hide();
                    }
                    return false;
                });
                if ($.browser.msie && $.browser.version == "6.0") {
                    dom.find("b").hover(function() { $(this).addClass("hover"); }, function() { $(this).removeClass("hover"); });
                }
                getBox(win.StatusType).append(dom);
                return dom;
            },
            del: function(win) {
                var box = getBox(win.StatusType);
                box.find("[key='" + win.Key + "']").empty().remove();
            },
            active: function(win) {
                var box = getBox(win.StatusType);
                box.find("[key='" + win.Key + "'] b").removeClass("active").addClass("focus");
            },
            deactive: function(win) {
                var box = getBox(win.StatusType);
                box.find("[key='" + win.Key + "'] b").removeClass("focus");
            },
            alarm: function(win) {
                var box = getBox(win.StatusType);
                box.find("[key='" + win.Key + "'] b").addClass("active");
            }
        };
    })();
    var bindEvent = function() {
        if (!_bindState) {
            $(window).bind("resize", function() {
                for (var k in _list) {
                    var win = _list[k];
                    var h = win.Main.height();
                    var w = win.Main.width();
                    var wH = win.warp.height();
                    var wW = win.warp.width();
                    var wT = win.warp.offset().top;
                    var wL = win.warp.offset().left;
                    var mL = win.Main.offset().left;
                    if (win.Setting.is_right) {
                        win.warp.height(h - wT - 5);
                        win.warp.offset({ left: mL + w - wW - Core.CONFIG.WinRightPX });
                    } else {
                        if ((wL + wW) > w) {
                            var newL = w - wW - 5;
                            if (newL < 0) {
                                wW = wW + newL;
                                newL = 0;
                            }
                            if (!win.Setting.is_not_resize) {
                                if (wW < win.Setting.min_width) {
                                    wW = win.Setting.min_width;
                                }
                                win.warp.width(wW);
                            }
                            win.warp.offset({ left: newL });
                        }
                        if ((wT + wH) > h) {
                            var newT = h - wH - 5;
                            if (newT < 0) {
                                wH = wH + newT;
                                newT = 0;
                            }
                            if (!win.Setting.is_not_resize) {
                                if (wH < win.Setting.min_height) {
                                    wH = win.Setting.min_height;
                                }
                                win.warp.height(wH);
                            }
                            win.warp.offset({ top: newT });
                        }
                    }
                }
            });
            _bindState = true;
        }
    };
    var windowStatusChange = function() {
        for (var k in Core.WinHistory.ChangeDelegate) {
            try {
                if (Core.WinHistory.ChangeDelegate[k]) {
                    Core.WinHistory.ChangeDelegate[k](_list);
                }
            } catch(e) {
                Core.WinHistory.ChangeDelegate[k] = null;
                delete Core.WinHistory.ChangeDelegate[k];
            }
        }
    };
    return {
        ChangeDelegate: { }, GetList: function() { return _list; },
        Add: function(win) {
            bindEvent();
            win.Key = win.Type + "_" + _random;
            _random++;
            _list[win.Key] = win;
            var dom = status.add(win);
            win.StatusDOM = dom;
            windowStatusChange();
        },
        Del: function(key) {
            if (_list[key]) {
                status.del(_list[key]);
                _list[key] = null;
                delete _list[key];
                windowStatusChange();
            }
        },
        GetIndex: function() { return _zIndex++; },
        LessIndex: function() { _zIndex--; },
        Active: function(win) {
            if (_old_active && _old_active == win.Key) {
                return;
            }
            _zIndex++;
            win.Active(_zIndex);
            win.IsActive = true;
            if (_old_active && _list[_old_active]) {
                _list[_old_active].DeActive();
                _list[_old_active].IsActive = false;
                status.deactive(_list[_old_active]);
            }
            status.active(win);
            _old_active = win.Key;
            windowStatusChange();
        },
        Alarm: function(win) { status.alarm(win); },
        DeOldActive: function() {
            if (_old_active && _list[_old_active]) {
                _list[_old_active].DeActive();
                _list[_old_active].IsActive = false;
                status.deactive(_list[_old_active]);
                _old_active = false;
            }
        },
        DeActiveStatus: function(win) {
            Core.WinHistory.DeOldActive();
            status.deactive(win);
            _old_active = false;
            windowStatusChange();
        }
    };
})();
Core.WinTitle = (function() {
    var _temp = '<div class="modal-header" rel="base_title"><a class="close" btn="hide" data-dismiss="modal" >&times;</a><h3>{title}</h3></div>';
    var _btns = ['<a href="javascript:;" class="diag-minimize" btn="hide">最小化</a>', '<a href="javascript:;" class="diag-maximize" btn="max">最大化</a><a href="javascript:;" class="diag-return" style="display:none" btn="revert">还原</a>', '<a href="javascript:;" class="diag-close" btn="close">关闭</a>'];
    var bindEvents = function(box, win) {
        box.find("[btn]").mousedown(function(e) {
            Core.WinHistory.Active(win);
        }).click(function(e) {
            win.SetButtonHandler($(this).attr("btn"));
            return false;
        });
    };
    return {
        Get: function(win) {
            var html = _btns.join("");
            var box = $(String.formatmodel(_temp, { title: win.Setting.title, button: html }));
            bindEvents(box, win);
            return box;
        }
    };
})();
Core.WindowBase = function(setting) {
    var _temp = '<div class="modal" style="display:none;" id="{key}_warp"><div id="{key}_inner" style="height:100%;"></div></div>';
    var _resizeTemp = '<div resize="{resize_type}" style="position: absolute; overflow: hidden; background: url(static/js/transparent.gif) repeat scroll 0% 0% transparent; {css}"></div>';
    var _self = this;
    var _cache = { resize: { t: "left: 0; top: -3px; width: 100%; height: 5px; z-index: 1;", r: "right: -3px; top: 0; width: 5px; height: 100%; z-index: 1;", b: "left: 0; bottom: -3px; width: 100%; height: 5px; z-index: 1;", l: "left: -3px; top: 0; width: 5px; height: 100%; z-index: 1;", rt: "right: -3px; top: -3px; width: 10px; height: 10px; z-index: 2", rb: "right: -3px; bottom: -3px; width: 10px; height: 10px; z-index: 2", lt: "left: -3px; top: -3px; width: 10px; height: 10px; z-index: 2", lb: "left: -3px; bottom: -3px; width: 10px; height: 10px; z-index: 2" } };
    if (!setting) {
        setting = { };
    }
    if (!setting.content) {
        setting.content = "";
    }
    if (!setting.title) {
        setting.title = "";
    }
    if (!setting.min_title) {
        setting.min_title = "窗口";
    }
    this.warp;
    this.Type = "window";
    this.IsActive = false;
    this.StatusType = 0;
    if (setting.Status != undefined) {
        this.StatusType = setting.Status;
    }
    this.Setting = setting;
    this.Main;
    var bindResize = function(resizeType, ele) {
        var rt = "";
        switch (resizeType) {
        case "t":
            rt = "n-resize";
            break;
        case "r":
            rt = "e-resize";
            break;
        case "b":
            rt = "s-resize";
            break;
        case "l":
            rt = "w-resize";
            break;
        case "rt":
            rt = "ne-resize";
            break;
        case "rb":
            rt = "se-resize";
            break;
        case "lb":
            rt = "sw-resize";
            break;
        case "lt":
            rt = "nw-resize";
            break;
        }
        /*
        Util.Mouse.MoveLine(ele, rt, function(line) {
            var xLess = line.eX - line.x;
            var yLess = line.eY - line.y;
            var w = _cache.resize_width;
            var h = _cache.resize_height;
            var t = _cache.resize_top;
            var l = _cache.resize_left;
            if (/l/.test(resizeType)) {
                w = w - xLess;
                if (w < _cache.resize.min_width) {
                    l = _cache.resize_maxL;
                } else {
                    l = l + xLess;
                }
            }
            if (/r/.test(resizeType)) {
                w = w + xLess;
            }
            if (/b/.test(resizeType)) {
                h = h + yLess;
            }
            if (/t/.test(resizeType)) {
                h = h - yLess;
                if (h < _cache.resize.min_height) {
                    t = _cache.resize_maxT;
                } else {
                    t = t + yLess;
                }
            }
            if (w < _cache.resize.min_width) {
                w = _cache.resize.min_width;
            }
            if (h < _cache.resize.min_height) {
                h = _cache.resize.min_height;
            }
            if (t < _cache.resize_mt) {
                h = h - Math.abs(_cache.resize_mt - t);
                t = _cache.resize_mt;
            }
            if ((t + h) > _cache.resize_mb) {
                h = _cache.resize_mb - t;
            }
            if (l < _cache.resize_ml) {
                w = w - Math.abs(_cache.resize_ml - l);
                l = _cache.resize_ml;
            }
            if ((l + w) > _cache.resize_mr) {
                w = _cache.resize_mr + l;
            }
            _self.warp.css({ width: w + "px", height: h + "px", top: t + "px", left: l + "px" });
            if (_self.Setting.is_right) {
                _self.Setting.is_right = false;
            }
        }, function() {
            var mainBox = _self.Main;
            _cache.resize_mt = mainBox.offset().top;
            _cache.resize_ml = mainBox.offset().left;
            _cache.resize_mr = _cache.resize_ml + mainBox.width();
            _cache.resize_mb = _cache.resize_mt + mainBox.height();
            _cache.resize_width = _self.warp.width();
            _cache.resize_height = _self.warp.height();
            _cache.resize_top = _self.warp.offset().top;
            _cache.resize_left = _self.warp.offset().left;
            _cache.resize_maxL = _cache.resize_left + _cache.resize_width - _cache.resize.min_width;
            _cache.resize_maxT = _cache.resize_top + _cache.resize_height - _cache.resize.min_height;
        });*/
    };
    var create = function() {
        if (!_cache.initState) {
            _self.Main = Core.ACTIVE.GetMain();
            _cache.initState = true;
            Core.WinHistory.Add(_self);
            _cache.resize.min_width = _self.Setting.min_width = _self.Setting.min_width ? _self.Setting.min_width : Core.CONFIG.WindowMinWidth;
            _cache.resize.min_height = _self.Setting.min_height = _self.Setting.min_height ? _self.Setting.min_height : Core.CONFIG.WindowMinHeight;
            if (!_self.warp) {
                _self.warp = $(String.formatmodel(_temp, { key: _self.Key }));
                var inner = _self.warp.find("#" + _self.Key + "_inner");
                if (!_self.Setting.is_not_resize) {
                    _cache.resize_list = [];
                    for (var k in _cache.resize) {
                        var ele = $(String.formatmodel(_resizeTemp, { resize_type: k, css: _cache.resize[k] }));
                        bindResize(k, ele);
                        _self.warp.append(ele);
                        _cache.resize_list.push(ele);
                    }
                }
                if (!_self.Setting.is_not_title) {
                    _cache.title = Core.WinTitle.Get(_self);
                    inner.append(_cache.title);
                }
                inner.append(_self.Setting.content);
                if (_self.Setting.width != undefined) {
                    _self.warp.width(_self.Setting.width);
                }
                if (_self.Setting.height != undefined) {
                    _self.warp.height(_self.Setting.height);
                }
                var mainBox = _self.Main;
                mainBox.append(_self.warp);
                if (_self.warp.height() > mainBox.height()) {
                    _self.warp.height(mainBox.height());
                }
                if (_self.Setting.position) {
                    _self.warp.css(_self.Setting.position);
                } else {
                    //Util.Layer.Center(_self.warp, { Main: mainBox });
                }
                /*
                Util.Mouse.MoveBox({
                    ClickBox: _cache.title ? _cache.title : _self.warp, Box: _self.warp, Outer: mainBox, Callback: function() { Core.WinHistory.Active(_self); },
                    MoveCallback: function() {
                        if (_self.Setting.is_right) {
                            _self.Setting.is_right = false;
                        }
                    }
                });*/
                if (!_self.Setting.is_not_resize) {
                    _cache.title.bind("dblclick", function() {
                        if (!_self.MaxState) {
                            _self.Max();
                        } else {
                            _self.Revert();
                        }
                    });
                } else {
                    _cache.title && _cache.title.find("[btn='max']").empty().remove();
                    _cache.title && _cache.title.find("[btn='revert']").empty().remove();
                }
                if (_self.Setting.is_not_min_title) {
                    _cache.title && _cache.title.find(".win-minsize").empty().remove();
                }
                _self.warp.bind("mousedown", function(e) { Core.WinHistory.Active(_self); });
                if (_self.Setting.is_max_window) {
                    _self.Max();
                }
            }
            if (_self.Initial) {
                _self.Initial();
            }
        }
    };
    this.Max = function() {
        var mainBox = _self.Main;
        var w = mainBox.width(), h = mainBox.height();
        _self.MaxState = true;
        _cache.old_sq = { w: _self.warp.width(), h: _self.warp.height(), t: _self.warp.offset().top, l: _self.warp.offset().left };
        _self.warp.width(w).height(h).css({ top: 0, left: 0 });
        setTitleBtn();
        _self.Open();
    };
    this.Revert = function() {
        _self.MaxState = false;
        var w = _cache.resize.min_width, h = _cache.resize.min_height, t = 0, l = 0;
        if (_cache.old_sq) {
            w = _cache.old_sq.w;
            h = _cache.old_sq.h;
            t = _cache.old_sq.t;
            l = _cache.old_sq.l;
        }
        _self.warp.width(w).height(h).css({ top: t, left: l });
        setTitleBtn();
    };
    this.CreateDom = function() { create(); };
    this.Hide = function() {
        _self.warp.hide();
        _self.DeActive();
        Core.WinHistory.DeActiveStatus(_self);
        _self.IsActive = false;
    };
    this.Open = function() {
        create();
        _self.warp.show();
        Core.WinHistory.Active(_self);
    };
    var setTitleBtn = function() {
        if (_self.MaxState) {
            _cache.title.find("[btn='max']").hide();
            _cache.title.find("[btn='revert']").show();
            if (_cache.resize_list) {
                for (var i = 0, len = _cache.resize_list.length; i < len; i++) {
                    _cache.resize_list[i].hide();
                }
            }
        } else {
            _cache.title.find("[btn='revert']").hide();
            _cache.title.find("[btn='max']").show();
            if (_cache.resize_list) {
                for (var i = 0, len = _cache.resize_list.length; i < len; i++) {
                    _cache.resize_list[i].show();
                }
            }
        }
    };
    this.SetButtonHandler = function(type) {
        switch (type) {
        case "hide":
            _self.Hide();
            break;
        case "max":
            _self.Max();
            break;
        case "revert":
            _self.Revert();
            break;
        case "close":
            _self.Close();
            break;
        }
    };
    this.Close = function() {
        Core.WinHistory.Del(_self.Key);
        _cache.initState = false;
        _self.warp && _self.warp.hide();
        _self.MaxState = false;
    };
    this.Active = function(zIndex) { _self.warp.css({ zIndex: zIndex }).addClass(Core.CONFIG.ActiveClass); };
    this.DeActive = function() { _self.warp.removeClass(Core.CONFIG.ActiveClass); };
};
Core.DialogBase = function(settings) {
    var _temp = '<div class="modal" id="modal" style="display:none;z-index:1000000002">'
        + '<div class="modal-header"><a class="close" data-dismiss="modal">×</a><h2 class="dialog-title" rel="title_box"><span rel="base_title"></span></h2></div><div class="modal-body" rel="base_content"></div></div>';
    var _box, _cover, _timer, _self = this;
    var _settings = !settings ? { } : settings;
    this.Main = Core.ACTIVE.GetMain();
    var create = function(win) {
        if (!_self.warp) {
            _self.warp = $(_temp);
            if (_settings.width) {
                _self.warp.width(_settings.width);
            }
            $(document.body).append(_self.warp);
            _self.warp.find("[btn]").mousedown(function(e) {
                Core.Html.StopPropagation(e);
                return true;
            });
            _self.warp.find("[btn]").click(function(e) {
                switch ($(this).attr("btn")) {
                case "close":
                    _self.Close();
                    break;
                }
                return false;
            });
            if (_settings.title) {
                _self.warp.find("[rel='base_title']").html(_settings.title);
            }
            if (_settings.content) {
                _self.warp.find("[rel='base_content']").append(_settings.content);
            }
            Util.Mouse.MoveBox({ ClickBox: _self.warp.find("[rel='title_box']"), Box: _self.warp, Outer: _self.Main });
            if (_self.Initial) {
                _self.Initial();
            }
        }
        if (!_cover) {
            _cover = $('<div style="z-index: 1000000001; display: none;background: none repeat scroll 0 0 #fff;_padding-top:40px;height: 100%;left: 0;position: absolute;top: 0;width: 100%;filter:alpha(opacity=0);-moz-opacity:0;opacity:0.0;"><div style="height:100%;width:100%;"></div></div>');
            $(document.body).append(_cover);
            _cover.bind("mousedown", function() {
                if (_timer) {
                    window.clearInterval(_timer);
                }
                _timer = window.setInterval(function() {
                    if (_timer_index % 2) {
                        _self.warp && _self.warp.addClass(Core.CONFIG.ActiveClass);
                    } else {
                        _self.warp && _self.warp.removeClass(Core.CONFIG.ActiveClass);
                    }
                    _timer_index++;
                    if (_timer_index > (Core.CONFIG.TwinkCount * 2 + 1)) {
                        _timer_index = 1;
                        if (_timer) {
                            window.clearInterval(_timer);
                        }
                    }
                }, Core.CONFIG.TwinkTime);
            });
            $(document).on("keydown", function(e) {
                if (e.keyCode == 27) {
                    if (_cover) {
                        _self.Close();
                        return false;
                    }
                }
            });
        }
        Util.Layer.Center(_self.warp, { Main: win ? win.warp : false });
    };
    var _timer_index = 1;
    this.Open = function(calback, win) {
        create(win);
        if (calback) {
            calback();
        }
        _cover.show();
        _self.warp.addClass(Core.CONFIG.ActiveClass).show();
        _self.warp.find('[btn="close"]').focus().blur();
    };
    this.Close = function() {
        _cover && _cover.hide().remove();
        _self.warp && _self.warp.hide().remove();
        _cover = false;
        _self.warp = false;
    };
};

Core.API = { };

Core.Message = (function() {
    var _dialog;
    var _MessageModel = function() {
        var _self = this, _initState = false, _callback, _openStatus = false, _dialog_type;
        var _content = $('<div><div class="dialog-msg" rel="content"></div><div class="dialog-bottom"><div class="con"><a href="javascript:;" class="button" btn="confirm">确定</a><a href="javascript:;" class="button btn-gray" btn="cancel" style="display:none;">取消</a></div></div><div>');
        Core.DialogBase.call(this, { content: _content, title: "信息提示" });
        var setTitle = function(title) { title && _self.warp.find("[rel='base_title']").html(title); };
        this.Initial = function() {
            if (!_initState) {
                $(document).bind("keyup", function(e) {
                    if (_openStatus) {
                        if (e.keyCode == 13) {
                            _content.find("[btn='confirm']").click();
                        } else {
                            if (e.keyCode == 27) {
                                switch (_dialog_type) {
                                case 0:
                                    _content.find("[btn='confirm']").click();
                                    break;
                                case 1:
                                    _content.find("[btn='cancel']").click();
                                    break;
                                }
                            }
                        }
                    }
                });
            }
        };
        var _closeFun = this.Close;
        this.Close = function() {
            _closeFun();
            _openStatus = false;
        };
        this.Show = function(obj) {
            _callback = false;
            _self.Open(function() {
                var cancelBtn = _content.find("[btn='cancel']");
                var confirmBtn = _content.find("[btn='confirm']");
                if (obj.confirm_link) {
                    confirmBtn.unbind("click").bind("click", function() {
                        if (_callback) {
                            _callback(true);
                        }
                        _self.Close();
                        return true;
                    });
                    confirmBtn.attr("href", obj.confirm_link).attr("target", "_blank");
                    cancelBtn.unbind("click").bind("click", function() {
                        var r = true;
                        if (_callback) {
                            r = _callback(false);
                        }
                        if (r === false) {
                            return false;
                        }
                        _self.Close();
                        return false;
                    });
                } else {
                    if (confirmBtn.attr("target")) {
                        confirmBtn.removeAttr("target");
                        confirmBtn.attr("href", "javascript:;");
                    }
                    _self.warp.find("[btn]").unbind("click").bind("click", function() {
                        var r = true;
                        if (_callback) {
                            r = _callback($(this).attr("btn") == "confirm");
                        }
                        if (r === false) {
                            return false;
                        }
                        _self.Close();
                        return false;
                    });
                }
                if (obj.confirm_text) {
                    confirmBtn.html(obj.confirm_text);
                } else {
                    confirmBtn.html("确定");
                }
                if (obj.cancel_text) {
                    cancelBtn.html(obj.cancel_text);
                } else {
                    cancelBtn.html("取消");
                }
                _callback = obj.callback;
                setTitle(obj.title);
                if (obj.dialog_type == undefined) {
                    obj.dialog_type = 0;
                }
                if (!obj.type) {
                    obj.type = "war";
                }
                var html_temp = '<h3><i class="hint-icon hint-{type}"></i>{text}</h3>' + (obj.content ? '<div class="dialog-msg-text">{content}</div>' : "");
                var con = _content.find("[rel='content']");
                con.html(String.formatmodel(html_temp, obj));
                confirmBtn.removeClass("btn-orange");
                switch (obj.dialog_type) {
                case 0:
                    cancelBtn.hide();
                    break;
                case 1:
                    cancelBtn.hide();
                    break;
                }
                _dialog_type = obj.dialog_type;
                _openStatus = true;
            }, obj.win);
        };
    };
    var init = function() {
        if (!_dialog) {
            _dialog = new _MessageModel();
        }
    };
    var _alertTimer;
    return {
        Confirm: function(obj) {
            init();
            obj.dialog_type = 1;
            _dialog.Show(obj);
        },
        Alert: function(obj) {
            init();
            obj.dialog_type = 0;
            _dialog.Show(obj);
            if (obj.timeout) {
                _alertTimer = window.setTimeout(function() { Core.Message.Hide(); }, obj.timeout);
            }
        },
        Hide: function() {
            if (_alertTimer) {
                window.clearTimeout(_alertTimer);
            }
            if (_dialog) {
                _dialog.Close();
            }
        }
    };
})();

Core.Upload = (function () {
    var _cache = { aid: 1, cid: 0, ActiveAid: 1, ActiveCid: 0 };
    var _MinForm = new (function () {
        var _self = this;
        var _content;
        var bindEvents = function () {
            _content.find("[rel='max']").on("click", function () {
                _MinForm.Close();
                _DisplayForm.Open();
                return false;
            });
        };
        var _openState = false;
        this.Open = function () { _openState = true; };
        this.Close = function () {
            _openState = false;
            if (_content) {
                _content.hide();
            }
        };
        this.Progress = function (obj) {
            if (!_DisplayForm.IsOpen && obj) {
                if (!_content) {
                    _content = $('<div class="upload-min"><span rel="pro_text">正在上传，已完成15%</span><a href="javascript:;" rel="max" class="maximize">最大化</a></div>');
                    $(document.body).append(_content);
                    bindEvents();
                }
                var size = 0;
                var count = 0;
                var complete = 0;
                for (var k in obj) {
                    count++;
                    size += Number(obj[k].size);
                    complete += Number(obj[k].complete);
                }
                var per = (complete / size);
                if (!_openState) {
                    _self.Open();
                    _content.show();
                }
                _content.find("[rel='pro_text']").html("文件上传中，已完成" + (per * 100).toFixed(1) + "%");
            } else {
                if (_openState) {
                    _self.Close();
                }
            }
        };
    })();
    var _DisplayForm = new (function () {
        var _self = this, _datalist = {}, _cacheData, _loadState = false, _isClose = true;
        var _content = $('<div class="modal-body"><div class="upload-panel pull-right"><span rel="js_up_msg"></span><div class="btn-wrap"><span id="js_upload_fup_box" style="float:left;overflow:hidden;margin-left:-1px; top:-9999px;"><span id="js_upload_fup_btn"></span></span><a href="javascript:;" class="btn btn-upload" style="display:none;" id="js_upload_tup_box"></a></div></div><table class="table"><thead><tr><th style="width: 250px;">文件名</th><th style="width: 180px;">上传进度</th><th style="width: 100px;">大小</th><th style="width: 50px;">操作</th></thead><tbody rel="list"></tbody></table></div><div class="modal-footer"><div class="upload-status"><div class="operate-btn operate-clear"><a href="javascript:;" rel="tooltip" data-original-title="只清空当前上传列表中已完成项的记录但不删除文件，如果要取消未上传文件，请点击列表中的“清除”链接" btn="clear" class="btn btn-danger"><i class="icon-trash icon-white"></i>清空列表</a>&nbsp;&nbsp;<a href="javascript:;" btn="hide" class="btn btn-success" data-dismiss="modal"><i class="icon-ok icon-white"></i>完成上传</a></div><div class="upload-stat-text" rel="upload_msg"></div></div></div>');
        var _fileTemp = '<tr file_id="{id}" class=" progress progress-info progress-striped active"><td class="f-name">{name}</span></td><td class="f-progress" rel="pg_text"></td><td class="f-size">{size_str}</td><td class="f-operate" rel="op"></td></tr>';
        Core.WindowBase.call(this, { title: "文件上传", content: _content, width: 640, height: 500, is_not_resize: true, min_title: "<span>上传文件</span>" });
        var domlist = _content.find("[rel='list']");
        var isExist = function (file) {
            var result = false;
            if (_cacheData) {
                for (var k in _cacheData) {
                    var item = _cacheData[k];
                    if (item.name == file.name && item.aid == file.aid) {
                        if (item.cid != undefined || file.cid != undefined) {
                            if (item.cid == file.cid) {
                                return true;
                            }
                        } else {
                            return true;
                        }
                    }
                }
            }
            return result;
        };
        var getBtn = function (obj) {
            var btn = $('<a href="javascript:;" class="ico-operate ' + obj.className + '" title="' + obj.text + '">' + obj.text + "</a>");
            if (obj.first) {
                var btns = obj.dom.find("[rel='op'] a.ico-operate");
                if (btns.length) {
                    $(btns[0]).before(btn);
                } else {
                    obj.dom.find("[rel='op']").append(btn);
                }
            } else {
                obj.dom.find("[rel='op']").append(btn);
            }
            if (obj.hide) {
                btn.hide();
            }
            btn.click(obj.callback);
        };
        var showUploadMsg = function (msg) { _content.find("[rel='js_up_msg']").html(msg); };
        this.ChangeDir = function (aid, cid) {
            switch (Number(_cache.ActiveAid)) {
                case 1:
                case 2:
                case 3:
                case 4:
                case 9:
                case 999:
                    var msg = "";
                    Core.Upload.Disable(false);
                    showUploadMsg(msg);
                    break;
                default:
                    Core.Upload.Disable(true, Number(_cache.ActiveAid));
                    break;
            }
        };
        this.Initial = function () {
            _isClose = false;
            _self.warp.addClass("upload-box").css({ height: "" });
            _content.find("[btn='clear']").unbind("click").bind("click", function () {
                _content.find("[file_id]").each(function () {
                    if (_cacheData && _cacheData[$(this).attr("file_id")]) {
                        return;
                    }
                    $(this).empty().remove();
                });
                return false;
            });
            _FUpload.dom("js_upload_fup_btn", "js_upload_fup_box");
            _FUpload.setting(_cache.ActiveAid, _cache.ActiveCid);
            _FUpload.show();
            _self.Install();
            var settings_ele = _content.find("[rel='settings']");
            settings_ele.hide();
            if (!Core.CONFIG.IsWindows) {
                    _self.warp.find("[rel='js_hint_msg_box']").empty().remove();
            }
            $("#js_upload_tup_box").empty().remove();
            if (_cache.setting_dom) {
                Util.DropDown.Bind({
                    Title: settings_ele, Content: _cache.setting_dom, IsOverShow: true,
                    ShowHandler: function () {
                        var ele = settings_ele;
                        var t = ele.offset().top + ele.height();
                        var l = ele.offset().left;
                        Core.FloatMenu.SetRightBtnPos(_cache.setting_dom, "up_setting", l, t, ele.width(), ele.height());
                    }
                });
                var menuList = _cache.setting_dom.find("[val]");
                menuList.each(function (i) {
                    var item = $(this);
                    var type = item.attr("val");
                    item.click(function (e) {
                        switch ($(this).attr("val")) {
                            case "flash":
                                Core.Setting.Change({ os_file_upload_type: 0 }, function (r) {
                                    if (r.state) {
                                        Core.Upload.ChangeEngine(0);
                                        checkUpEngine();
                                    }
                                });
                                break;
                            case "ocx1":
                                Core.Setting.Change({ os_file_upload_type: 1 }, function (r) {
                                    if (r.state) {
                                        Core.Upload.ChangeEngine(1);
                                        Core.CONFIG.TUpSp = "0";
                                        checkUpEngine();
                                    }
                                });
                                break;
                            case "ocx2":
                                Core.Setting.Change({ os_file_upload_type: 2 }, function (r) {
                                    if (r.state) {
                                        Core.Upload.ChangeEngine(1);
                                        Core.CONFIG.TUpSp = "1";
                                        checkUpEngine();
                                    }
                                });
                                break;
                        }
                        return false;
                    });
                });
            }
            listen();
            _loadState = true;
        };
        var checkUpEngine = function () {
            if (_cache.setting_dom) {
                var updom = _cache.setting_dom;
                updom.find("i.i-done").removeClass("ico-menu").removeClass("i-done");
                switch (Core.CONFIG.UpEngine) {
                    case 0:
                        updom.find("[val='flash'] i").addClass("ico-menu").addClass("i-done");
                        break;
                    case 1:
                        if (Number(Core.CONFIG.TUpSp) == 1) {
                            updom.find("[val='ocx2'] i").addClass("ico-menu").addClass("i-done");
                        } else {
                            updom.find("[val='ocx1'] i").addClass("ico-menu").addClass("i-done");
                        }
                        break;
                }
                _cache.setting_dom.hide();
            }
        };
        this.Install = function () {
            _FUpload.show();
        };
        this.PauseUI = function (file) {
            _self.ShowMessage(file.id, "暂停", 0);
            var dom = domlist.find("[file_id='" + file.id + "']");
            dom.find(".op-pause").hide();
            dom.find(".op-continue").css({ display: "" });
        };
        this.Add = function (file) {
            if (!isExist(file)) {
                if (file.size || file.size == 0) {
                    file.size_str = Util.File.ShowSize(file.size);
                } else {
                    file.size_str = "";
                }
                var temp = $(String.formatmodel(_fileTemp, file));
                getBtn({
                    dom: temp,
                    text: "移除",
                    className: "op-delete",
                    callback: function(e) {
                        _self.Del(file);
                        var access = _FUpload.getAccess();
                        access.del(file);
                        return false;
                    }
                });
                domlist.append(temp);
                if (file.error) {
                    _self.Error(file);
                } else {
                    if (!_cacheData) {
                        _cacheData = {};
                    }
                    _cacheData[file.id] = file;
                }
            }
        };
        this.HideCTLButton = function (file, pause, conti) {
            if (file.up_type == 1) {
                var dom = domlist.find("[file_id='" + file.id + "']");
                if (dom.length) {
                    var pauseBtn = dom.find(".op-pause");
                    var contiBtn = dom.find(".op-continue");
                    if (pause) {
                        if (pauseBtn.css("display") != "none") {
                            pauseBtn.hide();
                        }
                    } else {
                        if (pauseBtn.css("display") == "none") {
                            pauseBtn.css({ display: "" });
                        }
                    }
                    if (conti) {
                        if (contiBtn.css("display") != "none") {
                            contiBtn.hide();
                        }
                    } else {
                        if (contiBtn.css("display") == "none") {
                            contiBtn.css({ display: "" });
                        }
                    }
                }
            }
        };
        this.Del = function (file) {
            var dom = domlist.find("[file_id='" + file.id + "']");
            if (dom.length) {
                dom.html("").remove();
            }
            if (_cacheData) {
                _cacheData[file.id] = null;
                delete _cacheData[file.id];
            }
        };
        this.Get = function (id) { return _cacheData[id]; };
        this.IsExist = function (file) { return isExist(file); };
        this.Success = function (file) {
            var dom = domlist.find("[file_id='" + file.id + "']");
            dom.find("[rel='pg_text']").html('<i class="icon-ok"></i>上传成功');
            dom.find(".progress-bar").html("").remove();
            dom.find('td:last-child').before('<td>' + new Date(file.token_time).format('yyyy年MM月dd日 hh:mm:ss') + '</td>');
            dom.attr("file", file.fid);
            $('#file-list').append(dom);
            if (file.up_type == 1) {
                dom.find(".op-pause").empty().remove();
                dom.find(".op-continue").empty().remove();
            }
            if (_cacheData && _cacheData[file.id]) {
                _cacheData[file.id] = null;
                delete _cacheData[file.id];
            }
        };
        this.Error = function (file) {
            var dom = domlist.find("[file_id='" + file.id + "']");
            dom.attr("class", "err");
            dom.attr("title", file.error);
            dom.find("[rel='pg_text']").html(file.error);
            dom.find(".progress-bar").html("").remove();
            dom.find(".op-pause").empty().remove();
            dom.find(".op-continue").empty().remove();
            if (_cacheData && _cacheData[file.id]) {
                _cacheData[file.id] = null;
                delete _cacheData[file.id];
            }
        };
        this.ShowMessage = function (id, str) {
            var dom = domlist.find("[file_id='" + id + "']");
            dom.find("[rel='pg_text']").html(str);
        };
        this.Progress = function (file) {
            var dom = domlist.find("[file_id='" + file.id + "']");
            if (file.progress == undefined) {
                file.progress = "";
            }
            if (file.speed_str == undefined) {
                file.speed_str = "";
            }
            dom.find("[rel='pg_text']").html(file.progress + file.speed_str);
            var line = dom.find(".progress-bar");
            if (!line.length) {
                line = $('<div class="progress-bar"></div>');
                dom.append(line);
            }
            line.css({ width: file.progress });
        };
        var totalobj = null;
        this.TotalProgress = function () {
            if (_cacheData) {
                var count = 0;
                var size = 0;
                var complete = 0;
                if (!totalobj) {
                    totalobj = {};
                }
                var speed = 0;
                for (var k in _cacheData) {
                    var file = _cacheData[k];
                    totalobj[k] = { size: Number(file.size), complete: file.complete ? Number(file.complete) : 0 };
                    if (file.is_uploading == 1) {
                        speed += (file.speed ? file.speed : 0);
                    }
                    count++;
                    size += totalobj[k].size;
                    complete += totalobj[k].complete;
                }
                if (count) {
                    var per = (complete / size);
                    var lessSize = size - complete;
                    var msg = "";
                    var lessTime;
                    if (speed) {
                        lessTime = Util.Date.GetTimeText(Math.floor((lessSize / 1024) / speed));
                    } else {
                        lessTime = "00:00:00";
                    }
                    if (count) {
                        msg += count + "个文件正在上传，共" + Util.File.ShowSize(size) + "，已完成" + ((per * 100).toFixed(1) + "%, 剩余时间: " + lessTime);
                    }
                    _content.find('[rel="upload_msg"]').html(msg);
                } else {
                    _content.find('[rel="upload_msg"]').html("");
                    totalobj = null;
                }
            } else {
                totalobj = null;
            }
            _MinForm.Progress(totalobj);
        };
        this.Close = function () {
            _self.Hide();
            Core.WinHistory.Del(_self.Key);
            _self.IsOpen = false;
            _isClose = true;
        };
        this.IsOpen = false;
        this.Hide = function () {
            var t = _self.warp.offset().top;
            _self.warp.css({ top: t - 9999 });
            _self.DeActive();
            Core.WinHistory.DeActiveStatus(_self);
            _self.IsActive = false;
            _loadState = false;
            _self.IsOpen = false;
        };
        this.Open = function () {
            _self.CreateDom();
            checkUpEngine();
            if (_loadState) {
                _self.warp.show();
            } else {
                var t = _self.warp.offset().top;
                _self.warp.css({ top: "" });
                _loadState = true;
            }
            if (_isClose) {
                _isClose = false;
                Core.WinHistory.Add(_self);
            }
            Core.WinHistory.Active(_self);
            _self.IsOpen = true;
        };
        this.CheckUpEngine = function () {
            checkUpEngine();
            Core.Upload.ChangeEngine(Core.CONFIG.UpEngine);
        };
        this.IsClose = function () { return _isClose; };
        var _reloadTimer;
        this.ReloadPage = function (aid, cid) {
            if (_reloadTimer) {
                window.clearTimeout(_reloadTimer);
            }
            _reloadTimer = window.setTimeout(function () {
                if (Number(aid) == 999) {
                    if (Core.CONFIG.QFileAPI.DataAPI) {
                        Core.CONFIG.QFileAPI.DataAPI.Reload(aid, cid);
                    }
                }
                if (_reloadTimer) {
                    window.clearTimeout(_reloadTimer);
                }
            }, 1200);
        };
    })();
    var listen = function () {
        if (!_cache.listenTimer) {
            _cache.listenTimer = window.setInterval(function () { _DisplayForm.TotalProgress(); }, 50);
        }
    };
    var _FUpload = (function () {
        var _FCache = { initState: false };
        var _dataAccess = {
            del: function (file) {
                if (_FCache.Uploader.getFile(file.id)) {
                    _FCache.Uploader.cancelUpload(file.id);
                }
                _DisplayForm.Del(file);
            }
        };
        var fBindEvents = function (settings) {
            settings.swfupload_loaded_handler = function () {
                if (!_FCache.loaded) {
                    _FCache.loaded = true;
                    if (_loadedFunList) {
                        for (var i = 0, len = _loadedFunList.length; i < len; i++) {
                            _loadedFunList[i]();
                        }
                        _loadedFunList = false;
                    }
                    if (_FloadedCallback) {
                        _FloadedCallback();
                    }
                }
            };
            settings.file_queued_handler = function (file) {
                file.up_type = 0;
                file.aid = this.customSettings.aid;
                file.cid = this.customSettings.cid;
                if (!_DisplayForm.IsExist(file)) {
                    if (file.size > 1024 * 1024 * 1024) {
                        _FCache.Uploader.cancelUpload(file.id);
                        file.error = "目前不支持上传大于1G的文件";
                    } else {
                        if (Util.Validate.mb_strlen(file.name) > 451) {
                            _FCache.Uploader.cancelUpload(file.id);
                            file.error = "文件名过长";
                        }
                    }
                    file.complete = 0;
                    _DisplayForm.Add(file);
                    file.is_uploading = 1;
                    _DisplayForm.Open();
                } else {
                    _FCache.Uploader.cancelUpload(file.id);
                }
            };
            settings.file_queue_error_handler = function (file, error, message) {
                if (isNaN(file.size) || (_cacheConfig.upload_size_limit > file.size && error == "-110")) {
                    var txt = "请改用极速上传, 普通上传不支持上传大于1G的文件";
                    file.error = '<span title="' + txt + '">' + txt + "</span>";
                } else {
                    file.error = String.format(Core.CONFIG.FUpErrMsg[error], Util.File.ShowSize(Number(_cacheConfig.upload_size_limit)));
                }
                _DisplayForm.Add(file);
                _DisplayForm.Open();
            };
            settings.file_dialog_complete_handler = function (selected, queued) {
                if (!_FCache.Uploader.getFile()) {
                    this.customSettings.FileSizeTotal = null;
                }
                this.startUpload();
            };
            settings.upload_start_handler = function (file) {
                file = _DisplayForm.Get(file.id);
                _FCache.isupload = true;
                _FUpload.setting(file.aid, file.cid, file.name_md5, file.token_time);
                _FCache.isupload = false;
                _DisplayForm.Progress(file);
                this.customSettings.StartTime = new Date();
            };
            settings.upload_progress_handler = function (file, c, t) {
                file = _DisplayForm.Get(file.id);
                if (file) {
                    file.complete = c;
                    file.total = t;
                    var useTime = new Date().getTime() - this.customSettings.StartTime.getTime();
                    var speed = Number(c / useTime);
                    var speedstr = (speed * 1000 / 1024);
                    if (speedstr > 1024) {
                        speedstr = (speedstr / 1204).toFixed(1) + "m";
                    } else {
                        speedstr = speedstr.toFixed(1) + "k";
                    }
                    var pro = (c / t) * 100;
                    if (pro > 99) {
                        pro = 99;
                    }
                    file.progress = pro.toFixed(1) + "%";
                    file.speed = speed;
                    file.speed_str = "(" + speedstr + "/s)";
                    _DisplayForm.Progress(file);
                }
            };
            settings.upload_error_handler = function (file, error, message) {
                file = _DisplayForm.Get(file.id);
                if (file) {
                    file.is_uploading = 0;
                    this.customSettings.UploadFileSize -= file.size;
                    this.customSettings.TotalSize -= file.size;
                    file.error = Core.CONFIG.FUpErrMsg[error];
                    _DisplayForm.Error(file);
                }
            };
            settings.upload_success_handler = function (file, data) {
                file = _DisplayForm.Get(file.id);
                file.is_uploading = 0;
                try {
                    Core.Debug.write(data);
                    data = eval("(" + data + ")");
                    if (data.state) {
                        try {
                            if (file.aid && file.aid.toString().indexOf("q_") != -1) {
                                _DisplayForm.ReloadPage(999, file.cid);
                            } else {
                                _DisplayForm.ReloadPage(data.data.aid, data.data.cid);
                            }
                        } catch (e) {
                        }
                        file.fid = data.fid[0];
                        _DisplayForm.Success(file);
                        this.customSettings.UploadFileSize -= file.size;
                        this.customSettings.CompleteSize += file.size;
                        return;
                    }
                    file.error = data.message;
                } catch (e) {
                    file.error = "错误: 未知原因";
                }
                _DisplayForm.Error(file);
            };
            settings.upload_complete_handler = function (file) {
                file = _DisplayForm.Get(file.id);
                file && (file.is_uploading = 0);
            };
            settings.queue_complete_handler = function () {
            };
        };
        var setting = function (data) {
            var typeStr = data.upload_type_limit == "*" ? "*.*" : ("*." + data.upload_type_limit.join(";*."));
            var params;
            var postAid = data.aid, postCid = data.cid;
            if (data.cid) {
                if (data.cid.toString().indexOf("_0") != -1) {
                    postAid = Number(data.cid.toString().replace("_0", ""));
                    data.cid = 0;
                    postCid = 0;
                }
                params = { aid: data.aid, cid: data.cid, cookie: USER_COOKIE };
            } else {
                params = { aid: data.aid, cookie: USER_COOKIE };
            }
            var tupKey = "U";
            switch (Number(postAid)) {
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 9:
                    tupKey = "U_" + postAid + "_" + (postCid ? postCid : 0);
                    break;
                case 999:
                    var config = window.UPLOAD_CONFIG["999"];
                    tupKey = "Q_" + config.aid.replace("q_", "") + "_" + (postCid ? postCid : 0);
                    break;
                default:
                    if (postAid.toString().indexOf("q_") != -1) {
                        var config = window.UPLOAD_CONFIG["999"];
                        tupKey = "Q_" + config.aid.replace("q_", "") + "_" + (postCid ? postCid : 0);
                    }
                    break;
            }
            params.target = tupKey;
            var url = data.upload_url;
            if (!_FCache.Uploader) {
                var settings = {
                    flash_url: Core.CONFIG.FUpSWF,
                    upload_url: url,
                    file_types_description: typeStr,
                    file_upload_limit: 0,
                    file_types: typeStr,
                    file_size_limit: 1073741824,
                    file_queue_limit: 0,
                    button_action: SWFUpload.BUTTON_ACTION.SELECT_FILES,
                    custom_settings: { aid: postAid, cid: postCid },
                    debug: Core.CONFIG.FUpDebug,
                    post_params: params,
                    button_cursor: SWFUpload.CURSOR.HAND,
                    button_image_url: Core.CONFIG.FUpImg,
                    button_width: "100",
                    button_height: "28",
                    button_placeholder_id: _FCache.UP_ID,
                    button_window_mode: SWFUpload.WINDOW_MODE.TRANSPARENT,
                    rsa1: Core.CONFIG.FUpRsa1,
                    rsa2: Core.CONFIG.FUpRsa2
                };
                fBindEvents(settings);
                if (SWFUpload) {
                    _FCache.Uploader = new SWFUpload(settings);
                }
            } else {
                if (!_FCache.isupload) {
                    if (!_FCache.loaded) {
                        _loadedFunList.push(function () { setting(data); });
                        return;
                    }
                    _FCache.Uploader.setFileTypes(typeStr, typeStr);
                    _FCache.Uploader.setFileSizeLimit(Util.File.ShowSize(data.upload_size_limit));
                    _FCache.Uploader.customSettings.aid = postAid;
                    _FCache.Uploader.customSettings.cid = postCid;
                } else {
                    _FCache.Uploader.setUploadURL(url);
                    var postSetting;
                    if (data.cid) {
                        postSetting = { aid: postAid, cid: postCid, cookie: USER_COOKIE };
                    } else {
                        postSetting = { aid: postAid, cookie: USER_COOKIE };
                    }
                    if (data.md5) {
                        postSetting.token = data.md5;
                    }
                    if (data.token_time) {
                        postSetting.time = data.token_time;
                    }
                    postSetting.target = tupKey;
                    _FCache.Uploader.setPostParams(postSetting);
                }
            }
        };
        var _cacheConfig;
        var init = function (config) {
            _cacheConfig = config;
            if (!_FCache.initState) {
                Util.Load.JS(Core.CONFIG.JSPath.FUp, function () {
                    window.setTimeout(function () {
                        _FCache.initState = true;
                        setting(_cacheConfig);
                    }, 10);
                });
            } else {
                setting(_cacheConfig);
            }
        };
        var _loadedFunList = [];
        return {
            isStart: function () { return _FCache.loaded; }, getAccess: function () { return _dataAccess; },
            dom: function (id, boxId) {
                _FCache.UP_ID = id;
                _FCache.Box_ID = boxId;
            },
            show: function () { $("#" + _FCache.Box_ID).css({ top: "", position: "" }); },
            hide: function () { $("#" + _FCache.Box_ID).css({ top: -9999 + "px", position: "absolute" }); },
            setting: function (aid, cid, md5, token_time) {
                if (aid == undefined) {
                    aid = 1;
                    cid = 0;
                }
                if (aid.toString().indexOf("q_") != -1) {
                    aid = 999;
                }
                var config = _cache.config[aid.toString()];
                config.cid = cid;
                if (md5) {
                    config.md5 = md5;
                }
                if (token_time) {
                    config.token_time = token_time;
                }
                init(config);
            },
            setDisabled: function (disable) {
                if (!_FCache.loaded) {
                    _loadedFunList.push(function () { _FCache.Uploader.setButtonDisabled(disable); });
                    return;
                }
                if (_FCache.Uploader) {
                    _FCache.Uploader.setButtonDisabled(disable);
                }
            }
        };
    })();
    var _UpCTL = (function () {
        var _btn;
        return {
            show: function () { _btn.show(); }, hide: function () { _btn.hide(); },
            setting: function (aid, cid) {
                if (_FUpload.isStart()) {
                    _FUpload.setting(aid, cid);
                }
                _DisplayForm.ChangeDir(aid, cid);
            },
            setDisabled: function (disable, aid) {
                _FUpload.setDisabled(disable);
                if (aid && aid == 12) {
                    disable = false;
                }
            }
        };
    })();
    var _FloadedCallback;
    return {
        GetTUploadInstall: function () { return _TUpload.isInstall(); }, ShowOCXDownLoad: function () { _TUpload.showDownload(); },
        Show: function (aid, cid, notSelect) {
            Core.Upload.SetCatalog(aid, cid);
            Core.Upload.Open(notSelect);
        },
        Open: function (notSelect) {
            var doClose = _DisplayForm.IsClose();
            _DisplayForm.Open();
            if (!notSelect && Core.CONFIG.UpEngine != 0 && _TUpload.isInstall()) {
                window.setTimeout(function () {
                    if (_TUpload.select() === -1) {
                        _DisplayForm.Open();
                    }
                }, 10);
                return;
            }
        },
        WriteOCX: function () { _TUpload.write(); },
        SetCatalog: function (aid, cid) {
            _cache.ActiveAid = aid;
            _cache.ActiveCid = cid;
            _UpCTL.setting(_cache.ActiveAid, _cache.ActiveCid);
        },
        SetConfig: function (config) { _cache.config = config; },
        ChangeEngine: function (engine) {
            Core.CONFIG.UpEngine = engine;
            _UpCTL.setting(_cache.ActiveAid, _cache.ActiveCid);
            _DisplayForm.Install();
        },
        TUpLoadError: function () { _TUpload.loaderror(); },
        TUpLoadStateChange: function (ele) { _TUpload.statechange(ele); },
        Disable: function (r, aid) { _UpCTL.setDisabled(r, aid); },
        ReuploadByPickCode: function (pick_code) {
            if (_TUpload.isInit()) {
                for (var i = 0, len = pick_code.length; i < len; i++) {
                    var item = pick_code[i];
                    _TUpload.reuploadByPickCode(item);
                }
            } else {
                _TUpload.initCallback = function () {
                    window.setTimeout(function () {
                        for (var i = 0, len = pick_code.length; i < len; i++) {
                            var item = pick_code[i];
                            _TUpload.reuploadByPickCode(item);
                        }
                    }, 20);
                };
                Core.Upload.Show(1, 0, true);
            }
        },
        DeleteByPickCode: function (pick_code) { _TUpload.delByPickCode(pick_code); },
        CheckUpEngine: function () { _DisplayForm.CheckUpEngine(); }
    };
})();
