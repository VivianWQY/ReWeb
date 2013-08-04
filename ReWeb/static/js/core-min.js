var Core = window.Core || { };
Core.ACTIVE = { AcDesk: 0, GetMain: function() { return $(document.body) } };
Core.Plugs = (function() {
    var _cache = { };
    return {
        AddButton: function(key, fun) {
            if (!_cache.float_menu_btn) {
                _cache.float_menu_btn = { }
            }
            _cache.float_menu_btn[key] = fun
        },
        DoButton: function(key) {
            if (_cache.float_menu_btn && _cache.float_menu_btn[key]) {
                var arg = arguments;
                var params = [];
                if (arg.length > 1) {
                    for (var i = 1, len = arg.length; i < len; i++) {
                        params.push("arg[" + i + "]")
                    }
                }
                try {
                    eval("var res = _cache['float_menu_btn'][key](" + params.join(",") + ")");
                    return true
                } catch(e) {
                    return false
                }
            }
            return false
        },
        Add: function(key, type, mod) {
            if (!_cache[type]) {
                _cache[type] = { }
            }
            _cache[type][key] = mod
        },
        Check: function(key, type) {
            if (_cache[type]) {
                return (_cache[type][key] ? true : false)
            }
            return false
        },
        Cmd: function(key, type, funName) {
            if (Core.Plugs.Check(key, type)) {
                var arg = arguments;
                var params = [];
                if (arg.length > 3) {
                    for (var i = 3, len = arg.length; i < len; i++) {
                        params.push("arg[" + i + "]")
                    }
                }
                if (_cache[type][key][funName]) {
                    eval("var res = _cache[type][key]." + funName + "(" + params.join(",") + ")")
                }
                return res
            }
        }
    }
})();
Core.Html = {
    GetShadow: function() {
        return "";
        return '<div class="shadow-cor cor-tl"></div><div class="shadow-cor cor-tr"></div><div class="shadow-cor cor-br"></div><div class="shadow-cor cor-bl"></div><div class="shadow-cor cor-t"></div><div class="shadow-cor cor-r"></div><div class="shadow-cor cor-b"></div><div class="shadow-cor cor-l"></div>'
    },
    StopPropagation: function(e) { Util.Html.StopPropagation(e) },
    GetFullIFrame: function() { return "" }
};
Util.CopyMsg = function(result) {
    if (result) {
        Core.MinMessage.Show({ text: "内容已复制至剪贴板", type: "suc", timeout: 2000 })
    } else {
        Core.MinMessage.Show({ text: "复制失败! 您使用的浏览器不支持复制功能", type: "war", timeout: 2000 })
    }
};
Core.Debug = (function() {
    var _content, _model;
    var _class = function(content, callback) {
        var _self = this;
        Core.WindowBase.call(this, { content: content, title: "调试", min_title: "调试" });
        var oldclose = _self.Close;
        this.Close = function() {
            oldclose();
            callback && callback()
        }
    };
    return {
        write: function(msg) {
            if (!Core.CONFIG.TUpDebugKey) {
                return
            }
            Util.log(msg);
            if (!_model) {
                _content = $(document.createElement("textarea"));
                _content.css({ width: "100%", height: "100%" });
                _model = new _class(_content, function() { _model = false });
                _model.Open()
            }
            _content.val(_content.val() + msg + "\n")
        }
    }
})();
Core.HAS_TALK = 1;
Core.CONFIG = {
    TwinkTime: 70, TwinkCount: 3, MsgTimeout: 2000, ActiveClass: "window-current", WindowMinWidth: 400, WindowMinHeight: 300, Path: { My: PAGE_PATHS.MY, MyAjax: PAGE_PATHS.MY, HOME: PAGE_PATHS.HOME + "/", G: PAGE_PATHS.Q + "/", GAJAX: PAGE_PATHS.Q + "/", U: PAGE_PATHS.U + "/", PASS: PAGE_PATHS.PASSPORT + "/", Msg: PAGE_PATHS.MSG + "/", OS: PAGE_PATHS.U + "/", VIP: PAGE_PATHS.VIP, VIP_ORDER: PAGE_PATHS.VIP + "/vip", UAPI: PAGE_PATHS.UAPI, APP: PAGE_PATHS.APP, WENKU: PAGE_PATHS.WENKU }, JSPath: { FUp: "static/swfup/swfup_min.js?v=99", JPlayer: "static/js/jquery.jplayer.min.js?v=2015", JPProxy: "static/js/jplayer_proxy.js?v=2015" }, FUpSWF: "static/swfup/swfup.swf?v=5.0", FUpDebug: false, HTML5: (typeof(Worker) !== "undefined"), IsWindows: true, IsWindowNT: (navigator.userAgent.indexOf("Windows NT") != -1), IsMac: (navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform == "Macintosh") || (navigator.platform == "MacIntel"),
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
                        res.is_first = true
                    }
                }
            }
        }
        return res
    })(),
    WinRightPX: 12,
    DABridgeURL: PAGE_PATHS.UAPI + "/bridge.html",
    DAAppBridgeURL: PAGE_PATHS.APP + "/bridge_new.html",
    DAUserBridgeURL: PAGE_PATHS.MY + "/bridge.html",
    DAMsgBridgeURL: PAGE_PATHS.MSG + "/api/bridge.html",
    DAQBridgeURL: PAGE_PATHS.Q + "/static/bridge.html"
};
(function(config) {
    for (var k in config) {
        Core.CONFIG[k] = config[k]
    }
})({ UpEngine: 0, FUpImg: "static/swfup/v4_up_btn.png?v=2", FUpRsa1: "", FUpRsa2: "", FUpErrMsg: { "-100": "文件数量已超限制", "-110": "大小不能超过%1", "-120": "不能上传空文件", "-130": "无效的文件类型", "-200": "网络不正常，上传中断", "-210": "上传地址丢失", "-220": "网络异常", "-230": "不安全的上传", "-240": "上传限制超标", "-250": "上传失败", "-260": "未找到指定的文件", "-270": "文件验证失败", "-280": "文件列队取消", "-290": "上传已停止", "-300": "服务器异常" }, TUpCodeBase_NB: PAGE_PATHS.U + "/static/install/115upload_" + PAGE_UPLOAD_OCX_VERSION.WIN + ".cab", TUpDownloadUrl_np: PAGE_PATHS.U + "/static/install/115upload_" + PAGE_UPLOAD_OCX_VERSION.WIN + ".exe", TUpDownloadUrl_np_mac: PAGE_PATHS.U + "/static/install/115upload_" + PAGE_UPLOAD_OCX_VERSION.MAC + ".dmg", TUpDownloadUrl_np_unix: PAGE_PATHS.U + "/static/install/115upload_" + PAGE_UPLOAD_OCX_VERSION.UNIX + "_x64.tar.gz", TUpDownloadUrl_np_unix_32: PAGE_PATHS.U + "/static/install/115upload_" + PAGE_UPLOAD_OCX_VERSION.UNIX + "_x86.tar.gz", TUpClassID_NB: "clsid:CC98CADB-E94C-4240-9723-3E0707271E17", TUpSp: "0", TUpDomId: "js_ocx_control_object", TUpFFVersion: "", TUpMacVersion: "", TUpUnixVersion: "", TUpTestVersion: { }, TUploadServer: "", TDeleteServer: "", TSelectCount: 20, TUpRefashFreq: 50, TUpIsProxy: 0, TUpReTryCount: 15, TUpSleepTime: 2, OpenUpDir: [1, 2, 3, 4, 9, 49] });
(function(config) {
    for (var k in config) {
        Core.CONFIG[k] = config[k]
    }
})({ Reader: { URL: "static/paper/File.swf?v=3.3", PPTURL: "static/paper/PPT.swf?v=3.3", ID: "js_flash_reader_main" }, DebugKey: false, TUpDebugKey: false, TUpDebugTime: 0, ThemeKey: "classic", ThemeLink: "js_theme_link", ThemeURL: "/static/themes/%1/css/frame_main.css", CommonHead: "/static/common/css/frame_header.css", ImterimShareKey: false, ImterimShareMsg: "", OpenMeituKey: false, QFileAPI: null, NotUpCanDo: ["delete", "q_delete", "upload", "adddir", "reupload", "fl_delete"], SpacilDir: [35, 36, 22, 49], ChangeTopDir: [5], BaseDir: [1, 2, 3, 4, 5, 9], InDiskDir: [-4, -3, 1, 2, 3, 4, 5, 9, 22, 49, 35, 36], IsSeaDir: [-3, -4], ICOType: { "1_0": "i-file", "2_0": "i-document", "3_0": "i-photo", "4_0": "i-music", "9_0": "i-video", "5_0": "i-file", "21_0": "i-folder", "22_0": "i-sync", "-2_0": "i-transfer", share: "i-shared-folder", Default: "i-folder" }, FileICOMod: 0, FileListMod: "view", FileDownload: "#js_download_list_box", MusicPlay: "#js_jplay_box", SWFPath: { PhotoView: "static/photo/v3/YViewer.swf", SWF_LoadImg: PAGE_PATHS.U + "/static/photo/v3/loading.gif" }, CssPath: { Play: "static/common/css/music_player.css?v=2" }, EditPath: "static/editor/editor.php?charset=utf-8&allowhtml=1&domain=" + encodeURIComponent(window.PAGE_DOMAIN_ROOT), EditTextArea: "js_ttHtmlEditor", IsLogin: false, Main: "#main", DefaultTitle: "115, 我的网盘", MinStatus: "#min_status", StockStatus: "#stock_status" });
Core.FloatMenuConfig = { right_q_file: { q_open_dir: { text: "打开文件夹" }, view: { text: "预览", ico: "preview" }, download: { text: "下载" }, listen: { text: "试听", ico: "listen" }, add_listen: { text: "加入播放列表", ico: "playlist" }, q_permission: { text: "设置权限" }, q_move: { text: "转存", ico: "move" }, q_move_to: { text: "移动" }, q_edit_name: { text: "重命名", ico: "rename" }, q_delete: { text: "删除" } }, right_file: { listen: { text: "试听", ico: "listen" }, add_listen: { text: "加入播放列表", ico: "playlist" }, br1: { isline: true }, magic: { text: "美化" }, cover: { text: "修改封面" }, del_cover: { text: "删除封面" }, move: { text: "移动" }, edit_name: { text: "重命名", ico: "rename" }, edit: { text: "备注", ico: "remark" }, "delete": { text: "删除" } }, more_btn: { view: { text: "打开" }, open_dir: { text: "打开" }, shareto: { text: "分享给好友", ico: "share" }, download: { text: "下载" }, download_dir: { text: "下载文件夹", ico: "download" }, gift: { text: "制作成网盘礼包", ico: "spree" }, share_file: { text: "推送至分享空间" }, cancelshare: { text: "从分享空间取出", ico: "share-cancel" }, listen: { text: "试听", ico: "listen" }, add_listen: { text: "加入播放列表", ico: "playlist" }, br1: { isline: true }, magic: { text: "美化" }, cover: { text: "修改封面" }, del_cover: { text: "删除封面" }, move: { text: "移动" }, edit_name: { text: "重命名", ico: "rename" }, edit: { text: "备注", ico: "remark" }, "delete": { text: "删除" } }, filter_btn: { a_file_name: { text: "按文件名倒序" }, d_file_name: { text: "按文件名顺序" }, a_user_ptime: { text: "时间从新到旧" }, d_user_ptime: { text: "时间从旧到新" }, a_file_size: { text: "文件从大到小" }, d_file_size: { text: "文件从小到大" } }, more_q_btn: { q_open_dir: { text: "打开文件夹" }, view: { text: "预览", ico: "preview" }, listen: { text: "试听", ico: "listen" }, add_listen: { text: "加入播放列表", ico: "playlist" }, q_permission: { text: "设置权限" }, q_move: { text: "转存", ico: "move" }, q_move_to: { text: "移动" }, q_edit_name: { text: "重命名", ico: "rename" }, q_delete: { text: "删除" } }, up_setting: { flash: { text: "普通上传", ico: "done" }, ocx1: { text: "电信极速上传", ico: "done" }, ocx2: { text: "联通极速上传", ico: "done" } } };
Core.FileConfig = { aid: -1, cid: -1, DataAPI: false, OPTPermission: { onemusic: ["star", "gift", "edit", "listen", "add_listen", "edit_name", "download", "send", "copy", "move", "delete", "play", "q", "shareto", "mail", "mobile"], onephoto: ["star", "gift", "edit", "edit_name", "download", "send", "copy", "move", "delete", "view", "q", "shareto", "mail", "mobile", "magic"], onemovie: ["star", "gift", "edit", "edit_name", "download", "send", "copy", "move", "delete", "q", "view", "shareto", "mail", "mobile"], onedocument: ["star", "gift", "edit", "edit_name", "download", "send", "copy", "move", "delete", "view", "weibo", "q", "shareto", "mail", "mobile"], onefile: ["star", "gift", "edit", "edit_name", "download", "send", "copy", "move", "delete", "weibo", "q", "view", "shareto", "mail", "mobile"], onefolder: ["open_dir", "gift", "download_dir", "delete", "shareto", "send", "edit_name", "move"], offonefolder: ["move", "delete"], onefoldercover: ["cover"], onefolderdelcover: ["del_cover"], onesharefolder: ["weibo"], share: ["cancelshare", "copylink", "shareto"], renew: ["renew"], cancelshare: ["shareto", "share_file"], sharefile: ["unloading", "cancelunloading"], is_q: ["cancel_q"], lock: ["privacy"], movefolder: ["move"], fewmusic: ["star", "gift", "copy", "listen", "add_listen", "send", "move", "delete", "play", "shareto", "q", "mail", "mobile"], fewphoto: ["star", "gift", "copy", "send", "move", "delete", "shareto", "q", "mail", "mobile"], fewmovie: ["star", "gift", "copy", "send", "move", "delete", "shareto", "q", "mail", "mobile"], fewfile: ["star", "gift", "copy", "send", "move", "delete", "shareto", "q", "weibo", "mail", "mobile"], fewfolder: ["shareto", "gift", "delete", "move"], offfewfolder: ["delete"], fewfandfl: ["delete", "move", "gift"], onekey: ["onekeyrenew"], rb: ["remove"], rbfile: ["rb_delete", "restore"], sentfile: ["exp_delete"], expfile: ["exp_delete", "exp_recv"], sync: ["sync_refresh"], syncfile: ["sync_delete"], q_onemusic: ["listen", "add_listen"], q_moremusic: ["listen", "add_listen"], q_onefile: ["view"], q_edit_file: ["q_edit_name"], q_onefolder: ["q_open_dir"], q_edit_dir: ["q_edit_name"], q_delete_file: ["q_delete"], q_delete_folder: ["q_delete"], q_save_file: ["q_move"], q_move_file: ["q_move_to"], q_manager: ["q_permission"], q_download: ["download"] }, Specil: { "-3": { edit: 1, edit_name: 1, "delete": 1, download: 1, copylink: 1, privacy: 1, cancelshare: 1, renew: 1, shareto: 1, move: 1 }, "5": { edit: 1, edit_name: 1, "delete": 1, download: 1 } } };
if ($.browser.msie) {
    Core.FileConfig.OPTPermission.fewmusic.push("download");
    Core.FileConfig.OPTPermission.fewphoto.push("download");
    Core.FileConfig.OPTPermission.fewmovie.push("download");
    Core.FileConfig.OPTPermission.fewfile.push("download")
}
Core.Setting = {
    Change: function(r, callback) {
        var data = { };
        for (var k in r) {
            data["key[" + k + "]"] = r[k]
        }
        $.ajax({
            url: "?ct=ajax_user&ac=set_user_config", type: "POST", dataType: "json", data: data,
            success: function(res) {
                if (res.state) {
                    if (Core.CONFIG.IsWindows) {
                        if (r.os_file_upload_type != undefined) {
                            if (r.os_file_upload_type == 0) {
                                Core.CONFIG.UpEngine = 0
                            } else {
                                Core.CONFIG.UpEngine = 1;
                                if (r.os_file_upload_type == 1) {
                                    Core.CONFIG.TUpSp = "0"
                                } else {
                                    Core.CONFIG.TUpSp = "1"
                                }
                            }
                        }
                    } else {
                        Core.CONFIG.UpEngine = 0
                    }
                }
                if (callback) {
                    callback(res)
                }
            }
        })
    }
};
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
        var getBox = function(statusType) { return statusType == 0 ? $(Core.CONFIG.StockStatus) : $(Core.CONFIG.MinStatus) };
        return {
            add: function(win) {
                if (win.Setting.is_not_min_title) {
                    return
                }
                var dom = $(String.formatmodel((win.StatusType == 0 ? _stockTemp : _minTemp), { key: win.Key, text: win.Setting.min_title }));
                dom.find("b").bind("click", function(e) {
                    if (!win.IsActive) {
                        win.Open()
                    } else {
                        win.Hide()
                    }
                    return false
                });
                if ($.browser.msie && $.browser.version == "6.0") {
                    dom.find("b").hover(function() { $(this).addClass("hover") }, function() { $(this).removeClass("hover") })
                }
                getBox(win.StatusType).append(dom);
                return dom
            },
            del: function(win) {
                var box = getBox(win.StatusType);
                box.find("[key='" + win.Key + "']").empty().remove()
            },
            active: function(win) {
                var box = getBox(win.StatusType);
                box.find("[key='" + win.Key + "'] b").removeClass("active").addClass("focus")
            },
            deactive: function(win) {
                var box = getBox(win.StatusType);
                box.find("[key='" + win.Key + "'] b").removeClass("focus")
            },
            alarm: function(win) {
                var box = getBox(win.StatusType);
                box.find("[key='" + win.Key + "'] b").addClass("active")
            }
        }
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
                        win.warp.offset({ left: mL + w - wW - Core.CONFIG.WinRightPX })
                    } else {
                        if ((wL + wW) > w) {
                            var newL = w - wW - 5;
                            if (newL < 0) {
                                wW = wW + newL;
                                newL = 0
                            }
                            if (!win.Setting.is_not_resize) {
                                if (wW < win.Setting.min_width) {
                                    wW = win.Setting.min_width
                                }
                                win.warp.width(wW)
                            }
                            win.warp.offset({ left: newL })
                        }
                        if ((wT + wH) > h) {
                            var newT = h - wH - 5;
                            if (newT < 0) {
                                wH = wH + newT;
                                newT = 0
                            }
                            if (!win.Setting.is_not_resize) {
                                if (wH < win.Setting.min_height) {
                                    wH = win.Setting.min_height
                                }
                                win.warp.height(wH)
                            }
                            win.warp.offset({ top: newT })
                        }
                    }
                }
            });
            _bindState = true
        }
    };
    var windowStatusChange = function() {
        for (var k in Core.WinHistory.ChangeDelegate) {
            try {
                if (Core.WinHistory.ChangeDelegate[k]) {
                    Core.WinHistory.ChangeDelegate[k](_list)
                }
            } catch(e) {
                Core.WinHistory.ChangeDelegate[k] = null;
                delete Core.WinHistory.ChangeDelegate[k]
            }
        }
    };
    return {
        ChangeDelegate: { }, GetList: function() { return _list },
        Add: function(win) {
            bindEvent();
            win.Key = win.Type + "_" + _random;
            _random++;
            _list[win.Key] = win;
            var dom = status.add(win);
            win.StatusDOM = dom;
            windowStatusChange()
        },
        Del: function(key) {
            if (_list[key]) {
                status.del(_list[key]);
                _list[key] = null;
                delete _list[key];
                windowStatusChange()
            }
        },
        GetIndex: function() { return _zIndex++ },
        LessIndex: function() { _zIndex-- },
        Active: function(win) {
            if (_old_active && _old_active == win.Key) {
                return
            }
            _zIndex++;
            win.Active(_zIndex);
            win.IsActive = true;
            if (_old_active && _list[_old_active]) {
                _list[_old_active].DeActive();
                _list[_old_active].IsActive = false;
                status.deactive(_list[_old_active])
            }
            status.active(win);
            _old_active = win.Key;
            windowStatusChange()
        },
        Alarm: function(win) { status.alarm(win) },
        DeOldActive: function() {
            if (_old_active && _list[_old_active]) {
                _list[_old_active].DeActive();
                _list[_old_active].IsActive = false;
                status.deactive(_list[_old_active]);
                _old_active = false
            }
        },
        DeActiveStatus: function(win) {
            Core.WinHistory.DeOldActive();
            status.deactive(win);
            _old_active = false;
            windowStatusChange()
        }
    }
})();
Core.WinTitle = (function() {
    var _temp = '<h2 class="dialog-title" rel="base_title"><span>{title}</span><div class="dialog-handle">{button}</div></h2>';
    var _btns = ['<a href="javascript:;" class="diag-minimize" btn="hide">最小化</a>', '<a href="javascript:;" class="diag-maximize" btn="max">最大化</a><a href="javascript:;" class="diag-return" style="display:none" btn="revert">还原</a>', '<a href="javascript:;" class="diag-close" btn="close">关闭</a>'];
    var bindEvents = function(box, win) {
        box.find("[btn]").mousedown(function(e) {
            Core.Html.StopPropagation(e);
            Core.WinHistory.Active(win)
        }).click(function(e) {
            win.SetButtonHandler($(this).attr("btn"));
            return false
        })
    };
    return {
        Get: function(win) {
            var html = _btns.join("");
            var box = $(String.formatmodel(_temp, { title: win.Setting.title, button: html }));
            bindEvents(box, win);
            return box
        }
    }
})();
Core.WindowBase = function(setting) {
    var _temp = '<div class="dialog-box" style="display:none;" id="{key}_warp">' + Core.Html.GetShadow() + '<div id="{key}_inner" style="height:100%;"></div>' + Core.Html.GetFullIFrame() + "</div>";
    var _resizeTemp = '<div resize="{resize_type}" style="position: absolute; overflow: hidden; background: url(static/js/transparent.gif) repeat scroll 0% 0% transparent; {css}"></div>';
    var _self = this;
    var _cache = { resize: { t: "left: 0; top: -3px; width: 100%; height: 5px; z-index: 1;", r: "right: -3px; top: 0; width: 5px; height: 100%; z-index: 1;", b: "left: 0; bottom: -3px; width: 100%; height: 5px; z-index: 1;", l: "left: -3px; top: 0; width: 5px; height: 100%; z-index: 1;", rt: "right: -3px; top: -3px; width: 10px; height: 10px; z-index: 2", rb: "right: -3px; bottom: -3px; width: 10px; height: 10px; z-index: 2", lt: "left: -3px; top: -3px; width: 10px; height: 10px; z-index: 2", lb: "left: -3px; bottom: -3px; width: 10px; height: 10px; z-index: 2" } };
    if (!setting) {
        setting = { }
    }
    if (!setting.content) {
        setting.content = ""
    }
    if (!setting.title) {
        setting.title = ""
    }
    if (!setting.min_title) {
        setting.min_title = "窗口"
    }
    this.warp;
    this.Type = "window";
    this.IsActive = false;
    this.StatusType = 0;
    if (setting.Status != undefined) {
        this.StatusType = setting.Status
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
            break
        }
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
                    l = _cache.resize_maxL
                } else {
                    l = l + xLess
                }
            }
            if (/r/.test(resizeType)) {
                w = w + xLess
            }
            if (/b/.test(resizeType)) {
                h = h + yLess
            }
            if (/t/.test(resizeType)) {
                h = h - yLess;
                if (h < _cache.resize.min_height) {
                    t = _cache.resize_maxT
                } else {
                    t = t + yLess
                }
            }
            if (w < _cache.resize.min_width) {
                w = _cache.resize.min_width
            }
            if (h < _cache.resize.min_height) {
                h = _cache.resize.min_height
            }
            if (t < _cache.resize_mt) {
                h = h - Math.abs(_cache.resize_mt - t);
                t = _cache.resize_mt
            }
            if ((t + h) > _cache.resize_mb) {
                h = _cache.resize_mb - t
            }
            if (l < _cache.resize_ml) {
                w = w - Math.abs(_cache.resize_ml - l);
                l = _cache.resize_ml
            }
            if ((l + w) > _cache.resize_mr) {
                w = _cache.resize_mr + l
            }
            _self.warp.css({ width: w + "px", height: h + "px", top: t + "px", left: l + "px" });
            if (_self.Setting.is_right) {
                _self.Setting.is_right = false
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
            _cache.resize_maxT = _cache.resize_top + _cache.resize_height - _cache.resize.min_height
        })
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
                        _cache.resize_list.push(ele)
                    }
                }
                if (!_self.Setting.is_not_title) {
                    _cache.title = Core.WinTitle.Get(_self);
                    inner.append(_cache.title)
                }
                inner.append(_self.Setting.content);
                if (_self.Setting.width != undefined) {
                    _self.warp.width(_self.Setting.width)
                }
                if (_self.Setting.height != undefined) {
                    _self.warp.height(_self.Setting.height)
                }
                var mainBox = _self.Main;
                mainBox.append(_self.warp);
                if (_self.warp.height() > mainBox.height()) {
                    _self.warp.height(mainBox.height())
                }
                if (_self.Setting.position) {
                    _self.warp.css(_self.Setting.position)
                } else {
                    Util.Layer.Center(_self.warp, { Main: mainBox })
                }
                Util.Mouse.MoveBox({
                    ClickBox: _cache.title ? _cache.title : _self.warp, Box: _self.warp, Outer: mainBox, Callback: function() { Core.WinHistory.Active(_self) },
                    MoveCallback: function() {
                        if (_self.Setting.is_right) {
                            _self.Setting.is_right = false
                        }
                    }
                });
                if (!_self.Setting.is_not_resize) {
                    _cache.title.bind("dblclick", function() {
                        if (!_self.MaxState) {
                            _self.Max()
                        } else {
                            _self.Revert()
                        }
                    })
                } else {
                    _cache.title && _cache.title.find("[btn='max']").empty().remove();
                    _cache.title && _cache.title.find("[btn='revert']").empty().remove()
                }
                if (_self.Setting.is_not_min_title) {
                    _cache.title && _cache.title.find(".win-minsize").empty().remove()
                }
                _self.warp.bind("mousedown", function(e) { Core.WinHistory.Active(_self) });
                if (_self.Setting.is_max_window) {
                    _self.Max()
                }
            }
            if (_self.Initial) {
                _self.Initial()
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
        _self.Open()
    };
    this.Revert = function() {
        _self.MaxState = false;
        var w = _cache.resize.min_width, h = _cache.resize.min_height, t = 0, l = 0;
        if (_cache.old_sq) {
            w = _cache.old_sq.w;
            h = _cache.old_sq.h;
            t = _cache.old_sq.t;
            l = _cache.old_sq.l
        }
        _self.warp.width(w).height(h).css({ top: t, left: l });
        setTitleBtn()
    };
    this.CreateDom = function() { create() };
    this.Hide = function() {
        _self.warp.hide();
        _self.DeActive();
        Core.WinHistory.DeActiveStatus(_self);
        _self.IsActive = false
    };
    this.Open = function() {
        create();
        _self.warp.show();
        Core.WinHistory.Active(_self)
    };
    var setTitleBtn = function() {
        if (_self.MaxState) {
            _cache.title.find("[btn='max']").hide();
            _cache.title.find("[btn='revert']").show();
            if (_cache.resize_list) {
                for (var i = 0, len = _cache.resize_list.length; i < len; i++) {
                    _cache.resize_list[i].hide()
                }
            }
        } else {
            _cache.title.find("[btn='revert']").hide();
            _cache.title.find("[btn='max']").show();
            if (_cache.resize_list) {
                for (var i = 0, len = _cache.resize_list.length; i < len; i++) {
                    _cache.resize_list[i].show()
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
            break
        }
    };
    this.Close = function() {
        Core.WinHistory.Del(_self.Key);
        _cache.initState = false;
        _self.warp && _self.warp.hide();
        _self.MaxState = false
    };
    this.Active = function(zIndex) { _self.warp.css({ zIndex: zIndex }).addClass(Core.CONFIG.ActiveClass) };
    this.DeActive = function() { _self.warp.removeClass(Core.CONFIG.ActiveClass) }
};
Core.DialogBase = function(settings) {
    var _temp = '<div class="dialog-box" style="display:none;z-index:1000000002">' + Core.Html.GetShadow() + '<h2 class="dialog-title" rel="title_box"><span rel="base_title"></span><div class="dialog-handle"><a href="javascript:;" class="diag-close" btn="close">关闭</a></div></h2><div rel="base_content"></div></div>';
    var _box, _cover, _timer, _self = this;
    var _settings = !settings ? { } : settings;
    this.Main = Core.ACTIVE.GetMain();
    var create = function(win) {
        if (!_self.warp) {
            _self.warp = $(_temp);
            if (_settings.width) {
                _self.warp.width(_settings.width)
            }
            $(document.body).append(_self.warp);
            _self.warp.find("[btn]").mousedown(function(e) {
                Core.Html.StopPropagation(e);
                return true
            });
            _self.warp.find("[btn]").click(function(e) {
                switch ($(this).attr("btn")) {
                case "close":
                    _self.Close();
                    break
                }
                return false
            });
            if (_settings.title) {
                _self.warp.find("[rel='base_title']").html(_settings.title)
            }
            if (_settings.content) {
                _self.warp.find("[rel='base_content']").append(_settings.content)
            }
            Util.Mouse.MoveBox({ ClickBox: _self.warp.find("[rel='title_box']"), Box: _self.warp, Outer: _self.Main });
            if (_self.Initial) {
                _self.Initial()
            }
        }
        if (!_cover) {
            _cover = $('<div style="z-index: 1000000001; display: none;background: none repeat scroll 0 0 #fff;_padding-top:40px;height: 100%;left: 0;position: absolute;top: 0;width: 100%;filter:alpha(opacity=0);-moz-opacity:0;opacity:0.0;"><div style="height:100%;width:100%;"></div></div>');
            $(document.body).append(_cover);
            _cover.bind("mousedown", function() {
                if (_timer) {
                    window.clearInterval(_timer)
                }
                _timer = window.setInterval(function() {
                    if (_timer_index % 2) {
                        _self.warp && _self.warp.addClass(Core.CONFIG.ActiveClass)
                    } else {
                        _self.warp && _self.warp.removeClass(Core.CONFIG.ActiveClass)
                    }
                    _timer_index++;
                    if (_timer_index > (Core.CONFIG.TwinkCount * 2 + 1)) {
                        _timer_index = 1;
                        if (_timer) {
                            window.clearInterval(_timer)
                        }
                    }
                }, Core.CONFIG.TwinkTime)
            });
            $(document).on("keydown", function(e) {
                if (e.keyCode == 27) {
                    if (_cover) {
                        _self.Close();
                        return false
                    }
                }
            })
        }
        Util.Layer.Center(_self.warp, { Main: win ? win.warp : false })
    };
    var _timer_index = 1;
    this.Open = function(calback, win) {
        create(win);
        if (calback) {
            calback()
        }
        _cover.show();
        _self.warp.addClass(Core.CONFIG.ActiveClass).show();
        _self.warp.find('[btn="close"]').focus().blur()
    };
    this.Close = function() {
        _cover && _cover.hide().remove();
        _self.warp && _self.warp.hide().remove();
        _cover = false;
        _self.warp = false
    }
};
Core.DataAccess = { };
Core.DataAccess.DataAPI = null;
Core.DataAccess.ScurityKey = "";
Core.DataAccess.DataAppAPI = null;
Core.DataAccess.DataUserAPI = null;
Core.DataAccess.DataMsgAPI = null;
Core.DataAccess.Bridge = (function() {
    var _doms = { }, _bridge = { file: Core.CONFIG.DABridgeURL, app: Core.CONFIG.DAAppBridgeURL, user: Core.CONFIG.DAUserBridgeURL, im: Core.CONFIG.DAIMBridgeURL, msg: Core.CONFIG.DAMsgBridgeURL, q: Core.CONFIG.DAQBridgeURL }, _par;
    return {
        ChangeBridge: function(type, url) { _bridge[type] = url },
        RemoveBridge: function(key) {
            if (_doms[key]) {
                $(_doms[key]).find("iframe").attr("src", "");
                $(_doms[key]).empty().remove();
                _doms[key] = null;
                delete _doms[key]
            }
        },
        Load: function(complete, key, namespace, api) {
            if (!_par) {
                _par = $('<div style="height:1px;overflow:hidden;position:absolute;width:1px;"></div>');
                $(document.body).append(_par)
            }
            var dom = _doms[key];
            if (!dom) {
                dom = $('<div style="height:1px;overflow:hidden;position:absolute;width:1px;"></div>');
                dom = document.createElement("iframe");
                dom.src = _bridge[key] + "?namespace=" + namespace + "&api=" + api + "&_t=v2";
                if ($.browser.msie) {
                    dom.onreadystatechange = (function() {
                        if (this.readyState == "complete") {
                            window.setTimeout(function() {
                                if (complete) {
                                    complete(dom)
                                }
                            }, 10)
                        }
                    })
                } else {
                    dom.onload = (function() {
                        window.setTimeout(function() {
                            if (complete) {
                                complete(dom)
                            }
                        }, 10)
                    })
                }
                _par.append(dom);
                _doms[key] = dom
            } else {
                window.setTimeout(function() {
                    if (complete) {
                        complete(dom)
                    }
                }, 10)
            }
        }
    }
})();
Core.DataAccess.Ajax = (function() {
    return {
        Send: function(setting) {
            Core.DataAccess.Bridge.Load(function() {
                setting.timeout = 10000;
                setting.onTimeout = function() {
                };
                setting.onError = function() { Core.DataAccess.Error.Throw({ message: "网络异常, 请刷新页面重试" }) };
                window.setTimeout(function() { Core.DataAccess.DataAPI.ajax(setting) }, 10)
            }, "file", "Core.DataAccess", "DataAPI")
        }
    }
})();
Core.DataAccess.QAjax = (function() {
    return {
        Send: function(setting) {
            Core.DataAccess.Bridge.Load(function(ifr) {
                try {
                    ifr.contentWindow.$.ajax(setting)
                } catch(e) {
                }
            }, "q", "Core.DataAccess", "DataAPI")
        }
    }
})();
Core.DataAccess.MsgAjax = (function() {
    var _sendState = false, _cache = [];
    var sendFirst = function() {
        if (_cache.length) {
            var setting = _cache[0];
            window.setTimeout(function() { Core.DataAccess.MsgAjax.Send(setting) }, 10);
            _cache.splice(0, 1)
        }
    };
    return {
        Send: function(setting) {
            if (_sendState) {
                _cache.push(setting)
            }
            _sendState = true;
            Core.DataAccess.Bridge.Load(function() {
                setting.onTimeout = function() {
                    _sendState = false;
                    sendFirst()
                };
                setting.onError = function() {
                    _sendState = false;
                    sendFirst()
                };
                var sucFun = setting.success;
                setting.success = function(r) {
                    _sendState = false;
                    sendFirst();
                    sucFun && sucFun(r)
                };
                Core.DataAccess.DataMsgAPI.ajax(setting)
            }, "msg", "Core.DataAccess", "DataMsgAPI")
        }
    }
})();
Core.DataAccess.AppAjax = (function() { return { Send: function(setting) { Core.DataAccess.Bridge.Load(function() { Core.DataAccess.DataAppAPI.ajax(setting) }, "app", "Core.DataAccess", "DataAppAPI") } } })();
Core.DataAccess.UserAjax = (function() { return { Send: function(setting) { Core.DataAccess.Bridge.Load(function() { Core.DataAccess.DataUserAPI.ajax(setting) }, "user", "Core.DataAccess", "DataUserAPI") } } })();
Core.DataAccess.Error = (function() { return { Throw: function(e) { (Core.MinMessage) && Core.MinMessage.Show({ text: e.message, type: "war", timeout: Core.CONFIG.MsgTimeout }) } } })();
Core.DataAccess.FileRead = (function() {
    var _errObj = { message: "网络异常，请刷新页面重试" }, _isLoadingList = false;
    var getList = function(url, data, callback, type) {
        if (!data.offset) {
            data.offset = 0
        }
        if (!data.limit) {
            data.limit = 30
        }
        if (!data.source) {
            data.source = ""
        }
        if (!data.format) {
            data.format = "json"
        }
        (Core.MinMessage) && Core.MinMessage.Show({ text: "正在读取文件...", type: "load", timeout: 10000 });
        Core.DataAccess.Ajax.Send({
            url: url, type: type ? type : "GET", data: data,
            success: function(r) {
                (Core.MinMessage) && Core.MinMessage.Hide();
                try {
                    r = eval("(" + r + ")");
                    if (r.state === false) {
                        Core.DataAccess.Error.Throw({ message: r.error });
                        return
                    }
                    callback && callback(r)
                } catch(e) {
                    Core.DataAccess.Error.Throw(_errObj);
                    Core.Debug.write("msg:" + r + " error:" + e.message)
                }
            }
        })
    };
    return {
        GetClassList: function(data, callback) { getList("/lists", data, callback) }, IsLoadingList: function() { return _isLoadingList },
        GetQFileList: function(data, callback) {
            _isLoadingList = true;
            getList("/qfiles", data, function(r) {
                _isLoadingList = false;
                if (!r.path) {
                    r.path = [{ name: "圈子共享", aid: 999, qid: 0, cid: 0 }]
                }
                callback && callback(r)
            }, "POST")
        },
        SearchQFile: function(data, callback) {
            _isLoadingList = true;
            getList("/files/qsearch", data, function(r) {
                _isLoadingList = false;
                callback && callback(r)
            }, "POST")
        },
        GetFileList: function(data, callback) {
            _isLoadingList = true;
            getList("/files", data, function(r) {
                _isLoadingList = false;
                if (!r.path) {
                    r.path = [{ name: "网盘", aid: 1, cid: 0, pid: 0 }];
                    r.aid = 1;
                    r.cid = 0;
                    data.aid = 1;
                    data.cid = 0
                }
                callback && callback(r)
            })
        },
        GetQRBList: function(data, callback) {
            _isLoadingList = true;
            getList("/files/qrb", data, function(r) {
                _isLoadingList = false;
                callback && callback(r)
            })
        },
        GetQFileDetail: function(file_id, qid, callback) {
            Core.DataAccess.Ajax.Send({
                url: "/files/qdesc", type: "GET", data: { file_id: file_id, qid: qid, format: "json" },
                success: function(r) {
                    try {
                        r = eval("(" + r + ")");
                        if (r.state === false) {
                            Core.DataAccess.Error.Throw({ message: r.error });
                            return
                        }
                        callback && callback(r)
                    } catch(e) {
                        Core.DataAccess.Error.Throw(_errObj);
                        Core.Debug.write("msg:" + r + " error:" + e.message)
                    }
                }
            })
        },
        GetFileDetail: function(file_id, callback) {
            Core.DataAccess.Ajax.Send({
                url: "/files/desc", type: "GET", data: { file_id: file_id, format: "json" },
                success: function(r) {
                    try {
                        r = eval("(" + r + ")");
                        if (r.state === false) {
                            Core.DataAccess.Error.Throw({ message: r.error });
                            return
                        }
                        callback && callback(r)
                    } catch(e) {
                        Core.DataAccess.Error.Throw(_errObj);
                        Core.Debug.write("msg:" + r + " error:" + e.message)
                    }
                }
            })
        },
        GetFilePass: function(file_id, callback) {
            Core.DataAccess.Ajax.Send({
                url: "/files/desc", type: "GET", data: { file_id: file_id, field: "pass", format: "json" },
                success: function(r) {
                    try {
                        r = eval("(" + r + ")");
                        if (r.state === false) {
                            Core.DataAccess.Error.Throw({ message: r.error });
                            return
                        }
                        callback && callback(r)
                    } catch(e) {
                        Core.DataAccess.Error.Throw(_errObj);
                        Core.Debug.write("msg:" + r + " error:" + e.message)
                    }
                }
            })
        },
        Search: function(data, callback) { getList("/files/search", data, callback) },
        CheckSame: function(data, callback) {
            Core.DataAccess.Ajax.Send({
                url: "/files/del_repeat", type: "GET", data: data,
                success: function(r) {
                    try {
                        r = eval("(" + r + ")");
                        callback && callback(r)
                    } catch(e) {
                        Core.DataAccess.Error.Throw(_errObj);
                        Core.Debug.write("msg:" + r + " error:" + e.message)
                    }
                }
            })
        },
        Same: function(data, callback) { getList("/files/del_repeat", data, callback) },
        GetActiveDate: function(y, m, callback) {
            Core.DataAccess.Ajax.Send({
                url: "/files/curmonth", type: "GET", data: { month: y + "-" + m },
                success: function(r) {
                    try {
                        r = eval("(" + r + ")");
                        if (r.state === false) {
                            Core.DataAccess.Error.Throw({ message: r.error });
                            return
                        }
                        callback && callback(y, m, r)
                    } catch(e) {
                        Core.DataAccess.Error.Throw(_errObj);
                        Core.Debug.write("msg:" + r + " error:" + e.message)
                    }
                }
            })
        },
        GetReport: function(data, callback) {
            if (!data.offset) {
                data.offset = 0
            }
            if (!data.limit) {
                data.limit = 30
            }
            (Core.MinMessage) && Core.MinMessage.Show({ text: "正在读取文件...", type: "load", timeout: 10000 });
            Core.DataAccess.Ajax.Send({
                url: "/files/del_repeat", type: "GET", data: data,
                success: function(r) {
                    (Core.MinMessage) && Core.MinMessage.Hide();
                    try {
                        r = eval("(" + r + ")");
                        if (r.state === false) {
                            Core.DataAccess.Error.Throw({ message: r.error });
                            return
                        }
                        callback && callback(r)
                    } catch(e) {
                        Core.DataAccess.Error.Throw(_errObj);
                        Core.Debug.write("msg:" + r + " error:" + e.message)
                    }
                }
            })
        },
        RB: function(data, callback) { getList("/rb", data, callback) },
        GetInfoBySha1: function(sha1, callback) {
            Core.DataAccess.Ajax.Send({
                url: "/files/shasearch", type: "GET", data: { sha1: sha1 },
                success: function(r) {
                    try {
                        r = eval("(" + r + ")");
                        callback && callback(r)
                    } catch(e) {
                        Core.DataAccess.Error.Throw(_errObj);
                        Core.Debug.write("msg:" + r + " error:" + e.message)
                    }
                }
            })
        },
        GetQFiles: function(data, callback) {
            (Core.MinMessage) && Core.MinMessage.Show({ text: "正在读取文件...", type: "load", timeout: 10000 });
            Core.DataAccess.Ajax.Send({
                url: "/qfiles", type: "POST", data: data,
                success: function(r) {
                    (Core.MinMessage) && Core.MinMessage.Hide();
                    try {
                        r = eval("(" + r + ")");
                        if (r.state === false) {
                            Core.DataAccess.Error.Throw({ message: r.error });
                            return
                        }
                        callback && callback(r)
                    } catch(e) {
                        Core.DataAccess.Error.Throw(_errObj);
                        Core.Debug.write("msg:" + r + " error:" + e.message)
                    }
                }
            })
        }
    }
})();
Core.DataAccess.Dir = (function() {
    var _errObj = { message: "网络异常，请刷新页面重试" };
    return {
        GetAll: function(callback) {
            Core.DataAccess.Ajax.Send({
                url: "/category", type: "GET",
                success: function(r) {
                    try {
                        r = eval("(" + r + ")");
                        callback && callback(r)
                    } catch(e) {
                        Core.DataAccess.Error.Throw(_errObj);
                        Core.Debug.write("msg:" + r + " error:" + e.message)
                    }
                }
            })
        },
        GetQDetail: function(aid, cid, qid, callback) {
            if (Core.DataAccess.FileRead.IsLoadingList()) {
                return
            }
            if (cid == undefined) {
                cid = 0
            }
            Core.DataAccess.Ajax.Send({
                url: "/category/qget", type: "GET", data: { aid: aid, cid: cid, qid: qid },
                success: function(r) {
                    try {
                        r = eval("(" + r + ")");
                        callback && callback(r)
                    } catch(e) {
                        Core.DataAccess.Error.Throw(_errObj);
                        Core.Debug.write("msg:" + r + " error:" + e.message)
                    }
                }
            })
        },
        GetDetail: function(aid, cid, callback) {
            if (Core.DataAccess.FileRead.IsLoadingList()) {
                return
            }
            if (cid == undefined) {
                cid = 0
            }
            Core.DataAccess.Ajax.Send({
                url: "/category/get", type: "GET", data: { aid: aid, cid: cid },
                success: function(r) {
                    try {
                        r = eval("(" + r + ")");
                        callback && callback(r)
                    } catch(e) {
                        Core.DataAccess.Error.Throw(_errObj);
                        Core.Debug.write("msg:" + r + " error:" + e.message)
                    }
                }
            })
        },
        Stat: function(callback) {
            Core.DataAccess.Ajax.Send({
                url: "/stat", type: "GET",
                success: function(r) {
                    try {
                        r = eval("(" + r + ")");
                        callback && callback(r)
                    } catch(e) {
                        Core.DataAccess.Error.Throw(_errObj);
                        Core.Debug.write("msg:" + r + " error:" + e.message)
                    }
                }
            })
        }
    }
})();
Core.DataAccess.App = (function() {
    var _MyApps = { }, _clientList = { }, _isLoadAll = false;
    var doChange = function(position) {
        var list = _MyApps[Number(position)];
        if (list) {
            for (var k in _clientList) {
                try {
                    var item = _clientList[k];
                    item && item.Change(list, position)
                } catch(e) {
                    _clientList[k] = false
                }
            }
        }
    };
    var delUi = function(appids) {
        var changeList = { };
        for (var k in _MyApps) {
            var item = _MyApps[k];
            var newArr = [];
            for (var i = 0, len = item.length; i < len; i++) {
                var node = item[i];
                if ($.inArray(Number(node.app_id), appids) == -1) {
                    newArr.push(node)
                } else {
                    changeList[k] = 1
                }
            }
            if (changeList[k]) {
                _MyApps[k] = newArr
            }
        }
        for (var k in changeList) {
            doChange(k)
        }
    };
    return {
        GetPutApp: function(callback) {
            var url = "/?ct=app&ac=ajax_get_put_app";
            Core.DataAccess.AppAjax.Send({
                url: url, type: "GET",
                success: function(r) {
                    r = eval("(" + r + ")");
                    callback && callback(r)
                }
            })
        },
        AddClient: function(key, delegate) { _clientList[key] = delegate },
        Search: function(v) {
            var reg = new RegExp(v);
            var res = [];
            for (var k in _MyApps) {
                var item = _MyApps[k];
                for (var i = 0, len = item.length; i < len; i++) {
                    var node = item[i];
                    if (reg.test(node.name)) {
                        res.push(node)
                    }
                }
            }
            return res
        },
        GetMyApps: function(position, callback, is_update) {
            var url = "/?ct=app&ac=ajax_my_apps";
            if (position !== false) {
                url += "&dotype=" + (position + 4)
            } else {
                if (_isLoadAll && !is_update) {
                    for (var k in _MyApps) {
                        doChange(Number(k))
                    }
                    return
                }
                _isLoadAll = true
            }
            if (!is_update && _MyApps[Number(position)]) {
                doChange(position);
                return
            }
            Core.DataAccess.AppAjax.Send({
                url: url, type: "GET",
                success: function(r) {
                    try {
                        r = eval("(" + r + ")");
                        if (position === false) {
                            for (var i = 0, len = r.length; i < len; i++) {
                                var item = r[i];
                                var desk = Number(item.add_position) - 4;
                                if (!_MyApps[desk]) {
                                    _MyApps[desk] = []
                                }
                                _MyApps[desk].push(item)
                            }
                        } else {
                            _MyApps[Number(position)] = r;
                            doChange(position)
                        }
                        callback && callback(r)
                    } catch(e) {
                        Core.DataAccess.Error.Throw(e)
                    }
                }
            })
        },
        DeleteUI: function(appids) { delUi(appids) },
        DeleteApps: function(appids, callback) {
            if (typeof appids != "object") {
                appids = [appids]
            }
            if (appids.length) {
                var url = "/?ct=app&ac=ajax_remove_app&app_id=" + appids.join(",");
                Core.DataAccess.AppAjax.Send({
                    url: url, type: "GET",
                    success: function(r) {
                        try {
                            r = eval("(" + r + ")");
                            if (r.state) {
                                delUi(appids);
                                callback && callback(r)
                            } else {
                                Core.MinMessage.Show({ text: "卸载失败", type: "err", timeout: Core.CONFIG.MsgTimeout })
                            }
                        } catch(e) {
                        }
                    }
                })
            }
        },
        MoveApp: function(appid, old_position, new_position, callback) {
            var url = "/?ct=app&ac=ajax_app2desktop&app_id=" + appid + "&dotype=" + new_position;
            Core.DataAccess.AppAjax.Send({
                url: url, type: "GET",
                success: function(r) {
                    try {
                        r = eval("(" + r + ")");
                        if (r.state) {
                            var oldInd = -1;
                            new_position = new_position - 4;
                            var oldData = _MyApps[Number(old_position)], newData = _MyApps[Number(new_position)];
                            if (oldData && oldData.length) {
                                for (var i = 0, len = oldData.length; i < len; i++) {
                                    var item = oldData[i];
                                    if (Number(item.app_id) == Number(appid)) {
                                        oldInd = i;
                                        break
                                    }
                                }
                            }
                            if (oldInd != -1) {
                                _MyApps[Number(new_position)].push(oldData[oldInd]);
                                _MyApps[Number(old_position)].splice(oldInd, 1)
                            }
                            doChange(Number(old_position));
                            doChange(Number(new_position))
                        }
                        callback && callback(r)
                    } catch(e) {
                        Core.DataAccess.Error.Throw(e)
                    }
                }
            })
        }
    }
})();
Core.DataAccess.OffLine = (function() {
    return {
        GetProcess: function(tkids, callback) {
            $.ajax({
                url: "?ct=offline&ac=process&tkid=" + tkids.join(","), type: "GET", dataType: "json",
                success: function(r) {
                    if (r.state) {
                        callback && callback(r)
                    }
                }
            })
        },
        GetFileList: function(setting, callback) {
            if (!setting) {
                setting = { }
            }
            if (!setting.offset) {
                setting.offset = 0
            }
            (Core.MinMessage) && Core.MinMessage.Show({ text: "正在读取任务...", type: "load", timeout: 10000 });
            $.ajax({
                url: "?ct=offline&ac=list_task&offset=" + setting.offset, type: "GET", cache: false, dataType: "json",
                success: function(r) {
                    (Core.MinMessage) && Core.MinMessage.Hide();
                    if (r.state === false) {
                        Core.DataAccess.Error.Throw({ message: r.error })
                    } else {
                        callback && callback(r)
                    }
                }
            })
        },
        Add: function(params, callback) { $.ajax({ url: "?ct=offline&ac=add_task", data: params, dataType: "json", type: "POST", success: function(r) { callback && callback(r) } }) },
        GetSpace: function(callback) { $.ajax({ url: "?ct=offline&ac=space", dataType: "json", type: "GET", cache: false, success: function(r) { callback && callback(r) } }) },
        CheckURL: function(path, params, callback) {
            var ajaxUrl = params.url;
            var data = { url: encodeURIComponent(path), time: params.time, sign: params.sign, uid: window.USER_ID, js_return: "OFF_API_CHECK_DATA" };
            ajaxUrl += "?";
            var parArr = [];
            for (var k in data) {
                parArr.push(k + "=" + data[k])
            }
            ajaxUrl += parArr.join("&");
            $.getScript(ajaxUrl, function() {
                try {
                    var r = window[data.js_return];
                    callback && callback(r);
                    window[data.js_return] = null
                } catch(e) {
                    Core.DataAccess.Error.Throw({ message: "网络异常，请刷新页面重试" });
                    Core.Debug.write("msg:" + r + " error:" + e.message)
                }
            })
        },
        Move: function(data, callback) { $.ajax({ url: "/?ct=offline&ac=move", type: "POST", data: data, dataType: "json", success: function(r) { callback && callback(r) } }) },
        Command: function(opt, callback) {
            var url = "?ct=offline&ac=" + opt.type + "_task";
            if (typeof opt.tkids != "object") {
                opt.tkids = [opt.tkids]
            }
            var data = { };
            for (var i = 0, len = opt.tkids.length; i < len; i++) {
                data["tkid[" + i + "]"] = opt.tkids[i]
            }
            $.ajax({ url: url, data: data, type: "POST", dataType: "json", success: function(r) { callback && callback(r) } })
        }
    }
})();
(function() {
    Core.DataAccess.IMAPI = null;
    var imif = Core.DataAccess.IMIF = (function() {
        return {
            Run: function(funName) {
                var arg = arguments;
                var params = [];
                if (arg.length > 1) {
                    for (var i = 1, len = arg.length; i < len; i++) {
                        params.push("arg[" + i + "]")
                    }
                }
                Core.DataAccess.Bridge.Load(function() {
                    if (Core.DataAccess.IMAPI && Core.DataAccess.IMAPI[funName]) {
                        if (imif.SuccessCallback) {
                            imif.SuccessCallback()
                        }
                        try {
                            eval("var res = Core.DataAccess.IMAPI." + funName + "(" + params.join(",") + ")")
                        } catch(e) {
                            var msg = "网络异常，请稍候重试";
                            if (imif.ErrorCallback) {
                                imif.ErrorCallback(msg)
                            } else {
                                Core.DataAccess.Error.Throw({ message: msg })
                            }
                        }
                    } else {
                        var msg = "网络异常，请稍候重试";
                        if (imif.ErrorCallback) {
                            imif.ErrorCallback(msg)
                        } else {
                            Core.DataAccess.Error.Throw({ message: msg })
                        }
                    }
                }, "im", "Core.DataAccess", "IMAPI")
            },
            Kill: function() { Core.DataAccess.IMAPI = null }
        }
    })()
})();
Core.API = { };
(function() {
    var im = Core.API.IM = (function() {
        var _cache = { clients: { }, is_connect: false, recon_count: 0, recon_times: 3 };
        var reconnect = function(msg) {
            _cache.is_connect = false;
            Core.CONFIG.DAIMBridgeURL = false;
            if (_cache.recon_count < _cache.recon_times) {
                _cache.recon_count++;
                if (_cache.is_signin_again) {
                    return
                }
                window.setTimeout(function() { connect() }, 100)
            } else {
                if (!msg) {
                    msg = "网络异常，暂无法建立通信连接"
                }
                Core.Message.Confirm({
                    text: msg, type: "war", confirm_text: "马上重连",
                    callback: function(r) {
                        if (r) {
                            _cache.recon_count = 0;
                            connect()
                        }
                    }
                })
            }
        };
        var tryConnect = function(msg) {
            if (_cache.recon_count < _cache.recon_times) {
                _cache.recon_count++;
                if (_cache.is_signin_again) {
                    return
                }
                var timeOut = 1000;
                if (_cache.recon_count < 2) {
                    timeOut = 3000
                }
                window.setTimeout(function() {
                    _cache.is_connect = false;
                    Core.CONFIG.DAIMBridgeURL = false;
                    connect()
                }, timeOut)
            } else {
                _cache.recon_count = 0;
                Core.MinMessage.Show({ text: msg, type: "war", timeout: 2000 })
            }
        };
        var sucConnect = function() { _cache.recon_count = 0 };
        var msgDeal = (function() {
            var notiStruct = { "2t": "signin_again", "2u": "signout", "5m": "add_friend", "5n": "del_friend", "5o": "friend_status", "8e": "group_add_friend", "8f": "group_del_friend", "8g": "group_friend_status", dx: "reconnect", dy: "notify" };
            var getT = function(id) {
                var spec_sign = ["Q", "G", "T"];
                var new_id = String(id);
                var sign = new_id.substr(0, 1);
                var ind = $.inArray(sign, spec_sign);
                if (ind != -1) {
                    return spec_sign[ind]
                } else {
                    return -1
                }
            };
            return {
                compress_id: function(id) {
                    var spec_sign = ["Q", "G", "T"];
                    var new_id = String(id);
                    var sign = new_id.substr(0, 1);
                    if ($.inArray(sign, spec_sign) != -1) {
                        var new_id = Number(new_id.substr(1));
                        return isNaN(new_id) ? id : sign + new_id.toString(36)
                    } else {
                        var new_id = Number(new_id);
                        return isNaN(new_id) ? id : new_id.toString(36)
                    }
                },
                decompress_id: function(id) {
                    var spec_sign = ["Q", "G", "T"];
                    var new_id = String(id);
                    var sign = new_id.substr(0, 1);
                    if ($.inArray(sign, spec_sign) != -1) {
                        var new_id = parseInt(new_id.substr(1), 36);
                        return isNaN(new_id) ? id : sign + new_id
                    } else {
                        var new_id = parseInt(new_id, 36);
                        return isNaN(new_id) ? id : new_id
                    }
                },
                ex_noti: function(item) {
                    if (item.mt == "n" && notiStruct[item.t]) {
                        item.t = notiStruct[item.t];
                        if (item.fr && !item.friends) {
                            var arr = item.fr.split(",");
                            if (arr.length) {
                                item.friends = [];
                                for (var i = 0, len = arr.length; i < len; i++) {
                                    var fid = arr[i];
                                    item.friends.push(msgDeal.decompress_id(fid))
                                }
                            }
                        }
                        if (item.id) {
                            if (getT(item.id) == "Q") {
                                item.qid = msgDeal.decompress_id(item.id)
                            } else {
                                item.id = msgDeal.decompress_id(item.id)
                            }
                        }
                    }
                }
            }
        })();
        var recv = function() {
            if (_cache.clients) {
                var item = { mt: "n", t: "open" };
                for (var k in _cache.clients) {
                    try {
                        var clients = _cache.clients[k];
                        clients.Receive(item)
                    } catch(e) {
                    }
                }
            }
            Core.DataAccess.IMIF.Run("Recv", _cache.session_id, function(data) {
                for (var i = 0, len = data.length; i < len; i++) {
                    var item = data[i];
                    switch (item.mt) {
                    case "t":
                        if (item.fid && item.fid.toString().charAt(0) == "A") {
                            var fArr = item.fid.split(".");
                            item.fid = msgDeal.decompress_id(fArr[1]);
                            item.qid = msgDeal.decompress_id(fArr[0].substring(1, fArr[0].length))
                        } else {
                            item.fid = msgDeal.decompress_id(item.fid)
                        }
                        item.tid = msgDeal.decompress_id(item.tid);
                        item.ft = parseInt(item.ft, 36);
                        var clients = _cache.clients[item.tt];
                        if (clients) {
                            try {
                                clients.Receive(item)
                            } catch(e) {
                            }
                        }
                        break;
                    case "n":
                        msgDeal.ex_noti(item);
                        switch (item.t) {
                        case "signin_again":
                            _cache.is_signin_again = true;
                            _cache.recon_count = _cache.recon_times;
                            try {
                                Core.DataAccess.IMIF.Run("Kill")
                            } catch(e) {
                            }
                            _cache.is_connect = false;
                            Core.CONFIG.DAIMBridgeURL = false;
                            if (_cache.clients) {
                                for (var k in _cache.clients) {
                                    try {
                                        var clients = _cache.clients[k];
                                        clients.Receive(item)
                                    } catch(e) {
                                    }
                                }
                            }
                            return;
                        case "notify":
                            item.tt = 1;
                            var clients = _cache.clients[item.tt];
                            if (clients) {
                                try {
                                    clients.Receive(item)
                                } catch(e) {
                                }
                            }
                            break;
                        case "del_friend":
                        case "add_friend":
                            item.tt = 1;
                            var clients = _cache.clients[item.tt];
                            if (clients) {
                                try {
                                    clients.Receive(item)
                                } catch(e) {
                                    alert(e)
                                }
                            }
                            break;
                        case "friend_status":
                            item.tt = 1;
                            var clients = _cache.clients[item.tt];
                            if (clients) {
                                try {
                                    clients.Receive(item)
                                } catch(e) {
                                }
                            }
                            break;
                        case "group_friend_status":
                        case "group_add_friend":
                        case "group_del_friend":
                            item.tt = 2;
                            var clients = _cache.clients[item.tt];
                            if (clients) {
                                try {
                                    clients.Receive(item)
                                } catch(e) {
                                }
                            }
                            break;
                        case "reconnect":
                            try {
                                Core.DataAccess.IMIF.Run("Kill")
                            } catch(e) {
                            }
                            _cache.is_connect = false;
                            Core.CONFIG.DAIMBridgeURL = false;
                            connect();
                            break;
                        default:
                            break
                        }
                        break
                    }
                }
            }, function(status) {
                if (status == 408) {
                    reconnect()
                } else {
                    tryConnect("网络异常，暂无法建立通信连接")
                }
            })
        };
        var _cache_callback = [];
        var connect = function(callback) {
            if ((!_cache.is_connect && !Core.CONFIG.DAIMBridgeURL) || _cache.is_signin_again) {
                callback && _cache_callback.push(callback);
                Core.DataAccess.IMIF.ErrorCallback = tryConnect;
                Core.DataAccess.IMIF.SuccessCallback = sucConnect;
                if (_cache.is_signin_again) {
                    _cache.is_signin_again = false;
                    _cache.recon_count = 0;
                    try {
                        Core.DataAccess.IMIF.Run("Kill")
                    } catch(e) {
                    }
                    _cache.is_connect = false;
                    Core.CONFIG.DAIMBridgeURL = false
                }
                _cache.is_connect = true;
                Core.DataAccess.MsgAjax.Send({
                    url: "/proapi/im.php?ac=signin", type: "GET",
                    success: function(r) {
                        r = eval("(" + r + ")");
                        if (r.session_id) {
                            window.onbeforeunload = function() {
                                Core.DataAccess.MsgAjax.Send({
                                    url: "/proapi/im.php?ac=signout", type: "GET", sync: false,
                                    success: function(r) {
                                    }
                                })
                            };
                            _cache.session_id = r.session_id;
                            var url = "http://" + r.server + "/chat/bridge";
                            Core.CONFIG.DAIMBridgeURL = url;
                            Core.DataAccess.Bridge.ChangeBridge("im", url);
                            Core.DataAccess.Bridge.RemoveBridge("im");
                            recv();
                            window.setTimeout(function() {
                                for (var i = 0, len = _cache_callback.length; i < len; i++) {
                                    _cache_callback[i] && _cache_callback[i]()
                                }
                                _cache_callback = []
                            }, 10)
                        } else {
                            tryConnect("网络异常，暂无法建立通信连接")
                        }
                    },
                    error: function() {
                        try {
                            Core.DataAccess.IMIF.Run("Kill")
                        } catch(e) {
                        }
                        _cache.is_connect = false;
                        Core.CONFIG.DAIMBridgeURL = false;
                        connect()
                    }
                })
            } else {
                callback && callback()
            }
        };
        var addClient = function(type, opt) {
            _cache.clients[type] = opt;
            connect(function() {
            })
        };
        return {
            Client: function(opt) { addClient(opt.type, opt) },
            RemoveClient: function(type) {
                if (_cache.clients[type]) {
                    _cache.clients[type] = null;
                    delete _cache.clients[type]
                }
            },
            Reconnect: function(callback) {
                _cache.is_signin_again = true;
                connect(callback)
            },
            GetSession: function(callback) { connect(function() { callback && callback(_cache.session_id) }) },
            MsgDeal: msgDeal
        }
    })()
})();
Core.API.Ajax = (function() {
    return {
        MoveQ: function(qid, pick_codes, is_talk, callback) {
            var data = { };
            data.qid = qid;
            data.type = is_talk ? is_talk : 0;
            for (var i = 0, len = pick_codes.length; i < len; i++) {
                data["pickcodes[" + i + "]"] = pick_codes[i]
            }
            $.ajax({
                url: "?ct=q&ac=move_q", data: data, type: "POST", dataType: "json",
                success: function(r) {
                    if (r.state) {
                        callback && callback(r.data)
                    } else {
                        Core.MinMessage.Show({ text: r.msg, type: "err", timeout: 2000 });
                        callback && callback(false, r.msg)
                    }
                }
            })
        },
        QCollect: function(opt) {
            var data = { qid: opt.qid, cid: opt.cid, aid: opt.aid, tid: opt.tid ? opt.tid : "", token: opt.token ? opt.token : "", time: opt.time ? opt.time : "" };
            if (!opt.pick_codes.length) {
                Core.MinMessage.Show({ text: "请先选择文件", type: "err", timeout: 2000 });
                opt.callback && opt.callback({ state: false, msg: "请先选择文件" });
                return
            }
            for (var i = 0, len = opt.pick_codes.length; i < len; i++) {
                data["pickcodes[" + i + "]"] = opt.pick_codes[i]
            }
            $.ajax({
                url: "?ct=ajax&ac=collect", type: "POST", data: data, dataType: "json",
                success: function(r) {
                    if (!r.state) {
                        Core.MinMessage.Show({ text: r.msg, type: "err", timeout: 2000 })
                    } else {
                        Core.FileResultDG.Show(r.data, { aid: data.aid, cid: data.cid })
                    }
                    opt.callback && opt.callback(r)
                }
            })
        }
    }
})();
Core.MinMessage = (function() {
    var _temp = '<div class="popup-hint" style="z-index:9999999999;"><i class="" rel="type"></i><em class="sl"><b></b></em><span rel="con"></span><em class="sr"><b></b></em></div>';
    var _cache = { Type: { suc: "hint-icon hint-suc-m", war: "hint-icon hint-war-m", err: "hint-icon hint-err-m", load: "hint-loader", inf: "hint-icon hint-inf-m" } }, _dom, _timer;
    var create = function(text, type) {
        if (!_dom) {
            _dom = $(String.format(_temp, text));
            $(document.body).append(_dom)
        }
        _dom.find("[rel='con']").html(text);
        var icon = _dom.find("[rel='type']");
        for (var k in _cache.Type) {
            icon.removeClass(_cache.Type[k])
        }
        icon.addClass(_cache.Type[type])
    };
    var hide = function() {
        if (_timer) {
            window.clearTimeout(_timer)
        }
        if (_dom) {
            _dom.hide()
        }
    };
    return {
        Show: function(obj) {
            if (!obj.type) {
                obj.type = "war"
            }
            create(obj.text, obj.type);
            Util.Layer.Center(_dom, { Main: obj.window ? obj.window.warp : false });
            _dom.show();
            if (_timer) {
                window.clearTimeout(_timer)
            }
            if (obj.timeout) {
                _timer = window.setTimeout(hide, obj.timeout)
            }
        },
        Hide: function() { hide() }
    }
})();
Core.Message = (function() {
    var _dialog;
    var _MessageModel = function() {
        var _self = this, _initState = false, _callback, _openStatus = false, _dialog_type;
        var _content = $('<div><div class="dialog-msg" rel="content"></div><div class="dialog-bottom"><div class="con"><a href="javascript:;" class="button" btn="confirm">确定</a><a href="javascript:;" class="button btn-gray" btn="cancel" style="display:none;">取消</a></div></div><div>');
        Core.DialogBase.call(this, { content: _content, title: "信息提示" });
        var setTitle = function(title) { title && _self.warp.find("[rel='base_title']").html(title) };
        this.Initial = function() {
            if (!_initState) {
                $(document).bind("keyup", function(e) {
                    if (_openStatus) {
                        if (e.keyCode == 13) {
                            _content.find("[btn='confirm']").click()
                        } else {
                            if (e.keyCode == 27) {
                                switch (_dialog_type) {
                                case 0:
                                    _content.find("[btn='confirm']").click();
                                    break;
                                case 1:
                                    _content.find("[btn='cancel']").click();
                                    break
                                }
                            }
                        }
                    }
                })
            }
        };
        var _closeFun = this.Close;
        this.Close = function() {
            _closeFun();
            _openStatus = false
        };
        this.Show = function(obj) {
            _callback = false;
            _self.Open(function() {
                var cancelBtn = _content.find("[btn='cancel']");
                var confirmBtn = _content.find("[btn='confirm']");
                if (obj.confirm_link) {
                    confirmBtn.unbind("click").bind("click", function() {
                        if (_callback) {
                            _callback(true)
                        }
                        _self.Close();
                        return true
                    });
                    confirmBtn.attr("href", obj.confirm_link).attr("target", "_blank");
                    cancelBtn.unbind("click").bind("click", function() {
                        var r = true;
                        if (_callback) {
                            r = _callback(false)
                        }
                        if (r === false) {
                            return false
                        }
                        _self.Close();
                        return false
                    })
                } else {
                    if (confirmBtn.attr("target")) {
                        confirmBtn.removeAttr("target");
                        confirmBtn.attr("href", "javascript:;")
                    }
                    _self.warp.find("[btn]").unbind("click").bind("click", function() {
                        var r = true;
                        if (_callback) {
                            r = _callback($(this).attr("btn") == "confirm")
                        }
                        if (r === false) {
                            return false
                        }
                        _self.Close();
                        return false
                    })
                }
                if (obj.confirm_text) {
                    confirmBtn.html(obj.confirm_text)
                } else {
                    confirmBtn.html("确定")
                }
                if (obj.cancel_text) {
                    cancelBtn.html(obj.cancel_text)
                } else {
                    cancelBtn.html("取消")
                }
                _callback = obj.callback;
                setTitle(obj.title);
                if (obj.dialog_type == undefined) {
                    obj.dialog_type = 0
                }
                if (!obj.type) {
                    obj.type = "war"
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
                    break
                }
                _dialog_type = obj.dialog_type;
                _openStatus = true
            }, obj.win)
        }
    };
    var init = function() {
        if (!_dialog) {
            _dialog = new _MessageModel()
        }
    };
    var _alertTimer;
    return {
        Confirm: function(obj) {
            init();
            obj.dialog_type = 1;
            _dialog.Show(obj)
        },
        Alert: function(obj) {
            init();
            obj.dialog_type = 0;
            _dialog.Show(obj);
            if (obj.timeout) {
                _alertTimer = window.setTimeout(function() { Core.Message.Hide() }, obj.timeout)
            }
        },
        Hide: function() {
            if (_alertTimer) {
                window.clearTimeout(_alertTimer)
            }
            if (_dialog) {
                _dialog.Close()
            }
        }
    }
})();
Core.Dir = (function() {
    var createNode = function(aid, pid, floderName, callback) {
        var r = Util.Validate.CategoryName($.trim(floderName));
        if (r !== true) {
            if (callback) {
                callback({ state: false, message: r })
            }
            return
        }
        var data = { aid: aid, pid: pid, cname: floderName };
        $.ajax({
            url: "?ct=dir&ac=add", type: "POST", dataType: "json", data: data,
            success: function(result) {
                if (callback) {
                    callback(result)
                }
            }
        })
    };
    return {
        Rename: function(aid, cid, oldName) {
            var editCon = $('<div class="dialog-input"><input type="text" rel="txt" class="text" /></div><div class="dialog-bottom"><div class="con"><a href="javascript:;" class="button" btn="confirm">确定</a></div></div>');
            var editBox = new Core.DialogBase({ title: "重命名文件夹", content: editCon });
            editBox.Open();
            editCon.find("[rel='txt']").val(oldName);
            var renameFolderFun = function(e) {
                var aid = e.data.aid;
                var cid = e.data.cid;
                var data = { aid: aid, cid: cid, cname: editCon.find("[rel='txt']").val() };
                var r = Util.Validate.CategoryName($.trim(data.cname));
                if (r !== true) {
                    Core.MinMessage.Show({ text: r, type: "err", timeout: Core.CONFIG.MsgTimeout, window: editBox });
                    editCon.find("[rel='txt']")[0].focus();
                    return
                }
                $.ajax({
                    url: "?ct=dir&ac=edit", type: "POST", dataType: "json", data: data,
                    success: function(r) {
                        if (r.state) {
                            editBox.Close();
                            if (Core.FileConfig.DataAPI) {
                                Core.FileConfig.DataAPI.UpdateDir({ cid: r.cid, dir_name: r.cname })
                            }
                            Core.MinMessage.Show({ text: "成功重命名文件夹", type: "suc", timeout: Core.CONFIG.MsgTimeout })
                        } else {
                            Core.MinMessage.Show({ text: r.message, type: "err", timeout: Core.CONFIG.MsgTimeout, window: editBox });
                            editCon.find("[rel='txt']")[0].focus()
                        }
                    }
                })
            };
            editCon.find("[rel='txt']").bind("keydown", { aid: aid, cid: cid }, function(e) {
                if (e.keyCode == 13) {
                    renameFolderFun(e)
                } else {
                    if (e.keyCode == 27) {
                        editBox.Close()
                    }
                }
            });
            editCon.find("[btn]").bind("click", { aid: aid, cid: cid }, function(e) {
                switch ($(this).attr("btn")) {
                case "confirm":
                    renameFolderFun(e);
                    break;
                case "cancel":
                    editBox.Close();
                    break
                }
                return false
            });
            editCon.find("[rel='txt']")[0].focus();
            window.setTimeout(function() { editCon.find("[rel='txt']")[0].select() }, 20)
        },
        Create: function(aid, cid, callback) {
            if (!callback) {
                callback = function(node) { PageCTL.GOTO(node.aid, node.cid) }
            }
            var addCon = $('<div class="dialog-input"><input type="text" rel="txt" class="text" /></div><div class="dialog-bottom"><div class="con"><a href="javascript:;" class="button" btn="confirm">确定</a></div></div>');
            var createBox = new Core.DialogBase({ title: "新建文件夹", content: addCon });
            createBox.Open(null);
            var addFolderFun = function(e) {
                var aid = e.data.aid;
                var cid = e.data.cid;
                createNode(aid, cid, addCon.find("[rel='txt']").val(), function(r) {
                    if (r.state) {
                        Core.MinMessage.Show({ text: "新建成功", type: "suc", timeout: Core.CONFIG.MsgTimeout, window: createBox });
                        callback && callback(r);
                        createBox.Close()
                    } else {
                        Core.MinMessage.Show({ text: r.message, type: "err", timeout: Core.CONFIG.MsgTimeout, window: createBox });
                        addCon.find("[rel='txt']")[0].focus()
                    }
                })
            };
            addCon.find("[rel='txt']").bind("keydown", { aid: aid, cid: cid }, function(e) {
                if (e.keyCode == 13) {
                    Util.Html.StopPropagation(e);
                    addFolderFun(e)
                } else {
                    if (e.keyCode == 27) {
                        createBox.Close()
                    }
                }
            });
            addCon.find("[btn]").bind("click", { aid: aid, cid: cid }, function(e) {
                switch ($(this).attr("btn")) {
                case "confirm":
                    addFolderFun(e);
                    break;
                case "cancel":
                    createBox.Close();
                    break
                }
                return false
            });
            addCon.find("[rel='txt']")[0].focus()
        }
    }
})();
Core.SpaceData = (function() {
    var _data;
    var _OberverData = [];
    var changeData = function(changeType, aid, iByte, isdel) {
        var result = true;
        var key = -1;
        switch (Number(aid)) {
        case 0:
            key = 0;
            break;
        default:
            key = 1;
            break
        }
        if (!_data[key.toString()]) {
            _data[key.toString()] = { }
        }
        var obj = _data[key.toString()];
        if (obj) {
            switch (isdel) {
            case 0:
                obj[changeType] = Number(obj[changeType]) - Number(iByte);
                break;
            case 1:
                if (changeType == "used") {
                    var use = Number(obj[changeType]) + Number(iByte);
                    if (use > obj.total) {
                        result = false
                    } else {
                        obj[changeType] = use
                    }
                } else {
                    obj[changeType] = Number(obj[changeType]) + Number(iByte)
                }
                break;
            case 2:
                obj[changeType] = Number(iByte);
                break
            }
            doClient()
        } else {
            result = false
        }
        return result
    };
    var translation = function(d) {
        for (var k in d) {
            var item = d[k];
            d[k]["total"] = item.total ? item.total : item.size_total;
            d[k]["used"] = item.used != undefined ? item.used : item.size_used;
            d[k]["size_remain"] = Number(item.size_remain)
        }
    };
    var doClient = function() {
        if (_OberverData.length) {
            var delKeys = [];
            var newList = [];
            for (var i = 0, len = _OberverData.length; i < len; i++) {
                try {
                    if (_OberverData[i]) {
                        _OberverData[i].Do(_data);
                        newList.push(_OberverData[i])
                    } else {
                        delKeys.push(i)
                    }
                } catch(e) {
                    delKeys.push(i)
                }
            }
            if (delKeys.length) {
                _OberverData = newList
            }
        }
    };
    var syncMethod = function(callback) {
        var url = "/index.php?ct=ajax&ac=get_storage_info";
        $.ajax({
            url: url, method: "GET", dataType: "json", cache: false,
            success: function(result) {
                translation(result);
                for (var key in result) {
                    _data[key] = result[key]
                }
                doClient();
                if (callback) {
                    callback()
                }
            }
        })
    };
    return {
        AddClient: function(key, fun) {
            if (fun) {
                var addRes = true;
                for (var i = 0, len = _OberverData.length; i < len; i++) {
                    var obj = _OberverData[i];
                    if (obj.Key == key) {
                        obj.Do = fun;
                        addRes = false
                    }
                }
                if (addRes) {
                    _OberverData.push({ Key: key, Do: fun })
                }
                doClient()
            }
        },
        ChangeUse: function(aid, iByte, isdel) {
            if (iByte == "") {
                iByte = 0
            }
            return changeData("used", aid, iByte, isdel)
        },
        ChangeTotal: function(aid, iByte, isdel) {
            if (iByte == "") {
                iByte = 0
            }
            return changeData("total", aid, iByte, isdel)
        },
        GetData: function() { return _data },
        SetData: function(data) {
            translation(data);
            _data = data
        },
        IsNoSpace: function(type) {
            if (type == undefined) {
                type = "1"
            }
            if (_data[type]) {
                return (_data[type]["size_remain"] < 0)
            }
            return false
        },
        Sync: function(callback) { syncMethod(callback) }
    }
})();
Core.FloatMenu = (function() {
    var _menuData = Core.FloatMenuConfig;
    var _cacheDom = { };
    var _old_show_dom;
    var getMenu = function(obj) {
        var dom = $('<div class="context-menu" style="z-index:9999999; display:none;"></div>');
        var ul = $(document.createElement("ul"));
        for (var k in obj) {
            if (obj[k]) {
                if (obj[k].isline) {
                    dom.append(ul);
                    ul = $(document.createElement("ul"));
                    continue
                }
                var item = obj[k];
                var liTemp = '<li val="' + k + '"><a href="javascript:;"><i class="ico-menu {type}"></i><span>{text}</span></a></li>';
                var type;
                if (item.ico == undefined) {
                    type = "i-" + k
                } else {
                    if (item.ico == "") {
                        liTemp = '<li val="' + k + '"><a href="javascript:;">{text}</a></li>'
                    } else {
                        type = "i-" + item.ico
                    }
                }
                var type = (item.ico == undefined) ? ("i-" + k) : (item.ico == "" ? "" : "i-" + item.ico);
                var li = $(String.formatmodel(liTemp, { type: type, text: item.text }));
                if (item.ischild || item.childs) {
                    li.find("a").append($('<b class="arrow">&raquo;</b>'))
                }
                if (item.childs) {
                    var childDom = getMenu(item.childs);
                    li.bind("mouseover", { dom: li, childDom: childDom }, function(e) {
                        if (_old_show_dom) {
                            _old_show_dom.hide();
                            _old_show_dom = false
                        }
                        var childDom = e.data.childDom;
                        childDom.css({ left: "" });
                        childDom.show();
                        var l = childDom.offset().left;
                        if ((l + childDom.width()) > $(window).width()) {
                            childDom.css({ left: -(childDom.width()) })
                        }
                        _old_show_dom = childDom;
                        $(this).attr("hide_state", "0")
                    }).bind("mouseout", { childDom: childDom }, function(e) {
                        var ele = $(this);
                        ele.attr("hide_state", "1");
                        var childDom = e.data.childDom;
                        window.setTimeout(function() {
                            if (ele.attr("hide_state") == "1") {
                                childDom.hide()
                            }
                        }, 400)
                    });
                    childDom.bind("mouseover", { dom: li }, function(e) { e.data.dom.attr("hide_state", "0") }).bind("mouseout", { dom: li }, function(e) {
                        var ele = e.data.dom;
                        ele.attr("hide_state", "1");
                        var childDom = $(this);
                        window.setTimeout(function() {
                            if (ele.attr("hide_state") == "1") {
                                childDom.hide()
                            }
                        }, 400)
                    });
                    li.append(childDom)
                }
                ul.append(li)
            }
        }
        dom.append(ul);
        dom.bind("contextmenu", function(e) { return false });
        return dom
    };
    var showTimer;
    return {
        GetMenuHtml: function(obj) {
            var dom = getMenu(obj);
            return '<div class="context-menu" style="z-index:9999999; display:none;">' + dom.html() + "</div>"
        },
        GetMenu: function(obj) { return getMenu(obj) },
        Show: function(key, pos, setting) {
            if (!_cacheDom[key] && _menuData[key]) {
                _cacheDom[key] = getMenu(_menuData[key]);
                $(document.body).append(_cacheDom[key])
            }
            if (_cacheDom[key]) {
                if (pos) {
                    _cacheDom[key].css(pos)
                }
                _cacheDom[key].show();
                if (setting) {
                    var box = _cacheDom[key];
                    if (setting.callback) {
                        box.find("[val]").bind("click", function() {
                            setting.callback($(this).attr("val"));
                            $(this).parent().find("i.i-done").hide();
                            $(this).find("i.i-done").show();
                            return false
                        }).find("i.i-done").hide()
                    }
                    if (setting.select) {
                        var li = box.find("[val='" + setting.select + "']");
                        if (li.find("i").hasClass("i-done")) {
                            li.find("i").show()
                        }
                    }
                }
                return _cacheDom[key]
            }
            return false
        },
        SetPosition: function(key, pos) {
            if (_cacheDom[key]) {
                if (pos) {
                    _cacheDom[key].css(pos)
                }
            }
        },
        SetRightBtnPos: function(dom, type, x, y, cutX, cutY) {
            if (cutX == undefined) {
                cutX = 0
            }
            if (cutY == undefined) {
                cutY = 0
            }
            var desk = Core.ACTIVE.GetMain();
            if (x + dom.width() > desk.width()) {
                x = x - dom.width() + cutX
            }
            if (y + dom.height() + 5 > $(document).height()) {
                y = y - dom.height() + cutY
            }
            var pos = { top: y, left: x };
            Core.FloatMenu.SetPosition(type, pos);
            if (showTimer) {
                window.clearTimeout(showTimer)
            }
            showTimer = window.setTimeout(function() { dom.show() }, 100)
        },
        Hide: function(key) {
            if (showTimer) {
                window.clearTimeout(showTimer)
            }
            if (!_cacheDom[key]) {
                _cacheDom[key].hide()
            }
        }
    }
})();
Core.Permission = Core.FilePermission = (function() {
    var _per;
    return {
        Set: function(data) { _per = data },
        Shared: function(aid) {
            aid = Number(aid);
            if (!_per) {
                return false
            }
            return true
        },
        SharedDir: function(aid) {
            aid = Number(aid);
            if (!_per) {
                return false
            }
            var txt = aid + "|";
            return _per.share_dir.indexOf(txt) != -1
        },
        Vip: function() {
            if (!_per) {
                return false
            }
            return _per.is_vip
        },
        VipExp: function() {
            if (!_per) {
                return false
            }
            return _per.is_vip_exp
        },
        VipExpLimit: function() {
            if (!_per) {
                return false
            }
            return _per.is_vip_exp_limit
        },
        LockFile: function(aid) {
            aid = Number(aid);
            if (!_per) {
                return false
            }
            return _per.lock_file
        },
        LockDir: function(aid) {
            aid = Number(aid);
            if (!_per) {
                return false
            }
            return _per.lock_dir
        },
        CanPlayer: function(arr, flag) {
            switch (Number(flag)) {
            case 4:
                var newArr = [], pcs = [];
                for (var i = 0, len = arr.length; i < len; i++) {
                    var fileDom = arr[i];
                    if (Number(fileDom.attr("file_mode")) == 4) {
                        var suffix = "";
                        var fileName = fileDom.find("[field='file_name']").attr("title");
                        if (fileName.lastIndexOf(".") != -1) {
                            suffix = fileName.substring(fileName.lastIndexOf("."), fileName.length).replace(".", "")
                        }
                        if (suffix.toLowerCase() == "mp3") {
                            newArr.push(fileDom);
                            pcs.push(fileDom.attr("pick_code"))
                        }
                    }
                }
                if (newArr.length) {
                    return { list: newArr.length, pick_codes: pcs }
                } else {
                    return false
                }
                break
            }
            return false
        }
    }
})();
(function() {
    var mod = function(actions) {
        var _content = $('<iframe style="width:100%; background:#fff;" frameborder=0 src=""></iframe>'), _self = this;
        var _top = Util.Override(Core.DialogBase, _self, {
            Initial: function() {
                if ($.browser.mozilla) {
                    _content.on("load", function() {
                        try {
                            var win = $(this.contentWindow);
                            $(win).on("keydown", function(e) {
                                if (e.keyCode == 27) {
                                    return false
                                }
                            })
                        } catch(e) {
                        }
                    })
                }
            },
            GetIframe: function() { return _content[0] },
            Show: function(url) {
                _top.Open(function() {
                    _content.off("load").on("load", function() {
                        if (actions && actions.ready) {
                            var ifr = this;
                            window.setTimeout(function() { actions.ready(ifr.contentWindow) }, 10)
                        }
                    })
                });
                _content.attr("src", url)
            },
            Reset: function(width, height, notcenter) {
                if (width) {
                    _self.warp.width(width)
                }
                if (height) {
                    _content.height(height)
                }
                if (!notcenter) {
                    Util.Layer.Center(_self.warp)
                }
            },
            Close: function(doHide) {
                actions && actions.close && actions.close(doHide);
                window.setTimeout(function() {
                    _content.attr("src", "");
                    _top.Close()
                }, 10)
            },
            ResetTitle: function(title) { _self.warp.find('[rel="base_title"]').html(title) }
        }, { content: _content, title: "新窗口" })
    };
    Core.SimpleFrameDG = (function() {
        var _cache = { }, _ready = false, _ackey;
        return {
            Open: function(key, url, setting) {
                if (!setting) {
                    setting = { }
                }
                if (!setting.width) {
                    setting.width = 320
                }
                _ready = false;
                if (setting) {
                    _ready = setting.ready
                }
                if (!_cache[key]) {
                    _cache[key] = new mod({ ready: function(win) { _ready && _ready(win) } })
                }
                _cache[key].Show(url);
                _ackey = key;
                if (setting) {
                    _cache[key].Reset(setting.width, setting.height);
                    _cache[key].ResetTitle(setting.title ? setting.title : "新窗口")
                }
            },
            Close: function(key) {
                if (!key) {
                    key = _ackey
                }
                if (_cache[key]) {
                    _cache[key].Close()
                }
            },
            Reset: function(key, setting) {
                if (_cache[key]) {
                    _cache[key].Reset(setting.width, setting.height, setting.notcenter)
                }
            }
        }
    })();
    Core.FrameDG = (function() {
        var _mod, _doHandler, _hideBack = false, _hideBackData, _ready;
        return {
            IsOpen: function() {
                if (_mod) {
                    return _mod.warp.length
                }
                return false
            },
            GetIframe: function() {
                if (_mod) {
                    return _mod.GetIframe()
                } else {
                    return false
                }
            },
            Reset: function(width, height, notcenter) {
                if (_mod) {
                    _mod.Reset(width, height, notcenter)
                }
            },
            ResetTitle: function(title) {
                if (_mod) {
                    _mod.ResetTitle(title)
                }
            },
            Open: function(url, setting) {
                if (setting.callback) {
                    _doHandler = setting.callback
                } else {
                    _doHandler = false
                }
                if (setting.ready) {
                    _ready = setting.ready
                } else {
                    _ready = false
                }
                if (!_mod) {
                    _mod = new mod({
                        ready: function(win) { _ready && _ready(win) },
                        close: function(doHide) {
                            if (!doHide) {
                                if (_hideBack) {
                                    _doHandler && _doHandler(_hideBackData)
                                }
                            }
                        }
                    })
                }
                _hideBackData = null;
                _hideBackData = setting.hide_data;
                _hideBack = setting.is_hide_back;
                _mod.Show(url);
                if (setting) {
                    _mod.Reset(setting.width, setting.height);
                    _mod.ResetTitle(setting.title ? setting.title : "新窗口")
                }
            },
            Close: function(data) {
                if (_mod) {
                    if (_doHandler) {
                        _doHandler(data)
                    }
                    _mod.Close(true)
                }
            },
            Hide: function() {
                if (_mod) {
                    _mod.Close()
                }
            }
        }
    })()
})();
Core.OnlyFrame = (function() {
    var _cache = { }, _defautWidth = 960;
    var disInstance = function() {
        if (_cache.iframe) {
            _cache.iframe.attr("src", "");
            _cache.iframe.empty().remove();
            _cache.iframe = false
        }
        if (_cache.box) {
            _cache.box.empty().remove();
            _cache.box = false
        }
        _cache.resizeCallback = false;
        if (_cache.closeCallback) {
            _cache.closeCallback(_cache.hideBackData);
            _cache.closeCallback = false
        }
    };
    var init = function() {
        if (!_cache.box) {
            _cache.box = $('<div class="popup-window-wrap" is_over="1"><div class="popup-window"><iframe src="" frameborder=0></iframe><div class="popup-window-handle"><a href="javascript:;" class="close" btn="close">关闭</a></div></div></div>');
            $(document.body).append(_cache.box);
            _cache.iframe = _cache.box.find("iframe");
            if ($.browser.mozilla) {
                _cache.iframe.on("load", function() {
                    try {
                        var win = $(this.contentWindow);
                        $(win).on("keydown", function(e) {
                            if (e.keyCode == 27) {
                                return false
                            }
                        })
                    } catch(e) {
                        alert(e)
                    }
                })
            }
            _cache.box.on("mouseenter", function() { _cache.box.attr("is_over", "1") }).on("mouseleave", function() { _cache.box.attr("is_over", "0") });
            _cache.box.find("[btn='close']").on("click", function() {
                disInstance();
                return false
            })
        }
        if (!_cache.bind_reset) {
            _cache.bind_reset = true;
            $(window).on("resize", function() {
                if (_cache.resizeCallback) {
                    _cache.resizeCallback($(document).width(), $(document).height())
                }
            });
            $(document).on("keydown", function(e) {
                if (e.keyCode == 27) {
                    if (_cache.box && _cache.box.attr("is_over") == "1") {
                        disInstance();
                        return false
                    }
                }
            })
        }
    };
    var _openTimer;
    return {
        Resize: function(width, height) {
            if (_cache.box) {
                var l = 0;
                if (width) {
                    l = -width / 2
                }
                _cache.box.find(".popup-window").width(width).css("margin-left", l + "px")
            }
        },
        Open: function(url, setting) {
            if (_openTimer) {
                window.clearTimeout(_openTimer)
            }
            init();
            if (!setting) {
                setting = { }
            }
            if (!setting.width) {
                setting.width = 960
            }
            if (!setting.height) {
                setting.height = 500
            }
            if (setting.resizeCallback) {
                _cache.resizeCallback = setting.resizeCallback
            } else {
                _cache.resizeCallback = false
            }
            _cache.hideBackData = null;
            _cache.hideBackData = setting.hide_data;
            if (setting.hideCallback) {
                _cache.closeCallback = setting.hideCallback
            } else {
                _cache.closeCallback = false
            }
            _cache.iframe.attr("src", url);
            _cache.box.find(".popup-window").width(setting.width).css("margin-left", (-setting.width / 2) + "px");
            _openTimer = window.setTimeout(function() {
                try {
                    _cache.box && _cache.box.show()
                } catch(e) {
                }
            }, 20)
        },
        Close: function(data) {
            if (data != undefined) {
                _cache.hideBackData = data
            }
            disInstance()
        }
    }
})();
Core.TabFrame = (function() {
    var _tabList, _mod;
    var mod = function() {
        var _content = $('<iframe style="width:100%; height: 510px; background:#fff;" frameborder=0 src=""></iframe>'), _self = this, _titleTab;
        var focusLi = function(type) {
            _titleTab.find(".focus").removeClass("focus");
            var el = _titleTab.find("li")[type];
            if (el) {
                $(el).addClass("focus")
            }
        };
        var _top = Util.Override(Core.DialogBase, _self, {
            Initial: function() {
                var html = [];
                html.push('<ul class="dialog-tab">');
                for (var i = 0, len = _tabList.length; i < len; i++) {
                    var item = _tabList[i];
                    html.push('<li key="' + i + '"><spam>' + item.text + "</span></li>")
                }
                html.push("</ul>");
                _titleTab = $(html.join(""));
                _titleTab.find("li").on("click", function() {
                    var el = $(this);
                    var ind = Number(el.attr("key"));
                    _content.attr("src", _tabList[ind].url);
                    focusLi(ind);
                    return false
                });
                var title = _self.warp.find('[rel="base_title"]');
                title.before(_titleTab);
                title.hide()
            },
            Show: function(type) {
                _top.Open(function() {
                    _content.off("load").on("load", function() {
                        var ifr = this;
                        window.setTimeout(function() {
                            $(ifr.contentWindow.document).on("keydown", function(e) {
                                if (e.keyCode == 27) {
                                    _self.Close()
                                }
                            })
                        }, 100)
                    });
                    focusLi(type)
                });
                _content.attr("src", _tabList[type].url)
            },
            Close: function() {
                window.setTimeout(function() {
                    _content.attr("src", "");
                    _top.Close()
                }, 10)
            }
        }, { content: _content, title: "", width: 700 })
    };
    return {
        Open: function(list, opt) {
            _tabList = list;
            if (!_tabList) {
                return
            }
            if (!_mod) {
                _mod = new mod()
            }
            if (!opt) {
                opt = { }
            }
            if (opt.type == undefined) {
                opt.type = 0
            }
            _mod.Show(opt.type)
        },
        Close: function() {
            if (_mod) {
                _mod.Close()
            }
        }
    }
})();
Core.LineTabFrame = (function() {
    var _tabList, _mod, _title;
    var mod = function() {
        var _self = this, _titleTab, _iframe;
        var _content = $('<div class="dg-sub-tab"></div><div class="dg-sub-frame"><iframe src="setting_common.html" frameborder="0"></iframe></div>');
        var focusLi = function(type) {
            _titleTab.find(".focus").removeClass("focus");
            var el = _titleTab.find("li")[type];
            if (el) {
                $(el).find("a").addClass("focus")
            }
        };
        var _top = Util.Override(Core.DialogBase, _self, {
            Initial: function() {
                _self.warp.height(500);
                _iframe = _self.warp.find("iframe");
                var html = [];
                html.push("<ul>");
                for (var i = 0, len = _tabList.length; i < len; i++) {
                    var item = _tabList[i];
                    html.push('<li key="' + i + '"><a href="javascript:;">' + item.text + "</a></li>")
                }
                html.push("</ul>");
                _titleTab = $(html.join(""));
                _titleTab.find("li").on("click", function() {
                    var el = $(this);
                    var ind = Number(el.attr("key"));
                    _iframe.attr("src", _tabList[ind].url);
                    focusLi(ind);
                    return false
                });
                var tabBox = _self.warp.find(".dg-sub-tab");
                tabBox.html("").append(_titleTab)
            },
            Show: function(type) {
                _top.Open(function() {
                    _iframe.off("load").on("load", function() {
                        var ifr = this;
                        window.setTimeout(function() {
                            $(ifr.contentWindow.document).on("keydown", function(e) {
                                if (e.keyCode == 27) {
                                    _self.Close()
                                }
                            })
                        }, 100)
                    });
                    focusLi(type)
                });
                _iframe.attr("src", _tabList[type].url)
            },
            Close: function() {
                window.setTimeout(function() {
                    _iframe && _iframe.attr("src", "");
                    _top.Close()
                }, 10)
            }
        }, { content: _content, title: _title, width: 700, height: 500 })
    };
    return {
        Open: function(list, opt) {
            _title = opt.title ? opt.title : "";
            _tabList = list;
            if (!_tabList) {
                return
            }
            if (!_mod) {
                _mod = new mod()
            }
            if (!opt) {
                opt = { }
            }
            if (opt.type == undefined) {
                opt.type = 0
            }
            _mod.Show(opt.type);
            _mod.warp.find('[rel="base_title"]').html(_title)
        },
        Close: function() {
            if (_mod) {
                _mod.Close()
            }
        }
    }
})();
Core.Frame = function(url, obj) {
    var _self = this;
    if (!obj) {
        obj = { }
    }
    if (!obj.title) {
        obj.title = "新窗口"
    }
    var _content = $('<div class="window-frame"><iframe src="" frameborder="0" rel="content"></iframe>' + (obj.is_has_flash ? '<div class="app-back" rel="flash_op" style="display:none;"></div>' : "") + "</div>");
    var _opcBoxTemp = '<div style="z-index: 9000000;background: none repeat scroll 0 0 black;height: 100%;left: 0;position: absolute;top: 0;width: 100%;filter:alpha(opacity=0.15);-moz-opacity:0;opacity:0;"></div>';
    var _opcBox;
    obj.content = _content;
    Core.WindowBase.call(this, obj);
    var parentClose = _self.Close;
    var parentOpen = _self.Open;
    var parentHide = _self.Hide;
    var parentActive = _self.Active;
    var parentDeActive = _self.DeActive;
    var _isClose = true;
    this.FrameSetting = obj;
    this.IsHide = false;
    if (this.FrameSetting.is_has_flash != undefined && typeof this.FrameSetting.is_has_flash == "string") {
        this.FrameSetting.is_has_flash = Number(this.FrameSetting.is_has_flash)
    }
    this.Initial = function() { _self.warp.addClass("window-box") };
    this.Open = function(newUrl) {
        parentOpen();
        if (_isClose) {
            _content.find("[rel='content']").attr("src", newUrl ? newUrl : url);
            _isClose = false
        } else {
            if (newUrl) {
                _content.find("[rel='content']").attr("src", newUrl)
            }
        }
        _self.IsHide = false
    };
    this.Hide = function() {
        parentHide();
        _self.IsHide = true
    };
    this.Close = function() {
        parentClose();
        _content.find("[rel='content']").attr("src", "");
        if (_opcBox) {
            _opcBox.remove();
            _opcBox = false
        }
        _content.find("iframe").attr("src", "");
        _content.html("");
        _self.warp && _self.warp.remove();
        _self.warp = false;
        _isClose = true;
        _self.IsHide = false
    };
    this.Active = function(zIndex) {
        if (_opcBox) {
            _opcBox.hide()
        }
        parentActive(zIndex);
        if (_self.FrameSetting.is_has_flash) {
            _content.find("[rel='content']").css({ height: "", width: "" });
            _content.find("[rel='flash_op']").hide()
        }
    };
    this.DeActive = function(zIndex) {
        if (!_opcBox) {
            _opcBox = $(_opcBoxTemp);
            _content.find("[rel='content']").before(_opcBox)
        }
        _opcBox.show();
        parentDeActive(zIndex);
        if (_self.FrameSetting.is_has_flash) {
            _content.find("[rel='content']").css({ height: "1px", width: "1px" });
            _content.find("[rel='flash_op']").show()
        }
    }
};
Core.AppFrame = function(url, obj) {
    var _self = this;
    Core.Frame.call(this, url, obj);
    var _oldHide = _self.Hide;
    this.Hide = function() {
        if (obj.HideCallBack) {
            obj.HideCallBack()
        }
        _oldHide()
    }
};
(function() {
    var music = Core.CloudMusic = (function() {
        var _cache = { }, _ind = 0, _client;
        return {
            AddClient: function(api) {
                if (!_client) {
                    _client = { }
                }
                _client["k_" + new Date().getTime() + "_" + _ind] = api;
                _ind++
            },
            GetCate: function(callback) {
                if (!_cache.cates) {
                    $.ajax({
                        url: "/?ct=umusic&ac=topics", type: "GET", cache: false, dataType: "json",
                        success: function(r) {
                            _cache.cates = { };
                            if (r.state && r.data) {
                                for (var k in r.data) {
                                    var item = r.data[k];
                                    _cache.cates[item.topic_id] = item
                                }
                            }
                            callback && callback(_cache.cates)
                        }
                    })
                } else {
                    callback && callback(_cache.cates)
                }
            },
            DelCate: function(tid, callback) {
                Core.Message.Confirm({
                    text: "是否要删除该云专辑?", type: "war", content: "删除后将无法恢复",
                    callback: function(r) {
                        if (r) {
                            $.ajax({
                                url: "/?ct=umusic&ac=delete_topic&topic_id=" + tid, dataType: "json", type: "GET", cache: false,
                                success: function(r) {
                                    if (r.state) {
                                        if (_cache.cates[tid]) {
                                            _cache.cates[tid] = null;
                                            delete _cache.cates[tid]
                                        }
                                        callback && callback(true)
                                    } else {
                                        Core.MinMessage.Show({ text: r.msg, type: "err", timeout: 2000 });
                                        callback && callback(false)
                                    }
                                }
                            })
                        }
                    }
                })
            },
            EditCate: function(tid, callback) {
                if (!_cache.cates || !_cache.cates[tid]) {
                    Core.MinMessage.Show({ text: "没有对应的云专辑", type: "war", timeout: 2000 });
                    return false
                }
                var info = _cache.cates[tid];
                var editCon = $('<div class="dialog-input"><input type="text" rel="txt" class="text" /></div><div class="dialog-bottom"><div class="con"><a href="javascript:;" class="button" btn="confirm">确定</a></div></div>');
                var editBox = new Core.DialogBase({ title: "重命名云专辑", content: editCon });
                editBox.Open(null);
                editCon.find("[rel='txt']").val(info.topic_name);
                var renameFun = function() {
                    var cateName = $.trim(editCon.find('[rel="txt"]').val());
                    if (cateName == "") {
                        Core.MinMessage.Show({ text: "请输入专辑名称", type: "war", timeout: 2000 });
                        callback && callback(false);
                        return
                    }
                    $.ajax({
                        url: "/?ct=umusic&ac=edit_topic", type: "POST", dataType: "json", data: { topic_id: tid, topic_name: cateName },
                        success: function(r) {
                            if (r.state) {
                                _cache.cates[tid].topic_name = cateName;
                                if (_client) {
                                    for (var k in _client) {
                                        var c = _client[k];
                                        if (c.RenameCate) {
                                            c.RenameCate(_cache.cates[tid], _cache.cates)
                                        }
                                    }
                                }
                                callback && callback(_cache.cates[tid]);
                                editBox.Close()
                            } else {
                                Core.MinMessage.Show({ text: r.msg, type: "err", timeout: 2000 });
                                callback && callback(false)
                            }
                        }
                    })
                };
                editCon.find("[rel='txt']").bind("keydown", function(e) {
                    if (e.keyCode == 13) {
                        renameFun()
                    } else {
                        if (e.keyCode == 27) {
                            editBox.Close()
                        }
                    }
                });
                editCon.find("[btn]").bind("click", function(e) {
                    switch ($(this).attr("btn")) {
                    case "confirm":
                        renameFun();
                        break;
                    case "cancel":
                        editBox.Close();
                        break
                    }
                    return false
                });
                editCon.find("[rel='txt']")[0].focus();
                window.setTimeout(function() { editCon.find("[rel='txt']")[0].select() }, 20)
            },
            AddCate: function(callback) {
                var addCon = $('<div class="dialog-input"><input type="text" rel="txt" class="text" /></div><div class="dialog-bottom"><div class="con"><a href="javascript:;" class="button" btn="confirm">确定</a></div></div>');
                var addBox = new Core.DialogBase({ title: "添加云专辑", content: addCon });
                addBox.Open(null);
                var addCateFun = function() {
                    var cateName = $.trim(addCon.find('[rel="txt"]').val());
                    if (cateName == "") {
                        Core.MinMessage.Show({ text: "请输入专辑名称", type: "war", timeout: 2000 });
                        callback && callback(false);
                        return
                    }
                    music.GetCate(function(data) {
                        $.ajax({
                            url: "/?ct=umusic&ac=add_topic", data: { topic_name: cateName }, type: "POST", dataType: "json",
                            success: function(r) {
                                if (r.state) {
                                    _cache.cates[r.topic_id] = { topic_id: r.topic_id, user_id: USER_ID, topic_name: r.topic_name };
                                    if (_client) {
                                        for (var k in _client) {
                                            var c = _client[k];
                                            if (c.AddCate) {
                                                c.AddCate(_cache.cates[r.topic_id], _cache.cates)
                                            }
                                        }
                                    }
                                    callback && callback(_cache.cates[r.topic_id]);
                                    addBox.Close()
                                } else {
                                    if (r.msg_code == 88807 && !Core.FilePermission.Vip()) {
                                        Core.Message.Confirm({ text: "您不可以再添加云专辑了", content: "升级VIP后可添加<b>115张</b>云专辑！", confirm_text: "马上升级", confirm_link: Core.CONFIG.Path.VIP + "?p=cloud_music" })
                                    } else {
                                        Core.MinMessage.Show({ text: r.msg, type: "err", timeout: 2000 })
                                    }
                                    callback && callback(false)
                                }
                            }
                        })
                    })
                };
                addCon.find("[rel='txt']").bind("keydown", function(e) {
                    if (e.keyCode == 13) {
                        Util.Html.StopPropagation(e);
                        addCateFun(e)
                    } else {
                        if (e.keyCode == 27) {
                            addBox.Close()
                        }
                    }
                });
                addCon.find("[btn]").bind("click", function(e) {
                    switch ($(this).attr("btn")) {
                    case "confirm":
                        addCateFun(e);
                        break;
                    case "cancel":
                        addBox.Close();
                        break
                    }
                    return false
                });
                addCon.find("[rel='txt']")[0].focus()
            },
            DelFile: function(topic_id, music_id, callback) {
                $.ajax({
                    url: "/?ct=umusic&ac=delete_music&music_id=" + music_id, cache: false, type: "GET", dataType: "json",
                    success: function(r) {
                        if (r.state) {
                            var list = _cache.list[topic_id];
                            if (list) {
                                var ind = false;
                                for (var i = 0, len = list.length; i < len; i++) {
                                    var item = list[i];
                                    if (item.id == music_id) {
                                        ind = i
                                    }
                                }
                                if (ind !== false) {
                                    _cache.list[topic_id].splice(ind, 1)
                                }
                            }
                            callback && callback(_cache.list[topic_id])
                        } else {
                            Core.MinMessage.Show({ text: r.msg, type: "err", timeout: 2000 });
                            callback && callback(false)
                        }
                    }
                })
            },
            AddFileList: function(tid, fids, callback) {
                $.ajax({
                    url: "/?ct=umusic&ac=add_music", data: { topic_id: tid, file_id: fids.join(",") }, type: "POST", dataType: "json",
                    success: function(r) {
                        if (r.state) {
                            if (!_cache.list) {
                                _cache.list = { }
                            }
                            _cache.list[tid] = r.data;
                            callback && callback(_cache.list[tid])
                        } else {
                            if (r.msg_code == 88807 && !Core.FilePermission.Vip()) {
                                Core.Message.Confirm({ text: "该云专辑不能再添加文件了", content: "升级VIP后可添加<b>1150首</b>歌曲！", confirm_text: "马上升级", confirm_link: Core.CONFIG.Path.VIP + "?p=cloud_music" })
                            } else {
                                Core.MinMessage.Show({ text: r.msg, type: "err", timeout: 2000 })
                            }
                            callback && callback(false)
                        }
                    }
                })
            },
            GetFileList: function(topic_id, callback) {
                if (!_cache.list) {
                    _cache.list = { }
                }
                if (!_cache.list[topic_id]) {
                    $.ajax({
                        url: "/?ct=umusic&ac=musics&topic_id=" + topic_id, type: "GET", cache: false, dataType: "json",
                        success: function(r) {
                            if (r.state) {
                                _cache.list[topic_id] = r.data;
                                callback && callback(_cache.list[topic_id])
                            } else {
                                callback && callback(false)
                            }
                        }
                    })
                } else {
                    callback && callback(_cache.list[topic_id])
                }
            }
        }
    })()
})();
(function() {
    var _self = Core.MusicPlayer = (function() {
        var _html = '<div class="music-player" style="z-index:11;display:none;"><div class="music-panel"><div class="music-background"><a href="javascript:;" class="mbg-minimize" btn="min_back" title="最小化">最小化</a><a href="javascript:;" class="mbg-close" btn="close_back" title="关闭">关闭</a></div><div class="music-animate"></div><div class="music-name"><strong rel="play_name"></strong><em><span jplay="play_time"></span>/<span jplay="total_time"></span></em></div><div class="music-progress" jplay="progress_line"><em style="width:0;" jplay="download_line"></em><i style="width:0;" jplay="play_line"></i></div><div class="music-control"><a href="javascript:;" class="ctrl-prev" jplay="per">上一首</a><a href="javascript:;" class="ctrl-play" jplay="play">播放</a><a href="javascript:;" class="ctrl-pause" style="display:none;" jplay="pause">暂停</a><a href="javascript:;" class="ctrl-next" jplay="next">下一首</a></div><div class="music-volume"><a href="javascript:;" class="ctrl-volume" jplay="volume_close">音量</a><a href="javascript:;" class="ctrl-mute" jplay="volume_open" style="display:none;">静音</a><div class="music-progress volume-progress" jplay="volume_line"><em jplay="volume_size_line" style="width:50%;"><b jplay="volume_button"></b></em></div></div><div class="music-loop"><a href="javascript:;" class="loop-single" jplay="mode_1" title="单曲循环">单曲循环</a><a href="javascript:;" class="loop-random" jplay="mode_0" style="display:none;" title="随机播放">随机播放</a><a href="javascript:;" class="loop-list" jplay="mode_2" style="display:none;" title="列表循环">列表循环</a> </div></div><div class="music-playlist" rel="list_box"><div class="mulist-side"><ul rel="album_list"></ul><div class="music-bottom"><a href="javascript:;" btn="add_album"><i class="mu-playlist"></i>添加云专辑</a></div></div><div class="music-list"><ul rel="list"></ul><ul rel="album_file_list" style="display:none;"></ul><div class="music-bottom"><a href="javascript:;" btn="clear">清空列表</a> </div></div></div></div>', _content, _isLoading = false, _is_create = false, _content, _cache = { }, _urls = { }, _ac_out_obj;
        var clear = function() {
            var dom = _content.find("[rel='list']");
            dom.find("[key]").each(function() { jPlayerProxy.Delete($(this).attr("key")) })
        };
        var getMInfo = function(mid) {
            var obj = _urls[mid];
            return { key: mid, tid: obj.topic_id, is_out: true, mp3: obj.url, name: obj.file_name, pick_code: obj.pick_code }
        };
        var _minAlbum;
        var changeAlbum = function(el, file_id) {
            var albumList = _content.find('[rel="album_list"]');
            var list = [];
            albumList.find("li[tid]").not('[tid="-1"]').each(function() {
                var el = $(this);
                list.push({ tid: el.attr("tid"), text: el.find("span").html() })
            });
            if (list.length) {
                var hideState = true;
                if (!_minAlbum) {
                    _minAlbum = $('<div class="mu-popup-menu" style="display:none;"><i class="arrow"></i><b class="arrow"></b><ul></ul></div>');
                    $(document.body).append(_minAlbum);
                    _minAlbum.on("mouseover", function() { hideState = false }).on("mouseleave", function() { hideState = true });
                    $(document).on("click", function() {
                        if (hideState) {
                            _minAlbum && _minAlbum.hide()
                        }
                    });
                    _minAlbum.delegate("[tid]", "click", function() {
                        hideState = true;
                        _minAlbum && _minAlbum.hide();
                        Core.CloudMusic.AddFileList($(this).attr("tid"), [file_id], function() { Core.MinMessage.Show({ text: "成功加入到选中的专辑", type: "suc", timeout: 2000 }) });
                        return false
                    })
                }
                var ul = _minAlbum.find("ul");
                ul.html("");
                for (var i = 0, len = list.length; i < len; i++) {
                    var item = list[i];
                    ul.append(String.formatmodel('<li tid="{tid}">{text}</li>', item))
                }
                _minAlbum.hide();
                window.setTimeout(function() {
                    hideState = false;
                    _minAlbum.css({ left: el.offset().left - _minAlbum.width() - 10, top: el.offset().top - 10 }).show()
                }, 10)
            } else {
                Core.CloudMusic.AddCate(function(info) { window.setTimeout(function() { Core.CloudMusic.AddFileList(info.topic_id, [file_id], function() { Core.MinMessage.Show({ text: "成功加入到新添加的专辑", type: "suc", timeout: 2000 }) }) }) })
            }
        };
        var initPlay = function() {
            jPlayerProxy.Bind($(Core.CONFIG.MusicPlay), [_content]);
            jPlayerProxy.Action = {
                Playing: function() {
                    if (_content) {
                        _content.find(".music-animate").addClass("animate-playing");
                        checkIsPlay()
                    }
                },
                Stoping: function() {
                    if (_content) {
                        _content.find(".music-animate").removeClass("animate-playing");
                        checkIsPlay()
                    }
                },
                StartPlay: function(obj) {
                    if (obj.is_out) {
                        _ac_out_obj = obj;
                        var mid = _ac_out_obj.key;
                        var tid = _ac_out_obj.tid;
                        var albumList = _content.find('[rel="album_list"]');
                        var alFileList = _content.find('[rel="album_file_list"]');
                        if (albumList.find(".focus").attr("tid") == tid) {
                            alFileList.find(".focus").removeClass("focus");
                            alFileList.find('li[mid="' + mid + '"]').addClass("focus")
                        }
                        _content.find('[rel="play_name"]').html(obj.name);
                        if (_cache.old_odd) {
                            _cache.old_odd.removeClass("playing");
                            _cache.old_odd = false
                        }
                    } else {
                        var dom = _content.find("[rel='list']");
                        if (_cache.old_odd) {
                            _cache.old_odd.removeClass("playing");
                            _cache.old_odd = false
                        }
                        _content.find('[rel="play_name"]').html(obj.name);
                        if (_cache.minBox) {
                            _cache.minBox.attr("title", obj.name)
                        }
                        _cache.old_odd = dom.find('[key="' + obj.key + '"]');
                        _cache.old_odd.addClass("playing");
                        if (_ac_out_obj) {
                            _ac_out_obj = false
                        }
                    }
                },
                AddMusic: function(arr) {
                    var dom = _content.find("[rel='list']");
                    var isPlay = !dom.find("[key]").length;
                    var firstItem = false;
                    var list = [];
                    for (var i = 0, len = arr.length; i < len; i++) {
                        var item = arr[i];
                        if (!firstItem) {
                            firstItem = item
                        }
                        var ele = $(String.formatmodel('<li key="{key}" file_id="{file_id}" pick_code="{pick_code}" style="display:none;" file_type="{file_type}" is_share="is_share" aid="{aid}" cid="{cid}"><span><a href="javascript:;" btn="play">{name}</a></span><em><a href="javascript:;" class="mu-playlist" btn="add_cloud">加入播放列表</a><a href="javascript:;" target="_blank" class="mu-download" btn="download">下载</a><a href="javascript:;" class="mu-delete" btn="del">删除</a></em></li>', item));
                        if (item.not_down) {
                            ele.find(".mu-download").empty().remove()
                        }
                        ele.find("[btn]").bind("click", { mod: item }, function(e) {
                            switch ($(this).attr("btn")) {
                            case "play":
                                jPlayerProxy.Play(e.data.mod.key);
                                break;
                            case "del":
                                jPlayerProxy.Delete(e.data.mod.key);
                                break;
                            case "download":
                                Core.FileAPI.Download($(this).parents("[key]").attr("pick_code"));
                                break;
                            case "add_cloud":
                                changeAlbum($(this), e.data.mod.file_id);
                                break
                            }
                            return false
                        });
                        dom.append(ele);
                        list.push(ele)
                    }
                    for (var i = 0, len = list.length; i < len; i++) {
                        list[i].fadeIn("slow")
                    }
                    window.setTimeout(function() { dom.parent().scrollTop(dom.height()) }, 10);
                    if (isPlay && firstItem) {
                        jPlayerProxy.Play(firstItem.key)
                    }
                },
                DeleteMusic: function(key) {
                    var dom = _content.find("[rel='list']");
                    dom.find('[key="' + key + '"]').empty().remove()
                },
                SetMode: function(mod) {
                    _content.find("[jplay='mode_0']").hide();
                    _content.find("[jplay='mode_1']").hide();
                    _content.find("[jplay='mode_2']").hide();
                    switch (mod) {
                    case 0:
                        _content.find("[jplay='mode_1']").show();
                        break;
                    case 1:
                        _content.find("[jplay='mode_2']").show();
                        break;
                    case 2:
                        _content.find("[jplay='mode_0']").show();
                        break
                    }
                },
                Play: function() {
                    if (_content) {
                        var albumList = _content.find('[rel="album_list"]');
                        var focusLi = albumList.find(".focus");
                        if (focusLi.length && focusLi.attr("tid") != "-1") {
                            var tid = focusLi.attr("tid");
                            var alFileList = _content.find('[rel="album_file_list"]');
                            var clds = alFileList.children();
                            if (clds.length) {
                                var node = $(clds[0]);
                                var mid = node.attr("mid");
                                return getMInfo(mid)
                            }
                        }
                    }
                    return false
                },
                Random: function() {
                    if (_content) {
                        var albumList = _content.find('[rel="album_list"]');
                        var focusLi = albumList.find(".focus");
                        if (focusLi.length && focusLi.attr("tid") != "-1") {
                            var tid = focusLi.attr("tid");
                            var alFileList = _content.find('[rel="album_file_list"]');
                            var clds = alFileList.children().not("[add_music]");
                            if (clds.length) {
                                var len = clds.length;
                                var c = Math.floor(len * Math.random());
                                if (c == len) {
                                    c = 0
                                }
                                var node = $(clds[c]);
                                var mid = node.attr("mid");
                                return getMInfo(mid)
                            }
                        }
                    }
                    return false
                },
                Next: function() {
                    if (_content) {
                        var albumList = _content.find('[rel="album_list"]');
                        var focusLi = albumList.find(".focus");
                        if (focusLi.length && focusLi.attr("tid") != "-1") {
                            var tid = focusLi.attr("tid");
                            var alFileList = _content.find('[rel="album_file_list"]');
                            var clds = alFileList.children();
                            if (clds.length) {
                                var fm = alFileList.find(".focus");
                                var node;
                                if (fm.length) {
                                    node = fm.next().not("[add_music]");
                                    if (!node.length) {
                                        node = $(clds[0])
                                    }
                                } else {
                                    node = $(clds[0])
                                }
                                var mid = node.attr("mid");
                                if (mid) {
                                    return getMInfo(mid)
                                }
                            }
                        }
                    }
                    return false
                },
                Prev: function() {
                    if (_content) {
                        var albumList = _content.find('[rel="album_list"]');
                        var focusLi = albumList.find(".focus");
                        if (focusLi.length && focusLi.attr("tid") != "-1") {
                            var tid = focusLi.attr("tid");
                            var alFileList = _content.find('[rel="album_file_list"]');
                            var clds = alFileList.children().not("[add_music]");
                            if (clds.length) {
                                var fm = alFileList.find(".focus");
                                var node;
                                if (fm.length) {
                                    node = fm.prev().not("[add_music]");
                                    if (!node.length) {
                                        node = $(clds[clds.length - 1])
                                    }
                                } else {
                                    node = $(clds[0])
                                }
                                var mid = node.attr("mid");
                                if (mid) {
                                    return getMInfo(mid)
                                }
                            }
                        }
                    }
                    return false
                }
            };
            jPlayerProxy.Action.SetMode(1);
            _content.find("[btn='clear']").on("click", function() {
                clear();
                return false
            });
            _content.find("[btn='add_album']").on("click", function() {
                Core.CloudMusic.AddCate(function(info) {
                });
                return false
            });
            _content.find('[btn="min_back"]').on("click", function() {
                _content.fadeOut();
                return false
            });
            _content.find('[btn="close_back"]').on("click", function() {
                jPlayerProxy.Stop();
                _content.fadeOut();
                return false
            });
            var albumList = _content.find('[rel="album_list"]');
            albumList.delegate("[btn]", "click", function() {
                var el = $(this);
                var par = el.parents("[tid]");
                var tid = par.attr("tid");
                switch (el.attr("btn")) {
                case "rename":
                    Core.CloudMusic.EditCate(tid, function(r) {
                    });
                    break;
                case "delcate":
                    Core.CloudMusic.DelCate(tid, function(r) {
                        if (r) {
                            var albumList = _content.find('[rel="album_list"]');
                            var li = albumList.find('[tid="' + tid + '"]');
                            if (li.length) {
                                if (li.hasClass("focus")) {
                                    selectAlbum("-1")
                                }
                                li.empty().remove()
                            }
                        }
                    });
                    break
                }
                return false
            });
            albumList.delegate("li", "mouseover", function() {
                var em = $(this).find("em");
                em.is(":hidden") && em.show();
                return false
            }).delegate("li", "mouseleave", function() {
                var em = $(this).find("em");
                !em.is(":hidden") && em.hide();
                return false
            }).delegate("li", "click", function() {
                var tid = $(this).attr("tid");
                selectAlbum(tid);
                return false
            });
            var alFileList = _content.find('[rel="album_file_list"]');
            alFileList.delegate("li[mid]", "click", function() {
                var mid = $(this).attr("mid");
                jPlayerProxy.PlayOutLink(getMInfo(mid));
                return false
            }).delegate("[btn]", "click", function() {
                var el = $(this);
                var par = el.parents("[mid]");
                switch (el.attr("btn")) {
                case "download":
                    Core.FileAPI.Download(par.attr("pick_code"));
                    break;
                case "add_cloud":
                    var fid = par.attr("fid");
                    changeAlbum(el, fid);
                    break;
                case "delete":
                    var mid = par.attr("mid");
                    var tid = par.attr("tid");
                    Core.CloudMusic.DelFile(tid, mid, function(info) {
                        if (info) {
                            var alFileList = _content.find('[rel="album_file_list"]');
                            var li = alFileList.find('[mid="' + mid + '"]');
                            if (li.length) {
                                li.empty().remove()
                            }
                        }
                    });
                    break
                }
                return false
            }).delegate("[add_music]", "click", function() {
                var tid = $(this).attr("tid");
                Core.FileSelectDG.Open(function(list) {
                    var fids = [];
                    for (var i = 0, len = list.length; i < len; i++) {
                        var item = list[i];
                        fids.push(item.file_id)
                    }
                    Core.CloudMusic.AddFileList(tid, fids, function(list) { selectAlbum(tid) })
                }, { filter: 13, btn_txt: "确定", select_txt: "添加" });
                return false
            })
        };
        var selectAlbum = function(tid, arr) {
            var albumList = _content.find('[rel="album_list"]');
            if (tid == -2) {
                var focusLi = albumList.find(".focus");
                if (focusLi.length) {
                    tid = focusLi.attr("tid")
                } else {
                    var l = albumList.find("li[tid]").not('[tid="-1"]');
                    if (l.length) {
                        tid = $(l[0]).attr("tid")
                    } else {
                        tid = "-1"
                    }
                }
                window.setTimeout(function() { _content.find('[btn="list"]').click() }, 50)
            }
            var el = albumList.find('li[tid="' + tid + '"]');
            el.parent().find(".focus").removeClass("focus");
            el.addClass("focus");
            var listBox = _content.find('[rel="list"]');
            var alFileList = _content.find('[rel="album_file_list"]');
            var clearBtn = _content.find('[btn="clear"]');
            if (tid == "-1") {
                listBox.show();
                alFileList.hide();
                clearBtn.show()
            } else {
                alFileList.html("");
                Core.CloudMusic.GetFileList(tid, function(data) {
                    for (var k in data) {
                        var item = data[k];
                        _urls[item.id] = item;
                        var className = "";
                        if (_ac_out_obj && _ac_out_obj.tid == item.topic_id && _ac_out_obj.key == item.id) {
                            className = ' class="focus"'
                        }
                        alFileList.append(String.formatmodel('<li pick_code="{pick_code}"' + className + ' mid="{id}" fid="{file_id}" tid="{topic_id}"><span><a href="javascript:;">{file_name}</a></span><em><a href="javascript:;" class="mu-playlist" btn="add_cloud">加入播放列表</a><a href="javascript:;" class="mu-download" btn="download">下载</a><a href="javascript:;" class="mu-delete" btn="delete">删除</a></em></li>', item))
                    }
                    alFileList.append('<li tid="' + tid + '" add_music="1"><a href="javascript:;" style="color:#777;">+点击这里，添加更多音乐</a></li>');
                    if (arr && arr.length) {
                        var file = arr[0];
                        var li = alFileList.find('[pick_code="' + file.attr("pick_code") + '"]');
                        if (!li.hasClass("focus")) {
                            window.setTimeout(function() { li.click() }, 10)
                        }
                    }
                });
                listBox.hide();
                alFileList.show();
                clearBtn.hide()
            }
        };
        var addMusic = function(arr, isplay) {
            var newArr = [];
            var hasNode;
            for (var i = 0, len = arr.length; i < len; i++) {
                var item = arr[i];
                var pick_code = item.pick_code;
                var node = _content.find("[rel='list'] [pick_code='" + pick_code + "']");
                if (!node.length) {
                    newArr.push(item)
                } else {
                    if (!hasNode) {
                        hasNode = node
                    }
                }
            }
            if (newArr.length) {
                jPlayerProxy.Add(arr, isplay)
            } else {
                if (hasNode) {
                    if (_cache.old_odd && _cache.old_odd.attr("key") != hasNode.attr("key")) {
                        jPlayerProxy.Play(hasNode.attr("key"))
                    } else {
                        jPlayerProxy.OnlyPlay()
                    }
                }
            }
        };
        var create = function() {
            if (!_content) {
                Util.Style.IncludeCss("preview_css", "static/style_v2013/css/preview_box.css?v=118");
                _content = $(_html);
                $(document.body).append(_content);
                if (!_is_create) {
                    initPlay()
                }
                _is_create = true
            }
        };
        var play = function(arr, isplay, is_album, tid, callback) {
            if (!_is_create) {
                if (_isLoading) {
                    return
                }
                _isLoading = true;
                Util.Load.JS(Core.CONFIG.JSPath.JPlayer, function() {
                    Util.Load.JS(Core.CONFIG.JSPath.JPProxy, function() {
                        create();
                        Core.CloudMusic.AddClient({
                            AddCate: function(cateInfo, allCates) {
                                var listBox = _content.find('[rel="album_list"]');
                                listBox.append(String.formatmodel('<li tid="{topic_id}"><span>{topic_name}</span><em style="display:none;"><a href="javascript:;" btn="rename" class="mu-edit">重命名</a><a href="javascript:;" btn="delcate" class="mu-remove">移除</a></em></li>', cateInfo))
                            },
                            RenameCate: function(cateInfo, callCates) {
                                var listBox = _content.find('[rel="album_list"]');
                                var li = listBox.find('li[tid="' + cateInfo.topic_id + '"]');
                                li.find("span").html(cateInfo.topic_name)
                            }
                        });
                        Core.CloudMusic.GetCate(function(album) {
                            _isLoading = false;
                            var listBox = _content.find('[rel="album_list"]');
                            listBox.append('<li tid="-1"><span>试听列表</span></li>');
                            for (var k in album) {
                                listBox.append(String.formatmodel('<li tid="{topic_id}"><span>{topic_name}</span><em style="display:none;"><a href="javascript:;" btn="rename" class="mu-edit">重命名</a><a href="javascript:;" btn="delcate" class="mu-remove">移除</a></em></li>', album[k]))
                            }
                            if (is_album) {
                                selectAlbum(tid, arr)
                            } else {
                                selectAlbum("-1");
                                addMusic(arr, isplay)
                            }
                        });
                        callback && callback()
                    })
                })
            } else {
                if (!is_album) {
                    selectAlbum("-1")
                }
                addMusic(arr, isplay);
                callback && callback()
            }
        };
        var _minIco, _floatDom;
        var minFloat = function(fileDom) {
            if (_minIco && _minIco.length) {
                var l = $(document).width() / 2, t = $(document).height() / 2;
                if (fileDom) {
                    l = fileDom.offset().left + (fileDom.width() / 2), t = (fileDom.offset().top + 38 + (fileDom.height() / 2))
                }
                if (!_floatDom) {
                    _floatDom = $('<div class="music-float" style="display:none;z-index:10"></div>');
                    $(document.body).append(_floatDom)
                }
                var endT = 0, endL = 0;
                endT = _minIco.offset().top + 38;
                endL = _minIco.offset().left;
                _floatDom.show().css({ left: l, top: t }).animate({ left: endL, top: endT }, 600, function() { _floatDom.hide() })
            }
        };
        var checkIsPlay = function() {
            if (_content) {
                var aniBtn = _content.find(".music-animate");
                var ico = _minIco.find("i");
                if (aniBtn.hasClass("animate-playing")) {
                    ico.addClass("playing")
                } else {
                    ico.removeClass("playing")
                }
            }
        };
        return {
            Open: function(arr, isplay, is_album, tid, notshow) {
                play(arr, isplay, is_album, tid, function() {
                    if (!notshow) {
                        _content.fadeIn()
                    }
                })
            },
            SetMusicICO: function(ico) {
                _minIco = ico;
                checkIsPlay()
            },
            Min: function(dom) {
                Util.Style.IncludeCss("preview_css", "static/style_v62/css/preview_box.css?v=117");
                minFloat(dom)
            }
        }
    })()
})();
Core.FileAjax = (function() {
    return {
        AllowCollect: function(list, is_collect) {
            if (is_collect == 0 && !Core.FilePermission.Vip()) {
                Core.VIPNotice.Upgrade();
                return false
            }
            var file_ids = [];
            for (var i = 0, len = list.length; i < len; i++) {
                var item = list[i];
                file_ids.push(item.attr("file_id"))
            }
            $.ajax({
                url: "?ct=file&ac=is_collect", type: "POST", data: { tid: file_ids.join(","), is_collect: is_collect }, dataType: "json", cache: false,
                success: function(r) {
                    if (r.state) {
                        Core.MinMessage.Show({ text: "设置成功", type: "suc", timeout: Core.CONFIG.MsgTimeout });
                        Core.FileConfig.DataAPI.AllowCollect(Core.FileConfig.aid, Core.FileConfig.cid, is_collect, list)
                    } else {
                        Core.MinMessage.Show({ text: r.msg, type: "err", timeout: Core.CONFIG.MsgTimeout })
                    }
                }
            })
        },
        Star: function(tid, is_star, callback) {
            var data = { };
            data.tid = tid;
            data.is_star = is_star;
            $.ajax({
                url: "?ct=file&ac=star", data: data, dataType: "json", type: "POST",
                success: function(r) {
                    if (r.state) {
                        if (callback) {
                            callback(tid, is_star)
                        }
                    } else {
                        Core.MinMessage.Show({ text: r.msg, type: "err", timeout: Core.CONFIG.MsgTimeout })
                    }
                }
            })
        },
        SendFolder: function(users, stime, aid, cid, desc, codeObj, callback) {
            var userData = [];
            userData.push("aid=" + aid);
            userData.push("cid=" + cid);
            userData.push("stime=" + stime);
            var ind = 0;
            for (var k in users) {
                userData.push("user_id[" + ind + "]=" + k + "&user_name[" + ind + "]=" + encodeURIComponent(users[k].user_name) + "&sign[" + ind + "]=" + users[k].sign);
                ind++
            }
            userData.push("body=" + encodeURIComponent(desc));
            if (codeObj.has_code) {
                userData.push("msg_code=" + codeObj.code)
            }
            Core.MinMessage.Show({ text: "文件夹发送中...", type: "load", timeout: Core.CONFIG.MsgTimeout });
            $.getScript(Core.CONFIG.Path.Msg + "/?ac=send&js_return=msg_callback_field&" + userData.join("&"), function() {
                if (window.msg_callback_field) {
                    var r = window.msg_callback_field;
                    if (r.state) {
                        Core.MinMessage.Show({ text: "文件夹已成功发送", type: "suc", timeout: Core.CONFIG.MsgTimeout })
                    } else {
                        Core.MinMessage.Show({ text: r.message, type: "err", timeout: Core.CONFIG.MsgTimeout })
                    }
                    if (callback) {
                        callback(r)
                    }
                }
            })
        },
        SendFile: function(users, stime, tids, aids, cids, desc, codeObj, callback) {
            var userData = [];
            userData.push("aid=" + aids.join(","));
            userData.push("cid=" + cids.join(","));
            userData.push("file_id=" + tids.join(","));
            userData.push("stime=" + stime);
            var ind = 0;
            for (var k in users) {
                userData.push("user_id[" + ind + "]=" + k + "&user_name[" + ind + "]=" + encodeURIComponent(users[k].user_name) + "&sign[" + ind + "]=" + users[k].sign);
                ind++
            }
            userData.push("body=" + encodeURIComponent(desc));
            if (codeObj.has_code) {
                userData.push("msg_code=" + codeObj.code)
            }
            Core.MinMessage.Show({ text: "文件发送中...", type: "load", timeout: Core.CONFIG.MsgTimeout });
            $.getScript(Core.CONFIG.Path.Msg + "/?ac=send&js_return=msg_callback_field&" + userData.join("&"), function() {
                if (window.msg_callback_field) {
                    var r = window.msg_callback_field;
                    if (r.state) {
                        Core.MinMessage.Show({ text: "文件已成功发送", type: "suc", timeout: Core.CONFIG.MsgTimeout })
                    } else {
                        Core.MinMessage.Show({ text: r.message, type: "err", timeout: Core.CONFIG.MsgTimeout })
                    }
                    if (callback) {
                        callback(r)
                    }
                }
            })
        },
        _rbPassWord: function(callback, tids) {
            var rbSetting = Core.FileAjax.RBPassWordSet();
            if (rbSetting && rbSetting.SafeMode) {
                switch (rbSetting.SafeMode) {
                case 1:
                    if (rbSetting.HasPass) {
                        var passwordCon = $('<div class="dialog-input"><label for="js_write_rb_pwd_txt">请输入安全密码：</label><input type="password" id="js_write_rb_pwd_txt" class="text" rel="txt"><div class="confirm-bottom"><a href="' + Core.CONFIG.Path.PASS + '/?ct=security&ac=passwd" target="_blank">找回安全密码</a></div></div><div class="dialog-bottom"><div class="con"><a href="javascript:;" class="button" btn="confirm">确定</a></div></div>');
                        var passwordBox = new Core.DialogBase({ title: "请输入安全密码", content: passwordCon });
                        passwordBox.Open(function() { passwordBox.warp.find("[rel='goto_set_pwd']").unbind("click").bind("click", function() { window.setTimeout(function() { passwordBox.Close() }, 10) }) });
                        passwordCon.find("[btn]").bind("click", function(e) {
                            switch ($(this).attr("btn")) {
                            case "confirm":
                                if (callback) {
                                    callback(passwordCon.find("[rel='txt']").val(), function() { passwordBox.Close() })
                                }
                                break;
                            case "cancel":
                                passwordBox.Close();
                                break
                            }
                            return false
                        });
                        passwordCon.find("[rel='txt']").keydown(function(e) {
                            if (e.keyCode == 13) {
                                if (callback) {
                                    callback(passwordCon.find("[rel='txt']").val(), function() { passwordBox.Close() })
                                }
                            } else {
                                if (e.keyCode == 27) {
                                    passwordBox.Close()
                                }
                            }
                        });
                        passwordCon.find("[rel='txt']")[0].focus()
                    } else {
                        Core.Message.Confirm({
                            text: "您没有设置安全密码", type: "war", confirm_text: "马上设置", confirm_link: Core.CONFIG.Path.PASS + "/?ct=security&ac=passwd",
                            callback: function(r) {
                                if (r) {
                                    window.setTimeout(function() {
                                        Core.Message.Confirm({
                                            text: "您已经设置了安全密码了吗？", type: "inf", confirm_text: "我已设置了", cancel_text: "以后再设置",
                                            callback: function(r) {
                                                if (r) {
                                                    Core.FileConfig.DataAPI && Core.FileConfig.DataAPI.Refresh()
                                                }
                                            }
                                        })
                                    }, 100)
                                }
                            }
                        })
                    }
                    return;
                    var data = { };
                    if (tids) {
                        for (var i = 0, len = tids.length; i < len; i++) {
                            data["file_ids[" + i + "]"] = tids[i]
                        }
                    } else {
                        data.file_ids = ""
                    }
                    $.ajax({
                        data: data, url: "?ct=rb&ac=sms_delete", type: "POST", dataType: "json",
                        success: function(r) {
                            if (r.state) {
                                Core.RBSmsListenDG.Show(r.sms)
                            } else {
                                Core.MinMessage.Show({ text: r.message, type: "err", timeout: 2000 })
                            }
                        }
                    });
                    break
                }
            } else {
                Core.Message.Confirm({
                    text: "确认要永久删除文件吗？", content: "如果点击确定，文件将被彻底删除，无法恢复！", type: "inf",
                    callback: function(r) {
                        if (r) {
                            if (callback) {
                                callback("")
                            }
                        }
                    }
                })
            }
            return
        },
        RBPassWordSet: false,
        ClearRB: function(aid, cid) {
            Core.FileAjax._rbPassWord(function(input, hideFun) {
                $.ajax({
                    url: "?ct=rb&ac=clean", type: "POST", dataType: "json", data: { recycle_pass: input },
                    success: function(r) {
                        if (r.state) {
                            if (Core.FileConfig.DataAPI) {
                                Core.FileConfig.DataAPI.Reload(7, 0)
                            }
                            if (hideFun) {
                                hideFun()
                            }
                            window.setTimeout(function() { Core.MinMessage.Show({ text: "成功清空回收站", type: "suc", timeout: Core.CONFIG.MsgTimeout }) }, 500);
                            Core.CountSync.Sync();
                            Core.SpaceData.Sync()
                        } else {
                            Core.MinMessage.Show({ text: r.msg, type: "err", timeout: Core.CONFIG.MsgTimeout })
                        }
                    }
                })
            })
        },
        OneKeyRenew: function(win) {
            var url = "?ct=file&ac=share";
            $.ajax({
                url: url, type: "POST", dataType: "json", data: { aid: 0, cid: 0, is_batch: 1 },
                success: function(r) {
                    if (r.state) {
                        try {
                            if (Core.FileConfig.DataAPI) {
                                Core.FileConfig.DataAPI.Reload()
                            }
                        } catch(e) {
                        }
                        Core.MinMessage.Show({ text: "续期成功", type: "suc", window: win, timeout: Core.CONFIG.MsgTimeout })
                    } else {
                        Core.MinMessage.Show({ text: "续期失败", type: "err", window: win, timeout: Core.CONFIG.MsgTimeout })
                    }
                }
            })
        },
        DeleteRB: function(tids, win) {
            Core.FileAjax._rbPassWord(function(input, hideFun) {
                $.ajax({
                    url: "?ct=rb&ac=del", type: "POST", dataType: "json", data: { tid: tids.join(","), recycle_pass: input },
                    success: function(r) {
                        if (r.state) {
                            if (Core.FileConfig.DataAPI) {
                                Core.FileConfig.DataAPI.Reload(7, 0)
                            }
                            window.setTimeout(function() { Core.MinMessage.Show({ text: "成功删除回收站文件", type: "suc", timeout: Core.CONFIG.MsgTimeout }) }, 500);
                            Core.CountSync.Sync();
                            Core.SpaceData.Sync();
                            if (hideFun) {
                                hideFun()
                            }
                        } else {
                            Core.MinMessage.Show({ text: r.msg, type: "err", timeout: Core.CONFIG.MsgTimeout })
                        }
                    }
                })
            }, tids)
        },
        RestoreRB: function(tids, win) {
            Core.Message.Confirm({
                text: "确认要还原选中的文件吗？", type: "inf",
                callback: function(r) {
                    if (r) {
                        $.ajax({
                            url: "/index.php?ct=rb&ac=revert", type: "POST", dataType: "json", data: { tid: tids.join(",") },
                            success: function(result) {
                                var sucState = true;
                                for (var k in result.data) {
                                    if (!result.data[k].state) {
                                        sucState = false
                                    }
                                }
                                if (Core.FileConfig.DataAPI) {
                                    Core.FileConfig.DataAPI.Reload(7, 0)
                                }
                                Core.CountSync.Sync();
                                Core.MinMessage.Show({ text: "还原成功", type: "suc", timeout: Core.CONFIG.MsgTimeout })
                            }
                        })
                    }
                },
                win: win
            })
        },
        EditCover: function(aid, cid, tid, callback) {
            $.ajax({
                url: "?ct=dir&ac=edit_cover", type: "POST", dataType: "json", data: { tid: tid, aid: aid, cid: cid },
                success: function(result) {
                    if (result.state) {
                        if (Core.FileConfig.DataAPI) {
                            Core.FileConfig.DataAPI.Reload()
                        }
                    }
                    if (callback) {
                        callback(result)
                    }
                }
            })
        },
        DeleteCover: function(aid, cid, callback) {
            $.ajax({
                url: "?ct=dir&ac=del_cover", type: "POST", dataType: "json", data: { aid: aid, cid: cid },
                success: function(result) {
                    if (result.state) {
                        if (Core.FileConfig.DataAPI) {
                            Core.FileConfig.DataAPI.Reload()
                        }
                    }
                    if (callback) {
                        callback(result)
                    }
                }
            })
        }
    }
})();
Core.FileAPI = (function() {
    return {
        CheckFileType: function(fileDom) {
            var type = "";
            var suffix = "";
            var fileName = fileDom.find("[field='file_name']").attr("title");
            if (fileName.lastIndexOf(".") != -1) {
                suffix = fileName.substring(fileName.lastIndexOf("."), fileName.length).replace(".", "")
            }
            for (var k in window.UPLOAD_CONFIG) {
                var item = window.UPLOAD_CONFIG[k];
                if (typeof item.upload_type_limit == "object" && $.inArray(suffix.toLowerCase(), item.upload_type_limit) != -1) {
                    type = k;
                    break
                }
            }
            return type
        },
        OpenVideo: function(pick_code) {
            var url = "/?ct=play&ac=location&pickcode=" + pick_code;
            this.OpenNewWindow(url)
        },
        OpenDoc: function(pick_code) {
            var url = "/?ct=preview&ac=location&pickcode=" + pick_code;
            this.OpenNewWindow(url)
        },
        ListenMusic: function(pick_code, fileDom, isopen, errcallback) {
            var makeMusicInfo = function(fileDom, url) {
                var pick_code = fileDom.attr("pick_code");
                var obj = { };
                obj.pick_code = pick_code;
                obj.name = fileDom.find("[field='file_name']").attr("title");
                obj.mp3 = url;
                obj.aid = fileDom.attr("area_id");
                obj.cid = fileDom.attr("p_id");
                obj.is_share = fileDom.attr("is_share");
                obj.file_type = fileDom.attr("file_type");
                obj.file_id = fileDom.attr("file_id");
                return obj
            };
            var makeMusic = function(list, r) {
                var arr = [];
                for (var i = 0, len = list.length; i < len; i++) {
                    var fileDom = list[i];
                    var pick_code = fileDom.attr("pick_code");
                    if (r.data[pick_code]) {
                        arr.push(makeMusicInfo(fileDom, r.data[pick_code]["url"]))
                    }
                }
                return arr
            };
            $.ajax({
                data: { flag: 4, pick_code: pick_code }, url: "?ct=app&ac=get", type: "GET", dataType: "json", cache: false,
                success: function(r) {
                    if (r.state) {
                        var arr = makeMusic([fileDom], r);
                        Core.MusicPlayer.Open(arr, true, false, undefined, isopen ? false : true)
                    } else {
                        errcallback && errcallback()
                    }
                }
            })
        },
        DownloadDir: function(list, ele) {
            ele.attr("target", "");
            ele.attr("href", "javascript:;");
            if (list.length) {
                var item = list[0];
                if (item.attr("file_type") == "0" && item.attr("pick_code")) {
                    var url = Core.CONFIG.Path.U + "?ct=browser&ac=download_folder&pickcode=" + item.attr("pick_code");
                    ele.attr("href", url)
                }
            }
        },
        GetSelFilesData: function(arr) {
            var data = { aid: Core.FileConfig.aid, pid: Core.FileConfig.cid };
            var tids = [];
            var cids = [];
            for (var i = 0, len = arr.length; i < len; i++) {
                var item = arr[i];
                if (item.attr("file_type") == "1") {
                    tids.push(item.attr("file_id"))
                } else {
                    if (item.attr("file_type") == "0") {
                        cids.push(item.attr("cate_id"))
                    }
                }
            }
            if (tids.length) {
                data.tid = tids.join(",")
            }
            if (cids.length) {
                data.cid = cids.join(",")
            }
            return data
        },
        _DownloadWin: false,
        RenewAll: function(callback) {
            if (Core.FilePermission.Vip()) {
                Core.Message.Confirm({
                    text: "您是否要一键续期所有分享文件?", content: "您是尊贵的VIP贵宾，您不但拥有超长分享期限，点击“立即续期”即可续期您曾经分享的所有文件。", title: "一键续期提醒", type: "war",
                    callback: function(r) {
                        if (r) {
                            Core.MinMessage.Show({ text: "正续期文件...", type: "load", timeout: 10000 });
                            $.ajax({
                                url: "?ct=file&ac=one_key_renew", type: "GET", dataType: "json",
                                success: function(r) {
                                    if (r.state) {
                                        Core.MinMessage.Show({ text: "续期成功", type: "suc", timeout: Core.CONFIG.MsgTimeout });
                                        callback && callback()
                                    } else {
                                        Core.MinMessage.Show({ text: "续期失败", type: "err", timeout: Core.CONFIG.MsgTimeout })
                                    }
                                }
                            })
                        }
                    }
                })
            } else {
                Core.VIPNotice.Upgrade()
            }
        },
        ShareTO: function(list, perm) {
            var len = list.length;
            var shareCount = 0, fileCount = 0, folderCount = 0, aid;
            for (var k in list) {
                if (Number(list[k].attr("is_share"))) {
                    shareCount++
                }
                if (list[k].attr("file_type") == "1") {
                    fileCount++
                } else {
                    folderCount++
                }
                if (!aid) {
                    aid = list[k].attr("area_id")
                }
            }
            perm.share = true;
            if (perm.share || perm.weibo) {
                if (folderCount && !fileCount) {
                    if (Core.FilePermission.SharedDir(aid)) {
                        Core.SendFileDG.Open(list, "file");
                        return
                    }
                } else {
                    Core.SendFileDG.Open(list, "file");
                    return
                }
            }
            if (perm.send || perm.q || perm.mail || perm.mobile) {
                Core.SendFileDG.Open(list, "friend");
                return
            }
        },
        Download: function(pick_code, win) {
            if (Core.SpaceData.IsNoSpace() && Core.FilePermission.VipExpLimit()) {
                Core.VIPNotice.Upgrade();
                return
            }
            var url = Core.CONFIG.Path.OS + "?ct=pickcode&ac=download&pickcode=" + pick_code + "&_t=" + new Date().getTime();
            var con = $('<div class="dialog-frame" style="height:240px"><iframe frameborder=0 src="' + url + '"></iframe></div>');
            Core.FileAPI._DownloadWin = new Core.DialogBase({ title: "文件快速下载", content: con, width: 530 });
            Core.FileAPI._DownloadWin.Open(function() { Core.FileAPI._DownloadWin.warp.addClass("easy-download") }, win)
        },
        DownloadURI: function(url, win) {
            var con = $('<div class="dialog-frame" style="height:240px"><iframe frameborder=0 src="' + url + '"></iframe></div>');
            Core.FileAPI._DownloadWin = new Core.DialogBase({ title: "文件快速下载", content: con, width: 530 });
            Core.FileAPI._DownloadWin.Open(function() { Core.FileAPI._DownloadWin.warp.addClass("easy-download") }, win)
        },
        OpenNewWindow: function(url) {
            var form = document.createElement("form");
            form.action = url;
            form.target = "_blank";
            form.method = "post";
            document.body.appendChild(form);
            form.submit();
            window.setTimeout(function() { document.body.removeChild(form) }, 30)
        },
        DownloadList: function(items) {
            var uDown;
            try {
                uDown = new ActiveXObject("UDiskAgent.UDiskAgentObj")
            } catch(e) {
                Core.Message.Confirm({ text: "您还没有安装“115网盘”专用软件", content: "本资源需要先安装115网盘专属客户端才能够实现高速下载。请点击“确定”，立即下载该软件！", type: "war", confirm_link: "http://chrome.115.com" });
                return false
            }
            var arr = [];
            arr.push(Core.CONFIG.Path.OS);
            for (var i = 0, len = items.length; i < len; i++) {
                var item = items[i];
                arr.push(item.url + ";" + encodeURIComponent(item.file_name))
            }
            try {
                uDown.DownAllLink2(arr.join("|"))
            } catch(e) {
                Core.Message.Confirm({ text: "您还没有安装“115网盘”专用软件", content: "本资源需要先安装115网盘专属客户端才能够实现高速下载。请点击“确定”，立即下载该软件！", type: "war", confirm_link: "http://chrome.115.com" });
                return false
            }
            return true
        },
        UDownDownload: function(list) {
            if (list && list.length) {
                var arr = [];
                for (var i = 0, len = list.length; i < len; i++) {
                    var item = list[i];
                    var url = Core.CONFIG.Path.OS + ((item.attr("file_type") == "1") ? "file/" : "folder/") + item.attr("pick_code");
                    arr.push({ url: url, file_name: item.find('[field="file_name"]').attr("title") })
                }
                Core.FileAPI.DownloadList(arr)
            } else {
                Core.MinMessage.Show({ text: "请先选择文件", type: "war", timeout: Core.CONFIG.MsgTimeout })
            }
        },
        Notice: function(nid) {
            var url = "?ct=notice&ac=notice_list&nid=" + nid + "&s=0&_t=" + new Date().getTime();
            var con = $('<iframe style="width:100%; height:500px; background:#fff;" frameborder=0 src="' + url + '"></iframe>');
            var noticeBox = new Core.DialogBase({ title: "系统公告", content: con, width: 800 });
            noticeBox.Open(function() { noticeBox.warp.addClass("notice-box") })
        },
        EditSyncFileName: function(obj) {
            if (obj.type == "f") {
                if (obj.fileName.lastIndexOf(".") == -1) {
                    obj.suffix = ""
                } else {
                    var name = obj.fileName.substring(0, obj.fileName.lastIndexOf("."));
                    obj.suffix = obj.fileName.substring(obj.fileName.lastIndexOf("."));
                    obj.fileName = name
                }
            } else {
                obj.suffix = ""
            }
            var editCon = $('<div class="dialog-input"><input type="text" rel="txt" class="text" value="' + obj.fileName + '" /></div><div class="dialog-bottom"><div class="con"><a href="javascript:;" class="button" btn="confirm">确定</a></div></div>');
            var editBox = new Core.DialogBase({ title: "重命名", content: editCon });
            editBox.Open(null);
            editCon.find("[rel='txt']").val(obj.fileName);
            var renameFolderFun = function(e) {
                var model = e.data.model;
                var input = editCon.find("[rel='txt']");
                var vals = $.trim(input.val());
                if (vals == "") {
                    Core.MinMessage.Show({ text: "请输入内容", timeout: Core.CONFIG.MsgTimeout, type: "err" });
                    input.focus();
                    return
                }
                model.fileName = vals + model.suffix;
                var newPath = model.path + model.fileName;
                if (model.callback) {
                    model.callback(model.key, newPath, function() { editBox.Close() })
                }
            };
            editCon.find("[rel='txt']").bind("keyup", { model: obj }, function(e) {
                if (e.keyCode == 13) {
                    renameFolderFun(e)
                } else {
                    if (e.keyCode == 27) {
                        editBox.Close()
                    }
                }
            });
            editCon.find("[btn]").bind("click", { model: obj }, function(e) {
                switch ($(this).attr("btn")) {
                case "confirm":
                    renameFolderFun(e);
                    break;
                case "cancel":
                    editBox.Close();
                    break
                }
                return false
            });
            editCon.find("[rel='txt']")[0].select()
        },
        MoveSyncFile: function(list, callback) {
            var id = list.find("input:checkbox").val();
            $.ajax({
                url: "?ct=file&ac=move_box", data: { aid: 1, cid: 0, id: id }, type: "POST",
                success: function(r) {
                    if (callback) {
                        callback()
                    }
                }
            })
        },
        GetCopyText: function(list) {
            var strArr = [];
            for (var i = 0, len = list.length; i < len; i++) {
                var item = list[i];
                var url = Core.CONFIG.Path.OS + ((item.attr("file_type") == "1") ? "file/" : "folder/") + item.attr("pick_code");
                var file_name;
                if (item.attr("file_type") == "1") {
                    file_name = item.find('[field="file_name"]').attr("title")
                } else {
                    file_name = item.attr("cate_name")
                }
                strArr.push(url + "#\r\n" + file_name)
            }
            return strArr.join("\r\n")
        },
        DeleteInterrupt: function(pick_code, tid, aid, cid) {
            Core.Message.Confirm({
                text: "确认要删除文件吗？", type: "war",
                callback: function(res) {
                    if (res) {
                        var data = { tid: tid, aid: aid, cid: cid };
                        $.ajax({
                            url: "?ct=file&ac=delete_interrupt", data: data, type: "POST", dataType: "json",
                            success: function(r) {
                                if (r.state) {
                                    Core.MinMessage.Show({ text: "删除成功", type: "suc", timeout: Core.CONFIG.MsgTimeout });
                                    Core.Upload.DeleteByPickCode(pick_code);
                                    if (Core.FileConfig.DataAPI) {
                                        Core.FileConfig.DataAPI.Reload()
                                    }
                                } else {
                                    Core.MinMessage.Show({ text: "删除失败", type: "suc", timeout: Core.CONFIG.MsgTimeout })
                                }
                            }
                        })
                    }
                }
            })
        }
    }
})();
Core.CountSync = (function() {
    var _rbDom, _count = 0;
    return {
        Get: function() { return _count }, Bind: function(rbDom) { _rbDom = rbDom },
        Sync: function() {
            if (_rbDom) {
                $.ajax({
                    url: "?ct=rb&ac=get_num", type: "GET", cache: false, dataType: "json",
                    success: function(r) {
                        try {
                            _count = r.count;
                            _rbDom.html(Number(r.count) ? r.count : "")
                        } catch(e) {
                        }
                    }
                })
            }
        }
    }
})();
var editorCallBack = function(content) {
    var box = document.getElementById(Core.CONFIG.EditTextArea);
    if (box) {
        box.value = content
    }
};
Core.FileDescDG = (function() {
    var _model = function() {
        var _self = this;
        var _cache_obj, _cache = { };
        var _content = $('<div class="editor-contents"><textarea id="' + Core.CONFIG.EditTextArea + '" style="display: none;" name=""></textarea><iframe id="js_ifrHtmlEditor" scrolling="no" style="position:absolute;top:0;right:0;bottom:0;left:0;width:100%;height:100%;overflow:hidden;border:0 none;" frameborder="0" border="0" name="ifrHtmlEditor" src=""></iframe></div><div class="dialog-bottom"><div class="dialog-status">填写资源描述，使资源更受欢迎！</div><div class="con"><a href="javascript:;" class="button" btn="confirm">确定</a></div></div>');
        Core.DialogBase.call(this, { content: _content, title: "修改文件备注", width: 600 });
        var _editorControl = (function() {
            var initState = false;
            var init = function() {
                if (!initState) {
                    initState = true;
                    document.getElementById("js_ifrHtmlEditor").src = Core.CONFIG.EditPath + "&bind=" + Core.CONFIG.EditTextArea + "&_t=" + new Date().getTime()
                }
            };
            return {
                Get: function() { return document.getElementById(Core.CONFIG.EditTextArea).value },
                Set: function(content) {
                    init();
                    document.getElementById(Core.CONFIG.EditTextArea).value = content;
                    window.setTimeout(function() { document.getElementById("js_ifrHtmlEditor").src = Core.CONFIG.EditPath + "&bind=" + Core.CONFIG.EditTextArea + "&_t=" + new Date().getTime() }, 10)
                },
                Height: function(value) {
                    if (value != undefined) {
                        $("#js_ifrHtmlEditor").height(value)
                    } else {
                        return $("#js_ifrHtmlEditor").height()
                    }
                }
            }
        })();
        this.Initial = function() {
            _editorControl.Height(310);
            _editDG.warp.addClass("property-editor");
            _content.find("[btn]").unbind("click").bind("click", function() {
                switch ($(this).attr("btn")) {
                case "confirm":
                    var desc = _editorControl.Get();
                    var data = { file_id: _cache_obj.file_id, file_desc: desc };
                    $.ajax({
                        url: "?ct=file&ac=edit", data: data, dataType: "json", type: "POST",
                        success: function(r) {
                            if (r.state) {
                                Core.MinMessage.Show({ text: "编辑成功", type: "suc", timeout: Core.CONFIG.MsgTimeout, window: Core.CONFIG.FileWindow });
                                if (Core.FileConfig.DataAPI) {
                                    Core.FileConfig.DataAPI.UpdateFile({ file_id: data.file_id, desc: data.file_desc })
                                }
                                _successCallback && _successCallback()
                            } else {
                                Core.MinMessage.Show({ text: r.msg, type: "err", timeout: Core.CONFIG.MsgTimeout, window: Core.CONFIG.FileWindow })
                            }
                        }
                    });
                    _self.Close();
                    break;
                case "cancel":
                    _self.Close();
                    break
                }
                return false
            })
        };
        var _closeEvent = _self.Close;
        this.Close = function() {
            $("#js_ifrHtmlEditor").attr("src", "");
            _closeEvent();
            _cache_obj = false
        };
        this.SetValue = function(obj) {
            _cache_obj = obj;
            _editorControl.Set(obj.value)
        }
    };
    var _editDG;
    var _successCallback;
    return {
        Show: function(obj) {
            _successCallback = obj.callback;
            if (!_editDG) {
                _editDG = new _model()
            }
            _editDG.Open(function() { _editDG.SetValue(obj) })
        }
    }
})();
Core.FileReNameDG = (function() {
    var _mod;
    var _model = function() {
        var _self = this, _cache = { };
        var _content = $('<div class="dialog-input"><input type="text" rel="file_name" class="text" /></div><div class="dialog-bottom"><div class="con"><a href="javascript:;" class="button" btn="confirm">确定</a></div></div>');
        Core.DialogBase.call(this, { content: _content, title: "重命名文件" });
        var renameFun = function() {
            var title = $.trim(_content.find('[rel="file_name"]').val());
            if (title == "") {
                Core.MinMessage.Show({ text: "请输入文件名", type: "war", timeout: Core.CONFIG.MsgTimeout, window: _self });
                _content.find('[rel="file_name"]').focus();
                return false;
                return
            }
            var data = { file_id: _cache.file_id, file_name: title + _cache.suffix };
            $.ajax({
                url: "?ct=file&ac=edit", data: data, dataType: "json", type: "POST",
                success: function(r) {
                    if (r.state) {
                        Core.MinMessage.Show({ text: "重命名成功", type: "suc", timeout: Core.CONFIG.MsgTimeout, window: Core.CONFIG.FileWindow });
                        if (Core.FileConfig.DataAPI) {
                            Core.FileConfig.DataAPI.UpdateFile({ file_id: data.file_id, file_name: r.data.file_name })
                        }
                    } else {
                        Core.MinMessage.Show({ text: r.msg, type: "err", timeout: Core.CONFIG.MsgTimeout, window: Core.CONFIG.FileWindow })
                    }
                }
            });
            _self.Close()
        };
        this.Initial = function() {
            _content.find("[rel='file_name']").bind("keydown", function(e) {
                if (e.keyCode == 13) {
                    renameFun()
                } else {
                    if (e.keyCode == 27) {
                        _self.Close()
                    }
                }
            });
            _content.find("[btn]").bind("click", function(e) {
                switch ($(this).attr("btn")) {
                case "confirm":
                    renameFun();
                    break;
                case "cancel":
                    _self.Close();
                    break
                }
                return false
            })
        };
        this.SetValue = function(file_id, file_name) {
            _cache.file_id = file_id;
            var title = file_name;
            if (title.indexOf(".") != -1) {
                _cache.suffix = title.substring(title.lastIndexOf("."), title.length);
                title = title.substring(0, title.lastIndexOf("."))
            } else {
                _cache.suffix = ""
            }
            _content.find('[rel="file_name"]').val(title);
            window.setTimeout(function() { _content.find('[rel="file_name"]').select() }, 20)
        }
    };
    return {
        Show: function(file_id, file_name) {
            if (!_mod) {
                _mod = new _model()
            }
            _mod.Open(function() { _mod.SetValue(file_id, file_name) })
        }
    }
})();
Core.FileSelectDG = (function() {
    var _dirCacheAid, _dirCacheCid, _dirCacheCname, _dirCachePath, _paths, _api = false;
    var moveQ = function(qid, list, is_talk, callback, pid) {
        var data = { };
        data.qid = qid;
        data.type = is_talk;
        if (pid !== undefined) {
            data.pid = pid;
            delete data.type
        }
        var i = 0;
        for (var k in list) {
            data["pickcodes[" + i + "]"] = list[k].pick_code;
            i++
        }
        $.ajax({
            url: "?ct=q&ac=move_q", data: data, type: "POST", dataType: "json",
            success: function(r) {
                if (r.state) {
                    var arr = [];
                    for (var k in r.data) {
                        arr.push(r.data[k])
                    }
                    callback && callback(arr)
                } else {
                    Core.MinMessage.Show({ text: r.msg, type: "err", timeout: 2000 })
                }
            }
        })
    };
    var moveQDir = function(qid, list, pid, callback) {
        var data = { };
        data.qid = qid;
        data.pid = pid;
        var cateIds = [];
        for (var k in list) {
            cateIds.push(list[k].cate_id)
        }
        data.cate_id = cateIds.join(",");
        $.ajax({ url: "?ct=q&ac=move_dir_q", data: data, type: "POST", dataType: "json", success: function(r) { callback && callback(r) } })
    };
    var _model = function() {
        var _self = this, _cache = { disClass: "btn-disabled" };
        var _content = $('<div><div class="dialog-frame"><iframe src="" frameborder="0" rel="js_iframe"></iframe></div><div class="dialog-bottom"><div class="con"><a href="javascript:;" class="button" btn="confirm">确定</a>' + (Core.Dir ? '<a href="javascript:;" class="button" btn="add_dir" data_title="新建文件夹"><i class="ico-btn ib-newdir"></i><em>新建文件夹</em></a>' : "") + '<input type="checkbox" id="js_selec_file_check_all" rel="check_all"><label for="js_selec_file_check_all" rel="check_all">全选</label></div></div></div>');
        Core.DialogBase.call(this, { title: "请选择文件", content: _content });
        var _frame = _content.find("[rel='js_iframe']");
        var changeURL = function(aid, cid, opt) {
            var select = 0, filter = "", nf = "", qid = "", select_dir = "";
            if (opt) {
                select = opt.select_one ? 1 : 0;
                filter = opt.filter ? opt.filter : "";
                nf = opt.nf ? opt.nf : "";
                qid = opt.qid_file ? opt.qid_file : "";
                select_dir = opt.select_dir ? 1 : 0
            }
            _api = false;
            var url = Core.CONFIG.Path.U + "/?ct=file&ac=userfile&ajax=1&qid=" + qid + "&select=" + select + "&nf=" + nf + "&filter=" + filter + "&select_dir=" + select_dir + "&aid=" + aid + "&cid=" + cid + "&_t=" + new Date().getTime();
            _frame.attr("src", "");
            _frame.attr("src", url)
        };
        this.Initial = function() {
            _self.warp.addClass("file-select");
            window.DBLClick_BACK = function(node) {
                _cache.list = [node];
                _content.find("[btn='confirm']").click()
            };
            _self.warp.find("[rel='check_all']").on("click", function() {
                if (_api.SelectAll) {
                    $(this).attr("checked") ? _api.SelectAll() : _api.CancelSelect()
                }
            });
            _content.find("[btn]").off("click").on("click", function() {
                switch ($(this).attr("btn")) {
                case "add_dir":
                    if (_dirCacheAid) {
                        Core.Dir.Create(_dirCacheAid, _dirCacheCid, function(r) {
                            if (r.state) {
                                changeURL(_dirCacheAid, r.cid, { select_one: _cache.select_one, filter: _cache.filter, nf: _cache.nf, qid_file: _cache.qid_file })
                            }
                        })
                    }
                    break;
                case "confirm":
                    if (_cache.nf) {
                        if (_dirCacheAid === false) {
                            Core.MinMessage.Show({ text: "请等待进入文件夹", timeout: Core.CONFIG.MsgTimeout, window: _self });
                            return
                        }
                    } else {
                        if (!_cache.list || !_cache.list.length) {
                            Core.MinMessage.Show({ text: "请选择文件", timeout: Core.CONFIG.MsgTimeout, window: _self });
                            return
                        }
                    }
                    switch (_cache.type) {
                    case "cover":
                        Core.FileAjax.EditCover(_cache.cover_aid, _cache.cover_cid, _cache.list[0].attr("file_id"), function(r) {
                            if (r.state) {
                                Core.MinMessage.Show({ text: "修改成功", type: "suc", timeout: Core.CONFIG.MsgTimeout });
                                if (Core.FileConfig.DataAPI) {
                                    Core.FileConfig.DataAPI.EditCover({ cate_id: _cache.cover_cid, img_url: r.img_url })
                                }
                            } else {
                                Core.MinMessage.Show({ text: r.msg, type: "err", timeout: Core.CONFIG.MsgTimeout })
                            }
                            _self.Close()
                        });
                        break;
                    case "q":
                        if (_cache.nf) {
                        } else {
                            var res = { };
                            var dirRes = [];
                            for (var i = 0, len = _cache.list.length; i < len; i++) {
                                var item = _cache.list[i];
                                if (item.attr("file_type") == "1") {
                                    var obj = { file_id: item.attr("file_id"), file_size: item.attr("file_size"), file_name: item.find('[field="file_name"]').attr("title"), aid: item.attr("area_id"), cid: item.attr("p_id"), ico: item.attr("ico"), sha1: item.attr("sha1"), pick_code: item.attr("pick_code"), path: item.attr("path") };
                                    res[obj.pick_code] = obj
                                } else {
                                    dirRes.push({ cate_id: item.attr("cate_id"), cate_name: item.attr("cate_name") })
                                }
                            }
                            moveQ(_cache.qid, res, _cache.is_talk, function(arr) {
                                if (dirRes.length) {
                                    window.setTimeout(function() {
                                        moveQDir(_cache.qid, dirRes, _cache.qcid, function(r) {
                                            if (r.state) {
                                                for (var k in r.data) {
                                                    arr.push(r.data[k])
                                                }
                                            }
                                            _self.Callback && _self.Callback(arr);
                                            window.setTimeout(function() { _self.Close() }, 10)
                                        })
                                    }, 10)
                                } else {
                                    _self.Callback && _self.Callback(arr);
                                    window.setTimeout(function() { _self.Close() }, 10)
                                }
                            }, _cache.qcid)
                        }
                        break;
                    case "msg":
                        var arr = [];
                        if (_cache.nf) {
                            arr.push({ aid: _dirCacheAid, cid: _dirCacheCid, cname: _dirCacheCname, path: _dirCachePath })
                        } else {
                            for (var i = 0, len = _cache.list.length; i < len; i++) {
                                var item = _cache.list[i];
                                if (item.attr("file_type") == "1") {
                                    arr.push({ file_id: item.attr("file_id"), file_size: item.attr("file_size"), file_name: item.find('[field="file_name"]').attr("title"), aid: item.attr("area_id"), cid: item.attr("p_id"), ico: item.attr("ico"), sha1: item.attr("sha1"), pick_code: item.attr("pick_code"), path: item.attr("path") })
                                } else {
                                    if (_cache.select_dir) {
                                        arr.push({ aid: item.attr("area_id"), cid: item.attr("cate_id"), cate_name: item.attr("cate_name"), pick_code: item.attr("pick_code"), is_dir: 1 })
                                    } else {
                                        arr.push({ aid: item.attr("area_id"), cid: item.attr("cate_id") })
                                    }
                                }
                            }
                        }
                        _self.Callback && _self.Callback(arr, false);
                        window.setTimeout(function() { _self.Close() }, 10);
                        break;
                    default:
                        _self.Callback && _self.Callback(_cache.list, false);
                        window.setTimeout(function() { _self.Close() }, 10);
                        break
                    }
                    break;
                case "cancel":
                    _self.Close();
                    break
                }
                return false
            });
            var oldAid = 1, oldCid = 0;
            var oldCookie = Util.Cookie.get("SEL_F_DIR");
            if (oldCookie) {
                var oldArr = oldCookie.split("|");
                if (oldArr.length == 2) {
                    oldAid = Number(oldArr[0]);
                    oldCid = Number(oldArr[1])
                }
            }
            if (_cache.nf) {
                _self.warp.find("[btn='add_dir']").show()
            } else {
                _self.warp.find("[btn='add_dir']").hide()
            }
            var copyInput = _self.warp.find("input[rel='copy']");
            copyInput.attr("checked", false);
            if (_cache.show_copy) {
                _self.warp.find("[rel='copy']").show()
            } else {
                _self.warp.find("[rel='copy']").hide()
            }
            if (_cache.qid_file) {
                _self.warp.find("[btn='add_dir']").hide()
            }
            if (_cache.qid_file) {
                oldAid = 999;
                oldCid = 0
            } else {
                if (Number(oldAid) == 999) {
                    oldAid = 1;
                    oldCid = 0;
                    Util.Cookie.set("SEL_F_DIR", "")
                }
            }
            changeURL(oldAid, oldCid, { select_one: _cache.select_one, filter: _cache.filter, nf: _cache.nf, qid_file: _cache.qid_file, select_dir: _cache.select_dir })
        };
        this.Setting = function(obj) {
            _cache.users = obj.users;
            _cache.type = obj.type;
            _cache.cover_cid = obj.cover_cid;
            _cache.cover_aid = obj.cover_aid;
            _cache.hide_aids = obj.hide_aids;
            _cache.select_one = obj.select;
            _cache.filter = obj.filter;
            _cache.nf = obj.nf;
            _cache.select_dir = obj.select_dir;
            _cache.show_copy = obj.show_copy;
            _cache.qid = obj.qid;
            _cache.qid_file = obj.qid_file;
            _cache.is_talk = obj.is_talk;
            _cache.qcid = obj.qcid;
            _cache.btn_txt = obj.btn_txt;
            _cache.select_txt = obj.select_txt
        };
        var _closeEvent = _self.Close;
        this.Close = function() {
            _frame.attr("src", "");
            _closeEvent();
            _self.Callback = false
        };
        var _openEvent = _self.Open;
        this.Open = function() {
            _dirCacheAid = false;
            _dirCacheCid = false;
            _openEvent();
            if (_cache.nf) {
                _self.warp.find('[rel="base_title"]').html("双击打开您要" + _cache.select_txt + "的目标文件夹");
                _self.warp.find('[btn="confirm"]').html(_cache.btn_txt);
                _self.warp.find("[rel='check_all']").hide()
            } else {
                _self.warp.find("[rel='check_all']").show();
                _self.warp.find('[rel="base_title"]').html("请选择文件");
                _self.warp.find('[btn="confirm"]').html("确定")
            }
            if (_cache.select_one) {
                _self.warp.find("[rel='check_all']").hide()
            } else {
                _self.warp.find("[rel='check_all']").show()
            }
        };
        this.Set = function(arr) { _cache.list = arr };
        this.Callback = false
    };
    var _DG;
    return {
        OpenByQ: function(callback, opt) {
            if (!_DG) {
                _DG = new _model()
            }
            var setting = { type: "q", qid: opt.qid, is_talk: opt.is_talk ? opt.is_talk : 0 };
            if (opt.qcid != undefined) {
                setting.qcid = opt.qcid
            }
            if (opt) {
                setting.select = opt.select ? 1 : 0;
                setting.filter = opt.filter ? opt.filter : "";
                setting.select_dir = opt.select_dir ? 1 : 0
            }
            _DG.Setting(setting);
            _DG.Open();
            _DG.Callback = callback
        },
        OpenByMsg: function(callback, opt) {
            if (!_DG) {
                _DG = new _model()
            }
            var setting = { type: "msg" };
            if (opt) {
                setting.select = opt.select ? 1 : 0;
                setting.filter = opt.filter ? opt.filter : "";
                setting.select_dir = opt.select_dir ? 1 : 0
            }
            _DG.Setting(setting);
            _DG.Open();
            _DG.Callback = callback
        },
        Open: function(callback, opt) {
            if (!_DG) {
                _DG = new _model()
            }
            var setting = { type: "msg" };
            if (opt) {
                setting.select = opt.select ? 1 : 0;
                setting.filter = opt.filter ? opt.filter : "";
                setting.nf = opt.nf ? opt.nf : "";
                setting.qid_file = opt.qid_f ? opt.qid_f : "";
                setting.select_dir = opt.select_dir ? 1 : 0;
                setting.btn_txt = opt.btn_txt ? opt.btn_txt : "移动到这里";
                setting.select_txt = opt.select_txt ? opt.select_txt : "移动"
            }
            setting.show_copy = opt.show_copy;
            _DG.Setting(setting);
            _DG.Open();
            _DG.Callback = callback
        },
        Show: function(users, callback) {
            if (!_DG) {
                _DG = new _model()
            }
            _DG.Setting({ users: users, type: "send" });
            _DG.Open();
            _DG.Callback = callback
        },
        EditCover: function(aid, cid) {
            if (!_DG) {
                _DG = new _model()
            }
            var setting = { type: "cover", select: 1, filter: 2, cover_aid: aid, cover_cid: cid };
            if (Number(aid) != 999) {
                Util.Cookie.set("SEL_F_DIR", aid + "|" + cid, 24)
            }
            _DG.Setting(setting);
            _DG.Open()
        },
        Select: function(arr) {
            if (_DG) {
                _DG.Set(arr)
            }
        },
        MarkDir: function(aid, cid) {
            if (Number(aid) != 999) {
                Util.Cookie.set("SEL_F_DIR", aid + "|" + cid, 24)
            }
        },
        SelectDir: function(aid, cid, cname, path) {
            _dirCacheAid = aid;
            _dirCacheCid = cid;
            _dirCacheCname = cname;
            _dirCachePath = path
        },
        BackPaths: function(paths) { _paths = paths },
        MainAPI: function(api) {
            _api = api;
            if (_DG) {
                _DG.warp.find("input[rel='check_all']").attr("checked", false)
            }
        },
        GetBackPaths: function() { return _paths },
        Close: function() {
            if (_DG) {
                _DG.Close()
            }
        }
    }
})();
Core.FileMenu = (function() {
    var _cache = { specil: Core.FileConfig.Specil, setting: Core.FileConfig.OPTPermission }, _main_top = 38, _main_left = 0, _opBox;
    var _opcBoxTemp = '<div style="z-index: 9000000;background: none repeat scroll 0 0 black;height: 100%;left: 0;position: absolute;top: 0;width: 100%;filter:alpha(opacity=0.15);-moz-opacity:0;opacity:0;display:none;" onselectstart="return false;"></div>';
    var showopbox = function(hideFun) {
        if (!_opBox) {
            _opBox = $(_opcBoxTemp);
            $(document.body).append(_opBox)
        }
        _opBox.show();
        _opBox.unbind("mousedown").bind("mousedown", function(e) {
            hideFun && hideFun(e);
            $(this).hide()
        })
    };
    var hideopbox = function() {
        if (_opBox) {
            _opBox.hide()
        }
    };
    var getSelFilesData = function(arr, opt) { return Core.FileAPI.GetSelFilesData(arr) };
    var isTypeQ = function(arr, opt) {
        var item;
        var result = { };
        if (arr.length == 1) {
            item = arr[0];
            var file_type = item.attr("file_type");
            var per = item.attr("per");
            if (file_type == "1") {
                if (Core.FilePermission.CanPlayer(arr, 4)) {
                    result.q_onemusic = true
                } else {
                    result.q_onefile = true
                }
                if (opt.download) {
                    result.q_download = true
                }
                if (opt.edit_file) {
                    result.q_edit_file = true
                }
                if (opt.del_file) {
                    result.q_delete_file = true
                }
                if (opt.save_file) {
                    result.q_save_file = true
                }
                if (opt.move_file) {
                    result.q_move_file = true
                }
                if (per == "1" || per == "2") {
                    result.q_edit_file = true;
                    result.q_delete_file = true;
                    result.q_move_file = true
                }
            } else {
                if (per == "1") {
                    result.q_manager = true;
                    result.q_edit_dir = true;
                    result.q_delete_folder = true
                } else {
                    if (per == "2") {
                        result.q_edit_dir = true;
                        result.q_delete_folder = true
                    }
                }
                result.q_onefolder = true;
                if (opt.move_file) {
                    result.q_move_file = true
                }
                if (opt.save_file) {
                    result.q_save_file = true
                }
            }
        } else {
            var fileCount = 0, folderCount = 0, shareCount = 0;
            var musicCount = 0;
            var managerCount = 0;
            var editCount = 0;
            for (var i = 0, len = arr.length; i < len; i++) {
                item = arr[i];
                file_type = item.attr("file_type");
                if (file_type == "1") {
                    if (Core.FilePermission.CanPlayer([item], 4)) {
                        musicCount++
                    }
                    fileCount++;
                    if (item.attr("per") == "1") {
                        managerCount++
                    } else {
                        if (item.attr("per") == "2") {
                            editCount++
                        }
                    }
                } else {
                    if (file_type == "0") {
                        folderCount++;
                        if (item.attr("per") == "1") {
                            managerCount++
                        } else {
                            if (item.attr("per") == "2") {
                                editCount++
                            }
                        }
                    }
                }
            }
            if (opt.manager) {
                result.q_delete_file = true
            }
            if (fileCount && folderCount) {
                var res = false;
                if (opt.del_dir) {
                    res = true
                }
                if (opt.del_file) {
                    res = true
                }
                if (res) {
                    result.q_delete_file = true
                }
                if ((managerCount + editCount) == (fileCount + folderCount)) {
                    result.q_delete_file = true
                }
                if (opt.move_file) {
                    result.q_move_file = true
                }
                if (opt.save_file) {
                    result.q_save_file = true
                }
            } else {
                if (fileCount && !folderCount) {
                    if (opt.del_file) {
                        result.q_delete_file = true
                    }
                    if (opt.save_file) {
                        result.q_save_file = true
                    }
                    if (opt.move_file) {
                        result.q_move_file = true
                    }
                    if ((managerCount + editCount) == fileCount) {
                        result.q_delete_file = true;
                        result.q_save_file = true;
                        result.q_move_file = true
                    }
                    if (musicCount == fileCount) {
                        result.q_moremusic = true
                    }
                    result.q_morefile = true
                } else {
                    if (!fileCount && folderCount) {
                        if (managerCount == folderCount) {
                            result.q_manager = true;
                            result.q_delete_folder = true
                        }
                        if (editCount == folderCount) {
                            result.q_delete_folder = true
                        }
                        if (opt.move_file) {
                            result.q_move_file = true
                        }
                        if (opt.save_file) {
                            result.q_save_file = true
                        }
                    }
                }
            }
        }
        return result
    };
    var isType = function(arr, opt) {
        if (opt) {
            if (opt.is_special) {
                if (Core.Plugs.Check(opt.check_key, "menu_type")) {
                    var result = Core.Plugs.Cmd(opt.check_key, "menu_type", "Check", arr, opt);
                    return result
                }
            }
            switch (Number(opt.aid)) {
            case 999:
                var result = isTypeQ(arr, opt);
                return result;
                break
            }
        }
        var result = { }, file_type, item;
        if (Core.FileConfig.aid == 7) {
            if (arr.length) {
                result.rbfile = true
            }
            result.rb = true;
            return result
        } else {
            if (Core.FileConfig.aid == 22) {
                if (arr.length) {
                    result.syncfile = true
                }
                result.sync = true;
                return result
            }
        }
        if (Core.FileConfig.aid == -2 && arr.length) {
            result.sentfile = true;
            result.expfile = true;
            return result
        }
        if (Core.FileConfig.aid == 0) {
            result.onekey = true
        } else {
            result.onekey = false
        }
        if (arr.length == 1) {
            item = arr[0];
            file_type = item.attr("file_type");
            if (file_type == "1") {
                var fileName = item.find("[field='file_name']").attr("title");
                var suffix = "";
                if (fileName.lastIndexOf(".") != -1) {
                    suffix = fileName.substring(fileName.lastIndexOf("."), fileName.length).replace(".", "")
                }
                suffix = suffix.toLowerCase();
                if (Core.FilePermission.CanPlayer(arr, 4)) {
                    result.onemusic = true
                } else {
                    if (UPLOAD_CONFIG && UPLOAD_CONFIG["3"] && $.inArray(suffix, UPLOAD_CONFIG["3"]["upload_type_limit"]) != -1) {
                        result.onephoto = true
                    } else {
                        result.onefile = true
                    }
                }
                if (item.attr("is_share") == "1") {
                    result.share = true;
                    if (Core.FilePermission.Vip()) {
                        result.sharefile = true
                    }
                    result.renew = true
                } else {
                    result.cancelshare = true
                }
                result.lock = true;
                if (item.attr("is_q") == "1") {
                    result.is_q = true
                }
            } else {
                if (file_type == "0") {
                    if (Number(_cache.aid) == 35) {
                        result.offonefolder = true
                    } else {
                        result.onefolder = true;
                        if (Core.FilePermission.Vip()) {
                            result.movefolder = true
                        }
                        if (Core.FilePermission.SharedDir(Core.FileConfig.aid)) {
                            if (item.attr("is_share") == "1") {
                                result.onesharefolder = true
                            }
                            if (item.attr("is_share") == "1") {
                                result.share = true
                            } else {
                                result.cancelshare = true
                            }
                        }
                        if ($.inArray(Number(_cache.aid), Core.CONFIG.BaseDir) != -1) {
                            result.onefoldercover = true;
                            if (arr[0].attr("img_url")) {
                                result.onefolderdelcover = true
                            }
                        }
                        result.lock = true
                    }
                }
            }
        } else {
            var fileCount = 0, folderCount = 0, shareCount = 0;
            var is_q = 0;
            for (var i = 0, len = arr.length; i < len; i++) {
                item = arr[i];
                file_type = item.attr("file_type");
                if (file_type == "1") {
                    fileCount++;
                    if (item.attr("is_q") == "1") {
                        is_q++
                    }
                } else {
                    if (file_type == "0") {
                        folderCount++
                    }
                }
                if (item.attr("is_share") == "1") {
                    shareCount++
                }
            }
            if (is_q) {
                result.is_q = true
            }
            if (fileCount && folderCount) {
                result.fewfandfl = true;
                result.cancelshare = true;
                if (shareCount == arr.length) {
                    result.share = true;
                    result.renew = true
                } else {
                    if (shareCount) {
                        result.share = true
                    }
                }
            } else {
                if (fileCount && !folderCount) {
                    if (_cache.aid.toString() == "3") {
                        result.fewphoto = true
                    } else {
                        if (_cache.aid.toString() == "4") {
                            result.fewmusic = true
                        } else {
                            if (_cache.aid.toString() == "9") {
                                result.fewmovie = true
                            } else {
                                if (window.OPEN_VIEWER_KEY) {
                                    if (Core.FilePermission.CanPlayer(arr, 4)) {
                                        result.fewmusic = true
                                    } else {
                                        result.fewfile = true
                                    }
                                } else {
                                    result.fewfile = true
                                }
                            }
                        }
                    }
                    if (shareCount == arr.length) {
                        result.share = true;
                        if (Core.FilePermission.Vip()) {
                            result.sharefile = true
                        }
                        result.renew = true
                    } else {
                        result.cancelshare = true;
                        if (shareCount) {
                            result.share = true
                        }
                    }
                } else {
                    if (!fileCount && folderCount) {
                        if (Number(_cache.aid) == 35) {
                            result.offfewfolder = true
                        } else {
                            result.fewfolder = true;
                            if (Core.FilePermission.SharedDir(Core.FileConfig.aid)) {
                                if (shareCount == arr.length) {
                                    result.share = true
                                } else {
                                    result.cancelshare = true;
                                    if (shareCount) {
                                        result.share = true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return result
    };
    var changeShareData = function(is_share, list, r, callback) {
        var arr = list;
        var dellist = [];
        if (r.state) {
            dellist = arr
        } else {
            for (var i = 0, len = arr.length; i < len; i++) {
                var item = arr[i];
                if (item.attr("file_type") == "1" && r.data["f"] && r.data["f"]["state"]) {
                    dellist.push(item)
                } else {
                    if (item.attr("file_type") == "0" && r.data["c"] && r.data["c"]["state"]) {
                        dellist.push(item)
                    }
                }
            }
        }
        if (dellist.length) {
            if (r.state && Number(is_share) == 1) {
                for (var i = 0, len = list.length; i < len; i++) {
                    var item = list[i];
                    if (item.attr("file_type") == "0") {
                        var dc = item.attr("cate_id");
                        if (r.dir_pickcode[dc]) {
                            item.attr("pick_code", r.dir_pickcode[dc])
                        }
                    }
                }
                if (callback) {
                    callback(r)
                }
            }
            var msg = "已推送至分享";
            switch (Number(is_share)) {
            case 0:
                msg = "成功从分享空间取出";
                break;
            case 2:
                msg = "续期成功";
                break
            }
            Core.MinMessage.Show({ text: msg, timeout: Core.CONFIG.MsgTimeout, window: _cache.win, type: "suc" });
            if (Core.FileConfig.DataAPI) {
                Core.FileConfig.DataAPI.Share(Core.FileConfig.aid, Core.FileConfig.cid, is_share, dellist)
            }
            if (Core.FileConfig.DataAPI) {
                Core.FileConfig.DataAPI.Recheck(Core.FileConfig.aid, Core.FileConfig.cid, dellist)
            }
        }
        if (!r.state && r.data) {
            if (r.data["f"]) {
                Core.MinMessage.Show({ text: r.data["f"]["message"], timeout: Core.CONFIG.MsgTimeout, window: _cache.win, type: "err" });
                return false
            } else {
                if (r.data["c"]) {
                    Core.MinMessage.Show({ text: r.data["c"]["message"], timeout: Core.CONFIG.MsgTimeout, window: _cache.win, type: "err" });
                    return false
                } else {
                    if (r.msg_code == "200100") {
                        Core.Message.Confirm({
                            text: r.msg, confirm_text: "立即完成", type: "war",
                            callback: function(res) {
                                if (res) {
                                    window.setTimeout(function() { PageFrameCtl.NewUser() }, 10)
                                }
                            }
                        })
                    } else {
                        if (r.msg_code == "60010" || r.msg_code == "60011") {
                            Core.Message.Alert({ title: "115，改变分享！", text: "您所在的用户组没有大众分享权限！", content: '1、您的网盘等级需为<b>1级</b>，您可<a href="javascript:;" onclick="Core.Message.Hide(); PageFrameCtl.Invite();return false;">邀请好友</a>快速升级。<br> 2、或通过<a target="_blank" href="' + Core.CONFIG.Path.My + '/?ac=setting#ct=mobile&ac=bind">手机认证</a>快速获得大众分享特权。', confirm_text: "我知道了", type: "war" })
                        } else {
                            Core.MinMessage.Show({ text: r.msg, timeout: Core.CONFIG.MsgTimeout, window: _cache.win, type: "err" })
                        }
                    }
                }
            }
        }
    };
    var buttonAction = {
        del: function(list) {
            var delcon = false;
            delcon = "删除文件可从回收站还原，清空回收站文件可释放空间。";
            if (Core.FileConfig.aid == 0) {
                delcon = ""
            }
            Core.Message.Confirm({
                type: "war", text: "确认要删除选中的文件吗？", content: delcon, win: _cache.win,
                callback: function(r) {
                    if (r) {
                        var url = "?ct=file&ac=delete";
                        var data = getSelFilesData(list);
                        $.ajax({
                            url: url, type: "POST", data: data, dataType: "json",
                            success: function(r) {
                                var arr = list;
                                var dellist = [];
                                if (r.state) {
                                    dellist = arr
                                } else {
                                    for (var i = 0, len = arr.length; i < len; i++) {
                                        var item = arr[i];
                                        if (item.attr("file_type") == "1" && r.data["f"]) {
                                            dellist.push(item)
                                        } else {
                                            if (item.attr("file_type") == "0" && r.data["c"]) {
                                                dellist.push(item)
                                            }
                                        }
                                    }
                                }
                                if (dellist.length) {
                                    Core.MinMessage.Show({ text: "删除成功", timeout: Core.CONFIG.MsgTimeout, window: _cache.win, type: "suc" });
                                    if (Core.FileConfig.DataAPI) {
                                        Core.FileConfig.DataAPI.Del(Core.FileConfig.aid, Core.FileConfig.cid, dellist)
                                    }
                                    if (Core.FileConfig.aid != 0) {
                                        Core.CountSync.Sync()
                                    } else {
                                        Core.SpaceData.Sync()
                                    }
                                } else {
                                    Core.MinMessage.Show({ text: "删除失败", timeout: Core.CONFIG.MsgTimeout, window: _cache.win, type: "err" })
                                }
                            }
                        })
                    }
                }
            })
        },
        share: function(list, btnType) {
            if (btnType == "share") {
                Core.SendFileDG.Open(list, "file")
            } else {
                buttonAction.share_dataaccess(list, btnType)
            }
        },
        one_key_share: function(list, is_collect, is_pass, callback) {
            var data = getSelFilesData(list);
            data.is_collect = is_collect;
            if (is_pass) {
                data.make_password = is_pass
            }
            data.is_share = 1;
            $.ajax({ url: "?ct=file&ac=one_key_share", data: data, type: "POST", dataType: "json", success: function(r) { changeShareData(1, list, r, callback) } })
        },
        share_dataaccess: function(list, btnType, sharecallback) {
            var url = "?ct=file&ac=share";
            var data = getSelFilesData(list);
            data.is_share = 1;
            switch (btnType) {
            case "cancelshare":
                data.is_share = 0;
                break;
            case "renew":
                data.is_share = 2;
                break
            }
            $.ajax({
                url: url, type: "POST", data: data, dataType: "json",
                success: function(r) {
                    if (!r.state && r.msg_code == 981001) {
                        var dialog = new Core.DialogBase({ title: "信息提示", content: '<div><div class="dialog-msg" rel="content"><h3><i class="hint-icon hint-war"></i>请绑定手机或升级VIP再使用此功能！</h3></div><div class="dialog-bottom"><div class="con" style="text-align:center;width:440px;"><a style="float:none;" btn="1" href="' + Core.CONFIG.Path.PASS + "?ct=security#" + encodeURIComponent(Core.CONFIG.Path.PASS + "?ct=security&ac=bind") + '" class="button" target="_blank">绑定手机</a><a style="float:none;" btn="1" href="' + Core.CONFIG.Path.VIP + '/?p=user_share_link" target="_blank" class="button">升级VIP</a></div></div><div></div>' });
                        dialog.Open(function() {
                            dialog.warp.find('[btn="1"]').on("click", function() {
                                dialog.Close();
                                return true
                            })
                        });
                        return false
                    }
                    changeShareData(data.is_share, list, r, sharecallback)
                }
            })
        },
        send: function(list) {
            if (list && list.length == 1) {
                var item = list[0];
                if (item.attr("file_type") == "0" && !Core.FilePermission.Vip()) {
                    Core.VIPNotice.Upgrade();
                    return
                }
            }
            Core.SendFileDG.Open(list, "friend")
        }
    };
    var doEvent = function(btnType) {
        var cRes = Core.FileMenu.CheckButtonIsDo(_cache.dataList, btnType);
        if (!cRes) {
            return false
        } else {
            if (typeof cRes == "object") {
                _cache.dataList = cRes
            }
        }
        switch (btnType) {
        case "delete":
            buttonAction.del(_cache.dataList);
            break;
        case "move":
            var hasFolder = false;
            if (_cache.dataList.length) {
                for (var i = 0, len = _cache.dataList.length; i < len; i++) {
                    if (_cache.dataList[i].attr("file_type") == "0") {
                        hasFolder = true
                    }
                }
            }
            Core.TreeDG.Show({ list: _cache.dataList, win: _cache.win, has_dir: hasFolder, type: "move" });
            break;
        case "copy":
            Core.TreeDG.Show({ list: _cache.dataList, win: _cache.win, type: "copy" });
            break;
        case "edit_name":
            if (_cache.dataList && _cache.dataList.length) {
                var node = _cache.dataList[0];
                if (node.attr("file_type") == "1") {
                    Core.FileReNameDG.Show(node.attr("file_id"), node.find('[field="file_name"]').attr("title"))
                } else {
                    var cid = node.attr("cate_id");
                    Core.Dir.Rename(Core.FileConfig.aid, cid, node.attr("cate_name"))
                }
            }
            break;
        case "cover":
            if (_cache.dataList && _cache.dataList.length) {
                var cid = _cache.dataList[0].attr("cate_id");
                Core.FileSelectDG.EditCover(Core.FileConfig.aid, cid)
            }
            break;
        case "del_cover":
            if (_cache.dataList && _cache.dataList.length) {
                var cid = _cache.dataList[0].attr("cate_id");
                Core.FileAjax.DeleteCover(Core.FileConfig.aid, cid, function(r) {
                    if (r.state) {
                        Core.MinMessage.Show({ text: "成功删除封面", type: "suc", timeout: Core.CONFIG.MsgTimeout });
                        if (Core.FileConfig.DataAPI) {
                            Core.FileConfig.DataAPI.EditCover({ cate_id: cid, img_url: "" })
                        }
                    } else {
                        Core.MinMessage.Show({ text: r.msg, type: "err", timeout: Core.CONFIG.MsgTimeout })
                    }
                })
            }
            break;
            break;
        case "shareto":
            var sharelist = { weibo: 1, q: 1, share: 1, send: 1 };
            var openCondition = { };
            var res = Core.FileMenu.CheckType(Core.FileConfig.aid, Core.FileConfig.cid, _cache.dataList);
            if (res) {
                for (var i = 0, len = res.length; i < len; i++) {
                    if (sharelist[res[i]]) {
                        openCondition[res[i]] = 1
                    }
                }
            }
            Core.FileAPI.ShareTO(_cache.dataList, openCondition);
            break;
        case "share_file":
        case "cancelshare":
        case "renew":
            buttonAction.share(_cache.dataList, btnType);
            break;
        case "play":
            var addList = [];
            for (var i = 0, len = _cache.dataList.length; i < len; i++) {
                var item = _cache.dataList[i];
                addList.push({ name: item.find('[field="file_name"]').attr("title"), mp3: item.attr("path") })
            }
            Core.MusicPlayer.Add(addList);
            break;
        case "exp_delete":
            Core.FileAjax.DeleteExpMsg(Core.FileConfig.cid, _cache.dataList, _cache.win);
            break;
        case "exp_recv":
            Core.FileAPI.RecvExp(_cache.dataList, _cache.win);
            break;
        case "restore":
            var tids = [];
            for (var i = 0, len = _cache.dataList.length; i < len; i++) {
                var item = _cache.dataList[i];
                tids.push(item.attr("tid"))
            }
            Core.FileAjax.RestoreRB(tids, _cache.win);
            break;
        case "rb_delete":
            var tids = [];
            for (var i = 0, len = _cache.dataList.length; i < len; i++) {
                var item = _cache.dataList[i];
                tids.push(item.attr("tid"))
            }
            Core.FileAjax.DeleteRB(tids, _cache.win);
            break;
        case "send":
            buttonAction.send(_cache.dataList);
            break;
        case "download":
            if (_cache.dataList.length) {
                if (_cache.dataList.length == 1) {
                    var item = $(_cache.dataList[0]);
                    var area_id = item.attr("area_id");
                    if (area_id == "999") {
                        Core.OFileAPI.CheckIsDown(Core.CONFIG.QFileAPI.QID, item.attr("pick_code"), function(r) {
                            if (r.state) {
                                Core.FileAPI.DownloadURI(r.data)
                            }
                        })
                    } else {
                        Core.FileAPI.Download(item.attr("pick_code"), _cache.win)
                    }
                } else {
                    Core.FileAPI.UDownDownload(_cache.dataList)
                }
            }
            break;
        case "copylink":
            var str = Core.FileAPI.GetCopyText(_cache.dataList);
            Util.Copy(str);
            break;
        case "edit":
            if (_cache.dataList && _cache.dataList.length) {
                var item = _cache.dataList[0];
                Core.FileDescDG.Show({ aid: Core.FileConfig.aid, file_id: item.attr("file_id"), title: item.find('[field="file_name"]').attr("title"), value: item.find("[field='desc']").val() })
            }
            break;
        case "sync_delete":
            if (_cache.dataList && _cache.dataList.length) {
                if (Core.FileConfig.DataAPI && Core.FileConfig.DataAPI.DeleteSync) {
                    Core.Message.Confirm({
                        text: "确认要删除选中的文件或文件夹吗？", type: "war",
                        callback: function(r) {
                            if (r) {
                                Core.FileConfig.DataAPI.DeleteSync(_cache.dataList)
                            }
                        }
                    })
                }
            }
            break;
        case "privacy":
            Core.PrivacyDG.File(_cache.dataList[0]);
            break;
        case "unloading":
            Core.FileAjax.AllowCollect(_cache.dataList, 1);
            break;
        case "cancelunloading":
            Core.FileAjax.AllowCollect(_cache.dataList, 0);
            break;
        case "weibo":
            Core.SendFileDG.Open(_cache.dataList, "weibo");
            break;
        case "q":
            Core.SendFileDG.Open(_cache.dataList, "q");
            break;
        case "read":
            window.Main.Core.ViewFile.Run(_cache.dataList[0]);
            break;
        case "view":
            window.Main.Core.ViewFile.Run(_cache.dataList[0]);
            break;
        case "listen":
        case "add_listen":
            Core.ViewFile.AddMusic(_cache.dataList, btnType == "listen");
            break;
        case "star":
            var tids = [];
            for (var i = 0, len = _cache.dataList.length; i < len; i++) {
                var item = _cache.dataList[i];
                tids.push(item.attr("file_id"))
            }
            if (tids.length) {
                Core.FileAjax.Star(tids.join(","), 1, function(ids, star) { Core.FileConfig.DataAPI && Core.FileConfig.DataAPI.Star(Core.FileConfig.aid, Core.FileConfig.cid, _cache.dataList, star) })
            }
            break;
        case "magic":
            var file_id = _cache.dataList[0].attr("file_id");
            var url = "?ct=meitu&file_id=" + file_id;
            PageCTL.GOTO_URL(url);
            break;
        case "open_dir":
            var item = _cache.dataList[0];
            var aid = item.attr("area_id"), cid = item.attr("cate_id");
            PageCTL.GOTO(aid, cid);
            break;
        case "q_open_dir":
            var item = _cache.dataList[0];
            var aid = item.attr("area_id"), cid = item.attr("cate_id");
            if (Core.CONFIG.QFileAPI) {
                Core.CONFIG.QFileAPI.OpenDir(aid, cid)
            }
            break;
        case "q_delete":
            if (_cache.dataList && _cache.dataList.length) {
                var file_ids = [];
                for (var i = 0, len = _cache.dataList.length; i < len; i++) {
                    var item = _cache.dataList[i];
                    if (item.attr("file_type") == "1") {
                        file_ids.push(item.attr("file_id"))
                    } else {
                        file_ids.push(item.attr("cate_id"))
                    }
                }
                Core.OFileAPI.Delete(Core.CONFIG.QFileAPI.AID, Core.CONFIG.QFileAPI.CID, Core.CONFIG.QFileAPI.QID, file_ids)
            }
            break;
        case "q_move":
            if (Core.CONFIG.QFileAPI) {
                Core.OFileAPI.Save(_cache.dataList, Core.CONFIG.QFileAPI.QID)
            }
            break;
        case "q_edit_name":
            if (_cache.dataList && _cache.dataList.length) {
                var node = _cache.dataList[0];
                if (node.attr("file_type") == "1") {
                    if (Core.CONFIG.QFileAPI) {
                        Core.OFileAPI.RenameFile(node.attr("area_id"), node.attr("file_id"), Core.CONFIG.QFileAPI.QID, node.find('[field="file_name"]').attr("title"))
                    }
                } else {
                    var cid = node.attr("cate_id");
                    if (Core.CONFIG.QFileAPI) {
                        Core.OFileAPI.RenameDir(node.attr("area_id"), cid, Core.CONFIG.QFileAPI.QID, node.attr("cate_name"))
                    }
                }
            }
            break;
        case "q_move_to":
            if (_cache.dataList && _cache.dataList.length) {
                if (Core.CONFIG.QFileAPI) {
                    Core.OFileAPI.Move(_cache.dataList)
                }
            }
            break;
        case "q_permission":
            if (_cache.dataList && _cache.dataList.length) {
                if (Core.CONFIG.QFileAPI) {
                    if (_cache.dataList.length == 1) {
                        var item = _cache.dataList[0];
                        if (item.attr("file_type") == "0" && item.attr("ipr")) {
                            if (Core.CONFIG.QFileAPI.GetPermission) {
                                Core.CONFIG.QFileAPI.GetPermission(item.attr("cate_id"), function(r) {
                                    if (r.state) {
                                        var info = r.data;
                                        var access = info.access;
                                        var user_ids = info.user_id;
                                        var group_ids = info.group_id;
                                        Core.OFileAPI.Manager(_cache.dataList, group_ids, user_ids)
                                    } else {
                                        Core.OFileAPI.Manager(_cache.dataList)
                                    }
                                });
                                return
                            }
                        }
                    }
                    Core.OFileAPI.Manager(_cache.dataList)
                }
            }
            break;
        case "download_dir":
            if (!Core.CONFIG.IsOOF.state) {
                if (Core.CONFIG.IsWindowNT) {
                    Core.Message.Confirm({ text: "(¯^¯ ) 这个浏览器不支持文件夹下载", content: "请用115网盘专用浏览器进行下载。", type: "war", confirm_link: "http://chrome.115.com", confirm_text: "下载115极速浏览器" })
                } else {
                    Core.MinMessage.Show({ text: "文件夹下载暂只支持windows系统", type: "war", timeout: 2000 })
                }
            }
            break;
        case "cancel_q":
            if (_cache.dataList && _cache.dataList.length) {
                Core.Message.Confirm({
                    text: "您确定此操作吗?", content: "取消分享到圈子后，圈子分享的资源将全部失效", type: "war",
                    callback: function(res) {
                        if (res) {
                            var file_ids = [];
                            for (var i = 0, len = _cache.dataList.length; i < len; i++) {
                                var item = _cache.dataList[i];
                                if (item.attr("file_type") == "1" && item.attr("is_q") == "1") {
                                    file_ids.push(item.attr("file_id"))
                                }
                            }
                            $.ajax({
                                url: "/?ct=file&ac=qshare", data: { is_share: "0", tid: file_ids.join(",") }, type: "POST", dataType: "json",
                                success: function(r) {
                                    if (r.state) {
                                        Core.MinMessage.Show({ text: "成功取消分享到圈子", type: "suc", timeout: 2000 });
                                        if (Core.FileConfig.DataAPI) {
                                            Core.FileConfig.DataAPI.CancelQ(Core.FileConfig.aid, Core.FileConfig.cid, _cache.dataList)
                                        }
                                    } else {
                                        Core.MinMessage.Show({ text: r.msg, type: "err", timeout: 2000 })
                                    }
                                }
                            })
                        }
                    }
                })
            }
            break;
        case "gift":
            Core.Gift.Add(_cache.dataList);
            break;
        default:
            if (!Core.Plugs.DoButton(btnType, _cache.dataList)) {
                Core.MinMessage.Show({ text: " 操作数量:" + _cache.dataList.length, type: "suc", timeout: Core.CONFIG.MsgTimeout, window: _cache.win })
            }
            break
        }
    };
    var hideRightMenu = function(type) {
        if (_cache[type]) {
            _cache[type].find("[val]").hide();
            _cache[type].hide()
        }
    };
    var showRightMenu = function(type, aid, cid, arr, x, y, opt) {
        _cache.aid = aid;
        _cache.cid = cid;
        _cache.dataList = arr;
        if (arr && arr.length) {
            if (!_cache[type]) {
                _cache[type] = Core.FloatMenu.Show(type);
                _cache[type].find("[val]").each(function(i) {
                    if (!_cache[type + "_btn_list"]) {
                        _cache[type + "_btn_list"] = { }
                    }
                    var val = $(this).attr("val");
                    _cache[type + "_btn_list"][val] = $(this);
                    $(this).bind("click", function(e) {
                        Core.Html.StopPropagation(e);
                        var btnType = $(this).attr("val");
                        if ($(this).find(".arrow").length) {
                            return false
                        }
                        doEvent(btnType);
                        hideopbox();
                        hideRightMenu(type);
                        return false
                    })
                });
                Core.FileMenu.BindAlbum(_cache[type], type)
            }
            if (Core.CONFIG.IsOOF.state) {
                var ddA = _cache[type].find('[val="download_dir"] a');
                if (ddA.length) {
                    Core.FileAPI.DownloadDir(arr, ddA);
                    ddA.parent().off("click")
                }
            }
            var showCount = 0;
            if (_cache[type + "_btn_list"]) {
                for (var k in _cache[type + "_btn_list"]) {
                    _cache[type + "_btn_list"][k].hide()
                }
                if (!opt) {
                    opt = { }
                }
                opt.aid = aid;
                var r = isType(arr, opt);
                var specilobj = _cache.specil[_cache.aid];
                for (var k in r) {
                    if (r[k]) {
                        var ablelist = _cache.setting[k];
                        if (specilobj) {
                            for (var i = 0, len = ablelist.length; i < len; i++) {
                                if (specilobj[ablelist[i]] && _cache[type + "_btn_list"][ablelist[i]]) {
                                    _cache[type + "_btn_list"][ablelist[i]].show();
                                    showCount++
                                }
                            }
                        } else {
                            for (var i = 0, len = ablelist.length; i < len; i++) {
                                if (_cache[type + "_btn_list"][ablelist[i]]) {
                                    _cache[type + "_btn_list"][ablelist[i]].show();
                                    showCount++
                                }
                            }
                        }
                    }
                }
            }
            if (!showCount) {
                _cache[type] && _cache[type].hide();
                return
            }
            var l = x, t = y;
            t += _main_top;
            if (type == "right_q_file") {
                t += 44
            }
            l += _main_left;
            showopbox(function() { hideRightMenu(type) });
            Core.FloatMenu.SetRightBtnPos(_cache[type], type, l, t);
            if (!showCount) {
                hideRightMenu(type)
            }
        }
    };
    return {
        CheckButtonIsDo: function(list, type) {
            if ($.inArray(type, Core.CONFIG.NotUpCanDo) == -1) {
                if (list.length == 1) {
                    if (list[0].attr("file_status") == "0") {
                        Core.MinMessage.Show({ text: "文件需续传完成后再操作。", type: "war", timeout: Core.CONFIG.MsgTimeout });
                        return false
                    }
                } else {
                    if (list.length > 1) {
                        var arr = [], isReupload = false;
                        for (var i = 0, len = list.length; i < len; i++) {
                            var node = list[i];
                            if (node.attr("file_status") == "0") {
                                isReupload = true;
                                continue
                            }
                            arr.push(node)
                        }
                        if (arr.length == 0) {
                            if (isReupload) {
                                Core.MinMessage.Show({ text: "文件需续传完成后再操作。", type: "war", timeout: Core.CONFIG.MsgTimeout })
                            }
                            return false
                        } else {
                            return arr
                        }
                    }
                }
            }
            return true
        },
        CheckType: function(aid, cid, arr, opt) {
            _cache.aid = aid;
            _cache.cid = cid;
            var result = [];
            if (!opt) {
                opt = { }
            }
            opt.aid = aid;
            var r = isType(arr, opt);
            for (var k in r) {
                if (r[k]) {
                    var ablelist = _cache.setting[k];
                    for (var i = 0, len = ablelist.length; i < len; i++) {
                        result.push(ablelist[i])
                    }
                }
            }
            return result
        },
        GetSetting: function() { return _cache.setting },
        Action: function(type) { return buttonAction[type] },
        DoEvent: function(arr, btnType) {
            _cache.dataList = arr;
            doEvent(btnType)
        },
        FileRight: function(aid, cid, arr, x, y, opt) {
            var type = "more_btn";
            switch (Number(aid)) {
            case 999:
                var type = "right_q_file";
                break;
            default:
                if (opt && opt.is_special) {
                    if (opt.menu_key) {
                        type = "right_" + opt.menu_key + "_file"
                    }
                }
                break
            }
            showRightMenu(type, aid, cid, arr, x, y, opt)
        },
        BindAlbum: function(dom, type) {
            var listenBtn = dom.find('[val="add_listen"]');
            if (listenBtn.length) {
                listenBtn.find("a").append("<em>&raquo;</em>");
                var menu;
                var hideState = true;
                var timer;
                var getPos = function(dom, li) {
                    var x = li.offset().left + li.width();
                    var y = li.offset().top;
                    if (x + dom.width() > $(document).width()) {
                        x = x - dom.width() - li.width()
                    }
                    if (y + dom.height() + 5 > $(document).height()) {
                        y = $(document).height() - dom.height() - 5
                    }
                    var pos = { top: y, left: x };
                    return pos
                };
                var isload = false;
                var hideFun = function() {
                    hideState = true;
                    timer = window.setTimeout(function() {
                        if (hideState && menu) {
                            menu.hide();
                            hideState = true;
                            menu.empty().remove();
                            menu = false;
                            isload = false
                        }
                    }, 200)
                };
                listenBtn.off("click").on("mouseover", function() {
                    if (isload) {
                        return
                    }
                    if (timer) {
                        window.clearTimeout(timer)
                    }
                    hideState = false;
                    if (!menu) {
                        isload = true;
                        Core.CloudMusic.GetCate(function(r) {
                            if (hideState) {
                                return
                            }
                            isload = false;
                            var arr = { };
                            for (var k in r) {
                                var item = r[k];
                                arr["al_" + item.topic_id] = { text: item.topic_name }
                            }
                            arr.br1 = { isline: true };
                            arr.create_al = { text: "添加专辑" };
                            menu = Core.FloatMenu.GetMenu(arr);
                            menu.hide();
                            menu.on("mouseover", function() {
                                if (timer) {
                                    window.clearTimeout(timer)
                                }
                                hideState = false
                            }).on("mouseleave", function() { hideFun() });
                            menu.find("[val]").on("click", function() {
                                var el = $(this);
                                if (el.attr("val").indexOf("al_") != -1) {
                                    var tid = el.attr("val").replace("al_", "");
                                    var list = _cache.dataList;
                                    var fids = [];
                                    for (var k in list) {
                                        fids.push(list[k].attr("file_id"))
                                    }
                                    Core.CloudMusic.AddFileList(tid, fids, function(mlist) { Core.ViewFile.AddMusic(list, true, true, tid) });
                                    hideopbox();
                                    hideRightMenu(type)
                                } else {
                                    if (el.attr("val") == "create_al") {
                                        Core.CloudMusic.AddCate(function(r) { Core.MinMessage.Show({ text: "成功添加音乐专辑", type: "suc", timeout: 2000 }) })
                                    }
                                }
                                menu.empty().remove();
                                menu = false;
                                return false
                            });
                            $(document.body).append(menu);
                            window.setTimeout(function() { menu.css(getPos(menu, listenBtn)).show() }, 10)
                        })
                    } else {
                        menu.css(getPos(menu, listenBtn)).show()
                    }
                }).on("mouseleave", function() { hideFun() })
            }
        }
    }
})();
Core.SendFileDG = (function() {
    var _mod, _api, _list, _defaultType = "friend", _permission, _share_cache;
    var _model = function() {
        var _self = this, _cache = { };
        var _content = $('<div><div style="width:700px; height:355px;"><iframe src="" frameborder="0" rel="frame" style="width:700px; height:355px;"></iframe></div><div class="dialog-bottom" rel="bottom"><div class="con"><a href="javascript:;" class="button" style="display:none;" btn="confirm">立即分享</a></div><div class="dialog-status" style="float:left;" rel="dialog_status"></div></div></div>');
        Core.DialogBase.call(this, { title: "分享给好友", content: _content, width: 700 });
        this.SetDialogText = function(text) {
        };
        var _closeFun = _self.Close;
        this.IsOpen = false;
        this.Close = function() {
            _content.find("[rel='frame']").attr("src", "");
            _self.IsOpen = false;
            _closeFun();
            _permission = false
        };
        this.IsAllShare = function() {
            var len = _list.length;
            var shareCount = 0;
            for (var k in _list) {
                if (Number(_list[k].attr("is_share"))) {
                    shareCount++
                }
            }
            return (shareCount == len)
        };
        this.Initial = function() {
            var url, ac = "share_friend";
            _self.IsOpen = true;
            var h = 355;
            var params = "";
            if (_defaultType) {
                switch (_defaultType) {
                case "q":
                case "mail":
                case "mobile":
                case "friend":
                    ac = "share_friend";
                    break;
                case "weibo":
                case "file":
                    ac = "share_file";
                    if (_self.IsAllShare()) {
                        ac = "share_file";
                        params = "&is_result=1";
                        Core.SendFileDG.ClearShareCache()
                    } else {
                        if (Core.CONFIG.ImterimShareKey) {
                            ac = "imterim_share";
                            params = "&share_type=file";
                            break
                        }
                    }
                    break
                }
            }
            url = "?ct=share&ac=" + ac + params + "&_t=" + new Date().getTime();
            var ifrm = _content.find("[rel='frame']");
            ifrm.attr("src", url);
            ifrm.height(h).parent().height(h);
            _content.find("[btn]").unbind("click").bind("click", function() {
                var btnType = $(this).attr("btn");
                switch (btnType) {
                case "confirm":
                    if (_api) {
                        _api && _api.Confirm(function() { window.setTimeout(function() { _self.Close() }, 0) })
                    } else {
                        _self.Close()
                    }
                    break;
                case "cancel":
                    _self.Close();
                    break
                }
                return false
            })
        };
        this.SetButtonValue = function() {
            var confirmBtn = _content.find("[btn='confirm']");
            if (_api) {
                if (_api.DialogText) {
                    _content.find('[rel="dialog_status"]').html(_api.DialogText)
                } else {
                    _content.find('[rel="dialog_status"]').html("")
                }
                if (_api.Type) {
                    _defaultType = _api.Type;
                    Util.Cookie.set("JS_SD_KEY", _api.Type, 24 * 30 * 3)
                }
                if (_api.ButtonText) {
                    confirmBtn.html(_api.ButtonText)
                } else {
                    confirmBtn.html("立即分享")
                }
                if (_api.Confirm) {
                    confirmBtn.show()
                } else {
                    confirmBtn.hide()
                }
            }
        }
    };
    return {
        CheckPermission: function(type) {
            if (type == "friend") {
                if (_list && _list.length == 1) {
                    var item = _list[0];
                    if (item.attr("file_type") == "0" && !Core.FilePermission.Vip()) {
                        Core.VIPNotice.Upgrade();
                        return false
                    }
                }
            }
            return true
        },
        Open: function(list, type) {
            if (!_mod) {
                _mod = new _model()
            }
            _api = false;
            _list = list;
            if (_mod.IsOpen) {
                _mod.Close()
            }
            switch (Core.FileConfig.aid) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 9:
                _permission = Core.FileMenu.CheckType(Core.FileConfig.aid, Core.FileConfig.cid, list);
                if (Core.FilePermission.VipExp() && Core.SpaceData.IsNoSpace()) {
                    var arr = [];
                    for (var i = 0, len = _permission.length; i < len; i++) {
                        if (_permission[i] != "q" && _permission[i] != "weibo") {
                            arr.push(_permission[i])
                        }
                    }
                    _permission = arr
                }
                break;
            default:
                _permission = [];
                if (type == "file" || type == "file_result") {
                    _permission.push("share")
                }
                if (Core.FilePermission.VipExp() && Core.SpaceData.IsNoSpace()) {
                    _permission.push("send")
                } else {
                    _permission.push("send");
                    _permission.push("q")
                }
                break
            }
            if (Util.Cookie.get("JS_SD_KEY")) {
                _defaultType = Util.Cookie.get("JS_SD_KEY");
                if (_defaultType != "file" && _defaultType != "friend") {
                    if ($.inArray(_defaultType, _permission) == -1) {
                        _defaultType = "file"
                    }
                }
            }
            if (_defaultType == "friend") {
                if (list && list.length == 1) {
                    var item = list[0];
                    if (item.attr("file_type") == "0" && !Core.FilePermission.Vip()) {
                        _defaultType = "file"
                    }
                }
            }
            _mod.Open()
        },
        Close: function() {
            if (_mod) {
                _mod.Close()
            }
        },
        GetFileList: function() { return _list },
        GetPermission: function() { return _permission },
        SetAPI: function(api) {
            _api = api;
            if (_mod) {
                _mod.SetButtonValue()
            }
        },
        GetShareCache: function() { return _share_cache },
        ClearShareCache: function() { _share_cache = false },
        IsAllShare: function() {
            if (_mod) {
                return _mod.IsAllShare()
            }
            return false
        }
    }
})();
Core.SendFileResult = (function() {
    var _mod, _doHandler;
    var mod = function() {
        var _content = $('<div class="share-result"><dl></dl></div>'), _self = this;
        var _top = Util.Override(Core.DialogBase, _self, {
            Show: function(arr) {
                _top.Open();
                var dl = _content.find("dl");
                dl.html("");
                var html = [];
                html.push("<dt><span>好友</span><em>操作结果</em></dt>");
                for (var i = 0, len = arr.length; i < len; i++) {
                    var item = arr[i];
                    html.push("<dd><span>" + item.text + "</span>" + item.result + "</dd>")
                }
                dl.html(html.join(""))
            }
        }, { content: _content, title: "分享结果" })
    };
    return {
        Open: function(arr) {
            if (!_mod) {
                _mod = new mod()
            }
            _mod.Show(arr)
        }
    }
})();
Core.FriendDG = (function() { return { Add: function() { Core.FrameDG.Open(Core.CONFIG.Path.My + "/?ct=friend&ac=search", { width: 700, height: 500, title: "添加好友" }) } } })();
Core.FileResultDG = (function() {
    var _model;
    var showBtn = function(opt) {
        var gotoBtn = _model.warp.find("[btn='goto']");
        if (opt.aid) {
            gotoBtn.show();
            if (opt.cid == undefined) {
                opt.cid = 0
            }
            gotoBtn.off("click").on("click", function() {
                if (window.PageCTL) {
                    PageCTL.GOTO(opt.aid, opt.cid);
                    window.setTimeout(function() {
                        _model.Close();
                        Core.OnlyFrame.Close()
                    }, 1);
                    return false
                } else {
                    $(this).attr("href", PAGE_PATHS.U + "?ac=goto_dir&aid=" + opt.aid + "&cid=" + opt.cid).attr("target", "_blank");
                    window.setTimeout(function() {
                        _model.Close();
                        Core.OnlyFrame.Close()
                    }, 1);
                    return true
                }
            });
            window.setTimeout(function() {
                gotoBtn.focus();
                Core.FileConfig && Core.FileConfig.DataAPI && Core.FileConfig.DataAPI.Reload(opt.aid, opt.cid)
            }, 800)
        } else {
            gotoBtn.hide();
            if (opt.is_msg) {
                var key = "API_GET_MSG_ID_" + new Date().getTime();
                $.getScript(PAGE_PATHS.U + "/?ct=msg&ac=get_id&js_return=" + key, function() {
                    var r = window[key];
                    if (r) {
                        opt.aid = 1;
                        opt.cid = r.cid;
                        showBtn(opt)
                    }
                })
            }
        }
    };
    return {
        Show: function(list, opt) {
            if (!_model) {
                var _content = $('<dl class="file-copy" rel="con"></dl><div class="dialog-bottom"><div class="con"><a href="javascript:;" class="button" btn="goto" style="display:none;">打开文件目录</a></div></div>');
                _model = new Core.DialogBase({ title: "结果", content: _content })
            }
            if (!opt) {
                opt = { }
            }
            if (!opt.name) {
                opt.name = "file_name"
            }
            if (!opt.msg) {
                opt.msg = "msg"
            }
            _model.Open(function() {
                var closeBtn = _model.warp.find("[btn='close_btn']");
                closeBtn.off("click").on("click", function() {
                    _model.Close();
                    return false
                });
                var html = [];
                for (var k in list) {
                    var item = list[k];
                    var fileName = item[opt.name];
                    var result = item.state ? "<em>成功</em>" : item[opt.msg];
                    html.push("<dd " + (!item.state ? 'class="err" title="' + item[opt.msg] + '"' : "") + '><ul><li class="file-name">' + fileName + '</li><li class="file-rate">' + result + "</li></ul></dd>")
                }
                _model.warp.find("[rel='con']").html('<dt><ul><li class="file-name">文件名</li><li class="file-rate">操作结果</li></ul></dt>' + html.join(""));
                _model.warp.find("[btn='cancel']").off("click").on("click", function() {
                    _model.Close();
                    return false
                });
                showBtn(opt)
            })
        }
    }
})();
Core.TreeWin = (function() {
    return {
        Show: function(callback) {
            Core.FileSelectDG.Open(function(list) {
                if (list.length) {
                    var item = list[0];
                    var aid = item.aid, cid = item.cid;
                    callback && callback(aid, cid)
                }
            }, { select: 1, nf: 1, btn_txt: "接收到这里", select_txt: "接收" })
        },
        Hide: function() { Core.FileSelectDG.Close() }
    }
})();
Core.TreeDG = (function() {
    var _cache = { };
    return {
        Show: function(obj) {
            if (!obj.list || !obj.list.length) {
                Core.MinMessage.Show({ text: "请选择文件", timeout: Core.CONFIG.MsgTimeout });
                return
            }
            _cache.setting = obj;
            var type = _cache.setting.type;
            var arr = obj.list;
            var isDir = obj.has_dir;
            var tid = [];
            var dir = [];
            for (var i = 0, len = arr.length; i < len; i++) {
                if (arr[i].attr("file_type") == "1") {
                    tid.push(arr[i].attr("file_id"))
                } else {
                    dir.push(arr[i].attr("cate_id"))
                }
            }
            _cache.list = tid;
            _cache.dir_list = dir;
            _cache.doms = arr;
            Core.FileSelectDG.Open(function(list, is_copy) {
                if (list.length) {
                    var item = list[0];
                    var aid = item.aid, cid = item.cid;
                    _cache.aid = aid;
                    _cache.cid = cid;
                    if (is_copy == undefined) {
                        is_copy = false
                    }
                    _cache.is_copy = is_copy;
                    var data = { to_aid: _cache.aid, to_cid: _cache.cid };
                    if (_cache.is_copy) {
                        data.copy = 1
                    }
                    for (var i = 0, len = _cache.list.length; i < len; i++) {
                        data["fid[" + i + "]"] = _cache.list[i]
                    }
                    for (var i = 0, len = _cache.dir_list.length; i < len; i++) {
                        data["cid[" + i + "]"] = _cache.dir_list[i]
                    }
                    if (isDir) {
                        var paths = Core.FileSelectDG.GetBackPaths();
                        if (paths) {
                            var res = true;
                            for (var i = 0, len = paths.length; i < len; i++) {
                                var item = paths[i];
                                for (var j = 0, jlen = _cache.doms.length; j < jlen; j++) {
                                    var node = _cache.doms[j];
                                    if (node.attr("file_type") == "0") {
                                        var form_aid = node.attr("area_id");
                                        var form_cid = node.attr("cate_id");
                                        if (Number(form_aid) == Number(item.aid) && Number(form_cid) == Number(item.cid)) {
                                            res = false
                                        }
                                    }
                                }
                            }
                            if (!res) {
                                Core.MinMessage.Show({ text: "文件夹不能移动到子目录里", type: "err", timeout: Core.CONFIG.MsgTimeout });
                                return false
                            }
                        }
                    }
                    $.ajax({
                        url: "/?ct=op&ac=move", type: "POST", data: data, dataType: "json",
                        success: function(r) {
                            if (r.state) {
                                if (!_cache.is_copy) {
                                    try {
                                        if (Core.FileConfig.DataAPI) {
                                            Core.FileConfig.DataAPI.Del(Core.FileConfig.aid, Core.FileConfig.cid, _cache.doms)
                                        }
                                        window.setTimeout(function() { Core.MinMessage.Show({ text: "成功转移文件", type: "suc", timeout: Core.CONFIG.MsgTimeout }) }, 500)
                                    } catch(e) {
                                    }
                                } else {
                                    try {
                                        if (Core.FileConfig.DataAPI) {
                                            Core.FileConfig.DataAPI.Reload(Core.FileConfig.aid, Core.FileConfig.cid)
                                        }
                                        window.setTimeout(function() { Core.MinMessage.Show({ text: "成功复制文件", type: "suc", timeout: Core.CONFIG.MsgTimeout }) }, 500)
                                    } catch(e) {
                                    }
                                }
                            } else {
                                Core.MinMessage.Show({ text: r.msg, type: "err", timeout: Core.CONFIG.MsgTimeout })
                            }
                        }
                    })
                }
            }, { select: 1, nf: 1, show_copy: !isDir ? 1 : 0 })
        }
    }
})();
Core.Upload = (function() {
    var _cache = { aid: 1, cid: 0, ActiveAid: 1, ActiveCid: 0 };
    var _MinForm = new (function() {
        var _self = this;
        var _content;
        var bindEvents = function() {
            _content.find("[rel='max']").on("click", function() {
                _MinForm.Close();
                _DisplayForm.Open();
                return false
            })
        };
        var _openState = false;
        this.Open = function() { _openState = true };
        this.Close = function() {
            _openState = false;
            if (_content) {
                _content.hide()
            }
        };
        this.Progress = function(obj) {
            if (!_DisplayForm.IsOpen && obj) {
                if (!_content) {
                    _content = $('<div class="upload-min"><span rel="pro_text">正在上传，已完成15%</span><a href="javascript:;" rel="max" class="maximize">最大化</a></div>');
                    $(document.body).append(_content);
                    bindEvents()
                }
                var size = 0;
                var count = 0;
                var complete = 0;
                for (var k in obj) {
                    count++;
                    size += Number(obj[k].size);
                    complete += Number(obj[k].complete)
                }
                var per = (complete / size);
                if (!_openState) {
                    _self.Open();
                    _content.show()
                }
                _content.find("[rel='pro_text']").html("文件上传中，已完成" + (per * 100).toFixed(1) + "%")
            } else {
                if (_openState) {
                    _self.Close()
                }
            }
        }
    })();
    var _DisplayForm = new (function() {
        var _self = this, _datalist = { }, _cacheData, _loadState = false, _isClose = true, _tree;
        var _installBtn = '<a href="javascript:;" rel="js_up_install">点击安装</a>';
        if ($.browser.msie) {
            _installBtn = '<a href="/static/plug/install_help/install_step1.html" rel="js_up_install_old" target="_blank">点击安装</a>'
        }
        var _content = $('<div class="hint-box" rel="js_hint_msg_box">您现在使用的是普通上传模式，建议您安装“高速上传控件”提高上传速度！ ' + _installBtn + '</div><div class="upload-panel"><span rel="js_up_msg"></span><div class="btn-wrap"><span id="js_upload_fup_box" style="float:left;overflow:hidden;margin-left:-1px; top:-9999px;"><span id="js_upload_fup_btn"></span></span><a href="javascript:;" class="btn btn-upload" style="display:none;" id="js_upload_tup_box"></a><a href="javascript:;" class="btn btn-opt" rel="settings" style="display:none;"><em>选项</em></a></div></div><div class="upload-list"><dl><dt><ul><li class="f-name">文件名</li><li class="f-progress">上传进度</li><li class="f-size">大小</li><li class="f-operate">操作</li></ul></dt><dd><ol rel="list"></ol></dd></dl></div><div class="upload-status"><div class="operate-btn operate-clear"><a href="javascript:;" btn="clear"><i class="ico-operate op-clear"></i><span>清空列表</span></a></div><div class="upload-stat-text" rel="upload_msg"></div></div>');
        var _fileTemp = '<li file_id="{id}"><div class="progress-bar"></div><ul><li class="f-name">{name}</span></li><li class="f-progress" rel="pg_text"></li><li class="f-size">{size_str}</li><li class="f-operate" rel="op"></li></ul></li>';
        Core.WindowBase.call(this, { title: "文件上传", content: _content, width: 640, height: 500, is_not_resize: true, min_title: "<span>上传文件</span>" });
        var domlist = _content.find("[rel='list']");
        var isExist = function(file) {
            var result = false;
            if (_cacheData) {
                for (var k in _cacheData) {
                    var item = _cacheData[k];
                    if (item.name == file.name && item.aid == file.aid) {
                        if (item.cid != undefined || file.cid != undefined) {
                            if (item.cid == file.cid) {
                                return true
                            }
                        } else {
                            return true
                        }
                    }
                }
            }
            return result
        };
        var getBtn = function(obj) {
            var btn = $('<a href="javascript:;" class="ico-operate ' + obj.className + '" title="' + obj.text + '">' + obj.text + "</a>");
            if (obj.first) {
                var btns = obj.dom.find("[rel='op'] a.ico-operate");
                if (btns.length) {
                    $(btns[0]).before(btn)
                } else {
                    obj.dom.find("[rel='op']").append(btn)
                }
            } else {
                obj.dom.find("[rel='op']").append(btn)
            }
            if (obj.hide) {
                btn.hide()
            }
            btn.click(obj.callback)
        };
        var showUploadMsg = function(msg) { _content.find("[rel='js_up_msg']").html(msg) };
        this.ChangeDir = function(aid, cid) {
            switch (Number(_cache.ActiveAid)) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 9:
            case 999:
                var msg = "";
                Core.Upload.Disable(false);
                if (!Core.FilePermission.Vip()) {
                    msg = "本目录可上传" + Util.File.ShowSize(_cache.config[aid.toString()].upload_size_limit, 0) + "的文件";
                    msg += ', <a href="' + Core.CONFIG.Path.VIP + '/vip/?p=upload" class="btn-upgrade" target="_blank">升级VIP</a> 即可上传<b>50GB</b>超大文件，<a style="color:#FF6600;" href="http://pc.115.com" target="_blank">使用115云备份可上传文件夹</a>'
                } else {
                    msg = "本目录支持上传 <b>" + Util.File.ShowSize(_cache.config[aid.toString()].upload_size_limit) + '</b> 单个超大文件 <a style="color:#FF6600;" href="http://pc.115.com" target="_blank">使用115云备份可上传文件夹</a>'
                }
                if (!_TUpload.isInstall() && Core.FilePermission.Vip()) {
                    msg += "<b>(需安装极速上传控件)</b>"
                }
                showUploadMsg(msg);
                break;
            default:
                Core.Upload.Disable(true, Number(_cache.ActiveAid));
                break
            }
        };
        this.Initial = function() {
            _isClose = false;
            _self.warp.addClass("upload-box").css({ height: "" });
            _content.find("[btn='clear']").unbind("click").bind("click", function() {
                _content.find("[file_id]").each(function() {
                    if (_cacheData && _cacheData[$(this).attr("file_id")]) {
                        return
                    }
                    $(this).empty().remove()
                });
                return false
            });
            _FUpload.dom("js_upload_fup_btn", "js_upload_fup_box");
            _FUpload.setting(_cache.ActiveAid, _cache.ActiveCid);
            _FUpload.show();
            if (_TUpload.isInstall()) {
                _TUpload.bindButton("js_upload_tup_box");
                _TUpload.setting(_cache.ActiveAid, _cache.ActiveCid)
            } else {
                _content.find('[rel="js_up_install"]').bind("click", function() {
                    _TUpload.showDownload();
                    return false
                })
            }
            _self.Install();
            var settings_ele = _content.find("[rel='settings']");
            settings_ele.hide();
            if (_TUpload.isInstall()) {
                _cache.setting_dom = Core.FloatMenu.Show("up_setting");
                _self.warp.find("[rel='js_hint_msg_box']").empty().remove();
                settings_ele.show()
            } else {
                if (!Core.CONFIG.IsWindows) {
                    _self.warp.find("[rel='js_hint_msg_box']").empty().remove()
                }
                $("#js_upload_tup_box").empty().remove()
            }
            if (_cache.setting_dom) {
                Util.DropDown.Bind({
                    Title: settings_ele, Content: _cache.setting_dom, IsOverShow: true,
                    ShowHandler: function() {
                        var ele = settings_ele;
                        var t = ele.offset().top + ele.height();
                        var l = ele.offset().left;
                        Core.FloatMenu.SetRightBtnPos(_cache.setting_dom, "up_setting", l, t, ele.width(), ele.height())
                    }
                });
                var menuList = _cache.setting_dom.find("[val]");
                menuList.each(function(i) {
                    var item = $(this);
                    var type = item.attr("val");
                    item.click(function(e) {
                        switch ($(this).attr("val")) {
                        case "flash":
                            Core.Setting.Change({ os_file_upload_type: 0 }, function(r) {
                                if (r.state) {
                                    Core.Upload.ChangeEngine(0);
                                    checkUpEngine()
                                }
                            });
                            break;
                        case "ocx1":
                            Core.Setting.Change({ os_file_upload_type: 1 }, function(r) {
                                if (r.state) {
                                    Core.Upload.ChangeEngine(1);
                                    Core.CONFIG.TUpSp = "0";
                                    checkUpEngine()
                                }
                            });
                            break;
                        case "ocx2":
                            Core.Setting.Change({ os_file_upload_type: 2 }, function(r) {
                                if (r.state) {
                                    Core.Upload.ChangeEngine(1);
                                    Core.CONFIG.TUpSp = "1";
                                    checkUpEngine()
                                }
                            });
                            break
                        }
                        return false
                    })
                })
            }
            listen();
            _loadState = true
        };
        var checkUpEngine = function() {
            if (_cache.setting_dom) {
                var updom = _cache.setting_dom;
                updom.find("i.i-done").removeClass("ico-menu").removeClass("i-done");
                switch (Core.CONFIG.UpEngine) {
                case 0:
                    updom.find("[val='flash'] i").addClass("ico-menu").addClass("i-done");
                    break;
                case 1:
                    if (Number(Core.CONFIG.TUpSp) == 1) {
                        updom.find("[val='ocx2'] i").addClass("ico-menu").addClass("i-done")
                    } else {
                        updom.find("[val='ocx1'] i").addClass("ico-menu").addClass("i-done")
                    }
                    break
                }
                _cache.setting_dom.hide()
            }
        };
        this.Install = function() {
            if (Core.CONFIG.UpEngine && _TUpload.isInstall()) {
                _FUpload.hide();
                _TUpload.show((Core.CONFIG.TUpSp == "0") ? "<i class='ico-btn ib-add'></i>添加文件" : "<i class='ico-btn ib-add'></i>添加文件")
            } else {
                _FUpload.show();
                _TUpload.hide()
            }
        };
        this.PauseUI = function(file) {
            _self.ShowMessage(file.id, "暂停", 0);
            var dom = domlist.find("[file_id='" + file.id + "']");
            dom.find(".op-pause").hide();
            dom.find(".op-continue").css({ display: "" })
        };
        this.Add = function(file) {
            if (!isExist(file)) {
                if (file.size || file.size == 0) {
                    file.size_str = Util.File.ShowSize(file.size)
                } else {
                    file.size_str = ""
                }
                var temp = $(String.formatmodel(_fileTemp, file));
                if (file.up_type == 1) {
                    getBtn({
                        dom: temp, text: "暂停", className: "op-pause",
                        callback: function(e) {
                            if (file.status.toString() != "4" || file.status.toString() != "70") {
                                if (_TUpload.pause(file)) {
                                    _self.ShowMessage(file.id, "暂停", 0);
                                    var dom = domlist.find("[file_id='" + file.id + "']");
                                    dom.find(".op-pause").hide();
                                    dom.find(".op-continue").css({ display: "" })
                                }
                            }
                            return false
                        }
                    });
                    getBtn({
                        dom: temp, text: "继续", hide: true, className: "op-continue",
                        callback: function(e) {
                            if (_TUpload.reupload(file)) {
                                _self.ShowMessage(file.id, "准备续传..", 0);
                                var dom = domlist.find("[file_id='" + file.id + "']");
                                dom.find(".op-pause").css({ display: "" });
                                dom.find(".op-continue").hide()
                            }
                            return false
                        }
                    });
                    getBtn({
                        dom: temp, text: "移除", className: "op-delete",
                        callback: function(e) {
                            if (file.status == undefined || file.status.toString() == "9") {
                                _self.Del(file);
                                _TUpload.del(file)
                            } else {
                                Core.Message.Confirm({
                                    text: "确认要取消上传该文件吗?", type: "war",
                                    callback: function(r) {
                                        if (r) {
                                            _self.Del(file);
                                            _TUpload.del(file)
                                        }
                                    }
                                })
                            }
                            return false
                        }
                    })
                } else {
                    getBtn({
                        dom: temp, text: "移除", className: "op-delete",
                        callback: function(e) {
                            _self.Del(file);
                            var access = _FUpload.getAccess();
                            access.del(file);
                            return false
                        }
                    })
                }
                domlist.append(temp);
                if (file.error) {
                    _self.Error(file)
                } else {
                    if (!_cacheData) {
                        _cacheData = { }
                    }
                    _cacheData[file.id] = file
                }
            }
        };
        this.HideCTLButton = function(file, pause, conti) {
            if (file.up_type == 1) {
                var dom = domlist.find("[file_id='" + file.id + "']");
                if (dom.length) {
                    var pauseBtn = dom.find(".op-pause");
                    var contiBtn = dom.find(".op-continue");
                    if (pause) {
                        if (pauseBtn.css("display") != "none") {
                            pauseBtn.hide()
                        }
                    } else {
                        if (pauseBtn.css("display") == "none") {
                            pauseBtn.css({ display: "" })
                        }
                    }
                    if (conti) {
                        if (contiBtn.css("display") != "none") {
                            contiBtn.hide()
                        }
                    } else {
                        if (contiBtn.css("display") == "none") {
                            contiBtn.css({ display: "" })
                        }
                    }
                }
            }
        };
        this.Del = function(file) {
            var dom = domlist.find("[file_id='" + file.id + "']");
            if (dom.length) {
                dom.html("").remove()
            }
            if (_cacheData) {
                _cacheData[file.id] = null;
                delete _cacheData[file.id]
            }
        };
        this.Get = function(id) { return _cacheData[id] };
        this.IsExist = function(file) { return isExist(file) };
        this.Success = function(file) {
            var dom = domlist.find("[file_id='" + file.id + "']");
            dom.find("[rel='pg_text']").html('<i class="ico-operate op-done"></i>');
            dom.find(".progress-bar").html("").remove();
            if (file.aid != undefined) {
                getBtn({
                    dom: dom, text: "跳到所在目录", first: true, className: "op-folder",
                    callback: function(e) {
                        PageCTL.GOTO(file.aid, file.cid);
                        _self.Close();
                        return false
                    }
                })
            }
            if (file.up_type == 1) {
                dom.find(".op-pause").empty().remove();
                dom.find(".op-continue").empty().remove()
            }
            if (_cacheData && _cacheData[file.id]) {
                _cacheData[file.id] = null;
                delete _cacheData[file.id]
            }
        };
        this.Error = function(file) {
            var dom = domlist.find("[file_id='" + file.id + "']");
            dom.attr("class", "err");
            dom.attr("title", file.error);
            dom.find("[rel='pg_text']").html(file.error);
            dom.find(".progress-bar").html("").remove();
            dom.find(".op-pause").empty().remove();
            dom.find(".op-continue").empty().remove();
            if (_cacheData && _cacheData[file.id]) {
                _cacheData[file.id] = null;
                delete _cacheData[file.id]
            }
        };
        this.ShowMessage = function(id, str) {
            var dom = domlist.find("[file_id='" + id + "']");
            dom.find("[rel='pg_text']").html(str)
        };
        this.Progress = function(file) {
            var dom = domlist.find("[file_id='" + file.id + "']");
            if (file.progress == undefined) {
                file.progress = ""
            }
            if (file.speed_str == undefined) {
                file.speed_str = ""
            }
            dom.find("[rel='pg_text']").html(file.progress + file.speed_str);
            var line = dom.find(".progress-bar");
            if (!line.length) {
                line = $('<div class="progress-bar"></div>');
                dom.append(line)
            }
            line.css({ width: file.progress })
        };
        var _totalobj = null;
        this.TotalProgress = function() {
            if (_cacheData) {
                var count = 0;
                var size = 0;
                var complete = 0;
                if (!_totalobj) {
                    _totalobj = { }
                }
                var speed = 0;
                for (var k in _cacheData) {
                    var file = _cacheData[k];
                    _totalobj[k] = { size: Number(file.size), complete: file.complete ? Number(file.complete) : 0 };
                    if (file.is_uploading == 1) {
                        speed += (file.speed ? file.speed : 0)
                    }
                    count++;
                    size += _totalobj[k].size;
                    complete += _totalobj[k].complete
                }
                if (count) {
                    var per = (complete / size);
                    var less_size = size - complete;
                    var msg = "";
                    var less_time;
                    if (speed) {
                        less_time = Util.Date.GetTimeText(Math.floor((less_size / 1024) / speed))
                    } else {
                        less_time = "00:00:00"
                    }
                    if (count) {
                        msg += count + "个文件正在上传，共" + Util.File.ShowSize(size) + "，已完成" + ((per * 100).toFixed(1) + "%, 剩余时间: " + less_time)
                    }
                    _content.find('[rel="upload_msg"]').html(msg)
                } else {
                    _content.find('[rel="upload_msg"]').html("");
                    _totalobj = null
                }
            } else {
                _totalobj = null
            }
            _MinForm.Progress(_totalobj)
        };
        this.Close = function() {
            _self.Hide();
            Core.WinHistory.Del(_self.Key);
            _self.IsOpen = false;
            _isClose = true
        };
        this.IsOpen = false;
        this.Hide = function() {
            var t = _self.warp.offset().top;
            _self.warp.css({ top: t - 9999 });
            _self.DeActive();
            Core.WinHistory.DeActiveStatus(_self);
            _self.IsActive = false;
            _loadState = false;
            _self.IsOpen = false
        };
        this.Open = function() {
            _self.CreateDom();
            checkUpEngine();
            if (_loadState) {
                _self.warp.show()
            } else {
                var t = _self.warp.offset().top;
                _self.warp.css({ top: t + 9999 });
                _loadState = true
            }
            if (_isClose) {
                _isClose = false;
                Core.WinHistory.Add(_self)
            }
            Core.WinHistory.Active(_self);
            _self.IsOpen = true
        };
        this.CheckUpEngine = function() {
            checkUpEngine();
            Core.Upload.ChangeEngine(Core.CONFIG.UpEngine)
        };
        this.IsClose = function() { return _isClose };
        var _reloadTimer;
        this.ReloadPage = function(aid, cid) {
            if (_reloadTimer) {
                window.clearTimeout(_reloadTimer)
            }
            _reloadTimer = window.setTimeout(function() {
                if (Number(aid) == 999) {
                    if (Core.CONFIG.QFileAPI.DataAPI) {
                        Core.CONFIG.QFileAPI.DataAPI.Reload(aid, cid)
                    }
                } else {
                    if (Core.FileConfig.DataAPI) {
                        Core.FileConfig.DataAPI.Reload(aid, cid)
                    }
                }
                if (_reloadTimer) {
                    window.clearTimeout(_reloadTimer)
                }
            }, 1200)
        }
    })();
    var listen = function() {
        if (!_cache.listenTimer) {
            _cache.listenTimer = window.setInterval(function() { _DisplayForm.TotalProgress() }, 50)
        }
    };
    var _TUpload = (function() {
        var _TCache = { initState: false, errorState: false, configTxt: "*.*", aid: 1, cid: 0, disable: "btn-disabled", FFIndexKey: 0 };
        var _UpList = { };
        var _DataExport = {
            InfoImport: function(file, str) {
                if (str) {
                    var arr = str.split("|");
                    if (arr.length) {
                        for (var i = 0, len = arr.length; i < len; i++) {
                            var sArr = arr[i].split("=");
                            switch (sArr[0]) {
                            case "FileName":
                                if (!file.name) {
                                    var p = sArr[1].replace(/\//g, "\\");
                                    file.name = p.substring(p.lastIndexOf("\\") + 1, p.length)
                                }
                                break;
                            case "TaskID":
                                file.up_id = sArr[1];
                                break;
                            case "Progress":
                                file.progress = sArr[1];
                                break;
                            case "UpStatus":
                                file.status = sArr[1];
                                break;
                            case "EstimateTime":
                                file.estimate_time = sArr[1];
                                break;
                            case "ValidUpBytes":
                                file.valid_up_bytes = sArr[1];
                                break;
                            case "Speed":
                                file.speed = sArr[1];
                                break;
                            case "PickCode":
                                file.pick_code = sArr[1];
                                break;
                            case "FilePath":
                                file.path = sArr[1];
                                break;
                            case "Status":
                                file.status = sArr[1];
                                break;
                            case "Total":
                                file.valid_up_bytes = sArr[1];
                                file.progress = file.valid_up_bytes + "%";
                                break;
                            case "Elapsed":
                                file.elapsed = sArr[1];
                                break;
                            case "FileSize":
                                file.size = Number(sArr[1]);
                                break;
                            case "ErrCode":
                                if (_TCache.fferrcode != sArr[1]) {
                                    _TCache.fferrcode = sArr[1];
                                    file.err_code = _TCache.fferrcode;
                                    Core.Debug.write("Error: " + file.name + " " + _TCache.fferrcode)
                                }
                                break;
                            case "ServerErrCode":
                                if (_TCache.ffservererrcode != sArr[1]) {
                                    _TCache.ffservererrcode = sArr[1];
                                    file.err_server_code = _TCache.ffservererrcode
                                }
                                break;
                            case "ServerErrMsg":
                                if (_TCache.ffservererrmsg != sArr[1]) {
                                    _TCache.ffservererrmsg = sArr[1];
                                    file.err_server_msg = _TCache.ffservererrmsg
                                }
                                break;
                            case "Retry":
                                file.retry = sArr[1];
                                break;
                            case "Wait":
                                file.wait_time = Core.CONFIG.TUpSleepTime - Number(sArr[1]);
                                break;
                            case "Offset":
                                file.offset_size = Number(sArr[1]);
                                break
                            }
                            if (file.elapsed != undefined && file.status != undefined && file.status.toString() == "6") {
                                file.progress = (Number(file.valid_up_bytes) / Number(file.size) * 100).toFixed(1) + "%";
                                var offset = file.offset_size;
                                if (!offset) {
                                    offset = 0
                                }
                                file.speed = Number(file.elapsed) ? ((Number(file.valid_up_bytes) - offset) / 1024) / (Number(file.elapsed)) : 0;
                                file.estimate_time = file.speed ? (Number(file.size) - Number(file.valid_up_bytes)) / 1024 / file.speed : 0;
                                file.estimate_time = Util.Date.GetTimeText(file.estimate_time.toFixed(0))
                            }
                        }
                    }
                }
            },
            UploadExport: function(file) {
                var str;
                var aid = file.aid;
                if (aid == 999) {
                    var config = _cache.config[aid.toString()];
                    aid = config.aid
                }
                str = "cookie=" + USER_COOKIE_LB + "&user_id=" + USER_ID + "&sha1={sha1}&md115={md115}&filesize=" + file.size + "&filename=" + encodeURIComponent(file.name) + "&aid=" + aid + "&cid=" + file.cid + "&pickcode={pick_code}&isp=" + Core.CONFIG.TUpSp + "&isweb=1";
                return str
            }
        };
        var setting = function(config) { _TCache.configTxt = (config.upload_type_limit.length && typeof config.upload_type_limit != "string") ? "*." + config.upload_type_limit.join(";*.") : "*.*" };
        var _event = {
            ReloadFile: function(file) {
                file.is_reupload = true;
                file.upload_status = 0;
                file.error = null;
                _UpList[file.id] = file;
                _DisplayForm.Add(file);
                _DisplayForm.Open();
                _DisplayForm.HideCTLButton(file, true, false)
            },
            OnReFlashTaskInfo: function(file, taskInfo) {
                if (file) {
                    _DataExport.InfoImport(file, taskInfo);
                    if (!_TCache.DebugStatus || _TCache.DebugStatus != file.status.toString()) {
                        _TCache.DebugStatus = file.status.toString();
                        Core.Debug.write("Upload_Status:" + _TCache.DebugStatus)
                    }
                    switch (file.status.toString()) {
                    case "1":
                        _DisplayForm.ShowMessage(file.id, "加入成功", 0);
                        break;
                    case "等待":
                    case "2":
                        _DisplayForm.ShowMessage(file.id, "等待上传", 0);
                        _DisplayForm.HideCTLButton(file, false, true);
                        break;
                    case "计算Hash":
                    case "3":
                        file.is_uploading = 0;
                        _DisplayForm.ShowMessage(file.id, "解析中:" + file.progress, 0);
                        if (Number(file.progress.replace("%", "")) > 99) {
                            _DisplayForm.HideCTLButton(file, false, true)
                        }
                        break;
                    case "请求上传":
                    case "4":
                        _DisplayForm.ShowMessage(file.id, "正发送上传请求", 0);
                        if (file.err_code && file.err_code.toString() == "601") {
                            file.is_uploading = 1;
                            file.speed_str = "(0KB/S)";
                            if (file.progress) {
                                file.complete = file.size * (Number(file.progress.replace("%", "")) / 100)
                            }
                            _DisplayForm.Progress(file)
                        }
                        break;
                    case "连接":
                    case "5":
                        _DisplayForm.ShowMessage(file.id, "连接中...", 0);
                        if (file.err_code && file.err_code.toString() == "601") {
                            file.is_uploading = 1;
                            file.speed_str = "(0KB/S)";
                            if (file.progress) {
                                file.complete = file.size * (Number(file.progress.replace("%", "")) / 100)
                            }
                            _DisplayForm.Progress(file)
                        }
                        break;
                    case "停止":
                    case "7":
                        file.is_uploading = 0;
                        _DisplayForm.ShowMessage(file.id, "暂停", 0);
                        _DisplayForm.HideCTLButton(file, true, false);
                        if (Core.CONFIG.TUpDebugKey) {
                            if (file.err_code) {
                                if (file.err_code.toString() != "100") {
                                    _DisplayForm.ShowMessage(file.id, file.err_code + " " + file.err_server_code + " " + decodeURIComponent(file.err_server_msg), -1)
                                }
                            }
                        }
                        break;
                    case "70":
                        if (file.err_server_code && file.err_server_code.toString().length > 3) {
                            file.error = decodeURIComponent(file.err_server_msg);
                            _DisplayForm.Error(file);
                            return
                        }
                        var serCode = Number(file.err_server_code);
                        if (serCode && serCode >= 300 && serCode < 400) {
                            if (_TUpload.pause(file)) {
                                _DisplayForm.PauseUI(file)
                            }
                            return
                        }
                        if (file.err_code && file.err_code.toString() == "601") {
                            file.is_uploading = 1;
                            file.speed_str = "(0KB/S)";
                            if (file.progress) {
                                file.complete = file.size * (Number(file.progress.replace("%", "")) / 100)
                            }
                            _DisplayForm.Progress(file)
                        } else {
                            _DisplayForm.ShowMessage(file.id, "[中断]" + file.wait_time + "秒后重试", 0)
                        }
                        if (Core.CONFIG.TUpDebugKey) {
                            if (file.err_code) {
                                if (file.err_code.toString() != "100") {
                                    _DisplayForm.ShowMessage(file.id, "重连中 " + file.err_code + " " + file.err_server_code + " " + decodeURIComponent(file.err_server_msg), -1)
                                }
                            }
                        }
                        break;
                    case "传输":
                    case "6":
                        file.is_uploading = 1;
                        file.speed_str = "(" + Util.File.ShowSize(file.speed * 1000, 1) + "/S)";
                        file.complete = file.size * (Number(file.progress.replace("%", "")) / 100);
                        _DisplayForm.Progress(file);
                        break;
                    case "校验":
                    case "8":
                        _DisplayForm.ShowMessage(file.id, "校验文件中...", 0);
                        break;
                    case "完成":
                    case "9":
                        file.is_uploading = 0;
                        _DisplayForm.Success(file);
                        var reAid = file.aid;
                        var reCid = file.cid;
                        if (file.pick_code) {
                            $.ajax({ url: "?ct=upload_ups&ac=set_file_upload_finish", data: { pick_code: file.pick_code }, type: "POST", success: function() { Core.SpaceData.Sync() } })
                        }
                        _TUpload.del(file);
                        try {
                            if (reAid && reAid.toString().indexOf("q_") != -1) {
                                _DisplayForm.ReloadPage(999, file.cid)
                            } else {
                                _DisplayForm.ReloadPage(reAid, reCid)
                            }
                        } catch(e) {
                        }
                        return 2;
                        break
                    }
                }
            },
            SelectFiles: function(id, fileName, fileSize) {
                var p = fileName.replace(/\//g, "\\");
                var file = { id: id, path: fileName, name: p.substring(p.lastIndexOf("\\") + 1, p.length), size: Number(fileSize), up_type: 1, aid: _TCache.aid, cid: _TCache.cid };
                if (_DisplayForm.IsExist(file)) {
                    return
                }
                var r = true;
                var config = _cache.config[file.aid];
                if (config.upload_size_limit < file.size) {
                    file.error = String.format(Core.CONFIG.FUpErrMsg["-110"], Util.File.ShowSize(config.upload_size_limit));
                    r = false;
                    Core.Debug.write(config.upload_size_limit + " " + file.size)
                }
                if (file.size <= 0) {
                    file.error = "不能上传空文件";
                    r = false
                }
                if (r) {
                    var space = Core.SpaceData.GetData();
                    var spaceKey = file.aid;
                    if (Number(spaceKey) > 0 && Number(spaceKey) != 5 && Number(spaceKey) != 12) {
                        spaceKey = 1
                    }
                    var model = space[spaceKey];
                    if (file.aid && file.aid.toString().indexOf("q_") != -1) {
                        if ((Number(model.used) + (Number(file.size))) > Number(model.total)) {
                            file.error = "空间大小不足";
                            Core.Debug.write("空间大小不足 Name:" + file.name + " Size:" + file.size + " Space:" + model.total + "\n");
                            r = false
                        }
                    }
                }
                if (r) {
                    var upStr = _DataExport.UploadExport(file);
                    var uploadId;
                    var addResult = false;
                    var nowDate = new Date();
                    uploadId = Number(nowDate.getHours().toString() + nowDate.getMinutes().toString() + nowDate.getSeconds().toString() + _TCache.FFIndexKey);
                    _TCache.FFIndexKey++;
                    addResult = _TCache.Uploader.AddUpTask(uploadId, file.path, upStr);
                    if (uploadId && addResult) {
                        file.up_id = uploadId;
                        var str = _TCache.Uploader.GetTaskInfo(file.up_id);
                        Core.Debug.write("返回内容" + str);
                        _DataExport.InfoImport(file, str);
                        _UpList[file.id] = file;
                        Core.SpaceData.ChangeUse(file.aid, (Number(file.size)), 1);
                        Core.Debug.write("加入上传列队: Up_ID:" + uploadId + " string:" + upStr)
                    } else {
                        file.error = "加入列队失败";
                        r = false
                    }
                }
                _DisplayForm.Add(file);
                _DisplayForm.Open();
                try {
                    if (r) {
                        _DisplayForm.ShowMessage(file.id, "准备上传...", 0);
                        _TCache.Uploader.ContinueUpTask(file.up_id);
                        Core.Debug.write("开始上传文件: Up_ID:" + file.up_id)
                    }
                } catch(e) {
                    _DisplayForm.ShowMessage(file.id, "上传出错", -1)
                }
            }
        };
        var getFileList = function() {
            var ids = _TCache.Uploader.GetTaskCount();
            for (var i = 0, len = ids; i < len; i++) {
                try {
                    var fileStr, ind = 10000;
                    ind = ind + i;
                    fileStr = _TCache.Uploader.GetTaskInfo(Number(ind));
                    if (!_TCache.ocx_version) {
                        _TCache.ocx_version = _TCache.Uploader.GetVersionInfo()
                    }
                    Core.Debug.write(fileStr);
                    if (fileStr && fileStr != "NULL") {
                        var file = { };
                        var key = new Date().getTime() + "_" + i;
                        file.id = key;
                        file.up_type = 1;
                        _DataExport.InfoImport(file, fileStr);
                        file.up_id = ind;
                        _event.ReloadFile(file)
                    }
                } catch(e) {
                    Core.Debug.write(e.message)
                }
            }
        };
        var loadCab = function() {
            if ($.browser.msie) {
                $(document.body).append($('<object classid="' + Core.CONFIG.TUpClassID_NB + '" codebase="' + Core.CONFIG.TUpCodeBase_NB + '" id="' + Core.CONFIG.TUpDomId + '" style=" position:absolute; top:-99999px;" onerror="Core.Upload.TUpLoadError();"></object>'))
            }
        };
        var showDownload = function(isupdate) {
            loadCab();
            var url;
            var is_unix = false;
            if ($.browser.msie) {
                url = Core.CONFIG.TUpDownloadUrl_np
            } else {
                if (Core.CONFIG.IsMac) {
                    url = Core.CONFIG.TUpDownloadUrl_np_mac
                } else {
                    if (Core.CONFIG.IsWindowNT) {
                        url = Core.CONFIG.TUpDownloadUrl_np
                    } else {
                        is_unix = true;
                        url = Core.CONFIG.TUpDownloadUrl_np_unix
                    }
                }
            }
            if (is_unix) {
                Core.Message.Alert({ text: isupdate ? "您需要更新大文件上传控件" : "您还未安装大文件上传控件", content: '请点击确定按钮安装，安装完后需重启浏览器。使用115上传控件支持最大上传50G的单个文件，并且还提供断点续传功能，方便您随时暂停或恢复上传。<br/><a href="' + Core.CONFIG.TUpDownloadUrl_np_unix + '">下载64位控件</a> <a href="' + Core.CONFIG.TUpDownloadUrl_np_unix_32 + '">下载32位控件</a>', type: "war" })
            } else {
                Core.Message.Confirm({ text: isupdate ? "您需要更新大文件上传控件" : "您还未安装大文件上传控件", content: "请点击确定按钮安装，安装完后需重启浏览器。使用115上传控件支持最大上传50G的单个文件，并且还提供断点续传功能，方便您随时暂停或恢复上传。", type: "war", confirm_link: url, confirm_text: "立即下载" })
            }
        };
        var select = function() {
            if ($("#" + _TCache.UP_ID).hasClass(_TCache.disable)) {
                return -1
            }
            if (_TCache.errorState) {
                showDownload()
            } else {
                var configTxt = "支持的类型|" + _TCache.configTxt;
                try {
                    try {
                        var v = _TCache.Uploader.GetVersionInfo();
                        _TCache.ocx_version = v;
                        var version = Core.CONFIG.TUpUnixVersion;
                        if (Core.CONFIG.IsWindowNT) {
                            version = Core.CONFIG.TUpFFVersion
                        }
                        if (Core.CONFIG.IsMac) {
                            version = Core.CONFIG.TUpMacVersion;
                            if (Core.CONFIG.TUpTestVersion[v]) {
                                version = v
                            }
                        }
                        Core.Debug.write("要求版本: " + version + " 控件版本:" + v);
                        if (v.indexOf(version) == -1) {
                            Core.MinMessage.Show({ text: "您的极速上传控件需要更新才能使用! ", type: "war", timeout: Core.CONFIG.MsgTimeout });
                            showDownload(true);
                            return
                        }
                    } catch(e) {
                    }
                    _TCache.Uploader.SelectFileList(configTxt + "|");
                    return
                } catch(e) {
                    showDownload();
                    return
                }
            }
            return
        };
        var init = function(config) {
            if (!_TCache.initState) {
                var up = document.getElementById(Core.CONFIG.TUpDomId);
                _TCache.Uploader = up;
                if (_TCache.Uploader) {
                    $("#" + _TCache.UP_ID).unbind("click").bind("click", function() {
                        select();
                        return false
                    });
                    var v = _TCache.Uploader.GetVersionInfo();
                    v = v.replace("Ylmf Upload Plug-in v", "");
                    v = v.split(".");
                    if (Number(v[0]) == 1 && Number(v[1]) <= 5 && Number(v[2]) <= 6) {
                        _TCache.Uploader.InitService(USER_ID.toString(), USER_COOKIE_LB, Core.CONFIG.TUploadServer, Core.CONFIG.TUpReTryCount, Core.CONFIG.TUpSleepTime)
                    } else {
                        if (Number(v[1]) >= 7) {
                            var filterArr = (window.UPLOAD_CONFIG["2"].upload_type_limit);
                            var filter = (filterArr ? filterArr.join(",") : "");
                            _TCache.Uploader.InitService(USER_ID.toString(), USER_COOKIE_LB, Core.CONFIG.TUploadServer, filter, Core.CONFIG.TUpReTryCount, Core.CONFIG.TUpSleepTime, Core.CONFIG.TUpIsProxy)
                        } else {
                            _TCache.Uploader.InitService(USER_ID.toString(), USER_COOKIE_LB, Core.CONFIG.TUploadServer, Core.CONFIG.TUpReTryCount, Core.CONFIG.TUpSleepTime, Core.CONFIG.TUpIsProxy)
                        }
                    }
                    startLinten();
                    window.setTimeout(function() {
                        getFileList();
                        if (_TUpload.initCallback) {
                            _TUpload.initCallback()
                        }
                        _TUpload.initCallback = null
                    }, 10);
                    _TCache.initState = true
                }
            }
            setting(config)
        };
        var selectFilesCallback = function(result) {
            var arr = result.split("|");
            if (arr.length) {
                for (var i = 0; i < arr.length; i++) {
                    var item = arr[i].split("*");
                    if (item.length == 2) {
                        var key = new Date().getTime() + "_" + i;
                        _event.SelectFiles(key, item[0], item[1])
                    }
                }
            }
        };
        var startLinten = function() {
            if (_TCache.ListenTimer) {
                window.clearTimeout(_TCache.ListenTimer)
            }
            _TCache.ListenTimer = window.setTimeout(function() {
                var selectStr = _TCache.Uploader.GetFileList();
                if (selectStr != "NULL") {
                    Core.Debug.write(selectStr);
                    _TCache.Uploader.DeleteFileList();
                    selectFilesCallback(selectStr)
                }
                for (var k in _UpList) {
                    var file = _UpList[k];
                    if (file) {
                        var str = _TCache.Uploader.GetTaskInfo(Number(file.up_id));
                        _event.OnReFlashTaskInfo(file, str)
                    }
                }
                startLinten()
            }, Core.CONFIG.TUpRefashFreq)
        };
        return {
            isInit: function() { return _TCache.initState },
            select: function() {
                if (!_TCache.errorState) {
                    return select()
                }
            },
            showDownload: function() { showDownload() },
            reuploadByPickCode: function(pick_code) {
                if (_TCache.errorState) {
                    showDownload();
                    return
                }
                var file;
                for (var k in _UpList) {
                    var item = _UpList[k];
                    if (item.pick_code == pick_code) {
                        file = item;
                        break
                    }
                }
                if (file) {
                    if (_TUpload.reupload(file)) {
                        Core.Debug.write("继传 file:" + file.up_id);
                        _DisplayForm.HideCTLButton(file, false, true);
                        _DisplayForm.ShowMessage(file.id, "准备继传...", 0)
                    } else {
                        Core.MinMessage.Show({ text: "续传文件失败", type: "err", timeout: Core.CONFIG.MsgTimeout })
                    }
                } else {
                    Core.MinMessage.Show({ text: "本地缓存文件已删除,请重新选择", type: "err", timeout: Core.CONFIG.MsgTimeout })
                }
                _DisplayForm.Open()
            },
            delByPickCode: function(pick_code) {
                var file;
                for (var k in _UpList) {
                    var item = _UpList[k];
                    if (item.pick_code == pick_code) {
                        file = item;
                        break
                    }
                }
                if (file) {
                    _DisplayForm.Del(file);
                    _TUpload.del(file)
                }
            },
            pause: function(file) {
                var result = true;
                try {
                    _TCache.Uploader.StopUpTask(file.up_id);
                    return result
                } catch(e) {
                    Core.MinMessage.Show({ text: "暂停失败", type: "err", timeout: Core.CONFIG.MsgTimeout });
                    Core.Debug.write("暂停失败");
                    return false
                }
            },
            reupload: function(file) {
                var result = true;
                try {
                    _TCache.Uploader.ContinueUpTask(file.up_id)
                } catch(e) {
                    Core.Debug.write("客户端上传出错");
                    result = false
                }
                return result
            },
            del: function(file) {
                var result = true;
                if (file.up_id) {
                    try {
                        if (_UpList[file.id]) {
                            state = _TCache.Uploader.DeleteUpTask(file.up_id);
                            Core.Debug.write("删除 up_id: " + file.up_id + " 状态: " + state)
                        }
                    } catch(e) {
                        Core.Debug.write("客户端上传出错");
                        result = false
                    }
                }
                if (result) {
                    if (_UpList[file.id]) {
                        _UpList[file.id] = null;
                        delete _UpList[file.id];
                        Core.SpaceData.Sync()
                    }
                }
                return result
            },
            setDisabled: function(r) {
                if (r) {
                    $("#" + _TCache.UP_ID).addClass(_TCache.disable)
                } else {
                    $("#" + _TCache.UP_ID).removeClass(_TCache.disable)
                }
            },
            bindButton: function(id) { _TCache.UP_ID = id },
            show: function(txt) { $("#" + _TCache.UP_ID).html(txt).show() },
            hide: function() { $("#" + _TCache.UP_ID).hide() },
            setting: function(aid, cid) {
                if (aid == undefined) {
                    aid = 1;
                    cid = 0
                }
                if (cid.toString().indexOf("_0") != -1) {
                    cid = 0
                }
                var key = aid.toString();
                if (aid.toString().indexOf("q_") != -1) {
                    key = "999"
                }
                var config = _cache.config[key];
                _TCache.aid = aid;
                _TCache.cid = cid;
                try {
                    init(config)
                } catch(e) {
                }
            },
            write: function() {
                if ($.browser.msie) {
                    if (!document.getElementById(Core.CONFIG.TUpDomId)) {
                        var object = $('<object classid="' + Core.CONFIG.TUpClassID_NB + '" id="' + Core.CONFIG.TUpDomId + '" onreadystatechange="Core.Upload.TUpLoadStateChange(this);" style="position:absolute; top:-99999px;" onerror="Core.Upload.TUpLoadError();"></object>');
                        $(document.body).append(object)
                    }
                } else {
                    if (Core.CONFIG.IsWindows) {
                        if (navigator.plugins && navigator.plugins.length > 0) {
                            var p = navigator.plugins["115.COM Upload Plugin"];
                            if (p) {
                                var object = $('<embed id="' + Core.CONFIG.TUpDomId + '" type="application/ylmf-upload" width="0" height="0" style="position:absolute; top:-99999px;" />');
                                $(document.body).append(object)
                            } else {
                                Core.Upload.TUpLoadError()
                            }
                        } else {
                            Core.Upload.TUpLoadError()
                        }
                    } else {
                        Core.Upload.TUpLoadError()
                    }
                }
                $(document).bind("keyup", function(e) {
                    if (e.ctrlKey && e.shiftKey && e.keyCode == 220) {
                        Core.CONFIG.TUpDebugTime++;
                        if (Core.CONFIG.TUpDebugTime > 5) {
                            if (!Core.CONFIG.TUpDebugKey) {
                                Core.CONFIG.TUpDebugKey = true;
                                Core.MinMessage.Show({ text: "断点续传调试已开启", type: "suc", timeout: 2000 })
                            }
                        }
                    }
                })
            },
            statechange: function(ele) {
            },
            loaderror: function() {
                _TCache.errorState = true;
                if (document.getElementById(Core.CONFIG.TUpDomId)) {
                    document.body.removeChild(document.getElementById(Core.CONFIG.TUpDomId))
                }
            },
            isStart: function() { return _TCache.initState },
            isInstall: function() { return !_TCache.errorState }
        }
    })();
    var _FUpload = (function() {
        var _FCache = { initState: false };
        var _dataAccess = {
            del: function(file) {
                if (_FCache.Uploader.getFile(file.id)) {
                    _FCache.Uploader.cancelUpload(file.id)
                }
                _DisplayForm.Del(file)
            }
        };
        var fBindEvents = function(settings) {
            settings.swfupload_loaded_handler = function() {
                if (!_FCache.loaded) {
                    _FCache.loaded = true;
                    if (_loadedFunList) {
                        for (var i = 0, len = _loadedFunList.length; i < len; i++) {
                            _loadedFunList[i]()
                        }
                        _loadedFunList = false
                    }
                    if (_FloadedCallback) {
                        _FloadedCallback()
                    }
                }
            };
            settings.file_queued_handler = function(file) {
                file.up_type = 0;
                file.aid = this.customSettings.aid;
                file.cid = this.customSettings.cid;
                if (!_DisplayForm.IsExist(file)) {
                    if (file.size > 1024 * 1024 * 1024) {
                        _FCache.Uploader.cancelUpload(file.id);
                        file.error = "请改用极速上传, 普通上传不支持上传大于1G的文件"
                    } else {
                        if (Util.Validate.mb_strlen(file.name) > 451) {
                            _FCache.Uploader.cancelUpload(file.id);
                            file.error = "文件名过长"
                        } else {
                            if (!this.customSettings.FileSizeTotal) {
                                this.customSettings.FileSizeTotal = { };
                                var spaceData = Core.SpaceData.GetData();
                                for (var k in spaceData) {
                                    if (!this.customSettings.FileSizeTotal[k]) {
                                        this.customSettings.FileSizeTotal[k] = { }
                                    }
                                    this.customSettings.FileSizeTotal[k].used = Number(spaceData[k].used);
                                    this.customSettings.FileSizeTotal[k].total = Number(spaceData[k].total)
                                }
                            }
                            var spaceKey = this.customSettings.aid;
                            if (Number(spaceKey) > 0 && Number(spaceKey) != 5 && Number(spaceKey) != 12) {
                                spaceKey = 1
                            }
                            var useSizeItem = this.customSettings.FileSizeTotal[spaceKey.toString()];
                            if (file.aid && file.aid.toString().indexOf("q_") != -1) {
                                if (useSizeItem) {
                                    if ((Number(useSizeItem.used) + Number(file.size)) > Number(useSizeItem.total)) {
                                        _FCache.Uploader.cancelUpload(file.id);
                                        file.error = "空间不足";
                                        _DisplayForm.Add(file);
                                        _DisplayForm.Open();
                                        return
                                    }
                                    useSizeItem.used = Number(useSizeItem.used) + Number(file.size)
                                }
                            }
                        }
                    }
                    file.complete = 0;
                    _DisplayForm.Add(file);
                    file.is_uploading = 1;
                    _DisplayForm.Open()
                } else {
                    _FCache.Uploader.cancelUpload(file.id)
                }
            };
            settings.file_queue_error_handler = function(file, error, message) {
                if (isNaN(file.size) || (_cacheConfig.upload_size_limit > file.size && error == "-110")) {
                    var txt = "请改用极速上传, 普通上传不支持上传大于1G的文件";
                    file.error = '<span title="' + txt + '">' + txt + "</span>"
                } else {
                    file.error = String.format(Core.CONFIG.FUpErrMsg[error], Util.File.ShowSize(Number(_cacheConfig.upload_size_limit)))
                }
                _DisplayForm.Add(file);
                _DisplayForm.Open()
            };
            settings.file_dialog_complete_handler = function(selected, queued) {
                if (!_FCache.Uploader.getFile()) {
                    this.customSettings.FileSizeTotal = null
                }
                this.startUpload()
            };
            settings.upload_start_handler = function(file) {
                file = _DisplayForm.Get(file.id);
                _FCache.isupload = true;
                _FUpload.setting(file.aid, file.cid, file.name_md5, file.token_time);
                _FCache.isupload = false;
                _DisplayForm.Progress(file);
                this.customSettings.StartTime = new Date()
            };
            settings.upload_progress_handler = function(file, c, t) {
                file = _DisplayForm.Get(file.id);
                if (file) {
                    file.complete = c;
                    file.total = t;
                    var useTime = new Date().getTime() - this.customSettings.StartTime.getTime();
                    var speed = Number(c / useTime);
                    var speedstr = (speed * 1000 / 1024);
                    if (speedstr > 1024) {
                        speedstr = (speedstr / 1204).toFixed(1) + "m"
                    } else {
                        speedstr = speedstr.toFixed(1) + "k"
                    }
                    var pro = (c / t) * 100;
                    if (pro > 99) {
                        pro = 99
                    }
                    file.progress = pro.toFixed(1) + "%";
                    file.speed = speed;
                    file.speed_str = "(" + speedstr + "/s)";
                    _DisplayForm.Progress(file)
                }
            };
            settings.upload_error_handler = function(file, error, message) {
                file = _DisplayForm.Get(file.id);
                if (file) {
                    file.is_uploading = 0;
                    this.customSettings.UploadFileSize -= file.size;
                    this.customSettings.TotalSize -= file.size;
                    file.error = Core.CONFIG.FUpErrMsg[error];
                    _DisplayForm.Error(file)
                }
            };
            settings.upload_success_handler = function(file, data) {
                file = _DisplayForm.Get(file.id);
                file.is_uploading = 0;
                try {
                    Core.Debug.write(data);
                    data = eval("(" + data + ")");
                    if (data.state) {
                        try {
                            if (file.aid && file.aid.toString().indexOf("q_") != -1) {
                                _DisplayForm.ReloadPage(999, file.cid)
                            } else {
                                _DisplayForm.ReloadPage(data.data.aid, data.data.cid)
                            }
                        } catch(e) {
                        }
                        _DisplayForm.Success(file);
                        Core.SpaceData.ChangeUse(data.aid, file.size, 1);
                        this.customSettings.UploadFileSize -= file.size;
                        this.customSettings.CompleteSize += file.size;
                        return
                    }
                    file.error = data.message
                } catch(e) {
                    file.error = "错误: 未知原因"
                }
                _DisplayForm.Error(file)
            };
            settings.upload_complete_handler = function(file) {
                file = _DisplayForm.Get(file.id);
                file && (file.is_uploading = 0)
            };
            settings.queue_complete_handler = function() {
            }
        };
        var setting = function(data) {
            var typeStr = data.upload_type_limit == "*" ? "*.*" : ("*." + data.upload_type_limit.join(";*."));
            var params;
            var postAid = data.aid, postCid = data.cid;
            if (data.cid) {
                if (data.cid.toString().indexOf("_0") != -1) {
                    postAid = Number(data.cid.toString().replace("_0", ""));
                    data.cid = 0;
                    postCid = 0
                }
                params = { aid: data.aid, cid: data.cid, cookie: USER_COOKIE }
            } else {
                params = { aid: data.aid, cookie: USER_COOKIE }
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
                    tupKey = "Q_" + config.aid.replace("q_", "") + "_" + (postCid ? postCid : 0)
                }
                break
            }
            params.target = tupKey;
            var url = data.upload_url;
            if (PAGE_NEW_UP_KEY) {
                url = UPLOAD_CONFIG_H5.url
            }
            if (!_FCache.Uploader) {
                var settings = { flash_url: Core.CONFIG.FUpSWF, upload_url: url, file_types_description: typeStr, file_upload_limit: 0, file_types: typeStr, file_size_limit: Util.File.ShowSize(UPLOAD_CONFIG_H5.size_limit, 0), file_queue_limit: 0, button_action: SWFUpload.BUTTON_ACTION.SELECT_FILES, custom_settings: { aid: postAid, cid: postCid }, debug: Core.CONFIG.FUpDebug, post_params: params, button_cursor: SWFUpload.CURSOR.HAND, button_image_url: Core.CONFIG.FUpImg, button_width: "100", button_height: "30", button_placeholder_id: _FCache.UP_ID, button_window_mode: SWFUpload.WINDOW_MODE.TRANSPARENT, rsa1: Core.CONFIG.FUpRsa1, rsa2: Core.CONFIG.FUpRsa2 };
                fBindEvents(settings);
                if (SWFUpload) {
                    _FCache.Uploader = new SWFUpload(settings)
                }
            } else {
                if (!_FCache.isupload) {
                    if (!_FCache.loaded) {
                        _loadedFunList.push(function() { setting(data) });
                        return
                    }
                    _FCache.Uploader.setFileTypes(typeStr, typeStr);
                    _FCache.Uploader.setFileSizeLimit(Util.File.ShowSize(data.upload_size_limit));
                    _FCache.Uploader.customSettings.aid = postAid;
                    _FCache.Uploader.customSettings.cid = postCid
                } else {
                    _FCache.Uploader.setUploadURL(url);
                    var postSetting;
                    if (data.cid) {
                        postSetting = { aid: postAid, cid: postCid, cookie: USER_COOKIE }
                    } else {
                        postSetting = { aid: postAid, cookie: USER_COOKIE }
                    }
                    if (data.md5) {
                        postSetting.token = data.md5
                    }
                    if (data.token_time) {
                        postSetting.time = data.token_time
                    }
                    postSetting.target = tupKey;
                    _FCache.Uploader.setPostParams(postSetting)
                }
            }
        };
        var _cacheConfig;
        var init = function(config) {
            _cacheConfig = config;
            if (!_FCache.initState) {
                Util.Load.JS(Core.CONFIG.JSPath.FUp, function() {
                    window.setTimeout(function() {
                        _FCache.initState = true;
                        setting(_cacheConfig)
                    }, 10)
                })
            } else {
                setting(_cacheConfig)
            }
        };
        var _loadedFunList = [];
        return {
            isStart: function() { return _FCache.loaded }, getAccess: function() { return _dataAccess },
            dom: function(id, boxId) {
                _FCache.UP_ID = id;
                _FCache.Box_ID = boxId
            },
            show: function() { $("#" + _FCache.Box_ID).css({ top: "", position: "" }) },
            hide: function() { $("#" + _FCache.Box_ID).css({ top: -9999 + "px", position: "absolute" }) },
            setting: function(aid, cid, md5, token_time) {
                if (aid == undefined) {
                    aid = 1;
                    cid = 0
                }
                if (aid.toString().indexOf("q_") != -1) {
                    aid = 999
                }
                var config = _cache.config[aid.toString()];
                config.cid = cid;
                if (md5) {
                    config.md5 = md5
                }
                if (token_time) {
                    config.token_time = token_time
                }
                init(config)
            },
            setDisabled: function(disable) {
                if (!_FCache.loaded) {
                    _loadedFunList.push(function() { _FCache.Uploader.setButtonDisabled(disable) });
                    return
                }
                if (_FCache.Uploader) {
                    _FCache.Uploader.setButtonDisabled(disable)
                }
            }
        }
    })();
    var _UpCTL = (function() {
        var _btn;
        return {
            show: function() { _btn.show() }, hide: function() { _btn.hide() },
            setting: function(aid, cid) {
                if (_FUpload.isStart()) {
                    _FUpload.setting(aid, cid)
                }
                if (_TUpload.isStart()) {
                    _TUpload.setting(aid, cid)
                }
                _DisplayForm.ChangeDir(aid, cid)
            },
            setDisabled: function(disable, aid) {
                _FUpload.setDisabled(disable);
                if (aid && aid == 12) {
                    disable = false
                }
                _TUpload.setDisabled(disable)
            }
        }
    })();
    var _FloadedCallback;
    return {
        GetTUploadInstall: function() { return _TUpload.isInstall() }, ShowOCXDownLoad: function() { _TUpload.showDownload() },
        Show: function(aid, cid, notSelect) {
            Core.Upload.SetCatalog(aid, cid);
            Core.Upload.Open(notSelect)
        },
        ShowQ: function(aid, cid, config) {
            window.UPLOAD_CONFIG["999"] = config;
            var c = window.UPLOAD_CONFIG;
            Core.Upload.Show(aid, cid)
        },
        Open: function(notSelect) {
            var doClose = _DisplayForm.IsClose();
            _DisplayForm.Open();
            if (!notSelect && Core.CONFIG.UpEngine != 0 && _TUpload.isInstall()) {
                window.setTimeout(function() {
                    if (_TUpload.select() === -1) {
                        _DisplayForm.Open()
                    }
                }, 10);
                return
            }
        },
        WriteOCX: function() { _TUpload.write() },
        SetCatalog: function(aid, cid) {
            _cache.ActiveAid = aid;
            _cache.ActiveCid = cid;
            _UpCTL.setting(_cache.ActiveAid, _cache.ActiveCid)
        },
        SetConfig: function(config) { _cache.config = config },
        ChangeEngine: function(engine) {
            Core.CONFIG.UpEngine = engine;
            _UpCTL.setting(_cache.ActiveAid, _cache.ActiveCid);
            _DisplayForm.Install()
        },
        TUpLoadError: function() { _TUpload.loaderror() },
        TUpLoadStateChange: function(ele) { _TUpload.statechange(ele) },
        Disable: function(r, aid) { _UpCTL.setDisabled(r, aid) },
        ReuploadByPickCode: function(pick_code) {
            if (_TUpload.isInit()) {
                for (var i = 0, len = pick_code.length; i < len; i++) {
                    var item = pick_code[i];
                    _TUpload.reuploadByPickCode(item)
                }
            } else {
                _TUpload.initCallback = function() {
                    window.setTimeout(function() {
                        for (var i = 0, len = pick_code.length; i < len; i++) {
                            var item = pick_code[i];
                            _TUpload.reuploadByPickCode(item)
                        }
                    }, 20)
                };
                Core.Upload.Show(1, 0, true)
            }
        },
        DeleteByPickCode: function(pick_code) { _TUpload.delByPickCode(pick_code) },
        CheckUpEngine: function() { _DisplayForm.CheckUpEngine() }
    }
})();
Core.VIPNotice = (function() {
    var _win, _spaceWin;
    var create = function() {
        if (!_win) {
            var url = "?ct=vip_notice";
            if (Core.FilePermission.VipExp()) {
                url += "&ac=exp"
            }
            var _content = $('<iframe style="width:100%; height:230px; background:#fff;" frameborder=0 src="' + url + '"></iframe>');
            _win = new Core.DialogBase({ title: "VIP贵宾提示", content: _content, width: 460 })
        }
    };
    return {
        Upgrade: function() {
            create();
            _win.Open(function() {
            })
        },
        HideUpgrade: function() {
            if (_win) {
                _win.Close()
            }
        },
        NotSpace: function() {
            if (Core.FilePermission.Vip()) {
                return
            }
            if (Core.FilePermission.VipExp()) {
                return
            }
            var notspace_cook = Util.Cookie.get("not_space_cook");
            if (!notspace_cook) {
                if (!_spaceWin) {
                    var _content = $('<div class="fail-contents"><div class="fail-text"><h3>糟糕，您的空间就快用完啦！</h3><p>建议您升级成为VIP贵宾，立即扩容空间！</p><p>VIP服务说明：额外扩容50GB或115GB超大网盘+超长分享期限+超大同步盘+1.5G超大文件上传+文件加密码分享...</p><p><a href="' + Core.CONFIG.Path.VIP + '/help" target="_blank">更多特权&raquo;</a></p></div><div class="fail-bottom"><a href="' + Core.CONFIG.Path.VIP_ORDER + '/?p=no_space" target="_blank" class="btn-vip"><i></i>马上成为VIP会员</a> <a href="' + Core.CONFIG.Path.VIP + '/space/?p=no_space" target="_blank" class="btn-space"><i></i>扩容纯空间</a></div></div>');
                    _spaceWin = new Core.DialogBase({ title: "糟糕，您的空间就快用完啦！", width: 530, content: _content })
                }
                _spaceWin.Open(function() { _spaceWin.addClass("dialog-fial") });
                Util.Cookie.set("not_space_cook", "1", 24)
            }
        }
    }
})();
Core.VipCustomerSrv = (function() {
    var mod = function() {
        var _self = this;
        var _content = $('<div class="editor-contents" style="border:0;"><textarea style="position:absolute;top:0;right:0;bottom:0;left:0;width:518px;height:280px;" name=""></textarea></div><div class="dialog-bottom"><div class="con"><a href="javascript:;" class="button" btn="confirm">提交</a></div></div>');
        var _top = Util.Override(Core.DialogBase, _self, {
            Initial: function() {
                _self.warp.addClass("property-editor");
                var textArea = _self.warp.find("textarea");
                var save = function() {
                    var val = $.trim(textArea.val());
                    if (val == "") {
                        Core.MinMessage.Show({ text: "请输入内容", type: "war", timeout: 2000 });
                        textArea.focus();
                        return false
                    }
                    var key = "js_api_msg_customersrv";
                    $.getScript(Core.CONFIG.Path.Msg + "/?ac=vip_channel&js_return=" + key + "&body=" + encodeURIComponent(val), function() {
                        var r = window[key];
                        if (r && r.state) {
                            Core.MinMessage.Show({ text: "您的留言已提交成功，请耐心等待客服回应。", type: "suc", timeout: 2000 });
                            _self.Close()
                        } else {
                            Core.MinMessage.Show({ text: r.message, type: "war", timeout: 2000 });
                            textArea.focus()
                        }
                    })
                };
                textArea.on("keyup", function(e) {
                    if (e.ctrlKey && e.keyCode == 13) {
                        save();
                        return false
                    }
                });
                _self.warp.find('[btn="confirm"]').on("click", function() {
                    save();
                    return false
                })
            },
            Open: function() {
                _top.Open(function() {
                    var textArea = _self.warp.find("textarea");
                    textArea.val("");
                    window.setTimeout(function() { textArea.focus() }, 200)
                })
            }
        }, { content: _content, title: "给您的VIP专属客服留言！" })
    };
    var _mod;
    return {
        Open: function() {
            if (!_mod) {
                _mod = new mod()
            }
            _mod.Open()
        }
    }
})();
Core.PrivacyDG = (function() {
    var _mod, _cacheNode, _lock_file = false;
    var _model = function() {
        var _self = this, _pwdBox, _quesBox;
        var _content = $('<div><div class="pwd-contents"><div class="pwd-text"><p><strong>访问密码</strong></p><p>当您的朋友访问文件地址时，需要输入您设置的访问 密码才可以下载文件，传递重要文件时更安全了。</p></div><div rel="has_pwd" style="margin:10px 0;"><span>当前密码：</span><b txt="pwd_con"></b></div><input type="text" class="text" rel="pwd" /><textarea rel="ques" style="font-size:12px;"></textarea></div><div class="dialog-bottom"><div class="con"><a href="javascript:;" class="button" btn="confirm">确定</a><a href="javascript:;" class="button btn-gray" btn="cancel">取消</a></div></div></div>');
        Core.DialogBase.call(this, { title: "设置访问密码", content: _content });
        this.Initial = function() {
            _self.warp.addClass("dialog-password");
            _pwdBox = Util.TextBox.BindDefaultText(_content.find('[rel="pwd"]')[0], "访问密码，没有填写时自动解除加密");
            _quesBox = Util.TextBox.BindDefaultText(_content.find('[rel="ques"]')[0], "提示问题");
            _content.find("[btn]").unbind("click").bind("click", function() {
                switch ($(this).attr("btn")) {
                case "confirm":
                    if (_cacheNode.attr("file_type") == "1") {
                        var data = { };
                        data.answer = $.trim(_pwdBox.GetValue());
                        data.question = $.trim(_quesBox.GetValue());
                        data.file_id = _cacheNode.attr("file_id");
                        data.aid = Core.FileConfig.aid;
                        data.cid = Core.FileConfig.cid;
                        if (data.answer.length > 15) {
                            Core.MinMessage.Show({ text: "密码不能超过15个字符", type: "war", timeout: Core.CONFIG.MsgTimeout });
                            window.setTimeout(function() { _content.find("[rel='pwd']").select() }, 10);
                            return
                        }
                        $.ajax({
                            url: "?ct=file&ac=lock", data: data, type: "POST", dataType: "json",
                            success: function(r) {
                                if (r.state) {
                                    Core.MinMessage.Show({ text: "成功加密文件", type: "suc", timeout: Core.CONFIG.MsgTimeout });
                                    Core.FileConfig.DataAPI.Privacy(Core.FileConfig.aid, Core.FileConfig.cid, data, [_cacheNode])
                                } else {
                                    Core.MinMessage.Show({ text: r.msg ? r.msg : "加密失败", type: "war", timeout: Core.CONFIG.MsgTimeout })
                                }
                                _self.Close()
                            }
                        })
                    } else {
                        var data = { };
                        data.answer = $.trim(_pwdBox.GetValue());
                        data.question = $.trim(_quesBox.GetValue());
                        data.aid = _cacheNode.attr("area_id");
                        data.cid = _cacheNode.attr("cate_id");
                        $.ajax({
                            url: "?ct=dir&ac=lock", data: data, type: "POST", dataType: "json",
                            success: function(r) {
                                if (r.state) {
                                    Core.MinMessage.Show({ text: "成功加密文件夹", type: "suc", timeout: Core.CONFIG.MsgTimeout });
                                    var dirNode = Core.FileConfig.DataAPI.GetDir(data.cid);
                                    if (dirNode) {
                                        Core.FileConfig.DataAPI.Privacy(Number(data.aid), Core.FileConfig.cid, data, [dirNode])
                                    }
                                } else {
                                    Core.MinMessage.Show({ text: r.message, type: "war", timeout: Core.CONFIG.MsgTimeout })
                                }
                                _self.Close()
                            }
                        })
                    }
                    break;
                case "cancel":
                    _self.Close();
                    break
                }
                return false
            });
            var pwd = _cacheNode.attr("file_pwd");
            if (pwd) {
                _content.find("[rel='has_pwd']").show();
                _content.find("[txt='pwd_con']").html(pwd)
            } else {
                _content.find("[rel='has_pwd']").hide()
            }
            var ques = _cacheNode.find('[field="ext3"]').val();
            if (ques) {
                _content.find("[rel='ques']").val(ques)
            }
            _content.find("[rel='pwd']").val("");
            window.setTimeout(function() { _content.find("[rel='pwd']").focus() }, 50)
        }
    };
    return {
        File: function(node) {
            _cacheNode = node;
            if (!_mod) {
                _mod = new _model()
            }
            _lock_file = true;
            if (!_cacheNode.attr("has_pass")) {
                _mod.Open()
            } else {
                if (!_cacheNode.attr("file_pwd") && _cacheNode.attr("file_type") == "1") {
                    Core.DataAccess.FileRead.GetFilePass(_cacheNode.attr("file_id"), function(r) {
                        _cacheNode.attr("file_pwd", r.file_answer);
                        _cacheNode.find('[field="ext3"]').val(r.file_question);
                        _mod.Open()
                    })
                } else {
                    _mod.Open()
                }
            }
        },
        Folder: function(aid, cid) {
            _cacheNode = $("<div></div>");
            _cacheNode.attr("area_id", aid);
            _cacheNode.attr("cate_id", cid);
            if (!_mod) {
                _mod = new _model()
            }
            _lock_file = false;
            Core.DataAccess.Dir.GetDetail(aid, cid, function(r) {
                _cacheNode.attr("file_pwd", r.password);
                _cacheNode.find('[field="ext3"]').val(r.question);
                _mod.Open()
            })
        }
    }
})();
Core.OffLine = (function() {
    var _addWin, _btWin, _btlogWin, _pcWin, _pcResWin, _aid = 36, _cid = 0, _permission = 0, _last_time, _ltimer, _reloadTime = 3000, _setting;
    var startListen = function() {
        _ltimer = window.setTimeout(function() {
            var n = new Date().getTime();
            if ((n - _last_time) < 30000) {
                _reloadTime = (_reloadTime * 2);
                if (Core.FileConfig.DataAPI) {
                    Core.FileConfig.DataAPI.Reload(_aid, _cid)
                }
                startListen()
            } else {
                _reloadTime = 3000;
                window.clearTimeout(_ltimer)
            }
        }, _reloadTime)
    };
    var btlogWin = function() {
        var _self = this;
        var _liTemp = '<li rel="task_item"><div class="file-name">{file_name}</div><div class="file-size">{file_size_show}</div></li>';
        var _content = $('<dl class="offline-bt"><dt><input type="text" rel="task_name" readonly class="text" value="" /></dt><dd><div class="bt-file-list"><div class="bt-file-title"><div class="file-name">文件名</div><div class="file-size">文件大小</div></div><ul rel="task_list"></ul></div></dd><div class="bt-file-bottom"><span rel="task_total"></span></div></dl>');
        var _top = Util.Override(Core.DialogBase, _self, {
            Initial: function() {
            },
            Open: function(tkid, task_name) {
                $.ajax({
                    url: "?ct=offline&ac=child&tkid=" + tkid, type: "GET", cache: false, dataType: "json",
                    success: function(r) {
                        if (r.state) {
                            _top.Open(function() {
                                _content.find("[rel='task_name']").val(task_name);
                                var listBox = _content.find("[rel='task_list']");
                                listBox.html("");
                                var count = 0;
                                var size = 0;
                                for (var k in r.data) {
                                    var item = r.data[k];
                                    count++;
                                    size += Number(item.s);
                                    var li = $(String.formatmodel(_liTemp, { file_name: item.n, file_size_show: Util.File.ShowSize(item.s) }));
                                    listBox.append(li)
                                }
                                _content.find("[rel='task_total']").html("<b>" + count + "</b> 个文件, 共计 <b>" + Util.File.ShowSize(size) + "</b>")
                            })
                        } else {
                            Core.MinMessage.Show({ text: r.err_msg, type: "err", timeout: 2000 })
                        }
                    }
                })
            }
        }, { content: _content, title: "BT任务列表" })
    };
    var pcResWin = function() {
        var _self = this, _struct = { "e-1": "非法提取码", "e-2": "文件不存在", "e-3": "文件未分享", "e-4": "文件已加密", "e-5": "空间不足" };
        var _content = $('<div class="bt-file-list pickcode-file"><div class="bt-file-title"><div class="checkbox" check="checkall"></div><div class="file-name">文件</div><div class="pickcode">提取码</div><div class="file-size">文件大小</div><div class="file-status">状态</div></div><ul rel="list"></ul></div><div class="dialog-bottom"><div class="con"><a href="javascript:;" class="button" btn="confirm">确定</a></div></div>');
        var _top = Util.Override(Core.DialogBase, _self, {
            Initial: function() {
                _self.warp.delegate("[check]", "click", function() {
                    var el = $(this);
                    if (el.hasClass("checked")) {
                        el.removeClass("checked")
                    } else {
                        el.addClass("checked")
                    }
                    switch (el.attr("check")) {
                    case "checkall":
                        if (el.hasClass("checked")) {
                            _self.warp.find('[rel="list"] [check]').addClass("checked")
                        } else {
                            _self.warp.find('[rel="list"] [check]').removeClass("checked")
                        }
                        break
                    }
                    return false
                });
                _self.warp.find('[btn="confirm"]').on("click", function() {
                    if (!Core.FilePermission.Vip()) {
                        Core.Message.Confirm({ text: "升级VIP贵宾，马上享受离线下载服务", confirm_text: "马上升级", confirm_link: PAGE_PATHS.VIP + "/order/buy/?p=offline_down" });
                        return false
                    }
                    var list = _content.find('[rel="list"]');
                    var arr = list.find(".checked");
                    if (arr.length) {
                        Core.MinMessage.Show({ text: "正在添加任务...", type: "load", timeout: 10000 });
                        var data = { };
                        arr.each(function(i) {
                            var el = $(this);
                            data["pc[" + i + "]"] = el.attr("pc")
                        });
                        $.ajax({
                            url: "/?ct=offline&ac=add_task_pickcode", type: "POST", data: data, dataType: "json",
                            success: function(r) {
                                if (r.state) {
                                    Core.SpaceData.Sync();
                                    window.setTimeout(function() {
                                        if (Core.FileConfig.DataAPI) {
                                            Core.FileConfig.DataAPI.Reload(_aid, _cid)
                                        }
                                    }, 0);
                                    _self.Close();
                                    window.setTimeout(function() { Core.MinMessage.Show({ text: "添加成功", type: "suc", timeout: Core.CONFIG.MsgTimeout }) }, 300)
                                } else {
                                    Core.MinMessage.Show({ text: r.err_msg, type: "war", timeout: Core.CONFIG.MsgTimeout })
                                }
                            }
                        })
                    } else {
                        Core.MinMessage.Show({ text: "请选择文件", type: "war", timeout: 2000 })
                    }
                    return false
                })
            },
            Open: function(r) {
                _top.Open(function() {
                    var list = _content.find('[rel="list"]');
                    list.html("");
                    for (var k in r.data) {
                        var item = r.data[k];
                        var st = _struct["e" + item.status];
                        if (st) {
                            list.append('<li><div style="margin-left:20px;" class="file-name">' + k + '</div><div class="pickcode">&nbsp;</div><div class="file-size">&nbsp;</div><div class="file-status"><i>' + st + "</i></div></li>")
                        } else {
                            item.pick_code = k;
                            item.file_size = Util.File.ShowSize(item.file_size);
                            list.append(String.formatmodel('<li><div class="checkbox checked" check="item" pc="{pick_code}"></div><div class="file-name">{file_name}</div><div class="pickcode">{pick_code}</div><div class="file-size">{file_size}</div><div class="file-status">可离线下载</div></li>', item))
                        }
                    }
                })
            }
        }, { content: _content, title: "提取离线任务", width: 700 })
    };
    var pcWin = function() {
        var _self = this;
        var _content = $('<div class="offline-pickcode"><p>支持未加密的大众分享提取码和在好友分享空间里的文件提取码，每行输入一个提取码或115下载地址。</p><p>此功能不会消耗您的离线下载配额。</p><textarea rel="text" not_key="1"></textarea></div><div class="dialog-bottom"><div class="con"><a href="javascript:;" btn="confirm" class="button">确定</a></div></div>');
        var getResult = function(str, callback) {
            Core.MinMessage.Show({ text: "正在解析提取码", type: "load", timeout: 10000 });
            $.ajax({
                url: "/?ct=offline&ac=file_list", type: "POST", data: { pc: str }, dataType: "json",
                success: function(r) {
                    Core.MinMessage.Hide();
                    if (r.state) {
                        if (!_pcResWin) {
                            _pcResWin = new pcResWin()
                        }
                        _pcResWin.Open(r);
                        window.setTimeout(function() { callback && callback() }, 10)
                    } else {
                        Core.MinMessage.Show({ text: r.err_msg, timeout: 2000, type: "war" })
                    }
                }
            })
        };
        var _top = Util.Override(Core.DialogBase, _self, {
            Initial: function() {
                var con = _self.warp.find('[rel="text"]');
                _self.warp.find('[btn="confirm"]').on("click", function() {
                    var str = con.val();
                    if ($.trim(str) == "") {
                        Core.MinMessage.Show({ text: "请输入提取码或下载页地址，可换行输入多个", type: "war", timeout: 2000 });
                        con.focus();
                        return false
                    }
                    getResult(str, function() { _self.Close() });
                    return false
                })
            },
            Open: function(pick_codes) {
                if (pick_codes) {
                    getResult(pick_codes.join("\n"));
                    return
                }
                _top.Open(function() {
                    var con = _self.warp.find('[rel="text"]');
                    con.val("");
                    window.setTimeout(function() { con.focus() }, 100)
                })
            }
        }, { width: 700, content: _content, title: "添加提取任务" })
    };
    var btWin = function() {
        var _self = this, _timer, _listBox, _checkAll, _totalBox, _acList;
        var _liTemp = '<li rel="task_item"><div class="checkbox checked" file_size="{file_size}" file_index="{file_index}"></div><div class="file-name">{file_name}</div><div class="file-size">{file_size_show}</div></li>';
        var _content = $('<dl class="offline-bt"><dt><input type="text" rel="task_name" class="text" value="" /></dt><dd><div class="bt-file-list"><div class="bt-file-title"><div class="checkbox" rel="check_all"></div><div class="file-name">文件名</div><div class="file-size">文件大小</div></div><ul rel="task_list"></ul></div><div class="bt-file-bottom"><span rel="task_total"></span></div></dd></dl><div class="dialog-bottom"><div class="con"><a href="javascript:;" btn="confirm" class="button">确定</a></div></div>');
        var startListen = function() {
            _timer = window.setTimeout(function() {
                stopListen();
                if (_listBox) {
                    var totalCount = _listBox.find(".checkbox");
                    var checkedDom = _listBox.find(".checked");
                    if (checkedDom.length == totalCount.length) {
                        _checkAll.addClass("checked")
                    } else {
                        _checkAll.removeClass("checked")
                    }
                    var totalSize = 0;
                    checkedDom.each(function() {
                        var el = $(this);
                        totalSize += Number(el.attr("file_size"))
                    });
                    if (Number(_totalBox.attr("c")) != checkedDom.length || Number(_totalBox.attr("s")) != totalSize) {
                        _totalBox.attr("c", checkedDom.length).attr("s", totalSize);
                        _totalBox.html("已选 <b>" + checkedDom.length + "</b> 个，总计：<b>" + Util.File.ShowSize(totalSize) + "</b>")
                    }
                }
                startListen()
            }, 100)
        };
        var stopListen = function() {
            if (_timer) {
                window.clearTimeout(_timer)
            }
        };
        var bindCheck = function(el, callback) {
            el.find(".checkbox").on("click", function() {
                var node = $(this);
                if (node.hasClass("checked")) {
                    node.removeClass("checked")
                } else {
                    node.addClass("checked")
                }
                callback && callback(node.hasClass("checked"))
            })
        };
        var _top = Util.Override(Core.DialogBase, _self, {
            Initial: function() {
                _self.warp.find("[btn='confirm']").on("click", function() {
                    if (Number(_totalBox.attr("c"))) {
                        var data = { };
                        data.file_id = _acList.file_id;
                        data.task_name = $.trim(_self.warp.find('[rel="task_name"]').val());
                        if (data.task_name == "") {
                            Core.MinMessage.Show({ text: "请输入任务名称", type: "war", timeout: 2000 });
                            _self.warp.find('[rel="task_name"]').focus();
                            return
                        }
                        _listBox.find(".checked").each(function(i) {
                            var node = $(this);
                            var par = node.parent();
                            var file_index = node.attr("file_index");
                            data["file_index[" + file_index + "]"] = file_index;
                            data["file_size[" + file_index + "]"] = node.attr("file_size");
                            data["file_name[" + file_index + "]"] = par.find(".file-name").html()
                        });
                        Core.MinMessage.Show({ text: "正在提交任务...", type: "load", timeout: 10000 });
                        $.ajax({
                            url: "/?ct=offline&ac=add_task_bt", type: "POST", data: data, dataType: "json",
                            success: function(r) {
                                if (r.state) {
                                    Core.MinMessage.Show({ text: "添加成功", type: "suc", timeout: Core.CONFIG.MsgTimeout });
                                    Core.SpaceData.Sync();
                                    window.setTimeout(function() {
                                        if (Core.FileConfig.DataAPI) {
                                            Core.FileConfig.DataAPI.Reload(_aid, _cid)
                                        }
                                    }, 0);
                                    _permission = r.data.left;
                                    _last_time = new Date().getTime();
                                    _reloadTime = 3000;
                                    _self.Close()
                                } else {
                                    Core.MinMessage.Show({ text: r.err_msg, type: "err", timeout: 2000 })
                                }
                            }
                        })
                    } else {
                        Core.MinMessage.Show({ text: "请选择要下载的文件", type: "war", timeout: 2000 })
                    }
                });
                _listBox = _content.find('[rel="task_list"]');
                _checkAll = _content.find('[rel="check_all"]');
                _totalBox = _content.find('[rel="task_total"]');
                bindCheck(_content, function(r) {
                    if (r) {
                        _listBox.find(".checkbox").addClass("checked")
                    } else {
                        _listBox.find(".checkbox").removeClass("checked")
                    }
                })
            },
            Close: function() {
                stopListen();
                _top.Close()
            },
            Open: function(list, setting) {
                _acList = list;
                _setting = setting;
                _top.Open(function() {
                    _listBox.html("");
                    for (var k in list.files) {
                        var item = list.files[k];
                        item.file_size_show = Util.File.ShowSize(item.file_size);
                        var li = $(String.formatmodel(_liTemp, item));
                        if (_setting) {
                            if (_setting.limit < item.file_size) {
                                li.find(".checkbox").empty().remove()
                            }
                        }
                        _listBox.append(li);
                        bindCheck(li)
                    }
                    startListen();
                    _content.find("[rel='task_name']").val(list.task_name)
                })
            }
        }, { content: _content, title: "BT种子" })
    };
    var addWin = function() {
        var _self = this;
        var _cache = { }, _link, _filename, _msgBox, _signBox, _is_check = false, _checkOldVal = "", _checkTimer;
        var _content = $('<div class="hint-box" rel="msg_box">请输入下载链接</div><dl class="offline-download-link"><dt>在文本框输入您需要下载的文件网址</dt><dd><input type="text" rel="link" class="text" /></dd><dd><input type="text" rel="file_name" class="text" /></dd><dt rel="singMsg" style="display:none;">将消耗网盘空间：<b>1.15MB</b>（剩余空间115.55GB）</dt></dl><div class="dialog-bottom"><div class="con"><a href="javascript:;" btn="confirm" style="display:none;" class="button">确定</a><a href="javascript:;" btn="cancel" class="button btn-gray">取消</a></div></div>');
        Core.DialogBase.call(this, { content: _content, title: "添加离线任务" });
        var save = function() {
            var params = { };
            params.u = _link.GetValue();
            params.n = _filename.GetValue();
            params.s = _cache.file_size ? _cache.file_size : 0;
            if (params.u == "") {
                Core.MinMessage.Show({ text: "请输入正确链接地址", type: "war", timeout: Core.CONFIG.MsgTimeout });
                _link.focus();
                return
            }
            Core.DataAccess.OffLine.Add(params, function(r) {
                if (r.state) {
                    Core.MinMessage.Show({ text: "添加成功", type: "suc", timeout: Core.CONFIG.MsgTimeout });
                    Core.SpaceData.Sync();
                    window.setTimeout(function() {
                        if (Core.FileConfig.DataAPI) {
                            Core.FileConfig.DataAPI.Reload(_aid, _cid)
                        }
                    }, 0);
                    _permission = r.data.left;
                    _last_time = new Date().getTime();
                    _reloadTime = 3000;
                    _self.Close()
                } else {
                    Core.MinMessage.Show({ text: r.err_msg, type: "err", timeout: Core.CONFIG.MsgTimeout })
                }
            })
        };
        var clearSignData = function() {
            _cache.SignData = false;
            _checkOldVal = "";
            _is_check = false;
            if (_checkTimer) {
                window.clearTimeout(_checkTimer)
            }
            showMsg()
        };
        var updateSignData = function(callback) {
            clearSignData();
            Core.DataAccess.OffLine.GetSpace(function(r) {
                _cache.SignData = r;
                callback && callback()
            })
        };
        var showMsg = function(str, d) {
            if (_self.warp) {
                if (str) {
                    _msgBox.html(str)
                } else {
                    _msgBox.html("请输入下载链接")
                }
                if (d) {
                    if (d.s) {
                        _filename.value = d.n;
                        _signBox.html("将消耗网盘空间：<b>" + Util.File.ShowSize(Number(d.s)) + "</b>（剩余空间" + Util.File.ShowSize(_cache.SignData.data - Number(d.s)) + "）");
                        _signBox.show();
                        _self.warp.find('[btn="confirm"]').show();
                        _cache.file_size = d.s
                    } else {
                        _msgBox.html("找不到此下载链接");
                        _signBox.hide();
                        _self.warp.find('[btn="confirm"]').hide();
                        _cache.file_size = 0
                    }
                } else {
                    _signBox.hide();
                    _self.warp.find('[btn="confirm"]').hide();
                    _cache.file_size = 0
                }
            }
        };
        var checkLink = function(e) {
            var el = $(this);
            if (_checkTimer) {
                window.clearTimeout(_checkTimer)
            }
            _checkTimer = window.setTimeout(function() {
                var val = $.trim(_link.GetValue());
                if (Util.Validate.Url(val) && _cache.SignData) {
                    if (_is_check) {
                        return
                    }
                    if (_checkOldVal == val) {
                        return
                    }
                    showMsg("正在验证链接...");
                    _is_check = true;
                    _checkOldVal = val;
                    Core.DataAccess.OffLine.CheckURL(val, _cache.SignData, function(r) {
                        _is_check = false;
                        if (r.state) {
                            if (Number(r.data.s) > _cache.SignData.data) {
                                showMsg("空间不足");
                                return
                            }
                            showMsg("点击确定添加任务", r.data)
                        } else {
                            showMsg(r.err_msg)
                        }
                    })
                } else {
                    if (val != "") {
                        showMsg("请输入正确的下载链接")
                    } else {
                        showMsg()
                    }
                }
                if (_checkTimer) {
                    window.clearTimeout(_checkTimer)
                }
            }, 100)
        };
        this.Initial = function() {
            _self.warp.find("[btn]").on("click", function(e) {
                var type = $(this).attr("btn");
                switch (type) {
                case "confirm":
                    save();
                    break;
                case "cancel":
                    _self.Close();
                    break
                }
                return false
            });
            var linkInput = _self.warp.find("[rel='link']");
            _link = Util.TextBox.BindDefaultText(linkInput[0], "请输入http或ftp开头的下载地址");
            _filename = Util.TextBox.BindDefaultText(_self.warp.find("[rel='file_name']")[0], "保存文件名");
            _msgBox = _self.warp.find("[rel='msg_box']");
            _signBox = _self.warp.find("[rel='singMsg']");
            linkInput.on("keyup", checkLink).on("paste", checkLink)
        };
        var _isload_sign = false;
        this.Show = function() {
            if (_isload_sign) {
                return
            }
            _isload_sign = true;
            updateSignData(function() {
                _isload_sign = false;
                if (_cache.SignData.state) {
                    _self.Open()
                } else {
                    Core.MinMessage.Show({ text: _cache.SignData.err_msg, type: "war", timeout: Core.CONFIG.MsgTimeout })
                }
            })
        };
        var _closeFun = _self.Close;
        this.Close = function() {
            clearSignData();
            _closeFun()
        }
    };
    return {
        Log: function(tkid, task_name) {
            if (!_btlogWin) {
                _btlogWin = new btlogWin()
            }
            _btlogWin.Open(tkid, task_name)
        },
        BTWin: function(list, setting) {
            if (!_btWin) {
                _btWin = new btWin()
            }
            _btWin.Open(list, setting)
        },
        AddByPick: function(pick_codes) {
            if (!_pcWin) {
                _pcWin = new pcWin()
            }
            _pcWin.Open(pick_codes)
        },
        Add: function() {
            if (_permission <= 0 && !Core.FilePermission.Vip()) {
                Core.Message.Alert({ text: "抱歉，您已用完了离线配额！", content: "升级为VIP将每日拥有115个离线下载任务配额", confirm_text: "马上升级", type: "war", confirm_link: "http://vip.115.com/vip/?p=offline" });
                return false
            } else {
                if (_permission <= 0) {
                    Core.Message.Alert({ text: "抱歉，您已用完了离线配额！", content: "您今天的115个离线下载任务数配额已用完，请明日再试！", confirm_text: "我知道了", type: "war" });
                    return false
                }
            }
            if (!_addWin) {
                _addWin = new addWin()
            }
            _addWin.Show()
        },
        SetPermission: function(left) { _permission = left },
        Command: function(type, list) {
            var tkids = [];
            var optList = [];
            for (var i = 0, len = list.length; i < len; i++) {
                var item = list[i];
                switch (type) {
                case "start":
                    if (Number(item.attr("status")) == 21) {
                        tkids.push(item.attr("tkid"));
                        optList.push(item)
                    }
                    break;
                case "pause":
                    if (Number(item.attr("status")) == 11) {
                        tkids.push(item.attr("tkid"));
                        optList.push(item)
                    }
                    break;
                default:
                    tkids.push(item.attr("tkid"));
                    optList.push(item);
                    break
                }
            }
            switch (type) {
            case "del":
                Core.Message.Confirm({
                    text: "确定要删除任务吗？", type: "war",
                    callback: function(r) {
                        if (r) {
                            Core.MinMessage.Show({ text: "正在删除任务...", type: "load", timeout: 10000 });
                            Core.DataAccess.OffLine.Command({ type: type, tkids: tkids }, function(r) {
                                if (r.state) {
                                    Core.MinMessage.Show({ text: "删除成功", type: "suc", timeout: 2000 });
                                    Core.SpaceData.Sync();
                                    window.setTimeout(function() {
                                        if (Core.FileConfig.DataAPI) {
                                            Core.FileConfig.DataAPI.Del(_aid, _cid, optList)
                                        }
                                    }, 0)
                                } else {
                                    Core.MinMessage.Show({ text: r.err_msg, type: "err", timeout: 2000 })
                                }
                            })
                        }
                    }
                });
                break;
            case "clean":
                if (!list.length) {
                    Core.MinMessage.Show({ text: "清除成功", type: "suc", timeout: 2000 });
                    return
                }
                Core.MinMessage.Show({ text: "正在清除任务...", type: "load", timeout: 10000 });
                Core.DataAccess.OffLine.Command({ type: type, tkids: tkids }, function(r) {
                    if (r.state) {
                        Core.MinMessage.Show({ text: "清除成功", type: "suc", timeout: 2000 });
                        Core.SpaceData.Sync();
                        window.setTimeout(function() {
                            if (Core.FileConfig.DataAPI) {
                                Core.FileConfig.DataAPI.Reload(_aid, _cid)
                            }
                        }, 0)
                    } else {
                        Core.MinMessage.Show({ text: r.err_msg, type: "err", timeout: 2000 })
                    }
                });
                break;
            case "pause":
                if (!optList.length) {
                    Core.MinMessage.Show({ text: "请选择下载中的任务", type: "war", timeout: 2000 });
                    return
                }
                Core.DataAccess.OffLine.Command({ type: type, tkids: tkids }, function(r) {
                    if (r.state) {
                        if (Core.FileConfig.DataAPI) {
                            Core.FileConfig.DataAPI.UpdateOff(_aid, _cid, optList, r.data)
                        }
                    } else {
                        Core.MinMessage.Show({ text: r.err_msg, type: "err", timeout: 2000 })
                    }
                });
                break;
            case "start":
                if (!optList.length) {
                    Core.MinMessage.Show({ text: "请选择正在暂停的任务", type: "war", timeout: 2000 });
                    return
                }
                Core.MinMessage.Show({ text: "正在开始任务...", type: "load", timeout: 10000 });
                Core.DataAccess.OffLine.Command({ type: type, tkids: tkids }, function(r) {
                    if (r.state) {
                        if (Core.FileConfig.DataAPI) {
                            Core.FileConfig.DataAPI.UpdateOff(_aid, _cid, optList, r.data)
                        }
                        Core.MinMessage.Show({ text: "成功开始任务", type: "suc", timeout: 2000 })
                    } else {
                        Core.MinMessage.Show({ text: r.err_msg, type: "err", timeout: 2000 })
                    }
                });
                break;
            case "refresh":
                Core.DataAccess.OffLine.Command({ type: type, tkids: tkids }, function(r) {
                    if (r.state) {
                        if (Core.FileConfig.DataAPI) {
                            Core.FileConfig.DataAPI.Reload(_aid, _cid)
                        }
                    } else {
                        Core.MinMessage.Show({ text: r.err_msg, type: "err", timeout: 2000 })
                    }
                });
                break;
            case "get":
                if (list.length) {
                    var item = list[0];
                    var pick_code = item.attr("pick_code");
                    if (pick_code) {
                        Core.FileAPI.Download(pick_code)
                    } else {
                        Core.MinMessage.Show({ text: "找不到提取码", type: "war", timeout: 2000 })
                    }
                }
                break;
            case "move":
                Core.TreeWin.Show(function(aid, cid) {
                    var data = { aid: aid, cid: cid };
                    var file_names = { };
                    for (var i = 0, len = list.length; i < len; i++) {
                        var item = list[i];
                        var tkid = item.attr("tkid");
                        data["pick_code[" + i + "]"] = item.attr("pick_code");
                        data["tkid[" + i + "]"] = item.attr("tkid");
                        file_names[tkid] = item.find(".file-name").html()
                    }
                    Core.DataAccess.OffLine.Move(data, function(r) {
                        if (r.state) {
                            for (var k in r.data) {
                                if (file_names[k.toString()]) {
                                    r.data[k]["file_name"] = file_names[k.toString()]
                                }
                            }
                            Core.TreeWin.Hide();
                            Core.FileResultDG.Show(r.data);
                            if (Core.FileConfig.DataAPI) {
                                Core.FileConfig.DataAPI.Reload(_aid, _cid)
                            }
                        } else {
                            Core.MinMessage.Show({ text: r.err_msg, type: "err", timeout: 2000 })
                        }
                    })
                }, true);
                break
            }
        }
    }
})();
Core.RBSettingDG = (function() {
    var _mod;
    var mod = function() {
        var _self = this, _active = false;
        var _content = $('<div class="hint-box" rel="msg_box">此项功能是115公司为您的网盘数据安全做的特别保障，我们不建议您关闭！</div><dl class="offline-download-link" style="width:400px;padding-top:20px;"><dd style="height:50px;"><input type="radio" name="p" id="js_rb_set_1" value="1" checked /><label for="js_rb_set_1" style="cursor:pointer;position:static;color:#000;">高级保护</label><span style="color:#999999">(永久删除文件操作需要验证安全密码)</span></dd><dd style="height:80px;"><em style="display:inline-block;text-align:right;width:62px;">安全密码：</em><input type="password" rel="pwd" class="text" style="position:static;width: 220px;" /></dd></dl><div class="dialog-bottom"><div class="con"><a href="javascript:;" class="button" btn="confirm">确定</a></div></div>');
        this.RBSetting = false;
        this.Questions = false;
        var changeQues = function() {
            if (_active === false) {
                _active = 0
            } else {
                _active++;
                if (_active >= _self.Questions.length) {
                    _active = 0
                }
            }
            var ques = _self.Questions[_active];
            var txt = _self.warp.find('[rel="ques_text"]');
            txt.html(ques);
            window.setTimeout(function() { _self.warp.find("[rel='ques_text_box']").focus() }, 100)
        };
        var save = function() {
            var pwd = _self.warp.find('[rel="pwd"]');
            var _safe_mode = _self.RBSetting.SafeMode ? 0 : 1;
            var data = { recycle_pass: pwd.val(), safe_mode: _safe_mode };
            if (!data.recycle_pass) {
                Core.MinMessage.Show({ text: "请输入安全密码", type: "war", timeout: 2000 });
                pwd.focus();
                return false
            }
            $.ajax({
                url: "?ct=rb&ac=safe_mode", data: data, type: "POST", dataType: "json",
                success: function(r) {
                    if (r.state) {
                        pwd.val("");
                        _self.Close();
                        if (Core.FileConfig.DataAPI) {
                            Core.FileConfig.DataAPI.Refresh()
                        }
                        if (_safe_mode == 1) {
                            Core.Message.Alert({ text: "设置成功！", content: "您设置了高级保护模式，删除文件后到回收站操作均需验证安全密码，全方位防止误删。", type: "suc", confirm_text: "确定" })
                        } else {
                            Core.Message.Alert({ text: "设置成功！", content: "您关闭了高级保护模式，删除文件后到回收站操作无需验证安全密码。", type: "suc", confirm_text: "确定" })
                        }
                    } else {
                        Core.MinMessage.Show({ text: r.message, type: "err", timeout: 2000 });
                        pwd.focus()
                    }
                }
            })
        };
        var _top = Util.Override(Core.DialogBase, _self, {
            Initial: function() {
                _self.warp.find('[rel="pwd"]').on("keyup", function(e) {
                    if (e.keyCode == 13) {
                        save();
                        return false
                    }
                });
                _self.warp.find("[btn='confirm']").on("click", function() {
                    save();
                    return false
                });
                _self.warp.find('[rel="change_link"]').on("click", function() {
                    changeQues();
                    return
                })
            },
            Open: function() {
                if (_self.RBSetting) {
                    _self.Questions = _self.RBSetting.SafeAQ;
                    _top.Open(function() {
                        var val = _self.RBSetting.SafeMode ? 1 : 0;
                        var label = _self.warp.find('label[for="js_rb_set_1"]');
                        if (val) {
                            label.html("关闭高级保护");
                            label.next().html("(请三思而后行：一旦关闭，今后您的回收站内容在操作删除或清空时将不再接受安全验证！)")
                        } else {
                            label.html("开启高级保护");
                            label.next().html("(强烈建议开启：一旦开启，今后您的回收站内容在操作删除或清空时将要安全验证！)")
                        }
                        _content.find("#js_rb_set_1").attr("checked", val)
                    })
                } else {
                    Core.Minmessage.Show({ text: "保护设置暂停使用", type: "war", timeout: 2000 })
                }
            },
            Close: function() {
                _self.RBSetting = false;
                _self.warp.find('[rel="ques_text_box"]').val("");
                _top.Close()
            }
        }, { content: _content, title: "保护设置", width: 450 })
    };
    return {
        Show: function(setting) {
            if (!setting.HasPass) {
                Core.Message.Confirm({ text: "您没有设置安全密码!", type: "war", confirm_text: "马上设置", confirm_link: Core.CONFIG.Path.PASS + "/?ct=security&ac=passwd" });
                return
            }
            if (!_mod) {
                _mod = new mod()
            }
            _mod.RBSetting = setting;
            _mod.Open()
        }
    }
})();
(function() {
    var gift = Core.Gift = (function() {
        var _box, _ul, _resBox, _detailBox;
        var resultBox = function() {
            var _self = this, _content = $('<div class="dialog-msg dialog-gift" style="width:320px;"></div>');
            var t = Util.Override(Core.DialogBase, _self, {
                Show: function(code, fileName) {
                    t.Open(function() {
                        var html = [];
                        html.push('<h3 style="width:280px;"><i class="icon-gift-large"></i><span style="width:270px;">成功制作成网盘礼包，赶快分享给好友吧！</span>');
                        html.push('<em><i rel="desc"></i><a href="javascript:;" class="btn-link" btn="desc"><i class="ico-menu i-rename"></i>添加备注</a></em>');
                        html.push("</h3>");
                        html.push('<div class="dialog-gift-text">');
                        html.push('<p>115网盘礼包接收地址：<a href="' + Core.CONFIG.Path.U + "lb/" + code + '" target="_blank">' + Core.CONFIG.Path.U + "lb/" + code + "</a></p>");
                        html.push("<p>115网盘礼包码：" + code + "</p>");
                        html.push("<p><span>分享到：</span>");
                        fileName = Util.Text.Cut(fileName, 50);
                        var tempArr = ["分享好资源给大家，千万别错过咯。点击领取#115网盘礼包#：%1 礼包码：%3", "“%2”，分享好资源，你懂的。#115网盘礼包#：%1 礼包码：%3", "我刚刚通过#115网盘礼包#分享了“%2”给大家。点击接收：%1 礼包码：%3"];
                        var temp = tempArr[0];
                        var ra = Math.floor(Math.random() * 10);
                        if (ra <= 3) {
                            temp = tempArr[0]
                        } else {
                            if (ra >= 7) {
                                temp = tempArr[2]
                            } else {
                                temp = tempArr[1]
                            }
                        }
                        var desc = String.format(temp, Core.CONFIG.Path.U + "lb/" + code, fileName, code);
                        desc += " ，你也可以拿起手机扫描二维码即可接收。";
                        (function() {
                            var pic = Core.CONFIG.Path.U + "/?ct=filegift&ac=qrcode&gift_code=" + code;
                            var p = { url: Core.CONFIG.Path.U + "lb/" + code, desc: desc, summary: "", title: "115网盘礼包", site: "115网盘", pics: pic };
                            var s = [];
                            for (var i in p) {
                                s.push(i + "=" + encodeURIComponent(p[i] || ""))
                            }
                            html.push(['<a style="position:relative; padding-left:20px;margin-right:10px;" href="http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?', s.join("&"), '" target="_blank" title="分享到QQ空间"><i class="icon-sh" style="position:absolute;top:0;left:0;width:16px;height:16px;overflow:hidden;background:url(/static/pickcode/images/ico_share.gif) no-repeat 0 0;"></i>QQ空间</a>'].join(""))
                        })();
                        html.push('<a btn="sina" style="position:relative; padding-left:20px;margin-right:10px;" href="javascript:;"><i class="icon-sh" style="position:absolute;top:0;left:0;width:16px;height:16px;overflow:hidden;background:url(/static/pickcode/images/ico_share.gif) no-repeat -20px 0;"></i>新浪微博</a>');
                        html.push('<a btn="t" style="position:relative;padding-left:20px;margin-right:10px;" href="javascript:;"><i class="icon-sh" style="position:absolute;top:0;left:0;width:16px;height:16px;overflow:hidden;background:url(/static/pickcode/images/ico_share.gif) no-repeat -40px 0;"></i>腾讯微博</a>');
                        html.push("</p>");
                        html.push("</div>");
                        html.push('<div class="dialog-gift-bottom">');
                        html.push('<button class="button" btn="copy">复制礼包码</button> 或 <a href="javascript:;" btn="goto_manage">管理我的礼包</a>');
                        html.push("</div>");
                        _content.html(html.join(""));
                        _content.find("[btn]").on("click", function() {
                            switch ($(this).attr("btn")) {
                            case "goto_manage":
                                PageCTL.GOTO_URL("/?ct=filegift&ac=manage");
                                _self.Close();
                                break;
                            case "desc":
                                var el = $(this);
                                var descBox = _content.find('[rel="desc"]');
                                editDesc(code, descBox.attr("title"), function(c, desc) {
                                    if (code == c) {
                                        descBox.attr("title", desc).html(Util.Text.Cut(desc, 12));
                                        if (desc) {
                                            el.html("修改备注")
                                        } else {
                                            el.html("添加备注")
                                        }
                                    }
                                });
                                break;
                            case "copy":
                                var str = "";
                                var descBox = _content.find('[rel="desc"]');
                                if (descBox.attr("title")) {
                                    str += descBox.attr("title") + " \n"
                                }
                                str += "115网盘礼包接收地址：" + Core.CONFIG.Path.U + "lb/" + code + " \n";
                                str += "115网盘礼包码：" + code;
                                Util.Copy(str);
                                break;
                            case "sina":
                                var _pic = encodeURIComponent(Core.CONFIG.Path.U + "/?ct=filegift&ac=qrcode&gift_code=" + code);
                                var url = "http://v.t.sina.com.cn/share/share.php?title=" + encodeURIComponent(desc + "@115网盘") + "&pic=" + _pic;
                                window.open(url, "", "width=700, height=380, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, location=yes, resizable=no, status=no");
                                break;
                            case "t":
                                var _t = encodeURI("");
                                var _url = encodeURIComponent(desc + "@wangpandada");
                                var _appkey = encodeURI("2bbb1b31da73479d9fd09ae42645304f");
                                var _pic = encodeURIComponent(Core.CONFIG.Path.U + "/?ct=filegift&ac=qrcode&gift_code=" + code);
                                var _site = "";
                                var _u = "http://v.t.qq.com/share/share.php?title=" + _t + "&url=" + _url + "&appkey=" + _appkey + "&site=" + _site + "&pic=" + _pic;
                                window.open(_u, "", "width=700, height=680, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, location=yes, resizable=no, status=no");
                                break
                            }
                            return false
                        });
                        window.setTimeout(function() {
                            changeDescData(code, fileName, function(r) {
                                if (r.state) {
                                    var desc = Util.Text.htmlspecialchars(fileName);
                                    var descBox = _content.find('[rel="desc"]');
                                    var btn = _content.find('[btn="desc"]');
                                    descBox.attr("title", desc).html(Util.Text.Cut(desc, 12));
                                    if (desc) {
                                        btn.html("修改备注")
                                    } else {
                                        btn.html("添加备注")
                                    }
                                }
                            })
                        }, 100)
                    })
                }
            }, { content: _content, title: "制作礼包" })
        };
        var detailBox = function() {
            var _self = this, _content = $('<div class="bt-file-list pickcode-file" style="margin-bottom:30px;"><div class="bt-file-title"><div class="file-name">文件名称 / 文件夹名称</div><div class="file-size">类型</div></div><ul rel="list"></ul></div>');
            var t = Util.Override(Core.DialogBase, _self, {
                Show: function(list) {
                    t.Open(function() {
                        var html = [];
                        for (var i = 0, len = list.length; i < len; i++) {
                            var item = list[i];
                            if (item.file_id) {
                                item.file_size = Util.File.ShowSize(item.file_size, 1);
                                html.push(String.formatmodel('<li><div class="file-name">{file_name}</div><div class="file-size" style="width:120px;">文件 ({file_size})</div></li>', item))
                            } else {
                                html.push(String.formatmodel('<li><div class="file-name">{name}</div><div class="file-size">文件夹</div></li>', item))
                            }
                        }
                        _content.find('[rel="list"]').html(html.join(""))
                    })
                }
            }, { content: _content, title: "礼包内容" })
        };
        var changeDescData = function(code, desc, callback) { $.ajax({ url: "/?ct=filegift&ac=update_remark", type: "POST", dataType: "json", data: { gift_code: code, remark: desc }, success: function(r) { callback && callback(r) } }) };
        var editDesc = function(code, oldRmark, callback) {
            if (!oldRmark) {
                oldRmark = ""
            }
            var editCon = $('<div class="dialog-input"><input type="text" rel="txt" class="text" maxlength="50" /></div><div class="dialog-bottom"><div class="con"><a href="javascript:;" class="button" btn="confirm">确定</a></div></div>');
            var editBox = new Core.DialogBase({ title: oldRmark ? "修改礼包备注" : "添加礼包备注", content: editCon });
            editBox.Open();
            var textBox = editCon.find("[rel='txt']");
            textBox.val(oldRmark);
            var renameFolderFun = function(e) {
                var desc = $.trim(textBox.val());
                if (desc != "") {
                    if (desc.length > 50) {
                        Core.MinMessage.Show({ text: "礼包备注最多只能包含50个字", type: "war", timeout: 2000 });
                        textBox.focus();
                        return false
                    }
                    Core.MinMessage.Show({ text: "正在修改礼包备注...", type: "load", timeout: 10000 });
                    changeDescData(code, desc, function(r) {
                        if (r.state) {
                            desc = Util.Text.htmlspecialchars(desc);
                            callback && callback(code, desc);
                            editBox.Close();
                            Core.MinMessage.Show({ text: oldRmark ? "成功修改礼包备注" : "成功添加礼包备注", type: "suc", timeout: 2000 })
                        } else {
                            Core.MinMessage.Show({ text: r.message, type: "err", timeout: 2000 });
                            textBox.focus()
                        }
                    })
                } else {
                    callback && callback(code, desc)
                }
            };
            editCon.find("[rel='txt']").bind("keydown", function(e) {
                if (e.keyCode == 13) {
                    renameFolderFun(e)
                } else {
                    if (e.keyCode == 27) {
                        editBox.Close()
                    }
                }
            });
            editCon.find("[btn]").bind("click", function(e) {
                switch ($(this).attr("btn")) {
                case "confirm":
                    renameFolderFun(e);
                    break;
                case "cancel":
                    editBox.Close();
                    break
                }
                return false
            });
            textBox.focus();
            window.setTimeout(function() { textBox.select() }, 20)
        };
        return {
            EditDesc: function(code, oldRmark, callback) { editDesc(code, oldRmark, callback) }, GotoGift: function(win) { win.location.href = "/?ct=filegift&ac=manage" },
            Add: function(files) {
                var pick_codes = [];
                var fileName = "";
                for (var i = 0, len = files.length; i < len; i++) {
                    var item = files[i];
                    pick_codes.push(item.attr("pick_code"));
                    if (fileName == "") {
                        fileName = item.attr("file_type") == "1" ? item.find('[field="file_name"]').attr("title") : item.attr("cate_name")
                    }
                }
                Core.MinMessage.Show({ text: "正在生成礼包...", type: "load", timeout: 10000 });
                $.ajax({
                    url: "/?ct=filegift&ac=create", data: { pickcodes: pick_codes }, type: "POST", dataType: "json",
                    success: function(r) {
                        Core.MinMessage.Hide();
                        if (r.state) {
                            if (!_resBox) {
                                _resBox = new resultBox()
                            }
                            _resBox.Show(r.gift_code, fileName)
                        } else {
                            if (r.err_code == 190013) {
                                Core.Message.Confirm({ text: "升级VIP分享无限制！", content: "你已经体验过3次了！<br/>普通会员每天可免费体验3次，礼包码有效期30天！", type: "war", confirm_text: "马上升级", confirm_link: Core.CONFIG.Path.VIP + "/?p=gift_manage" })
                            } else {
                                Core.MinMessage.Show({ text: r.message, type: "err", timeout: 2000 })
                            }
                        }
                    }
                })
            },
            Show: function(code) {
                if (code) {
                    $.ajax({
                        url: "/?ct=filegift&ac=show_files&gift_code=" + code, cache: false, dataType: "json", type: "GET",
                        success: function(r) {
                            if (r.state && r.data && r.data.length) {
                                if (!_detailBox) {
                                    _detailBox = new detailBox()
                                }
                                _detailBox.Show(r.data)
                            } else {
                                Core.MinMessage.Show({ text: "礼包内没有文件", type: "war", timeout: 2000 })
                            }
                        }
                    })
                }
            }
        }
    })()
})();
Core.Viewer = { };
Core.Viewer.Base = function(opt) {
    var _self = this;
    this.warp;
    var create = function() {
        if (!_self.warp) {
            _self.warp = $(opt.html);
            opt.parent.append(_self.warp);
            _self.Initial && _self.Initial()
        }
    };
    this.Show = function() {
        create();
        var zindex = Core.WinHistory.GetIndex();
        Core.WinHistory.LessIndex();
        _self.warp.show()
    };
    this.Hide = function() {
        if (_self.warp) {
            _self.warp.hide()
        }
    };
    this.Loading = function(msg) {
        if (!Core.Viewer.Loading) {
            if (msg) {
                Core.MinMessage.Show({ text: msg, type: "load", timeout: 10000 })
            } else {
                Core.MinMessage.Hide()
            }
        } else {
            if (msg) {
                Core.Viewer.Loading.Show()
            } else {
                Core.Viewer.Loading.Hide()
            }
        }
    }
};
Core.Viewer.Error = function(parent, action) {
    var _self = this, _action = action;
    var _top = Util.Override(Core.Viewer.Base, _self, {
        Show: function(fileDom, msg) {
            _top.Show();
            var fileName = fileDom.find("[field='file_name']").attr("title");
            if (!msg) {
                msg = '该文件暂不支持预览，请直接<a href="javascript:;" onclick="Core.FileAPI.Download(\'' + fileDom.attr("pick_code") + "');return false;\">下载</a>文件"
            }
            var ico = (fileName.lastIndexOf(".") != -1) ? fileName.substring(fileName.lastIndexOf(".") + 1, fileName.length) : "";
            var html = '<a href="javascript:;" btn="close" class="close">关闭</a><i class="file-thumb tb-' + ico + '"></i><strong title="' + fileName + '">' + fileName + "</strong><span>" + msg + "</span>";
            _self.warp.find(".previewer-unable").html(html);
            _self.warp.find('[btn="close"]').on("click", function() {
                Core.ViewFile.Close();
                return false
            })
        },
        Initial: function() {
            _self.warp.find("[pic_btn]").on("click", function() {
                var el = $(this);
                var type = el.attr("pic_btn");
                if (_action) {
                    if (_action[type]) {
                        _action[type]()
                    }
                }
                return false
            })
        }
    }, { html: '<div><div class="previewer-unable"></div></div>', parent: parent })
};
Core.Viewer.Document = function(parent, action) {
    var _self = this, _event = action;
    var createAPI = function(opt) {
        window.DOCOOF_SWF_URL = function() { return opt.url.replace("{", "").replace("}", "") };
        window.DOCOOF_SWF_OPT = function() { return { width: _self.warp.width(), height: _self.warp.height(), full: window.screen.width, wheel: 20, vip: 1, fullH: window.screen.height } };
        window.DOCOFF_SWF_COMPLETE = function() { Core.MinMessage.Hide() };
        window.DOCOOF_SWF_BANNER = function() { return { } };
        window.DOCOFF_SWF_ESC = function() {
            if (_event && _event.esckeyup) {
                _event.esckeyup()
            }
        }
    };
    var _top = Util.Override(Core.Viewer.Base, _self, {
        Show: function(opt) {
            createAPI(opt);
            var html = [];
            var swf_Url = opt.is_ppt ? Core.CONFIG.Reader.PPTURL : Core.CONFIG.Reader.URL;
            if ($.browser.msie) {
                html.push('<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="100%" height="100%" id="' + Core.CONFIG.Reader.ID + '">');
                html.push('<param name="movie" value="' + swf_Url + '" />');
                html.push('<param name="quality" value="high" />');
                html.push('<param name="allowScriptAccess" value="always" />');
                html.push('<param name="allowFullScreen" value="true" />');
                html.push('<param name="wmode" value="opaque" />');
                html.push("</object>")
            } else {
                html.push('<object type="application/x-shockwave-flash" data="' + swf_Url + '" width="100%" height="100%" id="' + Core.CONFIG.Reader.ID + '">');
                html.push('<param name="quality" value="high" />');
                html.push('<param name="allowScriptAccess" value="allowDomain" />');
                html.push('<param name="allowFullScreen" value="true" />');
                html.push("</object>")
            }
            _top.Show();
            Core.MinMessage.Show({ text: "正在加载文档浏览器", type: "load", timeout: 2000 });
            _self.warp.html("");
            window.setTimeout(function() {
                var readerDom = $(html.join(""));
                _self.warp.append(readerDom)
            }, 16)
        },
        Hide: function() {
            _top.Hide();
            Core.MinMessage.Hide()
        },
        Initial: function() {
        }
    }, { html: '<div class="previewer-document"></div>', parent: parent })
};
Core.Viewer.Photo = function(parent, initFun, action) {
    var _self = this, _cacheUrl = "", _oldUrl, _action = action, _opt, _moveObj, _pos = 2, _screenbox = action.screen;
    var resizePos = function(img) {
        var w = img.width(), h = img.height();
        var ww = $(window).width(), wh = $(window).height();
        if (_screenbox) {
            ww = _screenbox.width()
        }
        var nw = ww * 0.9, nh = wh * 0.9;
        if (nw < w || nh < h) {
            if ((w - nw) / w > (h - nh) / h) {
                var par = (w - nw) / w;
                w = wh;
                h = h - (h * par)
            } else {
                var par = (h - nh) / h;
                h = nh;
                w = w - (w * par)
            }
        }
        img.css({ left: (ww - w) / 2, top: ((wh - h) / 2 - 20) })
    };
    var resize = function() {
        var img = _self.warp.find("img");
        var w = img.width(), h = img.height();
        var ww = $(window).width(), wh = $(window).height();
        if (_screenbox) {
            ww = _screenbox.width()
        }
        var l, t;
        if (w > ww) {
            l = 0
        } else {
            l = (ww - w) / 2
        }
        if (h > wh) {
            t = 0
        } else {
            t = (wh - h) / 2 - 20
        }
        img.css({ visibility: "", left: l, top: t })
    };
    var _top = Util.Override(Core.Viewer.Base, _self, {
        Show: function(opt) {
            _opt = opt;
            _top.Show();
            if (opt) {
                var img = _self.warp.find("img");
                _self.Loading("正在加载照片");
                var url = opt.url;
                if (opt.all_url && opt.all_url.length) {
                    if (_pos > opt.all_url.length - 1) {
                        url = opt.url
                    } else {
                        url = opt.all_url[_pos]
                    }
                }
                img.css("visibility", "hidden");
                img.css({ width: "", height: "", top: "-9999px;" });
                _self.warp.css({ top: "", left: "", width: "", height: "" });
                img.attr("src", url);
                if (_oldUrl == url) {
                    _self.Loading(false);
                    window.setTimeout(function() { resize() }, 10)
                }
                _oldUrl = url;
                _cacheUrl = opt.source_url;
                initFun && initFun();
                action.back && action.back(opt)
            }
        },
        GetPosIndex: function() { return _pos },
        Resize: function() { _pos = 2 },
        ChangeURI: function(url, pos) {
            if (pos != undefined) {
                _pos = pos
            }
            _top.Show();
            if (_oldUrl == url) {
                return
            }
            _oldUrl = url;
            var img = _self.warp.find("img");
            img.css("visibility", "hidden");
            _self.Loading("正在加载照片");
            img.css({ width: "", height: "" });
            img.attr("src", url)
        },
        Hide: function() {
            _top.Hide();
            if (_self.warp) {
                _self.Rotate(true)
            }
        },
        Initial: function() {
            var img = _self.warp.find("img");
            _moveObj = Util.Mouse.MoveBox({ ClickBox: img, Box: img });
            img.on("load", function() {
                _self.Loading(false);
                Core.MinMessage.Hide();
                window.setTimeout(function() { resize() }, 10)
            });
            $(window).on("resize", function() {
                img.css({ width: "", height: "", visibility: "hidden" });
                window.setTimeout(function() { resize() }, 0)
            });
            _self.warp.find("[pic_btn]").on("click", function() {
                var el = $(this);
                var type = el.attr("pic_btn");
                if (_action) {
                    if (_action[type]) {
                        _action[type]()
                    }
                }
                return false
            })
        },
        GetPos: function() {
            var img = _self.warp.find("img");
            var w = img.width(), h = img.height();
            var ww = $(document).width(), wh = $(document).height();
            var nw = ww * 0.9, nh = wh * 0.9;
            if (nw < w || nh < h) {
                if ((w - nw) / w > (h - nh) / h) {
                    var par = (w - nw) / w;
                    w = nw;
                    h = h - (h * par)
                } else {
                    var par = (h - nh) / h;
                    h = nh;
                    w = w - (w * par)
                }
            }
            var res = { width: img.width(), height: img.height(), x: (ww - w) / 2, y: ((wh - h) / 2 - 20) };
            return res
        },
        SetUrl: function(source_url) { _cacheUrl = source_url },
        GetUrl: function() { return _cacheUrl },
        Rotate: function(is_clear) {
            var img = _self.warp.find("img");
            if (!is_clear) {
                var rotate = Number(img.attr("rotate"));
                var num;
                if (rotate) {
                    num = Number(img.attr("rotate")) + 1
                } else {
                    num = 1
                }
                var res = Util.Image.Rotate(img, num);
                img.attr("rotate", res);
                resizePos(img)
            } else {
                var res = Util.Image.Rotate(img);
                img.removeAttr("rotate")
            }
        }
    }, { html: '<div class="previewer-photo" style="overflow:visible;"><img src="" style="cursor:move;"/><i></i></div>', parent: parent })
};
Core.Viewer.PhotoFull = function(parent) {
    var _self = this, _viewer, _img;
    var setCenter = function(op) {
        var w = _img.width(), h = _img.height();
        var x = ($(window).width() - w) / 2, y = ($(window).height() - h) / 2 - 20;
        if (op) {
            _self.warp.width(op.width).height(op.height).css({ left: op.x, top: op.y }).animate({ width: w, height: h, left: x, top: y }, 600)
        } else {
            _self.warp.css({ width: w, height: h, left: x, top: y })
        }
        _img.css("visibility", "").show()
    };
    var _top = Util.Override(Core.Viewer.Base, _self, {
        Show: function(viewer) {
            _viewer = viewer;
            _top.Show();
            if (viewer) {
                _img.css({ height: "", width: "", visibility: "hidden" });
                _self.Loading("正在下载原图");
                _img.attr("src", viewer.GetUrl())
            }
        },
        Initial: function() {
            _img = _self.warp.find("img");
            Util.Mouse.MoveBox({ ClickBox: _img, Box: _self.warp });
            _img.on("load", function() {
                _self.Loading(false);
                _img.css({ height: "", width: "", visibility: "hidden" });
                var pos = _viewer.GetPos();
                setCenter(pos)
            })
        },
        Hide: function() {
            _top.Hide();
            if (_self.warp) {
                _img.attr("src", "");
                _img.css({ height: "", width: "", visibility: "hidden" });
                _self.Rotate(true)
            }
            _self.Loading(false)
        },
        Rotate: function(is_clear) {
            var img = _img;
            if (!is_clear) {
                var rotate = Number(img.attr("rotate"));
                var num;
                if (rotate) {
                    num = Number(img.attr("rotate")) + 1
                } else {
                    num = 1
                }
                var res = Util.Image.Rotate(img, num);
                img.attr("rotate", res)
            } else {
                var res = Util.Image.Rotate(img);
                img.removeAttr("rotate")
            }
            if ($.browser.msie) {
                setCenter()
            }
        }
    }, { html: '<div style="position:absolute;padding:3px;z-index:10;"><img src="" style="border:3px solid #fff;position:absolute; top:0;left:0;width:100%;height:100%; cursor:move;" /><div>', parent: parent })
};
Core.Viewer.Music = function(parent, action) {
    var _self = this, _isLoading = false, _floatDom, _is_create = false, _content, _cache = { }, _min_class = "music-player-min", _action = action, _urls = { }, _ac_out_obj;
    var clear = function() {
        var dom = _content.find("[rel='list']");
        dom.find("[key]").each(function() { jPlayerProxy.Delete($(this).attr("key")) })
    };
    var showBackDom = function() {
        var el = _cache.back_dom;
        if (_cache.back_timer) {
            window.clearTimeout(_cache.back_timer)
        }
        _cache.back_timer = window.setTimeout(function() {
            el.hide();
            var sl = -_self.warp.width();
            _self.warp.css({ right: sl }).animate({ right: 0 }, 400);
            _self.warp.show()
        }, 200)
    };
    var toBackPlay = function(ishide) {
        _cache.is_back = true;
        if (!_cache.back_dom) {
            _cache.back_dom = $('<div class="music-switch" style="z-index:25;"><b class="mubtn-extend">伸展</b></div>');
            $(document.body).append(_cache.back_dom);
            _cache.back_dom.on("mouseover", function() {
                showBackDom();
                return false
            }).on("mouseout", function() {
                if (_cache.back_timer) {
                    window.clearTimeout(_cache.back_timer)
                }
            })
        }
        var sb = $(window).height() / 2, eb = 0, sl = $(window).width() / 2, el = 0;
        _cache.back_dom.css({ bottom: sb, right: sl }).animate({ bottom: eb, right: el }, 400);
        _cache.back_dom.show();
        if (_self.warp) {
            _self.warp.find("[btn='stop_back']").hide();
            _self.warp.find("[btn='close_back']").show()
        }
        window.MIN_PLAY_ICON && window.MIN_PLAY_ICON.hide()
    };
    var getMInfo = function(mid) {
        var obj = _urls[mid];
        return { key: mid, tid: obj.topic_id, is_out: true, mp3: obj.url, name: obj.file_name, pick_code: obj.pick_code }
    };
    var _minAlbum;
    var changeAlbum = function(el, file_id) {
        var albumList = _self.warp.find('[rel="album_list"]');
        var list = [];
        albumList.find("li[tid]").not('[tid="-1"]').each(function() {
            var el = $(this);
            list.push({ tid: el.attr("tid"), text: el.find("span").html() })
        });
        if (list.length) {
            var hideState = true;
            if (!_minAlbum) {
                _minAlbum = $('<div class="mu-popup-menu" style="display:none;"><i class="arrow"></i><b class="arrow"></b><ul></ul></div>');
                $(document.body).append(_minAlbum);
                _minAlbum.on("mouseover", function() { hideState = false }).on("mouseleave", function() { hideState = true });
                $(document).on("click", function() {
                    if (hideState) {
                        _minAlbum && _minAlbum.hide()
                    }
                });
                _minAlbum.delegate("[tid]", "click", function() {
                    hideState = true;
                    _minAlbum && _minAlbum.hide();
                    Core.CloudMusic.AddFileList($(this).attr("tid"), [file_id], function() { Core.MinMessage.Show({ text: "成功加入到选中的专辑", type: "suc", timeout: 2000 }) });
                    return false
                })
            }
            var ul = _minAlbum.find("ul");
            ul.html("");
            for (var i = 0, len = list.length; i < len; i++) {
                var item = list[i];
                ul.append(String.formatmodel('<li tid="{tid}">{text}</li>', item))
            }
            _minAlbum.hide();
            window.setTimeout(function() {
                hideState = false;
                _minAlbum.css({ left: el.offset().left - _minAlbum.width() - 10, top: el.offset().top - 10 }).show()
            }, 10)
        } else {
            Core.CloudMusic.AddCate(function(info) { window.setTimeout(function() { Core.CloudMusic.AddFileList(info.topic_id, [file_id], function() { Core.MinMessage.Show({ text: "成功加入到新添加的专辑", type: "suc", timeout: 2000 }) }) }) })
        }
    };
    var initPlay = function() {
        jPlayerProxy.Bind($(Core.CONFIG.MusicPlay), [_content]);
        jPlayerProxy.Action = {
            Playing: function() {
                if (_content) {
                    _content.find(".music-animate").addClass("animate-playing")
                }
            },
            Stoping: function() {
                if (_content) {
                    _content.find(".music-animate").removeClass("animate-playing")
                }
            },
            StartPlay: function(obj) {
                if (obj.is_out) {
                    _ac_out_obj = obj;
                    var mid = _ac_out_obj.key;
                    var tid = _ac_out_obj.tid;
                    var albumList = _self.warp.find('[rel="album_list"]');
                    var alFileList = _self.warp.find('[rel="album_file_list"]');
                    if (albumList.find(".focus").attr("tid") == tid) {
                        alFileList.find(".focus").removeClass("focus");
                        alFileList.find('li[mid="' + mid + '"]').addClass("focus")
                    }
                    _content.find('[rel="play_name"]').html(obj.name);
                    if (_cache.old_odd) {
                        _cache.old_odd.removeClass("playing");
                        _cache.old_odd = false
                    }
                } else {
                    var dom = _content.find("[rel='list']");
                    if (_cache.old_odd) {
                        _cache.old_odd.removeClass("playing");
                        _cache.old_odd = false
                    }
                    _content.find('[rel="play_name"]').html(obj.name);
                    if (_cache.minBox) {
                        _cache.minBox.attr("title", obj.name)
                    }
                    _cache.old_odd = dom.find('[key="' + obj.key + '"]');
                    _cache.old_odd.addClass("playing");
                    if (_ac_out_obj) {
                        _ac_out_obj = false
                    }
                }
            },
            AddMusic: function(arr) {
                var dom = _content.find("[rel='list']");
                var isPlay = !dom.find("[key]").length;
                var firstItem = false;
                var list = [];
                for (var i = 0, len = arr.length; i < len; i++) {
                    var item = arr[i];
                    if (!firstItem) {
                        firstItem = item
                    }
                    var ele = $(String.formatmodel('<li key="{key}" file_id="{file_id}" pick_code="{pick_code}" style="display:none;" file_type="{file_type}" is_share="is_share" aid="{aid}" cid="{cid}"><span><a href="javascript:;" btn="play">{name}</a></span><em><a href="javascript:;" class="mu-playlist" btn="add_cloud">加入播放列表</a><a href="javascript:;" target="_blank" class="mu-download" btn="download">下载</a><a href="javascript:;" class="mu-delete" btn="del">删除</a></em></li>', item));
                    if (item.not_down) {
                        ele.find(".mu-download").empty().remove()
                    }
                    ele.find("[btn]").bind("click", { mod: item }, function(e) {
                        switch ($(this).attr("btn")) {
                        case "play":
                            jPlayerProxy.Play(e.data.mod.key);
                            break;
                        case "del":
                            jPlayerProxy.Delete(e.data.mod.key);
                            break;
                        case "download":
                            Core.FileAPI.Download($(this).parents("[key]").attr("pick_code"));
                            break;
                        case "add_cloud":
                            changeAlbum($(this), e.data.mod.file_id);
                            break
                        }
                        return false
                    });
                    dom.append(ele);
                    list.push(ele)
                }
                for (var i = 0, len = list.length; i < len; i++) {
                    list[i].fadeIn("slow")
                }
                window.setTimeout(function() { dom.parent().scrollTop(dom.height()) }, 10);
                if (isPlay && firstItem) {
                    jPlayerProxy.Play(firstItem.key)
                }
            },
            DeleteMusic: function(key) {
                var dom = _content.find("[rel='list']");
                dom.find('[key="' + key + '"]').empty().remove()
            },
            SetMode: function(mod) {
                _content.find("[jplay='mode_0']").hide();
                _content.find("[jplay='mode_1']").hide();
                _content.find("[jplay='mode_2']").hide();
                switch (mod) {
                case 0:
                    _content.find("[jplay='mode_1']").show();
                    break;
                case 1:
                    _content.find("[jplay='mode_2']").show();
                    break;
                case 2:
                    _content.find("[jplay='mode_0']").show();
                    break
                }
            },
            Play: function() {
                if (_self.warp) {
                    var albumList = _self.warp.find('[rel="album_list"]');
                    var focusLi = albumList.find(".focus");
                    if (focusLi.length && focusLi.attr("tid") != "-1") {
                        var tid = focusLi.attr("tid");
                        var alFileList = _self.warp.find('[rel="album_file_list"]');
                        var clds = alFileList.children();
                        if (clds.length) {
                            var node = $(clds[0]);
                            var mid = node.attr("mid");
                            return getMInfo(mid)
                        }
                    }
                }
                return false
            },
            Random: function() {
                if (_self.warp) {
                    var albumList = _self.warp.find('[rel="album_list"]');
                    var focusLi = albumList.find(".focus");
                    if (focusLi.length && focusLi.attr("tid") != "-1") {
                        var tid = focusLi.attr("tid");
                        var alFileList = _self.warp.find('[rel="album_file_list"]');
                        var clds = alFileList.children().not("[add_music]");
                        if (clds.length) {
                            var len = clds.length;
                            var c = Math.floor(len * Math.random());
                            if (c == len) {
                                c = 0
                            }
                            var node = $(clds[c]);
                            var mid = node.attr("mid");
                            return getMInfo(mid)
                        }
                    }
                }
                return false
            },
            Next: function() {
                if (_self.warp) {
                    var albumList = _self.warp.find('[rel="album_list"]');
                    var focusLi = albumList.find(".focus");
                    if (focusLi.length && focusLi.attr("tid") != "-1") {
                        var tid = focusLi.attr("tid");
                        var alFileList = _self.warp.find('[rel="album_file_list"]');
                        var clds = alFileList.children();
                        if (clds.length) {
                            var fm = alFileList.find(".focus");
                            var node;
                            if (fm.length) {
                                node = fm.next().not("[add_music]");
                                if (!node.length) {
                                    node = $(clds[0])
                                }
                            } else {
                                node = $(clds[0])
                            }
                            var mid = node.attr("mid");
                            if (mid) {
                                return getMInfo(mid)
                            }
                        }
                    }
                }
                return false
            },
            Prev: function() {
                if (_self.warp) {
                    var albumList = _self.warp.find('[rel="album_list"]');
                    var focusLi = albumList.find(".focus");
                    if (focusLi.length && focusLi.attr("tid") != "-1") {
                        var tid = focusLi.attr("tid");
                        var alFileList = _self.warp.find('[rel="album_file_list"]');
                        var clds = alFileList.children().not("[add_music]");
                        if (clds.length) {
                            var fm = alFileList.find(".focus");
                            var node;
                            if (fm.length) {
                                node = fm.prev().not("[add_music]");
                                if (!node.length) {
                                    node = $(clds[clds.length - 1])
                                }
                            } else {
                                node = $(clds[0])
                            }
                            var mid = node.attr("mid");
                            if (mid) {
                                return getMInfo(mid)
                            }
                        }
                    }
                }
                return false
            }
        };
        jPlayerProxy.Action.SetMode(1);
        _self.warp.find("[btn='clear']").on("click", function() {
            clear();
            return false
        });
        _self.warp.find("[btn='list']").on("click", function() {
            _self.warp.find("[rel='list_box']").toggle();
            return false
        });
        _self.warp.find("[btn='list_close']").on("click", function() {
            _self.warp.find("[rel='list_box']").hide();
            return false
        });
        _self.warp.find('[rel="silde_back"]').on("click", function() {
            var el = -_self.warp.width();
            _self.warp.css({ right: 0 }).animate({ right: el }, 400, function() {
                _self.warp.hide().css({ right: "" });
                if (_cache.back_dom) {
                    _cache.back_dom.show()
                }
            });
            return false
        });
        _self.warp.find("[btn='add_back']").on("click", function() {
            toBackPlay();
            $(this).hide();
            window.setTimeout(function() {
                if (_action) {
                    _action.ToBack()
                }
            }, 20);
            return false
        });
        _self.warp.find("[btn='stop_back']").on("click", function() {
            _cache.is_back = false;
            if (_cache.back_dom) {
                _cache.back_dom.hide()
            }
            _self.warp.find("[btn='add_back']").show();
            _self.warp.find("[btn='close_back']").hide();
            $(this).hide();
            if (_self.warp.hasClass(_min_class)) {
                _self.warp.hide();
                _self.Stop()
            }
            return false
        });
        _self.warp.find("[btn='close_back']").on("click", function() {
            _cache.is_back = false;
            if (_cache.back_dom) {
                _cache.back_dom.hide()
            }
            _self.warp.find("[btn='add_back']").show();
            _self.warp.find("[btn='stop_back']").hide();
            $(this).hide();
            if (_self.warp.hasClass(_min_class)) {
                _self.warp.hide();
                _self.Stop()
            }
            window.MIN_PLAY_ICON && window.MIN_PLAY_ICON.show();
            return false
        });
        _self.warp.find("[btn='add_album']").on("click", function() {
            Core.CloudMusic.AddCate(function(info) {
            });
            return false
        });
        var albumList = _self.warp.find('[rel="album_list"]');
        albumList.delegate("[btn]", "click", function() {
            var el = $(this);
            var par = el.parents("[tid]");
            var tid = par.attr("tid");
            switch (el.attr("btn")) {
            case "rename":
                Core.CloudMusic.EditCate(tid, function(r) {
                });
                break;
            case "delcate":
                Core.CloudMusic.DelCate(tid, function(r) {
                    if (r) {
                        var albumList = _self.warp.find('[rel="album_list"]');
                        var li = albumList.find('[tid="' + tid + '"]');
                        if (li.length) {
                            if (li.hasClass("focus")) {
                                selectAlbum("-1")
                            }
                            li.empty().remove()
                        }
                    }
                });
                break
            }
            return false
        });
        albumList.delegate("li", "mouseover", function() {
            var em = $(this).find("em");
            em.is(":hidden") && em.show();
            return false
        }).delegate("li", "mouseleave", function() {
            var em = $(this).find("em");
            !em.is(":hidden") && em.hide();
            return false
        }).delegate("li", "click", function() {
            var tid = $(this).attr("tid");
            selectAlbum(tid);
            return false
        });
        var alFileList = _self.warp.find('[rel="album_file_list"]');
        alFileList.delegate("li[mid]", "click", function() {
            var mid = $(this).attr("mid");
            jPlayerProxy.PlayOutLink(getMInfo(mid));
            return false
        }).delegate("[btn]", "click", function() {
            var el = $(this);
            var par = el.parents("[mid]");
            switch (el.attr("btn")) {
            case "download":
                Core.FileAPI.Download(par.attr("pick_code"));
                break;
            case "add_cloud":
                var fid = par.attr("fid");
                changeAlbum(el, fid);
                break;
            case "delete":
                var mid = par.attr("mid");
                var tid = par.attr("tid");
                Core.CloudMusic.DelFile(tid, mid, function(info) {
                    if (info) {
                        var alFileList = _self.warp.find('[rel="album_file_list"]');
                        var li = alFileList.find('[mid="' + mid + '"]');
                        if (li.length) {
                            li.empty().remove()
                        }
                    }
                });
                break
            }
            return false
        }).delegate("[add_music]", "click", function() {
            var tid = $(this).attr("tid");
            Core.FileSelectDG.Open(function(list) {
                var fids = [];
                for (var i = 0, len = list.length; i < len; i++) {
                    var item = list[i];
                    fids.push(item.file_id)
                }
                Core.CloudMusic.AddFileList(tid, fids, function(list) { selectAlbum(tid) })
            }, { filter: 13, btn_txt: "确定", select_txt: "添加" });
            return false
        })
    };
    var selectAlbum = function(tid, arr) {
        var albumList = _self.warp.find('[rel="album_list"]');
        if (tid == -2) {
            var focusLi = albumList.find(".focus");
            if (focusLi.length) {
                tid = focusLi.attr("tid")
            } else {
                var l = albumList.find("li[tid]").not('[tid="-1"]');
                if (l.length) {
                    tid = $(l[0]).attr("tid")
                } else {
                    tid = "-1"
                }
            }
            window.setTimeout(function() { _self.warp.find('[btn="list"]').click() }, 50)
        }
        var el = albumList.find('li[tid="' + tid + '"]');
        el.parent().find(".focus").removeClass("focus");
        el.addClass("focus");
        var listBox = _self.warp.find('[rel="list"]');
        var alFileList = _self.warp.find('[rel="album_file_list"]');
        var clearBtn = _self.warp.find('[btn="clear"]');
        if (tid == "-1") {
            listBox.show();
            alFileList.hide();
            clearBtn.show()
        } else {
            alFileList.html("");
            Core.CloudMusic.GetFileList(tid, function(data) {
                for (var k in data) {
                    var item = data[k];
                    _urls[item.id] = item;
                    var className = "";
                    if (_ac_out_obj && _ac_out_obj.tid == item.topic_id && _ac_out_obj.key == item.id) {
                        className = ' class="focus"'
                    }
                    alFileList.append(String.formatmodel('<li pick_code="{pick_code}"' + className + ' mid="{id}" fid="{file_id}" tid="{topic_id}"><span><a href="javascript:;">{file_name}</a></span><em><a href="javascript:;" class="mu-playlist" btn="add_cloud">加入播放列表</a><a href="javascript:;" class="mu-download" btn="download">下载</a><a href="javascript:;" class="mu-delete" btn="delete">删除</a></em></li>', item))
                }
                alFileList.append('<li tid="' + tid + '" add_music="1"><a href="javascript:;" style="color:#777;">+点击这里，添加更多音乐</a></li>');
                if (arr && arr.length) {
                    var file = arr[0];
                    var li = alFileList.find('[pick_code="' + file.attr("pick_code") + '"]');
                    if (!li.hasClass("focus")) {
                        window.setTimeout(function() { li.click() }, 10)
                    }
                }
            });
            listBox.hide();
            alFileList.show();
            clearBtn.hide()
        }
    };
    var initButton = function() {
        _self.warp.css({ left: "" }).removeClass(_min_class);
        _self.warp.find(".music-switch").hide();
        if (!_cache.is_back) {
            _self.warp.find("[btn='add_back']").show();
            _self.warp.find("[btn='stop_back']").hide();
            _self.warp.find("[btn='close_back']").hide()
        } else {
            _self.warp.find("[btn='add_back']").hide();
            _self.warp.find("[btn='stop_back']").show();
            _self.warp.find("[btn='close_back']").hide()
        }
        _self.Loading(false)
    };
    var addMusic = function(arr, isplay) {
        var newArr = [];
        var hasNode;
        for (var i = 0, len = arr.length; i < len; i++) {
            var item = arr[i];
            var pick_code = item.pick_code;
            var node = _content.find("[rel='list'] [pick_code='" + pick_code + "']");
            if (!node.length) {
                newArr.push(item)
            } else {
                if (!hasNode) {
                    hasNode = node
                }
            }
        }
        if (newArr.length) {
            jPlayerProxy.Add(arr, isplay)
        } else {
            if (hasNode) {
                if (_cache.old_odd && _cache.old_odd.attr("key") != hasNode.attr("key")) {
                    jPlayerProxy.Play(hasNode.attr("key"))
                } else {
                    jPlayerProxy.OnlyPlay()
                }
            }
        }
    };
    var _top = Util.Override(Core.Viewer.Base, _self, {
        Show: function(arr, isplay, is_album, tid) {
            if (!_is_create) {
                if (_isLoading) {
                    return
                }
                _isLoading = true;
                _self.Loading("正在下载播放器");
                Util.Load.JS(Core.CONFIG.JSPath.JPlayer, function() {
                    Util.Load.JS(Core.CONFIG.JSPath.JPProxy, function() {
                        Core.CloudMusic.AddClient({
                            AddCate: function(cateInfo, allCates) {
                                var listBox = _self.warp.find('[rel="album_list"]');
                                listBox.append(String.formatmodel('<li tid="{topic_id}"><span>{topic_name}</span><em style="display:none;"><a href="javascript:;" btn="rename" class="mu-edit">重命名</a><a href="javascript:;" btn="delcate" class="mu-remove">移除</a></em></li>', cateInfo))
                            },
                            RenameCate: function(cateInfo, callCates) {
                                var listBox = _self.warp.find('[rel="album_list"]');
                                var li = listBox.find('li[tid="' + cateInfo.topic_id + '"]');
                                li.find("span").html(cateInfo.topic_name)
                            }
                        });
                        Core.CloudMusic.GetCate(function(album) {
                            _isLoading = false;
                            _top.Show();
                            _self.warp.css({ marginLeft: "-400px" });
                            initButton();
                            var listBox = _self.warp.find('[rel="album_list"]');
                            listBox.append('<li tid="-1"><span>试听列表</span></li>');
                            for (var k in album) {
                                listBox.append(String.formatmodel('<li tid="{topic_id}"><span>{topic_name}</span><em style="display:none;"><a href="javascript:;" btn="rename" class="mu-edit">重命名</a><a href="javascript:;" btn="delcate" class="mu-remove">移除</a></em></li>', album[k]))
                            }
                            if (is_album) {
                                selectAlbum(tid, arr)
                            } else {
                                selectAlbum("-1");
                                addMusic(arr, isplay)
                            }
                            if (_cache.is_back) {
                                _self.warp.hide();
                                _self.warp.find("[btn='add_back']").click();
                                showBackDom()
                            }
                        })
                    })
                })
            } else {
                _top.Show();
                _self.warp.css({ marginLeft: "-400px" });
                initButton();
                if (!is_album) {
                    selectAlbum("-1")
                }
                addMusic(arr, isplay)
            }
        },
        AddAlbum: function(arr, tid) { selectAlbum(tid, arr) },
        DoBack: function() {
            if (_cache.is_back) {
                _self.warp.hide();
                _self.warp.find("[btn='add_back']").click();
                showBackDom()
            }
        },
        Add: function(arr, isplay) {
            if (_self.warp) {
                selectAlbum("-1");
                addMusic(arr, isplay)
            }
        },
        Stop: function() {
            if (jPlayerProxy) {
                jPlayerProxy.Stop()
            }
        },
        IsBack: function() { return _cache.is_back },
        BackPlay: function(ishide) { toBackPlay(ishide) },
        Hide: function() {
            _top.Hide();
            if (_self.warp) {
                if (_cache.is_back) {
                    _self.warp.addClass(_min_class);
                    _self.warp.find(".music-switch").show();
                    if (_cache.back_dom) {
                        _cache.back_dom.show()
                    }
                    if (_self.warp.hasClass(_min_class)) {
                        _self.warp.find("[btn='add_back']").hide();
                        _self.warp.find("[btn='stop_back']").hide();
                        _self.warp.find("[btn='close_back']").show()
                    }
                } else {
                    _self.Stop()
                }
            }
        },
        Initial: function() {
            _content = _self.warp;
            if (!_is_create) {
                initPlay()
            }
            _is_create = true;
            var zindex = Core.WinHistory.GetIndex();
            _self.warp.css({ "z-index": zindex + 15 });
            Core.WinHistory.LessIndex()
        },
        MinFloat: function(fileDom) {
            var l = $(document).width() / 2, b = $(document).height() / 2;
            if (fileDom) {
                l = $(document).width() - fileDom.offset().left - (fileDom.width() / 2), b = $(document).height() - (fileDom.offset().top + 38 + (fileDom.height() / 2))
            }
            if (!_floatDom) {
                _floatDom = $('<div class="music-float" style="display:none;z-index:10"></div>');
                $(document.body).append(_floatDom)
            }
            _floatDom.show().css({ right: l, bottom: b }).animate({ right: 0, bottom: 30 }, 600, function() { _floatDom.hide() })
        }
    }, { html: '<div class="music-player" style="z-index:11;"><div class="music-switch" style="display:none;"><b class="mubtn-slide" rel="silde_back">收缩</b></div><div class="music-panel"><div class="music-background"><a href="javascript:;" class="mbg-back" style="display:none;" btn="add_back" title="后台播放">后台播放</a><a href="javascript:;" class="mbg-front" style="display:none;" btn="stop_back" title="停止后台播放">停止后台播放</a><a href="javascript:;" class="mbg-close" style="display:none;" btn="close_back" title="关闭">关闭</a></div><div class="music-animate"></div><div class="music-name"><strong rel="play_name"></strong><em><span jplay="play_time"></span>/<span jplay="total_time"></span></em></div><div class="music-progress" jplay="progress_line"><em style="width:0;" jplay="download_line"></em><i style="width:0;" jplay="play_line"></i></div><div class="music-control"><a href="javascript:;" class="ctrl-prev" jplay="per">上一首</a><a href="javascript:;" class="ctrl-play" jplay="play">播放</a><a href="javascript:;" class="ctrl-pause" style="display:none;" jplay="pause">暂停</a><a href="javascript:;" class="ctrl-next" jplay="next">下一首</a></div><div class="music-volume"><a href="javascript:;" class="ctrl-volume" jplay="volume_close">音量</a><a href="javascript:;" class="ctrl-mute" jplay="volume_open" style="display:none;">静音</a><div class="music-progress volume-progress" jplay="volume_line"><em jplay="volume_size_line" style="width:50%;"><b jplay="volume_button"></b></em></div></div><div class="music-loop"><a href="javascript:;" class="loop-single" jplay="mode_1" title="单曲循环">单曲循环</a><a href="javascript:;" class="loop-random" jplay="mode_0" style="display:none;" title="随机播放">随机播放</a><a href="javascript:;" class="loop-list" jplay="mode_2" style="display:none;" title="列表循环">列表循环</a> <a href="javascript:;" class="list-switch" btn="list" title="播放列表">播放列表</a></div></div><div class="music-playlist" rel="list_box" style="display:none;"><div class="mulist-side"><ul rel="album_list"></ul><div class="music-bottom"><a href="javascript:;" btn="add_album"><i class="mu-playlist"></i>添加云专辑</a></div></div><div class="music-list"><ul rel="list"></ul><ul rel="album_file_list" style="display:none;"></ul><div class="music-bottom"><a href="javascript:;" btn="clear">清空列表</a> <a href="javascript:;" class="list-shrink" btn="list_close">收起列表</a></div></div></div></div>', parent: parent })
};
Core.Viewer.Video = function(parent) {
    var _self = this, _video, _$f = false, _ieIsfire = false, _isShow = false, _isHeight, _isFull = false, _isMin = false, _old = { }, _isSwf = $.browser.mozilla || $.browser.msie;
    _isSwf = true;
    if (navigator.platform.toString().toLowerCase() == "ipad") {
        _isSwf = false
    }
    var center = function() {
        if (_video) {
            if (_isMin) {
                return
            }
            var w = $(window).width(), h = $(window).height() - 40;
            w = parent.width();
            var vw = _old.width, vh = _old.height;
            var p = vw / vh;
            if (vw > w - 50) {
                var less = vw - (w - 50);
                vw = w - 50;
                vh = vh - (less / p)
            }
            if (vh > (h - 50)) {
                var lessH = vh - (h - 50);
                vh = h - 50;
                vw = vw - (lessH * p)
            }
            if (!vw || !vh) {
                vw = _self.warp.width();
                vh = _self.warp.height()
            }
            _self.warp.width(vw).height(vh);
            _self.warp.find(".prvideo-box").css({ width: vw + "px", height: vh + "px" }).find("#player").css({ width: vw + "px", height: vh + "px" });
            _isHeight = vh;
            _self.warp.css({ top: (h - vh) / 2 + 40, left: (w - vw) / 2 })
        }
    };
    var _top = Util.Override(Core.Viewer.Base, _self, {
        Min: function() {
            _self.warp.css({ width: "350px", height: "300px", top: "", left: "" });
            _self.warp.find(".prvideo-box").css({ width: "350px", height: "300px" });
            var vw = _old.width, vh = _old.height;
            var h = 350 * vh / vw;
            var add = (260 - h) / 2;
            if (_isSwf) {
                if (_video) {
                    _video.css({ width: "350px", height: h + "px", top: (40 + add) + "px", position: "absolute" })
                }
            } else {
                if (_video) {
                    _video.css({ width: "350px", top: (40 + add) + "px", position: "absolute" })
                }
            }
            _isMin = true
        },
        Max: function() {
            _self.warp.find(".prvideo-box").css({ width: _old.width + "px", height: _old.height + "px" });
            if ($.browser.mozilla || $.browser.msie) {
                if (_video) {
                    var vw = _old.width, vh = _old.height;
                    _video.css({ width: vw + "px", height: vh + "px", position: "", top: "" })
                }
            } else {
                if (_video) {
                    _video.css({ width: "", height: "", position: "", top: "" })
                }
            }
            _isMin = false;
            center()
        },
        Show: function(setting) {
            var url = setting.url, width = setting.width, height = setting.height;
            var k = setting.k;
            var t = setting.t;
            if (!width) {
                width = 800
            }
            if (!height) {
                height = 600
            }
            var minWidth = 400;
            if (width < minWidth) {
                var h = minWidth * height / width;
                height = h;
                width = minWidth
            }
            _old.width = width;
            _old.height = height;
            _isShow = true;
            _top.Show();
            if (_ieIsfire) {

                function $F() {
                    if (_$f) {
                        _self.Flv(width, height, url, t, k)
                    } else {
                        setTimeout($F, 50)
                    }
                }

                $F()
            } else {
                if (width) {
                    _self.warp.width(width)
                }
                if (height) {
                    _self.warp.height(height)
                }
                _video.attr("src", url);
                center()
            }
        },
        Hide: function() {
            _isShow = false;
            _top.Hide();
            if (_ieIsfire) {
                _video.empty()
            } else {
                _video.attr("src", "")
            }
            Core.MinMessage.Hide()
        },
        Initial: function() {
            if (_isSwf) {
                _ieIsfire = true;
                Util.Load.JS("/static/flowplayer/flowplayer-3.2.8.min.js?v=" + (+new Date), function() {
                    _video = $('<div class="player" style="display:block;position:absolute;left:0px;" id="player"></div>');
                    _self.warp.find(".prvideo-box").append(_video);
                    _$f = true
                })
            } else {
                _video = $("<video controls autoplay></video>");
                _self.warp.css({ "z-index": "20" });
                _self.warp.find(".prvideo-box").append(_video);
                center()
            }
            $(window).on("resize", function() {
                if (_isShow) {
                    center()
                }
            })
        },
        Flv: function(width, height, url, getHeight, t, k) {
            var player = $("#player"), getHeight = function($f, height) { $f().getPlugin("content").css({ top: (height - 30) / 2 }) }, setting = {
                provider: "lighttpd", scaling: "fit", autoPlay: true,
                onBeforeSeek: function() {
                    if (_isFull == false) {
                        getHeight($f, (_isHeight || height))
                    }
                },
                onMetaData: function() {
                },
                onBeforePause: function() {
                }
            };
            _video.css({ width: width + "px", height: height + "px" });
            $f && $f(player[0], { src: "/static/flowplayer/flowplayer.commercial-3.2.6-dev.swf", wmode: "Opaque" }, {
                canvas: { backgroundGradient: "none", backgroundColor: "#000000" }, plugins: { lighttpd: { url: "/static/flowplayer/flowplayer.pseudostreaming-3.2.9.swf", queryString: "&start=${start}" }, controls: { timeColor: "#b5b5b5", durationColor: "#666666", bufferColor: "#3f4857", progressColor: "#418cdb", buttonColor: "#b4b4b4", timeSeparator: "/", backgroundColor: "#1e1e1e", backgroundGradient: "none", volumeSliderColor: "#505050", volumeColor: "#418cdb", volumeBorder: "none", height: 30, scrubberHeightRatio: 0.5, volumeSliderHeightRatio: 0.5, tooltips: { buttons: true, play: "播放", pause: "暂停", fullscreen: "全屏", fullscreenExit: "退出全屏", mute: "静音", unmute: "退出静音" }, tooltipColor: "#1e1e1e", tooltipTextColor: "#ffffff", tooltipGradient: "none" } }, clip: setting,
                onLoad: function() {
                },
                onStart: function() {
                },
                onResume: function() {
                },
                onPause: function() {
                },
                onError: function() {
                },
                onFullscreen: function() {
                    _isFull = true;
                    var _height = window.screen.height;
                    getHeight($f, _height)
                },
                onFullscreenExit: function() {
                    _isFull = false;
                    getHeight($f, (_isHeight || height))
                },
                playlist: [url]
            });
            center()
        }
    }, { html: '<div class="previewer-video" style="position: absolute;"><div class="prvideo-box" style="width:auto;height:auto;text-align:center;"></div></div>', parent: parent })
};
Core.ViewFile = (function() {
    var _cache = { }, _viewer = { }, _play_mod = { Default: 1, Document: 2, Photo: 3, Music: 4, FullScreen: 31 }, _tempApi, _tempData;
    var action = {
        close: function() {
            former.hideScene();
            window.setTimeout(function() {
                if (_cache.warp) {
                    _cache.warp.hide()
                }
                if (_viewer.photo) {
                    _viewer.photo.Resize()
                }
            }, 10);
            _cache.is_open = false
        },
        next: function() {
            if (_tempApi && _tempApi.next) {
                if (_tempApi.next) {
                    if (!_tempApi.next(_tempData)) {
                        Core.MinMessage.Show({ text: "已到最后一个文件了！", type: "inf", timeout: 2000 })
                    }
                }
                return
            }
            if (_cache.active_dom) {
                var dom = _cache.active_dom.next();
                if (dom.attr("file_type") == "1" && dom && dom.length) {
                    Core.ViewFile.Run(dom)
                } else {
                    Core.MinMessage.Show({ text: "已到最后一个文件了！", type: "inf", timeout: 2000 })
                }
            }
        },
        prev: function() {
            if (_tempApi && _tempApi.prev) {
                if (_tempApi.prev) {
                    if (!_tempApi.prev(_tempData)) {
                        Core.MinMessage.Show({ text: "已到最前一个文件了！", type: "inf", timeout: 2000 })
                    }
                }
                return
            }
            if (_cache.active_dom) {
                var dom = _cache.active_dom.prev();
                if (dom.attr("file_type") == "1" && dom && dom.length) {
                    Core.ViewFile.Run(dom)
                } else {
                    Core.MinMessage.Show({ text: "已到最前一个文件了！", type: "inf", timeout: 2000 })
                }
            }
        },
        error: function(fileDom, msg) {
            former.hideScene();
            _cache.active_dom = fileDom;
            var fileSize = _cache.active_dom.attr("file_size");
            if (fileSize) {
                var fileSizeBox = _cache.warp.find('[rel="file_size"]');
                fileSizeBox.html(Util.File.ShowSize(fileSize)).show()
            }
            var fileNameBox = _cache.warp.find('[rel="file_name"]');
            var fileName = _cache.active_dom.find("[field='file_name']").attr("title");
            if (fileName) {
                fileNameBox.html(fileName).show()
            } else {
                fileNameBox.hide()
            }
            if (!_viewer.error) {
                _viewer.error = new Core.Viewer.Error(_cache.warp.find('[rel="con"]'), { prev: function() { action.prev() }, next: function() { action.next() } })
            }
            _viewer.error.Show(fileDom, msg);
            _cache.play_mod = _play_mod.Default;
            return _viewer.error.warp
        },
        collect: function() {
            if (_tempApi && _tempApi.collect) {
                _tempApi.collect(_tempData)
            }
        },
        rotate: function() {
            var obj;
            switch (_cache.play_mod) {
            case 3:
                obj = _viewer.photo;
                break;
            case 31:
                obj = _viewer.photofull;
                break
            }
            if (obj) {
                obj.Rotate()
            }
        },
        fullscreen: function() {
            if (!_viewer.photo || !_viewer.photo.GetUrl()) {
                Core.MinMessage.Show({ text: "文件正在进入云端，请稍候重试", type: "inf", timeout: 2000 });
                return
            }
            switch (_cache.play_mod) {
            case 3:
                var imgCtl = _cache.warp.find('[rel="img_ctl"]');
                imgCtl.find(".focus").removeClass("focus");
                imgCtl.find('[btn="fullscreen"]').addClass("focus");
                if (_viewer.photo) {
                    former.hideViewer();
                    if (!_viewer.photofull) {
                        _viewer.photofull = new Core.Viewer.PhotoFull(_cache.warp.find('[rel="con"]'))
                    }
                    _viewer.photofull.Show(_viewer.photo);
                    _cache.play_mod = _play_mod.FullScreen
                }
                break
            }
        },
        fullscreen_webkit: function() {
            var el = document.documentElement, rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen;
            if (rfs) {
                rfs.call(el)
            }
        },
        fullreturn: function() {
            switch (_cache.play_mod) {
            case 31:
                if (_viewer.photo) {
                    former.hideViewer();
                    _viewer.photo.Show();
                    _cache.play_mod = _play_mod.Photo
                }
                break
            }
        },
        download: function() {
            if (_tempApi && _tempData && _tempData.pick_code) {
                Core.FileAPI.Download(_tempData.pick_code);
                return
            }
            if (_cache.active_dom) {
                var pick_code = _cache.active_dom.attr("pick_code");
                Core.FileAPI.Download(pick_code)
            } else {
                Core.MinMessage.Show({ text: "文件正在进入云端，请稍候重试", type: "inf", timeout: 2000 })
            }
        },
        star: function() {
            var file_id = _cache.active_dom.attr("file_id");
            var star = 1;
            Core.FileAjax.Star(file_id, star, function(ids, star) {
                Core.FileConfig.DataAPI && Core.FileConfig.DataAPI.Star(Core.FileConfig.aid, Core.FileConfig.cid, [_cache.active_dom], star);
                Core.MinMessage.Show({ text: "成功标为星标文件", type: "suc", timeout: 2000 })
            })
        },
        share: function() {
            if (_cache.active_dom) {
                var list = [_cache.active_dom];
                var sharelist = { weibo: 1, q: 1, share: 1, send: 1 };
                var openCondition = { };
                var res = Core.FileMenu.CheckType(Number(_cache.active_dom.attr("area_id")), Number(_cache.active_dom.attr("p_id")), list);
                if (res) {
                    for (var i = 0, len = res.length; i < len; i++) {
                        if (sharelist[res[i]]) {
                            openCondition[res[i]] = 1
                        }
                    }
                }
                Core.FileAPI.ShareTO(list, openCondition)
            } else {
                Core.MinMessage.Show({ text: "文件正在进入云端，请稍候重试", type: "inf", timeout: 2000 })
            }
        },
        min_size: function() { showMinBtn() },
        max_size: function() { maxBoxFun() }
    };
    var showMinBtn = function() {
        _cache.warp.addClass("preview-box-min");
        _cache.warp.find('[btn="min_size"]').hide();
        _cache.warp.find('[btn="max_size"]').show();
        if (_viewer.video) {
            _viewer.video.Min()
        }
        _cache.warp.find('[vod="1"]').css({ display: "block" })
    };
    var maxBoxFun = function() {
        _cache.warp.removeClass("preview-box-min");
        _cache.warp.find('[btn="min_size"]').show();
        _cache.warp.find('[btn="max_size"]').hide();
        if (_viewer.video) {
            _viewer.video.Max()
        }
        _cache.warp.find('[vod="1"]').css({ display: "" })
    };
    var hideAllSizeBtn = function() {
        _cache.warp.removeClass("preview-box-min");
        _cache.warp.find('[btn="min_size"]').hide();
        _cache.warp.find('[btn="max_size"]').hide()
    };
    var getUrl = function(data, callback) { $.ajax({ data: data, url: "?ct=app&ac=get", type: "GET", dataType: "json", cache: false, success: function(r) { callback && callback(r) } }) };
    var disBtn = function(ishidden, key) {
        var handBox = _cache.warp.find('[rel="btn_hand"]');
        handBox.show();
        var box;
        if (key) {
            box = handBox.find("[btn='" + key + "']")
        } else {
            box = handBox.find("[btn]")
        }
        if (ishidden) {
            box.hide()
        } else {
            box.css({ display: "" })
        }
    };
    var reszieBtn = function() {
        disBtn();
        _cache.warp.find('[rel="img_ctl"]').hide();
        _cache.warp.find('[vod="1"]').hide();
        _cache.warp.find('[rel="full_ctl"]').css({ display: "none" });
        disBtn(true, "collect");
        disBtn(true, "fullscreen");
        disBtn(true, "rotate");
        disBtn(true, "star");
        if (!$.browser.msie) {
            _cache.warp.find('[rel="full_ctl"]').css({ display: "" })
        }
    };
    var makeMusicInfo = function(fileDom, url) {
        var pick_code = fileDom.attr("pick_code");
        var obj = { };
        obj.pick_code = pick_code;
        obj.name = fileDom.find("[field='file_name']").attr("title");
        obj.mp3 = url;
        obj.aid = fileDom.attr("area_id");
        obj.cid = fileDom.attr("p_id");
        obj.is_share = fileDom.attr("is_share");
        obj.file_type = fileDom.attr("file_type");
        obj.file_id = fileDom.attr("file_id");
        return obj
    };
    var makeMusic = function(list, r) {
        var arr = [];
        for (var i = 0, len = list.length; i < len; i++) {
            var fileDom = list[i];
            var pick_code = fileDom.attr("pick_code");
            if (r.data[pick_code]) {
                arr.push(makeMusicInfo(fileDom, r.data[pick_code]["url"]))
            }
        }
        return arr
    };
    var settingScene = function(type, fileDom) {
        former.hideScene();
        _cache.active_dom = fileDom;
        reszieBtn();
        if (Number(fileDom.attr("area_id")) == 999) {
            disBtn(true, "share")
        }
    };
    var getFileAttr = function() {
        var str = ' file_type="1" is_share="{is_share}" file_size="{file_size}" file_id="{file_id}" area_id="{area_id}" p_id="{category_id}" ico="{ico}" pick_code="{pick_code}" ';
        return str
    };
    var createViewer = function(type) {
        switch (type) {
        case "music":
            if (!_viewer.music) {
                _viewer[type] = new Core.Viewer.Music($(document.body), { screen: _cache.warp.find(".preview-container"), ToBack: function() { action.close() } })
            }
            break;
        case "document":
            if (!_viewer[type]) {
                _viewer[type] = new Core.Viewer.Document(_cache.warp.find('[rel="con"]'), {
                    ready: function() {
                    },
                    error: function(code, msg) { Core.MinMessage.Show({ text: msg, type: "err", timeout: 2000 }) },
                    help: function() {
                    },
                    esckeyup: function() { action.close() }
                })
            }
            break;
        case "video":
            if (!_viewer.video) {
                _viewer.video = new Core.Viewer.Video(_cache.warp.find('[rel="con"]'))
            }
            break;
        case "photo":
            disBtn(false, "fullscreen");
            disBtn(false, "rotate");
            var imgCtl = _cache.warp.find('[rel="img_ctl"]');
            if (!_viewer[type]) {
                _viewer[type] = new Core.Viewer.Photo(_cache.warp.find('[rel="con"]'), function() {
                    var pos = _viewer[type].GetPosIndex();
                    imgCtl.find(".focus").removeClass("focus");
                    var li;
                    switch (pos) {
                    case 0:
                        li = imgCtl.find('[size="100"]');
                        li.addClass("focus");
                        break;
                    case 1:
                        li = imgCtl.find('[size="480"]');
                        li.addClass("focus");
                        break;
                    case 2:
                        li = imgCtl.find('[size="800"]');
                        li.addClass("focus");
                        break;
                    case 3:
                        li = imgCtl.find('[size="1440"]');
                        li.addClass("focus");
                        break
                    }
                }, {
                    screen: _cache.warp.find(".preview-container"), prev: function() { action.prev() }, next: function() { action.next() },
                    back: function(data) {
                        var struct = { S100: false, S480: false, S800: false, S1440: data.url };
                        var indStruct = { S100: 0, S480: 1, S800: 2, S1440: 3 };
                        if (data.all_url) {
                            for (var k in data.all_url) {
                                var item = data.all_url[k];
                                if (item.indexOf("100_100") != -1) {
                                    struct.S100 = item;
                                    continue
                                }
                                if (item.indexOf("480_480") != -1) {
                                    struct.S480 = item;
                                    continue
                                }
                                if (item.indexOf("800_800") != -1) {
                                    struct.S800 = item;
                                    continue
                                }
                            }
                        }
                        for (var k in struct) {
                            if (struct[k]) {
                                imgCtl.find('[size="' + k.replace("S", "") + '"]').css({ display: "" })
                            }
                        }
                        imgCtl.find("[size]").off("click").on("click", function() {
                            var el = $(this);
                            var key = "S" + el.attr("size");
                            imgCtl.find(".focus").removeClass("focus");
                            el.addClass("focus");
                            if (struct[key]) {
                                var url = struct[key];
                                if (_viewer.photo) {
                                    former.hideViewer();
                                    _viewer.photo.ChangeURI(url, indStruct[key]);
                                    _cache.play_mod = _play_mod.Photo
                                }
                            }
                            return false
                        })
                    }
                })
            }
            imgCtl.find("[size]").css({ display: "none" });
            imgCtl.css({ display: "" });
            break
        }
    };
    var displayDesc = function() {
        var desc = _cache.active_dom.find("[field='desc']").val();
        var descBox = _cache.warp.find('[rel="desc"]');
        descBox.is(":hidden") && descBox.show();
        var str = "您可以点击此处添加描述信息...";
        var isLink = false;
        if (desc) {
            str = desc.replace(/\[.*?\]/g, "");
            isLink = true
        } else {
            if (_cache.active_dom.attr("has_desc") != "1") {
                _cache.active_dom.attr("load_data", "1");
                isLink = true
            } else {
                if (_cache.active_dom.attr("load_data") == "1") {
                    isLink = true
                } else {
                    str = "正获取文件备注..."
                }
            }
        }
        if (isLink) {
            str = '<span style="cursor: pointer;" is_edit="1" title="可以点击此处编辑内容">' + str + "</span>";
            descBox.html(str);
            descBox.find("[is_edit]").on("click", function() {
                Core.FileDescDG.Show({ aid: 1, file_id: (_cache.active_dom.attr("file_id")), value: desc, callback: function() { showDesc() } });
                return false
            })
        } else {
            descBox.html(str)
        }
    };
    var showDesc = function() {
        displayDesc();
        if (_cache.active_dom.attr("load_data") != "1" && _cache.active_dom.attr("has_desc") == "1") {
            if (_cache.active_dom.attr("has_desc") == "1") {
                var file_id = _cache.active_dom.attr("file_id");
                Core.DataAccess.FileRead.GetFileDetail(file_id, function(data) {
                    if (_cache.active_dom.attr("file_id") == file_id) {
                        _cache.active_dom.attr("load_data", "1");
                        var desc = data.state ? data.desc : "";
                        _cache.active_dom.find("[field='desc']").val(desc ? desc : "");
                        if (_cache.active_dom.count != undefined) {
                            _cache.active_dom.attr("dc", data.count)
                        }
                        showDesc()
                    }
                })
            }
        }
    };
    var former = {
        hideViewer: function() {
            for (var k in _viewer) {
                _viewer[k].Hide()
            }
        },
        hideScene: function() {
            var fileNameBox = _cache.warp.find('[rel="file_name"]');
            fileNameBox.hide();
            var fileSizeBox = _cache.warp.find('[rel="file_size"]');
            fileSizeBox.hide();
            former.hideViewer();
            hideAllSizeBtn()
        },
        scene_q: function(type, data) {
            former.hideScene();
            reszieBtn();
            disBtn(true, "share");
            disBtn(true, "download");
            disBtn(true, "fullscreen");
            if (_tempApi && _tempApi.collect) {
                disBtn(false, "collect")
            }
            if (!data.filename) {
                data.filename = ""
            }
            var fileNameBox = _cache.warp.find('[rel="file_name"]');
            fileNameBox.html(data.filename).show();
            var fileSizeBox = _cache.warp.find('[rel="file_size"]');
            fileSizeBox.html(data.filesize).show();
            if (data.is_topic) {
                createViewer("photo");
                _viewer.photo.Show({ url: data.url, all_url: data.all_url, source_url: data.source_url });
                _cache.play_mod = _play_mod.Photo;
                return
            }
            $.ajax({
                url: data.url, type: "GET", cache: false, dataType: "json",
                success: function(r) {
                    if (r.state) {
                        switch (r.data.type) {
                        case 2:
                            createViewer("document");
                            _viewer.document.Show({ url: r.data.url[r.data.url.length - 1] });
                            _cache.play_mod = _play_mod.Document;
                            return;
                        case 3:
                            createViewer("photo");
                            _viewer.photo.Show({ url: r.data.url[r.data.url.length - 1], all_url: r.data.all_url, source_url: r.data.url[r.data.url.length - 1] });
                            _cache.play_mod = _play_mod.Photo;
                            return;
                        case 4:
                            var suffix = "";
                            if (data.filename.lastIndexOf(".") != -1) {
                                suffix = data.filename.substring(data.filename.lastIndexOf("."), data.filename.length).replace(".", "")
                            }
                            if (suffix.toLowerCase() == "mp3") {
                                fileNameBox.hide();
                                createViewer("music");
                                var obj = { };
                                obj.pick_code = data.pick_code;
                                obj.name = data.filename;
                                obj.mp3 = r.data.url[r.data.url.length - 1];
                                obj.aid = 1;
                                obj.cid = 0;
                                obj.is_share = 0;
                                obj.file_type = "1";
                                obj.not_down = 1;
                                _viewer.music.Show([obj], true);
                                _cache.play_mod = _play_mod.Music;
                                return
                            }
                        }
                        var fileDom = $(String.formatmodel("<div " + getFileAttr() + '><span field="file_name" title="{filename}"></span></div>', data));
                        action.error(fileDom, "该文件暂不支持预览");
                        return
                    } else {
                        var fileDom = $(String.formatmodel("<div " + getFileAttr() + '><span field="file_name" title="{filename}"></span></div>', data));
                        action.error(fileDom, "该文件暂不支持预览")
                    }
                }
            })
        },
        scene_pickcode: function(type, pick_code) {
            former.hideScene();
            reszieBtn();
            disBtn(true, "share");
            var fileNameBox = _cache.warp.find('[rel="file_name"]');
            fileNameBox.hide();
            switch (Number(type)) {
            case 3:
                getUrl({ flag: type, pick_code: pick_code }, function(r) {
                    if (r.state) {
                        createViewer("photo");
                        _viewer.photo.Show(r.data);
                        _cache.play_mod = _play_mod.Photo
                    } else {
                        Core.MinMessage.Show({ text: r.msg, type: "err", timeout: 2000 })
                    }
                });
                break
            }
        },
        scene_url: function(type, data) {
            former.hideScene();
            reszieBtn();
            Core.MinMessage.Show({ text: "正在读取文件数据", type: "load", timeout: 10000 });
            Core.DataAccess.FileRead.GetInfoBySha1(data.sha1 + window.LINSHIBL, function(r) {
                Core.MinMessage.Hide();
                if (r.state) {
                    var fileDom = $(String.formatmodel("<div " + getFileAttr() + '><span field="file_name" title="{file_name}"></span></div>', r.data));
                    _cache.active_dom = fileDom;
                    switch (Number(type)) {
                    case 2:
                        break;
                    case 3:
                        if (!data.url) {
                            data.url = r.data.img_url
                        }
                        if (r.data && r.data.all_url) {
                            data.all_url = r.data.all_url
                        }
                        data.source_url = r.data.url;
                        var fileNameBox = _cache.warp.find('[rel="file_name"]');
                        fileNameBox.html(_cache.active_dom.find("[field='file_name']").attr("title")).show();
                        createViewer("photo");
                        _viewer.photo.Show(data);
                        _cache.play_mod = _play_mod.Photo;
                        break;
                    case 4:
                        break
                    }
                } else {
                    _cache.active_dom = null;
                    switch (Number(type)) {
                    case 2:
                        break;
                    case 3:
                        createViewer("photo");
                        data.url = data.url;
                        _viewer.photo.Show(data);
                        _cache.play_mod = _play_mod.Photo;
                        break;
                    case 4:
                        break
                    }
                }
            })
        },
        scene: function(type, fileDom) {
            former.hideScene();
            _cache.active_dom = fileDom;
            var pick_code = fileDom.attr("pick_code");
            var fileNameBox = _cache.warp.find('[rel="file_name"]');
            reszieBtn();
            var isQ = Number(fileDom.attr("area_id")) == 999;
            if (isQ) {
                disBtn(true, "share")
            }
            if (fileDom.attr("file_status") != "1") {
                var msg = "";
                switch (fileDom.attr("file_status")) {
                case "0":
                    msg = "待续传文件";
                    break;
                case "2":
                    msg = "文件正在进入云端";
                    break
                }
                action.error(fileDom, msg);
                if (!isQ) {
                    disBtn(false, "star")
                }
                return
            }
            var fileSize = _cache.active_dom.attr("file_size");
            if (fileSize) {
                var fileSizeBox = _cache.warp.find('[rel="file_size"]');
                fileSizeBox.html(Util.File.ShowSize(fileSize)).show()
            }
            var filename = _cache.active_dom.find("[field='file_name']").attr("title");
            fileNameBox.html(filename).show();
            if (!isQ) {
                showDesc()
            }
            switch (Number(type)) {
            case 2:
                action.error(fileDom, '文档文件请用 <a href="javascript:;" onclick="Core.FileAPI.OpenDoc(\'' + fileDom.attr("pick_code") + "');return false;\">文库阅读器</a> 查看");
                break;
            case 3:
                getUrl({ flag: type, pick_code: pick_code }, function(r) {
                    if (r.state) {
                        createViewer("photo");
                        _viewer.photo.Show(r.data);
                        _cache.play_mod = _play_mod.Photo
                    } else {
                        action.error(fileDom)
                    }
                });
                break;
            case 4:
                var dom = action.error(fileDom, '音乐文件请 <a href="javascript:;" btn="open">打开音乐播放器</a> 试听');
                dom.find('[btn="open"]').off("click").on("click", function() {
                    Core.FileAPI.ListenMusic(fileDom.attr("pick_code"), fileDom, true, function() { action.error(fileDom) });
                    return false
                });
                break;
                getUrl({ flag: type, pick_code: pick_code }, function(r) {
                    if (r.state) {
                        createViewer("music");
                        var arr = makeMusic([fileDom], r);
                        _viewer.music.Show(arr, true);
                        _cache.play_mod = _play_mod.Music
                    } else {
                        action.error(fileDom)
                    }
                });
                break;
            case 9:
                action.error(fileDom, '视频文件请 <a href="javascript:;" onclick="Core.FileAPI.OpenVideo(\'' + fileDom.attr("pick_code") + "');return false;\">打开播放器</a> 观看");
                break;
            default:
                action.error(fileDom);
                break
            }
            if (!isQ) {
                disBtn(false, "star")
            }
            if (fileDom.attr("notdown")) {
                disBtn(true, "share");
                disBtn(true, "download")
            }
        },
        warp: function(is_hide) {
            if (!_cache.warp) {
                Util.Style.IncludeCss("preview_css", "static/style_v2013/css/preview_box.css?v=118");
                _cache.warp = $('<div class="preview-box" style="display:none;z-index:11;"><div class="preview-container"><a href="javascript:;" data-btn="focus" style="position:absolute; top:-99999px;">Focus</a><div class="preview-close"  btn="close" data_title="ESC关闭"><b>关闭</b></div><div class="preview-panel"><ul class="contents-control" rel="img_ctl" style="display:none;"><li size="100"><i class="sz-01"></i><b>小图</b></li><li size="480"><i class="sz-02"></i><b>中图</b></li><li size="800"><i class="sz-03"></i><b>大图</b></li><li size="1440"><i class="sz-04"></i><b>特大图</b></li><li btn="fullscreen"><i class="sz-04"></i><b>原始图</b></li></ul><ul class="contents-panel" rel="full_ctl"><li btn="fullscreen_webkit"><i class="pr-fullscreen"></i><b>全屏</b></li></ul><ul class="contents-panel" rel="img_ctl"><li btn="rotate"><i class="pr-rotate"></i><b>旋转</b></li></ul><ul class="contents-panel" vod="1"><li btn="min_size"><i class="pr-pack"></i><b>缩小</b></li><li btn="max_size"><i class="pr-fullscreen"></i><b>还原</b></li></ul></div><div class="preview-contents" rel="con"><div class="previewer-guide pr-guide-prev" btn="prev" is_par="prev"><b>上一个</b></div><div class="previewer-guide pr-guide-next" btn="next" is_par="next"><b>下一个</b></div><div class="pr-btn-switch"><b class="pr-btn-prev" btn="prev" is_cld="prev" data_title="按键盘“←”键上一个">上一个</b><b class="pr-btn-next" btn="next" is_cld="next" data_title="按键盘“→”键下一个">下一个</b></div><div class="previewer-loading" style="display:none;" rel="loading">载入中...</div></div></div><div class="preview-info"><h3 class="pri-title"><i class="pr-info"></i>文件信息</h3><div class="pri-info"><p rel="file_name" style="display:none;"></p><p rel="file_size" style="display:none;"></p></div><div class="pri-ban" rel="ban" style="width:200px; display:none;"></div><div class="pri-opt"><ul rel="btn_hand"><li btn="collect"><i class="pr-save"></i><span>转存</span></li><li btn="star"><i class="pr-star"></i><span>星标</span></li><li btn="download"><i class="pr-download"></i><span>下载</span></li><li btn="share"><i class="pr-share"></i><span>分享</span></li></ul></div><div class="pri-desc" rel="desc" style="display:none;"></div></div></div>');
                $(document.body).append(_cache.warp);
                _cache.warp.find("[btn]").on("click", function() {
                    var el = $(this);
                    action[el.attr("btn")] && action[el.attr("btn")]();
                    return false
                });
                if (!($.browser.msie && $.browser.version == 6)) {
                    _cache.warp.find("[is_par]").on("mouseover", function() {
                        var el = $(this);
                        var k = el.attr("is_par");
                        var cld = _cache.warp.find('[is_cld="' + k + '"]');
                        cld.addClass("hover")
                    }).on("mouseleave", function() {
                        var el = $(this);
                        var k = el.attr("is_par");
                        var cld = _cache.warp.find('[is_cld="' + k + '"]');
                        cld.removeClass("hover")
                    })
                }
                if ($.browser.msie && $.browser.version == 6) {
                } else {
                    Core.Viewer.Loading = { Show: function() { _cache.warp.find("[rel='loading']").show() }, Hide: function() { _cache.warp.find("[rel='loading']").hide() } }
                }
                $(document).on("keydown", function(e) {
                    if (_cache.is_open) {
                        switch (e.keyCode) {
                        case 27:
                            action.close();
                            return false;
                            break;
                        case 37:
                        case 38:
                            action.prev();
                            break;
                        case 39:
                        case 40:
                            action.next();
                            break
                        }
                    }
                })
            }
            var zindex = Core.WinHistory.GetIndex();
            _cache.warp.css({ "z-index": zindex + 10 });
            Core.WinHistory.LessIndex();
            if (_cache.warp.is(":hidden") && !Core.FilePermission.Vip()) {
                var ban = _cache.warp.find('[rel="ban"]');
                ban.html('<iframe id="frame_tjj_81" style="height:200px;width:200px;" src="/static/tao/tao.html?v=' + new Date().getTime() + '" scrolling="no" frameborder="0"></iframe>');
                ban.show()
            }
            if (is_hide) {
                _cache.warp.hide()
            } else {
                _cache.warp.show()
            }
            _cache.is_open = true;
            window.setTimeout(function() { _cache.warp.find('[data-btn="focus"]').focus() }, 20)
        }
    };
    return {
        AddMusic: function(arr) {
            _tempApi = false;
            var newArr = [], pcs = [];
            for (var i = 0, len = arr.length; i < len; i++) {
                var fileDom = arr[i];
                if (Number(fileDom.attr("file_mode")) == 4) {
                    var suffix = "";
                    var fileName = fileDom.find("[field='file_name']").attr("title");
                    if (fileName.lastIndexOf(".") != -1) {
                        suffix = fileName.substring(fileName.lastIndexOf("."), fileName.length).replace(".", "")
                    }
                    if (suffix.toLowerCase() == "mp3") {
                        newArr.push(fileDom);
                        pcs.push(fileDom.attr("pick_code"))
                    }
                }
            }
            if (newArr.length) {
                getUrl({ flag: 4, pick_code: pcs.join(",") }, function(r) {
                    if (r.state) {
                        var arr = makeMusic(newArr, r);
                        Core.MusicPlayer.Open(arr, true, false, undefined, false)
                    } else {
                        Core.MinMessage.Show({ text: r.message, type: "err", timeout: 2000 })
                    }
                })
            } else {
                Core.MinMessage.Show({ text: "音乐播放器只支持mp3文件播放", type: "war", timeout: 2000 })
            }
        },
        Run: function(fileDom) {
            _tempApi = false;
            var type = "";
            var suffix = "";
            var fileName = fileDom.find("[field='file_name']").attr("title");
            if (fileName.lastIndexOf(".") != -1) {
                suffix = fileName.substring(fileName.lastIndexOf("."), fileName.length).replace(".", "")
            }
            for (var k in window.UPLOAD_CONFIG) {
                var item = window.UPLOAD_CONFIG[k];
                if (typeof item.upload_type_limit == "object" && $.inArray(suffix.toLowerCase(), item.upload_type_limit) != -1) {
                    type = k;
                    break
                }
            }
            if (Number(type) == 4) {
                if (suffix.toLowerCase() != "mp3") {
                    former.warp();
                    action.error(fileDom);
                    return
                }
                if (!_cache.is_open) {
                    if (_cache.warp && _viewer.music && _viewer.music.IsBack()) {
                        getUrl({ flag: type, pick_code: fileDom.attr("pick_code") }, function(r) {
                            if (r.state) {
                                var arr = makeMusic([fileDom], r);
                                _viewer.music.Add(arr, true);
                                _viewer.music.MinFloat(fileDom)
                            } else {
                                Core.MinMessage.Show({ text: r.msg, type: "err", timeout: 2000 })
                            }
                        });
                        return
                    }
                }
            }
            former.warp();
            if (type) {
                former.scene(type, fileDom)
            } else {
                reszieBtn();
                action.error(fileDom);
                disBtn(false, "star");
                if (Number(fileDom.attr("area_id")) == 999) {
                    disBtn(true, "share")
                }
            }
        },
        Show: function(type, data, tempApi) {
            _tempApi = tempApi;
            _tempData = data;
            former.warp();
            if (_tempApi.is_q) {
                if (_tempApi.is_topic) {
                    _tempData.is_topic = true
                }
                former.scene_q(type, _tempData)
            } else {
                if (_tempData.pick_code) {
                    former.scene_pickcode(type, _tempData.pick_code)
                } else {
                    former.scene_url(type, data)
                }
            }
        },
        Close: function() { action.close() }
    }
})();