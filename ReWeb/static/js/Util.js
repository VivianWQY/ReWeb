String.format = function(str) {
    var args = arguments, re = new RegExp("%([1-" + args.length + "])", "g");
    return String(str).replace(re, function($1, $2) { return args[$2]; });
};
String.formatmodel = function(str, model) {
    for (var k in model) {
        var re = new RegExp("{" + k + "}", "g");
        str = str.replace(re, model[k]);
    }
    return str;
};
var Util = { };
Util.CONFIG = { SQBrdColor: "#072246", SQBgColor: "#6bb0c9", SQOpacity: 15, SQScrollStep: 6, TextBoxDefaultColor: "#BABABA", TextBoxActiveColor: "#000", test: 1 };
Util.CACHE = { };
Util.AddBookmark = function(title, url) {
    if (window.sidebar) {
        window.sidebar.addPanel(title, url, "");
    } else {
        if (document.all) {
            window.external.AddFavorite(url, title);
        } else {
            alert("您的浏览器不支持自动加入收藏夹，请使用浏览器菜单手动加入");
        }
    }
};
Util.SetHome = function(ele) {
    if (document.all) {
        ele.style.behavior = "url(#default#homepage)";
        ele.setHomePage(window.location.href);
    } else {
        alert("您的浏览器不支持自动设置主页，请使用浏览器菜单手动设置");
    }
};

function getClipboardData() { window.document.ff_clipboard_swf.SetVariable("str", Util.CACHE.CLIPBOARD_TEXT); }

function hideMenu() { Util.CACHE.CopyBox && Util.CACHE.CopyBox.hide(); }

