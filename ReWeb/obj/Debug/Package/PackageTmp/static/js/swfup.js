var a, SWFUpload;
if (SWFUpload == undefined) SWFUpload = function (b) {
    this.initSWFUpload(b);
};
SWFUpload.prototype.initSWFUpload = function (b) {
    try {
        this.customSettings = {};
        this.settings = b;
        this.eventQueue = [];
        this.movieName = "SWFUpload_" + SWFUpload.movieCount++;
        this.movieElement = null;
        SWFUpload.instances[this.movieName] = this;
        this.initSettings();
        this.loadFlash();
        this.displayDebugInfo();
    } catch (c) {
        delete SWFUpload.instances[this.movieName];
        throw c;
    }
};
SWFUpload.instances = {};
SWFUpload.movieCount = 0;
SWFUpload.version = "2.2.0 2009-03-25";
SWFUpload.QUEUE_ERROR = {
    QUEUE_LIMIT_EXCEEDED: -100,
    FILE_EXCEEDS_SIZE_LIMIT: -110,
    ZERO_BYTE_FILE: -120,
    INVALID_FILETYPE: -130
};
SWFUpload.UPLOAD_ERROR = {
    HTTP_ERROR: -200,
    MISSING_UPLOAD_URL: -210,
    IO_ERROR: -220,
    SECURITY_ERROR: -230,
    UPLOAD_LIMIT_EXCEEDED: -240,
    UPLOAD_FAILED: -250,
    SPECIFIED_FILE_ID_NOT_FOUND: -260,
    FILE_VALIDATION_FAILED: -270,
    FILE_CANCELLED: -280,
    UPLOAD_STOPPED: -290
};
SWFUpload.FILE_STATUS = {
    QUEUED: -1,
    IN_PROGRESS: -2,
    ERROR: -3,
    COMPLETE: -4,
    CANCELLED: -5
};
SWFUpload.BUTTON_ACTION = {
    SELECT_FILE: -100,
    SELECT_FILES: -110,
    START_UPLOAD: -120
};
SWFUpload.CURSOR = {
    ARROW: -1,
    HAND: -2
};
SWFUpload.WINDOW_MODE = {
    WINDOW: "window",
    TRANSPARENT: "transparent",
    OPAQUE: "opaque"
};
SWFUpload.completeURL = function (b) {
    if (typeof b !== "string" || b.match(/^https?:\/\//i) || b.match(/^\//)) return b;
    var c = window.location.pathname.lastIndexOf("/");
    var path = c <= 0 ? "/" : window.location.pathname.substr(0, c) + "/";
    return path + b;
};
a = SWFUpload.prototype;
a.initSettings = function () {
    this.ensureDefault = function (b, c) {
        this.settings[b] = this.settings[b] == undefined ? c : this.settings[b];
    };
    this.ensureDefault("upload_url", "");
    this.ensureDefault("rsa1", "");
    this.ensureDefault("rsa2", "");
    this.ensureDefault("preserve_relative_urls", false);
    this.ensureDefault("file_post_name", "Filedata");
    this.ensureDefault("post_params", {});
    this.ensureDefault("use_query_string", false);
    this.ensureDefault("requeue_on_error", false);
    this.ensureDefault("http_success", []);
    this.ensureDefault("assume_success_timeout", 0);
    this.ensureDefault("file_types", "*.*");
    this.ensureDefault("file_types_description", "All Files");
    this.ensureDefault("file_size_limit", 0);
    this.ensureDefault("file_upload_limit", 0);
    this.ensureDefault("file_queue_limit", 0);
    this.ensureDefault("flash_url", "swfupload.swf");
    this.ensureDefault("prevent_swf_caching", true);
    this.ensureDefault("button_image_url", "");
    this.ensureDefault("button_width", 1);
    this.ensureDefault("button_height", 1);
    this.ensureDefault("button_text", "");
    this.ensureDefault("button_text_style", "color: #000000; font-size: 16pt;");
    this.ensureDefault("button_text_top_padding", 0);
    this.ensureDefault("button_text_left_padding", 0);
    this.ensureDefault("button_action", SWFUpload.BUTTON_ACTION.SELECT_FILES);
    this.ensureDefault("button_disabled", false);
    this.ensureDefault("button_placeholder_id", "");
    this.ensureDefault("button_placeholder", null);
    this.ensureDefault("button_cursor", SWFUpload.CURSOR.ARROW);
    this.ensureDefault("button_window_mode", SWFUpload.WINDOW_MODE.WINDOW);
    this.ensureDefault("debug", false);
    this.settings.debug_enabled = this.settings.debug;
    this.settings.return_upload_start_handler = this.returnUploadStart;
    this.ensureDefault("swfupload_loaded_handler", null);
    this.ensureDefault("file_dialog_start_handler", null);
    this.ensureDefault("file_queued_handler", null);
    this.ensureDefault("file_queue_error_handler", null);
    this.ensureDefault("file_dialog_complete_handler", null);
    this.ensureDefault("upload_start_handler", null);
    this.ensureDefault("upload_progress_handler", null);
    this.ensureDefault("upload_error_handler", null);
    this.ensureDefault("upload_success_handler", null);
    this.ensureDefault("upload_complete_handler", null);
    this.ensureDefault("debug_handler", this.debugMessage);
    this.ensureDefault("custom_settings", {});
    this.customSettings = this.settings.custom_settings;
    if (this.settings.prevent_swf_caching) this.settings.flash_url = this.settings.flash_url + (this.settings.flash_url.indexOf("?") < 0 ? "?" : "&") + "preventswfcaching=" + (new Date).getTime();
    if (!this.settings.preserve_relative_urls) {
        this.settings.upload_url = SWFUpload.completeURL(this.settings.upload_url);
        this.settings.button_image_url = SWFUpload.completeURL(this.settings.button_image_url);
    }
    delete this.ensureDefault;
};
a.loadFlash = function () {
    var b, c;
    if (document.getElementById(this.movieName) !== null) throw "ID " + this.movieName + " is already in use. The Flash Object could not be added";
    b = document.getElementById(this.settings.button_placeholder_id) || this.settings.button_placeholder;
    if (b == undefined) throw "Could not find the placeholder element: " + this.settings.button_placeholder_id;
    c = document.createElement("div");
    c.innerHTML = this.getFlashHTML();
    b.parentNode.replaceChild(c.firstChild, b);
    if (window[this.movieName] == undefined) window[this.movieName] = this.getMovieElement();
};
a.getFlashHTML = function () {
    return ['<object id="', this.movieName, '" type="application/x-shockwave-flash" data="', this.settings.flash_url, '" width="', this.settings.button_width, '" height="', this.settings.button_height, '" class="swfupload"><param name="wmode" value="', this.settings.button_window_mode, '" /><param name="movie" value="', this.settings.flash_url, '" /><param name="quality" value="high" /><param name="menu" value="false" /><param name="allowScriptAccess" value="always" />', '<param name="flashvars" value="' + this.getFlashVars() + '" />', "</object>"].join("");
};
a.getFlashVars = function () {
    var b = this.buildParamString(),
    c = this.settings.http_success.join(",");
    return ["movieName=", encodeURIComponent(this.movieName),
        "&amp;uploadURL=", encodeURIComponent(this.settings.upload_url), "&amp;useQueryString=", encodeURIComponent(this.settings.use_query_string), "&amp;requeueOnError=", encodeURIComponent(this.settings.requeue_on_error), "&amp;httpSuccess=", encodeURIComponent(c), "&amp;assumeSuccessTimeout=", encodeURIComponent(this.settings.assume_success_timeout), "&amp;params=", encodeURIComponent(b), "&amp;filePostName=", encodeURIComponent(this.settings.file_post_name), "&amp;fileTypes=", encodeURIComponent(this.settings.file_types), "&amp;fileTypesDescription=", encodeURIComponent(this.settings.file_types_description), "&amp;fileSizeLimit=", encodeURIComponent(this.settings.file_size_limit), "&amp;fileUploadLimit=", encodeURIComponent(this.settings.file_upload_limit), "&amp;fileQueueLimit=", encodeURIComponent(this.settings.file_queue_limit), "&amp;debugEnabled=",
        encodeURIComponent(this.settings.debug_enabled),
        "&amp;buttonImageURL=", encodeURIComponent(this.settings.button_image_url),
        "&amp;buttonWidth=",
        encodeURIComponent(this.settings.button_width),
        "&amp;buttonHeight=", encodeURIComponent(this.settings.button_height),
        "&amp;buttonText=", encodeURIComponent(this.settings.button_text),
        "&amp;buttonTextTopPadding=", encodeURIComponent(this.settings.button_text_top_padding),
        "&amp;buttonTextLeftPadding=", encodeURIComponent(this.settings.button_text_left_padding),
        "&amp;buttonTextStyle=", encodeURIComponent(this.settings.button_text_style),
        "&amp;buttonAction=", encodeURIComponent(this.settings.button_action),
        "&amp;buttonDisabled=", encodeURIComponent(this.settings.button_disabled),
        "&amp;buttonCursor=", encodeURIComponent(this.settings.button_cursor),
        "&amp;rsa1=", encodeURIComponent(this.settings.rsa1),
	"&amp;rsa2=", encodeURIComponent(this.settings.rsa2)
    ].join("");
};
a.getMovieElement = function () {
    if (this.movieElement == undefined) this.movieElement = document.getElementById(this.movieName);
    if (this.movieElement === null) throw "Could not find Flash element";
    return this.movieElement;
};
a.buildParamString = function () {
    var b = this.settings.post_params,
    c = [];
    if (typeof b === "object") for (var d in b) b.hasOwnProperty(d) && c.push(encodeURIComponent(d.toString()) + "=" + encodeURIComponent(b[d].toString()));
    return c.join("&amp;");
};
a.destroy = function () {
    try {
        this.cancelUpload(null, false);
        var b = this.getMovieElement();
        if (b && typeof b.CallFunction === "unknown") {
            for (var c in b) try {
                if (typeof b[c] === "function") b[c] = null;
                             } catch (d) { }
            try {
                b.parentNode.removeChild(b);
            } catch (e) { }
        }
        window[this.movieName] = null;
        SWFUpload.instances[this.movieName] = null;
        delete SWFUpload.instances[this.movieName];
        this.movieName = this.eventQueue = this.customSettings = this.settings = this.movieElement = null;
        return true;
    } catch (g) {
        return false;
    }
};
a.displayDebugInfo = function () {
    this.debug(["---SWFUpload Instance Info---\nVersion: ", SWFUpload.version, "\nMovie Name: ", this.movieName, "\nSettings:\n\tupload_url: ", this.settings.upload_url, "\n\tflash_url: ", this.settings.flash_url, "\n\tuse_query_string: ", this.settings.use_query_string.toString(), "\n\trequeue_on_error: ", this.settings.requeue_on_error.toString(), "\n\thttp_success: ", this.settings.http_success.join(", "), "\n\tassume_success_timeout: ", this.settings.assume_success_timeout, "\n\tfile_post_name: ", this.settings.file_post_name, "\n\tpost_params: ", this.settings.post_params.toString(), "\n\tfile_types: ", this.settings.file_types, "\n\tfile_types_description: ", this.settings.file_types_description, "\n\tfile_size_limit: ", this.settings.file_size_limit, "\n\tfile_upload_limit: ", this.settings.file_upload_limit, "\n\tfile_queue_limit: ", this.settings.file_queue_limit, "\n\tdebug: ", this.settings.debug.toString(), "\n\tprevent_swf_caching: ", this.settings.prevent_swf_caching.toString(), "\n\tbutton_placeholder_id: ", this.settings.button_placeholder_id.toString(), "\n\tbutton_placeholder: ", this.settings.button_placeholder ? "Set" : "Not Set", "\n\tbutton_image_url: ", this.settings.button_image_url.toString(), "\n\tbutton_width: ", this.settings.button_width.toString(), "\n\tbutton_height: ", this.settings.button_height.toString(), "\n\tbutton_text: ", this.settings.button_text.toString(), "\n\tbutton_text_style: ", this.settings.button_text_style.toString(), "\n\tbutton_text_top_padding: ", this.settings.button_text_top_padding.toString(), "\n\tbutton_text_left_padding: ", this.settings.button_text_left_padding.toString(), "\n\tbutton_action: ", this.settings.button_action.toString(), "\n\tbutton_disabled: ", this.settings.button_disabled.toString(), "\n\tcustom_settings: ", this.settings.custom_settings.toString(), "\nEvent Handlers:\n\tswfupload_loaded_handler assigned: ", (typeof this.settings.swfupload_loaded_handler === "function").toString(), "\n\tfile_dialog_start_handler assigned: ", (typeof this.settings.file_dialog_start_handler === "function").toString(), "\n\tfile_queued_handler assigned: ", (typeof this.settings.file_queued_handler === "function").toString(), "\n\tfile_queue_error_handler assigned: ", (typeof this.settings.file_queue_error_handler === "function").toString(), "\n\tupload_start_handler assigned: ", (typeof this.settings.upload_start_handler === "function").toString(), "\n\tupload_progress_handler assigned: ", (typeof this.settings.upload_progress_handler === "function").toString(), "\n\tupload_error_handler assigned: ", (typeof this.settings.upload_error_handler === "function").toString(), "\n\tupload_success_handler assigned: ", (typeof this.settings.upload_success_handler === "function").toString(), "\n\tupload_complete_handler assigned: ", (typeof this.settings.upload_complete_handler === "function").toString(), "\n\tdebug_handler assigned: ", (typeof this.settings.debug_handler === "function").toString(), "\n"].join(""));
};
a.addSetting = function (b, c, d) {
    return c == undefined ? (this.settings[b] = d) : (this.settings[b] = c);
};
a.getSetting = function (b) {
    if (this.settings[b] != undefined) return this.settings[b];
    return "";
};
a.callFlash = function (b, c) {
    c = c || [];
    var d = this.getMovieElement(),
    e,
    g;
    try {
        g = d.CallFunction('<invoke name="' + b + '" returntype="javascript">' + window.__flash__argumentsToXML(c, 0) + "</invoke>");
        e = eval(g);
    } catch (h) {
        throw "Call to " + b + " failed";
    }
    if (e != undefined && typeof e.post === "object") e = this.unescapeFilePostParams(e);
    return e;
};
a.selectFile = function () {
    this.callFlash("SelectFile");
};
a.selectFiles = function () {
    this.callFlash("SelectFiles");
};
a.startUpload = function (b) {
    this.callFlash("StartUpload", [b]);
};
a.cancelUpload = function (b, c) {
    if (c !== false) c = true;
    this.callFlash("CancelUpload", [b, c]);
};
a.stopUpload = function () {
    this.callFlash("StopUpload");
};
a.getStats = function () {
    return this.callFlash("GetStats");
};
a.setStats = function (b) {
    this.callFlash("SetStats", [b]);
};
a.getFile = function (b) {
    return typeof b === "number" ? this.callFlash("GetFileByIndex", [b]) : this.callFlash("GetFile", [b]);
};
a.addFileParam = function (b, c, d) {
    return this.callFlash("AddFileParam", [b, c, d]);
};
a.removeFileParam = function (b, c) {
    this.callFlash("RemoveFileParam", [b, c]);
};
a.setUploadURL = function (b) {
    this.settings.upload_url = b.toString();
    this.callFlash("SetUploadURL", [b]);
};
a.setPostParams = function (b) {
    this.settings.post_params = b;
    this.callFlash("SetPostParams", [b]);
};
a.addPostParam = function (b, c) {
    this.settings.post_params[b] = c;
    this.callFlash("SetPostParams", [this.settings.post_params]);
};
a.removePostParam = function (b) {
    delete this.settings.post_params[b];
    this.callFlash("SetPostParams", [this.settings.post_params]);
};
a.setFileTypes = function (b, c) {
    this.settings.file_types = b;
    this.settings.file_types_description = c;
    this.callFlash("SetFileTypes", [b, c]);
};
a.setFileSizeLimit = function (b) {
    this.settings.file_size_limit = b;
    this.callFlash("SetFileSizeLimit", [b]);
};
a.setFileUploadLimit = function (b) {
    this.settings.file_upload_limit = b;
    this.callFlash("SetFileUploadLimit", [b]);
};
a.setFileQueueLimit = function (b) {
    this.settings.file_queue_limit = b;
    this.callFlash("SetFileQueueLimit", [b]);
};
a.setFilePostName = function (b) {
    this.settings.file_post_name = b;
    this.callFlash("SetFilePostName", [b]);
};
a.setUseQueryString = function (b) {
    this.settings.use_query_string = b;
    this.callFlash("SetUseQueryString", [b]);
};
a.setRequeueOnError = function (b) {
    this.settings.requeue_on_error = b;
    this.callFlash("SetRequeueOnError", [b]);
};
a.setHTTPSuccess = function (b) {
    if (typeof b === "string") b = b.replace(" ", "").split(",");
    this.settings.http_success = b;
    this.callFlash("SetHTTPSuccess", [b]);
};
a.setAssumeSuccessTimeout = function (b) {
    this.settings.assume_success_timeout = b;
    this.callFlash("SetAssumeSuccessTimeout", [b]);
};
a.setDebugEnabled = function (b) {
    this.settings.debug_enabled = b;
    this.callFlash("SetDebugEnabled", [b]);
};
a.setButtonImageURL = function (b) {
    if (b == undefined) b = "";
    this.settings.button_image_url = b;
    this.callFlash("SetButtonImageURL", [b]);
};
a.setButtonDimensions = function (b, c) {
    this.settings.button_width = b;
    this.settings.button_height = c;
    var d = this.getMovieElement();
    if (d != undefined) {
        d.style.width = b + "px";
        d.style.height = c + "px";
    }
    this.callFlash("SetButtonDimensions", [b, c]);
};
a.setButtonText = function (b) {
    this.settings.button_text = b;
    this.callFlash("SetButtonText", [b]);
};
a.setButtonTextPadding = function (b, c) {
    this.settings.button_text_top_padding = c;
    this.settings.button_text_left_padding = b;
    this.callFlash("SetButtonTextPadding", [b, c]);
};
a.setButtonTextStyle = function (b) {
    this.settings.button_text_style = b;
    this.callFlash("SetButtonTextStyle", [b]);
};
a.setButtonDisabled = function (b) {
    this.settings.button_disabled = b;
    this.callFlash("SetButtonDisabled", [b]);
};
a.setButtonAction = function (b) {
    this.settings.button_action = b;
    this.callFlash("SetButtonAction", [b]);
};
a.setButtonCursor = function (b) {
    this.settings.button_cursor = b;
    this.callFlash("SetButtonCursor", [b]);
};
a.queueEvent = function (b, c) {
    if (c == undefined) c = [];
    else c instanceof Array || (c = [c]);
    var d = this;
    if (typeof this.settings[b] === "function") {
        this.eventQueue.push(function () {
            this.settings[b].apply(this, c);
        });
        setTimeout(function () {
            d.executeNextEvent();
        },
        0);
    } else if (this.settings[b] !== null) throw "Event handler " + b + " is unknown or is not a function";
};
a.executeNextEvent = function () {
    var b = this.eventQueue ? this.eventQueue.shift() : null;
    typeof b === "function" && b.apply(this);
};
a.unescapeFilePostParams = function (b) {
    var c = /[$]([0-9a-f]{4})/i,
    d = {},
    e;
    if (b != undefined) {
        for (var g in b.post) if (b.post.hasOwnProperty(g)) {
            e = g;
            for (var h; (h = c.exec(e)) !== null; ) e = e.replace(h[0], String.fromCharCode(parseInt("0x" + h[1], 16)));
            d[e] = b.post[g];
                              }
        b.post = d;
    }
    return b;
};
a.testExternalInterface = function () {
    try {
        return this.callFlash("TestExternalInterface");
    } catch (b) {
        return false;
    }
};
a.flashReady = function () {
    var b = this.getMovieElement();
    if (b) {
        this.cleanUp(b);
        this.queueEvent("swfupload_loaded_handler");
    } else this.debug("Flash called back ready but the flash movie can't be found.");
};
a.cleanUp = function (b) {
    try {
        if (this.movieElement && typeof b.CallFunction === "unknown") {
            this.debug("Removing Flash functions hooks (this should only run in IE and should prevent memory leaks)");
            for (var c in b) try {
                if (typeof b[c] === "function") b[c] = null;
                             } catch (d) { }
        }
    } catch (e) { }
    window.__flash__removeCallback = function (g, h) {
        try {
            if (g) g[h] = null;
        } catch (f) { }
    };
};
a.fileDialogStart = function () {
    this.queueEvent("file_dialog_start_handler");
};
a.fileQueued = function (b) {
    b = this.unescapeFilePostParams(b);
    this.queueEvent("file_queued_handler", b);
};
a.fileQueueError = function (b, c, d) {
    b = this.unescapeFilePostParams(b);
    this.queueEvent("file_queue_error_handler", [b, c, d]);
};
a.fileDialogComplete = function (b, c, d) {
    this.queueEvent("file_dialog_complete_handler", [b, c, d]);
};
a.uploadStart = function (b) {
    b = this.unescapeFilePostParams(b);
    this.queueEvent("return_upload_start_handler", b);
};
a.returnUploadStart = function (b) {
    var c;
    if (typeof this.settings.upload_start_handler === "function") {
        b = this.unescapeFilePostParams(b);
        c = this.settings.upload_start_handler.call(this, b);
    } else if (this.settings.upload_start_handler != undefined) throw "upload_start_handler must be a function";
    if (c === undefined) c = true;
    c = !!c;
    this.callFlash("ReturnUploadStart", [c]);
};
a.uploadProgress = function (b, c, d) {
    b = this.unescapeFilePostParams(b);
    this.queueEvent("upload_progress_handler", [b, c, d]);
};
a.uploadError = function (b, c, d) {
    b = this.unescapeFilePostParams(b);
    this.queueEvent("upload_error_handler", [b, c, d]);
};
a.uploadSuccess = function (b, c, d) {
    b = this.unescapeFilePostParams(b);
    this.queueEvent("upload_success_handler", [b, c, d]);
};
a.uploadComplete = function (b) {
    b = this.unescapeFilePostParams(b);
    this.queueEvent("upload_complete_handler", b);
};
a.debug = function (b) {
    this.queueEvent("debug_handler", b);
};
a.debugMessage = function (b) {
    if (this.settings.debug) {
        var c = [];
        if (typeof b === "object" && typeof b.name === "string" && typeof b.message === "string") {
            for (var d in b) b.hasOwnProperty(d) && c.push(d + ": " + b[d]);
            b = c.join("\n") || "";
            c = b.split("\n");
            b = "EXCEPTION: " + c.join("\nEXCEPTION: ");
            SWFUpload.Console.writeLine(b);
        } else SWFUpload.Console.writeLine(b);
    }
};
SWFUpload.Console = {};
SWFUpload.Console.writeLine = function (b) {
    var c, d;
    try {
        c = document.getElementById("SWFUpload_Console");
        if (!c) {
            d = document.createElement("form");
            document.getElementsByTagName("body")[0].appendChild(d);
            c = document.createElement("textarea");
            c.id = "SWFUpload_Console";
            c.style.fontFamily = "monospace";
            c.setAttribute("wrap", "off");
            c.wrap = "off";
            c.style.overflow = "auto";
            c.style.width = "700px";
            c.style.height = "350px";
            c.style.margin = "5px";
            d.appendChild(c);
        }
        c.value += b + "\n";
        c.scrollTop = c.scrollHeight - c.clientHeight;
    } catch (e) {
        alert("Exception: " + e.name + " Message: " + e.message);
    }
};
if (typeof SWFUpload === "function") {
    SWFUpload.queue = {};
    SWFUpload.prototype.initSettings = function (b) {
        return function () {
            typeof b === "function" && b.call(this);
            this.queueSettings = {};
            this.queueSettings.queue_cancelled_flag = false;
            this.queueSettings.queue_upload_count = 0;
            this.queueSettings.user_upload_complete_handler = this.settings.upload_complete_handler;
            this.queueSettings.user_upload_start_handler = this.settings.upload_start_handler;
            this.settings.upload_complete_handler = SWFUpload.queue.uploadCompleteHandler;
            this.settings.upload_start_handler = SWFUpload.queue.uploadStartHandler;
            this.settings.queue_complete_handler = this.settings.queue_complete_handler || null;
        };
    } (SWFUpload.prototype.initSettings);
    SWFUpload.prototype.startUpload = function (b) {
        this.queueSettings.queue_cancelled_flag = false;
        this.callFlash("StartUpload", [b]);
    };
    SWFUpload.prototype.cancelQueue = function () {
        this.queueSettings.queue_cancelled_flag = true;
        this.stopUpload();
        for (var b = this.getStats(); b.files_queued > 0; ) {
            this.cancelUpload(null, false);
            b = this.getStats();
        }
    };
    SWFUpload.queue.uploadStartHandler = function (b) {
        var c;
        if (typeof this.queueSettings.user_upload_start_handler === "function") c = this.queueSettings.user_upload_start_handler.call(this, b);
        c = c === false ? false : true;
        this.queueSettings.queue_cancelled_flag = !c;
        return c;
    };
    SWFUpload.queue.uploadCompleteHandler = function (b) {
        var c = this.queueSettings.user_upload_complete_handler;
        b.filestatus === SWFUpload.FILE_STATUS.COMPLETE && this.queueSettings.queue_upload_count++;
        if (b = typeof c === "function" ? c.call(this, b) === false ? false : true : b.filestatus === SWFUpload.FILE_STATUS.QUEUED ? false : true) {
            b = this.getStats();
            if (b.files_queued > 0 && this.queueSettings.queue_cancelled_flag === false) this.startUpload();
            else {
                if (this.queueSettings.queue_cancelled_flag === false) this.queueEvent("queue_complete_handler", [this.queueSettings.queue_upload_count]);
                else this.queueSettings.queue_cancelled_flag = false;
                this.queueSettings.queue_upload_count = 0;
            }
        }
    };
}
if (typeof SWFUpload === "function") {
    SWFUpload.speed = {};
    SWFUpload.prototype.initSettings = function (b) {
        return function () {
            typeof b === "function" && b.call(this);
            this.ensureDefault = function (c, d) {
                this.settings[c] = this.settings[c] == undefined ? d : this.settings[c];
            };
            this.fileSpeedStats = {};
            this.speedSettings = {};
            this.ensureDefault("moving_average_history_size", "10");
            this.speedSettings.user_file_queued_handler = this.settings.file_queued_handler;
            this.speedSettings.user_file_queue_error_handler = this.settings.file_queue_error_handler;
            this.speedSettings.user_upload_start_handler = this.settings.upload_start_handler;
            this.speedSettings.user_upload_error_handler = this.settings.upload_error_handler;
            this.speedSettings.user_upload_progress_handler = this.settings.upload_progress_handler;
            this.speedSettings.user_upload_success_handler = this.settings.upload_success_handler;
            this.speedSettings.user_upload_complete_handler = this.settings.upload_complete_handler;
            this.settings.file_queued_handler = SWFUpload.speed.fileQueuedHandler;
            this.settings.file_queue_error_handler = SWFUpload.speed.fileQueueErrorHandler;
            this.settings.upload_start_handler = SWFUpload.speed.uploadStartHandler;
            this.settings.upload_error_handler = SWFUpload.speed.uploadErrorHandler;
            this.settings.upload_progress_handler = SWFUpload.speed.uploadProgressHandler;
            this.settings.upload_success_handler = SWFUpload.speed.uploadSuccessHandler;
            this.settings.upload_complete_handler = SWFUpload.speed.uploadCompleteHandler;
            delete this.ensureDefault;
        };
    } (SWFUpload.prototype.initSettings);
    SWFUpload.speed.fileQueuedHandler = function (b) {
        if (typeof this.speedSettings.user_file_queued_handler === "function") {
            b = SWFUpload.speed.extendFile(b);
            return this.speedSettings.user_file_queued_handler.call(this, b);
        }
    };
    SWFUpload.speed.fileQueueErrorHandler = function (b, c, d) {
        if (typeof this.speedSettings.user_file_queue_error_handler === "function") {
            b = SWFUpload.speed.extendFile(b);
            return this.speedSettings.user_file_queue_error_handler.call(this, b, c, d);
        }
    };
    SWFUpload.speed.uploadStartHandler = function (b) {
        if (typeof this.speedSettings.user_upload_start_handler === "function") {
            b = SWFUpload.speed.extendFile(b, this.fileSpeedStats);
            return this.speedSettings.user_upload_start_handler.call(this, b);
        }
    };
    SWFUpload.speed.uploadErrorHandler = function (b, c, d) {
        b = SWFUpload.speed.extendFile(b, this.fileSpeedStats);
        SWFUpload.speed.removeTracking(b, this.fileSpeedStats);
        if (typeof this.speedSettings.user_upload_error_handler === "function") return this.speedSettings.user_upload_error_handler.call(this, b, c, d);
    };
    SWFUpload.speed.uploadProgressHandler = function (b, c, d) {
        this.updateTracking(b, c);
        b = SWFUpload.speed.extendFile(b, this.fileSpeedStats);
        if (typeof this.speedSettings.user_upload_progress_handler === "function") return this.speedSettings.user_upload_progress_handler.call(this, b, c, d);
    };
    SWFUpload.speed.uploadSuccessHandler = function (b, c) {
        if (typeof this.speedSettings.user_upload_success_handler === "function") {
            b = SWFUpload.speed.extendFile(b, this.fileSpeedStats);
            return this.speedSettings.user_upload_success_handler.call(this, b, c);
        }
    };
    SWFUpload.speed.uploadCompleteHandler = function (b) {
        b = SWFUpload.speed.extendFile(b, this.fileSpeedStats);
        SWFUpload.speed.removeTracking(b, this.fileSpeedStats);
        if (typeof this.speedSettings.user_upload_complete_handler === "function") return this.speedSettings.user_upload_complete_handler.call(this, b);
    };
    SWFUpload.speed.extendFile = function (b, c) {
        var d;
        if (c) d = c[b.id];
        if (d) {
            b.currentSpeed = d.currentSpeed;
            b.averageSpeed = d.averageSpeed;
            b.movingAverageSpeed = d.movingAverageSpeed;
            b.timeRemaining = d.timeRemaining;
            b.timeElapsed = d.timeElapsed;
            b.percentUploaded = d.percentUploaded;
            b.sizeUploaded = d.bytesUploaded;
        } else {
            b.currentSpeed = 0;
            b.averageSpeed = 0;
            b.movingAverageSpeed = 0;
            b.timeRemaining = 0;
            b.timeElapsed = 0;
            b.percentUploaded = 0;
            b.sizeUploaded = 0;
        }
        return b;
    };
    SWFUpload.prototype.updateTracking = function (b, c) {
        var d = this.fileSpeedStats[b.id];
        d || (this.fileSpeedStats[b.id] = d = {});
        c = c || d.bytesUploaded || 0;
        if (c < 0) c = 0;
        if (c > b.size) c = b.size;
        var e = (new Date).getTime();
        if (d.startTime) if (d.startTime > e) this.debug("When backwards in time");
        else {
            e = (new Date).getTime();
            var g = d.lastTime;
            g = e - g;
            var h = c - d.bytesUploaded;
            if (h === 0 || g === 0) return d;
            d.lastTime = e;
            d.bytesUploaded = c;
            d.currentSpeed = h * 8 / (g / 1000);
            d.averageSpeed = d.bytesUploaded * 8 / ((e - d.startTime) / 1000);
            d.movingAverageHistory.push(d.currentSpeed);
            d.movingAverageHistory.length > this.settings.moving_average_history_size && d.movingAverageHistory.shift();
            d.movingAverageSpeed = SWFUpload.speed.calculateMovingAverage(d.movingAverageHistory);
            d.timeRemaining = (b.size - d.bytesUploaded) * 8 / d.movingAverageSpeed;
            d.timeElapsed = (e - d.startTime) / 1000;
            d.percentUploaded = d.bytesUploaded / b.size * 100;
                         } else {
            d.startTime = (new Date).getTime();
            d.lastTime = d.startTime;
            d.currentSpeed = 0;
            d.averageSpeed = 0;
            d.movingAverageSpeed = 0;
            d.movingAverageHistory = [];
            d.timeRemaining = 0;
            d.timeElapsed = 0;
            d.percentUploaded = c / b.size;
            d.bytesUploaded = c;
        }
        return d;
    };
    SWFUpload.speed.removeTracking = function (b, c) {
        try {
            c[b.id] = null;
            delete c[b.id];
        } catch (d) { }
    };
    SWFUpload.speed.formatUnits = function (b, c, d, e) {
        var g, h;
        if (b === 0) return "0 " + d[d.length - 1];
        if (e) {
            g = b;
            h = d.length >= c.length ? d[c.length - 1] : "";
            for (e = 0; e < c.length; e++) if (b >= c[e]) {
                g = (b / c[e]).toFixed(2);
                h = d.length >= e ? " " + d[e] : "";
                break;
                                           }
            return g + h;
        } else {
            var f = [],
            i = b;
            for (e = 0; e < c.length; e++) {
                b = c[e];
                h = d.length > e ? " " + d[e] : "";
                g = i / b;
                g = e < c.length - 1 ? Math.floor(g) : g.toFixed(2);
                if (g > 0) {
                    i %= b;
                    f.push(g + h);
                }
            }
            return f.join(" ");
        }
    };
    SWFUpload.speed.formatBPS = function (b) {
        var c = [1073741824, 1048576, 1024, 1],
        d = ["Gbps", "Mbps", "Kbps", "bps"];
        return SWFUpload.speed.formatUnits(b, c, d, true);
    };
    SWFUpload.speed.formatTime = function (b) {
        var c = [86400, 3600, 60, 1],
        d = ["\u5929", "\u65f6", "\u5206", "\u79d2"];
        return SWFUpload.speed.formatUnits(b, c, d, false);
    };
    SWFUpload.speed.formatBytes = function (b) {
        var c = [1073741824, 1048576, 1024, 1],
        d = ["GB", "MB", "KB", "bytes"];
        return SWFUpload.speed.formatUnits(b, c, d, true);
    };
    SWFUpload.speed.formatPercent = function (b) {
        return b + "%";
    };
    SWFUpload.speed.calculateMovingAverage = function (b) {
        var c = [],
        d,
        e = 0,
        g = 0,
        h = 0,
        f = 0,
        i = 0,
        j = 0,
        k = 0;
        d = b.length;
        if (d >= 8) {
            for (f = 0; f < d; f++) {
                c[f] = b[f];
                e += c[f];
            }
            g = e / d;
            for (f = 0; f < d; f++) h += Math.pow(c[f] - g, 2);
            f = h / d;
            i = Math.sqrt(f);
            for (f = 0; f < d; f++) c[f] = (c[f] - g) / i;
            e = 2;
            for (f = 0; f < d; f++) if (c[f] <= e && c[f] >= -e) {
                k++;
                j += b[f];
                                    }
        } else {
            k = d;
            for (f = 0; f < d; f++) j += b[f];
        }
        return j / k;
    };
};