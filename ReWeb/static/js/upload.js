(function () {

    (function (root) {
        var amdExports;
        define('upload', ['jquery', 'fuelux', 'swfup', 'util'], function ($) {
            (function () {
                var Uploader = window.Uploader || function (element, config) {
                    //保存上传空间缓存信息
                    var cache = { initState: false };
                    this.cacheData = {};
                    _self = this;
                    //默认配置
                    this.defaultConfig = {
                        file_types_description: "*.*",
                        file_upload_limit: 0,
                        file_types: "*.*",
                        file_size_limit: 1073741824,
                        file_queue_limit: 0,
                        button_action: SWFUpload.BUTTON_ACTION.SELECT_FILES,
                        debug: false,
                        post_params: {},
                        button_cursor: SWFUpload.CURSOR.HAND,
                        button_width: "100",
                        button_height: "30",
                        title: "文件上传",
                        button_window_mode: SWFUpload.WINDOW_MODE.TRANSPARENT
                    };
                    this.$element = $(element);
                    var r = Math.floor(Math.random() * 1000 + 1);
                    var modal_id = 'upload_form_' + r;
                    var upload_btn_id = 'upload_btn_' + r;
                    this.defaultConfig.button_placeholder_id = upload_btn_id;
                    this.defaultConfig.flash_url = config.swf || "/static/swfup.swf";
                    this.defaultConfig.upload_url = config.url || "/file/create";
                    var url = this.$element.css('background-image');
                    url = /^url\((['"]?)(.*)\1\)$/.exec(url);
                    this.defaultConfig.button_image_url = url ? url[2] : "/static/img/v4_up_btn.png";
                    this.config = $.extend({}, this.defaultConfig, config);

                    //错误代码
                    this.errorCode = {
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
                    };

                    // 添加上传窗口
                    this.$dialog = $('<div id="' + modal_id + '"data-backdrop="false" class="modal hide fade">' +
                        '<div class="modal-header"><a class="close" data-dismiss="modal" >&times;</a><h3>' + this.config.title + '</h3></div>' +
                        '<div class="modal-body"><div class="upload-panel pull-right"><span id="' + upload_btn_id + '"></span></div><table class="table"><thead><tr><th style="width: 250px;">文件名</th><th style="width: 180px;">上传进度</th><th style="width: 100px;">大小</th><th style="width: 50px;">操作</th></thead><tbody rel="list"></tbody></table></div>' +
                        '<div class="modal-footer"><a href="#" ref="btn-del" class="btn btn-danger">清除列表</a><a href="#" class="btn btn-success" data-dismiss="modal">完成上传</a><div class="alert alert-info"><span rel="up_msg"></span></div></div>' +
                        '</div>'); //上传文件的模板
                    this.template = '<tr file_id="{id}"><td class="f-name">{name}</span></td><td class="f-progress" rel="pg_text"></td><td class="f-size">{size_str}</td><td class="f-operate" rel="op">数据文件</td></tr>';
                    this.menu_temp = $('<div class="select btn-group open hide" data-resize="auto" style="position:fixed;z-index:9999"><button data-toggle="dropdown" class="btn dropdown-toggle">' +
                        '<span class="dropdown-label"></span><span class="caret"></span></button><ul class="dropdown-menu">' +
                        '<li data-value="1" data-selected="true"><a href="#">数据文件</a></li>' +
                        '<li data-value="2"><a href="#">元数据文件</a></li>' +
                        '<li data-value="3"><a href="#">结果文件</a></li></ul></div>');
                    $('body').append(this.menu_temp);
                    this.$domlist = this.$dialog.find('[rel="list"]');
                    this.$upmsg = this.$dialog.find('[rel="up_msg"]');
                    this.$element.before(this.$dialog);
                    this.$element.attr("href", "#" + modal_id);
                    this.$element.attr('data-toggle', 'modal');


                    //上传事件绑定,与swf交互
                    var bind_events = function (settings) {
                        //控件载入完成回调
                        settings.swfupload_loaded_handler = function () {
                            if (!cache.loaded) {
                                cache.loaded = true;
                                config.load && config.load();
                            }
                        }; //方法结束

                        settings.file_queued_handler = function (file) {
                            if (file.size > 1024 * 1024 * 1024) {
                                _self._upload.cancelUpload(file);
                                file.error = "目前不支持上传大于1G的文件";
                            } else if (Util.Validate.mb_strlen(file.name) > 451) {
                                _self._upload.cancelUpload(file);
                                file.error = "文件名过长";
                            }
                            file.complete = 0;
                            _self.add(file);
                            file.is_uploading = 1;
                        };
                        settings.file_queue_error_handler = function (file, error, message) {
                            if (isNaN(file.size) || (config.upload_size_limit > file.size && error == "-110")) {
                                var txt = "目前上传不支持上传大于1G的文件";
                                file.error = '<span title="' + txt + '">' + txt + "</span>";
                            } else {
                                file.error = String.format(_self.errorCode[error], Util.File.ShowSize(Number(config.upload_size_limit)));
                            }
                        };
                        settings.file_dialog_complete_handler = function (selected, queued) {
                            if (!_self._upload.getFile()) {
                                this.customSettings.FileSizeTotal = null;
                            }
                            this.startUpload();
                        };
                        settings.upload_start_handler = function (file) {
                            file = _self.getFile(file.id);
                            //cache.isupload = true;
                            //_FUpload.setting(file.aid, file.cid, file.name_md5, file.token_time);
                            //cache.isupload = false;
                            _self.progress(file);
                            this.customSettings.StartTime = new Date();
                            //TODO
                        };

                        settings.upload_progress_handler = function (file, c, t) {
                            file = _self.getFile(file.id);
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
                                _self.progress(file);
                            }
                        };

                        settings.upload_error_handler = function (file, error, message) {
                            file = _self.getFile(file.id);
                            if (file) {
                                file.is_uploading = 0;
                                this.customSettings.UploadFileSize -= file.size;
                                this.customSettings.TotalSize -= file.size;
                                file.error = Core.CONFIG.FUpErrMsg[error];
                                _self.error(file);
                            }
                        };

                        settings.upload_success_handler = function (file, data) {
                            file = _self.getFile(file.id);
                            file.is_uploading = 0;
                            try {
                                //Core.Debug.write(data);
                                data = eval("(" + data + ")");
                                if (data.state) {
                                    file.fid = data.fid[0];
                                    file.data = data;
                                    _self.success(file);
                                    this.customSettings.UploadFileSize -= file.size;
                                    this.customSettings.CompleteSize += file.size;
                                    return;
                                }
                                file.error = data.message;
                            } catch (e) {
                                file.error = "错误: 未知原因";
                            }
                            _self.error(file);
                        };

                        settings.upload_complete_handler = function (file) {
                            file = _self.getFile(file.id);
                            file && (file.is_uploading = 0);
                        };
                        settings.queue_complete_handler = function () {
                        };
                    };

                    bind_events(this.config);
                    this._upload = new SWFUpload(this.config);

                    this.getFile = function (id) {
                        return this.cacheData[id];
                    };

                    // 添加监听，更新总上传状况
                    var listen = function () {
                        if (!cache.listenTimer) {
                            cache.listenTimer = window.setInterval(function () { _self.totalProgress(); }, 50);
                        }
                    };

                    listen();
                };

                // 处理进度
                Uploader.prototype.progress = function (file) {
                    var dom = this.$domlist.find("[file_id='" + file.id + "']");
                    file.progress = file.progress || "";
                    file.speed_str = file.speed_str || "";
                    dom.find("[rel='pg_text']").html(file.progress + file.speed_str);
                    var line = this.$domlist.find(".progress");
                    line.find('.bar').width(0);
                    if (!line.length) {
                        line = $('<div class="progress progress-striped active progress-success" style="overflow: hidden;z-index: -1;position: relative; height: 34px;"><div class="bar" style="height:100%"></div></div>');
                    }
                    if (!dom.prev('.progress').length) {
                        dom.before(line);
                        var td1Width = dom.find(':first-child').width();
                        line.height(dom.height());
                        line.css('margin-bottom', -dom.height());
                        line.css('margin-right', td1Width - dom.width() + 13);
                    }
                    line.find('.bar').css({ width: file.progress });
                };

                // 添加上传文件
                Uploader.prototype.add = function (file) {
                    if (!this.exist(file)) {
                        if (file.size || file.size == 0) {
                            file.size_str = Util.File.ShowSize(file.size);
                        } else {
                            file.size_str = "";
                        }
                        var temp = $(String.formatmodel(this.template, file));
                        temp.find('[rel=op]').html(this.menu_temp);
                        this.$domlist.append(temp);
                        temp.find('[rel=op]').on('click', function () {

                        });
                        if (file.error) {
                            this.error(file);
                        } else {
                            this.cacheData[file.id] = file;
                        }
                    }
                };

                // 判断文件是否存在
                Uploader.prototype.exist = function (file) {
                    var ret = false;
                    if (this.cacheData)
                        $.each(this.cacheData, function (i, ele) {
                            if (ele.name === file.name && ele.size === file.size) {
                                ret = true;
                                return false;
                            }
                        });
                    return ret;
                };

                // 错误处理
                Uploader.prototype.error = function (file) {
                    var dom = this.$domlist.find("[file_id='" + file.id + "']");
                    dom.attr("class", "alert alert-error");
                    dom.attr("title", file.error);
                    dom.find("[rel='pg_text']").html(file.error);
                    dom.prev(".progress").html("").remove();
                    dom.find(".op-pause").empty().remove();
                    dom.find(".op-continue").empty().remove();
                    if (this.cacheData && this.cacheData[file.id]) {
                        this.cacheData[file.id] = null;
                        delete this.cacheData[file.id];
                    }
                };

                // 上传成功处理
                Uploader.prototype.success = function (file) {
                    var dom = this.$domlist.find("[file_id='" + file.id + "']");
                    dom.find("[rel='pg_text']").html('<i class="icon-ok"></i>上传成功');
                    dom.prev(".progress").html("").remove();
                    //dom.find('td:last-child').before('<td>' + new Date(file.token_time).format('yyyy年MM月dd日 hh:mm:ss') + '</td>');
                    dom.attr("file", file.fid);
                    $('#file-list').append(dom);
                    if (file.up_type == 1) {
                        dom.find(".op-pause").empty().remove();
                        dom.find(".op-continue").empty().remove();
                    }
                    if (this.cacheData && this.cacheData[file.id]) {
                        this.cacheData[file.id] = null;
                        delete this.cacheData[file.id];
                    }

                    this.config.success_callback && this.config.success_callback(file);
                };

                // 总进度处理
                Uploader.prototype.totalProgress = function () {
                    if (this.cacheData) {
                        var count = 0;
                        var size = 0;
                        var complete = 0;
                        if (!this.totalobj) {
                            this.totalobj = {};
                        }
                        var speed = 0;
                        for (var k in this.cacheData) {
                            var file = this.cacheData[k];
                            this.totalobj[k] = { size: Number(file.size), complete: file.complete ? Number(file.complete) : 0 };
                            if (file.is_uploading == 1) {
                                speed += (file.speed ? file.speed : 0);
                            }
                            count++;
                            size += this.totalobj[k].size;
                            complete += this.totalobj[k].complete;
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
                            this.$upmsg.parent().show();
                            this.$upmsg.html(msg);
                        } else {
                            this.$upmsg.parent().fadeOut(1000);

                            this.totalobj = null;
                        }
                    } else {
                        this.totalobj = null;
                    }
                    //this.progress(totalobj);
                    //TODO
                };

                // add to jquery
                $.fn.uploader = function (option) {
                    return this.each(function () {
                        var $this = $(this), data = $this.data('uploader'), options = typeof option == 'object' && option;
                        if (!data) $this.data('uploader', (data = new Uploader(this, options)));
                        else if (option) data.setState(option);
                    });
                };
                $.fn.uploader.Constructor = Uploader;
                $(window).on('load', function () {
                    $('[data-toggle^=uploader]').each(function () {
                        var $this = $(this);
                        if ($this.data('uploader')) return;
                        $this.uploader($this.data());
                    });
                }); // data-api
                $(document).on('click.uploader.data-api', '[data-toggle^=uploader]', function (e) {
                    var $btn = $(e.target);
                    if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn');
                    $btn.uploader();
                });
            } .call(root));
            return amdExports;
        });
    } (this));

} ());