Util.CopyMsg = function(result) {
    if (result) {
        alert("内容已复制至剪贴板!");
    } else {
        alert("复制失败! 您使用的浏览器不支持复制功能.");
    }
};
Util.Copy = function(pStr, hasReturn, isdo) {
    var result = false;
    if (window.clipboardData) {
        window.clipboardData.clearData();
        result = window.clipboardData.setData("Text", pStr);
    } else {
        if (top.window && !isdo) {
            top.window.Util.Copy(pStr, hasReturn, true);
            return;
        }
        Util.CACHE.CLIPBOARD_TEXT = pStr;
        if (!Util.CACHE.CopyBox) {
            Util.CACHE.CopyBox = $('<div id="ff_clipborad_swf_box" style="position:absolute;width:220px;padding:8px;-webkit-border-radius:5px;-moz-border-radius:5px;border-radius:5px;background:#CBCBCB;background:rgba(0, 0, 0, 0.2);overflow:hidden; z-index:99999999999;"><div style="padding:6px 10px 10px;background:#FFF;overflow:hidden;"><h3 style="height:30px;margin:0;padding:0;overflow:hidden;font-size:14px;"><span style="float:left;line-height:30px;">提示信息</span><a href="javascript:;" style="float:right;width:18px;height:18px;margin-top:5px;line-height:18px;text-align:center;overflow:hidden;font-size:12px;-webkit-border-radius:3px;-moz-border-radius:3px;border-radius:3px;color:#FFF;background:#A4A4A4;" onclick="$(\'#ff_clipborad_swf_box\').hide();">X</a></h3><div style="position:relative;height:40px;overflow:hidden;line-height:35px;text-align:center;text-decoration:underline;" id="js_ff_copy_box_con">点此复制到剪切板</div></div></div>');
            $(document.body).append(Util.CACHE.CopyBox);
        }
        if (document.getElementById("ff_clipboard_swf")) {
            $("#ff_clipboard_swf").empty().remove();
        }
        var html = [];
        html.push('<object type="application/x-shockwave-flash" data="/static/js/clipboard.swf" width="200" height="40" style="position:relative;top:-35px;" id="ff_clipboard_swf">');
        html.push('<param name="quality" value="high" />');
        html.push('<param name="allowScriptAccess" value="sameDomain" />');
        html.push('<param name="allowFullScreen" value="true" />');
        html.push('<param name="wmode" value="transparent" />');
        html.push("</object>");
        $("#js_ff_copy_box_con").append(html.join(""));
        Util.Layer.Center(Util.CACHE.CopyBox);
        Util.CACHE.CopyBox.show();
        return;
    }
    if (hasReturn) {
        return result;
    } else {
        Util.CopyMsg(result);
    }
};
Util.File = {
    ShowSize: function(bytes, fix) {
        bytes = parseInt(Number(bytes));
        var unit = new Array("B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB", "DB", "NB");
        var extension = unit[0];
        var max = unit.length;
        for (var i = 1; ((i < max) && (bytes >= 1024)); i++) {
            bytes = bytes / 1024;
            extension = unit[i];
        }
        return Number(bytes).toFixed((fix == undefined) ? 2 : fix) + extension;
    },
    GetInputFilePath: function(ele) {
        if (ele) {
            if (window.navigator.userAgent.indexOf("MSIE") >= 1) {
                ele.select();
                return document.selection.createRange().text;
            } else {
                if (window.navigator.userAgent.indexOf("Firefox") >= 1) {
                    if (ele.files) {
                        return ele.files.item(0).getAsDataURL();
                    }
                    return ele.value;
                }
            }
            return ele.value;
        }
    },
    FileNameCut: function(file_name) {
        var lL = file_name.lastIndexOf(".");
        var pey = file_name.substring(lL);
        var name = file_name.substring(0, lL);
        var flong = Util.Validate.mb_strlen(file_name);
        var plong = Util.Validate.mb_strlen(pey);
        if (flong > 451) {
            if (plong > 451) {
                pey = pey.substring(0, 400);
                if (Util.Validate.mb_strlen(name + pey) > 451) {
                    name = name.substring(0, 49);
                }
            } else {
                var lesslong = flong - plong;
                name = name.substring(0, lesslong - 1);
            }
        }
        return name + pey;
    }
};
Util.Text = {
    Cut: function(str, count) {
        if (str.length > count) {
            return str.substring(0, count / 2) + "..." + str.substring(str.length - (count / 2), str.length);
        }
        return str;
    },
    GetCount: function(str) {
        var len = str.length;
        var reLen = 0;
        for (var i = 0; i < len; i++) {
            if (/^[\u4e00-\u9fa5]{0,}$/.test(str.substring(i, i + 1))) {
                reLen += 2;
            } else {
                if (reLen == 0) {
                    reLen++;
                }
                reLen++;
            }
        }
        return reLen;
    },
    htmlspecialchars: function(string, quote_style, charset, double_encode) {
        var optTemp = 0, i = 0, noquotes = false;
        if (typeof quote_style === "undefined" || quote_style === null) {
            quote_style = 2;
        }
        string = string.toString();
        if (double_encode !== false) {
            string = string.replace(/&/g, "&amp;");
        }
        string = string.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        var OPTS = { ENT_NOQUOTES: 0, ENT_HTML_QUOTE_SINGLE: 1, ENT_HTML_QUOTE_DOUBLE: 2, ENT_COMPAT: 2, ENT_QUOTES: 3, ENT_IGNORE: 4 };
        if (quote_style === 0) {
            noquotes = true;
        }
        if (typeof quote_style !== "number") {
            quote_style = [].concat(quote_style);
            for (i = 0; i < quote_style.length; i++) {
                if (OPTS[quote_style[i]] === 0) {
                    noquotes = true;
                } else {
                    if (OPTS[quote_style[i]]) {
                        optTemp = optTemp | OPTS[quote_style[i]];
                    }
                }
            }
            quote_style = optTemp;
        }
        if (quote_style & OPTS.ENT_HTML_QUOTE_SINGLE) {
            string = string.replace(/'/g, "&#039;");
        }
        if (!noquotes) {
            string = string.replace(/"/g, "&quot;");
        }
        return string;
    }
};
Util.Date = {
    GetTimeText: function(num) {
        var arr = [3600, 60];
        var result = "";
        for (var i = 0, len = arr.length; i < len; i++) {
            var item = arr[i];
            if (num >= item) {
                var s = (num / item).toFixed(0);
                result += Util.Date._getDoubleText(s) + ":";
                num = num % item;
            } else {
                result += "00:";
            }
        }
        result += Util.Date._getDoubleText(num);
        return result;
    },
    GetIMText: function(h, m, s) {
        var txt = [];
        if (h < 10) {
            txt.push("0" + h);
        } else {
            txt.push(h);
        }
        if (m < 10) {
            txt.push("0" + m);
        } else {
            txt.push(m);
        }
        if (s < 10) {
            txt.push("0" + s);
        } else {
            txt.push(s);
        }
        return txt.join(":");
    },
    _getDoubleText: function(num) {
        if (num.toString().length > 1) {
            return num;
        } else {
            return "0" + num.toString();
        }
    }
};
Util.Cookie = {
    get: function(name) {
        var cookieValue = "";
        var search = name + "=";
        if (document.cookie.length > 0) {
            offset = document.cookie.indexOf(search);
            if (offset != -1) {
                offset += search.length;
                end = document.cookie.indexOf(";", offset);
                if (end == -1) {
                    end = document.cookie.length;
                }
                cookieValue = decodeURIComponent(document.cookie.substring(offset, end));
            }
        }
        return cookieValue;
    },
    set: function(name, value, hours) {
        var expire = "";
        if (hours != null) {
            if (hours == -1 || value == "") {
                expire = "; expires=-1";
            } else {
                expire = new Date((new Date()).getTime() + hours * 3600000);
                expire = "; expires=" + expire.toUTCString();
            }
        }
        document.cookie = name + "=" + encodeURIComponent(value) + expire + "; path=/";
    }
};
Util.TextBox = {
    BindDefaultText: function(ele, text) {
        if (!ele.value) {
            ele.value = text;
            ele.style.color = Util.CONFIG.TextBoxDefaultColor;
        } else {
            ele.style.color = Util.CONFIG.TextBoxActiveColor;
        }
        ele.onblur = function() {
            if (ele.value == "") {
                ele.value = text;
                ele.style.color = Util.CONFIG.TextBoxDefaultColor;
            } else {
                ele.style.color = Util.CONFIG.TextBoxActiveColor;
            }
        };
        ele.onfocus = function() {
            ele.style.color = Util.CONFIG.TextBoxActiveColor;
            if (ele.value == text) {
                ele.value = "";
            }
        };
        ele.GetValue = function() {
            if (ele.value == text) {
                return "";
            }
            return ele.value;
        };
        ele.Clear = function() {
            ele.value = "";
            ele.onblur();
        };
        return ele;
    },
    BindSearch: function(input, label, clean) {
        var timer;
        var _state = false;
        var checkVal = function() {
            if (_state) {
                return;
            }
            if (input.val() == "") {
                label && label.is(":hidden") && label.show();
                clean && !clean.is(":hidden") && clean.hide();
            } else {
                label && !label.is(":hidden") && label.hide();
                clean && clean.is(":hidden") && clean.show();
            }
        };
        var listen = function() {
            if (timer) {
                window.clearTimeout(timer);
            }
            timer = window.setTimeout(function() {
                checkVal();
                listen();
            }, 80);
        };
        checkVal();
        listen();
        return {
            Disabled: function() {
                _state = true;
                label.hide();
            },
            Enabled: function() {
                _state = false;
                checkVal();
            }
        };
    },
    FocusEnd: function(ele) {
        window.setTimeout(function() {
            if ($.browser.msie) {
                var pn = ele.value.length;
                var rng = ele.createTextRange();
                rng.moveStart("character", pn);
                rng.collapse(true);
                rng.select();
            } else {
                ele.setSelectionRange(ele.value.length, ele.value.length);
                ele.focus();
            }
        }, 10);
    },
    InsertAtCaret: function(textarea, myValue) {
        var $t = $(textarea)[0];
        if (document.selection) {
            textarea.focus();
            var sel = document.selection.createRange();
            sel.text = myValue;
            textarea.focus();
        } else {
            if ($t.selectionStart || $t.selectionStart == "0") {
                var startPos = $t.selectionStart;
                var endPos = $t.selectionEnd;
                var scrollTop = $t.scrollTop;
                $t.value = $t.value.substring(0, startPos) + myValue + $t.value.substring(endPos, $t.value.length);
                textarea.focus();
                $t.selectionStart = startPos + myValue.length;
                $t.selectionEnd = startPos + myValue.length;
                $t.scrollTop = scrollTop;
            } else {
                textarea.value += myValue;
                textarea.focus();
            }
        }
    }
};
Util.DropDown = (function() {
    var _timeout = 200, _hide_status = "hide_status";
    return {
        Bind: function(st) {
            st.Title.bind("click", { setting: st }, function(e) {
                var setting = e.data.setting;
                if (setting.overtimer) {
                    window.clearTimeout(setting.overtimer);
                }
                setting.Title.attr(_hide_status, "0");
                setting.Content.show();
                if (setting.ShowHandler) {
                    setting.ShowHandler();
                }
            }).bind("mouseover", { setting: st }, function(e) {
                var setting = e.data.setting;
                if (setting.overtimer) {
                    window.clearTimeout(setting.overtimer);
                }
                if (setting.IsOverShow) {
                    setting.overtimer = window.setTimeout(function() {
                        setting.Title.attr(_hide_status, "0");
                        setting.Content.show();
                        if (setting.ShowHandler) {
                            setting.ShowHandler();
                        }
                    }, st.Timeout || _timeout);
                }
                if (setting.Title.attr(_hide_status) == "1") {
                    setting.Title.attr(_hide_status, "0");
                }
            }).bind("mouseleave", { setting: st }, function(e) {
                var setting = e.data.setting;
                if (setting.timer) {
                    window.clearTimeout(setting.timer);
                }
                if (setting.overtimer) {
                    window.clearTimeout(setting.overtimer);
                }
                if (setting.Title.attr(_hide_status) == "0") {
                    setting.Title.attr(_hide_status, "1");
                    setting.timer = window.setTimeout(function() {
                        if (setting.Title.attr(_hide_status) == "1") {
                            if (setting.HideHandler) {
                                setting.HideHandler();
                            }
                            setting.Content.hide();
                        }
                        window.clearTimeout(setting.timer);
                        delete setting.timer;
                    }, st.Timeout || _timeout);
                }
            });
            st.Content.bind("mouseover", { setting: st }, function(e) {
                var setting = e.data.setting;
                if (setting.Title.attr(_hide_status) == "1") {
                    setting.Title.attr(_hide_status, "0");
                }
            }).bind("mouseleave", { setting: st }, function(e) {
                if ($.browser.msie) {
                    event.cancelBubble = true;
                } else {
                    e.stopPropagation();
                    e.preventDefault();
                }
                var setting = e.data.setting;
                if (setting.timer) {
                    window.clearTimeout(setting.timer);
                }
                if (setting.overtimer) {
                    window.clearTimeout(setting.overtimer);
                }
                setting.Title.attr(_hide_status, "1");
                setting.timer = window.setTimeout(function() {
                    if (setting.Title.attr(_hide_status) == "1") {
                        if (setting.HideHandler) {
                            setting.HideHandler();
                        }
                        setting.Content.hide();
                    }
                    window.clearTimeout(setting.timer);
                    delete setting.timer;
                }, st.Timeout || _timeout);
            }).hide();
        }
    };
})();
Util.Load = {
    _download: function(type, code, complete, isremove) {
        $(code).bind("load", function() {
            isremove && $(code).remove();
            if (complete) {
                complete();
            }
        });
        if (type != "css") {
            code.onreadystatechange = (function() {
                if (code.readyState == "complete" || code.readyState == "loaded") {
                    isremove && $(code).remove();
                    if (complete) {
                        complete();
                    }
                }
            });
        }
        document.body.appendChild(code);
    },
    JS: function(url, complete, isremove) {
        if (isremove == undefined) {
            isremove = true;
        }
        var code = document.createElement("script");
        code.src = url;
        Util.Load._download("script", code, complete, isremove);
    },
    Css: function(url, complete) {
        var code = document.createElement("link");
        code.href = url;
        code.rel = "stylesheet";
        code.type = "text/css";
        Util.Load._download("css", code, complete);
        return;
    }
};
Util.Validate = {
    Url: function(pUrl) {
        var str_url = pUrl;
        var regular = /^(http|https|ftp):\/\/[^\/]*\/.*/i;
        if (regular.test(str_url)) {
            return true;
        } else {
            return false;
        }
    },
    mb_strlen: function(str) {
        var offset = 0;
        for (var i = 0; i < str.length; i++) {
            var string = str.substr(i, 1);
            if (escape(string).substr(0, 2) == "%u") {
                offset += 3;
            } else {
                offset += 1;
            }
        }
        return offset;
    },
    FileName: function(file_name) {
        if (file_name.length < 1) {
            alert("文件名不能少于1个字符！");
            return false;
        }
        var regular = /^[^\\/:*?<>\s\"\']{1,}$/;
        if (!regular.test(file_name)) {
            alert('文件名不能包含下列任意字符之一\n / :. * ?" < > |');
            return false;
        }
        return true;
    },
    Desc: function(description) {
        if (description.length > 11500) {
            alert("描述字符长度不能超过11500字节");
            return false;
        }
        return true;
    },
    CategoryName: function(category_name) {
        category_name = category_name.replace(" ", "");
        if (category_name.length < 1) {
            return "目录名称不能为空。";
        }
        if (category_name.length > 50) {
            return "目录名称不能超过50个字。";
        }
        var regular = /^[^\\/:*?<>\|\\\\\"]*$/;
        if (!regular.test(category_name)) {
            return '目录名称不能包含下列任意字符之一\n \\ / : * ? "  < > |';
        }
        return true;
    },
    Email: function(email) {
        var regular = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/;
        if (!regular.test(email)) {
            return false;
        } else {
            return true;
        }
    }
};
Util.TabManager = function(pList, pActiveStyle, pDisableStyle) {
    var _self = this;
    var _obj = { List: pList, ActiveStyle: pActiveStyle, DisableStyle: pDisableStyle };
    var _ChangeHandler;
    var time;
    var _autoTimer;
    this._autoTimeOut = 3000;
    this.Animate = false;
    var overObj;
    var activeIndex;
    var _autostate = false;

    function display() {
        for (var j = 0; j < _obj.List.length; j++) {
            var ele = _obj.List[j].Tab;
            ele.removeClass(_obj.ActiveStyle);
            ele.addClass(_obj.DisableStyle);
            _obj.List[j].Content.hide();
        }
        overObj.Tab.addClass(_obj.ActiveStyle);
        if (_self.Animate) {
            overObj.Content.fadeIn();
        } else {
            overObj.Content.show();
        }
        if (_ChangeHandler) {
            _ChangeHandler(overObj);
        }
    }

    function autoDisplay() {
        activeIndex++;
        if (activeIndex >= _obj.List.length) {
            activeIndex = 0;
        }
        overObj = _obj.List[activeIndex];
        display();
    }

    var init = function() {
        for (var i = 0; i < _obj.List.length; i++) {
            var item = _obj.List[i];
            item.Tab.bind("mouseover", { obj: item, index: i }, function(e) {
                overObj = e.data.obj;
                activeIndex = e.data.index;
                time = window.setTimeout(display, 300);
                _self.SetAuto(_autostate);
            }).bind("click", { obj: item, index: i }, function(e) {
                overObj = e.data.obj;
                activeIndex = e.data.index;
                if (time) {
                    window.clearTimeout(time);
                }
                display();
                this.blur();
                _self.SetAuto(_autostate);
            }).bind("mouseout", function() {
                if (time) {
                    window.clearTimeout(time);
                }
            });
        }
    };
    this.RemoveMouseOver = function() {
        for (var i = 0; i < _obj.List.length; i++) {
            var item = _obj.List[i];
            item.Tab.unbind("mouseover");
        }
    };
    this.Stop = function() {
        if (_autoTimer) {
            window.clearInterval(_autoTimer);
        }
    };
    this.Start = function() { _self.SetAuto(_autostate); };
    this.SetAuto = function(v) {
        if (_autoTimer) {
            window.clearInterval(_autoTimer);
        }
        if (v) {
            _autoTimer = window.setInterval(autoDisplay, _self._autoTimeOut);
        }
        _autostate = v;
    };
    this.SetChangeHandler = function(pHandler) { _ChangeHandler = pHandler; }, this.Select = function(key) {
        activeIndex = key;
        overObj = _obj.List[key];
        display();
    };
    init();
};
Util.ChatEditBox = {
    lastRange: null,
    lastBookmark: null,
    Newline: function(isnotadd) {
        if ($.browser.msie) {
            var i = document.selection.createRange();
            !isnotadd || i.pasteHTML("<br />");
            i.collapse(false);
            i.select();
        } else {
            if ($.browser.webkit) {
                var k = window.getSelection();
                var i = k.getRangeAt(0);
                var j = i.createContextualFragment("<br/>&nbsp;");
                var l = j.lastChild;
                i.insertNode(j);
                i.setEndAfter(l);
                i.setStartAfter(l);
                k = window.getSelection();
                k.removeAllRanges();
                k.addRange(i);
                var m = l.previousSibling;
                document.execCommand("Delete", false, null);
                m.scrollIntoView();
            } else {
                if ($.browser.opera) {
                } else {
                    if ($.browser.mozilla) {
                        var i = window.getSelection().getRangeAt(0);
                        var j = i.createContextualFragment("<br>");
                        var l = j.lastChild;
                        i.insertNode(j);
                        i.setEndAfter(l);
                        i.setStartAfter(l);
                        var k = window.getSelection();
                        k.removeAllRanges();
                        k.addRange(i);
                    } else {
                    }
                }
            }
        }
    },
    clear: function(edit) {
        if ($.browser.msie) {
            edit.innerHTML = "";
        } else {
            if ($.browser.webkit) {
                var j = window.getSelection();
                var i = j.getRangeAt(0);
                edit.innerHTML = "<br/>";
                var j = getSelection();
                j.removeAllRanges();
                j.addRange(i);
            } else {
                edit.innerHTML = "<br/>";
            }
        }
        this.lastBookmark = null;
        this.lastRange = null;
        this.Focus(edit, true);
    },
    getSelection: function() { return (document.selection) ? document.selection : window.getSelection(); },
    getRange: function() {
        var k = this.getSelection();
        if (!k) {
            return null;
        }
        try {
            var i = k.createRange ? k.createRange() : k.getRangeAt(0);
            var l = null;
            var j = this.editArea;
            if (i.commonAncestorContainer) {
                l = i.commonAncestorContainer;
            } else {
                if (i.parentElement) {
                    l = i.parentElement();
                }
            }
            if (l && (l == j || l.parentNode == j || l.parentNode.parentNode == j)) {
                return i;
            } else {
                return null;
            }
        } catch(m) {
            return null;
        }
    },
    simpleSaveRange: function() {
        try {
            var i = this.getSelection();
            this.lastRange = i.createRange ? i.createRange() : i.getRangeAt(0);
            if (this.lastRange.getBookmark) {
                this.lastBookmark = this.lastRange.getBookmark();
            }
        } catch(e) {
        }
    },
    saveRange: function() {
        var i = this.getRange();
        if (!i) {
            return;
        }
        this.lastRange = i;
    },
    ClearHtml: function(i) {
        var j = false;
        var k = i.replace(/<!-{2,}[\s\S]*?-{2,}>/g, "");
        k = k.replace(/<([^>]+).*?>/ig, function(n, m) {
            var l = m.split(" ")[0].toLowerCase();
            switch (l) {
            case "/p":
                return "<br>";
            case "br":
                if (j) {
                    j = false;
                    return "";
                }
                return n;
            case "img":
                j = true;
                if (n.toLowerCase().indexOf("mark") > 0) {
                    return n;
                } else {
                    return "";
                }
            default:
                return "";
            }
        });
        k = k.replace(/\n/g, "");
        return k;
    },
    Focus: function(edit, k) {
        if (!k && !!this.getRange()) {
            return;
        }
        edit.focus();
        if (this.lastRange && !$.browser.msie) {
            var j = window.getSelection();
            j.removeAllRanges();
            j.addRange(this.lastRange);
        }
        if ($.browser.opera) {
            edit.focus();
        }
        if (this.lastBookmark) {
            var i = document.selection.createRange();
            i.moveToBookmark(this.lastBookmark);
            i.collapse(false);
            i.select();
            this.lastBookmark = null;
        }
    },
    InsertHtml: function(o, l, k) {
        var q = { editArea: o };
        if (document.all) {
            var m = this.getRange();
            if (this.lastRange) {
                m = this.lastRange;
            }
            if (m) {
                m.collapse(false);
                m.select();
                m.pasteHTML(l);
                m.select();
            } else {
                o.innerHTML += l;
                var i = o.lastChild;
            }
            var i = o.lastChild;
            if (k) {
                while (i && i.nodeName.toLowerCase() == "br") {
                    var j = i;
                    i = i.previousSibling;
                    o.removeChild(j);
                }
            }
        } else {
            if (window.getSelection) {
                var m = this.getRange();
                if (this.lastRange) {
                    m = this.lastRange;
                }
                if (!m) {
                    o.innerHTML += l;
                    var i = o.lastChild;
                } else {
                    m.collapse(false);
                    var n = m.createContextualFragment(l);
                    var i = n.lastChild;
                    if (k) {
                        while (i && i.nodeName.toLowerCase() == "br" && i.previousSibling && i.previousSibling.nodeName.toLowerCase() == "br") {
                            var j = i;
                            i = i.previousSibling;
                            n.removeChild(j);
                        }
                    }
                    m.insertNode(n);
                    if (i) {
                        m.setEndAfter(i);
                        m.setStartAfter(i);
                    }
                    var p = getSelection();
                    p.removeAllRanges();
                    p.addRange(m);
                }
            }
        }
        setTimeout(function() {
            q.editArea.scrollTop = q.editArea.scrollHeight;
            q.editArea.scrollLeft = q.editArea.scrollWidth;
        }, 200);
    }
};
Util.Url = {
    ReplaceQueryVar: function(skey, svalue) {
        var href = location.href;
        if (location.hash) {
            href = href.replace(location.hash, "");
        }
        var urls = href.split("?");
        var kws = urls[1].split("&");
        var kw = newurl = "";
        var ischange = 0;
        for (i = 0; i < kws.length; i++) {
            kw = $.trim(kws[i]);
            if (kw == "") {
                continue;
            } else {
                kwss = kws[i].split("=");
                if (kwss.length < 2) {
                    continue;
                }
                if (kwss[0] == skey) {
                    if (kwss[1] != svalue) {
                        kwss[1] = svalue;
                        ischange = 2;
                    } else {
                        ischange = 1;
                    }
                }
                if (kwss[1] != "") {
                    newurl += (newurl == "" ? kwss[0] + "=" + kwss[1] : "&" + kwss[0] + "=" + kwss[1]);
                }
            }
        }
        if (ischange == 0) {
            newurl += "&" + skey + "=" + svalue;
        }
        var url;
        if (ischange != 1) {
            url = urls[0] + "?" + newurl;
        } else {
            url = location.href;
        }
        window.location.href = url;
    }
};
Util.Log = (function() {
    var _cache = { };
    return {
        write: function(msg) {
            if (!_cache.box) {
                _cache.box = $("<div style='position:absolute;top:0;left:0;background:#fff;'></div>");
                $(document.body).append(_cache.box);
            }
            _cache.box.html(msg);
        }
    };
})();
Util.Mouse = (function() {
    var cache = { move: { x: 0, y: 0, eX: 0, eY: 0 }, line: { x: 0, y: 0, eX: 0, eY: 0 }, sq: { t: 0, l: 0, x: 0, y: 0, w: 0, h: 0, st: 0 } }, Return = { };
    var getLayOutBox = function() {
        if (!cache.LayOutBox) {
            cache.LayOutBox = $('<div style="z-index: 1000000003; display: none;background: none repeat scroll 0 0 black;height: 100%;left: 0;position: absolute;top: 0;width: 100%;filter:alpha(opacity=0);-moz-opacity:0;opacity:0;"><div style="height:100%;width:100%;"></div></div>');
            $(document.body).append(cache.LayOutBox);
        }
        return cache.LayOutBox;
    };
    Return.GetLayOutBox = getLayOutBox;
    var moveBoxFun = function(e) {
        if (cache.move.state) {
            cache.move.eX = e.screenX;
            cache.move.eY = e.screenY;
            var lessX = cache.move.eX - cache.move.x;
            var lessY = cache.move.eY - cache.move.y;
            if (cache.move.box) {
                var t = cache.move.sT + lessY;
                var l = cache.move.sL + lessX;
                if (t > cache.move.maxT) {
                    if (cache.move.maxT !== false) {
                        t = cache.move.maxT;
                    }
                } else {
                    if (t < cache.move.minT) {
                        if (cache.move.minT !== false) {
                            t = cache.move.minT;
                        }
                    }
                }
                if (l > cache.move.maxL) {
                    if (cache.move.maxL !== false) {
                        l = cache.move.maxL;
                    }
                } else {
                    if (l < cache.move.minL) {
                        if (cache.move.minL !== false) {
                            l = cache.move.minL;
                        }
                    }
                }
                cache.move.box.css({ left: l + "px", top: t + "px" });
            }
            if (e.data.move_callback) {
                e.data.move_callback();
            }
            return false;
        }
    };
    Return.MoveBox = function(obj) {
        var outer = obj.Outer;
        var box = obj.Box;
        obj.ClickBox.attr("ws_property", "1");
        obj.ClickBox.bind("mousedown", { box: box, outer: outer, callback: obj.Callback, move_callback: obj.MoveCallback }, function(e) {
            if ($(this).attr("stop_move")) {
                return;
            }
            cache.MoveLayOut = getLayOutBox();
            cache.MoveLayOut.css({ cursor: "default" });
            var lay = ($.browser.msie) ? cache.MoveLayOut : $(window);
            lay.unbind("mousemove").bind("mousemove", { move_callback: e.data.move_callback }, function(e) {
                if (cache.move.state) {
                    cache.MoveLayOut.show();
                }
                moveBoxFun(e);
                return false;
            });
            lay.unbind("mouseup").bind("mouseup", function(e) {
                if (cache.move.state) {
                    cache.move.state = false;
                    cache.MoveLayOut.hide();
                    cache.MoveLayOut.css({ cursor: "default" });
                    if ($.browser.msie) {
                        cache.MoveLayOut[0].releaseCapture();
                    }
                }
            });
            if ($.browser.msie) {
                cache.MoveLayOut[0].setCapture();
            }
            cache.move.state = true;
            cache.move.box = e.data.box;
            cache.move.outer = e.data.outer;
            cache.move.x = e.screenX;
            cache.move.y = e.screenY;
            cache.move.eX = e.screenX;
            cache.move.eY = e.screenY;
            cache.move.sT = cache.move.box.offset().top;
            cache.move.sL = cache.move.box.offset().left;
            if (cache.move.outer) {
                var oh = cache.move.outer.height(), ow = cache.move.outer.width(), bh = cache.move.box.height(), bw = cache.move.box.width();
                cache.move.minT = cache.move.outer.offset().top;
                cache.move.maxT = cache.move.outer.offset().top + cache.move.outer.height() - cache.move.box.height();
                cache.move.minL = cache.move.outer.offset().left;
                cache.move.maxL = cache.move.outer.offset().left + cache.move.outer.width() - cache.move.box.width();
            } else {
                cache.move.minT = false;
                cache.move.maxT = false;
                cache.move.minL = false;
                cache.move.maxL = false;
            }
            if (e.data.callback) {
                e.data.callback();
            }
            return false;
        });
        return { Disable: function() { obj.ClickBox.attr("stop_move", "1"); }, Enable: function() { obj.ClickBox.removeAttr("stop_move"); } };
    };
    Return.MoveLine = function(line, type, callback, mousedown) {
        line.css({ cursor: type });
        line.bind("mousedown", { type: type, callback: callback, down: mousedown }, function(e) {
            cache.MoveLayOut = getLayOutBox();
            cache.MoveLayOut.css({ cursor: e.data.type });
            var lay = ($.browser.msie) ? cache.MoveLayOut : $(window);
            lay.unbind("mousemove").bind("mousemove", { callback: e.data.callback }, function(e) {
                if (cache.line.state) {
                    cache.line.eX = e.screenX;
                    cache.line.eY = e.screenY;
                    if (e.data.callback) {
                        e.data.callback(cache.line);
                    }
                    return true;
                }
            }).unbind("mouseup").bind("mouseup", function(e) {
                if (cache.line.state) {
                    cache.line.state = false;
                    cache.MoveLayOut.hide();
                    if ($.browser.msie) {
                        cache.MoveLayOut[0].releaseCapture();
                    }
                    cache.MoveLayOut.css({ cursor: "default" });
                    return false;
                }
            });
            cache.MoveLayOut.show();
            if ($.browser.msie) {
                cache.MoveLayOut[0].setCapture();
            }
            cache.line.state = true;
            cache.line.x = e.screenX;
            cache.line.eX = e.screenX;
            cache.line.y = e.screenY;
            cache.line.eY = e.screenY;
            if (e.data.down) {
                e.data.down();
            }
            return false;
        });
    };
    var sqEvent = {
        move: function(e) {
            if (cache.sq.movestate) {
                var eX = e.screenX, eY = e.screenY;
                var lessX = eX - cache.sq.sX, lessY = eY - cache.sq.sY;
                var w = Math.abs(lessX);
                var h = Math.abs(lessY);
                var t = lessY ? cache.sq.sT : cache.sq.sT + lessY, l = lessX ? cache.sq.sL : cache.sq.sL + lessX;
                var oH = cache.sq.outer.height() - 2;
                var oW = cache.sq.dom.width() - 2;
                var scrollTop = cache.sq.outer.scrollTop();
                var scrollLeft = cache.sq.outer.scrollLeft();
                if (lessY < 0) {
                    t = t - h;
                }
                if (lessX < 0) {
                    l = l - w;
                }
                if (t < 0) {
                    h += t;
                    t = 0;
                } else {
                    if (t > 0 && (t - scrollTop + h) > oH) {
                        h = oH - t + scrollTop;
                    }
                }
                if (l < 0) {
                    w += l;
                    l = 0;
                } else {
                    if (l > 0 && (l - scrollLeft + w) > oW) {
                        w = oW - l + scrollLeft;
                    }
                }
                cache.sq.box.height(h).css({ width: w + "px", left: l + "px", top: t + "px" });
                if (cache.events.mousemove) {
                    var l = cache.sq.box.offset().left, t = cache.sq.box.offset().top, w = cache.sq.box.width(), h = cache.sq.box.height();
                    cache.events.mousemove(l, t, l + w, t + h, e.ctrlKey, e);
                }
                if (cache.sq.box.css("display") == "none") {
                    cache.sq.box.show();
                }
                return true;
            }
        },
        up: function(e) {
            if (cache.sq.movestate) {
                cache.sq.box.show();
                if (cache.events.mouseup) {
                    var l = cache.sq.box.offset().left, t = cache.sq.box.offset().top, w = cache.sq.box.width(), h = cache.sq.box.height();
                    cache.events.mouseup(l, t, l + w, t + h, e.ctrlKey, e);
                }
                cache.sq.box.hide();
                cache.sq.movestate = false;
                cache.sq.x = cache.sq.y = cache.sq.w = cache.sq.h = cache.sq.t = cache.sq.l = cache.sq.st = 0;
                return true;
            }
        }
    };
    Return.Square = function(dom, outer, events) {
        dom.bind("mousedown", { outer: outer }, function(e) {
            if ($(e.target).attr("menu")) {
                return true;
            }
            var box = $(this);
            var lay = ($.browser.msie) ? $(document) : $(window);
            lay.unbind("mousemove").bind("mousemove", sqEvent.move).unbind("mouseup").bind("mouseup", sqEvent.up);
            if (!cache.sq.box) {
                cache.sq.box = $('<div style="position:absolute; top:0; left:0; border:1px solid ' + Util.CONFIG.SQBrdColor + "; background:" + Util.CONFIG.SQBgColor + "; filter:Alpha(Opacity=" + Util.CONFIG.SQOpacity + "); opacity:0." + Util.CONFIG.SQOpacity + '; overflow:hidden; display:none; z-index:99999;"></div>');
                box.parent().append(cache.sq.box);
            }
            cache.sq.movestate = true;
            cache.sq.outer = e.data.outer;
            var scrollTop = cache.sq.outer.scrollTop();
            var scrollLeft = cache.sq.outer.scrollLeft();
            cache.sq.sX = e.screenX;
            cache.sq.sY = e.screenY;
            cache.sq.w = 0;
            cache.sq.h = 0;
            cache.sq.sT = e.clientY - cache.sq.outer.offset().top + scrollTop;
            cache.sq.sL = e.clientX - cache.sq.outer.offset().left + scrollLeft;
            cache.sq.dom = box;
            cache.events = !events ? { } : events;
            var defaultLen = (!$.browser.msie) ? 0 : 1;
            if (box.css("position") == "absolute" || box.css("position") == "relative") {
                cache.sq.box.width(defaultLen).height(defaultLen).css({ top: cache.sq.sT + "px", left: cache.sq.sL + "px" });
            } else {
                cache.sq.box.width(defaultLen).height(defaultLen).css({ top: (cache.sq.sT - scrollTop) + "px", left: cache.sq.sL + "px" });
            }
            cache.sq.box.show();
            if (cache.events.mousedown) {
                var l = cache.sq.box.offset().left, t = cache.sq.box.offset().top, w = cache.sq.box.width(), h = cache.sq.box.height();
                cache.events.mousedown(l, t, l + w, t + h, e.ctrlKey, e);
            }
            cache.sq.box.hide();
            return true;
        });
        try {
            if (parent) {
                $(parent.document).bind("mousemove", sqEvent.move).bind("mouseup", sqEvent.up);
            }
        } catch(e) {
        }
        return {
            Disable: function() {
                if (cache.sq.movestate) {
                    cache.sq.movestate = false;
                    cache.sq.box.hide();
                    cache.sq.x = cache.sq.y = cache.sq.w = cache.sq.h = cache.sq.t = cache.sq.l = cache.sq.st = 0;
                    if ($.browser.msie) {
                        cache.MoveLayOut[0].releaseCapture();
                    }
                    cache.MoveLayOut.hide();
                    return false;
                }
            }
        };
    };
    return Return;
})();
Util.Layer = (function() {
    var _cache = { }, Return = { };
    Return.Min = function(box, mBox, callback) {
        if (!_cache.MinBorder) {
            _cache.Minborder = $('<div style="z-index:10000000;background: none repeat scroll 0 0 #fff;filter:alpha(opacity=30);-moz-opacity:0.3;opacity:0.3;border:1px soild #ccc;position:absolute;top:0;left0;display:none;"></div>');
            $(document.body).append(_cache.Minborder);
        }
        var w = box.width(), h = box.height(), t = box.offset().top, l = box.offset().left, eT = mBox.offset().top, eL = mBox.offset().left, eW = mBox.width(), eH = mBox.height();
        _cache.Minborder.width(w).height(h).css({ left: l, top: t }).show();
        _cache.Minborder.animate({ width: eW, height: eH, top: eT, left: eL }, 300, function() { _cache.Minborder.hide(); });
        if (callback) {
            callback();
        }
    };
    Return.Center = function(box, setting) {
        var mainBox;
        var cut = 0, t = 0, l = 0;
        if (setting) {
            if (setting.Main) {
                mainBox = setting.Main;
                t = mainBox.offset().top;
                l = mainBox.offset().left;
            } else {
                mainBox = $(window);
            }
            if (setting.Cut != undefined) {
                cut = setting.Cut;
            }
        } else {
            mainBox = $(window);
        }
        var cssT = (mainBox.height() - box.height()) / 3 + cut + t;
        var cssL = (mainBox.width() - box.width()) / 2 + cut + l;
        if (cssT < 0) {
            cssT = 0;
        }
        if (cssL < 0) {
            cssL = 0;
        }
        var st = mainBox.scrollTop();
        if (st) {
            cssT += st;
        }
        box.css({ top: cssT, left: cssL });
    };
    return Return;
})();
Util.Html = {
    StopPropagation: function(e) {
        if ($.browser.msie) {
            event.cancelBubble = true;
        } else {
            e.stopPropagation();
            e.preventDefault();
        }
    }
};
Util.Style = {
    IncludeCss: function(id, url) {
        if (!document.getElementById(id)) {
            var link = document.createElement("link");
            link.id = id;
            link.rel = "stylesheet";
            link.type = "text/css";
            link.href = url;
            document.getElementsByTagName("head")[0].appendChild(link);
        }
    },
    RemoveCss: function(id) {
        var linkBox = $("#" + id);
        linkBox.remove();
    }
};
Util.Override = function(b, n, o) {
    var _super = { };
    var _params = [];
    var _arg = arguments;
    if (_arg.length > 3) {
        for (var i = 3, len = _arg.length; i < len; i++) {
            _params.push(_arg[i]);
        }
    }
    b.apply(n, _params);
    for (var k in n) {
        _super[k] = n[k];
    }
    for (var k in o) {
        n[k] = o[k];
    }
    return _super;
};
Util.Image = {
    Rotate: function(img, num) {
        if (num == undefined) {
            num = 0;
        }
        var deg = num * 90;
        if ($.browser.msie) {
            if (num > 3) {
                num = 0;
            }
        }
        img.css({ "-webkit-transform": "rotate(" + deg + "deg)", "-moz-transform": "rotate(" + deg + "deg)", "-o-transform": "rotate(" + deg + "deg)", filter: "progid:DXImageTransform.Microsoft.BasicImage(Rotation=" + num + ")" });
        return num;
    }
};
(function() {
    if (navigator.platform.toString().toLowerCase() != "ipad") {
        var styleTxt = [];
        styleTxt.push("position:absolute;");
        styleTxt.push("height:30px;");
        styleTxt.push("max-width:300px;");
        styleTxt.push("padding:5px 10px 0;");
        styleTxt.push("line-height:30px;");
        styleTxt.push("white-space:nowrap;");
        styleTxt.push("overflow:hidden;");
        styleTxt.push("text-overflow:ellipsis;");
        styleTxt.push("color:#FFF;");
        styleTxt.push("border-radius:20px 20px 3px 3px / 8px 8px 3px 3px;");
        styleTxt.push("background:url(http://115.com/static/style_v61/images/popup_title.png) repeat-x center top;");
        styleTxt.push("_background-image:url(http://115.com/static/style_v61/images/popup_title.gif);");
        $(document).ready(function() {
            var _popTitle, _popTitleTimer, _popTitleHideTime;
            var showTitleFun = function(el) {
                if (_popTitleTimer) {
                    window.clearTimeout(_popTitleTimer);
                }
                if (_popTitleHideTime) {
                    window.clearTimeout(_popTitleHideTime);
                }
                if (!_popTitle) {
                    _popTitle = $('<div style="' + styleTxt.join("") + 'display:none;z-index:999999999999;"></div>');
                    $(document.body).append(_popTitle);
                }
                var oldHtml = _popTitle.html(), html;
                _popTitle.html(html = el.attr("data_title"));
                if (oldHtml != html) {
                    _popTitle.hide();
                }
                _popTitleTimer = window.setTimeout(function() {
                    var w = _popTitle.show().outerWidth(), ew = el.outerWidth(), ww = $(window).width();
                    var l = el.offset().left + (ew / 2) - (w / 2), t = el.offset().top + el.height() + 3;
                    if (l + w > ww) {
                        l = ww - w;
                    }
                    if (l < 0) {
                        l = 0;
                    }
                    _popTitle.offset({ left: l, top: t }).show();
                }, 100);
            };
            $(document).on({
                mouseenter: function() { showTitleFun($(this)); },
                mouseleave: function() {
                    if (_popTitleTimer) {
                        window.clearTimeout(_popTitleTimer);
                    }
                    if (_popTitleHideTime) {
                        window.clearTimeout(_popTitleHideTime);
                    }
                    _popTitleHideTime = window.setTimeout(function() {
                        if (_popTitle) {
                            _popTitle.hide();
                        }
                    }, 100);
                }
            }, "[data_title]");
            $(document).on("mousemove", function(e) {
                var el = $(e.target);
                if (!$(e.target).attr("data_title") && !$(e.target).parents("[data_title]").length && _popTitle) {
                    !_popTitle.is(":hidden") && _popTitle.hide();
                }
            });
        });
    }
})();
(function() {
    var doc, defaultTitle, timer, title, timer2, ctitle, speed = 300;

    function titleScroll() {
        if (ctitle.length < title.length) {
            ctitle += " - " + title;
        }
        ctitle = ctitle.substring(1, ctitle.length);
        doc.title = ctitle.substring(0, title.length);
        timer = setTimeout(titleScroll, speed);
    }

    Util.title = {
        init: function(defTitle) {
            try {
                doc = window.top.document;
                defaultTitle = defTitle || doc.title;
            } catch(e) {
                doc = document;
                defaultTitle = defTitle || doc.title;
            }
        },
        start: function(tit, sp) {
            if (tit == title) {
                return;
            }
            title = tit;
            ctitle = "";
            speed = sp || speed;
            clearTimeout(timer);
            clearTimeout(timer2);
            titleScroll();
        },
        stop: function(tit) {
            clearTimeout(timer);
            title = "";
            timer2 = setTimeout(function() { doc.title = tit || defaultTitle; }, 1500);
        }
    };
}());
(function() {
    var focusTimer;
    $(document).on("mouseover", function(e) {
        var el = e.target;
        var tagName = el.tagName.toUpperCase();
        if ((tagName == "INPUT" && (el.type == "text" || el.type == "password")) || tagName == "TEXTAREA") {
            if (focusTimer) {
                window.clearTimeout(focusTimer);
            }
            focusTimer = window.setTimeout(function() { el.focus(); }, 200);
        }
    }).on("mouseout", function(e) {
        var el = e.target;
        var tagName = el.tagName.toUpperCase();
        if ((tagName == "INPUT" && (el.type == "text" || el.type == "password")) || tagName == "TEXTAREA") {
            if (focusTimer) {
                window.clearTimeout(focusTimer);
            }
        }
    });
})();
(function() { Util.log = function(obj) { window.console && console.log(obj); }; })();
(function() {
    if (window.localStorage) {
        var storage = (function() {
            var _userId = "", _hour_key = "api_h5_hour_key", _divide = ":";
            var saveHour = function(key, hour) {
                var val = localStorage.getItem(_hour_key);
                if (!val) {
                    val = _divide;
                    localStorage.setItem(_hour_key, val);
                }
                var reg = new RegExp(_divide + key + "=.*?" + _divide);
                if (reg.test(val)) {
                    val = val.replace(reg, function() { return key + "=" + hour + _divide; });
                } else {
                    val += key + "=" + hour + _divide;
                }
                localStorage.setItem(_hour_key, val);
            };
            var clearHour = function() {
                var val = localStorage.getItem(_hour_key);
                if (val && val.length > 1) {
                    val = val.substring(1, val.length);
                    var arr = val.split(_divide);
                    var newArr = [];
                    if (arr && arr.length) {
                        for (var i = 0, len = arr.length; i < len; i++) {
                            var item = arr[i];
                            var itemArr = item.split("=");
                            if (itemArr.length == 2) {
                                var key = itemArr[0];
                                var v = itemArr[1];
                                if (Number(v) == -1) {
                                    storage.remove(key);
                                    continue;
                                }
                                newArr.push(item);
                            }
                        }
                    }
                    if (newArr.length) {
                        localStorage.setItem(_hour_key, _divide + newArr.join(_divide));
                    } else {
                        localStorage.setItem(_hour_key, _divide);
                    }
                }
            };
            return {
                init: function(userId) {
                    _userId = userId;
                    clearHour();
                },
                set: function(key, val, hour) {
                    if (_userId) {
                        var key = _userId + "_" + key;
                    }
                    localStorage.setItem(key, val);
                    if (hour == undefined) {
                        hour = -1;
                    }
                    saveHour(key, hour);
                },
                get: function(key) {
                    if (_userId) {
                        var key = _userId + "_" + key;
                    }
                    return localStorage.getItem(key);
                },
                remove: function(key) {
                    if (_userId) {
                        var key = _userId + "_" + key;
                    }
                    localStorage.removeItem(key);
                }
            };
        })();
        Util.Cookie = storage;
    }
})();

Date.prototype.format = function(format) {
	/*
	 * eg:format="yyyy-MM-dd hh:mm:ss";
	 */
	var o = {
		"M+" : this.getMonth() + 1, // month
		"d+" : this.getDate(), // day
		"h+" : this.getHours(), // hour
		"m+" : this.getMinutes(), // minute
		"s+" : this.getSeconds(), // second
		"q+" : Math.floor((this.getMonth() + 3) / 3), // quarter
		"S" : this.getMilliseconds()
		// millisecond
	}

	if (/(y+)/.test(format)) {
		format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4
						- RegExp.$1.length));
	}

	for (var k in o) {
		if (new RegExp("(" + k + ")").test(format)) {
			format = format.replace(RegExp.$1, RegExp.$1.length == 1
							? o[k]
							: ("00" + o[k]).substr(("" + o[k]).length));
		}
	}
	return format;
}