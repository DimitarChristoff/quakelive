/*
 * Copyright (c) 2007-2009 Id Software, Inc.  All rights reserved.
 */
;
(function ($) {
    var ql = {};
    window.quakelive = ql;
    ql.modules = {};
    ql.hooks = {};
    ql.skipEndGame = false;
    ql.pathParts = [];
    ql.activeModule = null;
    ql.defaultSiteConfig = {
        xmppDomain: 'xmpp-dev.idsoftware.com',
        realm: 'qztest',
        cdnUrl: 'http://%LOCATION%',
        baseUrl: 'http://%LOCATION%',
        staticUrl: 'http://%LOCATION%',
        trackPageViews: false,
        showPostGameAlways: false,
        deliveryUrl: 'http://media.quakelive.com/delivery/spc.php'
    };
    ql.PlayerAvatarPath = {
        SM: "/images/players/icon_sm/",
        MD: "/images/players/icon_md/",
        LG: "/images/players/icon_lg/",
        XL: "/images/players/icon_xl/",
        G_SM: "/images/players/icon_gray_sm/",
        G_MD: "/images/players/icon_gray_md/",
        G_LG: "/images/players/icon_gray_lg/",
        G_XL: "/images/players/icon_gray_xl/"
    };
    ql.SwapAvatarPath = function (str, neo) {
        for (var i in ql.PlayerAvatarPath) {
            str = str.replace(ql.PlayerAvatarPath[i], neo)
        }
        return str
    };
    ql.resource = function (path) {
        var lastIndex = path.lastIndexOf('.');
        if (lastIndex != -1) {
            var fileRevision = 0;
            if (ql.siteConfig.realm == 'qztest') {
                fileRevision = Math.floor(Math.random() * 99999999)
            }
            path = path.substring(0, lastIndex) + '_v' + ql.siteConfig.resourceRevision + '.' + fileRevision + path.substring(lastIndex)
        }
        return ql.siteConfig.staticUrl + path
    };
    ql.CleanupPath = function (path) {
        while (path.charAt(0) == '/' || path.charAt(0) == '#') {
            path = path.substring(1)
        }
        while (path.charAt(path.length - 1) == '/') {
            path = path.substring(0, path.length - 1)
        }
        return path
    };
    ql.ExtractParams = function (params, startIndex, dest) {
        var extractedParams = dest || {};
        for (var paramIndex = startIndex; paramIndex < params.length; ++paramIndex) {
            var param = params[paramIndex];
            var paramParts = param.split('=', 2);
            extractedParams[paramParts[0]] = paramParts[1]
        }
        return extractedParams
    };
    ql.MergeParams = function (params) {
        var str = '';
        var count = 0;
        for (var paramIndex in params) {
            if (count++>0) {
                str += ';'
            }
            str += paramIndex + '=' + params[paramIndex]
        }
        return str
    };
    ql.AddParam = function (key, value) {
        ql.params[key] = value
    };
    ql.RemoveParam = function (key) {
        if (ql.params[key]) delete ql.params[key]
    };
    ql.HasParam = function (key) {
        if (ql.params[key]) return true;
        else return false
    };
    ql.GetParam = function (key) {
        return ql.params[key]
    };
    ql.BuildSubPath = function (numArgs) {
        var path = "";
        for (var i = 0; i < numArgs; ++i) {
            if (typeof(quakelive.pathParts[i]) != 'undefined') {
                if (i > 0) {
                    path += "/"
                }
                path += quakelive.pathParts[i]
            }
        }
        return path
    };
    ql.ParsePath = function (forcePath) {
        var hash = forcePath || window.location.hash;
        if (hash.length > 0) {
            var parts = hash.split(';');
            ql.path = ql.CleanupPath(parts[0]);
            if (parts.length > 1) {
                ql.params = ql.ExtractParams(parts, 1)
            } else {
                ql.params = {}
            }
        } else {
            ql.path = ql.CleanupPath(window.location.pathname);
            if (!ql.path) {
                ql.path = 'home'
            }
            ql.params = {}
        }
        ql.location = window.location;
        ql.pathParts = ql.path.split('/') || [];
        ql.prevActiveModule = ql.activeModule;
        if (ql.pathParts.length > 0) {
            ql.activeModule = ql['mod_' + ql.pathParts[0]]
        } else {
            ql.activeModule = null
        }
        if (!ql.activeModule && forcePath != "sorry") {
            ql.ParsePath("sorry")
        }
    };
    ql.Goto = function (path, args, skipPath) {
        if (typeof(window.onbeforeunload) == 'function') {
            var msg = "Are you sure you want to navigate away from this page?\n\n" + window.onbeforeunload() + "\n\nPress OK to continue, or Cancel to stay on the current page.";
            if (!confirm(msg)) {
                return
            }
            window.onbeforeunload = null
        }
        if (!quakelive.IsLoggedIn() && ReadCookie('QLALU') !== null && ReadCookie('QLALP') !== null) {
            quakelive.PageRedirect('/user/login_redirect');
            return
        }
        if (quakelive.IsLoggedIn() && path == 'register') {
            path = 'home'
        }
        ql.HideOverlay();
        ql.ShutdownGame();
        var params = {};
        if (args) {
            ql.ExtractParams(args.split(';'), 0, params)
        }
        var hash = '#' + path;
        var paramString = ql.MergeParams(params);
        if (paramString) {
            hash += ';' + paramString
        }
        if (!skipPath) {
            ql.SetMonitorPath(hash);
            window.location.hash = hash
        }
        ql.ParsePath(path);
        ql.LoadLayout(ql.activeModule.GetLayout());
        ql.TrackPageView(path);
        ql.ScrollToTop()
    };
    ql.ScrollToTop = function () {
        window.scrollBy(-99999, -99999)
    };
    ql.GetLoadingBar = function () {
        return "<div id='loading-outer'><div id='loading-inner'>Loading&hellip;<div id='loading-image'></div></div></div>"
    };
    ql.ConfirmInstallClose = function () {
        var msg = "This QUAKE LIVE update is mandatory. Are you sure you want to close?\n\nYou will be logged out of QUAKE LIVE if you proceed.";
        if (confirm(msg)) {
            quakelive.PageRedirect("/user/logout")
        }
    };
    ql.Overlay = function (path, onCloseCode, skipHash) {
        ql.TrackPageView(path);
        $('#overlay-content').html(ql.GetLoadingBar());
        $.get(path, null, function (data) {
            $('#overlay-content').html(data);
            ql.SendModuleMessage('OnOverlayLoaded', path.split('/'))
        });
        $('#overlay-bg').css('display', 'inline');
        if (!onCloseCode) {
            onCloseCode = 'quakelive.CloseOverlay(); return false'
        }
        $('#overlay-close').html('<a href="javascript:;" onclick="' + onCloseCode + '"><img src="' + quakelive.resource('/images/site/close.png') + '" class="pngfix" border="0" width="71" height="13" /></a>');
        $('#overlay').css('display', 'inline');
        if (!skipHash) {
            ql.params['overlay'] = path;
            var paramString = ql.MergeParams(ql.params);
            if (paramString) {
                paramString = ';' + paramString
            }
            window.location.hash = '#' + quakelive.path + paramString
        }
    };
    ql.OverlayRaw = function (path, onLoad) {
        ql.TrackPageView(path);
        $('#overlay-raw').html(ql.GetLoadingBar());
        $.get(path, null, function (data) {
            $('#overlay-raw').html(data);
            if (onLoad) {
                onLoad()
            }
        });
        $('#overlay-bg').css('display', 'inline');
        $('#overlay-raw').css('display', 'inline')
    };
    ql.CloseOverlay = function () {
        $('#overlay-bg').hide();
        $('#overlay').hide();
        if (ql.path) {
            window.location.hash = '#' + ql.path;
            ql.ParsePath()
        }
    };
    ql.CURRENT_LAYOUT = null;
    ql.LAYOUT_CACHE = {};
    ql.LoadLayout = function (layout, callback) {
        if (ql.CURRENT_LAYOUT == layout) {
            ql.OnLayoutLoaded();
            if (callback) {
                callback()
            }
            return
        }
        ql.FlushVertCache();
        ql.CURRENT_LAYOUT = layout;
        if (!ql.LAYOUT_CACHE[layout]) {
            $.ajax({
                type: 'get',
                url: '/layout/' + layout,
                dataType: 'html',
                success: function (data) {
                    ql.LAYOUT_CACHE[layout] = data;
                    ql.LoadLayout_Success(data, layout, callback)
                },
                error: ql.LoadLayout_Error
            })
        } else {
            ql.LoadLayout_Success(ql.LAYOUT_CACHE[layout], layout, callback)
        }
    };
    ql.LoadLayout_Error = function () {};
    ql.LoadLayout_Success = function (data, layout, callback) {
        $('#body-container').html(data);
        $('body').attr('class', 'lyt_' + layout);
        ql.OnLayoutLoaded();
        if (callback) {
            callback()
        }
    };
    ql.ConfirmEulaClose = function () {
        if (confirm("You must agree to the license changes in order to continue playing Quake Live. If you do not wish to agree at this time you will be logged out.\n\nAre you sure you want to log out?")) {
            quakelive.PageRedirect('/user/logout')
        } else {}
    };
    ql.ConfirmEula = function () {
        $.ajax({
            url: '/legals/accept_eula',
            type: 'post',
            complete: function () {
                quakelive.PageRedirect('/user/login_redirect')
            }
        })
    };
    var lastTime = 0;
    ql.Tick = function () {
        lastTime = new Date().getTime()
    };
    var TIMEOUT = 30 * 60 * 1000;
    var CHECKTIME = 60 * 1000;
    var Monitor = function () {
        var now = new Date().getTime();
        if (ql.IsGameRunning()) {
            lastTime = now
        }
        var delta = now - lastTime;
        if (delta > TIMEOUT) {
            var doLogout = function () {
                quakelive.PageRedirect("/user/logout/session_expired");
                $(document).unbind('mousemove')
            };
            var resetTimer = function () {
                lastTime = now;
                setTimeout(Monitor, CHECKTIME)
            };
            $.ajax({
                url: '/forum/pinglastactivity.php',
                cache: false,
                timeout: 15 * 1000,
                dataType: "json",
                cache: false,
                error: doLogout,
                success: function (obj, status) {
                    if (obj['ECODE'] === 0) {
                        var forumDelta = now - obj['lastActivity'];
                        if (forumDelta > TIMEOUT) {
                            doLogout()
                        } else {
                            resetTimer()
                        }
                    } else {
                        doLogout()
                    }
                }
            })
        } else {
            setTimeout(Monitor, CHECKTIME)
        }
    };
    var MAX_CONNECTION_ATTEMPTS = 30;
    var hasRunOnPluginInstall = false;
    ql.OnPluginInstalled = function () {
        if (hasRunOnPluginInstall) {
            return
        }
        hasRunOnPluginInstall = true;
        ql.SetLoadingBlurb('Connecting to QUAKE LIVE network&hellip;');
        var intervalHandle = 0;
        var connectAttempt = 0;

        function FinishOnPluginInstall() {
            var messages = ["Good luck and have fun!", "A frag a day keeps the doctor away&hellip;", "You have arrived.", "Lock and load&hellip;", "OM NOM NOM&hellip;", "Articulating Splines&hellip;", "QUAKE LIVE - It's over 9000!"];
            qlHidePrompt();
            ql.SetLoadingBlurb(messages[parseInt(Math.random() * messages.length)]);
            if (ql.userstatus == 'ACTIVE') {
                ql.ParsePath();
                ql.LoadLayout(ql.activeModule.GetLayout(), function () {
                    ql.SendModuleMessage('OnAuthenticatedInit', ql.userinfo);
                    $(document).bind('mousemove', ql.Tick);
                    ql.Tick();
                    Monitor()
                });
                if (qz_instance.IsCrashDumpPresent()) {
                    quakelive.Overlay('home/crashed', 'CloseCrashReport()', true)
                }
            } else {
                ql.mod_register.OnPluginInstalled()
            }
        }

        function WaitForNetwork() {
            if (!xmppActive) {
                if (connectAttempt++==MAX_CONNECTION_ATTEMPTS) {
                    var html = "We're sorry, but it appears you are having problems connecting to the QUAKE LIVE network. If you are behind a firewall you must make sure that it permits the following connection:<br /><br />Protocol: TCP<br />Host: " + quakelive.siteConfig.xmppDomain + "<br />Port: 5222<br /><br />Contact your network administrator for further instructions, or visit the <a href='/forum/'>QUAKE LIVE forums</a> to look for help.</p>";
                    qlPrompt({
                        title: 'XMPP Connection Failure',
                        body: html,
                        okLabel: 'Keep Trying',
                        ok: function () {
                            connectAttempt = 0;
                            qlHidePrompt()
                        },
                        cancelLabel: 'Logout',
                        cancel: function () {
                            quakelive.Logout()
                        }
                    })
                }
            } else {
                clearInterval(intervalHandle);
                FinishOnPluginInstall()
            }
        }
        intervalHandle = setInterval(WaitForNetwork, 1000);
        WaitForNetwork()
    };
    ql.OnLayoutLoaded = function () {
        ql.LoadPathContent();
        if (ql.params.overlay) {
            ql.Overlay(ql.params.overlay)
        }
        document.title = ql.GetPageTitle();
        ql.SendModuleMessage('OnLayoutLoaded')
    };
    ql.GetPageTitle = function () {
        var title = '';
        if (ql.activeModule.GetTitle) {
            if ((title = ql.activeModule.GetTitle()) !== '') {
                title = ' - ' + title
            }
        }
        return 'QUAKE LIVE' + title
    };
    ql.ShowContent = function (content) {
        $('#qlv_contentBody').html(content)
    };
    ql.GetLoadPath = function () {
        return ql.path
    };
    ql.LoadPathContent = function () {
        $.ajax({
            url: ql.activeModule.GetLoadPath(),
            mode: 'abort',
            port: 'ql_goto',
            success: ql.LoadPathContent_Success,
            error: ql.LoadPathContent_Error
        })
    };
    ql.LoadPathContent_Error = function (xmlHttp, errType, exc) {};
    ql.LoadPathContent_Success = function (data) {
        var module = ql.GetModule(ql.pathParts[0]);
        module.ShowContent(data);
        if (module.DISPLAY.friends && !ql.IsGameRunning()) {
            ql.mod_friends.MoveTo('#qlv_chatControl')
        }
        ql.HideTooltip();
        var selectedName = ql.pathParts[0];
        if (selectedName === 'practice') {
            selectedName = 'home'
        }
        var selNode = $('#newnav_top .selected');
        var navNode = $('#newnav_top #tn_' + selectedName);
        selNode.toggleClass('selected');
        navNode.toggleClass('selected');
        ql.SendModuleMessage('OnContentLoaded', module)
    };
    ql.IsGameRunning = function () {
        if (typeof(qz_instance) != 'undefined') {
            try {
                return qz_instance.IsGameRunning()
            } catch(e) {
                return false
            }
        } else {
            return false
        }
    };
    ql.ShutdownGame = function () {
        if (ql.IsGameRunning()) {
            qz_instance.SendGameCommand("quit;")
        }
    };
    ql.RegisterModule = function (name, module) {
        if (ql.modules[name] != null) {
            return
        }
        ql['mod_' + name] = ql.modules[name] = module;
        if (!module.DISPLAY) {
            module.DISPLAY = {
                friends: true
            }
        }
        if (!module.LAYOUT) {
            module.LAYOUT = 'prelogin'
        }
        if (!module.ShowContent) {
            module.ShowContent = quakelive.ShowContent
        }
        if (!module.GetLoadPath) {
            module.GetLoadPath = quakelive.GetLoadPath
        }
        if (!module.GetLayout) {
            var self = module;
            module.GetLayout = function () {
                return self.LAYOUT
            }
        }
        if (!module.GetTitle) {
            var self = module;
            module.GetTitle = function () {
                return self.TITLE || ''
            }
        }
    };
    ql.InitPlugin = function () {
        run_plugin(quakelive.username, quakelive.xaid)
    };
    ql.SetLoadingBlurb = function (s) {
        $('#loading-blurb').html(s)
    };
    ql.Init = function (json) {
        ql.SetLoadingBlurb('Initializing QUAKE LIVE&hellip;');
        ql.initTime = new Date().getTime();
        if (json) {
            if (json['QUEUED'] == 1) {
                window.location = "/queue.php";
                return
            }
            ql.session = json['SESSION'];
            ql.username = json['USERNAME'];
            ql.xaid = json['XAID'];
            ql.userstatus = json['STATUS'];
            ql.userid = parseInt(json['USERID']);
            ql.userinfo = $.extend({},
            json['INFO']);
            ql.cvars.Import($.extend({},
            json['CVARS']));
            ql.binds.Import($.extend({},
            json['BINDS']));
            locdb.LoadLocations(json['LOCATIONS'])
        } else {
            quakelive.session = null;
            quakelive.username = null;
            quakelive.password = null;
            quakelive.userid = 0;
            quakelive.userstatus = '';
            quakelive.userinfo = {}
        }
        quakelive.serverManager = new quakelive.ServerManager();
        quakelive.serverView = new quakelive.ServerIconView();
        quakelive.serverManager.listener = quakelive.serverView;
        $.ajaxSetup({
            cache: false
        });
        $('#ajax_loading_indicator').ajaxStart(function () {
            $(this).fadeIn('fast')
        }).ajaxStop(function () {
            $(this).fadeOut('fast')
        });
        for (var index in ql.siteConfig) {}
        for (var modName in ql.modules) {
            var module = ql.modules[modName];
            if (module.Init) {
                module.Init()
            }
        }
        if (ql.userinfo && parseInt(ql.userinfo.EULA_OUTDATED)) {
            ql.ParsePath('legals/eula_updated');
            ql.LoadLayout(ql.activeModule.GetLayout())
        } else if (quakelive.userstatus == 'UNVERIFIED') {
            ql.ParsePath('register/2a');
            ql.LoadLayout(ql.activeModule.GetLayout())
        } else if (quakelive.IsLoggedIn()) {
            ql.SetLoadingBlurb('Starting QUAKE LIVE plugin&hellip;');
            ql.InitPlugin()
        } else {
            ql.ParsePath();
            ql.LoadLayout(ql.activeModule.GetLayout())
        }
        ql.StartPathMonitor()
    };
    ql.InitPopup = function (json, is_ssl) {
        ql.initTime = new Date().getTime();
        ql.is_ssl = is_ssl;
        ql.session = json['SESSION'];
        ql.username = json['USERNAME'];
        ql.xaid = json['XAID'];
        ql.userstatus = json['STATUS'];
        ql.userid = parseInt(json['USERID']);
        $.ajaxSetup({
            cache: false
        });
        $('#ajax_loading_indicator').ajaxStart(function () {
            $(this).fadeIn('fast')
        }).ajaxStop(function () {
            $(this).fadeOut('fast')
        });
        for (var index in ql.siteConfig) {}
        var popup = null;
        for (i in ql.popups) {
            var p = ql.popups[i];
            if (p.name = json.popup_name) {
                popup = p
            }
        }
        for (var module in popup.modules) {
            if (module.Init) {
                module.Init()
            }
        }
        ql.ParsePath();
        ql.StartPathMonitor()
    };
    ql.SendModuleMessage = function (msg, args, specificModuleName) {
        var handled = false;
        for (var modName in ql.modules) {
            if (specificModuleName && modName != specificModuleName) {
                continue
            }
            var module = ql.modules[modName];
            if (!module[msg]) {
                continue
            }
            if (module[msg](args)) {
                handled = true
            }
        }
        if (ql.hooks[msg]) {
            for (var i in ql.hooks[msg]) {
                ql.hooks[msg][i](args)
            }
        }
        return handled
    };
    ql.GetModule = function (name) {
        return ql.modules[name] || {}
    };
    ql.HideTooltip = function () {
        ql.matchtip.HideMatchTooltip(-1);
        ql.statstip.HideStatsTooltip()
    };
    ql.HideOverlay = function () {
        $('#overlay').hide();
        $('#overlay-bg').hide();
        $('#qlv_OverlayContent').empty();
        quakelive.mod_prefs.CloseOverlay();
        $('.jqmWindow').jqmHide()
    };
    ql.Eval = function (json) {
        try {
            var obj = JSON.parse(json);
            return obj
        } catch(e) {
            return null
        }
    };
    ql.IsSecure = function () {
        return quakelive.is_ssl
    };
    ql.IsLoggedIn = function () {
        return quakelive.userid != 0
    };
    ql.IsMozilla = function () {
        var browser = ql.IdentifyBrowser(navigator.userAgent);
        return (browser && browser.name == 'mozilla') || false
    };
    ql.IsSafari = function () {
        var browser = ql.IdentifyBrowser(navigator.userAgent);
        return (browser && browser.name == 'safari') || false
    };
    ql.IsOpera = function () {
        var browser = ql.IdentifyBrowser(navigator.userAgent);
        return (browser && browser.name == 'opera') || false
    };
    ql.IsChrome = function () {
        var browser = ql.IdentifyBrowser(navigator.userAgent);
        return (browser && browser.name == 'chrome') || false
    };
    ql.IsLinux = function () {
        var os = ql.IdentifyOS(navigator.userAgent);
        return (os && os.name == 'linux') || false
    };
    ql.IsWindows = function () {
        var os = ql.IdentifyOS(navigator.userAgent);
        return (os && os.name == 'windows') || false
    };
    ql.IsMacintosh = function () {
        var os = ql.IdentifyOS(navigator.userAgent);
        return (os && os.name == 'macintosh') || false
    };
    ql.IsVista = function () {
        var os = ql.IdentifyOS(navigator.userAgent);
        return (os && os.name == 'windows' && parseInt(os.versionNumber) == 6) || false
    };
    ql.IsIE6 = function () {
        var browser = ql.IdentifyBrowser(navigator.userAgent);
        return (browser && parseInt(browser.versionNumber) == 6) || false
    };
    ql.IsMSIE = function () {
        var browser = ql.IdentifyBrowser(navigator.userAgent);
        return (browser && browser.name == 'msie') || false
    };
    var platformVersions = {
        'macintosh': {
            'mozilla': 3.5,
            'safari': 1.0
        },
        'linux': {
            'mozilla': 3.0
        },
        'windows': {
            'msie': 7,
            'mozilla': 1.5
        }
    };
    ql.IdentifyVersion = function (regexes, str) {
        var result = null;
        for (var index in regexes) {
            var re = new RegExp(regexes[index], 'gi');
            var matches = re.exec(str);
            var info = {
                'name': '',
                'version': '0',
                'versionNumber': 0
            };
            if (matches) {
                for (var i = 1; i < matches.length; ++i) {
                    var v = matches[i];
                    while (v.indexOf('_') != -1) {
                        v = v.replace('_', '.')
                    }
                    var vn = parseFloat(v);
                    if (vn > info.version) {
                        info.version = v;
                        info.versionNumber = vn
                    }
                }
                info.name = index;
                result = info;
                break
            }
        }
        return result
    };
    var OS_REGEX = {
        'windows': 'Win(?:dows)?(?:\\s?(?:NT|XP)?)?\\s+([\\d\\.]+)',
        'macintosh': 'Intel\\s+Mac(?:intosh)?\\s+OS\\s+X(?:\\s+([\\d_\\.]+))',
        'linux': '(Linux)'
    };
    ql.IdentifyOS = function (ua) {
        return ql.IdentifyVersion(OS_REGEX, ua)
    };
    var BROWSER_REGEX = {
        'mozilla': '(?:Firefox|Iceweasel|Icecat|Shiretoko|Namoroka|Minefield|GranParadiso)[\\/\\s]+([\\d\\.]+)',
        'chrome': 'Chrome\\/([\\d\\.]+)',
        'safari': 'Safari\\/([\\d\\.]+)',
        'opera': 'Opera\\/([\\d\\.]+)',
        'msie': 'MSIE\\s+([\\d\\.]+)'
    };
    ql.IdentifyBrowser = function (ua) {
        return ql.IdentifyVersion(BROWSER_REGEX, ua)
    };
    ql.IsCompatibleBrowser = function (ua) {
        if (ql.IsLoggedIn()) {
            return true
        }
        if (ql.siteConfig.realm == 'qztest' || ql.siteConfig.realm == 'focus' || ql.siteConfig.realm == 'qztest-jah') {
            return true
        }
        if (arguments.length == 0) {
            ua = navigator.userAgent
        }
        var os = ql.IdentifyOS(ua);
        if (!os || !platformVersions[os.name]) {
            return false
        }
        var browser = ql.IdentifyBrowser(ua);
        if (!browser || !platformVersions[os.name][browser.name]) {
            return false
        }
        minVersions = platformVersions[os.name];
        if (browser.version < minVersions[browser.name]) {
            return false
        }
        return true
    };
    ql.CheckBrowserCompat = function () {
        if (!ql.IsCompatibleBrowser()) {
            var html = ["We're sorry, but it appears that you are using an incompatible system.", "To play QUAKE LIVE you must use one of the following Operating Systems and Web Browsers:", "<br /><br />", "<ul style='margin: 5px'>", "<li>Windows XP / Windows Vista / Windows 7</li>", "<li>Intel Mac OSX 10.4 or higher</li>", "<li>Linux (LSB 3.0 or higher)</li>", "</ul>", "<ul style='margin: 5px'>", "<li>Firefox 2.0 or higher (Mac OSX requires Firefox 3.5+)</li>", "<li>Internet Explorer 7 or higher</li>", "<li>Safari 3.0 or higher</li>", "</ul>", "<br />", "<center>", "<img src='", quakelive.resource("/images/site/logo_os_win.png"), "' width='40' height='40' style='margin: 0 10px' />", "<img src='", quakelive.resource("/images/site/logo_os_mac.png"), "' width='40' height='40' style='margin: 0 10px' />", "<img src='", quakelive.resource("/images/site/logo_os_linux.png"), "' width='40' height='40' style='margin: 0 10px' />", "<img src='", quakelive.resource("/images/site/logo_browser_ff.png"), "' width='40' height='40' style='margin: 0 10px' />", "<img src='", quakelive.resource("/images/site/logo_browser_ie.png"), "' width='40' height='40' style='margin: 0 10px' />", "<img src='", quakelive.resource("/images/site/logo_browser_safari.png"), "' width='40' height='40' style='margin: 0 10px' />", "</center>", "<br />", "Support for additional browsers is under development.", "<br />", "<br />", "<small style='text-align: center; display: block' onclick='this.innerHTML=navigator.userAgent'>Show your browser identification</small>"].join('');
            qlPrompt({
                title: 'Incompatible Browser',
                body: html,
                fatal: false,
                alert: true
            });
            return false
        }
        return true
    };
    ql.AddHook = function (name, fn) {
        if (!ql.hooks[name]) {
            ql.hooks[name] = []
        }
        ql.hooks[name][ql.hooks[name].length] = fn
    };
    ql.AddOnceHook = function (name, fn) {
        var actualHook = function (args) {
            fn(args);
            ql.RemoveHook(name, actualHook)
        };
        ql.AddHook(name, actualHook)
    };
    ql.RemoveHook = function (name, fn) {
        var list = ql.hooks[name];
        var nList = list.length;
        for (var i = nList - 1; i >= 0; --i) {
            if (list[i] === fn) {
                list.splice(i, 1);
                return
            }
        }
    };
    ql.PreloadImages = function () {
        for (var i = 0; i < arguments.length; ++i) {
            $('<img>').attr('src', arguments[i])
        }
    };
    ql.PreloadClasses = function () {
        for (var i = 0; i < arguments.length; ++i) {
            $('<div>').attr('class', arguments[i])
        }
    };
    ql.TrackPageView = function (path) {
        if (ql.siteConfig.trackPageViews && typeof(pageTracker) != 'undefined') {
            if (path[0] != '/') {
                pageTracker._trackPageview('/' + path)
            } else {
                pageTracker._trackPageview(path)
            }
        }
    };
    ql.querystring = {};
    if (window.location.search) {
        var search = window.location.search.substring(1);
        var parts = search.split('&');
        for (var i = 0; i < parts.length; ++i) {
            var varval = parts[i].split('=', 2);
            ql.querystring[varval[0]] = varval[1]
        }
    };
    ql.Logout = function () {
        quakelive.PageRedirect('/user/logout')
    };
    ql.DbGameTypes = {
        Dm: 0,
        Duel: 1,
        Single: 2,
        TeamDm: 3,
        ClanArena: 4,
        Ctf: 5,
        Invalid: 255
    };
    var gameTypes = [{
        id: ql.DbGameTypes.Dm,
        name: 'dm',
        title: 'Death Match'
    },
    {
        id: ql.DbGameTypes.Duel,
        name: 'duel',
        title: 'Duel'
    },
    {
        id: ql.DbGameTypes.Single,
        name: 'single',
        title: 'Single Player'
    },
    {
        id: ql.DbGameTypes.TeamDm,
        name: 'tdm',
        title: 'Team DM'
    },
    {
        id: ql.DbGameTypes.ClanArena,
        name: 'ca',
        title: 'Clan Arena'
    },
    {
        id: ql.DbGameTypes.Ctf,
        name: 'ctf',
        title: 'Capture the Flag'
    }];
    var INVALID_GAMETYPE = {
        'id': ql.DbGameTypes.Invalid,
        'name': 'uk',
        'title': 'Unknown Gametype'
    };
    ql.GetGameTypeByID = function (id) {
        for (var gtIndex in gameTypes) {
            var elem = gameTypes[gtIndex];
            if (elem.id == id) {
                return elem
            }
        }
        return INVALID_GAMETYPE
    };
    ql.GetGameTypeByName = function (name) {
        for (var gtIndex in gameTypes) {
            var elem = gameTypes[gtIndex];
            if (elem.name == name) {
                return elem
            }
        }
        return INVALID_GAMETYPE
    };
    ql.IsTeamGameType = function (type) {
        return (type == ql.DbGameTypes.TeamDm || type == ql.DbGameTypes.ClanArena || type == ql.DbGameTypes.Ctf)
    };
    ql.ShowLoadingPacifier = function () {
        $('#loading_pacifier').show()
    };
    ql.HideLoadingPacifier = function () {
        $('#loading_pacifier').hide()
    };
    var PATH_MONITOR_TIME = 200;
    var pathMonInfo = {};
    ql.SetMonitorPath = function (path) {
        pathMonInfo.lastPath = path
    };
    ql.StartPathMonitor = function () {
        ql.StopPathMonitor();
        pathMonInfo.lastPath = window.location.hash;
        pathMonInfo.thHandle = setInterval(ql.CheckPathForUpdates, PATH_MONITOR_TIME)
    };
    ql.StopPathMonitor = function () {
        if (pathMonInfo.thHandle) {
            clearInterval(pathMonInfo.thHandle);
            pathMonInfo.thHandle = 0
        }
    };
    ql.GotoCurrentPath = function () {
        quakelive.ParsePath();
        quakelive.LoadLayout(quakelive.activeModule.GetLayout())
    };
    ql.CheckPathForUpdates = function () {
        if (pathMonInfo.lastPath != window.location.hash) {
            var skipGoto = false;
            if (ql.activeModule.skipMatchingPathUpdates) {
                if (ql.activeModule.skipMatchingPathUpdates.test(window.location.hash)) {
                    skipGoto = true
                }
            }
            if (!skipGoto) {
                quakelive.Goto(window.location.hash.substring(1))
            }
            pathMonInfo.lastPath = window.location.hash
        }
    };
    ql.LoadSiteConfig = function (config) {
        var siteConfig = $.extend({},
        ql.defaultSiteConfig, config);
        for (var index in siteConfig) {
            if (typeof(siteConfig[index]) != 'string') {
                continue
            }
            var str = siteConfig[index];
            str = str.replace(/%LOCATION%/g, window.location.hostname);
            var hostParts = window.location.hostname.toLowerCase().split(".");
            str = str.replace(/%HOSTNAME%/g, hostParts[0]);
            siteConfig[index] = str
        }
        ql.siteConfig = siteConfig
    };
    ql.PageRedirect = function (url) {
        window.location = url
    };
    ql.Popup = function (choice) {
        var options = "";
        for (var i in choice.options) {
            if (options.length == 0) {
                options += i + "=" + choice.options[i]
            } else {
                options += "," + i + "=" + choice.options[i]
            }
        }
        var obj = {
            "SESSION": ql.session,
            "USERNAME": ql.username,
            "XAID": ql.xaid,
            "USERID": ql.userid,
            "STATUS": ql.userstatus,
            "popup_name": choice.name
        };
        var url = "";
        if (choice.secure == true) {
            url += "https://"
        } else {
            url += "http://"
        }
        url += document.domain;
        url += choice.url + "?" + Base64.encode(JSON.stringify(obj));
        window.open(url, choice.title, options)
    };
    ql.popups = {
        SocialInvite: {
            "name": "SocialInvite",
            "url": "/friends/social/a",
            "title": "Address Book Search",
            "secure": true,
            "options": {
                "location": "no",
                "menubar": "no",
                "scrollbars": "yes",
                "status": "yes",
                "titlebar": "yes",
                "resizable": "no",
                "height": 250,
                "width": 700,
                "directories": "no",
                "screenX": 30,
                "screenY": 30
            },
            "modules": ["friends"]
        }
    };
    window.IsMacintosh = quakelive.IsMacintosh;
    window.IsWindows = quakelive.IsWindows;
    window.IsLinux = quakelive.IsLinux;
    window.IsVista = quakelive.IsVista;
    window.IsMozilla = quakelive.IsMozilla;
    window.IsSafari = quakelive.IsSafari;
    window.IsMSIE = quakelive.IsMSIE;
    window.IsIE6 = quakelive.IsIE6;
    window.IsChrome = quakelive.IsChrome;
    window.IsOpera = quakelive.IsOpera;
    ql.LoadSiteConfig(window.SITECONFIG)
})(jQuery);

function EncodeURL(str) {
    str = str.replace(/\+/g, "%2B");
    str = str.replace(/\ /g, "%20");
    str = str.replace(/\&/g, "%26");
    str = str.replace(/\?/g, "%3F");
    str = str.replace(/\//g, "%2F");
    return str
}

function CreateCookie(name, value, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString()
    } else var expires = "";
    s = name + "=" + value + expires + "; path=/";
    document.cookie = s
}

function ReadCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1, c.length)
        }
        if (c.indexOf(nameEQ) == 0) {
            return c.substring(nameEQ.length, c.length)
        }
    }
    return null
}

function EraseCookie(name) {
    CreateCookie(name, "", -1)
}

function FormatError(e) {
    return 'Name:' + e.name + ' Num:' + e.number + ' Desc:' + e.description + ": " + e
}

function StartPacifier(selector, msg) {
    $(selector).html("<span class='pacifier-active'>" + msg + "</span>").show()
}

function StopPacifier(selector, msg, timeout) {
    $(selector).html("<span class='pacifier-inactive'>" + msg + "</span>");
    if (timeout) {
        setTimeout("ClearPacifier(\"" + selector + "\")", timeout)
    }
}

function ClearPacifier(selector) {
    $(selector).empty()
}

function StripColors(str) {
    if (str == null || str.length == 0) return '';
    return str.replace(/(\^[0-9])/g, "").replace(/\^/g, "")
}

function ParseModelSkin(modelskin) {
    var result = {
        model: '',
        skin: ''
    };
    var parts = modelskin.split("/");
    if (parts.length >= 2) {
        result.model = parts[0].toLowerCase();
        result.skin = parts[1].toLowerCase()
    } else {
        result.model = parts[0].toLowerCase();
        result.skin = "default"
    }
    if (result.model[0] == "*") {
        result.model = result.model.substring(1)
    }
    return result
}

function PlayerIconSet(model, skin) {
    this.model = model.toLowerCase();
    this.skin = skin.toLowerCase();
    this.modelskin = this.model + '_' + this.skin;
    this.small = ("<img src='" + quakelive.resource("/images/players/icon_sm/" + this.model + "_" + this.skin + ".jpg") + "' width='18' height='18' />");
    this.medium = ("<img src='" + quakelive.resource("/images/players/icon_md/" + this.model + "_" + this.skin + ".jpg") + "' width='30' height='30' />");
    this.large = ("<img src='" + quakelive.resource("/images/players/icon_lg/" + this.model + "_" + this.skin + ".jpg") + "' width='43' height='43' />");
    this.friend_large = ("<img src='" + quakelive.resource("/images/players/icon_xl/" + this.model + "_" + this.skin + ".jpg") + "' width='62' height='62' />")
}

function RemoveArrayIndex(inputArray, removeIndex) {
    var newArray = null;
    if (removeIndex == 0) {
        newArray = inputArray.slice(1)
    } else if (removeIndex == inputArray.length - 1) {
        newArray = inputArray.slice(0, inputArray.length - 1)
    } else {
        newArray = inputArray.slice(0, removeIndex).concat(inputArray.slice(removeIndex + 1))
    }
    return newArray
}

function ECODE_SUCCESS(eCode) {
    if (typeof(eCode) == 'number') {
        return eCode == 0
    } else if (typeof(eCode) == 'string') {
        return (eCode.length == 1 && eCode.charAt(0) == '0')
    } else {
        return false
    }
};

function FormatNumber(num) {
    return "" + (1 * num)
};

function isEmailValid(e) {
    var filter = /^[a-z0-9.!\#$%&\'*+-\/=?^_`{|}~]+@([0-9.]+|([^\s\'"<>]+\.+[a-z]{2,6}))$/;
    if (filter.test(e)) {
        return true
    } else {
        return false
    }
}
var SECS_IN_MINUTE = 60;
var SECS_IN_HOUR = 60 * 60;
var SECS_IN_DAY = 86400;
var SECS_IN_WEEK = 86400 * 7;
var SECS_IN_YEAR = 86400 * 365;
var SECS_IN_MONTH = 86400 * 30;

function DecomposeTimeDelta(secs) {
    var years = parseInt(secs / SECS_IN_YEAR);
    secs -= years * SECS_IN_YEAR;
    var months = parseInt(secs / SECS_IN_MONTH);
    secs -= months * SECS_IN_MONTH;
    var weeks = parseInt(secs / SECS_IN_WEEK);
    secs -= weeks * SECS_IN_WEEK;
    var days = parseInt(secs / SECS_IN_DAY);
    secs -= days * SECS_IN_DAY;
    var hours = parseInt(secs / SECS_IN_HOUR);
    secs -= hours * SECS_IN_HOUR;
    var mins = parseInt(secs / SECS_IN_MINUTE);
    secs -= mins * SECS_IN_MINUTE;
    var struct = {
        'years': years,
        'months': months,
        'weeks': weeks,
        'days': days,
        'hours': hours,
        'mins': mins,
        'secs': secs
    };
    return struct
}

function FormatDuration(secs) {
    var mins = parseInt(secs / 60);
    secs -= mins * 60;
    var timeString = "";
    if (mins < 10) {
        timeString += "0"
    }
    timeString += mins;
    timeString += ":";
    if (secs < 10) {
        timeString += "0"
    }
    timeString += secs;
    return timeString
}

function FormatNumberNicely(num) {
    var niceNames = [0, 'one', 'two', 'three', 'four', 'five', 'six'];
    if (niceNames[num]) {
        return niceNames[num]
    } else {
        return num
    }
}

function GetFriendlyTimeDelta(delta) {
    var det = DecomposeTimeDelta(delta);
    if (det.years > 0) {
        if (det.years == 1) {
            return 'last year'
        } else {
            return FormatNumberNicely(det.years) + ' years ago'
        }
    }
    if (det.months > 0) {
        if (det.months == 1) {
            return 'last month'
        } else {
            return FormatNumberNicely(det.months) + ' months ago'
        }
    }
    if (det.weeks > 0) {
        if (det.weeks == 1) {
            return 'last week'
        } else {
            return FormatNumberNicely(det.weeks) + ' weeks ago'
        }
    }
    if (det.days > 0) {
        if (det.days == 1) {
            return 'yesterday'
        } else {
            return FormatNumberNicely(det.days) + ' days ago'
        }
    }
    if (det.hours > 0) {
        if (det.hours == 1) {
            return '1 hour ago'
        } else {
            return FormatNumberNicely(det.days) + ' hours ago'
        }
    }
    if (det.mins > 45) {
        return 'about an hour ago'
    } else if (det.mins >= 25) {
        return 'about half an hour ago'
    } else {
        return 'just now'
    }
}

function GetSkillRankInfo(server, userSkill) {
    if (server.g_needpass) {
        return {
            delta: -2,
            img: quakelive.resource("/images/sf/login/rank_private.png"),
            desc: "<span style='color: #ff0'>Private Match</span>",
            color: "#ffffff"
        }
    }
    if (!server.ranked) {
        return {
            delta: -1,
            img: quakelive.resource("/images/sf/login/rank_unranked.png"),
            desc: "<span style='color: #ff0'>Unranked Server</span>",
            color: "#ffffff"
        }
    }
    if (server.skillTooHigh) {
        return {
            delta: -1,
            img: quakelive.resource("/images/sf/login/rank_x.png"),
            desc: "<span style='color: #fff'>Your Skill Too High</span>",
            color: "#ffffff"
        }
    }
    var skillDelta = server.skillDelta;
    var result = {
        delta: skillDelta,
        img: quakelive.resource("/images/sf/login/rank_" + skillDelta + ".png")
    };
    switch (skillDelta) {
    case 0:
        result.desc = "Your Skill Higher";
        result.color = "#ffffff";
        break;
    case 1:
        result.desc = "Skill Matched";
        result.color = "#39c50a";
        break;
    case 2:
        result.desc = "More Challenging";
        result.color = "#f5c276";
        break;
    case 3:
        result.desc = "Very Difficult";
        result.color = "#ef422e";
        break;
    default:
        result.desc = "Unknown";
        result.color = "#ffffff";
        break
    }
    return result
};

function FormatRank(rank) {
    var mod100 = rank % 100;
    var mod10 = rank % 10;
    var suffix;
    if (mod10 == 1 && mod100 != 11) {
        suffix = 'st'
    } else if (mod10 == 2 && mod100 != 12) {
        suffix = 'nd'
    } else if (mod10 == 3 && mod100 != 13) {
        suffix = 'rd'
    } else {
        suffix = 'th'
    }
    return rank + suffix
}

function cloneObject(obj) {
    for (i in obj) {
        this[i] = obj[i]
    }
}

function FormatTimeDelta(delta) {
    if (delta >= 86400 * 30) {
        num = Math.round(delta / (86400 * 30));
        if (num != 1) return num + " months";
        else return num + " month"
    } else if (delta >= 86400) {
        num = Math.round(delta / 86400);
        if (num != 1) return num + " days";
        else return num + " day"
    } else if (delta >= 3600) {
        num = Math.round(delta / 3600);
        if (num != 1) return num + " hours";
        else return num + " hour"
    } else if (delta >= 60) {
        num = Math.round(delta / 60);
        if (num != 1) return num + " minutes";
        else return num + " minute"
    } else {
        return "1 minute"
    }
}

function Clamp(val_in, min_in, max_in) {
    if (val_in < min_in) {
        return min_in
    } else if (val_in > max_in) {
        return max_in
    }
    return val_in
}

function ChangeModelSkin(modelSkin, newSkin) {
    var parts = modelSkin.split("_");
    var result = "";
    for (var i = 0; i < parts.length - 1; ++i) {
        result += parts[i] + "_"
    }
    result += newSkin;
    return result
}

function FirstDefined() {
    for (var i = 0; i < arguments.length; ++i) {
        if (typeof(arguments[i]) != 'undefined') {
            return arguments[i]
        }
    }
}

function StripSlashes(str) {
    str = str.replace(/\\'/g, '\'');
    str = str.replace(/\\"/g, '"');
    str = str.replace(/\\\\/g, '\\');
    str = str.replace(/\\0/g, '\0');
    return str
}

function qlPrompt(o) {
    o = $.extend({
        title: '',
        body: '',
        input: false,
        inputLabel: '',
        inputReadOnly: false,
        ok: function () {
            $('#prompt').jqmHide()
        },
        okLabel: 'OK',
        cancel: function () {
            $('#prompt').jqmHide()
        },
        cancelLabel: 'Cancel',
        alert: false,
        fatal: false
    },
    o);
    if ($('#prompt').length === 0) {
        $('body').append('<div id="prompt" class="modal"></div>')
    }
    $('#prompt').html(['<div class="modal-title">', o.title, '</div>', '<div class="modal-content">', o.body, '<div class="modal-feedback"></div>', '<form>', '<div id="modal-input"><input/></div>', '<div id="modal-buttons" style="text-align: center">', '<input id="modal-ok" type="button"/>', '<input id="modal-cancel" type="button"/>', '</form>', '</div>', '</div>'].join(''));
    if (o.input) {
        $('#modal-input').css('display', 'block');
        if (o.inputReadOnly) {
            $('#modal-input input').attr('readonly', 'readonly')
        }
    } else {
        $('#modal-input').css('display', 'none')
    }
    if (o.alert) {
        $('#modal-cancel').css('display', 'none')
    } else {
        $('#modal-cancel').css('display', 'inline')
    }
    if (o.fatal) {
        $('#prompt').addClass('fatal');
        var close = $('#modal-buttons').html('<input id="modal-reload" type="button" value="Reload"/>');
        close.click(function () {
            window.location.reload()
        })
    } else {
        $('#prompt').removeClass('fatal')
    }
    $('#modal-input input').val(o.inputLabel);
    $('#modal-ok').val(o.okLabel);
    $('#modal-cancel').val(o.cancelLabel);
    $('#prompt form').submit(function () {
        o.ok();
        return false
    });
    $('#modal-ok').click(o.ok);
    $('#modal-cancel').click(o.cancel);
    $('#prompt').jqm({
        modal: true
    });
    $('#prompt').jqmShow();
    if (o.input) {
        $('#modal-input input').focus().get()[0].select()
    }
}

function qlHidePrompt() {
    $('#prompt').jqmHide()
}

function ZeroPad(num) {
    if (num < 10) {
        return '0' + num
    } else {
        return '' + num
    }
}
var version_windows = [0, 1, 0, 263];
var version_linux = [0, 1, 0, 263];
var version_mac = [0, 1, 0, 263];
var version = [0, 1, 0, 263];
var CLSID = '70A1ADC3-9C2D-4F7C-B189-55C5CF397F1C';
var MIME_TYPE = 'application/x-id-quakelive';
var BUILD_NUMBER = version[3];
var version;
if (IsLinux()) {
    version = version_linux
} else if (IsMacintosh()) {
    version = version_mac
} else {
    version = version_windows
}
var check_version = version.join(".");
var check_version_comma = version.join(",");
var current_version = 'NA';
var ie_cookie_string = 'quakelive_upgrade';
var debug_install = false;

function OSGetName() {
    if (IsLinux()) {
        return 'os_linux'
    } else if (IsMacintosh()) {
        return 'os_mac'
    } else {
        return 'os_win'
    }
}

function BrowserGetName() {
    if (IsMSIE()) {
        return 'msie'
    } else if (IsChrome()) {
        return 'chrome'
    } else if (IsSafari()) {
        return 'safari'
    } else if (IsMozilla()) {
        return 'mozilla'
    } else {
        return 'unknown'
    }
}
window.qz_instance = undefined;

function VersionListener() {
    this.VersionTooOld = function (plugin, version) {};
    this.VersionTooNew = function (plugin, version) {};
    this.VersionOk = function (plugin, version) {};
    this.HandshakeFailed = function (plugin) {};
    this.PluginNotInstalled = function (plugin) {}
};

function StartupVersionListener() {
    var MAX_VERIFICATION_ATTEMPTS = 30;
    this.prototype = new VersionListener();
    this.waitingForInstall = false;
    this.curVersion = 0;
    this.GotoPluginInstall = function (plugin) {
        if (!this.waitingForInstall) {
            var self = this;

            function DoUpdateAndWatchInstallState() {
                if (quakelive.activeModule == quakelive.mod_register) {
                    self.UpdateInstallState(self.curInstallStates, self.curVersion);
                    self.WaitForInstall(plugin);
                    quakelive.RemoveHook('OnContentLoaded', DoUpdateAndWatchInstallState)
                }
            }
            quakelive.AddHook('OnContentLoaded', DoUpdateAndWatchInstallState);
            quakelive.ParsePath('register/2b/install');
            quakelive.LoadLayout(quakelive.activeModule.GetLayout())
        }
    };
    var InstallStates = {
        Hidden: 'hidden',
        Checking: 'checking',
        Completed: 'complete',
        Restart: 'restart',
        TooNew: 'toonew'
    };
    this.WaitForInstall = function (plugin) {
        var self = this;
        this.waitingForInstall = true;

        function DoInstallCheck() {
            plugin.CheckVersion(5, self)
        };
        if (this.watchInstallHandle) {
            clearInterval(this.watchInstallHandle)
        }
        this.watchInstallHandle = setInterval(DoInstallCheck, 10000);
        DoInstallCheck()
    };
    this.freshPluginInstall = false;
    this.baseInstallStates = {
        'plugin': InstallStates.Hidden,
        'content': InstallStates.Hidden
    };
    this.curInstallStates = $.extend({},
    this.baseInstallStates);
    this.UpdateInstallState = function (inStates, clientVersion) {
        var states = $.extend({},
        this.baseInstallStates, inStates);
        if ($.browser.msie && states.plugin == InstallStates.Checking && ReadCookie('plugin_active') !== null) {
            states.plugin = InstallStates.Restart
        }
        this.curVersion = clientVersion;
        $('.install_client_version').text(this.curVersion === 0 ? 'None' : this.curVersion);
        $('.install_server_version').text(version.join('.'));
        if (states.plugin != InstallStates.Restart && states.plugin == InstallStates.Checking && states.plugin != this.curInstallStates.plugin) {
            if (ReadCookie(ie_cookie_string)) {
                upgrade()
            } else {
                setTimeout(upgrade, 3000)
            }
        }
        var self = this;
        var os_name = OSGetName();
        var browser_name = 'browser_' + BrowserGetName();
        for (var f in states) {
            var stateName = states[f];
            var $groupNode = $('#group_' + f);
            if (typeof(states[f]) != 'undefined') {
                if (states[f] == InstallStates.Hidden) {
                    $groupNode.find('.stage').hide()
                } else {
                    var $oldActive = $groupNode.find('.active_stage');
                    $oldActive.removeClass('active_stage');
                    $groupNode.find('.stage_' + stateName).each(function () {
                        var $this = $(this);
                        if (($this.hasClass(os_name) || $this.hasClass('os_any')) && ($this.hasClass(browser_name) || $this.hasClass('browser_any')) && (!$this.hasClass('not' + browser_name) && !$this.hasClass('not' + os_name)) && ((self.freshPluginInstall && $this.hasClass('mode_install')) || (!self.freshPluginInstall && $this.hasClass('mode_upgrade')))) {
                            $this.addClass('active_stage');
                            $this.find('.installer_url').attr('href', GetInstallerUrl())
                        }
                    })
                }
            }
            this.curInstallStates[f] = states[f]
        }
    };
    this.VersionOk = function (plugin, clientVersion) {
        CreateCookie('QLV', clientVersion, 365);
        clearInterval(this.watchInstallHandle);
        this.watchInstallHandle = null;
        this.UpdateInstallState({
            'plugin': InstallStates.Completed,
            'content': InstallStates.Checking
        },
        clientVersion);
        this.verificationAttempt = 0;
        var self = this;
        this.verifyGameHandle = null;

        function VerifyGameInterval() {
            try {
                self.verificationAttempt++;
                self.VerifyGameInstall(plugin);
                clearInterval(self.verifyGameHandle);
                self.verifyGameHandle = null
            } catch(e) {
                if (self.verificationAttempt > MAX_VERIFICATION_ATTEMPTS) {
                    EraseCookie(ie_cookie_string);
                    quakelive.PageRedirect('/user/login_redirect');
                    clearInterval(self.verifyGameHandle);
                    self.verifyGameHandle = null
                }
            }
        };
        this.verifyGameHandle = setInterval(VerifyGameInterval, 1000)
    };
    this.VersionTooOld = function (plugin, clientVersion) {
        plugin.RemoveObject();
        this.UpdateInstallState({
            plugin: InstallStates.Checking
        },
        clientVersion);
        if (!this.waitingForInstall) {
            this.GotoPluginInstall(plugin)
        }
    };
    this.VersionTooNew = function (plugin, clientVersion) {
        plugin.RemoveObject();
        this.UpdateInstallState({
            plugin: InstallStates.TooNew
        },
        clientVersion);
        if (!this.waitingForInstall) {
            this.GotoPluginInstall(plugin)
        }
    };
    this.HandshakeFailed = function (plugin) {
        plugin.RemoveObject();
        this.UpdateInstallState({
            plugin: InstallStates.Checking
        },
        0);
        if (!this.waitingForInstall) {
            this.GotoPluginInstall(plugin)
        }
    };
    this.PluginNotInstalled = function (plugin) {
        plugin.RemoveObject();
        this.UpdateInstallState({
            plugin: InstallStates.Checking
        },
        0);
        if (!this.waitingForInstall) {
            this.freshPluginInstall = true;
            this.GotoPluginInstall(plugin)
        }
    };
    var verified = false;
    this.VerifyGameInstall = function (plugin) {
        if (verified) {
            return
        }
        verified = true;
        $('#registration_uparrow').remove();
        plugin.UnloadIEHelper();
        plugin.AttachIEEvents();
        CreateCookie('plugin_active', 1, 0);
        qz_instance.SetDeveloperRoot(quakelive.siteConfig.realm);
        qz_instance.SetSession(navigator.userAgent, plugin.username, plugin.password);
        var r = qz_instance.StartDownloads(quakelive.siteConfig.staticUrl, quakelive.siteConfig.cdnUrl);
        if (r) {
            qlPrompt({
                title: 'Fatal Error',
                body: qz_instance.GetErrorCodeString(r) || "Unknown Error",
                fatal: true
            });
            return false
        }
        setInterval(function () {
            qz_instance.IsGameRunning()
        },
        100);
        var self = this;
        var isRequiredDownload = false;

        function CheckDownloadGroup(data) {
            if (data.group > GROUP_BASE) {
                if (isRequiredDownload || self.waitingForInstall) {
                    self.UpdateInstallState({
                        'content': InstallStates.Completed,
                        'playnow': InstallStates.Completed
                    },
                    self.curVersion)
                } else {
                    quakelive.OnPluginInstalled()
                }
                quakelive.RemoveHook('OnDownloadGroup', CheckDownloadGroup)
            }
        }

        function CheckFileXfer(data) {
            if (data.fileName == 'manifest.json') {
                return
            }
            quakelive.RemoveHook('OnFileXferStarted', CheckFileXfer);
            if (qlXfer.currentGroup <= GROUP_BASE) {
                isRequiredDownload = true;

                function SyncInstallState() {
                    if (quakelive.activeModule == quakelive.mod_register) {
                        self.UpdateInstallState(self.curInstallStates, self.curVersion);
                        quakelive.RemoveHook('OnContentLoaded', SyncInstallState)
                    }
                }
                quakelive.AddHook('OnContentLoaded', SyncInstallState);
                quakelive.ParsePath('register/2b/update_content');
                quakelive.LoadLayout(quakelive.activeModule.GetLayout())
            }
        };
        quakelive.AddHook('OnDownloadGroup', CheckDownloadGroup);
        quakelive.AddHook('OnFileXferStarted', CheckFileXfer);
        return true
    }
};

function Plugin(pluginName, mimeType, classId, serverPluginVersion) {
    this.pluginContainerId = '#qz_handshake';
    this.pluginName = pluginName;
    this.mimeType = mimeType;
    this.classId = classId;
    this.serverPluginVersion = serverPluginVersion;
    this.username = undefined;
    this.password = undefined;
    this.pluginRefreshNeedsReload = false;
    this.pluginNeedsLibraryUnloader = $.browser.msie;
    this.Events = [{
        event: 'FileTransferStart',
        handler: 'OnFileXferStarted',
        params: ['fileName', 'fileSize']
    },
    {
        event: 'FileTransferUpdate',
        handler: 'OnFileXferUpdate',
        params: ['transferedAmount']
    },
    {
        event: 'FileTransferDone',
        handler: 'OnFileXferDone',
        params: ['result']
    },
    {
        event: 'GameExit',
        handler: 'OnGameExit',
        params: ['exitCode']
    },
    {
        event: 'InputEventCaptured',
        handler: 'OnInputEvent',
        params: ['exitCode']
    },
    {
        event: 'GameVidRestart',
        handler: 'OnVidRestart',
        params: []
    },
    {
        event: 'CvarChanged',
        handler: 'OnCvarChanged',
        params: ['cvarName', 'cvarValue', 'replicate']
    },
    {
        event: 'BindChanged',
        handler: 'OnBindChanged',
        params: ['keyName', 'keyValue']
    },
    {
        event: 'IM_OnConnected',
        handler: 'IM_OnConnected',
        params: []
    },
    {
        event: 'IM_OnDisconnected',
        handler: 'IM_OnDisconnected',
        params: []
    },
    {
        event: 'IM_OnRosterFilled',
        handler: 'IM_OnRosterFilled',
        params: []
    },
    {
        event: 'IM_OnConnectFail',
        handler: 'IM_OnConnectFail',
        params: []
    },
    {
        event: 'IM_OnKicked',
        handler: 'IM_OnKicked',
        params: []
    },
    {
        event: 'IM_OnMessage',
        handler: 'IM_OnMessage',
        params: ['message_json']
    },
    {
        event: 'IM_OnPresence',
        handler: 'IM_OnPresence',
        params: ['presence_json']
    },
    {
        event: 'IM_OnSubscribeRequest',
        handler: 'IM_OnSubscribeRequest',
        params: ['json']
    },
    {
        event: 'IM_OnItemAdded',
        handler: 'IM_OnItemAdded',
        params: ['json']
    },
    {
        event: 'IM_OnItemRemoved',
        handler: 'IM_OnItemRemoved',
        params: ['json']
    },
    {
        event: 'IM_OnItemSubscribed',
        handler: 'IM_OnItemSubscribed',
        params: ['json']
    },
    {
        event: 'IM_OnItemUpdated',
        handler: 'IM_OnItemUpdated',
        params: ['json']
    },
    {
        event: 'IM_OnSelfPresence',
        handler: 'IM_OnSelfPresence',
        params: ['json']
    },
    {
        event: 'IM_OnPrivacyNames',
        handler: 'IM_OnPrivacyNames',
        params: ['json']
    },
    {
        event: 'IM_OnPrivacyList',
        handler: 'IM_OnPrivacyList',
        params: ['json']
    },
    {
        event: 'IM_OnPrivacyChanged',
        handler: 'IM_OnPrivacyChanged',
        params: ['name']
    },
    {
        event: 'IM_OnPrivacyResult',
        handler: 'IM_OnPrivacyResult',
        params: ['json']
    },
    {
        event: 'TourneyStart',
        handler: 'TourneyStart',
        params: ['errcode', 'json']
    },
    {
        event: 'TourneyMatchCheckin',
        handler: 'TourneyMatchCheckin',
        params: ['errcode', 'json']
    },
    {
        event: 'TourneyBoutStart',
        handler: 'TourneyBoutStart',
        params: ['errcode', 'json']
    },
    {
        event: 'OnDownloadGroup',
        handler: 'OnDownloadGroup',
        params: ['group', 'numfiles', 'size']
    },
    {
        event: 'OnDownloadError',
        handler: 'OnDownloadError',
        params: ['errorcode']
    },
    {
        event: 'LFGNotify',
        handler: 'OnLFGNotify',
        params: ['errcode', 'json']
    },
    {
        event: 'LFGCancel',
        handler: 'OnLFGCancel',
        params: ['json']
    },
    {
        event: 'CommNotice',
        handler: 'OnCommNotice',
        params: ['errorcode', 'json']
    }];
    this.DetachIEEvents = function () {
        if (!$.browser.msie) {
            return
        }
        if (typeof(qz_instance) == 'undefined') {
            return
        }
        for (var index in this.Events) {
            var info = this.Events[index];
            qz_instance.detachEvent(info.event, info.boundFn);
            info.boundFn = null
        }
    };
    window.ondetach = function () {
        alert('detaching');
        pluginx.DetachIEEvents()
    };
    this.AttachIEEvents = function () {
        if (!$.browser.msie) {
            return
        }
        if (typeof(qz_instance) == 'undefined') {
            return
        }

        function MakeBoundEvent(handler) {
            var getHandlerFn = new Function("return " + handler + ";");
            return function () {
                var targetEventFn = getHandlerFn();
                if (typeof(targetEventFn) == 'function') {
                    targetEventFn.apply(null, arguments)
                }
            }
        }
        for (var index in this.Events) {
            var info = this.Events[index];
            info.boundFn = MakeBoundEvent(info.handler);
            qz_instance.attachEvent(info.event, info.boundFn)
        }
    };
    this.SetCredentials = function (username, password) {
        this.username = username;
        this.password = password
    };
    this.ieHelperHandle = null;
    this.LoadIEHelper = function () {
        if (this.ieHelperHandle !== null) {
            return true
        }
        if ($('#iehelper_container').length == 0) {
            $('body').append('<div id="iehelper_container"></div>')
        }
        $('#iehelper_container').empty();
        CollectGarbage();
        try {
            $('#iehelper_container').html("<obj" + "ect id='qz_iehelper' classid='CLSID:F03A2833-E70F-485B-A557-7769CCC9DD49' style='width: 1px; height: 1px; position: absolute; top: -9999px' />");
            qz_iehelper.FreeLibraries();
            var self = this;
            this.ieHelperHandle = setInterval(function () {
                self.IEHelperCleanup()
            },
            1000);
            return true
        } catch(e) {
            this.UnloadIEHelper();
            return false
        }
    };
    this.IEHelperCleanup = function () {
        if (typeof(qz_iehelper) != 'undefined') {
            try {
                qz_iehelper.FreeLibraries()
            } catch(e) {}
        }
    };
    this.UnloadIEHelper = function () {
        clearInterval(this.ieHelperHandle);
        this.ieHelperHandle = null;
        $('#iehelper_container').empty();
        try {
            qz_iehelper = undefined
        } catch(e) {}
        if (typeof(CollectGarbage) != 'undefined') {
            CollectGarbage()
        }
    };
    this.IsInstalled = function () {
        var foundPlugin = false;
        var self = this;

        function InjectionTest() {
            try {
                self.InjectObject();
                self.CreateObjectHandle();
                qz_instance.IsGameRunning();
                foundPlugin = (typeof(qz_instance) != 'undefined');
                if (foundPlugin) {}
            } catch(e) {}
            self.RemoveObject();
            return foundPlugin
        }
        if (this.pluginNeedsLibraryUnloader) {
            if (this.LoadIEHelper()) {
                InjectionTest()
            } else {
                foundPlugin = false
            }
        } else if (navigator) {
            if (navigator.mimeTypes) {
                var numMimeTypes = navigator.mimeTypes.length;
                for (var i = 0; i < numMimeTypes; ++i) {
                    if (navigator.mimeTypes[i].type == MIME_TYPE) {
                        foundPlugin = true;
                        break
                    }
                }
            }
            if (!foundPlugin && navigator.plugins) {
                var numPlugins = navigator.plugins.length;
                for (var i = 0; i < numPlugins; ++i) {
                    var plugin = navigator.plugins[i];
                    if (plugin.name == this.pluginName) {
                        foundPlugin = true;
                        break
                    }
                }
            }
        } else {
            InjectionTest()
        }
        return foundPlugin
    };
    this.injectTime = 0;
    this.handshakeTime = 0;
    this.verifiedTime = 0;
    this.version = 0;
    this.VersionCompare = function (v1, v2) {
        var vlist1 = v1.split('.');
        var vlist2 = v2.split('.');
        var max = vlist1.length > vlist2.length ? vlist2.length : vlist1.length;
        for (var i = 0; i < max; ++i) {
            if (vlist1[i] < vlist2[i]) {
                return -1
            } else if (vlist1[i] > vlist2[i]) {
                return 1
            }
        }
        return 0
    };
    this.CreateObjectHandle = function () {
        if (typeof(qz_instance) == 'undefined') {
            try {
                qz_instance = document.getElementById('qz_instance') || undefined
            } catch(e) {
                qz_instance = undefined
            }
        }
    };
    this.AttemptHandshake = function () {
        if (this.handshakeCount++>=this.maxHandshakeAttempts) {
            this.HandshakeFailed();
            return
        }
        this.CreateObjectHandle();
        if ($.browser.msie && typeof(qz_instance) != 'undefined') {
            try {
                var version = qz_instance.GetVersion();
                this.HandshakeSuccess(version)
            } catch(e) {}
        }
    };
    this.MakeObjectTag = function (id) {
        var str = '<obj' + 'ect id="' + id + '" class="game_viewport" width="100%" height="100%" ';
        if ($.browser.msie) {
            str += 'classid="CLSID:' + this.classId + '"'
        } else {
            str += 'type="' + this.mimeType + '"'
        }
        str += ' />';
        return str
    };
    this.CheckVersion = function (handshakeDuration, versionListener) {
        if (navigator && navigator.plugins) {
            if (this.pluginRefreshNeedsReload) {
                navigator.plugins.refresh(true)
            } else {
                navigator.plugins.refresh()
            }
        }
        var self = this;
        if (this.IsInstalled()) {
            this.PrepareForHandshake(handshakeDuration, function (version) {
                var cmpResult = VersionCompare(version, self.serverPluginVersion);
                if (cmpResult < 0) {
                    versionListener.VersionTooOld(self, version)
                } else if (cmpResult > 0) {
                    versionListener.VersionTooNew(self, version)
                } else {
                    versionListener.VersionOk(self, version)
                }
            },
            function () {
                versionListener.HandshakeFailed(self)
            });
            this.InjectObject();
            this.AttemptHandshake()
        } else {
            versionListener.PluginNotInstalled(self)
        }
    };
    this.EnableOnReadyHook = function (on) {
        if (on) {
            this.oldPluginReadyHook = window.OnPluginReady;
            window.OnPluginReady = function (v) {
                pluginx.OnPluginReady(v)
            }
        } else {
            window.OnPluginReady = this.oldPluginReadyHook;
            this.oldPluginReadyHook = null
        }
    };
    this.PrepareForHandshake = function (maxAttempts, successCallback, failureCallback) {
        this.handshakeTime = new Date().getTime();
        this.handshakeCount = 0;
        this.maxHandshakeAttempts = maxAttempts;
        if (this.handshakeHandle) {
            clearInterval(this.handshakeHandle)
        }
        if ($.browser.msie) {
            this.handshakeDelay = 10000
        } else {
            this.handshakeDelay = 5000
        }
        this.handshakeDone = false;
        this.EnableOnReadyHook(true);
        this.handshakeSuccessCallback = successCallback;
        this.handshakeFailureCallback = failureCallback;
        var self = this;
        this.handshakeHandle = setInterval(function () {
            self.AttemptHandshake()
        },
        this.handshakeDelay)
    };
    this.HandshakeSuccess = function (version) {
        this.verifiedTime = new Date().getTime();
        this.handshakeSuccess = true;
        this.handshakeDone = true;
        this.EnableOnReadyHook(false);
        if (this.handshakeHandle !== null) {
            clearInterval(this.handshakeHandle);
            this.handshakeHandle = null
        }
        if (typeof(this.handshakeSuccessCallback) == 'function') {
            this.handshakeSuccessCallback(version)
        }
    };
    this.HandshakeFailed = function () {
        this.EnableOnReadyHook(false);
        clearInterval(this.handshakeHandle);
        this.handshakeHandle = null;
        this.handshakeSuccess = false;
        this.handshakeDone = true;
        if (typeof(this.handshakeFailureCallback) == 'function') {
            this.handshakeFailureCallback()
        }
    };
    this.InjectObject = function () {
        this.injectTime = new Date().getTime();
        try {
            $(this.pluginContainerId).html(this.MakeObjectTag('qz_instance'))
        } catch(e) {}
    };
    this.RemoveObject = function () {
        this.removeTime = new Date().getTime();
        $(this.pluginContainerId).empty();
        qz_instance = undefined;
        if (typeof(CollectGarbage) == 'function') {
            CollectGarbage()
        }
    };
    this.IsGameRunning = function () {
        return (typeof(qz_instance) != 'undefined') && qz_instance.IsGameRunning()
    };
    this.OnPluginReady = function (version) {
        clearInterval(this.handshakeHandle);
        this.handshakeHandle = null;
        var MAX_FAILURES = 3;
        var self = this;
        var failCount = 0;
        var confirmHandle = null;
        self.CreateObjectHandle();

        function ConfirmPluginUsable() {
            try {
                qz_instance.IsGameRunning();
                self.HandshakeSuccess(version);
                clearInterval(confirmHandle)
            } catch(e) {
                if (failCount++>=MAX_FAILURES) {
                    self.HandshakeFailed();
                    clearInterval(confirmHandle);
                    return
                }
            }
        };
        setTimeout(function () {
            confirmHandle = setInterval(ConfirmPluginUsable, 500);
            ConfirmPluginUsable()
        },
        100)
    }
}
window.pluginx = new Plugin("Quake Live", MIME_TYPE, CLSID, version.join('.'));

function GetInstallMode() {
    switch (OSGetName()) {
    case 'os_linux':
        return 'linux';
    case 'os_mac':
        return 'mac';
    default:
        if ($.browser.msie) {
            return 'ie_msi'
        }
        return 'npapi_msi'
    }
}

function GetInstallerUrl() {
    var url = '';
    switch (GetInstallMode()) {
    case 'npapi_msi':
        url = quakelive.siteConfig.cdnUrl + '/QuakeLiveNP_' + BUILD_NUMBER + '.msi?v=' + check_version_comma;
        break;
    case 'ie_msi':
        url = quakelive.siteConfig.cdnUrl + '/QuakeLiveIE_' + BUILD_NUMBER + '.msi?v=' + check_version_comma;
        break;
    case 'mac':
        url = quakelive.siteConfig.cdnUrl + '/QuakeLivePlugin_' + BUILD_NUMBER + '.dmg?v=' + check_version_comma;
        break;
    case 'linux':
        url = quakelive.siteConfig.cdnUrl + '/QuakeLivePlugin_' + BUILD_NUMBER + '.xpi?v=' + check_version_comma
    }
    return url
}

function doInstall() {
    var url = GetInstallerUrl();
    if (url !== null) {
        $('body').append("<iframe src='" + url + "' width='0' height='0' style='display: none' />")
    }
}
var ieArrowAnimated = false;

function upgrade() {
    $.ajax({
        url: '/register/upgrade/' + GetInstallMode(),
        complete: function () {
            doInstall();
            if (($.browser.msie || IsLinux()) && !ieArrowAnimated) {
                ieArrowAnimated = true;
                if (!ReadCookie(ie_cookie_string)) {
                    CreateCookie(ie_cookie_string, 1);
                    var animDistance = 30;
                    var animTime = 400;
                    $('#registration_uparrow').remove();
                    $('body').append('<div id="registration_uparrow" style="top: ' + animDistance + 'px"></div>');
                    $('#registration_uparrow').animate({
                        'top': '-=' + animDistance + 'px'
                    },
                    animTime).animate({
                        'top': '+=' + animDistance + 'px'
                    },
                    animTime).animate({
                        'top': '-=' + animDistance + 'px'
                    },
                    animTime).animate({
                        'top': '+=' + animDistance + 'px'
                    },
                    animTime).animate({
                        'top': '-=' + animDistance + 'px'
                    },
                    animTime).animate({
                        'top': '+=' + animDistance + 'px'
                    },
                    animTime).animate({
                        'top': '-=' + animDistance + 'px'
                    },
                    animTime).show()
                } else {
                    EraseCookie(ie_cookie_string)
                }
            }
            quakelive.TrackPageView('/register/upgrade/' + GetInstallMode())
        }
    })
}
window.GROUP_MINIMUM = 1;
window.GROUP_BASE = 2;
window.GROUP_EXTRA = 3;
window.GROUP_DONE = 4;

function XferStatus(numfiles, size) {
    this.groupTitle = 'Downloading&hellip;';
    this.fileName = '';
    this.fileIndex = 0;
    this.fileSize = 0;
    this.transferredAmount = 0;
    this.totalTransferredAmount = 0;
    this.totalDownloads = numfiles;
    this.totalDownloadsSize = size;
    this.totalDownloadsFrac = 0;
    this.totalFrac = 0;
    this.frac = 0;
    this.group = GROUP_MINIMUM;
    this.currentGroup = GROUP_MINIMUM;
    this.groups = []
}
window.qlXfer = new XferStatus(1, 0);

function OnDownloadGroup(group, numfiles, size) {
    if (!qlXfer.groups[group]) {
        qlXfer.fileName = '';
        qlXfer.fileIndex = 0;
        qlXfer.fileSize = 0;
        qlXfer.transferredAmount = 0;
        qlXfer.totalTransferredAmount = 0;
        qlXfer.totalDownloads = numfiles;
        qlXfer.totalDownloadsSize = size;
        qlXfer.totalDownloadsFrac = 0;
        qlXfer.totalFrac = 0;
        qlXfer.frac = 0;
        qlXfer.currentGroup = group;
        while (qlXfer.group <= group) {
            switch (qlXfer.group) {
            case GROUP_MINIMUM:
                qlXfer.groupTitle = "Minimum Set&hellip;";
                break;
            case GROUP_BASE:
                qlXfer.groupTitle = "Base Set&hellip;";
                break;
            case GROUP_EXTRA:
                qlXfer.groupTitle = "Extra Set&hellip;";
                break;
            case GROUP_DONE:
                qlXfer.groupTitle = "Complete.";
                SetPluginStatus(QL_STATUS_GAMEREADY);
                break
            }
            if (qlXfer.group == group) {
                quakelive.SendModuleMessage('OnDownloadGroup', {
                    group: qlXfer.group,
                    numfiles: qlXfer.totalDownloads,
                    size: qlXfer.totalDownloadsSize
                })
            } else {
                quakelive.SendModuleMessage('OnDownloadGroup', {
                    group: qlXfer.group,
                    numfiles: 0,
                    size: 0
                })
            }
            qlXfer.groups[qlXfer.group] = true;
            qlXfer.group++
        }
    }
}

function OnDownloadError(error) {
    qlPrompt({
        title: 'File Manifest Error',
        body: qz_instance.GetErrorCodeString(error) || "Unknown Error",
        fatal: true
    })
}

function XferUpdateStatus() {
    SetPluginStatus(QL_STATUS_GAMEXFERUPDATE, qlXfer)
}

function OnFileXferStarted(fileName, fileSize) {
    qlXfer.fileName = fileName;
    qlXfer.fileSize = fileSize;
    qlXfer.transferredAmount = 0;
    qlXfer.lastTransferredAmount = 0;
    XferUpdateStatus();
    quakelive.SendModuleMessage('OnFileXferStarted', {
        'fileName': fileName,
        'fileSize': fileSize
    })
}
var RATE_SAMPLE_TIME = 1000 * 10;

function OnFileXferUpdate(transferredAmount) {
    var curTime = new Date().getTime();
    if (qlXfer.lastSampleTime) {
        qlXfer.sampleBytesAccum += transferredAmount - qlXfer.lastTransferredAmount;
        if (curTime - qlXfer.lastSampleTime >= RATE_SAMPLE_TIME) {
            qlXfer.bytesPerSec = (1000 * qlXfer.sampleBytesAccum) / (curTime - qlXfer.lastSampleTime);
            qlXfer.lastSampleTime = curTime;
            qlXfer.sampleBytesAccum = 0
        }
    } else {
        qlXfer.lastSampleTime = curTime;
        qlXfer.sampleBytesAccum = 0
    }
    qlXfer.lastTransferredAmount = transferredAmount;
    qlXfer.transferredAmount = transferredAmount;
    if (qlXfer.fileSize > 0) {
        qlXfer.frac = transferredAmount / qlXfer.fileSize
    } else {
        qlXfer.frac = 0
    }
    if (qlXfer.totalDownloadsSize > 0) {
        qlXfer.totalDownloadsFrac = (transferredAmount + qlXfer.totalTransferredAmount) / qlXfer.totalDownloadsSize
    } else {
        qlXfer.totalDownloadsFrac = 0
    }
    XferUpdateStatus();
    quakelive.Tick()
}

function OnFileXferDone(result) {
    qlXfer.fileIndex++;
    qlXfer.totalTransferredAmount += qlXfer.fileSize;
    XferUpdateStatus()
}

function OnHeartbeatTimeout() {}

function OnHeartbeat() {
    setTimeout(OnHeartbeatTimeout, 10)
}
window.xmppActive = false;

function IM_OnConnected() {
    if (xmppActive) {
        return
    }
    xmppActive = true;
    quakelive.SendModuleMessage('IM_OnConnected')
}

function IM_OnDisconnected() {
    if (!xmppActive) {
        return
    }
    xmppActive = false;
    quakelive.SendModuleMessage('IM_OnDisconnected')
}

function IM_OnRosterFilled() {
    quakelive.SendModuleMessage('IM_OnRosterFilled')
}

function VersionCompare(v1, v2) {
    var vlist1 = v1.split('.');
    var vlist2 = v2.split('.');
    var max = vlist1.length > vlist2.length ? vlist2.length : vlist1.length;
    for (var i = 0; i < max; ++i) {
        if (vlist1[i] < vlist2[i]) {
            return -1
        } else if (vlist1[i] > vlist2[i]) {
            return 1
        }
    }
    return 0
}

function OnGameExit(exitCode) {
    quakelive.Tick();
    quakelive.TrackPageView('/ExitGame/' + exitCode);
    if (quakelive.skipEndGame) {
        $('#qz_handshake').css('width', 1).css('height', 1)
    } else {
        EndGameMode()
    }
    quakelive.skipEndGame = false;
    document.title = quakelive.GetPageTitle();
    quakelive.SendModuleMessage('OnGameExited', exitCode)
}

function OnVidRestart(fullscreen) {
    var cvar = quakelive.cvars.Get('r_inBrowserMode');
    if (cvar.latched) {
        if (typeof(quakelive.cvars.screenModes[cvar.value]) != 'undefined') {
            w = quakelive.cvars.screenModes[cvar.value][0];
            h = quakelive.cvars.screenModes[cvar.value][1]
        } else {
            w = 800;
            h = 600
        }
        StartGameMode(w, h);
        cvar.latched = false
    }
    quakelive.SendModuleMessage('OnVidRestart', fullscreen)
}

function join_server(server_address, serverInfo) {
    var cmdString = BuildCmdString();
    cmdString += "+connect " + server_address;
    LaunchGame(cmdString, false, serverInfo)
}

function LaunchGame(cmdString, isBotGame, serverInfo) {
    function innerLaunch(cmdString, isBotGame, serverInfo) {
        quakelive.HideTooltip();
        var w, h;
        var cvar = quakelive.cvars.Get("r_inBrowserMode");
        if (typeof(quakelive.cvars.screenModes[cvar.value]) != 'undefined') {
            w = quakelive.cvars.screenModes[cvar.value][0];
            h = quakelive.cvars.screenModes[cvar.value][1]
        } else {
            w = 800;
            h = 600
        }
        StartGameMode(w, h);
        document.title = 'QUAKE LIVE - Now Playing!';
        quakelive.SendModuleMessage('OnGameStarted', {
            'isBotGame': isBotGame,
            'serverInfo': serverInfo
        });
        if (!isBotGame) {
            qz_instance.StopDownloads()
        }
        setTimeout(function () {
            var r = qz_instance.LaunchGameWithCmdBuffer(cmdString);
            if (r) {
                OnGameExit(r);
                qlPrompt({
                    title: 'Fatal Error',
                    body: qz_instance.GetErrorCodeString(r) || "Unknown Error",
                    fatal: true
                })
            }
        },
        100);
        CheckForPreGameAd();
        quakelive.ScrollToTop();
        var viewPath;
        if (isBotGame) {
            if (quakelive.userstatus != 'ACTIVE') {
                viewPath = '/LaunchGame/Bot/Training'
            } else {
                viewPath = '/LaunchGame/Bot'
            }
        } else {
            viewPath = '/LaunchGame/Live'
        }
        quakelive.TrackPageView(viewPath)
    }
    if (!isBotGame && qlXfer.currentGroup < GROUP_EXTRA) {
        qlPrompt({
            title: 'Unable to Launch Game',
            body: 'You are downloading required data and must let it finish before you can join an online match.',
            alert: true
        });
        return
    }
    if (serverInfo && serverInfo.g_needpass) {
        qlPrompt({
            title: 'Password Required',
            body: "The match you are connecting to requires a password. Please enter the password below:",
            input: true,
            okLabel: 'Connect',
            ok: function () {
                var pw = $('#modal-input > input').val();
                if (pw.length !== 0) {
                    if (/"/.test(pw)) {
                        $('.modal-content > .modal-feedback').html('Password cannot contain quotes.')
                    } else {
                        cmdString += ' +password "' + pw + '"';
                        innerLaunch(cmdString, isBotGame, serverInfo);
                        $('#prompt').jqmHide()
                    }
                } else {
                    $('.modal-content > .modal-feedback').html('You must enter a password to continue')
                }
            }
        })
    } else {
        innerLaunch(cmdString, isBotGame, serverInfo)
    }
}

function BuildCmdString() {
    var cvar = quakelive.cvars.Get("model");
    quakelive.cvars.Set("headmodel", cvar.value);
    quakelive.cvars.Set("team_model", cvar.value);
    quakelive.cvars.Set("team_headmodel", cvar.value);
    quakelive.cfgUpdater.StoreConfig(quakelive.cfgUpdater.CFG_BIT_REP);
    var cmdString = "";
    cmdString += "+set gt_user \"" + pluginx.username + "\" ";
    cmdString += "+set gt_pass \"" + pluginx.password + "\" ";
    cmdString += "+set gt_realm \"" + quakelive.siteConfig.realm + "\" ";
    return cmdString
}

function HandleCrashReport() {
    if (qz_instance.IsCrashDumpPresent()) {
        quakelive.Overlay('home/crashed', 'CloseCrashReport()', true);
        return true
    }
    return false
}

function CloseCrashReport() {
    qz_instance.CancelBugReport();
    quakelive.CloseOverlay();
    quakelive.OnPluginInstalled()
}

function SubmitCrashReport() {
    if (qz_instance) {
        var usermsg = [$('#USERAGENT').val(), $('#IP').val(), $('#URI').val(), $('#crashed-usermsg').val()].join("\n");
        qz_instance.SubmitBugReport("http://" + window.location.hostname + "/home/crashed", usermsg);
        alert("Thanks for the report!")
    }
    quakelive.CloseOverlay();
    quakelive.OnPluginInstalled()
}
var gameInstallHandle = null;

function StopGameInstall() {
    if (gameInstallHandle != null) {
        clearTimeout(gameInstallHandle);
        gameInstallHandle = null
    }
}

function SetupInstall() {
    var installMode = GetInstallMode();
    quakelive.OnPluginOutdated(installMode, current_version, check_version_comma)
}
var newInstall;
var pluginAlreadyRun = false;

function run_plugin(username, password) {
    if (pluginAlreadyRun) {
        return
    }
    pluginAlreadyRun = true;
    var install = false;
    newInstall = false;
    pluginx.SetCredentials(username, password);
    var listener = new StartupVersionListener();
    pluginx.CheckVersion(1, listener)
}
var QL_STATUS_GAMEXFERUPDATE = 4;
var QL_STATUS_GAMEREADY = 5;

function SetPluginStatus(status, param) {
    var bot = $('#qlv_statusBottom');
    if (qlXfer.group == 0) {
        return
    }
    switch (status) {
    case QL_STATUS_GAMEXFERUPDATE:
        if (!quakelive.IsGameRunning() && param.totalDownloads > 0) {
            var downloadPercent = parseInt(100 * param.totalDownloadsFrac);
            if (downloadPercent < 0) {
                downloadPercent = 0
            } else if (downloadPercent > 100) {
                downloadPercent = 100
            }
            bot.attr("title", param.fileName);
            bot.html("Additional Content " + downloadPercent + "% Complete");
            $('.dl-bar-fill').css('width', downloadPercent + "%");
            $('.dl-percent').text(downloadPercent + "%");
            var html = "<span class='t-hilite'>" + downloadPercent + "% Complete</span>";
            if (qlXfer.bytesPerSec) {
                var xferAmt = param.totalTransferredAmount + param.transferredAmount;
                var secsLeft = parseInt((param.totalDownloadsSize - xferAmt) / (qlXfer.bytesPerSec));
                if (secsLeft < 0) {
                    secsLeft = 0
                }
                var minsLeft = parseInt((59 + secsLeft) / 60);
                if (minsLeft < 0) {
                    minsLeft = 0
                }
                var str;
                if (secsLeft < 60) {
                    if (secsLeft <= 1) {
                        str = "1 second left"
                    } else {
                        str = secsLeft + " seconds left"
                    }
                } else if (minsLeft <= 1) {
                    str = "1 minute left"
                } else {
                    str = minsLeft + " minutes left"
                }
                html += " &nbsp;&nbsp;<small class='t-lolite'>" + str + "</small>";
                $('.dl-timeleft').text(str)
            }
            $('.dl-progress-text').html(html)
        }
        break;
    case QL_STATUS_GAMEREADY:
        bot.empty();
        bot.removeAttr("title");
        break
    }
}

function OnBeforeUnload() {
    return 'Pressing OK will disconnect you from the current server.'
}
var PREGAME_COUNTDOWN_TIME = 5;
var POSTGAME_COUNTDOWN_TIME = 20;
var POSTGAME_COUNTDOWN_MAX = 30;
var POSTGAME_COUNTDOWN_MIN = 5;
var POSTGAME_FREQUENCY = 2;
var POSTGAME_MAXRETRY = 20;
var postgame_countdown = 0;
var postgame_countdown_handle = null;
var pregame_countdown = 0;
var pregame_countdown_handle = null;
var postgame_retrycount = 0;

function StopPreGameAd() {
    $('.interestitial_ad_container').remove();
    SetGameModeDefaults()
}

function PreGameCountdown() {
    if (--pregame_countdown == 0) {
        StopPreGameAd();
        return
    }
    $('#qlv_game_mode').find('.action_txt').html(pregame_countdown).unbind("click");
    pregame_countdown_handle = setTimeout(PreGameCountdown, 1000)
}

function CheckForPreGameAd() {
    var self = this;
    quakelive.LoadVerts({
        'zone': quakelive.VERT_ZONES.pre_game_interstitial,
        'display': function (ad, adNode, isDefault) {
            if (isDefault) {
                StopPreGameAd()
            } else {
                $('#qz_handshake').css('width', '1px').css('height', '1px');
                ShowPreGameAd(adNode)
            }
        }
    },
    {
        timeout: 1500
    })
}

function ShowPreGameAd(adNode) {
    var n = $('#qlv_game_mode');
    n.find('.greeting_txt').html('Quake Live is loading now&hellip;');
    var action = $("<a>").click(EndGameMode);
    n.find('.action_txt').unbind("click");
    n.find('.action_img').unbind("click").html("<img src='" + quakelive.resource("/images/lgi/server_details_time.png") + "' width='16' height='16' />");
    pregame_countdown = PREGAME_COUNTDOWN_TIME + 1;
    if (pregame_countdown_handle) {
        clearTimeout(pregame_countdown_handle);
        pregame_countdown_handle = null
    }
    PreGameCountdown();
    var ad = $('<div class="interestitial_ad_container pregame_container"><div class="header"></div><div class="content"></div><small>Clicking advertisement will not interrupt Quake Live loading.</small></div>');
    ad.find(".content").append(adNode);
    $('#qlv_game_mode_viewport').append(ad)
}

function PostGameCountdown() {
    postgame_retrycount++;
    var movie = null;
    if ($('#flashintro').length !== 0) {
        $('#vert-loading-msg').show();
        try {
            movie = ($.browser.msie) ? $('#flashintro').get()[0] : $('#flashintro embed').get()[0]
        } catch(e) {
            movie = null
        }
    }
    if (true || loaded_percent === 100 || postgame_retrycount >= POSTGAME_MAXRETRY) {
        $('#vert-loading-msg').hide();
        if (--postgame_countdown == 0) {
            CreateCookie('QLPGA', 1, POSTGAME_FREQUENCY / 24.0);
            $('.interestitial_ad_container').remove();
            ActualEndGameMode(true);
            postgame_retrycount = 0;
            return
        }
        $('#qlv_game_mode').find('.action_txt').html('Returning in&hellip; ' + postgame_countdown).unbind("click")
    }
    postgame_countdown_handle = setTimeout(PostGameCountdown, 1000)
}

function ShowPostGameAd(adNode, time) {
    var n = $('#qlv_game_mode');
    n.find('.greeting_txt').html('Now a word from our sponsors&hellip;');
    var action = $("<a>").click(EndGameMode);
    n.find('.action_txt').unbind("click");
    n.find('.action_img').unbind("click").html("<img src='" + quakelive.resource("/images/lgi/server_details_time.png") + "' width='16' height='16' />");
    postgame_countdown = time + 1;
    if (postgame_countdown_handle) {
        clearTimeout(postgame_countdown_handle);
        postgame_countdown_handle = null
    }
    PostGameCountdown();
    var ad = $('<div class="interestitial_ad_container postgame_container"><div class="header"></div><div class="content"></div><small>Clicking advertisement will not interrupt Quake Live loading.</small></div>');
    ad.find(".content").append(adNode);
    $('#qlv_game_mode_viewport').append(ad)
}

function ActualEndGameMode(adShown) {
    if (adShown) {
        var self = this;
        quakelive.LoadVerts({
            'zone': quakelive.VERT_ZONES.post_game_interstitial_tracker,
            'display': function (ad, adNode, isDefault, html) {}
        },
        {
            timeout: 15000
        })
    }
    $('#qlv_game_mode').css('top', '-9999px');
    $('#body-container').show();
    quakelive.mod_friends.MoveTo('#qlv_chatControl');
    qz_instance.StartDownloads(quakelive.siteConfig.staticUrl, quakelive.siteConfig.cdnUrl);
    quakelive.ReloadVerts();
    window.onbeforeunload = null
}
var postGameDefaults = {
    'html': '',
    'time': 20
};

function EndGameMode() {
    quakelive.ShutdownGame();
    $('#qz_handshake').css('height', '1px').css('width', '1px');
    if (!quakelive.siteConfig.showPostGameAlways && ReadCookie('QLPGA') !== null) {
        ActualEndGameMode(false);
        return
    }
    var self = this;
    quakelive.LoadVerts({
        'zone': quakelive.VERT_ZONES.post_game_interstitial,
        'display': function (ad, adNode, isDefault, html) {
            var meta = quakelive.ParseMetaVert(html, postGameDefaults);
            if (meta) {
                if (meta.href) {
                    adNode = $('<a target="_blank">').attr('href', meta.href)
                } else {
                    adNode = $('<div>')
                }
                adNode.append(meta.keyvals.html);
                isDefault = false
            } else {
                isDefault = true
            }
            if (isDefault) {
                CreateCookie('QLPGA', 1, POSTGAME_FREQUENCY / 24.0);
                ActualEndGameMode(true)
            } else {
                try {
                    var t = parseInt(meta.keyvals.time);
                    if (t < POSTGAME_COUNTDOWN_MIN) {
                        t = POSTGAME_COUNTDOWN_MIN
                    }
                    if (t > POSTGAME_COUNTDOWN_MAX) {
                        t = POSTGAME_COUNTDOWN_MAX
                    }
                } catch(e) {
                    t = postGameDefaults.time
                }
                ShowPostGameAd(adNode, t)
            }
        }
    },
    {
        timeout: 1000
    })
}

function SetGameModeDefaults() {
    var n = $('#qlv_game_mode').css('top', '0');
    n.find('.greeting_txt').text('Quake Live');
    var action = $("<a>").click(EndGameMode);
    n.find('.action_txt').text('Back to Website').unbind("click").click(EndGameMode);
    n.find('.action_img').html("<img src='" + quakelive.resource("/images/sf/general/close_xpic.gif") + "' width='18' height='16' />").unbind("click").click(EndGameMode);
    var url_link = n.find('.url_link');
    if (JoinURL.currentServerAddress !== undefined) {
        $('#url_link_input').unbind('blur').blur(function (e) {
            $(e.target).hide().val('')
        });
        url_link.html('<img src="' + quakelive.resource("/images/link_glow.png") + '" width="26" height="26" style="vertical-align: middle;" /> <b>Show link for this match</b>').unbind('click').click(function () {
            $('#url_link_input').show().focus().val(JoinURL.currentServerAddress).get(0).select()
        })
    } else {
        n.find('.url_link').text('Quake Live').unbind('click')
    }
    $('#qz_handshake').css('height', '100%').css('width', '100%')
}

function StartGameMode(w, h) {
    window.onbeforeunload = OnBeforeUnload;
    $('#body-container').hide();
    quakelive.mod_friends.MoveTo('#qlv_game_mode_chatlist');
    SetGameModeDefaults();
    var decor_class = '';
    if (w <= 640) {
        decor_class = 'game_decoration_640'
    } else if (w <= 800) {
        decor_class = 'game_decoration_800'
    } else {
        decor_class = 'game_decoration_1024'
    }
    var n = $('#qlv_game_mode');
    n.attr('class', decor_class)
}
window.OnCommNotice = function (errorCode, json) {
    if (errorCode != 0) {
        return
    }
    var msg = quakelive.Eval(json);
    if (!msg) {
        return
    }
    switch (msg.MSG_TYPE) {
    case 'award_notice':
        if (!quakelive.siteConfig.xyzzy) {
            break
        }
        if (msg.MSG_SOURCE.toLowerCase() == quakelive.username.toLowerCase()) {
            quakelive.notifier.Notify(quakelive.notifier.SelfAwardEarnedNotice(msg.AWARD_TYPE_ID, msg.AWARD_ID, msg.AWARD_NAME, msg.AWARD_IMG, msg.AWARD_DESC, msg.AWARD_FLAVOR))
        } else {
            quakelive.notifier.Notify(quakelive.notifier.FriendAwardEarnedNotice(msg.MSG_SOURCE, msg.AWARD_TYPE_ID, msg.AWARD_ID, msg.AWARD_NAME, msg.AWARD_IMG, msg.AWARD_DESC, msg.AWARD_FLAVOR, msg.PLAYER_MODEL))
        }
        break;
    case 'openurl':
        window.open(msg.URL, '_blank');
        break;
    case 'session_caps':
        if (typeof(QLXFire) == 'object' && quakelive.siteConfig.xfire && parseInt(msg.XFIRE) !== 0) {
            QLXFire.EnableXFire()
        }
        break
    }
};
if (!window.JSON) {
    window.JSON = function () {
        function f(n) {
            return n < 10 ? '0' + n : n
        }
        Date.prototype.toJSON = function (key) {
            return this.getUTCFullYear() + '-' + f(this.getUTCMonth() + 1) + '-' + f(this.getUTCDate()) + 'T' + f(this.getUTCHours()) + ':' + f(this.getUTCMinutes()) + ':' + f(this.getUTCSeconds()) + 'Z'
        };
        String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function (key) {
            return this.valueOf()
        };
        var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapeable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap, indent, meta = {
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"': '\\"',
            '\\': '\\\\'
        },
        rep;

        function quote(string) {
            escapeable.lastIndex = 0;
            return escapeable.test(string) ? '"' + string.replace(escapeable, function (a) {
                var c = meta[a];
                if (typeof c === 'string') {
                    return c
                }
                return '\\u' + ('0000' + (+ (a.charCodeAt(0))).toString(16)).slice(-4)
            }) + '"' : '"' + string + '"'
        }

        function str(key, holder) {
            var i, k, v, length, mind = gap,
            partial, value = holder[key];
            if (value && typeof value === 'object' && typeof value.toJSON === 'function') {
                value = value.toJSON(key)
            }
            if (typeof rep === 'function') {
                value = rep.call(holder, key, value)
            }
            switch (typeof value) {
            case 'string':
                return quote(value);
            case 'number':
                return isFinite(value) ? String(value) : 'null';
            case 'boolean':
            case 'null':
                return String(value);
            case 'object':
                if (!value) {
                    return 'null'
                }
                gap += indent;
                partial = [];
                if (typeof value.length === 'number' && !(value.propertyIsEnumerable('length'))) {
                    length = value.length;
                    for (i = 0; i < length; i += 1) {
                        partial[i] = str(i, value) || 'null'
                    }
                    v = partial.length === 0 ? '[]' : gap ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' : '[' + partial.join(',') + ']';
                    gap = mind;
                    return v
                }
                if (rep && typeof rep === 'object') {
                    length = rep.length;
                    for (i = 0; i < length; i += 1) {
                        k = rep[i];
                        if (typeof k === 'string') {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v)
                            }
                        }
                    }
                } else {
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v)
                            }
                        }
                    }
                }
                v = partial.length === 0 ? '{}' : gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' : '{' + partial.join(',') + '}';
                gap = mind;
                return v
            }
        }
        return {
            stringify: function (value, replacer, space) {
                var i;
                gap = '';
                indent = '';
                if (typeof space === 'number') {
                    for (i = 0; i < space; i += 1) {
                        indent += ' '
                    }
                } else if (typeof space === 'string') {
                    indent = space
                }
                rep = replacer;
                if (replacer && typeof replacer !== 'function' && (typeof replacer !== 'object' || typeof replacer.length !== 'number')) {
                    throw new Error('JSON.stringify')
                }
                return str('', {
                    '': value
                })
            },
            parse: function (text, reviver) {
                var j;

                function walk(holder, key) {
                    var k, v, value = holder[key];
                    if (value && typeof value === 'object') {
                        for (k in value) {
                            if (Object.hasOwnProperty.call(value, k)) {
                                v = walk(value, k);
                                if (v !== undefined) {
                                    value[k] = v
                                } else {
                                    delete value[k]
                                }
                            }
                        }
                    }
                    return reviver.call(holder, key, value)
                }
                cx.lastIndex = 0;
                if (cx.test(text)) {
                    text = text.replace(cx, function (a) {
                        return '\\u' + ('0000' + (+ (a.charCodeAt(0))).toString(16)).slice(-4)
                    })
                }
                if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
                    j = eval('(' + text + ')');
                    return typeof reviver === 'function' ? walk({
                        '': j
                    },
                    '') : j
                }
                throw new SyntaxError('JSON.parse')
            }
        }
    } ()
} (function () {
    function ConfigUpdater() {
        var MIN_DELAY = 1;
        var MAX_DELAY = 600;
        this.commitData = {};
        this.commitHandle = null;
        this.commitDelay = MIN_DELAY;
        this.handlers = [];
        this.pauseCommit = false;
        this.Commit = function (delay) {
            if (this.commitHandle) {
                return
            }
            this.changeCounts = {
                'add': 0,
                'del': 0
            };
            if (this.pauseCommit === false) {
                if (delay) {
                    this.commitDelay = delay;
                    var me = this;
                    this.commitHandle = setTimeout(function () {
                        me.TryCommit()
                    },
                    1000 * delay)
                } else {
                    this.commitDelay = MIN_DELAY;
                    this.TryCommit()
                }
            }
        };
        this.Commit_Success = function (json) {
            if (ECODE_SUCCESS(json.ECODE)) {
                this.commitHandle = null;
                this.commitData = {}
            } else {
                this.Commit_Error()
            }
        };
        this.Commit_Error = function () {
            var me = this;
            this.commitHandle = setTimeout(function () {
                me.TryCommit()
            },
            1000 * this.commitDelay);
            this.commitDelay *= 2;
            if (this.commitDelay > MAX_DELAY) {
                this.commitDelay = MAX_DELAY
            }
        };
        this.TryCommit = function () {
            for (var index in this.handlers) {
                var handler = this.handlers[index];
                handler.MergeChangedFields(this.commitData, this.changeCounts)
            }
            if (this.changeCounts.add > 0 || this.changeCounts.del) {
                var me = this;
                $.ajax({
                    type: 'post',
                    dataType: 'json',
                    url: '/prefs/update',
                    data: this.commitData,
                    success: function (json) {
                        me.Commit_Success(json)
                    },
                    error: function () {
                        me.Commit_Error()
                    }
                })
            } else {
                this.commitHandle = null
            }
        };
        this.CFG_BIT_HW = 1;
        this.CFG_BIT_REP = 2;
        this.StoreConfig = function (arg0) {
            var cmdString = "";
            for (var index in this.handlers) {
                var handler = this.handlers[index];
                cmdString += handler.GetConfigString(arg0)
            }
            qz_instance.WriteTextFile("/repconfig.cfg", cmdString)
        };
        this.AddSource = function (src) {
            this.handlers[this.handlers.length] = src
        }
    }
    quakelive.cfgUpdater = new ConfigUpdater();
    quakelive.AddHook('OnGameStarted', function () {
        quakelive.cfgUpdater.pauseCommit = true
    });
    quakelive.AddHook('OnGameExited', function () {
        quakelive.cfgUpdater.pauseCommit = false;
        quakelive.cfgUpdater.Commit()
    })
})();

function BindInfo(action, name, index) {
    this.action = action;
    this.name = name;
    this.index = index;
    this.changed = false;
    this.keys = [];
    this.deletedKeys = []
}
BindInfo.prototype.Bind = function (keyName, skipFlag) {
    this.keys.push(keyName);
    if (!skipFlag) {
        this.changed = true
    }
};
BindInfo.prototype.Remove = function (keyName, deleteAll) {
    if (!deleteAll) {
        for (var i = 0; i < this.keys.length; i++) {
            if (this.keys[i] === keyName) {
                this.deletedKeys.push(this.keys[i]);
                this.keys.splice(i, 1);
                this.changed = true;
                return
            }
        }
    } else {
        this.deletedKeys = $.extend([], this.keys);
        this.keys = [];
        this.changed = true
    }
};

function BindManager() {
    this.handlers = []
}
BindManager.prototype.keyLookup = {};
BindManager.prototype.actionLookup = {};
BindManager.prototype.bindNames = {
    'centerview': 'Center View',
    '+zoom': 'Zoom View',
    '+forward': 'Forward',
    '+back': 'Back',
    '+moveleft': 'Move Left',
    '+moveright': 'Move Right',
    '+moveup': 'Move Up / Jump',
    '+movedown': 'Move Down',
    '+speed': 'Silent Walk / Run',
    '+attack': 'Shoot',
    'weapnext': 'Weapon Next',
    'weapprev': 'Weapon Prev',
    'weapon 1': 'Gauntlet',
    'weapon 2': 'Machinegun',
    'weapon 3': 'Shotgun',
    'weapon 4': 'Grenade Launcher',
    'weapon 5': 'Rocket Launcher',
    'weapon 6': 'Lightning Gun',
    'weapon 7': 'Railgun',
    'weapon 8': 'Plasma Gun',
    'weapon 9': 'BFG',
    'weapon 11': 'Nailgun',
    'weapon 12': 'Prox Launcher',
    'weapon 13': 'Chaingun',
    '+scores': 'Show Scores',
    '+button2': 'Use Item',
    '+button3': 'Taunt',
    'messagemode': 'Chat',
    'messagemode2': 'Team Chat',
    'dropweapon': 'Drop Weapon',
    'dropflag': 'Drop Flag'
};
BindManager.prototype.list = [];
BindManager.prototype.Get = function (action) {
    var index = this.actionLookup[action];
    if (index === undefined) {
        index = this.list.length;
        this.list[index] = new BindInfo(action, this.bindNames[action] || 'user bind', index);
        this.actionLookup[action] = index
    }
    return this.list[index]
};
BindManager.prototype.GetByKey = function (keyName) {
    var index = this.keyLookup[keyName];
    if (index !== undefined) {
        return this.list[index]
    } else {
        return null
    }
};
BindManager.prototype.Bind = function (userKey, action, skipFlag) {
    var keyName = userKey.toLowerCase();
    this.Remove(keyName);
    var bindInfo = this.Get(action);
    bindInfo.Bind(keyName, skipFlag);
    this.keyLookup[keyName] = bindInfo.index
};
BindManager.prototype.Remove = function (userKey, deleteAll) {
    var keyName = userKey.toLowerCase();
    if (this.keyLookup[keyName] === undefined) {
        return
    }
    var bind = this.GetByKey(keyName);
    if (bind) {
        bind.Remove(keyName, deleteAll)
    }
    this.keyLookup[keyName] = undefined
};
BindManager.prototype.Import = function (importBinds) {
    for (var keyName in importBinds) {
        this.Bind(keyName, importBinds[keyName], true)
    }
};
BindManager.prototype.MergeChangedFields = function (postData, changeCounts) {
    for (var bindIndex in this.list) {
        var bind = this.list[bindIndex];
        if (bind.changed) {
            if (bind.keys.length === 0) {
                for (var i = 0; i < bind.deletedKeys.length; ++i) {
                    if (bind.deletedKeys[i]) {
                        postData['deltype' + changeCounts.del] = 1;
                        postData['del' + changeCounts.del] = bind.deletedKeys[i];
                        changeCounts.del++
                    }
                }
                bind.deletedKeys = []
            } else {
                for (var i = 0; i < bind.keys.length; ++i) {
                    if (bind.keys[i]) {
                        postData['addtype' + changeCounts.add] = 1;
                        postData['addkey' + changeCounts.add] = bind.keys[i];
                        postData['addvalue' + changeCounts.add] = bind.action;
                        changeCounts.add++
                    }
                }
            }
            bind.changed = false
        }
    }
};
BindManager.prototype.GetConfigString = function (param) {
    var cmdString = "unbindall\n";
    for (var bindIndex in this.list) {
        var bind = this.list[bindIndex];
        for (var q = 0; q < bind.keys.length; ++q) {
            if (bind.keys[q]) {
                cmdString += "bind " + bind.keys[q] + " \"" + bind.action + "\"\n"
            }
        }
    }
    return cmdString
};
window.SetBind = window.OnBindChanged = function (name, val) {
    quakelive.binds.Bind(name, val);
    quakelive.cfgUpdater.Commit(1)
};
quakelive.binds = new BindManager();
quakelive.cfgUpdater.AddSource(quakelive.binds);
(function () {
    var cvars = window.quakelive.cvars = {};

    function CvarInfo(name, defaultValue, replicate) {
        this.name = name;
        this.replicate = replicate;
        this.defaultValue = defaultValue.toString();
        this.value = this.defaultValue;
        this.changed = false
    }
    CvarInfo.prototype.MarkChanged = function () {
        this.changed = true
    };

    function CvarManager() {
        this.cvarLookup = {};
        this.cvarList = [new CvarInfo('name', 'UnnamedPlayer', true), new CvarInfo('clan', '', true), new CvarInfo('model', 'sarge/default', true), new CvarInfo('cg_forceEnemyModel', '', true), new CvarInfo('cg_forceTeamModel', '', true), new CvarInfo('color1', '2', true), new CvarInfo('color2', '7', true), new CvarInfo('cg_autoswitch', '1', true), new CvarInfo('cg_scorePlums', '1', true), new CvarInfo('cg_brassTime', '2500', true), new CvarInfo('r_dynamiclight', '1', true), new CvarInfo('cg_drawCrosshairNames', '1', true), new CvarInfo('r_fastsky', '0', true), new CvarInfo('cg_forceModel', '0', true), new CvarInfo('cg_drawTeamOverlay', '1', true), new CvarInfo('cl_freelook', '1', true), new CvarInfo('m_pitch', '0.022', true), new CvarInfo('cg_drawCrosshair', '4', true), new CvarInfo('cl_run', '1', true), new CvarInfo('web_configVersion', '0', true), new CvarInfo('cg_fov', '90', true), new CvarInfo('r_picmip', '0', true), new CvarInfo('m_filter', '0', false), new CvarInfo('sensitivity', '6', false), new CvarInfo('r_fullscreen', '0', false), new CvarInfo('r_mode', '-2', false), new CvarInfo('r_inBrowserMode', '9', true), new CvarInfo('r_vertexlight', '0', true), new CvarInfo('r_fullbright', '0', true), new CvarInfo('r_lodbias', '0', false), new CvarInfo('r_texturemode', 'GL_LINEAR_MIPMAP_LINEAR', false), new CvarInfo('r_ext_compressed_textures', '0', false), new CvarInfo('r_texturebits', '32', false), new CvarInfo('r_gamma', '1', false), new CvarInfo('s_volume', '0.8', false), new CvarInfo('s_musicvolume', '0.25', false), new CvarInfo('s_doppler', '0', false), new CvarInfo('rate', '8000', true)];
        for (var i = 0; i < this.cvarList.length; ++i) {
            var cvar = this.cvarList[i];
            if (cvar.value === undefined) {
                cvar.value = cvar.defaultValue
            }
            this.cvarLookup[cvar.name.toLowerCase()] = cvar
        }
        this.screenModes = {
            0: [320, 240],
            1: [400, 300],
            2: [512, 384],
            3: [640, 360],
            4: [640, 400],
            5: [640, 480],
            6: [800, 450],
            7: [852, 480],
            8: [800, 500],
            9: [800, 600],
            10: [1024, 640],
            11: [1024, 576],
            12: [1024, 768],
            13: [1152, 864],
            14: [1280, 720],
            15: [1280, 768],
            16: [1280, 800],
            17: [1280, 1024],
            18: [1440, 900],
            19: [1600, 900],
            20: [1600, 1000],
            21: [1680, 1050],
            22: [1600, 1200],
            23: [1920, 1080],
            24: [1920, 1200],
            25: [1920, 1440],
            26: [2048, 1536],
            27: [2560, 1600]
        }
    }
    CvarManager.prototype.Get = function (name, defaultValue) {
        var lookupKey = name.toLowerCase();
        if (this.cvarLookup[lookupKey] === undefined) {
            this.Set(name, arguments.length == 1 ? '' : defaultValue)
        }
        return this.cvarLookup[lookupKey]
    };
    CvarManager.prototype.GetIntegerValue = function (name, defaultValue) {
        var cvar = this.Get(name, defaultValue || 0);
        return parseInt(cvar.value)
    };
    CvarManager.prototype.Set = function (name, value, skipChanged, skipReplicate) {
        var lookupKey = name.toLowerCase();
        var cvar = this.cvarLookup[lookupKey];
        if (cvar === undefined) {
            cvar = new CvarInfo(name, value, skipReplicate ? false : true);
            this.cvarList[this.cvarList.length] = cvar;
            this.cvarLookup[lookupKey] = cvar
        } else {
            cvar.value = value.toString()
        }
        if (!skipChanged) {
            cvar.MarkChanged();
            if (name == 'model') {
                quakelive.SendModuleMessage('OnModelIconChanged', cvar)
            }
        }
        return cvar
    };
    CvarManager.prototype.Parse = function (data) {
        if (typeof(data) != 'string') {
            return
        }
        var regexp = /set.?\s+(\w+)\s+\"?([^\"]*)\"?/;
        var lines = data.split(/\r?\n/);
        for (var i = 0; i < lines.length; ++i) {
            var match = lines[i].match(regexp);
            if (match == null || match.length != 3) {
                continue
            }
            this.Set(match[1], match[2], true, true)
        }
    };
    CvarManager.prototype.Import = function (list) {
        for (var key in list) {
            this.Set(key, list[key], true)
        }
    };
    CvarManager.prototype.MergeChangedFields = function (postData, changeCounts) {
        var hasChangedHWCvar = false;
        for (var cvarIndex in this.cvarList) {
            var cvar = this.cvarList[cvarIndex];
            if (cvar.changed) {
                if (cvar.replicate) {
                    postData['addtype' + changeCounts.add] = 2;
                    postData['addkey' + changeCounts.add] = cvar.name;
                    postData['addvalue' + changeCounts.add] = cvar.value;
                    changeCounts.add++
                } else {
                    hasChangedHWCvar = true
                }
                cvar.changed = false
            }
        }
        if (hasChangedHWCvar) {
            this.StoreHardwareCvars()
        }
    };
    CvarManager.prototype.StoreHardwareCvars = function () {
        var str = this.GetConfigString(quakelive.cfgUpdater.CFG_BIT_HW);
        qz_instance.WriteTextFile("/qzconfig.cfg", str)
    };
    CvarManager.prototype.GetConfigString = function (arg0) {
        var storeHw = (arg0 & quakelive.cfgUpdater.CFG_BIT_HW) != 0;
        var storeRep = (arg0 & quakelive.cfgUpdater.CFG_BIT_REP) != 0;
        var str = "";
        for (var cvarIndex in this.cvarList) {
            var cvar = this.cvarList[cvarIndex];
            if ((storeRep && cvar.replicate) || (storeHw && !cvar.replicate)) {
                str += "seta " + cvar.name + " \"" + cvar.value + "\"\n"
            }
        }
        return str
    };
    CvarManager.prototype.LoadHardwareCvars = function () {
        this.Parse(qz_instance.GetHardwareCvars())
    };
    window.SetCvar = window.OnCvarChanged = function (name, val, replicate) {
        var skipReplicate = (parseInt(replicate) === 0);
        quakelive.cvars.Set(name, val, false, skipReplicate);
        if (!skipReplicate) {
            quakelive.cfgUpdater.Commit(1)
        }
    };
    quakelive.cvars = new CvarManager();
    quakelive.cfgUpdater.AddSource(quakelive.cvars)
})();
(function ($) {
    function MatchCache() {
        this.cache = {};
        this.Add = function (key, value) {
            this.cache[key] = {
                'value': value,
                'time': new Date()
            }
        };
        this.Get = function (key) {
            if (this.cache[key]) {
                var elapsed = new Date() - this.cache[key].time;
                if (elapsed < 15000) {
                    return this.cache[key].value
                }
                this.Remove(key)
            }
            return null
        };
        this.Remove = function (key) {
            this.cache[key].value = undefined;
            this.cache[key] = undefined
        }
    };
    var matchCache = new MatchCache();
    var PLAYERLIST_WIDTH = 236;

    function MatchTip() {
        this.pinned = null;
        this.GetTooltipOffset = function (node, tip, extraWidth) {
            var rval = {};
            var viewvec = {
                left: $(document).scrollLeft(),
                top: $(document).scrollTop(),
                right: $(document).scrollLeft() + $('body').width(),
                bottom: $(document).scrollTop() + $('body').height(),
                width: $('body').width(),
                height: $('body').height()
            };
            var nodevec = {
                left: node.offset().left,
                top: node.offset().top,
                right: node.offset().left + node.innerWidth(),
                bottom: node.offset().top + node.innerHeight(),
                width: node.innerWidth(),
                height: node.innerHeight()
            };
            var tipvec = {
                width: tip.innerWidth(),
                height: tip.innerHeight()
            };
            var ARROW_OFFSET = 23;
            var ARROW_SPACING = 2;
            var ARROW_HEIGHT = 150;
            var HEADER_HEIGHT = 28;
            var FOOTER_HEIGHT = 28;
            if (nodevec.right + tipvec.width + extraWidth + ARROW_OFFSET > viewvec.right) {
                rval.left = nodevec.left - tipvec.width - ARROW_OFFSET + 4;
                rval.arrowDirection = 'right';
                rval.arrowLeft = nodevec.left - ARROW_OFFSET;
                tip.orientation = 'left'
            } else {
                rval.left = nodevec.left + nodevec.width + ARROW_OFFSET;
                rval.arrowDirection = 'left';
                rval.arrowLeft = nodevec.right + ARROW_SPACING;
                tip.orientation = 'right'
            }
            rval.arrowTop = nodevec.top + nodevec.height / 2 - (ARROW_HEIGHT / 2);
            if (rval.arrowTop < viewvec.top) {
                var delta = viewvec.top - rval.arrowTop;
                if (delta > nodevec.height / 2) {
                    delta = nodevec.height / 2
                }
                rval.arrowTop += delta
            }
            rval.top = rval.arrowTop - (tipvec.height - HEADER_HEIGHT - FOOTER_HEIGHT) / 3;
            if (rval.top + tipvec.height > viewvec.bottom) {
                rval.top -= (rval.top + tipvec.height) - viewvec.bottom
            }
            rval.arrowLeft = rval.arrowLeft - rval.left;
            rval.arrowTop = rval.arrowTop - rval.top - HEADER_HEIGHT;
            return rval
        };
        this.ShowTooltip = function (node, content, footer, showArrow) {
            var tip = $('#lgi_tip');
            if (tip.size()) {
                tip.remove()
            }
            var tip = $("<div id='lgi_tip'>" + "<div id='lgi_srv_top'></div>" + "<div id='lgi_srv_fill'>" + "</div>" + "<div id='lgi_srv_bot'></div>" + "</div>");
            var tipContent = $("<div id='lgi_srv_content'></div>");
            tipContent.append(content);
            tip.find('#lgi_srv_fill').append(tipContent);
            tip.find('#lgi_srv_bot').html(footer);
            tip.css('left', '0px');
            tip.css('top', '0px');
            tip.appendTo('body');
            var ofs = this.GetTooltipOffset(node, tip, PLAYERLIST_WIDTH);
            tip.css('left', ofs.left + 'px');
            tip.css('top', ofs.top + 'px');
            tip.show();
            if (showArrow) {
                tip.find('#lgi_srv_fill').append("<div id='lgi_arrow_" + ofs.arrowDirection + "' style='position: absolute; left: " + ofs.arrowLeft + "px; top: " + ofs.arrowTop + "px'></div>")
            }
            return tip
        };
        this.BuildServerContent = function (server) {
            var tipContent = $('<div></div>');
            var gametype = quakelive.GetGameTypeByID(server.game_type);
            var skill = GetSkillRankInfo(server);
            skillColor = skill.color;
            var html = "<div id='lgi_host_name' class=''>" + server.host_name + "</div>" + "<div id='lgi_map_name' class='lgi_big'></div>" + "<div id='lgi_map_group'>" + "<div id='lgi_map'>" + "<div id='lgi_map_pic'></div>" + "<div id='lgi_map_frame' class='frame_skill" + skill.delta + "'></div>" + "<img id='lgi_skill_level' width='21' height='21' src='" + skill.img + "' />" + "<div id='lgi_skill_level_name' class='name_skill" + skill.delta + "'>" + skill.desc + "</div>" + "</div>" + "<div id='lgi_map_details' class='lgi_medbold'>" + "</div>" + "</div>";
            tipContent.append(html);
            var title = server.GetMapTitle();
            tipContent.find('#lgi_map_name').html(title);
            tipContent.find('#lgi_map_pic').html("<img src='" + quakelive.resource("/images/levelshots/md/" + server.map.toLowerCase() + ".jpg") + "' width='112' height='84' alt='" + title + "' />");
            var tipDetails = tipContent.find('#lgi_map_details');
            var AddTipDetail = function (txt, img, id) {
                tipDetails.append("<p class='lgi_row'>" + "<img src='" + img + "' width='16' height='16' alt='' />" + "<span" + (id ? " id='" + id + "'" : "") + ">" + txt + "</span>" + "<div class='cl'></div>" + "</p>")
            };
            if (server.g_needpass) {
                AddTipDetail("Password Secured", quakelive.resource("/images/lgi/server_details_ranked.png"))
            }
            var loc = locdb.GetByID(server.location_id);
            if (loc) {
                var locName;
                if (loc.IsUSA()) {
                    locName = loc.GetCityState()
                } else {
                    locName = [loc.countryAbbr, loc.GetCityState()].join(', ')
                }
                AddTipDetail(locName, quakelive.resource("/images/lgi/server_details_hosted.png"))
            } else {}
            AddTipDetail(server.GetGameTypeTitle(), quakelive.resource("/images/gametypes/" + gametype.name + "_sm.png"));
            if (server.details) {
                var scorelimit = 0;
                var scorelimitName = '';
                if (server.game_type == quakelive.DbGameTypes.Ctf) {
                    scorelimit = server.capturelimit;
                    scorelimitName = 'Capture Limit'
                } else if (server.game_type == quakelive.DbGameTypes.ClanArena) {
                    scorelimit = server.roundlimit;
                    scorelimitName = 'Round Limit'
                } else {
                    scorelimit = server.fraglimit;
                    scorelimitName = 'Frag Limit'
                }
                AddTipDetail(scorelimitName + ": " + (scorelimit || "None"), quakelive.resource("/images/lgi/server_details_fraglimit.png"));
                if (server.g_gamestate == 'IN_PROGRESS') {
                    AddTipDetail("Time Left: &hellip;", quakelive.resource("/images/lgi/server_details_time.png"), "lgi_match_timeleft")
                } else {
                    AddTipDetail("Time Limit: " + server.timelimit, quakelive.resource("/images/lgi/server_details_time.png"))
                }
            }
            var str = "Players: " + server.num_clients + " / " + server.max_clients;
            var img;
            if (server.num_friends > 0) {
                if (server.num_clients > 1) {
                    str += " (" + server.num_friends + ")"
                }
                img = quakelive.resource("/images/lgi/server_details_friends.png")
            } else {
                img = quakelive.resource("/images/lgi/server_details_players.png")
            }
            AddTipDetail(str, img);
            if (server.g_gamestate == 'IN_PROGRESS') {
                var topScores = [];
                if (quakelive.IsTeamGameType(server.game_type)) {
                    var redTeamIndex, blueTeamIndex;
                    if (server.g_redscore >= server.g_bluescore) {
                        redTeamIndex = 0;
                        blueTeamIndex = 1
                    } else {
                        redTeamIndex = 1;
                        blueTeamIndex = 0
                    }
                    topScores[redTeamIndex] = {
                        name: 'Red Team',
                        score: server.g_redscore,
                        classes: 'red_team_color'
                    };
                    topScores[blueTeamIndex] = {
                        name: 'Blue Team',
                        score: server.g_bluescore,
                        classes: 'blue_team_color'
                    }
                } else {
                    var bestRanks = [99999, 99999];
                    var bestRankIndexes = [0, 0];
                    for (var i = 0; i < server.players.length; ++i) {
                        var p = server.players[i];
                        for (var bestIndex = 0; bestIndex < bestRanks.length; ++bestIndex) {
                            if (p.rank < bestRanks[bestIndex] && p.team != ServerTeam.Spec) {
                                bestRanks[bestIndex] = p.rank;
                                bestRankIndexes[bestIndex] = i;
                                break
                            }
                        }
                    }
                    for (var bestIndex = 0; bestIndex < bestRanks.length; ++bestIndex) {
                        var scoreData = {};
                        var p = server.players[bestRankIndexes[bestIndex]];
                        scoreData.name = p.name;
                        scoreData.clan = p.clan;
                        scoreData.score = p.score;
                        topScores[bestIndex] = scoreData
                    }
                }
                if (topScores.length > 0) {
                    var scoresHtml = "";
                    var playerName;
                    tipDetails.append("<p class='lgi_row tc inprogress_txt'>Scoreboard</p>");
                    scoresHtml += "<div class='lgi_scores_section'>";
                    for (var i = 0; i < topScores.length; ++i) {
                        scoresHtml += "<div class='lgi_separator'></div>";
                        scoresHtml += "<div class='lgi_scores_row'>";
                        playerName = (topScores[i].clan ? (topScores[i].clan + " ") : "") + topScores[i].name;
                        scoresHtml += "<div class='lgi_name'>" + StripColors(playerName) + "</div>";
                        scoresHtml += "<div class='lgi_score'>" + topScores[i].score + "</div>";
                        scoresHtml += "<div class='cl'></div>";
                        scoresHtml += "</div>"
                    }
                    scoresHtml += "</div>";
                    tipContent.append(scoresHtml)
                }
            } else {
                if (server.players.length > 0) {
                    tipDetails.append("<p class='lgi_row tc pregame_txt'>Pre-Game Warmup</p>")
                } else {
                    tipDetails.append("<p class='lgi_row tc pregame_txt'>Waiting For Players</p>")
                }
            }
            return tipContent
        };
        this.DisplayMatchTooltip = function (node, server) {
            var tip, content, footer, showArrow;
            if (server === null) {
                content = ["<img src='", quakelive.resource("/images/loader.gif"), "' width='62' height='13' style='padding: 5px' />"].join('');
                footer = "<p style='color: #eee'>Loading Game Info&hellip;</p>";
                showArrow = false
            } else if (typeof(server) == 'string') {
                content = ["<div style='padding: 5px'>", server, "</div>"].join('');
                footer = "<p style='color: #f00'>An Error Occurred</p>";
                showArrow = false;
                $('#lgi_cli').remove();
                this.pinned = null
            } else if (typeof(server) == 'object') {
                content = this.BuildServerContent(server);
                var skill = GetSkillRankInfo(server);
                footer = ["<p style='color: ", skill.color, "'>Click to Join Game!</p>"].join('');
                showArrow = true
            } else {}
            return this.ShowTooltip(node, content, footer, showArrow)
        };
        var ServerTeam = {
            Free: 0,
            Red: 1,
            Blue: 2,
            Spec: 3
        };
        this.DisplayMatchPlayers = function (server) {
            var node = $('#lgi_tip');
            var tip = $('#lgi_cli');
            if (tip.size()) {
                tip.remove()
            }
            tip = $("<div id='lgi_cli'>" + "<div id='lgi_cli_top'>" + "<div class='lgi_headcol_1'>Player Name</div>" + "<div class='lgi_headcol_2'>Score</div>" + "</div>" + "<div id='lgi_cli_fill'>" + "<div id='lgi_cli_content'></div>" + "</div>" + "<div id='lgi_cli_bot'>" + "</div>" + "</div>");
            var tipContent = tip.find('#lgi_cli_content');
            tipContent.empty();
            if (server.players.length > 0) {
                for (var i = 0; i < server.players.length; ++i) {
                    var p = server.players[i];
                    var name, bare_name, score, classes, modelskin;
                    classes = (i % 2) == 0 ? "lgi_med lgi_cli_row_1" : "lgi_med lgi_cli_row_2";
                    if (p.friend) {
                        classes += " lgi_is_friend"
                    } else if (p.blocked) {
                        classes += " lgi_is_blocked"
                    }
                    name = p.clan ? (StripColors(p.clan) + " ") : "";
                    bare_name = StripColors(p.name);
                    name += bare_name;
                    if (p.bot) {
                        name += " <i>(Bot)</i>";
                        classes += " lgi_is_bot"
                    }
                    if (p.team == ServerTeam.Spec) {
                        score = "SPEC"
                    } else {
                        score = p.score
                    }
                    if (p.model) {
                        var parts = p.model.toLowerCase().split("/");
                        modelskin = parts[0] + "_";
                        if (parts[1]) {
                            modelskin += parts[1]
                        } else {
                            modelskin += "default"
                        }
                    } else {
                        modelskin = "sarge_default"
                    }
                    if (p.team == ServerTeam.Red) {
                        modelskin = ChangeModelSkin(modelskin, "red")
                    } else if (p.team == ServerTeam.Blue) {
                        modelskin = ChangeModelSkin(modelskin, "blue")
                    }
                    var profileLink = "<a href='javascript:;' onclick='quakelive.Goto(\"profile/summary/" + StripColors(p.name) + "\"); return false'>";
                    var dispIcon;
                    if (quakelive.mod_friends.IsBlocked(bare_name)) {
                        dispIcon = "<img src='" + quakelive.resource("/images/players/icon_gray_sm/" + modelskin + ".jpg") + "' class='lgi_bordercolor_" + p.team + "' width='18' height='18' />"
                    } else {
                        dispIcon = "<img src='" + quakelive.resource("/images/players/icon_sm/" + modelskin + ".jpg") + "' class='lgi_bordercolor_" + p.team + "' width='18' height='18' />"
                    }
                    var dispName = name;
                    if (!p.bot) {
                        dispIcon = profileLink + dispIcon + "</a>";
                        dispName = profileLink + dispName + "</a>"
                    }
                    tipContent.append("<div class='" + classes + "'>" + "<div class='lgi_cli_col_1'>" + dispIcon + "<span>" + dispName + "</span><div class='cl'></div>" + "</div>" + "<div class='lgi_cli_col_2'>" + score + "</div>" + "</div>")
                }
            } else {
                tipContent.append('<center>No Players in Game</center>')
            }
            var viewvec = {
                left: $(document).scrollLeft(),
                top: $(document).scrollTop(),
                right: $(document).scrollLeft() + $('body').width(),
                bottom: $(document).scrollTop() + $('body').height(),
                width: $('body').width(),
                height: $('body').height()
            };
            var nodevec = {
                left: node.offset().left,
                top: node.offset().top,
                right: node.offset().left + node.innerWidth(),
                bottom: node.offset().top + node.innerHeight(),
                width: node.innerWidth(),
                height: node.innerHeight()
            };
            var tipvec = {
                width: PLAYERLIST_WIDTH
            };
            if (node.orientation == 'left') {
                tipvec.left = nodevec.left - tipvec.width
            } else {
                tipvec.left = nodevec.right
            }
            tipvec.top = nodevec.top;
            tip.css('left', tipvec.left + 'px');
            tip.css('top', tipvec.top + 'px');
            tip.appendTo('body');
            tip.show()
        };
        this.HideMatchTooltip = function (public_id) {
            if (this.pinned && this.pinned.public_id == public_id) {
                return
            }
            this.pinned = null;
            $.ajaxAbort('matchdetails');
            $('#lgi_tip').remove().hide();
            $('#lgi_cli').remove().hide();
            if (this.updateTimeHandle) {
                clearTimeout(this.updateTimeHandle);
                this.updateTimeHandle = null
            }
        };
        this.OnHoverMatchTooltip_Success = function (node, server) {
            var numFriendsOnServer = 0;
            var numBlockedOnServer = 0;
            var tip = this.DisplayMatchTooltip(node, server);
            if (server.timelimit > 0) {
                var self = this;
                var levelstarttime = server.g_levelstarttime;
                TimeUpdater = function () {
                    var now = parseInt(new Date().getTime() / 1000);
                    var secsLeft = (server.timelimit * 60) - (now - levelstarttime);
                    if (secsLeft > 0) {
                        var minsLeft = parseInt(secsLeft / 60);
                        if (minsLeft < 10) {
                            minsLeft = "0" + minsLeft
                        }
                        secsLeft -= minsLeft * 60;
                        if (secsLeft < 10) {
                            secsLeft = "0" + secsLeft
                        }
                        $('#lgi_match_timeleft').text("Time Left: " + minsLeft + ":" + secsLeft);
                        self.updateTimeHandle = setTimeout(TimeUpdater, 1000)
                    } else {
                        $('#lgi_match_timeleft').text("Time Left: None")
                    }
                };
                TimeUpdater()
            }
            return tip
        };
        this.OnHoverMatchTooltip_Error = function (node, server) {
            this.DisplayMatchTooltip(node, "We're sorry, but we cannot load the data for this match.")
        };
        this.OnHoverMatchTooltip = function (node, public_id) {
            if (this.pinned && this.pinned.public_id == public_id) {
                return
            }
            this.pinned = null;
            this.HideMatchTooltip(-1);
            var server = quakelive.serverManager.GetServerInfo(public_id);
            if (server && server.details) {
                this.OnHoverMatchTooltip_Success(node, server)
            } else {
                this.DisplayMatchTooltip(node, null)
            }
            var self = this;
            var OnSuccess = function (server) {
                self.OnHoverMatchTooltip_Success(node, server)
            };
            var OnError = function (server) {
                self.OnHoverMatchTooltip_Error(node, server)
            };
            quakelive.serverManager.RefreshServerDetails(public_id, {
                'onSuccess': OnSuccess,
                'onError': OnError,
                'cacheTime': 30
            })
        };
        this.PinMatchTooltip = function (server) {
            this.pinned = server;
            if (!server.skillTooHigh) {
                var playBtn = $('<a class="lgi_play_btn" href="javascript:;"></a>');
                var self = this;
                playBtn.click(function () {
                    self.JoinServer(server)
                });
                $("<div id='lgi_play'></div>").append(playBtn).appendTo($('#lgi_map'))
            }
            $('#lgi_srv_top').append("<div id='lgi_srv_close'><a href='javascript:;' onclick='quakelive.matchtip.HideMatchTooltip(-1); return false' class='lgi_btn_close'></a></div>")
        };
        this.OnClickMatchTooltip = function (node, public_id) {
            var server = quakelive.serverManager.GetServerInfo(public_id);
            if (!server || server.error) {
                return
            }
            this.PinMatchTooltip(server);
            this.DisplayMatchPlayers(server)
        };
        this.OnDblClickMatchTooltip = function (node, public_id) {
            var server = quakelive.serverManager.GetServerInfo(public_id);
            if (!server || server.error) {
                return
            }
            this.JoinServer(server)
        };
        this.BindMatchTooltip = function (node, public_id) {
            node.unbind("hover");
            node.unbind("click");
            node.unbind("dblclick");
            var me = this;
            node.click(function (event) {
                me.OnClickMatchTooltip(node, public_id);
                event.preventDefault()
            });
            node.dblclick(function (event) {
                me.OnDblClickMatchTooltip(node, public_id)
            });
            node.hoverIntent(function () {
                me.OnHoverMatchTooltip(node, public_id)
            },
            function () {
                me.HideMatchTooltip(public_id)
            })
        };
        this.BindBotTooltip = function (node, json) {
            node.unbind("hover");
            node.unbind("click");
            node.unbind("dblclick");
            var me = this;
            node.click(function (event) {
                this.PinMatchTooltip(node, {});
                event.preventDefault()
            });
            node.hover(function () {
                me.ShowBotGameInfo(node, json)
            },
            function () {
                me.HideMatchTooltip()
            })
        };
        this.ShowBotGameInfo = function (node, json) {
            var tip = $('#lgi_tip');
            if (tip.size()) {
                tip.remove()
            }
            var sysname = json.MAP.toLowerCase().split('/');
            sysname = sysname[sysname.length - 1].split('.');
            sysname = sysname[0];
            var map = mapdb.maps[sysname];
            var tip = $("<div id='lgi_tip'>" + "<div id='lgi_srv_top'></div>" + "<div id='lgi_srv_fill'>" + "<div id='lgi_srv_bot_content'>" + "<h1>" + (map.name || "Unknown") + "</h1>" + "<img src='" + quakelive.resource("/images/levelshots/md/" + map.sysname + ".jpg") + "' width='112' height='84' />" + "</div>" + "</div>" + "<div id='lgi_srv_bot'>" + "<p style='color: white;'>In Practice Match</p>" + "</div>" + "</div>");
            tip.appendTo('body');
            var ofs = this.GetTooltipOffset(node, tip, 0);
            tip.css('left', ofs.left + 'px');
            tip.css('top', ofs.top + 'px');
            tip.show()
        };
        this.JoinServer = function (server) {
            if (quakelive.IsGameRunning()) {
                qz_instance.SendGameCommand("connect " + server.host_address);
                quakelive.SendModuleMessage("OnGameUpdated", {
                    "isBotGame": false,
                    "serverInfo": server
                })
            } else {
                join_server(server.host_address, server)
            }
            this.HideMatchTooltip(-1)
        }
    }
    quakelive.matchtip = new MatchTip()
})(jQuery);
(function ($) {
    function StatsCache() {
        this.cache = {};
        this.Add = function (key, value) {
            this.cache[key] = {
                'value': value,
                'time': new Date()
            }
        };
        this.Get = function (key) {
            if (this.cache[key]) {
                var elapsed = new Date() - this.cache[key].time;
                if (elapsed < 5 * 60000) {
                    return this.cache[key].value
                }
                this.Remove(key)
            }
            return null
        };
        this.Remove = function (key) {
            this.cache[key].value = undefined;
            this.cache[key] = undefined
        }
    };
    var statsCache = new StatsCache();

    function StatsTip() {
        this.GetTooltipOffset = function (node, tip) {
            var rval = {};
            var viewvec = {
                left: $(document).scrollLeft(),
                top: $(document).scrollTop(),
                right: $(document).scrollLeft() + $('body').width(),
                bottom: $(document).scrollTop() + $('body').height(),
                width: $('body').width(),
                height: $('body').height()
            };
            var nodevec = {
                left: node.offset().left,
                top: node.offset().top,
                right: node.offset().left + node.innerWidth(),
                bottom: node.offset().top + node.innerHeight(),
                width: node.width(),
                height: node.height()
            };
            var tipvec = {
                width: tip.innerWidth(),
                height: tip.innerHeight()
            };
            if (nodevec.right + tipvec.width > viewvec.right) {
                rval.left = nodevec.left - tipvec.width
            } else {
                rval.left = nodevec.left + nodevec.width
            }
            rval.top = nodevec.top - tipvec.height / 3;
            if (rval.top + tipvec.height > viewvec.bottom) {
                rval.top -= (rval.top + tipvec.height) - viewvec.bottom
            }
            return rval
        };
        this.GetVersusFrame = function (gameType, player1, player2, team1, team2) {
            var inner = $(quakelive.mod_stats.TPL_MATCH_VSCONTAINER);
            var gameTypeDir = (player1.TEAM ? player1.TEAM.toLowerCase() + '_lg' : 'lg');
            var models = [player1.PLAYER_MODEL || 'sarge_default', (player2 && player2.PLAYER_MODEL) ? player2.PLAYER_MODEL : 'sarge_default'];
            var players = [player1, player2];
            var teams = [team1, team2];
            inner.find('.gameTypeIcon').html('<img src="' + quakelive.resource('/images/gametypes/' + gameTypeDir + '/' + gameType.toLowerCase() + '.png') + '" width="75" height="75" />');
            for (var i = 0; i < 2; ++i) {
                var player = players[i];
                var team = teams[i];
                var model = models[i];
                var ordinal = i + 1;
                if (player) {
                    if (player.TEAM) {
                        inner.find('.scoreNum' + ordinal).addClass('text_team_' + player.TEAM.toLowerCase()).text(FirstDefined(team.ROUNDS_WON, team.CAPTURES, team.SCORE));
                        model = ChangeModelSkin(model, player.TEAM.toLowerCase());
                        inner.find('.flagNum' + ordinal).hide();
                        inner.find('.nameNum' + ordinal).text("Team " + player.TEAM)
                    } else {
                        if (player.PLAYER_COUNTRY) {
                            inner.find('.flagNum' + ordinal).html('<img src="' + quakelive.resource('/images/flags/' + player.PLAYER_COUNTRY.toLowerCase() + '.gif') + '" width="16" height="11" />').show()
                        }
                        inner.find('.nameNum' + ordinal).text(player.PLAYER_NICK);
                        inner.find('.scoreNum' + ordinal).text(player.SCORE)
                    }
                    var imgpath;
                    if (quakelive.mod_friends.IsBlocked(player.PLAYER_NICK)) imgpath = quakelive.PlayerAvatarPath.G_XL;
                    else imgpath = quakelive.PlayerAvatarPath.XL;
                    inner.find('.headNum' + ordinal).html('<img src="' + quakelive.resource(imgpath + model + '.jpg') + '" />')
                } else {
                    inner.find('.headNum' + ordinal).html('<img src="' + quakelive.resource('/images/players/icon_xl/none.jpg') + '" width="62" height="62" />');
                    inner.find('.scoreNum' + ordinal).text("--");
                    inner.find('.flagNum' + ordinal).hide();
                    inner.find('.nameNum' + ordinal).text("N/A");
                    inner.find('.rankNum' + ordinal).hide();
                    inner.find('.noPlayer' + ordinal).show()
                }
            }
            return inner
        };
        this.DisplayStatsTooltip = function (node, json) {
            var tip = $('#stats_tip');
            if (tip.length == 0) {
                tip = $(quakelive.mod_stats.TPL_MATCH_SUMMARY)
            }
            var tipContent = $("<div id='stats_srv_content'></div>");
            if (json) {
                var tipDef = this.TIP_DEFS[json.GAME_TYPE.toUpperCase()];
                if (!tipDef) {
                    return
                }
                var topPlayers = [];
                var topTeams = [null, null];
                if (json.WINNING_TEAM) {
                    var teamId = json.WINNING_TEAM.toUpperCase();
                    var teamScoreboard = json[teamId + "_SCOREBOARD"];
                    var oppScoreboard = json[(teamId == "RED" ? "BLUE" : "RED") + "_SCOREBOARD"];
                    topPlayers[0] = teamScoreboard[0];
                    topPlayers[1] = oppScoreboard[0];
                    if (json.WINNING_TEAM == json.TEAM_SCOREBOARD[0].TEAM) {
                        topTeams[0] = json.TEAM_SCOREBOARD[0];
                        topTeams[1] = json.TEAM_SCOREBOARD[1]
                    } else {
                        topTeams[0] = json.TEAM_SCOREBOARD[1];
                        topTeams[1] = json.TEAM_SCOREBOARD[0]
                    }
                    winner = json.WINNING_TEAM
                } else {
                    topPlayers[0] = json.SCOREBOARD[0];
                    topPlayers[1] = json.SCOREBOARD[1];
                    winner = topPlayers[0]
                }
                tip.find('#stats_datacontainer').empty().append(this.GetVersusFrame(json.GAME_TYPE, topPlayers[0], topPlayers[1], topTeams[0], topTeams[1])).append(quakelive.mod_stats.TPL_MATCH_SUMMARY_INNER);
                tip.find('#match_mapshot').html("<img alt=\"\" src=\"" + quakelive.resource("/images/levelshots/md/" + json.MAP_NAME_SHORT + ".jpg") + "\" width=\"112\" height=\"84\" class=\"placeImg\" />");
                var html = "<span class=\"grayNameTxt\">" + json.MAP_NAME + "</span><br />";
                html += "<span class=\"Norm11px\"><b>Game Type:</b> " + this.FormatGameType(json) + "</span><br />";
                html += "<span class=\"Norm11px\"><b>Date:</b> " + json.GAME_TIMESTAMP_NICE + " ago</span><br />";
                html += "<span class=\"Norm11px\"><b>Winner:</b> ";
                if (json.WINNING_TEAM) {
                    html += json.WINNING_TEAM
                } else {
                    html += json.SCOREBOARD[0].PLAYER_NICK
                }
                html += "</span><br />";
                html += "<span class=\"Norm11px\"><b>Duration:</b> " + json.GAME_LENGTH_NICE + "</span><br />";
                tip.find('#match_maindata').html(html);
                var count = 0;
                for (var i = 0; i < tipDef.length; ++i) {
                    var def = tipDef[i];
                    if (!json[def.key]) {
                        continue
                    }
                    var rowClass = (count++%2 == 0) ? "lghtgrayBG" : "drkgrayBG";
                    var html = "<div class=\"" + rowClass + "\">" + "<div class='leftCol'>" + def.name + "</div>";
                    html += "<div class='midCol'>";
                    html += "<img src='" + quakelive.resource("/images/flags/" + json[def.key].PLAYER_COUNTRY.toLowerCase() + ".gif") + "' width='16' height='11' class='tipPlayerFlag fl' />";
                    var modelskin = json[def.key].PLAYER_MODEL;
                    if (json[def.key].PLAYER_TEAM) {
                        modelskin = ChangeModelSkin(modelskin, json[def.key].PLAYER_TEAM.toLowerCase())
                    }
                    var imgpath;
                    if (quakelive.mod_friends.IsBlocked(json[def.key].PLAYER_NICK)) {
                        imgpath = quakelive.PlayerAvatarPath.G_SM
                    } else {
                        imgpath = quakelive.PlayerAvatarPath.SM
                    }
                    html += "<img src='" + quakelive.resource(imgpath + modelskin + ".jpg") + "' width='18' height='18' class='tipPlayerIcon fl' />";
                    html += json[def.key].PLAYER_NICK;
                    html += "</div>";
                    html += "<div class='rightCol'>" + (def.fmt ? def.fmt(json[def.key].NUM, json) : json[def.key].NUM) + "</div>";
                    html += "<div class='cl'></div>" + "</div>";
                    tip.find(".match_highlights").append(html)
                }
                var rowClass = (count++%2 == 0) ? "lghtgrayBG" : "drkgrayBG";
                tip.find(".match_highlights").append("<div class=\"" + rowClass + "\"></div>")
            }
            tip.find('#stats_srv_fill').append(tipContent);
            tip.css('left', '0px');
            tip.css('top', '0px');
            tip.appendTo('body');
            var ofs = this.GetTooltipOffset(node, tip);
            tip.css('left', ofs.left + 'px');
            tip.css('top', ofs.top + 'px');
            tip.show();
            return tip
        };
        this.HideStatsTooltip = function () {
            this.loading_public_id = 0;
            $('#stats_tip').remove().hide();
            $('#stats_cli').remove().hide()
        };
        this.OnHoverStatsTooltip_Success = function (node, public_id, game_type, json) {
            return this.DisplayStatsTooltip(node, json)
        };
        this.OnHoverStatsTooltip_Error = function () {
            $('#stats_datacontainer').html('<div class="error">The match you have requested is invalid or has expired.</div>')
        };
        var QuitStatus = {
            NONE: 0,
            SWITCHED: 1,
            QUIT: 2
        };
        this.ProcessMatchData = function (json) {
            var fields = ['SCOREBOARD', 'RED_SCOREBOARD', 'BLUE_SCOREBOARD'];
            var boardPlayers = {};
            for (var fieldIndex in fields) {
                var boardName = fields[fieldIndex];
                if (!boardPlayers[boardName]) {
                    boardPlayers[boardName] = {}
                }
                for (var playerIndex in json[boardName]) {
                    var player = json[boardName][playerIndex];
                    if (typeof(player.PLAYER_NICK) != 'string') {
                        player.PLAYER_NICK = '' + player.PLAYER_NICK
                    }
                    boardPlayers[boardName][player.PLAYER_NICK] = true
                }
            }
            for (var fieldIndex in fields) {
                var boardName = fields[fieldIndex];
                var quittersBoardName = boardName + '_QUITTERS';
                if (typeof(json[quittersBoardName]) != 'undefined') {
                    var index = 1;
                    var newList = [];
                    var sum = {};
                    for (var playerIndex in json[quittersBoardName]) {
                        var player = json[quittersBoardName][playerIndex];
                        if (typeof(player.PLAYER_NICK) != 'string') {
                            player.PLAYER_NICK = '' + player.PLAYER_NICK
                        }
                        for (var columnIndex in player) {
                            if (typeof(sum[columnIndex]) == 'undefined') {
                                sum[columnIndex] = 0
                            }
                            try {
                                var value = parseInt(player[columnIndex]);
                                if (typeof(value) == 'number') {
                                    sum[columnIndex] += value
                                }
                            } catch(e) {}
                        }
                        player['QUITTERS_SUM'] = false;
                        if (player['RANK'] == 'Q') {
                            var otherBoard = null;
                            if (boardName == 'RED_SCOREBOARD') {
                                otherBoard = 'BLUE_SCOREBOARD'
                            } else if (boardName == 'BLUE_SCOREBOARD') {
                                otherBoard = 'RED_SCOREBOARD'
                            }
                            if (otherBoard && boardPlayers[otherBoard][player.PLAYER_NICK]) {
                                player['QUIT_STATUS'] = QuitStatus.SWITCHED
                            } else {
                                player['QUIT_STATUS'] = QuitStatus.QUIT
                            }
                        } else {
                            player['QUIT_STATUS'] = QuitStatus.NONE
                        }
                        newList[index++] = player
                    }
                    sum['QUITTERS_SUM'] = true;
                    if (typeof(player['TEAM']) != 'undefined') {
                        sum['TEAM_RANK'] = 'Q';
                        sum['TEAM'] = player['TEAM']
                    }
                    sum['PLAYER_COUNTRY'] = '';
                    sum['PLAYER_MODEL'] = '';
                    sum['PLAYER_NICK'] = '';
                    var numQuitters = json[quittersBoardName].length;
                    for (var i in ACC_FIELDS) {
                        var field = ACC_FIELDS[i];
                        if (typeof(sum[field]) != 'undefined') {
                            try {
                                sum[field] = Math.round((sum[field] / numQuitters))
                            } catch(e) {}
                        }
                    }
                    newList[0] = sum;
                    newList.sort(function (a, b) {
                        if (a.QUITTERS_SUM || b.QUITTERS_SUM) {
                            if (a.QUITTERS_SUM === true && b.QUITTERS_SUM === false) {
                                return -1
                            } else if (a.QUITTERS_SUM === false && b.QUITTERS_SUM === true) {
                                return 1
                            } else {
                                return 0
                            }
                        }
                        if (a.QUIT_STATUS < b.QUIT_STATUS) {
                            return -1
                        } else if (a.QUIT_STATUS > b.QUIT_STATUS) {
                            return 1
                        } else {
                            var aa = a.PLAYER_NICK.toLowerCase();
                            var bb = b.PLAYER_NICK.toLowerCase();
                            if (aa < bb) {
                                return -1
                            } else if (aa > bb) {
                                return 1
                            } else {
                                return 0
                            }
                        }
                    });
                    json[quittersBoardName] = newList
                }
            }
        };
        this.loading_public_id = 0;
        var HOVER_STATS_DELAY = 250;
        this.OnHoverStatsTooltip = function (node, public_id, game_type) {
            this.DisplayStatsTooltip(node, null);
            this.loading_public_id = public_id;
            var cachedData = statsCache.Get(public_id);
            if (!cachedData) {
                var self = this;
                setTimeout(function () {
                    if (self.loading_public_id != public_id) {
                        return
                    }
                    $.ajax({
                        url: '/stats/matchdetails/' + public_id + '/' + game_type,
                        dataType: 'json',
                        mode: 'abort',
                        port: 'statstip',
                        cache: true,
                        success: function (json) {
                            self.ProcessMatchData(json);
                            if (public_id == self.loading_public_id) {
                                var tip = self.OnHoverStatsTooltip_Success(node, public_id, game_type, json);
                                tip.show()
                            }
                            var data = {
                                'json': json,
                                'tip': null
                            };
                            statsCache.Add(public_id, data);
                            self.loading_public_id = 0
                        },
                        error: self.OnHoverStatsTooltip_Error
                    })
                },
                HOVER_STATS_DELAY)
            } else {
                var tip = this.OnHoverStatsTooltip_Success(node, public_id, game_type, cachedData.json);
                cachedData.tip = tip;
                tip.show();
                this.loading_public_id = 0
            }
        };
        this.FormatProfileLink = function (value, json, board) {
            var html = "";
            if (json['QUITTERS_SUM']) {
                html += "<b>Switched / Quit</b>"
            } else {
                var modelskin = json.PLAYER_MODEL;
                if (json.TEAM) {
                    modelskin = ChangeModelSkin(json.PLAYER_MODEL, json.TEAM.toLowerCase())
                }
                var imgpath;
                if (quakelive.mod_friends.IsBlocked(json.PLAYER_NICK) || json['QUIT_STATUS'] == QuitStatus.QUIT) {
                    imgpath = quakelive.PlayerAvatarPath.G_SM
                } else {
                    imgpath = quakelive.PlayerAvatarPath.SM
                }
                html += "<img src='" + quakelive.resource("/images/flags/" + json.PLAYER_COUNTRY.toLowerCase() + ".gif") + "' width='16' height='11' class='boardPlayerFlag' />";
                html += "<img src='" + quakelive.resource(imgpath + modelskin + ".jpg") + "' width='18' height='18' class='boardPlayerIcon' />";
                html += '<a href="javascript:;" onclick="quakelive.Goto(\'profile/summary/' + value + '\'); return false" style="color: black">' + value + '</a>'
            }
            return html
        };
        this.ToggleQuitters = function (e) {
            var button = $(this).find('a.QuittersToggleBtn');
            button.toggleClass('QuittersToggledBtn');
            $('.' + button.attr('data')).toggle()
        };
        this.FormatRank = function (value, json) {
            if (json['QUITTERS_SUM']) {
                var rowClsName = (json['TEAM'] ? (json['TEAM']) : '') + 'Quitters';
                return '<a href="javascript:;" data="' + rowClsName + '" class="QuittersToggleBtn"></a>'
            }
            if (json['QUIT_STATUS']) {
                if (json['QUIT_STATUS'] == QuitStatus.SWITCHED) {
                    return '<img src="' + quakelive.resource('/images/switch_arrow_2.png') + '" width="16" height="16" title="Switched Teams" />'
                } else {
                    return 'Quit'
                }
            }
            if ((typeof(value) == 'string' && value.charAt(0) == 'Q') || value == -1) {
                return '--'
            }
            return FormatRank(value)
        };
        this.FormatWeaponNumber = function (value) {
            if (value == 0 || value == 'N/A') {
                return '--'
            } else {
                return value
            }
        };
        this.FormatTime = function (value) {
            return FormatDuration(value)
        };
        this.FormatPercent = function (value) {
            if (value != 0 && value != 'N/A') {
                return value + "%"
            } else {
                return "--"
            }
        };
        var REDBLUE_FIELDS = [{
            field: 'TEAM_RANK',
            title: 'Rank',
            extraClass: 'tc',
            fmt: this.FormatRank
        },
        {
            field: 'PLAYER_NICK',
            title: 'Player',
            extraClass: 'tl',
            fmt: this.FormatProfileLink
        },
        {
            field: 'CAPTURES',
            title: 'Caps',
            extraClass: 'tc',
            fmt: this.FormatWeaponNumber,
            alt: "Flag Captures"
        },
        {
            field: 'DEFENDS',
            title: 'Defd',
            extraClass: 'tc',
            fmt: this.FormatWeaponNumber,
            alt: "Flag Defends"
        },
        {
            field: 'ASSISTS',
            title: 'Assts',
            extraClass: 'tc',
            fmt: this.FormatWeaponNumber,
            alt: "Flag Assists"
        },
        {
            field: 'ROUNDS_WON',
            title: 'Rounds Won',
            extraClass: 'tc',
            fmt: null
        },
        {
            field: 'SCORE',
            title: 'Score',
            extraClass: 'tc',
            fmt: null
        },
        {
            field: 'KILLS',
            title: 'Frags',
            extraClass: 'tc',
            fmt: null
        },
        {
            field: 'DEATHS',
            title: 'Deaths',
            extraClass: 'tc',
            fmt: null
        },
        {
            field: 'ACCURACY',
            title: 'Acc',
            extraClass: 'tc',
            fmt: this.FormatPercent,
            alt: "Accuracy"
        },
        {
            field: 'MIN',
            title: 'Time',
            extraClas: 'tc',
            fmt: this.FormatTime
        },
        {
            field: 'EXCELLENT',
            title: 'Exc',
            extraClass: 'tc',
            fmt: this.FormatWeaponNumber,
            alt: "\"Excellent\" medals",
            optional: true
        },
        {
            field: 'IMPRESSIVE',
            title: 'Imp',
            extraClass: 'tc',
            fmt: this.FormatWeaponNumber,
            alt: "\"Impressive\" medals",
            optional: true
        },
        {
            field: 'HUMILIATION',
            title: 'Hum',
            extraClass: 'tc',
            fmt: this.FormatWeaponNumber,
            alt: "\"Humiliation\" medals",
            optional: true
        }];
        var PLAYER_WEAPON_FIELDS = [{
            field: 'RANK',
            title: 'Rank',
            extraClass: 'tc',
            fmt: this.FormatRank
        },
        {
            field: 'PLAYER_NICK',
            title: 'Player',
            extraClass: 'tl',
            fmt: this.FormatProfileLink
        },
        {
            field: 'GT',
            title: 'GT',
            extraClass: 'tc',
            fmt: this.FormatWeaponNumber,
            alt: "Gauntlet"
        },
        {
            field: 'MG',
            title: 'MG',
            extraClass: 'tc',
            fmt: this.FormatWeaponNumber,
            alt: "Machine Gun"
        },
        {
            field: 'SG',
            title: 'SG',
            extraClass: 'tc',
            fmt: this.FormatWeaponNumber,
            alt: "Shot Gun"
        },
        {
            field: 'GL',
            title: 'GL',
            extraClass: 'tc',
            fmt: this.FormatWeaponNumber,
            alt: "Grenade Launcher"
        },
        {
            field: 'LG',
            title: 'LG',
            extraClass: 'tc',
            fmt: this.FormatWeaponNumber,
            alt: "Lightning Gun"
        },
        {
            field: 'RL',
            title: 'RL',
            extraClass: 'tc',
            fmt: this.FormatWeaponNumber,
            alt: "Rocket Launcher"
        },
        {
            field: 'RG',
            title: 'RG',
            extraClass: 'tc',
            fmt: this.FormatWeaponNumber,
            alt: "Rail Gun"
        },
        {
            field: 'PG',
            title: 'PG',
            extraClas: 'tc',
            fmt: this.FormatWeaponNumber,
            alt: "Plasma Gun"
        },
        {
            field: 'BFG',
            title: 'BFG',
            extraClass: 'tc',
            fmt: this.FormatWeaponNumber,
            alt: "BFG"
        },
        {
            field: 'CG',
            title: 'CG',
            extraClass: 'tc',
            fmt: this.FormatWeaponNumber,
            alt: "Chain Gun"
        },
        {
            field: 'NG',
            title: 'NG',
            extraClass: 'tc',
            fmt: this.FormatWeaponNumber,
            alt: "Nail Gun"
        },
        {
            field: 'PM',
            title: 'PL',
            extraClass: 'tc',
            fmt: this.FormatWeaponNumber,
            alt: "Prox Launcher"
        }];
        var REDBLUE_WEAPON_FIELDS = [{
            field: 'TEAM_RANK',
            title: 'Rank',
            extraClass: 'tc',
            fmt: this.FormatRank
        },
        {
            field: 'PLAYER_NICK',
            title: 'Player',
            extraClass: 'tl',
            fmt: this.FormatProfileLink
        },
        {
            field: 'GT',
            title: 'GT',
            extraClass: 'tc',
            fmt: this.FormatWeaponNumber,
            alt: "Gauntlet"
        },
        {
            field: 'MG',
            title: 'MG',
            extraClass: 'tc',
            fmt: this.FormatWeaponNumber,
            alt: "Machine Gun"
        },
        {
            field: 'SG',
            title: 'SG',
            extraClass: 'tc',
            fmt: this.FormatWeaponNumber,
            alt: "Shot Gun"
        },
        {
            field: 'GL',
            title: 'GL',
            extraClass: 'tc',
            fmt: this.FormatWeaponNumber,
            alt: "Grenade Launcher"
        },
        {
            field: 'LG',
            title: 'LG',
            extraClass: 'tc',
            fmt: this.FormatWeaponNumber,
            alt: "Lightning Gun"
        },
        {
            field: 'RL',
            title: 'RL',
            extraClass: 'tc',
            fmt: this.FormatWeaponNumber,
            alt: "Rocket Launcher"
        },
        {
            field: 'RG',
            title: 'RG',
            extraClass: 'tc',
            fmt: this.FormatWeaponNumber,
            alt: "Rail Gun"
        },
        {
            field: 'PG',
            title: 'PG',
            extraClas: 'tc',
            fmt: this.FormatWeaponNumber,
            alt: "Plasma Gun"
        },
        {
            field: 'BFG',
            title: 'BFG',
            extraClass: 'tc',
            fmt: this.FormatWeaponNumber,
            alt: "BFG"
        },
        {
            field: 'CG',
            title: 'CG',
            extraClass: 'tc',
            fmt: this.FormatWeaponNumber,
            alt: "Chain Gun"
        },
        {
            field: 'NG',
            title: 'NG',
            extraClass: 'tc',
            fmt: this.FormatWeaponNumber,
            alt: "Nail Gun"
        },
        {
            field: 'PM',
            title: 'PL',
            extraClass: 'tc',
            fmt: this.FormatWeaponNumber,
            alt: "Prox Launcher"
        }];
        var TEAM_WEAPON_FIELDS = [{
            field: 'TEAM',
            title: 'Team',
            extraClass: 'tl',
            fmt: null
        },
        {
            field: 'GT',
            title: 'GT',
            extraClass: 'tc',
            fmt: this.FormatWeaponNumber,
            alt: "Gauntlet"
        },
        {
            field: 'MG',
            title: 'MG',
            extraClass: 'tc',
            fmt: this.FormatWeaponNumber,
            alt: "Machine Gun"
        },
        {
            field: 'SG',
            title: 'SG',
            extraClass: 'tc',
            fmt: this.FormatWeaponNumber,
            alt: "Shot Gun"
        },
        {
            field: 'GL',
            title: 'GL',
            extraClass: 'tc',
            fmt: this.FormatWeaponNumber,
            alt: "Grenade Launcher"
        },
        {
            field: 'LG',
            title: 'LG',
            extraClass: 'tc',
            fmt: this.FormatWeaponNumber,
            alt: "Lightning Gun"
        },
        {
            field: 'RL',
            title: 'RL',
            extraClass: 'tc',
            fmt: this.FormatWeaponNumber,
            alt: "Rocket Launcher"
        },
        {
            field: 'RG',
            title: 'RG',
            extraClass: 'tc',
            fmt: this.FormatWeaponNumber,
            alt: "Rail Gun"
        },
        {
            field: 'PG',
            title: 'PG',
            extraClas: 'tc',
            fmt: this.FormatWeaponNumber,
            alt: "Plasma Gun"
        },
        {
            field: 'BFG',
            title: 'BFG',
            extraClass: 'tc',
            fmt: this.FormatWeaponNumber,
            alt: "BFG"
        },
        {
            field: 'CG',
            title: 'CG',
            extraClass: 'tc',
            fmt: this.FormatWeaponNumber,
            alt: "Chain Gun"
        },
        {
            field: 'NG',
            title: 'NG',
            extraClass: 'tc',
            fmt: this.FormatWeaponNumber,
            alt: "Nail Gun"
        },
        {
            field: 'PM',
            title: 'PL',
            extraClass: 'tc',
            fmt: this.FormatWeaponNumber,
            alt: "Prox Launcher"
        }];
        var ACC_FIELDS = ['GT_A', 'MG_A', 'SG_A', 'GL_A', 'LG_A', 'RL_A', 'RG_A', 'PG_A', 'BFG_A', 'CG_A', 'NG_A', 'PM_A', 'ACCURACY'];
        var PLAYER_WEAPON_ACC_FIELDS = [{
            field: 'RANK',
            title: 'Rank',
            extraClass: 'tc',
            fmt: this.FormatRank
        },
        {
            field: 'PLAYER_NICK',
            title: 'Player',
            extraClass: 'tl',
            fmt: this.FormatProfileLink
        },
        {
            field: 'GT_A',
            title: 'GT',
            extraClass: 'tc',
            fmt: this.FormatPercent,
            alt: "Gauntlet"
        },
        {
            field: 'MG_A',
            title: 'MG',
            extraClass: 'tc',
            fmt: this.FormatPercent,
            alt: "Machine Gun"
        },
        {
            field: 'SG_A',
            title: 'SG',
            extraClass: 'tc',
            fmt: this.FormatPercent,
            alt: "Shot Gun"
        },
        {
            field: 'GL_A',
            title: 'GL',
            extraClass: 'tc',
            fmt: this.FormatPercent,
            alt: "Grenade Launcher"
        },
        {
            field: 'LG_A',
            title: 'LG',
            extraClass: 'tc',
            fmt: this.FormatPercent,
            alt: "Lightning Gun"
        },
        {
            field: 'RL_A',
            title: 'RL',
            extraClass: 'tc',
            fmt: this.FormatPercent,
            alt: "Rocket Launcher"
        },
        {
            field: 'RG_A',
            title: 'RG',
            extraClass: 'tc',
            fmt: this.FormatPercent,
            alt: "Rail Gun"
        },
        {
            field: 'PG_A',
            title: 'PG',
            extraClas: 'tc',
            fmt: this.FormatPercent,
            alt: "Plasma Gun"
        },
        {
            field: 'BFG_A',
            title: 'BFG',
            extraClass: 'tc',
            fmt: this.FormatPercent,
            alt: "BFG"
        },
        {
            field: 'CG_A',
            title: 'CG',
            extraClass: 'tc',
            fmt: this.FormatPercent,
            alt: "Chain Gun"
        },
        {
            field: 'NG_A',
            title: 'NG',
            extraClass: 'tc',
            fmt: this.FormatPercent,
            alt: "Nail Gun"
        },
        {
            field: 'PM_A',
            title: 'PL',
            extraClass: 'tc',
            fmt: this.FormatPercent,
            alt: "Prox Launcher"
        }];
        var REDBLUE_WEAPON_ACC_FIELDS = [{
            field: 'TEAM_RANK',
            title: 'Rank',
            extraClass: 'tc',
            fmt: this.FormatRank
        },
        {
            field: 'PLAYER_NICK',
            title: 'Player',
            extraClass: 'tl',
            fmt: this.FormatProfileLink
        },
        {
            field: 'GT_A',
            title: 'GT',
            extraClass: 'tc',
            fmt: this.FormatPercent,
            alt: "Gauntlet"
        },
        {
            field: 'MG_A',
            title: 'MG',
            extraClass: 'tc',
            fmt: this.FormatPercent,
            alt: "Machine Gun"
        },
        {
            field: 'SG_A',
            title: 'SG',
            extraClass: 'tc',
            fmt: this.FormatPercent,
            alt: "Shot Gun"
        },
        {
            field: 'GL_A',
            title: 'GL',
            extraClass: 'tc',
            fmt: this.FormatPercent,
            alt: "Grenade Launcher"
        },
        {
            field: 'LG_A',
            title: 'LG',
            extraClass: 'tc',
            fmt: this.FormatPercent,
            alt: "Lightning Gun"
        },
        {
            field: 'RL_A',
            title: 'RL',
            extraClass: 'tc',
            fmt: this.FormatPercent,
            alt: "Rocket Launcher"
        },
        {
            field: 'RG_A',
            title: 'RG',
            extraClass: 'tc',
            fmt: this.FormatPercent,
            alt: "Rail Gun"
        },
        {
            field: 'PG_A',
            title: 'PG',
            extraClas: 'tc',
            fmt: this.FormatPercent,
            alt: "Plasma Gun"
        },
        {
            field: 'BFG_A',
            title: 'BFG',
            extraClass: 'tc',
            fmt: this.FormatPercent,
            alt: "BFG"
        },
        {
            field: 'CG_A',
            title: 'CG',
            extraClass: 'tc',
            fmt: this.FormatPercent,
            alt: "Chain Gun"
        },
        {
            field: 'NG_A',
            title: 'NG',
            extraClass: 'tc',
            fmt: this.FormatPercent,
            alt: "Nail Gun"
        },
        {
            field: 'PM_A',
            title: 'PL',
            extraClass: 'tc',
            fmt: this.FormatPercent,
            alt: "Prox Launcher"
        }];
        var TEAM_WEAPON_ACC_FIELDS = [{
            field: 'TEAM',
            title: 'Team',
            extraClass: 'tl',
            fmt: null
        },
        {
            field: 'GT_A',
            title: 'GT',
            extraClass: 'tc',
            fmt: this.FormatPercent,
            alt: "Gauntlet"
        },
        {
            field: 'MG_A',
            title: 'MG',
            extraClass: 'tc',
            fmt: this.FormatPercent,
            alt: "Machine Gun"
        },
        {
            field: 'SG_A',
            title: 'SG',
            extraClass: 'tc',
            fmt: this.FormatPercent,
            alt: "Shot Gun"
        },
        {
            field: 'GL_A',
            title: 'GL',
            extraClass: 'tc',
            fmt: this.FormatPercent,
            alt: "Grenade Launcher"
        },
        {
            field: 'LG_A',
            title: 'LG',
            extraClass: 'tc',
            fmt: this.FormatPercent,
            alt: "Lightning Gun"
        },
        {
            field: 'RL_A',
            title: 'RL',
            extraClass: 'tc',
            fmt: this.FormatPercent,
            alt: "Rocket Launcher"
        },
        {
            field: 'RG_A',
            title: 'RG',
            extraClass: 'tc',
            fmt: this.FormatPercent,
            alt: "Rail Gun"
        },
        {
            field: 'PG_A',
            title: 'PG',
            extraClas: 'tc',
            fmt: this.FormatPercent,
            alt: "Plasma Gun"
        },
        {
            field: 'BFG_A',
            title: 'BFG',
            extraClass: 'tc',
            fmt: this.FormatPercent,
            alt: "BFG"
        },
        {
            field: 'CG_A',
            title: 'CG',
            extraClass: 'tc',
            fmt: this.FormatPercent,
            alt: "Chain Gun"
        },
        {
            field: 'NG_A',
            title: 'NG',
            extraClass: 'tc',
            fmt: this.FormatPercent,
            alt: "Nail Gun"
        },
        {
            field: 'PM_A',
            title: 'PL',
            extraClass: 'tc',
            fmt: this.FormatPercent,
            alt: "Prox Launcher"
        }];
        this.BOARD_DEFS = [{
            index: 'SCOREBOARD',
            type: 'normal',
            fields: [{
                field: 'RANK',
                title: 'Rank',
                extraClass: 'tc',
                fmt: this.FormatRank
            },
            {
                field: 'PLAYER_NICK',
                title: 'Player',
                extraClass: 'tl',
                fmt: this.FormatProfileLink
            },
            {
                field: 'SCORE',
                title: 'Score',
                extraClass: 'tc',
                fmt: null
            },
            {
                field: 'KILLS',
                title: 'Frags',
                extraClass: 'tc',
                fmt: null
            },
            {
                field: 'DEATHS',
                title: 'Deaths',
                extraClass: 'tc',
                fmt: null
            },
            {
                field: 'ACCURACY',
                title: 'Acc',
                extraClass: 'tc',
                fmt: this.FormatPercent,
                alt: "Accuracy"
            },
            {
                field: 'MIN',
                title: 'Time',
                extraClas: 'tc',
                fmt: this.FormatTime
            },
            {
                field: 'EXCELLENT',
                title: 'Exc',
                extraClass: 'tc',
                fmt: this.FormatWeaponNumber,
                alt: "\"Excellent\" medals",
                optional: true
            },
            {
                field: 'IMPRESSIVE',
                title: 'Imp',
                extraClass: 'tc',
                fmt: this.FormatWeaponNumber,
                alt: "\"Impressive\" medals",
                optional: true
            },
            {
                field: 'HUMILIATION',
                title: 'Hum',
                extraClass: 'tc',
                fmt: this.FormatWeaponNumber,
                alt: "\"Humiliation\" medals",
                optional: true
            }],
            weaponFields: PLAYER_WEAPON_FIELDS,
            weaponAccFields: PLAYER_WEAPON_ACC_FIELDS,
            fieldOptions: null
        },
        {
            index: 'SCOREBOARD_QUITTERS',
            type: 'normal',
            fields: [{
                field: 'RANK',
                title: 'Rank',
                extraClass: 'tc',
                fmt: this.FormatRank
            },
            {
                field: 'PLAYER_NICK',
                title: 'Player',
                extraClass: 'tl',
                fmt: this.FormatProfileLink
            },
            {
                field: 'SCORE',
                title: 'Score',
                extraClass: 'tc',
                fmt: null
            },
            {
                field: 'KILLS',
                title: 'Frags',
                extraClass: 'tc',
                fmt: null
            },
            {
                field: 'DEATHS',
                title: 'Deaths',
                extraClass: 'tc',
                fmt: null
            },
            {
                field: 'ACCURACY',
                title: 'Acc',
                extraClass: 'tc',
                fmt: this.FormatPercent,
                alt: "Accuracy"
            },
            {
                field: 'MIN',
                title: 'Time',
                extraClas: 'tc',
                fmt: this.FormatTime
            },
            {
                field: 'EXCELLENT',
                title: 'Exc',
                extraClass: 'tc',
                fmt: this.FormatWeaponNumber,
                alt: "\"Excellent\" medals",
                optional: true
            },
            {
                field: 'IMPRESSIVE',
                title: 'Imp',
                extraClass: 'tc',
                fmt: this.FormatWeaponNumber,
                alt: "\"Impressive\" medals",
                optional: true
            },
            {
                field: 'HUMILIATION',
                title: 'Hum',
                extraClass: 'tc',
                fmt: this.FormatWeaponNumber,
                alt: "\"Humiliation\" medals",
                optional: true
            }],
            weaponFields: PLAYER_WEAPON_FIELDS,
            weaponAccFields: PLAYER_WEAPON_ACC_FIELDS,
            fieldOptions: {
                'quitters_summary': true,
                'board_class': 'SCOREBOARD'
            }
        },
        {
            index: 'TEAM_SCOREBOARD',
            type: 'team',
            fields: [{
                field: 'TEAM',
                title: 'Team',
                extraClass: 'tl',
                fmt: null
            },
            {
                field: 'CAPTURES',
                title: 'Caps',
                extraClass: 'tc',
                fmt: this.FormatWeaponNumber,
                alt: "Flag Captures"
            },
            {
                field: 'DEFENDS',
                title: 'Defs',
                extraClass: 'tc',
                fmt: this.FormatWeaponNumber,
                alt: "Flag Defends"
            },
            {
                field: 'ASSISTS',
                title: 'Assts',
                extraClass: 'tc',
                fmt: this.FormatWeaponNumber,
                alt: "Flag Assists"
            },
            {
                field: 'ROUNDS_WON',
                title: 'Rounds',
                extraClass: 'tc',
                fmt: null,
                alt: "Rounds Won"
            },
            {
                field: 'SCORE',
                title: 'Score',
                extraClass: 'tc',
                fmt: null
            },
            {
                field: 'KILLS',
                title: 'Frags',
                extraClass: 'tc',
                fmt: null
            },
            {
                field: 'DEATHS',
                title: 'Deaths',
                extraClass: 'tc',
                fmt: null
            },
            {
                field: 'ACCURACY',
                title: 'Acc',
                extraClass: 'tc',
                fmt: this.FormatPercent,
                alt: "Accuracy"
            },
            {
                field: 'EXCELLENT',
                title: 'Exc',
                extraClass: 'tc',
                fmt: this.FormatWeaponNumber,
                alt: "\"Excellent\" medals",
                optional: true
            },
            {
                field: 'IMPRESSIVE',
                title: 'Imp',
                extraClass: 'tc',
                fmt: this.FormatWeaponNumber,
                alt: "\"Impressive\" medals",
                optional: true
            },
            {
                field: 'HUMILIATION',
                title: 'Hum',
                extraClass: 'tc',
                fmt: this.FormatWeaponNumber,
                alt: "\"Humiliation\" medals",
                optional: true
            }],
            weaponFields: TEAM_WEAPON_FIELDS,
            weaponAccFields: TEAM_WEAPON_ACC_FIELDS,
            fieldOptions: null
        },
        {
            index: 'RED_SCOREBOARD',
            type: 'red',
            fields: REDBLUE_FIELDS,
            weaponFields: REDBLUE_WEAPON_FIELDS,
            weaponAccFields: REDBLUE_WEAPON_ACC_FIELDS,
            fieldOptions: null,
            weaponFieldOptions: {
                'class_prefix': 'WP_'
            }
        },
        {
            index: 'RED_SCOREBOARD_QUITTERS',
            type: 'red',
            fields: REDBLUE_FIELDS,
            weaponFields: REDBLUE_WEAPON_FIELDS,
            weaponAccFields: REDBLUE_WEAPON_ACC_FIELDS,
            fieldOptions: {
                'board_type': 'red',
                'board_class': 'RED_SCOREBOARD',
                'quitters_summary': true
            }
        },
        {
            index: 'BLUE_SCOREBOARD',
            type: 'blue',
            fields: REDBLUE_FIELDS,
            weaponFields: REDBLUE_WEAPON_FIELDS,
            weaponAccFields: REDBLUE_WEAPON_ACC_FIELDS,
            fieldOptions: null
        },
        {
            index: 'BLUE_SCOREBOARD_QUITTERS',
            type: 'blue',
            fields: REDBLUE_FIELDS,
            weaponFields: REDBLUE_WEAPON_FIELDS,
            weaponAccFields: REDBLUE_WEAPON_ACC_FIELDS,
            fieldOptions: {
                'board_type': 'blue',
                'board_class': 'BLUE_SCOREBOARD',
                'quitters_summary': true
            }
        }];
        this.TIP_DEFS = {
            'DM': [{
                name: 'Most Frags',
                key: 'MOST_FRAGS',
                fmt: null
            },
            {
                name: 'Least Deaths',
                key: 'LEAST_DEATHS',
                fmt: null
            },
            {
                name: 'Most Deaths',
                key: 'MOST_DEATHS',
                fmt: null
            },
            {
                name: 'Damage Delivered',
                key: 'DMG_DELIVERED',
                fmt: null
            },
            {
                name: 'Damage Taken',
                key: 'DMG_TAKEN',
                fmt: null
            },
            {
                name: 'Most Accurate',
                key: 'MOST_ACCURATE',
                fmt: this.FormatPercent
            }],
            'CTF': [{
                name: 'Least Deaths',
                key: 'LEAST_DEATHS',
                fmt: null
            },
            {
                name: 'Most Assists',
                key: 'MOST_ASSISTS',
                fmt: null
            },
            {
                name: 'Most Captures',
                key: 'MOST_CAPTURES',
                fmt: null
            },
            {
                name: 'Most Defends',
                key: 'MOST_DEFENDS',
                fmt: null
            },
            {
                name: 'Most Kills',
                key: 'MOST_KILLS',
                fmt: null
            }],
            'TDM': [{
                name: 'Most Frags',
                key: 'MOST_FRAGS',
                fmt: null
            },
            {
                name: 'Least Deaths',
                key: 'LEAST_DEATHS',
                fmt: null
            },
            {
                name: 'Most Deaths',
                key: 'MOST_DEATHS',
                fmt: null
            },
            {
                name: 'Damage Delivered',
                key: 'DMG_DELIVERED',
                fmt: null
            },
            {
                name: 'Damage Taken',
                key: 'DMG_TAKEN',
                fmt: null
            },
            {
                name: 'Most Accurate',
                key: 'MOST_ACCURATE',
                fmt: this.FormatPercent
            }],
            'CA': [{
                name: 'Least Deaths',
                key: 'LEAST_DEATHS',
                fmt: null
            },
            {
                name: 'Most Deaths',
                key: 'MOST_DEATHS',
                fmt: null
            },
            {
                name: 'Damage Delivered',
                key: 'DMG_DELIVERED',
                fmt: null
            },
            {
                name: 'Damage Taken',
                key: 'DMG_TAKEN',
                fmt: null
            },
            {
                name: 'Most Accurate',
                key: 'MOST_ACCURATE',
                fmt: this.FormatPercent
            }],
            'TOURNEY': [{
                name: 'Most Frags',
                key: 'MOST_FRAGS',
                fmt: null
            },
            {
                name: 'Least Deaths',
                key: 'LEAST_DEATHS',
                fmt: null
            },
            {
                name: 'Most Deaths',
                key: 'MOST_DEATHS',
                fmt: null
            },
            {
                name: 'Damage Delivered',
                key: 'DMG_DELIVERED',
                fmt: null
            },
            {
                name: 'Damage Taken',
                key: 'DMG_TAKEN',
                fmt: null
            },
            {
                name: 'Most Accurate',
                key: 'MOST_ACCURATE',
                fmt: this.FormatPercent
            }]
        };
        this.OnShowStatsDetails_Error = function (err) {
            $('#match_gametype').html('Unable to load match');
            $('#stats_datacontainer').html('<div class="error">The match you have requested is invalid or has expired.</div>')
        };
        this.OnShowStatsDetails_Success = function (node, public_id, game_type, json) {
            $('#stats_datacontainer').html(quakelive.mod_stats.TPL_MATCH_DETAILS_INNER);
            var topPlayers = [];
            var topTeams = [null, null];
            if (json.WINNING_TEAM) {
                var teamId = json.WINNING_TEAM.toUpperCase();
                var teamScoreboard = (json.WINNING_TEAM != 'NA') ? json[teamId + "_SCOREBOARD"] : json["RED_SCOREBOARD"];
                var oppScoreboard = (json.WINNING_TEAM != 'NA') ? json[(teamId == "RED" ? "BLUE" : "RED") + "_SCOREBOARD"] : json["BLUE_SCOREBOARD"];
                topPlayers[0] = teamScoreboard[0];
                topPlayers[1] = oppScoreboard[0];
                if (json.WINNING_TEAM == json.TEAM_SCOREBOARD[0].TEAM) {
                    topTeams[0] = json.TEAM_SCOREBOARD[0];
                    topTeams[1] = json.TEAM_SCOREBOARD[1]
                } else {
                    topTeams[0] = json.TEAM_SCOREBOARD[1];
                    topTeams[1] = json.TEAM_SCOREBOARD[0]
                }
                winner = json.WINNING_TEAM
            } else {
                topPlayers[0] = json.SCOREBOARD[0];
                topPlayers[1] = json.SCOREBOARD[1];
                winner = topPlayers[0]
            }
            node.find('#match_vscontainer').empty().append(this.GetVersusFrame(json.GAME_TYPE, topPlayers[0], topPlayers[1], topTeams[0], topTeams[1]));
            node.find('#match_gametype').html(this.FormatGameType(json));
            node.find('#match_mapshot').html("<img alt=\"\" src=\"" + quakelive.resource("/images/levelshots/md/" + json.MAP_NAME_SHORT + ".jpg") + "\" width=\"112\" height=\"84\" class=\"placeImg\" />");
            var html = "<span class=\"grayNameTxt\">" + json.MAP_NAME + "</span><br />";
            html += "<span class=\"Norm11px\"><b>Date:</b> " + json.GAME_TIMESTAMP_NICE + " ago</span><br />";
            html += "<span class=\"Norm11px\"><b>Winner:</b> ";
            if (json.WINNING_TEAM) {
                html += json.WINNING_TEAM
            } else {
                html += json.SCOREBOARD[0].PLAYER_NICK
            }
            html += "</span><br />";
            html += "<span class=\"Norm11px\"><b>Duration:</b> " + json.GAME_LENGTH_NICE + "</span><br />";
            node.find('#match_maindata').html(html);
            var container = node.find('.match_scoreboard').empty();
            var wpContainer = node.find('.match_weapons').empty();
            var wpAccContainer = node.find('.match_weaponaccuracy').empty();
            var count = 0;
            var boardOrder = ['SCOREBOARD', 'TEAM_SCOREBOARD'];
            if (json.WINNING_TEAM) {
                if (json.WINNING_TEAM.toLowerCase() == 'red') {
                    boardOrder[boardOrder.length] = 'RED_SCOREBOARD';
                    boardOrder[boardOrder.length] = 'BLUE_SCOREBOARD'
                } else {
                    boardOrder[boardOrder.length] = 'BLUE_SCOREBOARD';
                    boardOrder[boardOrder.length] = 'RED_SCOREBOARD'
                }
            }
            for (var orderIndex in boardOrder) {
                var boardId = boardOrder[orderIndex];
                var i = 0;
                for (; i < this.BOARD_DEFS.length; ++i) {
                    var boardDef = this.BOARD_DEFS[i];
                    if (json[boardDef.index] && boardDef.index == boardId) {
                        if (count++>0) {
                            container.append('<br />');
                            wpContainer.append('<br />');
                            wpAccContainer.append('<br />')
                        }
                        container.append(this.GetScoreboard(json, boardDef));
                        wpContainer.append(this.GetWeaponDetails(json, boardDef));
                        wpAccContainer.append(this.GetWeaponAccuracyDetails(json, boardDef));
                        if (boardDef.index == 'RED_SCOREBOARD' || boardDef.index == 'BLUE_SCOREBOARD' || boardDef.index == 'SCOREBOARD') {
                            var quittersIndex = boardDef.index + '_QUITTERS';
                            if (json[quittersIndex]) {
                                var quittersDef = this.BOARD_DEFS[i + 1];
                                container.append(this.GetScoreboard(json, quittersDef));
                                wpContainer.append(this.GetWeaponDetails(json, quittersDef));
                                wpAccContainer.append(this.GetWeaponAccuracyDetails(json, quittersDef))
                            }
                        }
                        break
                    }
                }
            }
            $.tablesorter.addParser({
                id: 'names',
                is: function (s) {
                    return false
                },
                format: function (s) {
                    s = $(s)[2];
                    if (s) {
                        s = s.innerHTML.toLowerCase()
                    } else {
                        s = '-'
                    }
                    return s
                },
                type: 'text'
            });
            $.tablesorter.addParser({
                id: 'int',
                is: function (s) {
                    return (s.split(':').length !== 2)
                },
                format: function (s) {
                    return $.tablesorter.formatInt(s)
                },
                type: 'numeric'
            });
            $.tablesorter.addParser({
                id: 'time',
                is: function (s) {
                    return (s.split(':').length === 2)
                },
                format: function (s) {
                    var parts = s.split(':');
                    return parts[0] * 60 + parts[1]
                }
            });
            $.tablesorter.defaults.sortList = [
                [0, 0]];
            $.tablesorter.defaults.widgets = ['zebra'];
            $.tablesorter.defaults.widgetZebra = {
                css: ["normalZebraOff", "normalZebraOn"]
            };
            $.tablesorter.defaults.cssHeader = '';
            $.tablesorter.defaults.headers = {
                1: {
                    sorter: 'names'
                },
                2: {
                    sorter: 'numeric'
                },
                3: {
                    sorter: 'numeric'
                },
                4: {
                    sorter: 'numeric'
                },
                5: {
                    sorter: 'numeric'
                },
                6: {
                    sorter: 'numeric'
                },
                7: {
                    sorter: 'numeric'
                },
                8: {
                    sorter: 'numeric'
                },
                9: {
                    sorter: 'numeric'
                },
                10: {
                    sorter: 'numeric'
                },
                11: {
                    sorter: 'numeric'
                },
                12: {
                    sorter: 'numeric'
                },
                13: {
                    sorter: 'numeric'
                }
            };
            $('div#stats_datacontainer table:not(.teamBG, .quitterstable_normal, .quitterstable_red, .quitterstable_blue)').tablesorter();
            $('table.teamBG').tablesorter({
                sortList: [
                    [1, 0]],
                headers: {
                    0: {
                        sorter: 'text'
                    },
                    1: {
                        sorter: 'numeric'
                    }
                }
            });
            var quittersTables = $('.quitterstable_normal, .quitterstable_red, .quitterstable_blue');
            quittersTables.find('tbody tr:even').addClass('normalZebraOff');
            quittersTables.find('tbody tr:odd').addClass('normalZebraOn');
            quittersTables.find('thead tr').click(this.ToggleQuitters);
            var sel = ['.match_scoreboard > .board_blue > table', '.match_scoreboard > .board_red > table', '.match_scoreboard > .board_team > table', '.match_scoreboard > .board_normal > table', '.match_weaponaccuracy > .board_normal > table', '.match_weaponaccuracy > .board_team > table', '.match_weaponaccuracy > .board_blue > table', '.match_weaponaccuracy > .board_red > table'].join(',');
            $(sel).each(function (i, table) {
                var maxValNodes = [];
                var maxVals = [];
                var rows = table.rows;
                for (var x = 0; x < rows.length; x++) {
                    var td = rows[x].getElementsByTagName('td');
                    for (var y = 0; y < td.length; y++) {
                        if (maxValNodes[y] === undefined) {
                            maxValNodes[y] = []
                        }
                        var thisClass = td[y].className;
                        if (!/(SCOREBOARD_TEAM_RANK|SCOREBOARD_PLAYER_NICK|SCOREBOARD_MIN|SCOREBOARD_RANK)/.test(thisClass)) {
                            var currVal = parseInt(td[y].innerHTML);
                            if (/(SCOREBOARD_DEATHS)/.test(thisClass)) {
                                var comparison = (!isNaN(currVal) && (currVal < maxVals[y] || maxVals[y] == undefined))
                            } else {
                                var comparison = (!isNaN(currVal) && (currVal > maxVals[y] || maxVals[y] == undefined))
                            }
                            if (comparison) {
                                maxValNodes[y] = [td[y]];
                                maxVals[y] = currVal
                            } else if (currVal == maxVals[y]) {
                                maxValNodes[y].push(td[y])
                            }
                        }
                    }
                }
                for (var x = 0; x < maxValNodes.length; x++) {
                    for (var y = 0; y < maxValNodes[x].length; y++) {
                        $(maxValNodes[x][y]).addClass('maxTableValue')
                    }
                }
            });
            var shareUrl = quakelive.siteConfig.baseUrl + "/r/" + window.location.hash.substr(1);
            var mailToSubj = "QUAKE LIVE Game Details\n\n";
            var mailToText = "Check out the details of this QUAKE LIVE game here:\n" + "\n" + quakelive.siteConfig.baseUrl + "/" + window.location.hash + "\n\n" + "Arena: " + json.MAP_NAME + "\n" + "Game type: " + this.FormatGameType(json) + "\n" + "Date played: " + json.GAME_TIMESTAMP + "\n" + "\nNote: This link will expire at " + json.GAME_EXPIRES_FULL + "\n" + "\nQUAKE LIVE is a totally FREE online multiplayer game from id Software, the makers of DOOM and QUAKE.  Easily play against friends or others at your skill level in more than 30 arenas and 5 exciting game modes. Check us out at www.quakelive.com.\n";
            mailToSubj = mailToSubj.replace(/ /g, "%20");
            mailToText = mailToText.replace(/ /g, "%20").replace(/\n/g, "%0D").replace(/#/g, "%23");
            node.find('.share_email').attr('href', "mailto:?subject=" + mailToSubj + "&body=" + mailToText);
            var self = this;
            node.find('.share_link').click(function () {
                qlPrompt({
                    title: "Link to this match",
                    body: "Copy and paste the below URL to link to this match.<br/><br/>" + "<b>Arena:</b> " + json.MAP_NAME + "<br/>" + "<b>Game type:</b> " + self.FormatGameType(json) + "<br/>" + "<b>Date played:</b> " + json.GAME_TIMESTAMP + "<br/><br/>" + "<center>This link will expire at " + json.GAME_EXPIRES_FULL + "</center>",
                    input: true,
                    inputLabel: shareUrl,
                    inputReadOnly: true,
                    alert: true
                })
            });
            if (addthis) {
                var btn = $("<a class='addthis_button' href='http://www.addthis.com/bookmark.php?v=250&pub=idsoftware'><img src='" + quakelive.resource('/images/share_button.gif') + "' width='67' height='15' alt='Bookmark and Share' style='border:0'/></a>");
                var share = {
                    url: shareUrl,
                    title: 'Quake Live Match - ' + this.FormatGameType(json) + ' on ' + json.MAP_NAME,
                    templates: {
                        twitter: (quakelive.mod_profile && quakelive.mod_profile.activeProfileName) ? ('@quakelive Check out this ' + this.FormatGameTypeShort(json) + ' match on ' + json.MAP_NAME + ' that ' + quakelive.mod_profile.activeProfileName + ' played at Quake Live! {{url}} #QLmatch') : ('@quakelive Check out this ' + this.FormatGameTypeShort(json) + ' match on ' + json.MAP_NAME + ' at Quake Live! {{url}} #QLmatch')
                    }
                };
                addthis.button(btn.get(), addthis_config, share);
                node.find('.addthis_container').empty().append(btn)
            }
            this.ShowVerts(node)
        };
        this.GetHtmlForFields = function (json, boardDef, boardFields, userOptions) {
            var options = $.extend({},
            {
                'board_data': null,
                'board_type': boardDef.type,
                'board_class': boardDef.index,
                'show_optional': true
            },
            userOptions);
            if (options.class_prefix) {
                options.board_class = options.class_prefix + options.board_class
            }
            var sb = options.board_data || json[boardDef.index];
            var cls = options.quitters_summary ? "" : ("board_" + options.board_type);
            var html = "<div class='" + cls + "'>";
            if (!options.quitters_summary) {
                html += "<table class='" + options.board_type + "BG'>";
                html += "<thead><tr>";
                for (var fieldIndex in boardFields) {
                    var fieldDef = boardFields[fieldIndex];
                    if (typeof(sb[0][fieldDef.field]) != 'undefined') {
                        if (fieldDef.optional && options.show_optional == false) {
                            continue
                        } else {
                            html += "<th class='" + options.board_class + "_" + fieldDef.field + " " + fieldDef.extraClass + "'";
                            if (fieldDef.alt) {
                                html += " title=\"" + fieldDef.alt + "\""
                            }
                            html += ">" + fieldDef.title + "</th>"
                        }
                    }
                }
                html += "</tr></thead>"
            } else {
                html += "<table class='quitterstable_" + options.board_type + "'><thead>"
            }
            var count = 0;
            for (var i = 0; i < sb.length; i++) {
                var player = sb[i];
                var className = "";
                html += "<tr class='";
                if (options.quitters_summary && !player['QUITTERS_SUM']) {
                    html += " " + (player['TEAM'] ? player['TEAM'] : '') + 'Quitters'
                }
                html += "'";
                if (options.quitters_summary && !player['QUITTERS_SUM']) {
                    html += " style='display: none'"
                }
                html += ">";
                for (var fieldIndex in boardFields) {
                    var fieldDef = boardFields[fieldIndex];
                    if (fieldDef.optional && options.show_optional == false) {
                        continue
                    } else {
                        if (typeof(player[fieldDef.field]) != 'undefined') {
                            var value = player[fieldDef.field];
                            if (fieldDef.fmt) {
                                value = fieldDef.fmt(value, player, boardDef)
                            }
                            if (typeof(value) == 'undefined' || typeof(value) == 'NaN') {
                                value = ''
                            }
                            if (player['QUITTERS_SUM']) {
                                var tag = "th"
                            } else {
                                var tag = "td"
                            }
                            html += "<" + tag + " class='" + options.board_class + "_" + fieldDef.field + " " + fieldDef.extraClass + "'>" + value + "</+" + tag + ">"
                        }
                    }
                }
                html += "</tr>";
                if (player['QUITTERS_SUM']) {
                    html += "</thead>"
                }
            }
            html += "</table>";
            return html
        };
        this.GetScoreboard = function (json, boardDef, userOptions) {
            var options = $.extend({},
            boardDef.fieldOptions, userOptions);
            return this.GetHtmlForFields(json, boardDef, boardDef.fields, options)
        };
        this.GetWeaponDetails = function (json, boardDef, userOptions) {
            var options = $.extend({},
            boardDef.fieldOptions, {
                'class_prefix': 'WP_'
            },
            userOptions);
            return this.GetHtmlForFields(json, boardDef, boardDef.weaponFields, options)
        };
        this.GetWeaponAccuracyDetails = function (json, boardDef, userOptions) {
            var options = $.extend({},
            boardDef.fieldOptions, {
                'class_prefix': 'WP_'
            },
            userOptions);
            return this.GetHtmlForFields(json, boardDef, boardDef.weaponAccFields, options)
        };
        this.SetDetailsMode = function (mode) {
            var modes = ['scoreboard', 'weapons', 'weaponaccuracy'];
            for (var modeIndex in modes) {
                if (mode != modes[modeIndex]) {
                    $('.match_' + modes[modeIndex]).hide();
                    $('.nav_' + modes[modeIndex]).removeClass('selected')
                }
            }
            $('.match_' + mode).show();
            $('.nav_' + mode).addClass('selected');
            $('.Quitters,.RedQuitters,.BlueQuitters').hide();
            $('.QuittersToggledBtn').removeClass('QuittersToggledBtn')
        };
        var verts = {};
        this.ShowVerts = function (node) {
            var n;
            n = node.find('#stats_details_top_vert');
            if (verts['top'] && n.length != 0) {
                n.empty().append(verts['top'])
            }
            n = node.find('#stats_details_bot_vert');
            if (verts['bot'] && n.length != 0) {
                n.empty().append(verts['bot'])
            }
        };
        this.LoadVerts = function (node) {
            var self = this;
            verts = {};
            quakelive.LoadVerts([{
                'zone': quakelive.VERT_ZONES.game_details_header,
                'display': function (ad, adNode, isDefault, html) {
                    if (!isDefault) {
                        verts['top'] = adNode
                    }
                }
            },
            {
                'zone': quakelive.VERT_ZONES.game_details_full_banner,
                'display': function (ad, adNode, isDefault, html) {
                    verts['bot'] = adNode
                }
            }], {
                timeout: 2000
            },
            function () {
                self.ShowVerts(node)
            })
        };
        this.HideStatsDetails = function () {
            $('#stats_details').remove()
        };
        this.ShowStatsDetails = function (public_id, game_type) {
            this.HideStatsTooltip();
            quakelive.ScrollToTop();
            if ($('#stats_details').size()) {
                $('#stats_details').remove()
            }
            var node = $(quakelive.mod_stats.TPL_MATCH_DETAILS).appendTo('#qlv_contentBody');
            var cachedData = statsCache.Get(public_id);
            this.LoadVerts(node);
            if (!cachedData) {
                var self = this;
                $.ajax({
                    url: '/stats/matchdetails/' + public_id + '/' + game_type,
                    dataType: 'json',
                    mode: 'abort',
                    port: 'statstip',
                    cache: true,
                    success: function (json) {
                        self.ProcessMatchData(json);
                        var tip = self.OnShowStatsDetails_Success(node, public_id, game_type, json);
                        var data = {
                            'json': json,
                            'tip': tip
                        };
                        statsCache.Add(public_id, data)
                    },
                    error: this.OnShowStatsDetails_Error
                })
            } else {
                this.OnShowStatsDetails_Success(node, public_id, game_type, cachedData.json)
            }
        };
        this.OnCloseStatsTooltip = function () {
            $.ajaxAbort('statstip');
            this.HideStatsDetails();
            var path = quakelive.BuildSubPath(quakelive.pathParts.length - 2);
            quakelive.StopPathMonitor();
            window.location.hash = path;
            quakelive.ParsePath();
            quakelive.StartPathMonitor()
        };
        this.OnClickStatsTooltip = function (node, publicId, gameType, subPath) {
            var path = subPath + "/" + publicId + "/" + gameType;
            quakelive.StopPathMonitor();
            window.location.hash = path;
            quakelive.ParsePath();
            quakelive.StartPathMonitor();
            quakelive.statstip.ShowStatsDetails(publicId, gameType)
        };
        this.BindStatsTooltip = function (node, publicId, gameType, subPath) {
            var self = this;
            node.unbind("hover").unbind("click").click(function (event) {
                self.options.onClick(node, publicId, gameType, subPath);
                event.preventDefault()
            }).hoverIntent(function () {
                self.OnHoverStatsTooltip(node, publicId, gameType)
            },
            function () {
                self.HideStatsTooltip()
            })
        };
        var self = this;
        this.defaultOptions = {
            onClick: function (node, publicId, gameType, subPath) {
                self.OnClickStatsTooltip(node, publicId, gameType, subPath)
            },
            onClose: function () {
                self.OnCloseStatsTooltip()
            }
        };
        this.options = $.extend({},
        this.defaultOptions);
        this.SetOptions = function (options) {
            this.options = $.extend(this.defaultOptions, options)
        };
        this.CloseStatsDetails = function () {
            this.options.onClose()
        };
        this.FormatGameType = function (json) {
            var gameType;
            if (json.INSTAGIB) {
                gameType = "Unranked Instagib"
            } else {
                gameType = json.GAME_TYPE_FULL
            }
            return gameType
        };
        this.FormatGameTypeShort = function (json) {
            var gameType = json.GAME_TYPE.toUpperCase();
            if (gameType == 'DM') {
                gameType = 'FFA'
            }
            if (json.INSTAGIB) {
                gameType = 'I' + gameType
            }
            return gameType
        }
    }
    quakelive.statstip = new StatsTip()
})(jQuery);
(function ($) {
    function Notifier() {
        var defaultOptions = {
            noticeHeight: '135px',
            animInTime: 500,
            animOutTime: 500,
            animEaseType: "swing",
            displayTime: 5000,
            styleClass: 'qln_base',
            allowClose: true,
            icon: quakelive.resource('/images/awards/lg/last_man.png'),
            title: 'QUAKE LIVE: Notice',
            body: '',
            bodyTop: '',
            bodyBot: '',
            onNodeCreated: null
        };
        this.filters = {};
        this.noticeQueue = [];
        this.CreateNotice = function (options) {
            var html = '<div class="ql_notice ' + options.styleClass + '">' + '<div class="notice_header">' + options.title + '</div>' + (options.allowClose ? '<a href="javascript:;" class="notice_close_btn"></a>' : '') + '<div class="notice_data"><h1>' + options.bodyTop + '</h1>' + options.body + '<h4>' + options.bodyBot + '</h4></div>' + '<div class="notice_icon" style="background:url(' + options.icon + ') no-repeat"></div>' + '</div>';
            var node = $(html);
            if (options.onNodeCreated) {
                options.onNodeCreated(node)
            }
            return node
        };
        this.LoadFilters = function () {
            var list = (quakelive.userinfo.IGNORED_NOTICES || "").split(",");
            this.filters = {};
            for (var listIndex in list) {
                this.filters[list[listIndex]] = true
            }
        };
        this.IsNoticeFiltered = function (id) {
            return this.filters[id] || false
        };
        this.Notify = function (customOptions) {
            if (quakelive.userstatus != 'ACTIVE') {
                return
            }
            if (qz_instance.IsGameRunning() === true) {
                return
            }
            if (!customOptions) {
                return
            }
            if (typeof(customOptions) != 'object') {
                customOptions = {
                    body: customOptions
                }
            }
            var options = $.extend({},
            defaultOptions, customOptions || {},
            {
                startTime: new Date().getTime()
            });
            var notice = this.CreateNotice(options);
            notice.data("options", options).hover(function () {
                options.paused = true
            },
            function () {
                var now = new Date().getTime();
                options.paused = false;
                if (now - options.startTime > options.displayTime / 2) {
                    options.startTime = now - options.displayTime / 2;
                }
            }).find('.notice_close_btn').click(function () {
                if (!quakelive.userinfo.IGNORED_NOTICES) {
                    quakelive.userinfo.IGNORED_NOTICES = ' ';
                    $.get('/user/clearalerts');
                    var res = confirm("Would you like to be taken to the \"Edit Account\" page to configure which alerts you see?", "You are about to close an alert");
                    if (res) {
                        quakelive.Goto('user/edit')
                    }
                }
                options.startTime = 0
            }).end().appendTo($('#ql_notifier'));
            options.animSettings = [{
                height: options.noticeHeight
            },
            options.animInTime, options.animEaseType];
            if ($('#ql_notifier .ql_notice').length > 3) {
                options.paused = true;
                this.noticeQueue.push(notice)
            } else {
                notice.animate.apply(notice, options.animSettings)
            }
        };
        this.CheckNext = function () {
            var notice = this.noticeQueue.shift();
            if (notice) {
                var options = notice.data('options');
                setTimeout(function () {
                    options.paused = false;
                    options.startTime = new Date().getTime();
                    notice.animate.apply(notice, options.animSettings)
                },
                options.animOutTime)
            }
        };
        this.CycleNotifications = function () {
            if (!quakelive.IsGameRunning() || quakelive.cvars.GetIntegerValue('r_fullscreen') === 0) {
                var expiryPaused = false;
                $('#ql_notifier .ql_notice').each(function (ind, domNode) {
                    var notice = $(domNode);
                    var options = notice.data("options");
                    if (!options.isClosing && !expiryPaused && (!options.paused || options.startTime == 0) && (options.startTime + options.displayTime < new Date().getTime())) {
                        expiryPaused = true;
                        options.isClosing = true;
                        notice.animate({
                            height: 0
                        },
                        options.animOutTime, options.animEaseType, function () {
                            notice.remove();
                            expiryPaused = false;
                            quakelive.notifier.CheckNext()
                        })
                    }
                })
            }
            var self = this;
            setTimeout(function () {
                self.CycleNotifications()
            },
            250)
        };
        this.CycleNotifications();
        this.ContactPresenceNotice = function (name, icons) {
            if (this.IsNoticeFiltered("friend_online")) {
                return null
            }
            return {
                body: 'A friend has come online.',
                bodyTop: name + " is online",
                bodyBot: '<a href="#profile/summary/' + name + '">View Profile</a>',
                title: 'Your friend has come online!',
                icon: quakelive.resource('/images/players/icon_xl/' + icons.modelskin + '.jpg'),
                displayTime: 5000
            }
        };
        this.PendingInviteSummaryNotice = function (numPending) {
            if (this.IsNoticeFiltered("login_invites")) {
                return null
            }
            var plural = numPending != 1;
            return {
                body: numPending + " friend " + (plural ? "invites are" : "invite is") + " waiting for you.",
                bodyTop: "Pending Invite",
                bodyBot: "<a href='#friends/incoming'>Click to view your friend " + (plural ? "invites" : "invite") + "</a>",
                title: "You have " + (plural ? "pending friend invites!" : "a pending friend invite!"),
                icon: quakelive.resource('/images/awards/lg/veteran.png'),
                displayTime: 10000
            }
        };
        this.PendingInviteNotice = function (jid, name, modelskin) {
            if (this.IsNoticeFiltered("new_invite")) {
                return null
            }
            return {
                body: name + " has requested to be your friend.",
                bodyTop: "New Friend Invite",
                bodyBot: "<a href='#profile/summary/" + name + "' class='fl'>View Profile</a><span class='fl'>&nbsp;&nbsp;|&nbsp;&nbsp;</span> <a href='javascript:;' onclick='quakelive.mod_friends.AnswerSubscriptionRequest(\"" + jid + "\", true); return false'>Accept Invite</a><div class='cl'></div>",
                title: "You have a new friend invite!",
                icon: quakelive.resource('/images/players/icon_xl/' + modelskin + '.jpg'),
                displayTime: 5000
            }
        };
        this.FriendInGameNotice = function (name, modelskin, address, serverId, map) {
            if (this.IsNoticeFiltered("friend_ingame")) {
                return null
            }
            return {
                body: name + " is playing now!<h3><a href='javascript:;' onclick='quakelive.Goto(\"home/join/" + serverId + "\"); return false'>Join Game</a></h3>",
                bodyTop: "Friend In-Game Now",
                bodyBot: "Hover over tooltip to view details.",
                title: "Friend in-game now!",
                icon: quakelive.resource('/images/players/icon_xl/' + modelskin + '.jpg'),
                displayTime: 8000,
                onNodeCreated: function (node) {
                    quakelive.matchtip.BindMatchTooltip(node, serverId)
                }
            }
        };
        this.SelfAwardEarnedNotice = function (awardType, awardId, awardName, awardImage, awardDesc, awardFlavor) {
            if (!this.awardMarkHandle) {
                var self = this;
                this.awardsToMark = this.awardsToMark || [];
                this.awardMarkHandle = setTimeout(function () {
                    var awardsData = self.awardsToMark.join(',');
                    self.awardsToMark = [];
                    $.ajax({
                        type: 'post',
                        url: '/profile/mark_awards',
                        data: {
                            awards: awardsData
                        },
                        dataType: 'json',
                        success: function (json) {
                            self.awardMarkHandle = null
                        },
                        error: function () {
                            self.awardMarkHandle = null
                        }
                    })
                },
                1000)
            }
            this.awardsToMark[this.awardsToMark.length] = awardId;
            if (this.IsNoticeFiltered("self_award")) {
                return null
            }
            return {
                body: awardDesc,
                bodyTop: awardName,
                bodyBot: "<a href='javascript:;' onclick='quakelive.Goto(\"profile/awards/" + quakelive.username + ";type=" + awardType + ";award=" + awardId + "\"); return false'>View Award</a>",
                title: "You have earned an award!",
                icon: quakelive.resource('/images/awards/lg/' + awardImage + '.png'),
                displayTime: 10000,
                onNodeCreated: function (node) {
                    node.find('.notice_icon').attr("title", awardFlavor)
                }
            }
        };
        this.FriendAwardEarnedNotice = function (friendName, awardType, awardId, awardName, awardImage, awardDesc, awardFlavor, playerModel) {
            if (this.IsNoticeFiltered("friend_award")) {
                return null
            }
            var awardPath = "profile/awards/" + friendName + ";type=" + awardType + ";award=" + awardId;
            return {
                body: awardDesc,
                bodyTop: "<a class='fl' href='javascript:;' onclick='quakelive.Goto(\"profile/summary/" + friendName + "\"); return false'>" + "<img src='" + quakelive.resource("/images/players/icon_sm/" + playerModel + ".jpg") + "' style='border: 1px solid #666; position: relative; top: 2px; margin-right: 5px' /></a> " + friendName,
                bodyBot: "<a class='fl' href='javascript:;' onclick='quakelive.Goto(\"" + awardPath + "\"); return false'>View Award</a> <span class='fl'>&nbsp;&nbsp;|&nbsp;&nbsp;</span>" + "<a class='fl' href='javascript:;' onclick='quakelive.Goto(\"profile/summary/" + friendName + "\"); return false'>View Profile</a><div class='cl'></div>",
                title: "<b>" + awardName + "</b> has been awarded!",
                icon: quakelive.resource('/images/awards/lg/' + awardImage + '.png'),
                displayTime: 5000,
                onNodeCreated: function (node) {
                    node.find('.notice_icon').addClass('interactive').click(function () {
                        quakelive.Goto(awardPath)
                    }).attr("title", awardFlavor)
                }
            }
        }
    }
    quakelive.notifier = new Notifier();
    quakelive.AddHook('OnAuthenticatedInit', function () {
        quakelive.notifier.LoadFilters()
    })
})(jQuery);
(function ($) {
    var VERT_RELOAD_TIME = 20000;
    var vertCache = {};

    function SafeAjax(options) {
        var ajax_completed = false;
        var fnComplete = options.complete;
        options.complete = function (xhr, status) {
            if (!ajax_completed) {
                ajax_completed = true;
                if (fnComplete) {
                    fnComplete(xhr, status)
                }
            }
        };
        setTimeout(function () {
            if (!ajax_completed) {
                ajax_completed = true;
                options.ajaxBlockedError()
            }
        },
        options.timeout + 50);
        try {
            $.ajax(options)
        } catch(e) {}
    }

    function DisplayVert(vert, html) {
        var isDefault = (html.length == 0) || (vert.defaultRegex && vert.defaultRegex.test(html));
        var vertNode = $(html);
        if (vert.display) {
            vert.display(vert, vertNode, isDefault, html)
        } else if (isDefault) {
            if (vert.defaultHtml) {
                $(vert.target).html(vert.defaultHtml)
            }
        } else {
            $(vert.target).empty().append(vertNode)
        }
    }

    function LoadVerts_Show(vertDefs, vertScripts) {
        for (var i in vertDefs) {
            var def = vertDefs[i];
            DisplayVert(def, vertScripts[def.zone] || "")
        }
    }

    function LoadVerts_ShowDefault(vertDefs) {
        for (var i in vertDefs) {
            DisplayVert(vertDefs[i], "")
        }
    };
    var defaultVertOptions = {
        defaultRegex: /\/qldefault\//,
        defaultHtml: '',
        target: null,
        display: null
    };

    function IsValidVert(vert) {
        if (!vert.target && !vert.display) {
            return false
        }
        return true
    }
    quakelive.LoadVerts = function (verts, options, callback) {
        var loadOptions = $.extend({
            timeout: 15000
        },
        options);
        var url = quakelive.siteConfig.deliveryUrl;
        var zones = [];
        if (verts instanceof Array) {
            for (var i in verts) {
                verts[i] = $.extend({},
                defaultVertOptions, verts[i]);
                if (IsValidVert(verts[i])) {
                    zones[zones.length] = verts[i].zone
                }
            }
        } else {
            verts = [$.extend({},
            defaultVertOptions, verts)];
            if (IsValidVert(verts[0])) {
                zones[0] = verts[0].zone
            }
        }
        if (zones.length == 0) {
            return
        }
        url += "?zones=" + escape(zones.join("|"));
        url += "&r=" + Math.floor(Math.random() * 99999999);
        url += (document.charset ? '&charset=' + document.charset : (document.characterSet ? '&charset=' + document.characterSet : ''));
        if (window.location) {
            url += "&loc=" + escape(window.location.href)
        }
        if (document.referrer) {
            url += "&referer=" + escape(document.referrer)
        }
        SafeAjax({
            'type': 'get',
            'cache': false,
            'url': url,
            'dataType': 'script',
            'global': false,
            'timeout': loadOptions.timeout,
            'success': function () {
                if (typeof(OA_output) == 'object') {
                    LoadVerts_Show(verts, OA_output);
                    OA_output = null
                } else {
                    LoadVerts_ShowDefault(verts)
                }
            },
            'error': function () {
                LoadVerts_ShowDefault(verts)
            },
            'complete': callback,
            'ajaxBlockedError': function () {
                LoadVerts_ShowDefault(verts);
                if (callback) {
                    callback()
                }
            }
        })
    };
    var valanceChecked = false;
    var valancePresent = false;
    var valanceLink = null;

    function ConnectValance() {
        if (!valancePresent || !valanceLink) {
            return
        }
        if ($('#valance_clicker').length != 0) {
            return
        }
        $('#qlv_container').before('<a id="valance_clicker" href="' + valanceLink + '" target="_blank" style="display: block; position: fixed; width: 100%; height: 100%; left: 0; top: 0; cursor: pointer"></a>')
    }
    quakelive.ConnectValance = ConnectValance;
    quakelive.FlushVertCache = function () {
        vertCache = {}
    };
    quakelive.FillVertList = function (destVerts) {
        var verts = destVerts;
        $('.ql_vert_frame').each(function () {
            var node = $(this);
            var id = node.attr("id");
            var title = node.attr("title");
            var time = 0;
            if (!vertCache[id]) {
                vertCache[id] = {
                    'title': title,
                    'time': 0
                };
                node.removeAttr("title")
            } else {
                title = vertCache[id].title;
                time = vertCache[id].time
            }
            var curTime = (new Date().getTime());
            var deltaTime = curTime - vertCache[id].time;
            if (deltaTime >= VERT_RELOAD_TIME) {
                vertCache[id].time = curTime;
                var vertParams = {};
                var params = {};
                var pairs = title.split("&");
                for (var i in pairs) {
                    var parts = pairs[i].split("=");
                    params[parts[0]] = parts[1]
                }
                if (quakelive.VERT_ZONES[params['zone']]) {
                    vertParams['zone'] = quakelive.VERT_ZONES[params['zone']] || params['zone'];
                    if (params['default']) {
                        vertParams['defaultHtml'] = '<div style="background: url(' + quakelive.resource(params['default']) + ') no-repeat center center; width: 100%; height: 100%"></div>'
                    }
                    vertParams['target'] = this;
                    verts[verts.length] = vertParams
                } else {}
            }
        }); if (!valanceChecked) {
            var valanceDefaults = {
                'background-repeat': 'no-repeat',
                'background-position': 'top center',
                'background-image': '',
                'background-color': '#000',
                'background-attachment': 'fixed'
            };
            verts[verts.length] = {
                'zone': quakelive.VERT_ZONES.site_valance,
                'display': function (vert, vertNode, isDefault, html) {
                    var meta = quakelive.ParseMetaVert(html, valanceDefaults);
                    if (meta) {
                        valancePresent = true;
                        for (var key in meta.keyvals) {
                            if (key == "background-image") {
                                $('body').css(key, 'url(' + meta.keyvals[key] + ')')
                            } else {
                                $('body').css(key, meta.keyvals[key])
                            }
                        }
                        valanceLink = meta.href;
                        ConnectValance()
                    }
                }
            };
            valanceChecked = true
        } else {
            ConnectValance()
        }
    };
    quakelive.ReloadVerts = function () {
        var verts = [];
        quakelive.FillVertList(verts);
        if (verts.length > 0) {
            quakelive.LoadVerts(verts, {
                'timeout': 15000
            })
        }
    };
    quakelive.ParseMetaVert = function (str, allowedFields) {
        var re_href = /^\s*<a\s*href=[\"\']([^\"\']+)[\"\']/i;
        var re_keyval = /^\s*(\S+)\s*=\s*(.*)\s*$/;
        var result = {};
        var m_href = re_href.exec(str);
        if (m_href) {
            result['href'] = m_href[1]
        } else {
            result['href'] = ''
        }
        result['keyvals'] = {};
        var blockStart = str.split("{{", 2);
        if (blockStart.length == 2) {
            var block = blockStart[1].split("}}", 2);
            if (block.length == 2) {
                var keyvals = block[0].split("\n");
                for (var i in keyvals) {
                    var m = re_keyval.exec(keyvals[i]);
                    if (m) {
                        var key = m[1].toLowerCase();
                        var val = m[2];
                        if (allowedFields[key] === undefined) {
                            break
                        }
                        result['keyvals'][key] = val || allowedFields[key]
                    } else {}
                }
            } else {
                return null
            }
        } else {
            return null
        }
        return result
    };
    var hooked = false;
    quakelive.HookVertLoading = function () {
        if (hooked) {
            return false
        }
        quakelive.AddHook('OnContentLoaded', quakelive.ReloadVerts);
        quakelive.AddHook('OnLayoutLoaded', quakelive.ReloadVerts);
        hooked = true;
        return true
    }
})(jQuery);
(function ($) {
    function BotEntry(sysname, name, modelskin) {
        this.sysname = sysname;
        this.name = name;
        this.modelskin = modelskin
    }

    function BotDB() {
        this.bots = [];
        this.botNames = [];
        this.append = function (b) {
            this.bots[b.sysname] = b;
            this.botNames.push(b.sysname)
        }
    }
    var botdb = window.botdb = new BotDB();
    var b;
    botdb.append(new BotEntry("anarki", "Anarki", "anarki_default"));
    botdb.append(new BotEntry("angel", "Angel", "lucy_angel"));
    botdb.append(new BotEntry("biker", "Biker", "biker_default"));
    botdb.append(new BotEntry("bitterman", "Bitterman", "bitterman_default"));
    botdb.append(new BotEntry("bones", "Bones", "bones_default"));
    botdb.append(new BotEntry("cadavre", "Cadavre", "biker_cadavre"));
    botdb.append(new BotEntry("crash", "Crash", "crash_default"));
    botdb.append(new BotEntry("daemia", "Daemia", "major_daemia"));
    botdb.append(new BotEntry("doom", "Doom", "doom_default"));
    botdb.append(new BotEntry("gorre", "Gorre", "visor_gorre"));
    botdb.append(new BotEntry("grunt", "Grunt", "grunt_default"));
    botdb.append(new BotEntry("hossman", "Hossman", "biker_hossman"));
    botdb.append(new BotEntry("hunter", "Hunter", "hunter_default"));
    botdb.append(new BotEntry("keel", "Keel", "keel_default"));
    botdb.append(new BotEntry("klesk", "Klesk", "klesk_default"));
    botdb.append(new BotEntry("lucy", "Lucy", "lucy_default"));
    botdb.append(new BotEntry("major", "Major", "major_default"));
    botdb.append(new BotEntry("mynx", "Mynx", "mynx_default"));
    botdb.append(new BotEntry("orbb", "Orbb", "orbb_default"));
    botdb.append(new BotEntry("patriot", "Patriot", "razor_patriot"));
    botdb.append(new BotEntry("phobos", "Phobos", "doom_phobos"));
    botdb.append(new BotEntry("ranger", "Ranger", "ranger_default"));
    botdb.append(new BotEntry("razor", "Razor", "razor_default"));
    botdb.append(new BotEntry("sarge", "Sarge", "sarge_default"));
    botdb.append(new BotEntry("slash", "Slash", "slash_default"));
    botdb.append(new BotEntry("sorlag", "Sorlag", "sorlag_default"));
    botdb.append(new BotEntry("stripe", "Stripe", "grunt_stripe"));
    botdb.append(new BotEntry("tankjr", "Tankjr", "tankjr_default"));
    botdb.append(new BotEntry("uriel", "Uriel", "uriel_default"));
    botdb.append(new BotEntry("visor", "Visor", "visor_default"));
    botdb.append(new BotEntry("wrack", "Wrack", "ranger_wrack"));
    botdb.append(new BotEntry("xaero", "Xaero", "xaero_default"))
})(jQuery);
(function ($) {
    function GameTypeEntry(gametype, rating, kwargs) {
        if (!kwargs) {
            kwargs = {}
        }
        this.gametype = gametype;
        this.rating = rating;
        this.avg_players = parseInt((kwargs.max_players + kwargs.min_players) / 2) || 0;
        this.min_players = kwargs.min_players || null;
        this.max_players = kwargs.max_players || null
    }

    function MapEntry(sysname, name, min_players, max_players, kwargs) {
        this.addGameType = function (gt) {
            if (!gt.min_players) {
                gt.min_players = this.min_players
            }
            if (!gt.max_players) {
                gt.max_players = this.max_players
            }
            this.gametypes[gt.gametype] = gt
        };
        this.sysname = sysname;
        this.name = name;
        this.min_players = min_players;
        this.max_players = max_players;
        this.tag_list = kwargs.tag_list || [];
        this.gametypes = {};
        this.hasTag = function (tag) {
            return typeof(this.tag_list[tag]) != 'undefined'
        };
        this.hasGameType = function (gametype) {
            return typeof(this.gametypes[gametype]) != 'undefined'
        }
    }

    function MapDB() {
        this.maps = {};
        this.gameTypeMaps = {};
        this.MapTags = {
            NONE: -1,
            NEW: 0,
            POPULAR: 1,
            SPACE: 2,
            TEAMARENA: 3,
            ASYMETRICCTF: 4,
            BEGINNER: 5,
            INTERMEDIATE: 6,
            ADVANCED: 7,
            SMALL: 10,
            MEDIUM: 11,
            LARGE: 12
        };
        this.MapTagNames = {};
        this.MapTagNames[this.MapTags.NONE] = "None";
        this.MapTagNames[this.MapTags.NEW] = "New";
        this.MapTagNames[this.MapTags.POPULAR] = "Popular";
        this.MapTagNames[this.MapTags.SPACE] = "Space";
        this.MapTagNames[this.MapTags.TEAMARENA] = "Team Arena";
        this.MapTagNames[this.MapTags.ASYMETRICCTF] = "Asymetric CTF";
        this.MapTagNames[this.MapTags.BEGINNER] = "Beginner";
        this.MapTagNames[this.MapTags.INTERMEDIATE] = "Intermediate";
        this.MapTagNames[this.MapTags.ADVANCED] = "Advanced";
        this.MapTagNames[this.MapTags.SMALL] = "Small";
        this.MapTagNames[this.MapTags.MEDIUM] = "Medium";
        this.MapTagNames[this.MapTags.LARGE] = "Large";
        this.GameTypes = {
            NONE: -1,
            FFA: 0,
            DUEL: 1,
            SINGLE_PLAYER: 2,
            TDM: 3,
            CA: 4,
            CTF: 5,
            MAX: 6
        };
        this.GameTypeNames = {
            0: 'Free For All',
            1: 'Duel',
            2: 'Single Player',
            3: 'Team Deathmatch',
            4: 'Clan Arena',
            5: 'Capture The Flag'
        };
        this.GameTypeShortNames = {
            0: 'ffa',
            1: 'duel',
            2: 'sp',
            3: 'tdm',
            4: 'ca',
            5: 'ctf'
        };
        this.GameTypeList = [this.GameTypes.FFA, this.GameTypes.CTF, this.GameTypes.CA, this.GameTypes.TDM, this.GameTypes.DUEL];
        this.GameTypeRating = {
            POOR: 0,
            GOOD: 1
        };
        this.append = function (m) {
            this.maps[m.sysname] = m
        };
        this.getBySysName = function (sysname) {
            return this.maps[sysname]
        };
        this.getFirstByGameType = function (gametype) {
            for (var index in this.maps) {
                var map = this.maps[index];
                if (map.gametypes[gametype]) {
                    return map
                }
            }
            return null
        };
        this.isTeamGameType = function (gametype) {
            return gametype >= this.GameTypes.TDM
        };
        this.isPrepared = false;
        this.prepareMapDB = function () {
            if (this.isPrepared) {
                return
            }
            this.isPrepared = true;
            this.orderedMaps = [];
            this.gameTypeMaps = {};
            for (var mapName in this.maps) {
                var map = this.maps[mapName];
                this.orderedMaps.push(mapName);
                for (var gtIndex in map.gametypes) {
                    var gt = map.gametypes[gtIndex];
                    if (!this.gameTypeMaps[gt.gametype]) {
                        this.gameTypeMaps[gt.gametype] = []
                    }
                    this.gameTypeMaps[gt.gametype].push(map)
                }
            }
            var self = this;
            this.orderedMaps.sort(function (a, b) {
                var ma = self.maps[a].name;
                var mb = self.maps[b].name;
                return ma > mb ? 1 : (ma < mb ? -1 : 0)
            })
        };
        this.getRandomByGameType = function (gametype) {
            var gtMaps = this.gameTypeMaps[gametype];
            return gtMaps[Math.floor(Math.random() * gtMaps.length)]
        }
    };
    var mapdb = window.mapdb = new MapDB();
    var m;
    m = new MapEntry('qzdm1', 'Arena Gate', 2, 6, {
        tag_list: [mapdb.MapTags.SMALL, mapdb.MapTags.BEGINNER]
    });
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.FFA, mapdb.GameTypeRating.GOOD));
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.DUEL, mapdb.GameTypeRating.POOR));
    mapdb.append(m);
    m = new MapEntry('qzdm2', 'House Of Pain', 2, 6, {
        tag_list: [mapdb.MapTags.SMALL, mapdb.MapTags.BEGINNER]
    });
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.FFA, mapdb.GameTypeRating.GOOD));
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.CA, mapdb.GameTypeRating.GOOD));
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.DUEL, mapdb.GameTypeRating.POOR));
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.TDM, mapdb.GameTypeRating.POOR));
    mapdb.append(m);
    m = new MapEntry('qzdm3', 'Arena Of Death', 2, 6, {
        tag_list: [mapdb.MapTags.SMALL, mapdb.MapTags.BEGINNER]
    });
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.FFA, mapdb.GameTypeRating.GOOD));
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.CA, mapdb.GameTypeRating.GOOD));
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.DUEL, mapdb.GameTypeRating.POOR, {
        min_players: 2,
        max_players: 2
    }));
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.TDM, mapdb.GameTypeRating.POOR));
    mapdb.append(m);
    m = new MapEntry('qzdm4', 'Place of Many Deaths', 4, 8, {
        tag_list: [mapdb.MapTags.MEDIUM, mapdb.MapTags.INTERMEDIATE]
    });
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.FFA, mapdb.GameTypeRating.GOOD));
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.CA, mapdb.GameTypeRating.GOOD, {
        min_players: 4,
        max_players: 12
    }));
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.DUEL, mapdb.GameTypeRating.GOOD));
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.TDM, mapdb.GameTypeRating.POOR));
    mapdb.append(m);
    m = new MapEntry('qzdm5', 'Forgotten Place', 2, 6, {
        tag_list: [mapdb.MapTags.SMALL, mapdb.MapTags.BEGINNER]
    });
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.FFA, mapdb.GameTypeRating.GOOD));
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.CA, mapdb.GameTypeRating.GOOD));
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.DUEL, mapdb.GameTypeRating.GOOD));
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.TDM, mapdb.GameTypeRating.POOR));
    mapdb.append(m);
    m = new MapEntry('qzdm6', 'Campgrounds', 4, 12, {
        tag_list: [mapdb.MapTags.POPULAR, mapdb.MapTags.MEDIUM, mapdb.MapTags.INTERMEDIATE]
    });
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.FFA, mapdb.GameTypeRating.GOOD, {
        min_players: 4,
        max_players: 16
    }));
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.CA, mapdb.GameTypeRating.GOOD));
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.DUEL, mapdb.GameTypeRating.GOOD));
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.TDM, mapdb.GameTypeRating.GOOD, {
        min_players: 4,
        max_players: 10
    }));
    mapdb.append(m);
    m = new MapEntry('qzdm7', 'Temple of Retribution', 6, 16, {
        tag_list: [mapdb.MapTags.POPULAR, mapdb.MapTags.LARGE, mapdb.MapTags.INTERMEDIATE]
    });
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.FFA, mapdb.GameTypeRating.GOOD));
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.CA, mapdb.GameTypeRating.GOOD, {
        min_players: 8,
        max_players: 12
    }));
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.TDM, mapdb.GameTypeRating.GOOD, {
        min_players: 4,
        max_players: 10
    }));
    mapdb.append(m);
    m = new MapEntry('qzdm8', 'Brimstone Abbey', 4, 8, {
        tag_list: [mapdb.MapTags.MEDIUM, mapdb.MapTags.INTERMEDIATE]
    });
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.FFA, mapdb.GameTypeRating.GOOD));
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.CA, mapdb.GameTypeRating.POOR, {
        min_players: 4,
        max_players: 10
    }));
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.TDM, mapdb.GameTypeRating.GOOD));
    mapdb.append(m);
    m = new MapEntry('qzdm9', 'Hero\'s Keep', 4, 8, {
        tag_list: [mapdb.MapTags.MEDIUM, mapdb.MapTags.INTERMEDIATE]
    });
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.FFA, mapdb.GameTypeRating.GOOD));
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.CA, mapdb.GameTypeRating.POOR, {
        min_players: 4,
        max_players: 10
    }));
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.TDM, mapdb.GameTypeRating.POOR));
    mapdb.append(m);
    m = new MapEntry('qzdm10', 'Nameless Place', 4, 8, {
        tag_list: [mapdb.MapTags.MEDIUM, mapdb.MapTags.ADVANCED]
    });
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.FFA, mapdb.GameTypeRating.GOOD));
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.CA, mapdb.GameTypeRating.GOOD, {
        min_players: 4,
        max_players: 10
    }));
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.DUEL, mapdb.GameTypeRating.GOOD));
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.TDM, mapdb.GameTypeRating.GOOD));
    mapdb.append(m);
    m = new MapEntry('qzdm11', 'Chemical Reaction', 6, 16, {
        tag_list: [mapdb.MapTags.POPULAR, mapdb.MapTags.LARGE, mapdb.MapTags.INTERMEDIATE]
    });
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.FFA, mapdb.GameTypeRating.GOOD));
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.CA, mapdb.GameTypeRating.GOOD, {
        min_players: 8,
        max_players: 12
    }));
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.TDM, mapdb.GameTypeRating.GOOD, {
        min_players: 4,
        max_players: 10
    }));
    mapdb.append(m);
    m = new MapEntry('qzdm12', 'Dredwerkz', 6, 16, {
        tag_list: [mapdb.MapTags.POPULAR, mapdb.MapTags.LARGE, mapdb.MapTags.INTERMEDIATE]
    });
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.FFA, mapdb.GameTypeRating.GOOD));
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.CA, mapdb.GameTypeRating.GOOD, {
        min_players: 8,
        max_players: 12
    }));
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.TDM, mapdb.GameTypeRating.GOOD, {
        min_players: 4,
        max_players: 10
    }));
    mapdb.append(m);
    m = new MapEntry('qzdm13', 'Lost World', 4, 8, {
        tag_list: [mapdb.MapTags.POPULAR, mapdb.MapTags.MEDIUM, mapdb.MapTags.ADVANCED]
    });
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.FFA, mapdb.GameTypeRating.GOOD));
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.CA, mapdb.GameTypeRating.GOOD, {
        min_players: 4,
        max_players: 10
    }));
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.TDM, mapdb.GameTypeRating.GOOD));
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.DUEL, mapdb.GameTypeRating.GOOD));
    mapdb.append(m);
    m = new MapEntry('qzdm14', 'Grim Dungeons', 6, 16, {
        tag_list: [mapdb.MapTags.POPULAR, mapdb.MapTags.LARGE, mapdb.MapTags.INTERMEDIATE]
    });
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.FFA, mapdb.GameTypeRating.GOOD));
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.CA, mapdb.GameTypeRating.GOOD, {
        min_players: 8,
        max_players: 12
    }));
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.TDM, mapdb.GameTypeRating.GOOD, {
        min_players: 4,
        max_players: 10
    }));
    mapdb.append(m);
    m = new MapEntry('qzdm15', 'Demon Keep', 6, 16, {
        tag_list: [mapdb.MapTags.LARGE, mapdb.MapTags.INTERMEDIATE]
    });
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.FFA, mapdb.GameTypeRating.GOOD));
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.CA, mapdb.GameTypeRating.GOOD, {
        min_players: 8,
        max_players: 12
    }));
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.TDM, mapdb.GameTypeRating.GOOD));
    mapdb.append(m);
    m = new MapEntry('qzdm16', 'Cobalt Station', 4, 8, {
        tag_list: [mapdb.MapTags.SPACE, mapdb.MapTags.MEDIUM, mapdb.MapTags.ADVANCED]
    });
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.FFA, mapdb.GameTypeRating.GOOD));
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.CA, mapdb.GameTypeRating.POOR, {
        min_players: 2,
        max_players: 6
    }));
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.TDM, mapdb.GameTypeRating.POOR));
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.DUEL, mapdb.GameTypeRating.POOR));
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.CTF, mapdb.GameTypeRating.POOR, {
        min_players: 2,
        max_players: 6
    }));
    mapdb.append(m);
    m = new MapEntry('qzdm17', 'The Longest Yard', 2, 12, {
        tag_list: [mapdb.MapTags.POPULAR, mapdb.MapTags.SPACE, mapdb.MapTags.MEDIUM, mapdb.MapTags.INTERMEDIATE]
    });
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.FFA, mapdb.GameTypeRating.GOOD, {
        min_players: 2,
        max_players: 16
    }));
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.CA, mapdb.GameTypeRating.GOOD));
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.TDM, mapdb.GameTypeRating.POOR, {
        min_players: 4,
        max_players: 10
    }));
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.DUEL, mapdb.GameTypeRating.POOR));
    mapdb.append(m);
    m = new MapEntry('qzdm18', 'Space Chamber', 6, 18, {
        tag_list: [mapdb.MapTags.SPACE, mapdb.MapTags.LARGE, mapdb.MapTags.ADVANCED]
    });
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.FFA, mapdb.GameTypeRating.GOOD));
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.CA, mapdb.GameTypeRating.POOR));
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.TDM, mapdb.GameTypeRating.GOOD, {
        min_players: 4,
        max_players: 10
    }));
    mapdb.append(m);
    m = new MapEntry('qzdm19', 'Terminal Heights', 4, 8, {
        tag_list: [mapdb.MapTags.SPACE, mapdb.MapTags.MEDIUM, mapdb.MapTags.ADVANCED]
    });
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.FFA, mapdb.GameTypeRating.GOOD));
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.TDM, mapdb.GameTypeRating.POOR, {
        min_players: 6,
        max_players: 16
    }));
    mapdb.append(m);
    m = new MapEntry('qzdm20', 'Hidden Fortress', 4, 12, {
        tag_list: [mapdb.MapTags.NEW, mapdb.MapTags.INTERMEDIATE, mapdb.MapTags.SMALL]
    });
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.FFA, mapdb.GameTypeRating.GOOD));
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.CA, mapdb.GameTypeRating.GOOD, {
        max_players: 10
    }));
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.TDM, mapdb.GameTypeRating.GOOD, {
        min_players: 4,
        max_players: 8
    }));
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.DUEL, mapdb.GameTypeRating.POOR));
    mapdb.append(m);
    m = new MapEntry('qztourney1', 'Power Station', 2, 6, {
        tag_list: [mapdb.MapTags.SMALL, mapdb.MapTags.BEGINNER]
    });
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.FFA, mapdb.GameTypeRating.GOOD));
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.DUEL, mapdb.GameTypeRating.GOOD));
    mapdb.append(m);
    m = new MapEntry('qztourney2', 'Proving Grounds', 2, 6, {
        tag_list: [mapdb.MapTags.POPULAR, mapdb.MapTags.SMALL, mapdb.MapTags.INTERMEDIATE]
    });
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.FFA, mapdb.GameTypeRating.GOOD));
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.CA, mapdb.GameTypeRating.GOOD));
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.DUEL, mapdb.GameTypeRating.GOOD, {
        min_players: 2,
        max_players: 4
    }));
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.TDM, mapdb.GameTypeRating.POOR));
    mapdb.append(m);
    m = new MapEntry('qztourney3', 'Hell\'s Gate', 2, 6, {
        tag_list: [mapdb.MapTags.SMALL, mapdb.MapTags.MEDIUM, mapdb.MapTags.INTERMEDIATE]
    });
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.FFA, mapdb.GameTypeRating.GOOD));
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.CA, mapdb.GameTypeRating.GOOD));
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.DUEL, mapdb.GameTypeRating.GOOD));
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.TDM, mapdb.GameTypeRating.POOR));
    mapdb.append(m);
    m = new MapEntry('qztourney4', 'Vertical Vengeance', 2, 6, {
        tag_list: [mapdb.MapTags.POPULAR, mapdb.MapTags.SMALL, mapdb.MapTags.ADVANCED]
    });
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.FFA, mapdb.GameTypeRating.GOOD));
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.CA, mapdb.GameTypeRating.GOOD));
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.DUEL, mapdb.GameTypeRating.GOOD));
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.TDM, mapdb.GameTypeRating.POOR));
    mapdb.append(m);
    m = new MapEntry('qztourney5', 'Hell\'s Gate Redux', 2, 6, {
        tag_list: [mapdb.MapTags.NEW, mapdb.MapTags.SMALL, mapdb.MapTags.BEGINNER]
    });
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.FFA, mapdb.GameTypeRating.GOOD));
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.CA, mapdb.GameTypeRating.GOOD));
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.DUEL, mapdb.GameTypeRating.GOOD));
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.TDM, mapdb.GameTypeRating.POOR));
    mapdb.append(m);
    m = new MapEntry('qztourney6', 'Almost Lost', 4, 8, {
        tag_list: [mapdb.MapTags.NEW, mapdb.MapTags.POPULAR, mapdb.MapTags.MEDIUM, mapdb.MapTags.ADVANCED]
    });
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.FFA, mapdb.GameTypeRating.GOOD));
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.CA, mapdb.GameTypeRating.GOOD, {
        min_players: 4,
        max_players: 10
    }));
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.DUEL, mapdb.GameTypeRating.GOOD));
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.TDM, mapdb.GameTypeRating.GOOD));
    mapdb.append(m);
    m = new MapEntry('qztourney7', 'Furious Heights', 4, 8, {
        tag_list: [mapdb.MapTags.NEW, mapdb.MapTags.POPULAR, mapdb.MapTags.MEDIUM, mapdb.MapTags.ADVANCED]
    });
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.FFA, mapdb.GameTypeRating.GOOD));
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.CA, mapdb.GameTypeRating.GOOD, {
        min_players: 4,
        max_players: 10
    }));
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.DUEL, mapdb.GameTypeRating.GOOD));
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.TDM, mapdb.GameTypeRating.GOOD));
    mapdb.append(m);
    m = new MapEntry('qztourney8', 'Temple of Pain', 2, 6, {
        tag_list: [mapdb.MapTags.TEAMARENA, mapdb.MapTags.SMALL, mapdb.MapTags.BEGINNER]
    });
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.FFA, mapdb.GameTypeRating.GOOD));
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.CA, mapdb.GameTypeRating.GOOD));
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.DUEL, mapdb.GameTypeRating.GOOD));
    mapdb.append(m);
    m = new MapEntry('qztourney9', 'House of Decay', 2, 6, {
        tag_list: [mapdb.MapTags.TEAMARENA, mapdb.MapTags.SMALL, mapdb.MapTags.INTERMEDIATE]
    });
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.FFA, mapdb.GameTypeRating.GOOD));
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.CA, mapdb.GameTypeRating.POOR));
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.DUEL, mapdb.GameTypeRating.GOOD));
    mapdb.append(m);
    m = new MapEntry('ztntourney1', 'Blood Run', 4, 6, {
        tag_list: [mapdb.MapTags.NEW, mapdb.MapTags.SMALL, mapdb.MapTags.INTERMEDIATE, mapdb.MapTags.POPULAR]
    });
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.CA, mapdb.GameTypeRating.GOOD));
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.FFA, mapdb.GameTypeRating.GOOD));
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.DUEL, mapdb.GameTypeRating.GOOD));
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.TDM, mapdb.GameTypeRating.GOOD));
    mapdb.append(m);
    m = new MapEntry('qzctf1', 'Dueling Keeps', 2, 6, {
        tag_list: [mapdb.MapTags.SMALL, mapdb.MapTags.BEGINNER]
    });
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.CTF, mapdb.GameTypeRating.GOOD));
    mapdb.append(m);
    m = new MapEntry('qzctf2', 'Troubled Waters', 4, 10, {
        tag_list: [mapdb.MapTags.POPULAR, mapdb.MapTags.MEDIUM, mapdb.MapTags.INTERMEDIATE]
    });
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.CTF, mapdb.GameTypeRating.GOOD));
    mapdb.append(m);
    m = new MapEntry('qzctf3', 'The Stronghold', 4, 10, {
        tag_list: [mapdb.MapTags.POPULAR, mapdb.MapTags.MEDIUM, mapdb.MapTags.INTERMEDIATE]
    });
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.CTF, mapdb.GameTypeRating.GOOD));
    mapdb.append(m);
    m = new MapEntry('qzctf4', 'Space CTF', 2, 6, {
        tag_list: [mapdb.MapTags.SPACE, mapdb.MapTags.POPULAR, mapdb.MapTags.SMALL, mapdb.MapTags.INTERMEDIATE]
    });
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.CTF, mapdb.GameTypeRating.GOOD));
    mapdb.append(m);
    m = new MapEntry('qzctf6', 'Beyond Reality II', 2, 6, {
        tag_list: [mapdb.MapTags.SPACE, mapdb.MapTags.POPULAR, mapdb.MapTags.SMALL, mapdb.MapTags.INTERMEDIATE]
    });
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.FFA, mapdb.GameTypeRating.POOR));
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.DUEL, mapdb.GameTypeRating.GOOD));
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.TDM, mapdb.GameTypeRating.POOR));
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.CTF, mapdb.GameTypeRating.GOOD));
    mapdb.append(m);
    m = new MapEntry('qzctf7', 'IronWorks', 4, 10, {
        tag_list: [mapdb.MapTags.NEW, mapdb.MapTags.POPULAR, mapdb.MapTags.MEDIUM, mapdb.MapTags.ADVANCED]
    });
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.CTF, mapdb.GameTypeRating.GOOD));
    mapdb.append(m);
    m = new MapEntry('qzctf8', 'Siberia', 6, 12, {
        tag_list: [mapdb.MapTags.NEW, mapdb.MapTags.LARGE, mapdb.MapTags.ADVANCED]
    });
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.CTF, mapdb.GameTypeRating.GOOD));
    mapdb.append(m);
    m = new MapEntry('qzctf9', 'Bloodlust CTF', 6, 10, {
        tag_list: [mapdb.MapTags.NEW, mapdb.MapTags.MEDIUM, mapdb.MapTags.ADVANCED]
    });
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.CTF, mapdb.GameTypeRating.GOOD));
    mapdb.append(m);
    m = new MapEntry('qzctf10', 'Courtyard Conundrum', 6, 10, {
        tag_list: [mapdb.MapTags.NEW, mapdb.MapTags.LARGE, mapdb.MapTags.ADVANCED]
    });
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.CTF, mapdb.GameTypeRating.GOOD));
    mapdb.append(m);
    m = new MapEntry('qzteam1', 'Base Siege', 4, 10, {
        tag_list: [mapdb.MapTags.TEAMARENA, mapdb.MapTags.MEDIUM, mapdb.MapTags.INTERMEDIATE]
    });
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.CTF, mapdb.GameTypeRating.GOOD));
    mapdb.append(m);
    m = new MapEntry('qzteam3', 'Inner Sanctums', 4, 12, {
        tag_list: [mapdb.MapTags.TEAMARENA, mapdb.MapTags.MEDIUM, mapdb.MapTags.INTERMEDIATE]
    });
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.CTF, mapdb.GameTypeRating.GOOD));
    mapdb.append(m);
    m = new MapEntry('qzteam4', 'Scornforge', 8, 12, {
        tag_list: [mapdb.MapTags.TEAMARENA, mapdb.MapTags.LARGE, mapdb.MapTags.INTERMEDIATE]
    });
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.CTF, mapdb.GameTypeRating.GOOD));
    mapdb.append(m);
    m = new MapEntry('qzteam6', 'Vortex Portal', 4, 12, {
        tag_list: [mapdb.MapTags.TEAMARENA, mapdb.MapTags.SPACE, mapdb.MapTags.MEDIUM, mapdb.MapTags.ADVANCED]
    });
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.CTF, mapdb.GameTypeRating.GOOD));
    mapdb.append(m);
    m = new MapEntry('qzteam7', 'Rebound', 8, 12, {
        tag_list: [mapdb.MapTags.TEAMARENA, mapdb.MapTags.SPACE, mapdb.MapTags.LARGE, mapdb.MapTags.INTERMEDIATE]
    });
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.CTF, mapdb.GameTypeRating.GOOD));
    mapdb.append(m);
    m = new MapEntry('qzca1', 'Asylum', 2, 10, {
        tag_list: [mapdb.MapTags.NEW, mapdb.MapTags.POPULAR, mapdb.MapTags.MEDIUM, mapdb.MapTags.INTERMEDIATE]
    });
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.FFA, mapdb.GameTypeRating.GOOD));
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.CA, mapdb.GameTypeRating.GOOD));
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.DUEL, mapdb.GameTypeRating.GOOD));
    mapdb.append(m);
    m = new MapEntry('qzca2', 'Trinity', 4, 16, {
        tag_list: [mapdb.MapTags.NEW, mapdb.MapTags.POPULAR, mapdb.MapTags.MEDIUM, mapdb.MapTags.INTERMEDIATE]
    });
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.FFA, mapdb.GameTypeRating.GOOD));
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.CA, mapdb.GameTypeRating.GOOD, {
        min_players: 4,
        max_players: 12
    }));
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.DUEL, mapdb.GameTypeRating.GOOD));
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.TDM, mapdb.GameTypeRating.GOOD, {
        min_players: 4,
        max_players: 10
    }));
    mapdb.append(m);
    m = new MapEntry('qzca3', 'Quarantine', 4, 16, {
        tag_list: [mapdb.MapTags.NEW, mapdb.MapTags.POPULAR, mapdb.MapTags.MEDIUM, mapdb.MapTags.INTERMEDIATE]
    });
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.FFA, mapdb.GameTypeRating.GOOD));
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.CA, mapdb.GameTypeRating.GOOD, {
        min_players: 4,
        max_players: 12
    }));
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.DUEL, mapdb.GameTypeRating.GOOD));
    m.addGameType(new GameTypeEntry(mapdb.GameTypes.TDM, mapdb.GameTypeRating.GOOD, {
        min_players: 4,
        max_players: 10
    }));
    mapdb.append(m);
    mapdb.prepareMapDB()
})(jQuery);
(function ($) {
    function Location(record) {
        this.id = parseInt(record['LOCATION_ID']);
        this.location = record['LOCATION'];
        this.shortName = record['SHORT_NAME'];
        this.city = record['CITY'];
        this.region = record['REGION'];
        this.countryAbbr = record['COUNTRY_ABBR'];
        this.country = record['COUNTRY'];
        this.ordinal = record['ORDINAL']
    }
    Location.prototype.GetCityState = function () {
        if (this.IsUSA()) {
            return[this.region, this.city].join(', ')
        } else {
            return this.city
        }
    };
    Location.prototype.GetFlagIcon = function () {
        return '/images/flags3cc/' + this.countryAbbr.toLowerCase() + '.gif'
    };
    Location.prototype.IsUSA = function () {
        return this.countryAbbr.toLowerCase() == 'usa'
    };

    function LocationDB() {
        this.Reset = function () {
            this.locations = {};
            this.locsByCountry = null;
            this.orderedCountries = null
        };
        this.Reset();
        this.Append = function (loc) {
            this.locations[loc.id] = loc
        };
        this.GetByID = function (id) {
            return this.locations[id]
        };
        this.GetCountryLocations = function (country) {
            return this.locsByCountry[country]
        };
        this.PrepareLocations = function () {
            this.locsByCountry = {};
            this.orderedCountries = [];
            for (var index in this.locations) {
                var loc = this.locations[index];
                if (typeof(this.locsByCountry[loc.countryAbbr]) == 'undefined') {
                    this.locsByCountry[loc.countryAbbr] = [];
                    this.orderedCountries.push(loc.countryAbbr)
                }
                this.locsByCountry[loc.countryAbbr].push(loc)
            }

            function GenericSort(a, b) {
                return a > b ? 1 : (a < b ? -1 : 0)
            };
            this.orderedCountries.sort(GenericSort);

            function SortCountryLocations(a, b) {
                if (a.countryAbbr > b.countryAbbr) {
                    return 1
                } else if (a.countryAbbr < b.countryAbbr) {
                    return -1
                } else {
                    if (a.city > b.city) {
                        return 1
                    } else if (a.city < b.city) {
                        return -1
                    } else {
                        return a.ordinal > b.ordinal ? 1 : (a.ordinal < b.ordinal ? -1 : 0)
                    }
                }
            }
        };
        this.LoadLocations = function (locations) {
            for (var locIndex in locations) {
                var loc = new Location(locations[locIndex]);
                this.Append(loc)
            }
            this.PrepareLocations()
        };
        this.UpdateLocations = function (locations) {
            this.Reset();
            this.LoadLocations(locations)
        }
    };
    window.locdb = new LocationDB()
})(jQuery);
(function ($) {
    var join = {};
    window.JoinURL = join;
    join.currentServerAddress = undefined;
    join.savedHash = undefined;
    join.CheckForJoin = function () {
        if (qlXfer.currentGroup >= GROUP_EXTRA) {
            if (quakelive.pathParts[1] === 'join' && quakelive.IsLoggedIn()) {
                var public_id = quakelive.pathParts[2];
                var ajax = $.ajax({
                    url: '/home/matchdetails/' + public_id,
                    dataType: 'json',
                    success: join.AjaxSuccess,
                    error: join.AjaxError
                })
            }
        }
    };
    join.CheckForLogin = function () {
        if (quakelive.pathParts[1] === 'join') {
            if (quakelive.IsLoggedIn()) {
                JoinURL.CheckForJoin()
            } else {
                quakelive.Goto('login/home/join/' + quakelive.pathParts[2])
            }
        }
    };
    join.AjaxSuccess = function (json) {
        if (json.ECODE === 0) {
            var cmdString = BuildCmdString();
            cmdString += "+connect " + json.host_address;
            quakelive.Goto('home');
            LaunchGame(cmdString, false, json)
        } else {
            join.ShowJoinError('The server you attempted to join no longer exists.')
        }
    };
    join.AjaxError = function (e) {
        join.ShowJoinError('Cannot match. The server was unable to retrieve the connection details.')
    };
    join.ShowJoinError = function (errorTxt) {
        qlPrompt({
            title: 'Join Server Failed',
            body: errorTxt,
            alert: true
        })
    };
    join.OnGameStarted = function (e) {
        try {
            if (e.serverInfo.public_id > 0) {
                join.currentServerAddress = quakelive.siteConfig.baseUrl + '/r/home/join/' + e.serverInfo.public_id;
                quakelive.StopPathMonitor();
                join.savedHash = window.location.hash;
                window.location.hash = 'home/join/' + e.serverInfo.public_id;
                quakelive.StartPathMonitor()
            } else {
                join.currentServerAddress = undefined;
                join.savedHash = undefined
            }
        } catch(e) {
            join.currentServerAddress = undefined;
            join.savedHash = undefined
        }
    };
    join.OnGameExited = function (e) {
        join.currentServerAddress = undefined;
        quakelive.StopPathMonitor();
        if (join.savedHash !== undefined) {
            window.location.hash = join.savedHash
        }
        join.savedHash = undefined;
        quakelive.StartPathMonitor()
    };
    quakelive.AddHook('OnGameStarted', join.OnGameStarted);
    quakelive.AddHook('OnGameUpdated', join.OnGameStarted);
    quakelive.AddHook('OnGameExited', join.OnGameExited)
})(jQuery);
(function ($) {
    var n = {};
    window.nav = n;
    window.SUBMENU_END = {};
    n.defaultSettings = {
        'location': 'body',
        'object': n.navbar,
        'recursive': true,
        'supernav_class': 'sf-menu',
        'supernav_id': 'supernav'
    };
    n.checkDirection = function () {
        var right = this.offset()['left'] + this.width();
        if (right > document.documentElement.clientWidth) {
            this.addClass('overflowLeft')
        }
    };
    n.initNav = function (settings) {
        settings = jQuery.extend({},
        n.defaultSettings, settings);
        var list = n.processNode(settings);
        $(settings.location).html(list);
        $('ul.sf-menu').superfish({
            'delay': 125,
            'speed': 1,
            'animation': {
                opacity: 'show'
            },
            'dropShadows': false,
            'onShow': n.checkDirection,
            'onHide': function () {
                this.removeClass('overflowLeft')
            },
            'disableHI': false
        })
    };
    n.processNode = function (settings) {
        var list = $('<ul></ul>');
        list.addClass(settings.supernav_class);
        list.attr('id', settings.supernav_id);
        var validNodeCount = 0;
        var obj = settings.object;
        for (var i in obj) {
            var builtNode = $('<li></li>');
            builtNode.html(i);
            var validNode = false;
            for (var prop in obj[i]) {
                var label = '';
                if (!settings.supernav_id) {
                    label = i
                } else {
                    label = '&nbsp;'
                }
                switch (prop) {
                case 'goto':
                    builtNode.html('<a href="javascript:;" onclick="quakelive.Goto(\'' + obj[i]['goto'] + '\'); return false;">' + label + '</a>');
                    break;
                case 'href':
                    builtNode.html('<a href="' + obj[i]['href'] + '" target="_blank">' + label + '</a>');
                    break;
                case 'class':
                    builtNode.addClass(obj[i]['class']);
                    break;
                case 'id':
                    builtNode.attr('id', obj[i]['id']);
                    break;
                case 'callback':
                    builtNode.html('<a href="javascript:;" onclick="' + obj[i]['callback'] + '; return false; ">' + label + '</a>');
                    break;
                default:
                    continue
                }
                validNode = true;
                validNodeCount++
            }
            if (settings.recursive === true) {
                if (obj[i].submenu) {
                    var sublist = n.processNode({
                        'object': obj[i].submenu,
                        'recursive': true
                    });
                    if (sublist !== null) {
                        builtNode.append(sublist)
                    }
                }
            }
            if (validNode) {
                list.append(builtNode)
            }
        }
        return validNodeCount > 0 ? list : null
    };
    n.initTopBar = function () {
        var layout = quakelive.activeModule.GetLayout();
        if (layout !== 'bare' && layout !== 'postlogin_bare') {
            nav.initNav({
                'location': '#newnav_top',
                'supernav_id': 'topNav',
                'object': nav.navbar
            })
        }
    };
    quakelive.AddHook('OnLayoutLoaded', n.initTopBar)
})(jQuery);
(function ($) {
    function ServerPlayer(rec) {
        this.name = rec.name;
        this.clan = rec.clan;
        this.score = parseInt(rec.score);
        this.rank = parseInt(rec.rank);
        this.bot = parseInt(rec.bot);
        this.team = parseInt(rec.team);
        this.model = rec.model;
        this.friend = false;
        this.blocked = false;
        if (!this.bot) {
            var strippedName = StripColors(this.name);
            if (quakelive.mod_friends.IsOnRoster(strippedName)) {
                this.friend = true
            } else if (quakelive.mod_friends.IsBlocked(strippedName)) {
                this.blocked = true
            }
        }
    }

    function ServerEntry() {
        this.details = false;
        this.error = false;
        this.ordinal = 0;
        this.basicsTime = 0;
        this.detailsTime = 0;
        this.num_friends = 0;
        this.num_blocked = 0;
        this.hidden = false;
        this.public_id = 0;
        this.game_type = 0;
        this.host_name = '';
        this.ranked = 0;
        this.map = '';
        this.num_clients = 0;
        this.max_clients = 0;
        this.g_instagib = 0;
        this.g_needpass = 0;
        this.location_id = 0;
        this.host_address = '';
        this.skillDelta = 0;
        this.g_gamestate = 0;
        this.g_levelstarttime = 0;
        this.timelimit = 0;
        this.fraglimit = 0;
        this.capturelimit = 0;
        this.roundlimit = 0;
        this.roundtimelimit = 0;
        this.g_redscore = 0;
        this.g_bluescore = 0;
        this.players = []
    }
    ServerEntry.prototype.UpdateBasics = function (rec) {
        this.basicsTime = new Date().getTime();
        this.public_id = parseInt(rec.public_id);
        this.game_type = parseInt(rec.game_type);
        this.host_name = rec.host_name;
        this.ranked = parseInt(rec.ranked);
        this.map = rec.map;
        this.num_clients = parseInt(rec.num_clients);
        this.max_clients = parseInt(rec.max_clients);
        this.g_instagib = parseInt(rec.g_instagib);
        this.g_needpass = parseInt(rec.g_needpass);
        this.location_id = parseInt(rec.location_id);
        this.host_address = rec.host_address;
        this.skillDelta = parseInt(rec.skillDelta)
    };
    ServerEntry.prototype.GetMapTitle = function () {
        var lcName = this.map.toLowerCase();
        var e = mapdb.getBySysName(lcName);
        if (e) {
            return e.name
        }
        return lcName
    };
    ServerEntry.prototype.GetGameTypeTitle = function () {
        return mapdb.GameTypeNames[this.game_type] || 'Unknown'
    };
    ServerEntry.prototype.UpdateDetails = function (rec) {
        this.details = true;
        this.detailsTime = new Date().getTime();
        this.g_gamestate = rec.g_gamestate;
        this.g_levelstarttime = parseInt(rec.g_levelstarttime);
        this.timelimit = parseInt(rec.timelimit);
        this.fraglimit = parseInt(rec.fraglimit);
        this.capturelimit = parseInt(rec.capturelimit);
        this.roundlimit = parseInt(rec.roundlimit);
        this.roundtimelimit = parseInt(rec.roundtimelimit);
        this.g_redscore = parseInt(rec.g_redscore);
        this.g_bluescore = parseInt(rec.g_bluescore);
        this.num_friends = 0;
        this.num_blocked = 0;
        var players = [];
        if (rec.players) {
            for (var i = 0; i < rec.players.length; ++i) {
                var p = new ServerPlayer(rec.players[i]);
                players.push(p);
                if (p.friend) {
                    this.num_friends++
                } else if (p.blocked) {
                    this.num_blocked++
                }
            }
        }
        players.sort(function (a, b) {
            if (a.friend == b.friend) {
                if (a.blocked == b.blocked) {
                    if (a.bot == b.bot) {
                        if (a.team == b.team) {
                            if (a.score < b.score) {
                                return 1
                            } else if (a.score > b.score) {
                                return -1
                            } else {
                                return 0
                            }
                        } else {
                            if (a.team < b.team) {
                                return -1
                            } else if (a.team > b.team) {
                                return 1
                            } else {
                                return 0
                            }
                        }
                    } else {
                        if (a.bot < b.bot) {
                            return -1
                        } else if (a.bot > b.bot) {
                            return 1
                        } else {
                            return 0
                        }
                    }
                } else if (a.blocked) {
                    return 1
                } else {
                    return -1
                }
            } else if (a.friend) {
                return -1
            } else {
                return 1
            }
        });
        this.players = players
    };
    var DEFAULT_FILTER_STRUCT = {
        "filters": {
            "group": "any",
            "game_type": "any",
            "arena": "any",
            "state": "any",
            "difficulty": "any",
            "location": "any",
            "private": 0
        },
        "arena_type": "",
        "players": [],
        "game_types": [],
        "ig": 0
    };

    function ServerFilter(params) {
        this.params = $.extend({},
        DEFAULT_FILTER_STRUCT, params);
        this.listener = null
    }
    ServerFilter.prototype.DEFAULT_FILTER = new ServerFilter();
    ServerFilter.prototype.GetBase64 = function () {
        return Base64.encode(JSON.stringify(this.params))
    };

    function ServerManagerListener() {
        ServerManagerListener.prototype.OnRefreshServersSuccess = function () {};
        ServerManagerListener.prototype.OnRefreshServersError = function () {};
        ServerManagerListener.prototype.OnSaveFilterSuccess = function () {};
        ServerManagerListener.prototype.OnSaveFilterError = function () {}
    }

    function ServerManager() {
        this.serversById = {};
        this.servers = []
    }
    ServerManager.prototype.GetServers = function () {
        return this.servers
    };
    ServerManager.prototype.GetServerInfo = function (serverId) {
        if (typeof(this.serversById[serverId]) == 'object') {
            return this.serversById[serverId]
        } else {
            return null
        }
    };
    ServerManager.prototype.OnRefreshServersError = function () {
        if (this.listener) {
            this.listener.OnRefreshServersError(this)
        }
    };
    ServerManager.prototype.OnRefreshServersSuccess = function () {
        if (this.listener) {
            this.listener.OnRefreshServersSuccess(this)
        }
    };
    ServerManager.prototype.OnAddServer = function (server) {
        if (this.listener) {
            this.listener.OnAddServer(this, server)
        }
    };
    ServerManager.prototype.OnRemoveServer = function (server) {
        if (this.listener) {
            this.listener.OnRemoveServer(this, server)
        }
    };
    ServerManager.prototype.OnUpdateServer = function (server) {
        if (this.listener) {
            this.listener.OnUpdateServer(this, server)
        }
    };
    ServerManager.prototype.UpdateServers = function (serverList, includeDetails) {
        var serversById = {};
        for (var i = 0; i < serverList.length; ++i) {
            var serverInfo = serverList[i];
            var server = this.GetServerInfo(serverInfo.public_id);
            if (!server) {
                server = new ServerEntry()
            }
            server.ordinal = i;
            server.UpdateBasics(serverInfo);
            if (includeDetails) {
                server.UpdateDetails(serverInfo)
            }
            serversById[server.public_id] = server
        }
        var servers = [];
        var remove = [];
        var update = [];
        for (var index in this.serversById) {
            var oldServer = this.serversById[index];
            var newServer = serversById[index];
            if (typeof(newServer) != 'object') {
                remove.push(oldServer)
            } else {
                update.push(newServer);
                servers.push(newServer)
            }
        }
        for (var index in serversById) {
            var oldServer = this.serversById[index];
            var newServer = serversById[index];
            if (typeof(oldServer) != 'object') {
                update.push(newServer);
                servers.push(newServer)
            }
        }

        function SortServers(a, b) {
            if (a.ordinal == b.ordinal) {
                return 0
            } else if (a.ordinal < b.ordinal) {
                return -1
            } else {
                return 1
            }
        }
        servers.sort(SortServers);
        this.servers = servers;
        this.serversById = serversById;
        for (var i = 0; i < remove.length; ++i) {
            this.OnRemoveServer(remove[i])
        }
        for (var i = 0; i < update.length; ++i) {
            this.OnUpdateServer(update[i])
        }
    };
    ServerManager.prototype.RefreshServersSuccess = function (data) {
        var json = quakelive.Eval(data);
        if (!json || !json.servers) {
            this.OnRefreshServersError();
            return
        }
        this.UpdateServers(json.servers);
        this.OnRefreshServersSuccess()
    };
    ServerManager.prototype.RefreshServersError = function () {
        this.OnRefreshServersError()
    };
    ServerManager.prototype.RefreshServers = function (filter) {
        if (quakelive.IsGameRunning()) {
            return
        }
        if (typeof(filter) != 'object') {
            filter = this.DEFAULT_FILTER
        }
        var self = this;
        $.ajax({
            type: 'get',
            mode: 'abort',
            port: 'serverlist',
            url: '/home/matches/' + Base64.encode(JSON.stringify(quakelive.mod_home.filter)),
            success: function () {
                self.RefreshServersSuccess.apply(self, arguments)
            },
            error: function () {
                self.RefreshServersError.apply(self, arguments)
            }
        })
    };
    ServerManager.prototype.RefreshServerDetailsSuccess = function (data) {
        var json = quakelive.Eval(data);
        if (!json || !json.servers) {
            this.OnRefreshServersError();
            return
        }
        this.UpdateServers(json.servers);
        this.OnRefreshServersSuccess()
    };
    ServerManager.prototype.RefreshServerDetailsError = function () {};
    var defaultDetailsOptions = {
        'onSuccess': function () {},
        'onError': function () {},
        'cacheTime': 0
    };
    ServerManager.prototype.RefreshServerDetails = function (serverId, userOptions) {
        var options = $.extend({},
        defaultDetailsOptions, userOptions);
        var server = this.GetServerInfo(serverId);
        if (server) {
            var t = new Date().getTime();
            if (options.cacheTime != 0 && t - server.detailsTime <= 1000 * options.cacheTime) {
                options.onSuccess(server);
                return
            }
        } else {
            server = new ServerEntry();
            server.hidden = true;
            server.public_id = serverId;
            this.serversById[serverId] = server;
            this.servers.push(server)
        }
        var self = this;
        $.ajax({
            url: '/home/matchdetails/' + serverId,
            dataType: 'json',
            mode: 'abort',
            port: 'matchdetails',
            success: function (json) {
                if (typeof(json.map) == 'string') {
                    server.error = false;
                    server.UpdateBasics(json);
                    server.UpdateDetails(json);
                    self.OnUpdateServer(server);
                    options.onSuccess(server)
                } else {
                    server.error = true;
                    options.onError(server)
                }
            },
            error: function () {
                server.error = true;
                options.onError(server)
            }
        })
    };
    ServerManager.prototype.SaveFilter = function (filter) {
        var self = this;
        $.ajax({
            type: 'post',
            mode: 'abort',
            port: 'filterupdate',
            url: '/home/filter/update',
            data: {
                filter_obj: JSON.stringify(module.filter)
            },
            success: function () {
                self.SaveFilterSuccess.apply(self, arguments)
            },
            error: function () {
                self.SaveFilterError.apply(self, arguments)
            }
        })
    };
    ServerManager.prototype.SaveFilterSuccess = function (json) {
        this.OnSaveFilterSuccess()
    };
    ServerManager.prototype.SaveFilterError = function (json) {
        this.OnSaveFilterError()
    };
    ServerManager.LoadFilterSuccess = function (json) {};
    ServerManager.LoadFilterError = function () {};
    ServerManager.prototype.LoadFilter = function () {};
    ServerManager.ResetFilterSuccess = function (json) {
        this.OnResetFilterSuccess()
    };
    ServerManager.ResetFilterError = function () {
        this.OnResetFilterError()
    };
    quakelive.ServerManager = ServerManager;
    quakelive.ServerFilter = ServerFilter
})(jQuery);
(function ($) {
    var defaultProps = {
        'target': 'qlv_postlogin_matches',
        'max': 0
    };

    function ServerIconView() {
        this.lastServerCount = 0
    };
    ServerIconView.prototype.SetDisplayProps = function (props) {
        this.props = $.extend({},
        defaultProps, props)
    };
    ServerIconView.prototype.GetContainerNodeId = function () {
        return this.props.target
    };
    ServerIconView.prototype.GetServerNodeId = function (server) {
        return 'match_' + server.public_id
    };
    ServerIconView.prototype.UpdateServerNode = function (server, node) {
        var gametype = quakelive.GetGameTypeByID(server.game_type);
        var playerCountString;
        if (server.num_clients == 0) {
            if (server.g_needpass == 0) {
                playerCountString = 'Waiting For Players'
            } else {
                playerCountString = 'Waiting - Private'
            }
        } else {
            playerCountString = server.num_clients + '/' + server.max_clients + ' Players';
            if (server.g_needpass != 0) {
                playerCountString += ' - Private'
            }
        }
        var cityName, flagIcon;
        var loc = locdb.GetByID(server.location_id);
        if (loc) {
            cityName = loc.GetCityState();
            flagIcon = loc.GetFlagIcon()
        } else {
            cityName = 'QUAKE LIVE';
            flagIcon = '/images/flags3cc/usa.gif'
        }
        var skill = GetSkillRankInfo(server);
        node.html('<img src="' + quakelive.resource('/images/levelshots/lg/' + server.map.toLowerCase() + '.jpg') + '" alt="" width="165" height="124" class="thumb" />' + '<div class="qlv_inner_box">' + '<div class="gamelabel">' + server.host_name + '</div>' + '<img src="' + skill.img + '" class="gamerank" />' + '<img src="' + quakelive.resource('/images/gametypes/' + gametype.name + '_md.png') + '" class="gameicon"/>' + '<div class="players">' + playerCountString + '</div>' + '<img class="location_flag" src="' + quakelive.resource(flagIcon) + '" width="16" height="11" />' + '<div class="location_text">' + cityName + '</div>' + '</div>');
        if (server.ordinal < 3) {
            node.addClass('qlv_pls_bestpick_box');
            if (server.g_needpass == 0) {
                node.append('<img src="' + quakelive.resource('/images/sf/login/lbl_bestpick.png') + '" class="best_pick" />')
            }
        } else {
            node.addClass('qlv_pls_box');
            node.removeClass('qlv_pls_bestpick_box')
        }
        return node
    };
    ServerIconView.prototype.OnRefreshServersSuccess = function (manager) {
        quakelive.SendModuleMessage('OnServerListReload', manager);
        this.DisplayServerList(manager);
        this.SortServerList(manager)
    };
    ServerIconView.prototype.OnRemoveServer = function (manager, server) {
        var node = $('#' + this.GetServerNodeId(server));
        if (node.length > 0) {
            node.remove()
        }
    };
    ServerIconView.prototype.OnUpdateServer = function (manager, server) {
        if (server.hidden) {
            return
        }
        var node = $('#' + this.GetServerNodeId(server));
        if (node.length == 0) {
            var container = $('#' + this.GetContainerNodeId());
            node = $('<div id="' + this.GetServerNodeId(server) + '"></div>');
            quakelive.matchtip.BindMatchTooltip(node, server.public_id);
            container.append(node)
        }
        this.UpdateServerNode(server, node)
    };
    ServerIconView.prototype.DisplayServerList = function (manager) {
        var container = $('#' + this.GetContainerNodeId());
        if (this.lastServerCount == 0) {
            container.find('p').remove()
        }
        var servers = manager.GetServers();
        if (servers.length > 0) {
            for (var i = 0; i < servers.length; ++i) {
                var server = servers[i];
                var node = $('#' + this.GetServerNodeId(server));
                container.append(node)
            }
        } else {
            container.append('<p class="tc thirtyPxTxt sixtypxv midGrayTxt">No Games Available</p>');
            if (quakelive.siteConfig.realm == 'focus') {
                container.append('<p class="tc TwentyPxTxt midGrayTxt">A focus test may not be active at this time.<br />Please check the News Feed for scheduled test times.</p>')
            } else {
                container.append('<p class="tc TwentyPxTxt midGrayTxt">Check Your Customize Settings</p>')
            }
        }
        this.lastServerCount = servers.length
    };
    ServerIconView.prototype.SortServerList = function (manager) {
        var nodes = $('#' + this.GetContainerNodeId()).children();
        var servers = manager.GetServers();
        for (var i = 0; i < servers.length - 1; ++i) {
            var $node = $('#' + this.GetServerNodeId(servers[i]));
            var $node2 = $('#' + this.GetServerNodeId(servers[i + 1]));
            $node.after($node2)
        }
    };
    quakelive.ServerIconView = ServerIconView
})(jQuery);
(function ($) {
    var module = {};
    module.TITLE = 'Home';
    module.selectedServer = null;
    module.serverList = [];
    module.defaultFilter = '{"filters":{"group": "any", "game_type": "any", "arena": "any", "state": "any", "difficulty": "any", "location": "any", "private": 0 }, "arena_type": "", "players": [], "game_types": [], "ig": 0 }';
    module.savedFilter = {};
    module.filter = {};
    module.bHasCustomFilter = false;
    module.Tags = {
        NEW: 0,
        POPULAR: 1,
        SPACE: 2,
        TEAMARENA: 3,
        ASYMETRICCTF: 4,
        BEGINNER: 5,
        INTERMEDIATE: 6,
        ADVANCED: 7,
        SMALL: 10,
        MEDIUM: 11,
        LARGE: 12
    };
    module.GTFilters = {
        0: '{"GT":"any", "IG":0}',
        1: '{"GT":["CTF","CA","TDM"], "IG":0}',
        2: '{"GT":["DM"], "IG":0}',
        3: '{"GT":["CTF"], "IG":0}',
        4: '{"GT":["CA"], "IG":0}',
        5: '{"GT":["TDM"], "IG":0}',
        6: '{"GT":["TOURNEY"], "IG":0}',
        7: '{"GT":"any", "IG":1}'
    };
    module.waitHandle = null;
    module.refreshCount = 0;
    var SERVER_ERROR_REFRESH_TIMEOUT = 60;
    var SERVER_SUCCESS_REFRESH_TIMEOUT = 45;
    module.GameTypes = ['CA', 'CTF', 'TDM', 'TOURNEY', 'DM'];
    module.GetLayout = function () {
        if (quakelive.IsLoggedIn() || quakelive.pathParts[1] == 'advertise') {
            return 'postlogin'
        } else {
            return 'prelogin'
        }
    };
    quakelive.AddHook('OnModelIconChanged', function (cvar) {
        module.LoadModelIcon(cvar)
    });
    module.Init = function () {
        if (!quakelive.IsLoggedIn()) {
            module.DISPLAY = {
                friends: false
            }
        } else {
            module.DISPLAY = {
                friends: true
            };
            module.FetchFilter()
        }
        quakelive.AddHook('OnContentLoaded', module.Hook_OnContentLoaded);
        quakelive.AddHook('OnGameStarted', module.Hook_OnGameStarted);
        quakelive.AddHook('OnGameExited', module.Hook_OnGameExited)
    };
    module.FetchFilter = function () {
        var filter = quakelive.Eval(module.defaultFilter);
        var data = quakelive.userinfo['BROWSER_FILTER'];
        if (data.length > 0) {
            var userFilter = quakelive.Eval(data);
            if (typeof(userFilter) == 'object') {
                module.bHasCustomFilter = true;
                module.filter = $.extend(filter, userFilter);
                module.savedFilter = $.extend(filter, userFilter)
            } else {
                module.savedFilter = module.filter = filter
            }
        } else {
            module.savedFilter = module.filter = filter
        }
    };
    module.Hook_OnContentLoaded = function (targetModule) {
        if (targetModule != module) {
            module.StopMatchRefresh()
        }
    };
    module.OnLayoutLoaded = function () {
        if (quakelive.IsLoggedIn()) {
            module.LoadModelIcon(quakelive.cvars.Get("model"))
        }
        if (document.loginform && document.loginform.u) {
            document.loginform.u.focus()
        }
    };
    module.LoadModelIcon = function (cvar) {
        var info = ParseModelSkin(cvar.value);
        module.playericons = new PlayerIconSet(info.model, info.skin);
        quakelive.playericons = module.playericons;
        $('.nametag-icon').html(module.playericons.large);
        $('.nametag-body-md').css('background', 'url(' + quakelive.resource('/images/players/' + info.model + '/body_' + info.skin + '_md.png') + ') no-repeat')
    };
    module.ReloadServerList = function () {
        if (quakelive.IsLoggedIn() && !quakelive.IsGameRunning()) {
            module.ChangeSocialFilter(module.filter.filters.group);
            module.StopMatchRefresh();
            var DoRefresh = function () {
                quakelive.serverView.SetDisplayProps({
                    'target': 'qlv_postlogin_matches'
                });
                quakelive.serverManager.RefreshServers();
                module.waitHandle = setTimeout(DoRefresh, SERVER_SUCCESS_REFRESH_TIMEOUT * 1000)
            };
            DoRefresh()
        }
    };
    module.ShowMatches = function () {
        var list = module.serverList;
        var container = $('#qlv_postlogin_matches').empty();
        for (var matchIndex in list) {
            var server = list[matchIndex];
            if (server.node.parentNode) {
                server.node.remove()
            }
            container.append(server.node);
            matchIndex++
        }
        module.refreshCount++;
        if (list.length == 0) {
            container.append('<p class="tc thirtyPxTxt sixtypxv midGrayTxt">No Games Available</p>');
            if (quakelive.siteConfig.realm == 'focus') {
                container.append('<p class="tc TwentyPxTxt midGrayTxt">A focus test may not be active at this time. <br />Please check the News Feed for scheduled test times.</p>')
            } else {
                container.append('<p class="tc TwentyPxTxt midGrayTxt">Check Your Customize Settings</p>')
            }
        }
    };
    module.JoinServer = function (hostname) {
        join_server(hostname)
    };
    module.StopMatchRefresh = function () {
        if (module.waitHandle != null) {
            clearTimeout(module.waitHandle);
            module.waitHandle = null
        }
    };
    module.ShowContent = function (content) {
        quakelive.ShowContent(content);
        if (quakelive.IsLoggedIn()) {
            module.UpdateContentForDownloadState(qlXfer.currentGroup);
            module.InitFilters()
        }
        JoinURL.CheckForLogin();
        module.InitTips()
    };
    var tipIndex;
    var NUM_TIPS = 0;
    var TIPS = [];
    var tipWaitHandle;

    function FilterSocialChanged() {
        module.filter.filters.group = this.value;
        module.ChangeSocialFilter(this.value);
        UI_ChangeFilterLabel(this)
    }

    function FilterGameTypeChanged() {
        module.ChangeGameTypeFilter(this.value, true);
        UI_ChangeFilterLabel(this)
    }

    function FilterArenaChanged() {
        module.ChangeArenaFilter();
        UI_ChangeFilterLabel(this)
    }

    function FilterGameStateChanged() {
        module.filter.filters.state = this.value;
        UI_ChangeFilterLabel(this)
    }

    function FilterDifficultyChanged() {
        module.filter.filters.difficulty = this.value;
        UI_ChangeFilterLabel(this)
    }

    function FilterLocationChanged() {
        module.filter.filters.location = this.value;
        UI_ChangeFilterLabel(this)
    }

    function FilterBarChanged() {
        module.ReloadServerList();
        module.UpdateFilterURL(this.name, this.options.selectedIndex);
        module.UI_RefreshFilter()
    }

    function PrivateToggleClicked() {
        var checked = $("input[@name='private']").fieldValue()[0];
        module.UpdateFilterURL('private', checked);
        module.filter.filters['private'] = checked;
        module.ReloadServerList();
        module.UI_RefreshFilter()
    }

    function FilterSelected() {
        if (quakelive.HasParam(this.name)) {
            var userIndex = quakelive.params[this.name];
            if (userIndex < 0) {
                userIndex = 0
            } else if (userIndex >= this.options.length) {
                userIndex = this.options.length - 1
            }
            var userVal = this.options[userIndex].value;
            $(this).val(userVal);
            module.filter.filters[this.name] = userVal
        } else {
            $(this).val(module.filter.filters[this.name]);
            module.UpdateFilterURL(this.name, this.options.selectedIndex)
        }
        switch (this.name) {
        case "group":
            module.ChangeSocialFilter(module.filter.filters.group);
            break;
        case "game_type":
            module.ChangeGameTypeFilter(module.filter.filters.game_type, false);
            break;
        case "difficulty":
            module.ChangeDifficultyFilter();
            break;
        default:
            break
        }
        UI_ChangeFilterLabel(this)
    }
    module.filtersInitialized = false;
    module.InitFilters = function () {
        module.map_obj = quakelive.Eval($('#map_json').html()) || [];
        module.location_obj = quakelive.Eval($('#location_json').html()) || {};
        module.location_tag_obj = quakelive.Eval($('#location_tag_json').html()) || {};
        locdb.UpdateLocations(module.location_obj);
        module.InitLocationFilter();
        $('.filterbar_content select').unbind();
        $('#ctrl_filter_social').change(FilterSocialChanged);
        $('#ctrl_filter_gametype').change(FilterGameTypeChanged);
        $('#ctrl_filter_arena').change(FilterArenaChanged);
        $('#ctrl_filter_gamestate').change(FilterGameStateChanged);
        $('#ctrl_filter_difficulty').change(FilterDifficultyChanged);
        $('#ctrl_filter_location').change(FilterLocationChanged);
        $('.filterbar_content select').change(FilterBarChanged);
        $('input[@name="private"]').click(PrivateToggleClicked);
        $('.filterbar_content select').each(FilterSelected);
        var showPrivate;
        if (quakelive.HasParam('private')) {
            try {
                showPrivate = parseInt(quakelive.params['private'])
            } catch(e) {
                showPrivate = 0
            }
            module.filter.filters['private'] = showPrivate;
            module.ReloadServerList()
        } else {
            showPrivate = parseInt(module.filter.filters['private'] || 0);
            module.UpdateFilterURL('private', showPrivate)
        }
        if (showPrivate) {
            $('#privateServer').attr("checked", "checked")
        } else {
            $('#publicServer').attr("checked", "checked")
        }
        module.UI_RefreshFilter()
    };

    function UI_ChangeFilterLabel(node) {
        if (node.options.selectedIndex == 0) {
            $(node).parent(".filter_control").find("label").removeClass("selected")
        } else {
            $(node).parent(".filter_control").find("label").addClass("selected")
        }
    };
    module.ChangeSocialFilter = function (value) {
        module.filter.players = [];
        if (value == "friends") {
            var roster = quakelive.mod_friends.roster.fullRoster;
            for (var i = 0; i < roster.length; ++i) {
                if (roster[i].IsSubscribed() && roster[i].IsOnline()) {
                    module.filter.players.push(roster[i].name)
                }
            }
        }
    };
    module.ChangeGameTypeFilter = function (key, bChangeArena) {
        var gt;
        if (key != "any") {
            var gtf = quakelive.Eval(module.GTFilters[key]) || module.GTFilters[0];
            gt = gtf.GT;
            module.filter.ig = gtf.IG
        } else {
            gt = "any";
            module.filter.ig = 0
        }
        var opt = '';
        $('#ctrl_filter_arena > optgroup:last').empty();
        module.filter.game_types = [];
        if (gt == null || gt == "any") {
            for (var i in module.GameTypes) {
                for (var map in module.map_obj[module.GameTypes[i]].ARENAS) {
                    if (!$('#ctrl_filter_arena').containsOption(module.map_obj[module.GameTypes[i]].ARENAS[map].MAP_SYSNAME)) {
                        opt = '<option class="filter_map" value="' + module.map_obj[module.GameTypes[i]].ARENAS[map].MAP_SYSNAME + '">' + module.map_obj[module.GameTypes[i]].ARENAS[map].MAP_NAME + '</option>';
                        $('#ctrl_filter_arena > optgroup:last').append(opt);
                        opt = ''
                    }
                }
            }
        } else {
            for (var i in gt) {
                for (var map in module.map_obj[gt[i]].ARENAS) {
                    if (!$('#ctrl_filter_arena').containsOption(module.map_obj[gt[i]].ARENAS[map].MAP_SYSNAME)) {
                        opt = '<option class="filter_map" value="' + module.map_obj[gt[i]].ARENAS[map].MAP_SYSNAME + '">' + module.map_obj[gt[i]].ARENAS[map].MAP_NAME + '</option>';
                        $('#ctrl_filter_arena > optgroup:last').append(opt);
                        opt = ''
                    }
                }
                module.filter.game_types.push(module.map_obj[gt[i]].ENGINE_NUM)
            }
        }
        var o = $('#ctrl_filter_arena > optgroup:last').children();
        module.SortOptions(o);
        if (key == 0) {
            module.filter.filters.game_type = "any"
        } else {
            module.filter.filters.game_type = key
        }
        if (bChangeArena) {
            $('#ctrl_filter_arena').selectOptions("any");
            module.filter.filters.arena = "any";
            module.UpdateFilterURL("arena", 0)
        }
    };
    module.ChangeDifficultyFilter = function () {
        if (quakelive.userinfo.NEW_PLAYER && !module.bHasCustomFilter) {
            $('#ctrl_filter_difficulty').selectOptions("1");
            module.filter.filters.difficulty = 1
        }
    };
    module.ChangeArenaFilter = function () {
        var a = $('#ctrl_filter_arena').selectedOptions()[0];
        if ($(a).attr('class') == 'filter_tag') {
            module.filter.arena_type = 'tag'
        } else if ($(a).attr('class') == 'filter_map') {
            module.filter.arena_type = 'map'
        } else {
            module.filter.arena_type = ''
        }
        module.filter.filters.arena = a.value
    };
    module.InitLocationFilter = function () {
        var opt = '';
        for (var i in module.location_tag_obj.TAG) {
            if (!$('#ctrl_filter_location').containsOption(module.location_tag_obj.TAG[i])) {
                opt = '<option value="' + module.location_tag_obj.TAG[i] + '">' + module.location_tag_obj.TAG[i] + '</option>';
                $('#ctrl_filter_location > optgroup:first').append(opt)
            }
        }
        module.AppendLocationOptions($('#ctrl_filter_location'))
    };
    module.AppendLocationOptions = function ($target) {
        var html = '';
        for (var i in locdb.orderedCountries) {
            var locs = locdb.GetCountryLocations(locdb.orderedCountries[i]);
            var groupLabel = locs[0].countryAbbr;
            if (!locs[0].IsUSA()) {
                groupLabel += ' (' + locs[0].country + ')'
            }
            html += '<optgroup label="' + groupLabel + '">';
            for (var locIndex in locs) {
                var loc = locs[locIndex];
                var desc = '';
                if (!loc.IsUSA()) {
                    desc += loc.countryAbbr + ', '
                }
                desc += loc.GetCityState();
                if (loc.ordinal > 1) {
                    desc += ' #' + loc.ordinal
                }
                html += '<option value="' + loc.id + '">' + desc + '</option>';
                prevLoc = loc
            }
            html += '</optgroup>'
        }
        $target.append(html)
    };
    module.UpdateFilterURL = function (key, value) {
        if (value == 0) {
            quakelive.RemoveParam(key)
        } else {
            quakelive.AddParam(key, value)
        }
        quakelive.StopPathMonitor();
        var filters = quakelive.MergeParams(quakelive.params);
        if (filters.length > 0) {
            window.location.hash = quakelive.path + ';' + filters
        } else {
            window.location.hash = quakelive.path
        }
        quakelive.StartPathMonitor()
    };
    module.UI_RefreshFilter = function () {
        var ac = 0;
        $('.filterbar_content select').each(function (nodeIndex, node) {
            if (node.options.selectedIndex != 0) {
                ac++
            }
        });
        ac += $("input[@name='private']").fieldValue()[0];
        if (ac > 0) {
            $('.filterbar_notice').fadeIn()
        } else {
            $('.filterbar_notice').fadeOut()
        }
    };
    module.SortOptions = function (o) {
        var oL = o.length;
        var sortA = [];
        for (var i = 0; i < oL; i++) {
            sortA[i] = {
                'v': o[i].value,
                't': o[i].text
            }
        }
        sortA.sort(function (o1, o2) {
            var o1text = o1.t.toLowerCase(),
            o2text = o2.t.toLowerCase();
            if (o1text == o2text) {
                return 0
            } else {
                return o1text < o2text ? -1 : 1
            }
        });
        for (var i = 0; i < oL; i++) {
            o[i].text = sortA[i].t;
            o[i].value = sortA[i].v
        }
    };
    module.MatchContextMenuHandler = function (action, el, pos) {
        var serverInfo = el.data('info');
        switch (action) {
        case 'copy':
            qlPrompt({
                'input': true,
                'readonly': true,
                'alert': true,
                'title': 'Link to this match',
                'body': 'Use the URL below to link to this match directly.',
                'inputLabel': quakelive.siteConfig.baseUrl + '/r/home/join/' + serverInfo.public_id
            });
            break;
        case 'join':
            el.dblclick();
            break;
        case 'filter_map':
            module.filter.filters.arena = serverInfo.map;
            module.ReloadServerList();
            break;
        case 'filter_location':
            module.filter.filters.location = serverInfo.location_id;
            module.ReloadServerList();
            break;
        case 'filter_gametype':
            module.filter.filters.game_type = serverInfo.game_type;
            module.ReloadServerList();
            break;
        case 'filter_none':
            break;
        default:
            break
        }
    };
    module.InitContext = function () {
        if (!quakelive.siteConfig.showContextMenus) {
            return
        }
        var sel = $('.qlv_pls_box, .qlv_pls_bestpick_box');
        var objs = sel.contextMenu({
            'menu': 'serverContext',
            'inSpeed': 0,
            'outSpeed': 0
        },
        this.MatchContextMenuHandler)
    };
    module.InitTips = function () {
        if (!quakelive.IsLoggedIn()) {
            return
        }
        if (quakelive.userstatus == 'ACTIVE') {
            TIPS = ['tip_1.png', 'tip_2.png', 'tip_3.png', 'tip_4.png']
        } else {
            TIPS = ['tip_unreg_1.png', 'tip_1.png']
        }
        NUM_TIPS = TIPS.length;
        tipIndex = 0;
        quakelive.PreloadImages(quakelive.resource('/images/post_skill_match/tip_1.png'), quakelive.resource('/images/post_skill_match/btn_practice_off.png'), quakelive.resource('/images/post_skill_match/btn_practice_on.png'), quakelive.resource('/images/post_skill_match/btn_left_off.png'), quakelive.resource('/images/post_skill_match/btn_left_on.png'), quakelive.resource('/images/post_skill_match/btn_rt_off.png'), quakelive.resource('/images/post_skill_match/btn_rt_on.png'));
        $('.downloadingTip').fadeOut(0);
        module.ShowTip()
    };
    module.ShowTip = function () {
        if (!$('#postlogin_dataloading,#postlogin_unregistered').is(':visible')) {
            return
        }
        if (tipWaitHandle) {
            clearTimeout(tipWaitHandle);
            tipWaitHandle = null
        }
        $('.downloadingTip').fadeOut(function () {
            $(this).css('background', 'url(' + quakelive.resource('/images/post_skill_match/' + TIPS[tipIndex]) + ') no-repeat 0 0').fadeIn();
            var nextTipIndex = (tipIndex + 1) % NUM_TIPS;
            quakelive.PreloadImages(quakelive.resource('/images/post_skill_match/' + TIPS[nextTipIndex]))
        });
        tipWaitHandle = setTimeout(module.NextTip, 30 * 1000)
    };
    module.NextTip = function () {
        if (++tipIndex >= NUM_TIPS) {
            tipIndex = 0
        }
        module.ShowTip()
    };
    module.PrevTip = function () {
        if (--tipIndex < 0) {
            tipIndex = NUM_TIPS - 1
        }
        module.ShowTip()
    };
    module.GotoOnlineGames = function () {
        quakelive.cvars.Set("web_skipLauncher", "1", true);
        quakelive.Goto('home')
    };
    module.GotoOfflineGames = function () {
        quakelive.cvars.Set("web_skipLauncher", "1", true);
        quakelive.Goto('practice')
    };
    module.UpdateContentForDownloadState = function (group) {
        if (quakelive.userstatus != 'ACTIVE') {
            $('#postlogin_init').hide();
            $('#postlogin_unregistered').show();
            quakelive.mod_register.OnDownloadGroup({
                'group': group
            });
            return
        }
        var allClasses = 'post_state_min post_state_base post_state_extra';
        var stateMap = {};
        stateMap[GROUP_MINIMUM] = 'post_state_min';
        stateMap[GROUP_BASE] = 'post_state_base';
        stateMap[GROUP_EXTRA] = 'post_state_extra';
        stateMap[GROUP_DONE] = 'post_state_extra';
        var obj = $('.post_state').removeClass(allClasses).addClass(stateMap[group]);
        if (qlXfer.totalDownloads > 0 || (group == GROUP_DONE && !quakelive.cvars.GetIntegerValue("web_skipLauncher"))) {
            $('#postlogin_init').hide();
            $('#postlogin_dataloading').show();
            $('.tipsline').show();
            $('#btn_customize').hide();
            $('#btn_playonline').removeClass('selected')
        }
        switch (group) {
        case GROUP_MINIMUM:
            break;
        case GROUP_BASE:
            $('.bigbtn_left,.topbtn_play').click(function () {
                var cmdString = "+set bot_dynamicSkill 1 +set com_backgroundDownload 1 +set sv_quitOnExitLevel 1 +set g_gametype 0 +set fraglimit 15 +set timelimit 10 +set bot_startingSkill 2 +map qzwarmup +wait +addbot trainer 2";
                LaunchGame(BuildCmdString() + cmdString, true)
            });
            break;
        case GROUP_EXTRA:
            JoinURL.CheckForJoin();
        case GROUP_DONE:
            if (quakelive.cvars.GetIntegerValue("web_skipLauncher")) {
                if (quakelive.activeModule == module && !$('#postlogin_dataready').is(':visible')) {
                    $('#postlogin_init').hide();
                    $('#postlogin_dataloading').hide();
                    $('#postlogin_dataready').show();
                    $('.tipsline').hide();
                    $('#btn_customize').show();
                    module.ReloadServerList()
                }
                break
            }
            $('#postlogin_dataloading .filterbar').show();
            $('#hidetips').change(function () {
                SetCvar("web_skipLauncher", this.checked ? 1 : 0)
            });
            $('.bigbtn_desc').fadeIn();
            $('.bigbtn_left').css('display', 'none').fadeIn().unbind().hover(function () {
                $('#btn_playonline').addClass('forceNavHover')
            },
            function () {
                $('#btn_playonline').removeClass('forceNavHover')
            }).click(function () {
                module.GotoOnlineGames();
                $('.bigbtn_desc').hide()
            });
            $('.bigbtn_right').css('display', 'none').fadeIn().unbind().hover(function () {
                $('#btn_practice').addClass('forceNavHover')
            },
            function () {
                $('#btn_practice').removeClass('forceNavHover')
            }).click(function () {
                module.GotoOfflineGames();
                $('.bigbtn_desc').hide()
            });
            $('.btn_online_games').unbind().hover(function () {
                $('.bigbtn_left').addClass('forced_active_bigbtn')
            },
            function () {
                $('.bigbtn_left').removeClass('forced_active_bigbtn')
            });
            $('.btn_offline_games').unbind().hover(function () {
                $('.bigbtn_right').addClass('forced_active_bigbtn')
            },
            function () {
                $('.bigbtn_right').removeClass('forced_active_bigbtn')
            });
            break
        }
    };
    module.OnDownloadGroup = function (params) {
        if (params.group == GROUP_MINIMUM) {
            var CURRENT_WEBCONFIG_VERSION = 4;
            var webConfig = quakelive.cvars.Get("web_configVersion");
            if (webConfig.value < 1) {
                var screen = [$(window).width(), $(window).height()];
                var padding = [310, 130];
                if (screen[0] >= 1024 + padding[0] && screen[1] >= 768 + padding[1]) {
                    quakelive.cvars.Set("r_inBrowserMode", 12)
                } else if (screen[0] >= 800 + padding[0] && screen[1] >= 600 + padding[1]) {
                    quakelive.cvars.Set("r_inBrowserMode", 9)
                } else {
                    quakelive.cvars.Set("r_inBrowserMode", 5)
                }
                SetCvar("web_configVersion", 1)
            }
            if (webConfig.value < 2) {
                SetBind("F3", "readyup");
                SetBind("h", "+chat");
                SetCvar("web_configVersion", 2)
            }
            if (webConfig.value < 4) {
                SetCvar("m_filter", 0);
                SetCvar("web_configVersion", 4)
            }
            if (webConfig.value < 5) {
                SetCvar("cg_hitBeep", 1);
                SetCvar("web_configVersion", 5)
            }
        } else if (params.group == GROUP_BASE) {} else if (params.group == GROUP_EXTRA) {}
        module.UpdateContentForDownloadState(params.group)
    };
    module.OnOverlayLoaded = function (params) {
        if (params[0] == 'home' && params[1] == 'crashed') {
            var crashReport = qz_instance.GetCrashReport();
            $('#crashed-report').val(crashReport)
        }
    };
    module.Hook_OnGameStarted = function () {
        module.StopMatchRefresh()
    };
    module.Hook_OnGameExited = function (code) {
        if (quakelive.activeModule == module) {
            module.ReloadServerList()
        }
    };
    module.ShowServerListError = function (msg) {
        $('#qlv_postlogin_matches').html('<p class="tc thirtyPxTxt sixtypxv midGrayTxt">Unable to load the server list</p>' + '<p class="tc TwentyPxTxt midGrayTxt">' + msg + '</p>' + '<p class="tc TwentyPxTxt midGrayTxt">Please try again in a few minutes&hellip;</p>');
        module.StopMatchRefresh();
        module.waitHandle = setTimeout(module.ReloadServerList, SERVER_ERROR_REFRESH_TIMEOUT * 1000)
    };
    module.StartWarmupGame = function () {
        if (qlXfer.currentGroup < GROUP_BASE) {
            return
        }
        quakelive.mod_offlinegame.ReplayTrainingGame()
    };
    module.ToggleFilterBar = function () {
        var node = $('#postlogin_dataready .filterbar');
        var expanded = node.hasClass('filterbar_expanded');
        var curHeight = $('#qlv_postlogin_matches').height();
        if (expanded) {
            var h = node.height();
            node.removeClass('filterbar_expanded');
            $('#qlv_postlogin_matches').css('height', (curHeight + h) + 'px');
            $('.filterbar_toggle').removeClass('selected')
        } else {
            node.addClass('filterbar_expanded');
            $('#qlv_postlogin_matches').css('height', (curHeight - node.height()) + 'px');
            $('.filterbar_toggle').addClass('selected')
        }
    };
    module.ResetBrowserFilter = function () {
        var msg = "Are you sure you want to reset to the default online games view?";
        if (confirm(msg)) {
            $.ajax({
                type: 'get',
                url: '/home/filter/reset',
                mode: 'abort',
                port: 'filterreset',
                success: module.ResetBrowserFilter_Success,
                error: module.ResetBrowserFilter_Error
            })
        }
    };
    module.ResetBrowserFilter_Success = function () {
        $('.filterbar_content select').each(function (nodeIndex, node) {
            node.options.selectedIndex = 0;
            quakelive.RemoveParam(this.name);
            UI_ChangeFilterLabel(this)
        });
        $('#publicServer').attr("checked", "checked");
        $('.filterbar_notice').fadeOut();
        quakelive.StopPathMonitor();
        window.location.hash = "home";
        quakelive.StartPathMonitor();
        module.filter = quakelive.Eval(module.defaultFilter);
        module.ReloadServerList()
    };
    module.ResetBrowserFilter_Error = function () {};
    module.SaveBrowserFilter = function () {
        $.ajax({
            type: 'post',
            url: '/home/filter/update',
            mode: 'abort',
            port: 'filterupdate',
            dataType: 'json',
            data: 'filter_obj=' + JSON.stringify(module.filter),
            success: module.SaveBrowserFilter_Success,
            error: module.SaveBrowserFilter_Error
        })
    };
    module.SaveBrowserFilter_Success = function (json) {
        var modCount = 0;
        $('.filterbar_content select').each(function (nodeIndex, node) {
            if (node.options.selectedIndex != 0) modCount++
        });
        $('.filterbar_notice > a').text('View has been saved.');
        setTimeout(function () {
            $('.filterbar_notice > a').text('This view has been customized.')
        },
        5 * 1000);
        if (modCount > 0) {
            $('.filterbar_notice').fadeIn()
        } else {
            $('.filterbar_notice').fadeOut()
        }
        module.ToggleFilterBar();
        module.savedFilter = module.filter
    };
    module.SaveBrowserFilter_Error = function (xmlobj, msg, e) {};
    var tourOverlay = null;
    module.ShowTour = function () {
        if (!tourOverlay) {
            var options = {
                modal: true,
                overlay: 75
            };
            tourOverlay = $(module.TPL_TOUR_OVERLAY).appendTo('body').jqm(options)
        }
        tourOverlay.jqmShow()
    };
    quakelive.RegisterModule('home', module)
})(jQuery);
(function ($) {
    var module = {};
    module.TITLE = 'News';
    module.GetLayout = function () {
        return 'postlogin'
    };
    module.ShowContent = function (c) {
        quakelive.ShowContent(c);
        var section;
        if (quakelive.pathParts.length > 1) {
            section = quakelive.pathParts[1]
        } else {
            section = 'site_news'
        }
        $('.qlv_newsNav .selected').removeClass('selected');
        $('.qlv_newsNav .nav_' + section).addClass('selected');
        if (addthis) {
            addthis.button('.addthis_button')
        }
    };
    quakelive.RegisterModule('news', module)
})(jQuery);
(function ($) {
    var module = {};
    module.keyboardNode = null;
    module.overlayNode = null;
    module.Init = function () {
        window.OnInputEvent = module.OnInputEvent;
        module.keyboardNode = $(module.TPL_KEYBOARD);
        module.overlayNode = $(module.TPL_OVERLAY_CONTAINER)
    };
    module.OnDownloadGroup = function (params) {
        if (params.group == GROUP_MINIMUM) {
            quakelive.cvars.LoadHardwareCvars()
        }
    };
    module.LoadConfigPage = function () {
        module.Nav('character')
    };
    module.LoadModels_Error = function () {
        $('#character_list').html("<div style='width: 200px; height: 200px; margin: 0 auto; text-align: center'>Failed to load model list.<br /><div style='cursor: pointer' onclick='quakelive.mod_prefs.LoadModels(); return false'>Click here to reload the list.</div></div>")
    };
    module.LoadModels_Success = function (json) {
        if (json.ECODE == 0) {
            var count = 0;
            var container = $('#character_list').empty();
            var row = $('<div></div>');
            module.models = json;
            var modelskin = quakelive.cvars.Get("model", "sarge/default").value.toLowerCase().split("/");
            var selIndex = 0;
            var selModel, selSkin;
            if (modelskin.length == 1) {
                selModel = modelskin[0];
                selSkin = 'default'
            } else {
                selModel = modelskin[0];
                selSkin = modelskin[1];
                if (selSkin == 'red' || selSkin == 'blue') {
                    selSkin = 'default'
                }
            }
            for (var modelIndex in json.MODELS) {
                var model = json.MODELS[modelIndex];
                if (model.SKIN == 'red' || model.SKIN == 'blue') {
                    continue
                }
                if (model.MODEL == selModel && model.SKIN == selSkin) {
                    selIndex = modelIndex
                }
                if (row.size() > 8) {
                    container.append(row);
                    row = $('<div></div>')
                }
                row.append("<a id='cfg_model_" + modelIndex + "' href='javascript:;' onclick='quakelive.mod_prefs.SelectPlayerModel(" + modelIndex + "); return false'><img src='" + quakelive.resource("/images/players/icon_md/" + model.MODEL + "_" + model.SKIN + ".jpg") + "' /></a>")
            }
            container.append(row);
            module.SelectPlayerModel(selIndex, modelskin[1])
        } else {
            module.LoadModels_Error()
        }
    };
    module.LoadModels = function () {
        if (module.models) {
            module.LoadModels_Success(module.models);
            return
        }
        $.ajax({
            url: '/prefs/listmodels',
            mode: 'abort',
            port: 'listmodels',
            type: 'post',
            dataType: 'json',
            error: module.LoadModels_Error,
            success: module.LoadModels_Success
        })
    };
    var lastColorNodes = {};
    module.SelectColor = function (cvarName, num) {
        if (lastColorNodes[cvarName]) {
            lastColorNodes[cvarName].removeClass('selected')
        }
        lastColorNodes[cvarName] = $('#' + cvarName + '_' + num);
        lastColorNodes[cvarName].addClass('selected');
        SetCvar(cvarName, num)
    };
    module.InitColors = function () {
        for (var i = 0; i < 2; ++i) {
            var cvarName = 'color' + (i + 1);
            lastColorNodes[cvarName] = $('#' + cvarName + '_' + quakelive.cvars.Get(cvarName, '1').value);
            lastColorNodes[cvarName].addClass('selected')
        }
    };
    var lastCrosshairNode = null;
    module.SelectCrosshair = function (crosshairNum) {
        if (lastCrosshairNode) {
            lastCrosshairNode.removeClass('selected')
        }
        lastCrosshairNode = $('#crosshair_' + crosshairNum);
        lastCrosshairNode.addClass('selected');
        SetCvar('cg_drawCrosshair', crosshairNum)
    };
    module.InitCrosshairs = function () {
        var cvar = quakelive.cvars.Get('cg_drawCrosshair', '1');
        lastCrosshairNode = $('#crosshair_' + cvar.value);
        lastCrosshairNode.addClass('selected')
    };
    module.SelectPlayerModel = function (modelIndex, forceSkin) {
        var modelInfo = module.models.MODELS[modelIndex];
        var modelskin = modelInfo.MODEL + '/' + modelInfo.SKIN;
        var displaySkin = forceSkin || modelInfo.SKIN;
        var cmpParts = quakelive.cvars.Get('model').value.toLowerCase().split("/");
        if (!cmpParts) {
            cmpParts = ['sarge', 'default']
        } else if (cmpParts.length == 1) {
            cmpParts[1] = 'default'
        } else {
            if (cmpParts[1] == 'red' || cmpParts[1] == 'blue') {
                cmpParts[1] = 'default'
            }
        }
        if (modelskin != cmpParts.join('/')) {
            SetCvar('model', modelskin)
        }
        var details = module.models.DETAILS[modelInfo.DETAILS_ID] || {
            RACE: '',
            DESC: ''
        };
        $('#character_list').find('.selected').removeClass('selected');
        $('#cfg_model_' + modelIndex).addClass('selected');
        if (modelInfo.SKIN == 'default' || modelInfo.SKIN == 'blue' || modelInfo.SKIN == 'red' || modelInfo.SKIN == 'sport' || modelInfo.SKIN == 'bright') {
            $('#cfg_char_name').css("background", "transparent url(" + quakelive.resource("/images/player_names/" + modelInfo.MODEL + ".png") + ") no-repeat left top")
        } else {
            $('#cfg_char_name').css("background", "transparent url(" + quakelive.resource("/images/player_names/" + modelInfo.NAME + ".png") + ") no-repeat left top")
        }
        $('#cfg_char_race').css("background", "url(" + quakelive.resource("/images/player_races/" + details.RACE + ".png") + ") no-repeat left top");
        $('#cfg_char_description').html(details.DESC);
        $('#cfg_char_body').css('background', "url('" + quakelive.resource("/images/players/body_lg/" + modelInfo.MODEL + "_" + displaySkin + ".png") + "') no-repeat 0 0").css('behavior', 'url(/js/iepngfix.htc)');
        $('#cfg_char_redteam').html("<div class='interactive' style='width: 116px; height: 100px; background: url(" + quakelive.resource("/images/players/body_sm/" + modelInfo.MODEL + "_red.png") + ") center top no-repeat; _behavior: url(/js/iepngfix.htc);'></div>").unbind('click').click(function () {
            module.SelectPlayerModel(modelIndex, "red");
            SetCvar('model', modelInfo.MODEL + '/red')
        });
        $('#cfg_char_blueteam').html("<div class='interactive' style='width: 116px; height: 100px; background: url(" + quakelive.resource("/images/players/body_sm/" + modelInfo.MODEL + "_blue.png") + ") center top no-repeat; _behavior: url(/js/iepngfix.htc);'></div>").unbind('click').click(function () {
            module.SelectPlayerModel(modelIndex, "blue");
            SetCvar('model', modelInfo.MODEL + '/blue')
        });
        $('#cfg_char_lgicon').css('background', "url('" + quakelive.resource("/images/players/icon_xl/" + modelInfo.MODEL + "_" + modelInfo.SKIN + ".jpg") + "') no-repeat 0 0").unbind('click').click(function () {
            module.SelectPlayerModel(modelIndex);
            SetCvar('model', modelskin)
        });
        quakelive.SendModuleMessage('OnCharacterChanged', modelIndex)
    };
    var bind_sections = {
        'controls_movement': [
            ['+forward', '+back', '+moveleft', '+moveright'],
            ['+moveup', '+movedown', '+speed', 'centerview']],
        'controls_actions': [
            ['+attack', 'weapnext', 'weapprev', '+zoom', '+button2'],
            ['messagemode', 'messagemode2', '+button3', 'dropweapon', 'dropflag']],
        'controls_weapons': [
            ['weapon 1', 'weapon 2', 'weapon 3', 'weapon 4', 'weapon 5', 'weapon 6'],
            ['weapon 7', 'weapon 8', 'weapon 9', 'weapon 11', 'weapon 12', 'weapon 13']]
    };
    module.OnInputEvent = function (keyName) {
        if (keyName != 'ESCAPE') {
            if (keyName == 'BACKSPACE') {
                if (module.targetBindKey !== undefined) {
                    quakelive.binds.Remove(module.targetBindKey, true)
                }
            } else {
                quakelive.binds.Bind(keyName, module.targetBindAction)
            }
            quakelive.cfgUpdater.Commit()
        }
        module.targetBindKey = module.targetBindKey2 = module.targetBindAction = null;
        module.ShowKeyboard();
        module.ShowBinds(module.selectedNav);
        $('#qlv_site_popup').hide()
    };
    module.ShowBindPopup = function (bind) {
        var key = null;
        if (bind.keys[0] && bind.keys[1]) {
            key = '<span class="orangeTxt twentyfourPxTxt"><b>' + bind.keys[0].toUpperCase() + '</b> and <b>' + bind.keys[1].toUpperCase() + '</b></span>'
        } else if (bind.keys[0]) {
            key = '<span class="orangeTxt twentyfourPxTxt"><b>' + bind.keys[0].toUpperCase() + '</b></span>'
        } else {
            key = null
        }
        if (bind.keys.length > 0) {
            key = '<span class="orangeTxt twentyfourPxTxt"><b>' + bind.keys.join(', ').toUpperCase() + '</b></span>'
        }
        module.targetBindKey = bind.keys[0];
        module.targetBindKey2 = bind.keys[1];
        module.targetBindAction = bind.action;
        var html = '<div id="assignKeyBox">' + '<div class="tc twentyfourPxTxt" id="assignKeyInfo">Press your desired key or button for <span class="orangeTxt twentyfourPxTxt">"' + bind.name + '"</span>' + '<br />' + '<br />' + '<p class="TwentyPxTxt">' + (key ? ('Current assignment: ' + key) : '') + '</p>' + '</div>' + '<div id="escapeText">Press <span class="bold">ESCAPE</span> to cancel or <span class="bold">BACKSPACE</span> to clear this binding.</div>' + '</div>';
        $('#qlv_site_popup').html(html).css('z-index', 99999).show();
        qz_instance.CaptureNextInputEvent()
    };
    module.StartBinding = function (action) {
        var bind = quakelive.binds.Get(action);
        if (bind) {
            module.ShowBindPopup(bind)
        }
    };
    module.keyNameToCSS = {};
    module.HighlightBindsOnOtherPages = function (skipId) {
        for (var sectionIndex in bind_sections) {
            if (sectionIndex == skipId) {
                continue
            }
            for (var i = 0; i < 2; ++i) {
                var binds = bind_sections[sectionIndex][i];
                for (var bindIndex in binds) {
                    var bindAction = binds[bindIndex];
                    var bind = quakelive.binds.Get(bindAction);
                    if (bind.keys[0]) {
                        var mappedKey = module.keyNameToCSS[bind.keys[0]] || bind.keys[0].toUpperCase();
                        $('#qlv_keyboard').find('.key_' + mappedKey).addClass('boundOtherPage')
                    }
                    if (bind.keys[1]) {
                        var mappedKey = module.keyNameToCSS[bind.keys[1]] || bind.keys[1].toUpperCase();
                        $('#qlv_keyboard').find('.key_' + mappedKey).addClass('boundOtherPage')
                    }
                }
            }
        }
    };
    module.ShowBindSection = function (id, binds) {
        var html = "";
        for (var bindIndex in binds) {
            var bindAction = binds[bindIndex];
            var bind = quakelive.binds.Get(bindAction);
            var keyString = null;
            var len = bind.keys.length;
            if (len === 0) {
                keyString = "&nbsp;"
            } else if (len === 1) {
                keyString = bind.keys[0].toUpperCase()
            } else if (len >= 2) {
                keyString = bind.keys[len - 1].toUpperCase() + ' or ' + bind.keys[len - 2].toUpperCase()
            }
            if (len > 2) {
                keyString += ' (+' + (len - 2) + ' more)'
            }
            html += '<div class="row">' + '<div class="medlong fl twentypxh middleAlign">' + bind.name + '</div>' + '<div class="fl middleAlign" style="cursor: pointer; width: 180px;" onclick="quakelive.mod_prefs.StartBinding(\'' + bind.action + '\', this); return false">' + keyString + '</div>' + '<div class="cl"></div>' + '</div>';
            if (bind.keys[0]) {
                var mappedKey = module.keyNameToCSS[bind.keys[0]] || bind.keys[0].toUpperCase();
                $('#qlv_keyboard').find('.key_' + mappedKey).addClass('boundThisPage')
            }
            if (bind.keys[1]) {
                var mappedKey = module.keyNameToCSS[bind.keys[1]] || bind.keys[1].toUpperCase();
                $('#qlv_keyboard').find('.key_' + mappedKey).addClass('boundThisPage')
            }
        }
        $('#' + id).html(html)
    };
    module.ShowBinds = function (id) {
        module.ShowBindSection(id + '_binds0', bind_sections[id][0]);
        module.ShowBindSection(id + '_binds1', bind_sections[id][1]);
        module.HighlightBindsOnOtherPages(id)
    };
    module.ShowKeyboard = function () {
        module.keyboardNode.remove().appendTo($('.keyboard_container'));
        $('#qlv_keyboard').find('.boundThisPage,.boundOtherPage').removeClass('boundThisPage').removeClass('boundOtherPage')
    };
    module.Nav = function (where) {
        var tpl = '';
        var container = $('#configContainer');
        switch (where) {
        case 'character':
            container.html(module.TPL_CHARACTER);
            module.LoadModels();
            break;
        case 'settings_basic':
            container.html(module.TPL_SETTINGS_BASIC);
            module.InitColors();
            module.InitCrosshairs();
            module.InitSlider('s_volume', 0, 1, 0.1, 20, function (value) {
                $('#effects_volume_value').text(parseInt(value * 100) + '%')
            });
            module.InitSlider('s_musicvolume', 0, 1, 0.1, 20, function (value) {
                $('#music_volume_value').text(parseInt(value * 100) + '%')
            });
            module.InitSlider('r_gamma', 0, 2, 0.1, 50, function (value) {
                $('#brightness_value').text(parseInt(value * 100) + '%')
            });
            module.InitYesNo('r_fullscreen');
            module.InitYesNo('cg_autoswitch');
            module.InitSelect('r_mode', [0, '320x240', 1, '400x300', 2, '512x384', 3, '640x360', 4, '640x400', 5, '640x480', 6, '800x450', 7, '852x480', 8, '800x500', 9, '800x600', 10, '1024x640', 11, '1024x576', 12, '1024x768', 13, '1152x864', 14, '1280x720', 15, '1280x768', 16, '1280x800', 17, '1280x1024', 18, '1440x900', 19, '1600x900', 20, '1600x1000', 21, '1680x1050', 22, '1600x1200', 23, '1920x1080', 24, '1920x1200', 25, '1920x1440', 26, '2048x1536', 27, '2560x1600', -2, 'Maximum']);
            module.InitSelect('r_inbrowsermode', [5, '640x480', 9, '800x600', 12, '1024x768']);
            break;
        case 'settings_advanced':
            container.html(module.TPL_SETTINGS_ADVANCED);
            module.InitYesNo('s_doppler');
            module.InitYesNo('cg_drawtargetnames');
            module.InitYesNo('cg_playvoicechats');
            module.InitYesNo('cg_showvoicetext');
            module.InitYesNo('cg_allowtaunt');
            module.InitYesNo('r_ext_compressed_textures');
            module.InitSelect('r_texturemode', ['GL_LINEAR_MIPMAP_NEAREST', 'Bilinear', 'GL_LINEAR_MIPMAP_LINEAR', 'Trilinear']);
            module.InitSelect('r_picmip', [2, 'Low', 1, 'Normal', 0, 'High']);
            module.InitSelect('r_lodbias', [2, 'Low', 1, 'Medium', 0, 'High']);
            module.InitSelect('r_vertexlight', [1, 'Vertex', 0, 'Lightmap']);
            module.InitSlider('cg_fov', 75, 130, 1, 1, function (value) {
                $('#fov_value').text(value + ' degrees')
            });
            break;
        case 'controls_actions':
            container.html(module.TPL_CONTROLS_ACTIONS);
            module.ShowKeyboard();
            module.ShowBinds(where);
            break;
        case 'controls_movement':
            container.html(module.TPL_CONTROLS_MOVEMENT);
            module.ShowKeyboard();
            module.ShowBinds(where);
            break;
        case 'controls_weapons':
            container.html(module.TPL_CONTROLS_WEAPONS);
            module.ShowKeyboard();
            module.ShowBinds(where);
            break;
        case 'controls_mouse':
            container.html(module.TPL_CONTROLS_MOUSE);
            module.ShowKeyboard();
            module.InitYesNo('m_pitch', [-0.022, 0.022]);
            module.InitSlider('sensitivity', 0, 10, 1, 10, function (value) {
                $('#mouse_sens_value').text(value)
            });
            break
        }
        module.selectedNav = where
    };
    module.InitSlider = function (cvarName, min, max, step, scale, fnChange) {
        var cvar = quakelive.cvars.Get(cvarName);
        var node = $('#slider_' + cvarName);
        scale = scale || 100;
        step = step || 1;
        node.slider({
            'min': {
                "x": min * scale
            },
            'max': {
                "x": max * scale
            },
            'stepping': {
                "x": step
            },
            'startValue': scale * cvar.value,
            'change': function (e, ui) {
                SetCvar(cvarName, ui.value / scale);
                if (fnChange) {
                    fnChange(ui.value / scale)
                }
            }
        });
        if (fnChange) {
            fnChange(cvar.value)
        }
    };
    module.InitSelect = function (cvarName, options) {
        var cvar = quakelive.cvars.Get(cvarName);
        var node = $('#select_' + cvarName).empty();
        for (var i = 0; i < options.length; i += 2) {
            var opt = $('<option value="' + options[i] + '">' + options[i + 1] + '</option>');
            if (options[i] == cvar.value) {
                opt.attr('selected', 'selected')
            }
            node.append(opt)
        }
        node.change(function () {
            SetCvar(node.attr('name'), node.val())
        })
    };
    module.InitYesNo = function (cvarName, values) {
        var cvar = quakelive.cvars.Get(cvarName);
        if (!values) {
            values = [1, 0]
        }
        var node = $('#' + cvarName);
        var isOnChecked = (cvar.value != values[1]);
        node.empty();
        node.append("On ");
        var html;
        html = "<input type=\"radio\" name=\"" + cvarName.toLowerCase() + "\" value=\"1\" ";
        if (isOnChecked) {
            html += " checked=\"checked\" "
        }
        html += " onclick=\"SetCvar('" + cvarName + "', '" + values[0] + "')\" ";
        html += " />";
        node.append(html);
        node.append(" &nbsp;&nbsp; ");
        node.append("Off ");
        html = "<input type=\"radio\" name=\"" + cvarName.toLowerCase() + "\" value=\"0\" ";
        if (!isOnChecked) {
            html += " checked=\"checked\" "
        }
        html += " onclick=\"SetCvar('" + cvarName + "', '" + values[1] + "')\" ";
        html += " />";
        node.append(html)
    };
    module.ResetDefaults = function () {
        if (!confirm("This will reset ALL options to their default values. Are you sure you want to continue?")) {
            return
        }
        qz_instance.SetHardwareCvars("");
        jQuery.ajax({
            cache: false,
            url: "/prefs/reset",
            success: function (html) {
                quakelive.PageRedirect('/user/login_redirect')
            },
            error: function (request, errorType, errorException) {},
            complete: function (request, completionType) {}
        })
    };
    module.overlayVisible = false;
    module.ShowOverlay = function () {
        module.CloseOverlay();
        module.overlayNode.css('position', 'absolute');
        module.overlayNode.css('z-index', '10001');
        var container = $('#qlv_OverlayContent');
        container.append(module.overlayNode);
        module.overlayVisible = true;
        module.LoadConfigPage()
    };
    module.CloseOverlay = function () {
        if (module.overlayVisible) {
            module.overlayNode.remove();
            module.overlayVisible = false
        }
    };
    quakelive.RegisterModule('prefs', module)
})(jQuery);
(function ($) {
    var module = {};
    module.GetLayout = function () {
        if (quakelive.path == "register") {
            return 'prelogin'
        } else if (quakelive.IsLoggedIn()) {
            return 'postlogin_bare'
        } else {
            return 'bare'
        }
    };
    module.Init = function () {
        quakelive.PreloadClasses('dl-subtitle-check', 'dl-subtitle-min', 'dl-subtitle-base', 'dl-subtitle-done', 'dl-subtitle-extra', 'dl-btn-play-off', 'dl-btn-play-on')
    };
    module.FocusField = function () {
        var helpNode = $('#help_' + this.id);
        if (helpNode.find('.error').size() == 0) {
            helpNode.addClass('grayBack').addClass('grayBorder').removeClass('transBorder').removeClass('transBack').find('.help').show()
        }
    };
    module.BlurField = function () {
        var helpNode = $('#help_' + this.id);
        if (helpNode.find('.error').size() == 0) {
            helpNode.removeClass('grayBack').removeClass('grayBorder').addClass('transBack').addClass('transBorder').find('.help').hide()
        }
    };
    module.ShowContent = function (content) {
        quakelive.ShowContent('');
        $('#qlv_OverlayContent').html(content).find("input").focus(module.FocusField).blur(module.BlurField);
        if (!quakelive.IsCompatibleBrowser()) {
            quakelive.Overlay('home/compat', "quakelive.Goto('home'); return false");
            return
        }
        if (quakelive.path == "register") {
            if (module.savedFormData) {
                for (var fieldName in module.savedFormData) {
                    var field = $('#' + fieldName);
                    if (field.attr('type') && field.attr('type').toLowerCase() == 'checkbox') {
                        if (module.savedFormData[fieldName]) {
                            field.attr('checked', 'checked')
                        } else {
                            field.removeAttr('checked')
                        }
                    } else {
                        field.val(module.savedFormData[fieldName])
                    }
                }
            }
            if (module.step1Errors) {
                module.ShowStep1aError(module.step1Errors);
                module.step1Errors = null
            }
            $('#firstname').focus()
        } else {
            var formVars = module.savedFormData;
            if (quakelive.path == "register/1a") {} else if (quakelive.path == "register/1b") {
                if (!formVars) {
                    quakelive.Goto('register');
                    return
                }
                $('#fullname').html(formVars.firstname + ' ' + formVars.lastname);
                $('#email').html(formVars.email);
                $('#nametag').html(formVars.nametag)
            } else {
                if (!quakelive.IsLoggedIn()) {
                    quakelive.PageRedirect('/user/login_redirect');
                    return
                }
                if (quakelive.path == "register/transfer") {
                    quakelive.mod_prefs.LoadConfigPage()
                }
            }
        }
    };
    module.thandles = [];
    module.EndGameMode = function () {
        for (var index in module.thandles) {
            clearTimeout(module.thandles[index])
        }
        module.thandles = [];
        window.onbeforeunload = null;
        quakelive.PageRedirect('/user/login_redirect')
    };
    module.OnGameExited = function (code) {
        if (quakelive.userstatus != 'ACTIVE') {
            $('#game_verifier').remove();
            var html = '<div id="game_verifier_container"><div id="game_verifier">' + '<h1>Verifying skill placement results&hellip;</h1>' + '<img src="' + quakelive.resource('/images/loader.gif') + '" width="62" height="13" />' + '<h3>Please wait while we verify the results of your Skill Placement match.</h3>' + '</div></div>';
            var trainingResult = {};
            $('#qlv_game_mode_viewport').append(html);
            $.ajax({
                url: '/register/training_done/' + code,
                dataType: 'json',
                success: function (data) {
                    trainingResult = data
                },
                error: function () {
                    trainingResult.ACCOUNT_ACTIVE = false
                },
                complete: function () {
                    if (trainingResult.ACCOUNT_ACTIVE) {
                        quakelive.mod_friends.node.find('.reg_step_2').html('<img src="' + quakelive.resource('/images/chatfill/userreg/step_2_completed.png') + '" width="300" height="117" />');
                        quakelive.mod_friends.node.find('.reg_step_3').html('<img src="' + quakelive.resource('/images/chatfill/userreg/step_3_on.png') + '" width="300" height="117" />');
                        $('#game_verifier').html('<h1>Skill placement match completed!</h1>' + '<img src="' + quakelive.resource('/images/loader.gif') + '" width="62" height="13" />' + '<h3>Please wait while we activate your account.</h3>');
                        module.thandles[module.thandles.length] = setTimeout(function () {
                            quakelive.mod_friends.node.find('.reg_step_2').html('<img src="' + quakelive.resource('/images/chatfill/userreg/step_2_completed.png') + '" width="300" height="117" />');
                            quakelive.mod_friends.node.find('.reg_step_3').html('<img src="' + quakelive.resource('/images/chatfill/userreg/step_3_completed.png') + '" width="300" height="117" />');
                            $('#game_verifier').html('<h1>Your account is now active!</h1>' + '<img src="' + quakelive.resource('/images/loader.gif') + '" width="62" height="13" />' + '<h3>Congratulations! Your skill placement match has been completed and your account activated. You can now start fragging your friends in online games!<br /><br />Please wait as we redirect you to the full site. <a href="/">Click here</a> if you are not automatically redirected to the main site in a few moments.</h3>');
                            module.thandles[module.thandles.length] = setTimeout(function () {
                                quakelive.mod_register.EndGameMode()
                            },
                            9000)
                        },
                        3000)
                    } else {
                        CreateCookie('failed_training', 1, 0);
                        $('#game_verifier').html('<h1>Your Account is <b>NOT</b> Active!</h1>' + '<img src="' + quakelive.resource('/images/loader.gif') + '" width="62" height="13" />' + '<h3>You <b>must</b> play the 10 minute Placement Match in order to gain full access to the site.<br /><br /><a href="javascript:;" onclick="quakelive.mod_register.EndGameMode(); return false">Click here</a> if you are not automatically redirected to the main site in a few moments.<br /><br /><small>If you are continuing to have problems with your skill placement match please visit the <a href="/forum" target="qlforum">QUAKE LIVE support forum</a> for additional help.</small></h3>');
                        module.thandles[module.thandles.length] = setTimeout(function () {
                            quakelive.mod_register.EndGameMode()
                        },
                        13000)
                    }
                }
            })
        }
    };
    var skillNameIdMap = {
        'easy': 0,
        'medium': 1,
        'hard': 2,
        'nightmare': 3
    };
    module.StartBotMatch = function (defaultSkill) {
        if (qlXfer.currentGroup < GROUP_BASE) {
            return
        }
        var skillVal = $('#skill').val() || '';
        if (skillVal == '') {
            skillVal = 'easy'
        }
        quakelive.cvars.Set('web_botskill', skillVal);
        $.ajax({
            url: '/register/skiptraining/' + skillVal,
            complete: function () {
                $('#overlay-raw').hide();
                $('#overlay-bg').hide();
                var cmdString = "+set bot_dynamicSkill 1 +set com_backgroundDownload 1 +set sv_quitOnExitLevel 1 +set g_gametype 0";
                if (quakelive.userstatus == 'ACTIVE') {
                    cmdString += " +arena " + skillVal
                } else {
                    quakelive.skipEndGame = true;
                    cmdString += " +set bot_startingSkill " + (skillNameIdMap[skillVal] || 0) + " +map qztraining"
                }
                LaunchGame(BuildCmdString() + cmdString, true)
            }
        })
    };
    module.OnContentLoaded = function () {
        if (!quakelive.IsLoggedIn()) {
            return
        }
        module.highestGroup = 1;
        while (module.highestGroup <= qlXfer.group) {
            module.OnDownloadGroup({
                group: module.highestGroup
            });
            module.highestGroup++
        }
    };
    module.OnDownloadGroup = function (params) {
        if (quakelive.userstatus == 'ACTIVE') {
            return
        }
        switch (params.group) {
        case GROUP_MINIMUM:
            $('.dl-progress-text').empty();
            if (params.numfiles > 0) {
                $('.dl-subtitle').attr('class', 'dl-subtitle dl-subtitle-min');
                $('#dl-text-header').html('A Skill Placement Match is now being downloaded. QUAKE LIVE uses the results of this 10 minute Placement Match to suggest online games with other players at your skill level. Please click the red "PLAY" button to begin.')
            }
            break;
        case GROUP_BASE:
            $('.dl-btn-play').removeClass('dl-btn-play-off').addClass('dl-btn-play-on').show();
            if (params.numfiles > 0) {
                if (quakelive.userstatus == 'ACTIVE') {
                    $('#dl-main-play').show()
                }
                $('.dl-subtitle').attr('class', 'dl-subtitle dl-subtitle-extra');
                $('#dl-text-header').html('The Skill Placement Match is now ready, and you will continue to download the rest of QUAKE LIVE as you play this match. The skill of your opponent in this match will adjust to match yours. Please click the red "PLAY" button to begin.')
            } else {
                $('.dl-subtitle').attr('class', 'dl-subtitle dl-subtitle-check');
                $('#dl-text-header').html('Checking your downloaded data&hellip; Please wait.')
            }
            break;
        case GROUP_EXTRA:
            $('.dl-btn-play').removeClass('dl-btn-play-off').addClass('dl-btn-play-on').show();
            if (params.numfiles > 0) {
                $('.dl-subtitle').attr('class', 'dl-subtitle dl-subtitle-extra');
                $('#dl-text-header').html('The Skill Placement Match is now ready, and you will continue to download the rest of QUAKE LIVE as you play this match. The skill of your opponent in this match will adjust to match yours. Please click the red "PLAY" button to begin.')
            } else {
                $('.dl-subtitle').attr('class', 'dl-subtitle dl-subtitle-check');
                $('#dl-text-header').html('Checking your downloaded data&hellip; Please wait.')
            }
            break;
        case GROUP_DONE:
            $('.dl-btn-play').removeClass('dl-btn-play-off').addClass('dl-btn-play-on').show();
            $('.dl-percent-text').text('All Downloads Complete');
            $('.dl-timeleft').empty();
            $('.dl-progress-text').empty();
            $('.dl-progress').hide();
            $('.dl-subtitle').attr('class', 'dl-subtitle dl-subtitle-done');
            $('#dl-text-header').html('QUAKE LIVE is now completely downloaded. You must complete the 10 minute Placement Match so that we can suggest online games with other players at your skill level. Please click the red "PLAY" button to begin.');
            break
        }
        module.highestGroup = params.group
    };
    module.ShowRegistration = function () {
        if (!quakelive.CheckBrowserCompat()) {
            return
        }
        if (quakelive.IsLoggedIn()) {
            quakelive.Goto('home');
            return
        }
        quakelive.Goto('register')
    };
    module.GotoStep1a = function () {
        quakelive.Goto('register')
    };
    module.ShowStep1aError = function (err) {
        for (var fieldName in err.ERRORS) {
            $('#help_' + fieldName + ' .help').hide();
            $('#help_' + fieldName + ' .error').remove();
            $('#help_' + fieldName).append("<span class='error'>" + err.ERRORS[fieldName] + "</span>");
            module.StyleAsError(fieldName)
        }
        var msg;
        if (!err.ERRORS || err.ERRORS.length == 0) {
            msg = err.MSG
        } else {
            msg = "An error has occurred. Please correct the highlighted fields and try again."
        }
        $('.reg_error_block').html(msg).effect('pulsate', {
            times: 1
        },
        500);
        $('.orangeTxt').effect('pulsate', {
            times: 1
        },
        500)
    };
    var formData = {};
    var savedFormData = {};
    module.ShowRegistration = function () {
        formData = {};
        savedFormData = {};
        if (quakelive.CheckBrowserCompat()) {
            quakelive.Goto("register")
        }
    };
    module.GotoStep1b = function () {
        var formData = {};
        $('#qlv_OverlayContent').find('input,select').each(function () {
            if ($(this).attr('type').toLowerCase() == 'checkbox') {
                formData[this.name] = $(this).attr('checked') ? 1 : 0
            } else {
                formData[this.name] = $(this).val()
            }
        });
        $.ajax({
            url: '/register/checkuser',
            type: 'post',
            data: formData,
            dataType: 'json',
            error: function () {
                module.ClearFieldErrors();
                module.ShowStep1aError({
                    ECODE: -1,
                    ERRORS: {},
                    MSG: 'General Error. Try again.'
                })
            },
            success: function (json) {
                module.ClearFieldErrors();
                if (parseInt(json.ECODE) == 0) {
                    module.savedFormData = formData;
                    quakelive.Goto('register/1b', null, true)
                } else {
                    module.ShowStep1aError(json)
                }
            }
        })
    };
    module.GotoStep2a = function () {
        var postData = $.extend(module.savedFormData, {
            captcha: $('#captcha').val()
        });
        $.ajax({
            url: '/register/newuser',
            type: 'post',
            data: postData,
            dataType: 'json',
            error: function () {
                module.step1Errors = {
                    ECODE: -1,
                    ERRORS: {},
                    MSG: 'General Error. Try again.'
                };
                quakelive.Goto('register')
            },
            success: function (json) {
                module.ClearFieldErrors();
                var code = parseInt(json.ECODE);
                module.StyleAsDefault('captcha');
                if (code == 0) {
                    module.savedFormData = {};
                    module.formData = {};
                    quakelive.PageRedirect('/user/login_redirect')
                } else if (code == -1001) {
                    module.ReloadCaptcha();
                    module.StyleAsError('captcha');
                    $('#help_captcha').append("<span class='error'>" + json.MSG + "</span>")
                } else {
                    module.step1Errors = json;
                    quakelive.Goto('register')
                }
            }
        })
    };
    module.GotoStep2b = function () {
        module.StyleAsDefault('code');
        $.ajax({
            url: '/register/mailverify',
            type: 'post',
            data: {
                action: 'verify',
                code: $('#code').val()
            },
            dataType: 'json',
            error: function () {
                $('#help_code .error').remove();
                $('#help_code').append("<span class='error'>Invalid verification code</span>");
                module.StyleAsError('code')
            },
            success: function (json) {
                quakelive.userstatus = 'REGISTERED';
                if (parseInt(json.ECODE) == 0) {
                    if (typeof(qz_instance) != 'undefined') {
                        quakelive.Goto('register/transfer', null, true)
                    } else {
                        quakelive.PageRedirect('/user/login_redirect')
                    }
                } else {
                    $('#help_code .error').remove();
                    $('#help_code').append("<span class='error'>" + json.MSG + "</span>");
                    module.StyleAsError('code')
                }
            }
        })
    };
    module.StyleAsDefault = function (id) {
        $('#help_' + id + ' .error').remove();
        $('#wrap_' + id).removeClass('orangeBorder');
        $('#label_' + id).removeClass('orangeTxt');
        $('#help_' + id).removeClass('orangeBack').removeClass('orangeBorder').removeClass('blackTxt').addClass('whiteTxt');
        $('.reg_error_block').html("&nbsp;")
    };
    module.StyleAsError = function (id) {
        $('#wrap_' + id).addClass('orangeBorder');
        $('#label_' + id).addClass('orangeTxt');
        $('#help_' + id).addClass('orangeBack').addClass('orangeBorder').addClass('blackTxt').removeClass('whiteTxt')
    };
    module.ClearFieldErrors = function () {
        $('#qlv_OverlayContent').find('input').each(function () {
            module.StyleAsDefault(this.id)
        });
        module.StyleAsDefault('birthdate');
        $('#help_birthdate').empty();
        $('.reg_error_block').html("&nbsp;")
    };
    module.Close = function () {
        if (confirm("Are you sure you want to close registraiton?")) {
            quakelive.Goto('home')
        }
    };
    module.Logout = function () {
        if (confirm("Are you sure you want to log out?")) {
            quakelive.Logout()
        }
    };
    module.SendEmailVerify = function () {
        $.ajax({
            url: '/register/mailverify',
            mode: 'abort',
            port: 'verifymail',
            type: 'post',
            data: {
                action: 'send'
            },
            dataType: 'json',
            error: function () {
                alert("Error sending verification mail. Please try again later.")
            },
            success: function (json) {
                alert("Verification mail sent. Please check your mailbox.")
            }
        })
    };
    var clickCount = 0;
    module.InstallPlugin = function () {
        CreateCookie(ie_cookie_string, 1, 1);
        upgrade()
    };
    module.ReloadCaptcha = function () {
        $('#captcha_img').attr('src', '/captcha.php?v=' + (new Date()).getTime() + Math.random());
        $('#captcha').val('')
    };
    module.OnPluginInstalled = function () {
        if (quakelive.userstatus == 'UNVERIFIED') {
            quakelive.Goto('register/2a', null, true)
        } else if (quakelive.userstatus == 'REGISTERED') {
            if (ReadCookie('failed_training')) {
                quakelive.Goto('home')
            } else {
                quakelive.Goto('register/transfer', null, true)
            }
        }
    };
    quakelive.RegisterModule('register', module)
})(jQuery);
(function ($) {
    var module = {};
    var PresType = {
        Unknown: 0,
        Available: 1,
        Chat: 2,
        Away: 3,
        Dnd: 4,
        Xa: 5,
        Unavailable: 6
    };
    var S10nType = {
        None: 0,
        NoneOut: 1,
        NoneIn: 2,
        NoneOutIn: 3,
        To: 4,
        ToIn: 5,
        From: 6,
        FromOut: 7,
        Both: 8
    };
    var QZ_PRIVACYLIST = "quakelive";
    var PrivAction = {
        Allow: 'allow',
        Deny: 'deny'
    };
    var PrivType = {
        Undefined: 'undefined',
        JID: 'jid',
        Group: 'group',
        Sub: 'subscription'
    };
    var PrivPacketType = {
        Message: 1,
        PresenceIn: 2,
        PresenceOut: 4,
        IQ: 8,
        All: 15
    };
    var PrivResult = {
        StoreSuccess: 0,
        ActivateSuccess: 1,
        DefaultSuccess: 2,
        RemoveSuccess: 3,
        RequestNamesSuccess: 4,
        RequestListsSuccess: 5,
        Conflict: 6,
        ItemNotFound: 7,
        BadRequest: 8,
        UnknownError: 9
    };
    var PrivActiveList = null;
    var Groups = {
        None: '',
        Online: 'online',
        Offline: 'offline',
        Active: 'active',
        Recent: 'recent'
    };
    var Admins = {
        None: '',
        Admin: 'admin',
        QLive: 'quake_live',
        Broadcast: 'broadcast'
    };

    function EscapeHTML(html) {
        html = html.replace(/\&/g, '&amp;');
        html = html.replace(/\</g, '&lt;');
        html = html.replace(/\>/g, '&gt;');
        return html
    }

    function JID(jid) {
        this.bare = jid;
        var ofs = jid.indexOf('@');
        if (ofs != -1) {
            this.username = jid.substring(0, ofs)
        } else {
            this.username = jid;
            this.bare = jid + "@" + quakelive.siteConfig.xmppDomain
        }
        this.Clone = function () {
            return new JID(this.bare)
        }
    };

    function Roster() {
        this.selectedContact = null;
        this.pendingRequests = [];
        this.fullRoster = [];
        this.rosterData = {};
        this.ImportRoster = function () {
            var remoteRoster = GetRemoteRoster();
            this.UI_Show();
            for (var who in remoteRoster) {
                var rosterElem = remoteRoster[who];
                var jid = new JID(who);
                var contact = new RosterItem(jid, rosterElem.NAME, rosterElem.SUBSCRIPTION, rosterElem.ONLINE ? PresType.Available : PresType.Unavailable);
                roster.AddContact(contact);
                if (contact.CanDisplayOnRoster()) {
                    contact.UI_PlaceInGroup(Groups.Online)
                }
                if (rosterElem.SUBSCRIPTION == S10nType.From) {
                    var request = {};
                    request.jid = who;
                    roster.AddPendingRequest(request)
                }
            }
            if (quakelive.activeModule == module) {
                if (quakelive.pathParts[1] == "manage") {
                    module.LoadManageItems()
                } else if (quakelive.pathParts[1] == "pending") {
                    module.LoadPending()
                }
            }
        };
        this.ImportRosterData = function (json) {
            roster.rosterData = json;
            roster.ImportRoster();
            roster.UI_OnRosterUpdated();
            roster.DisplayChatAreaHelp();
            quakelive.SendModuleMessage('IM_OnRosterChanged')
        };
        this.GetIndexByJID = function (jid) {
            var rosterIndex = -1;
            for (var i = 0; i < this.fullRoster.length; ++i) {
                if (this.fullRoster[i].jid.bare == jid.bare) {
                    rosterIndex = i;
                    break
                }
            }
            return rosterIndex
        };
        this.GetContactByJID = function (jid) {
            var index = this.GetIndexByJID(jid);
            if (index != -1) {
                return this.fullRoster[index]
            } else {
                return null
            }
        };
        this.GetIndexByName = function (name) {
            var rosterIndex = -1;
            var lcName = name.toLowerCase();
            for (var i = 0; i < this.fullRoster.length; ++i) {
                if (this.fullRoster[i].name.toLowerCase() == lcName) {
                    rosterIndex = i;
                    break
                }
            }
            return rosterIndex
        };
        this.AddContact = function (item) {
            var rosterIndex = this.GetIndexByJID(item.jid);
            if (rosterIndex != -1) {
                return
            }
            this.fullRoster[this.fullRoster.length] = item
        };
        this.AddPendingRequest = function (request) {
            var jid = new JID(request.jid);
            var index = 0;
            for (; index < this.pendingRequests.length; ++index) {
                if (this.pendingRequests[index].bare == jid.bare) {
                    break
                }
            }
            if (index == this.pendingRequests.length) {
                this.pendingRequests[this.pendingRequests.length] = jid
            }
            if (quakelive.pathParts[0] == "friends") {
                if (quakelive.pathParts[1] == "pending") {
                    module.UI_AddPendingItem(jid, -1)
                }
            }
        };
        this.HasPendingRequests = function () {
            return (this.pendingRequests.length > 0) ? true : false
        };
        this.RemoveContactByName = function (name) {
            var rosterIndex = this.GetIndexByName(name);
            this.RemoveContactByIndex(rosterIndex)
        };
        this.RemoveContactByJID = function (jid) {
            var rosterIndex = this.GetIndexByJID(jid);
            this.RemoveContactByIndex(rosterIndex)
        };
        this.RemoveContactByIndex = function (rosterIndex) {
            var contact = null;
            if (rosterIndex != -1) {
                var contact = this.fullRoster[rosterIndex];
                if (this.selectedContact == contact) {
                    this.DeselectContact()
                }
                this.fullRoster = RemoveArrayIndex(this.fullRoster, rosterIndex)
            }
            if (contact) {
                contact.UI_RemoveFromGroup()
            }
        };
        this.GetIncomingValues = function () {
            var index = -1;
            var values = [];
            for (var i = 0; i < this.pendingRequests.length; i++) {
                values.push(this.pendingRequests[i].bare.split('@')[0])
            }
            return values
        };
        this.GetOutgoingValues = function () {
            var index = -1;
            var values = [];
            for (var i = 0; i < this.fullRoster.length; ++i) {
                if (this.fullRoster[i].IsInvited()) {
                    values.push(this.fullRoster[i].name.toLowerCase())
                }
            }
            return values
        };
        this.DeselectContact = function () {
            if (this.selectedContact != null) {
                module.node.find('#im-chat').remove();
                this.selectedContact.OnDeselected();
                this.selectedContact = null
            }
            this.DisplayChatAreaHelp()
        };
        this.DisplayChatAreaHelp = function () {
            var node = $("<div style='padding: 60px 20px; text-align: center; line-height: 22px'></div>");
            var msg = '';
            if (this.fullRoster.length > 0) {
                var tips = ["Tip: You can join a friend who is playing Quake LIVE by clicking the <img src='" + quakelive.resource("/images/im/icon_qz.png") + "' /> icon next to their name.", "Tip: You can find new friends to add to your roster by browsing the <a href='javascript:void(0)' onclick='quakelive.Goto(\"profile/summary/" + quakelive.username + "\")'>QUAKE LIVE Profile</a> pages."];
                msg = tips[Math.floor(Math.random() * tips.length)]
            } else {
                msg = "Your friends list is empty. Use the <a href='javascript:void(0)' onclick='quakelive.Goto(\"friends\")'>Friends Manager</a> to add friends to your Quake LIVE account."
            }
            node.append(msg);
            module.node.find('#im-footer').html(node)
        };
        this.BindChatEvents = function (contact) {
            module.node.find('#im-chat-close').click(function () {
                roster.DeselectContact()
            });
            if (!contact.isAdmin) {
                var sendChatMessage = function () {
                    var msgNode = module.node.find('#chat-msg');
                    var msg = msgNode.val();
                    if (msg.length > 0) {
                        contact.SendMessage(msg);
                        msgNode.val('')
                    }
                    module.node.find('#chat-msg').focus()
                };
                var msgNode = module.node.find('#chat-msg').keyup(function (eventObject) {
                    if (eventObject.keyCode == 13) {
                        sendChatMessage();
                        eventObject.preventDefault()
                    }
                });
                if (!quakelive.IsGameRunning()) {
                    msgNode.focus()
                }
                module.node.find('#im-chat-send').click(sendChatMessage)
            }
        };
        this.UnbindChatEvents = function () {
            module.node.find('#im-chat-close').unbind("click");
            module.node.find('#chat-msg').unbind("keyup");
            module.node.find('#im-chat-send').unbind("click")
        };
        this.SelectContact = function (contact) {
            if (this.selectedContact == contact) {
                if (!quakelive.IsGameRunning()) {
                    module.node.find('#chat-msg').focus()
                }
                return
            }
            this.DeselectContact();
            this.selectedContact = contact;
            contact.OnSelected();
            if (contact.isAdmin) {
                module.node.find('#im-footer').html("<div id='im-chat'>" + "<div id='im-chat-close'></div>" + "<div id='im-chat-body'>" + "<div id='im-chat-body-bottom'></div>" + "</div>" + "</div>")
            } else {
                module.node.find('#im-footer').html("<div id='im-chat'>" + "<div id='im-chat-close'></div>" + "<div id='im-chat-body'>" + "<div id='im-chat-body-bottom'></div>" + "</div>" + "<input id='chat-msg' type='text' />" + "<div id='im-chat-send'></div>" + "</div>")
            }
            this.UnbindChatEvents();
            this.BindChatEvents(contact);
            for (var i = 0; i < contact.history.length; ++i) {
                contact.AppendToHistory(contact.history[i])
            }
            roster.ScrollChatToBottom()
        };
        this.ScrollChatToBottom = function () {
            var pane = module.node.find('#im-chat-body');
            pane.scrollTop(10000000)
        };
        var OverlayTips = ["You can join a friend who is playing by clicking the QUAKE LIVE icon next to their name.", "Use the Duel Detective to quickly find a new game against someone at your skill level.", "Your <a href='javascript:;' onclick='quakelive.Goto(\"profile/summary/%PLAYER_NICK%\"); return false'>QUAKE LIVE profile</a> displays your recent matches, awards, and <a href='javascript:;' onclick='quakelive.Goto(\"profile/stats/%PLAYER_NICK%\"); return false'>statistics.</a>"];
        this.GetOverlayTip = function () {
            var str = OverlayTips[Math.floor(Math.random() * OverlayTips.length)];
            str = str.replace(/%PLAYER_NICK%/g, quakelive.username);
            return str
        };
        this.SwapOverlayTip = function () {
            if (this.GetNumOnlineContacts() > 0) {
                return
            }
            if (!quakelive.IsGameRunning()) {
                module.node.find('#im-overlay-footer').html("<p>" + this.GetOverlayTip() + "</p>")
            }
            var self = this;
            setTimeout(function () {
                self.SwapOverlayTip()
            },
            30000)
        };
        var PreLoginTips = ["QUAKE LIVE is 100% free to play. <a href='javascript:;' onclick='quakelive.mod_register.ShowRegistration(); return false'>Join now</a> to get started!", "QUAKE LIVE allows you to quickly get into a game with your friends. <a href='javascript:;' onclick='quakelive.mod_register.ShowRegistration(); return false'>Join now!</a>", "QUAKE LIVE will match you with equally skilled players. <a href='javascript:;' onclick='quakelive.mod_register.ShowRegistration(); return false'>Click here to join!</a>"];
        this.GetPreLoginTip = function () {
            return PreLoginTips[Math.floor(Math.random() * PreLoginTips.length)]
        };
        this.SwapPreLoginTip = function () {
            if ($('#chatfill-footer').size() == 0 || quakelive.IsLoggedIn()) {
                return
            }
            $('#chatfill-footer').html("<p>" + this.GetPreLoginTip() + "</p>");
            var self = this;
            setTimeout(function () {
                self.SwapPreLoginTip()
            },
            30000)
        };
        var self = this;
        quakelive.AddHook('OnLayoutLoaded', function () {
            self.SwapPreLoginTip();
            self.UI_ShowVert()
        });
        this.ui_state = '';
        this.ui_advert_shown = false;
        this.ui_advert_started = false;
        this.UI_Show = function () {
            var state = '';
            if (quakelive.userstatus != 'ACTIVE') {
                state = 'userreg'
            } else if (this.GetNumOnlineContacts() > 0) {
                state = 'friends'
            } else {
                state = 'nofriends'
            }
            if (state != 'userreg' && !this.ui_advert_shown) {
                this.UI_ShowVert();
                return
            }
            if (state != this.ui_state) {
                switch (state) {
                case 'userreg':
                    this.UI_ShowUserReg();
                    break;
                case 'friends':
                    this.UI_ShowApp();
                    break;
                case 'nofriends':
                    this.UI_ShowOverlay();
                    break
                }
                this.ui_state = state
            }
        };
        this.UI_FinishAnimateVert = function () {
            if (this.ui_advert_handle) {
                clearTimeout(this.ui_advert_handle);
                this.ui_advert_handle = null
            }
            self.ui_advert_shown = true;
            self.UI_Show()
        };
        this.UI_StartAnimateVert = function () {
            var self = this;
            var MS_PER_PX = 1.25;
            this.ui_advert_handle = setTimeout(function () {
                $('#spon_large_vert').animate({
                    height: "0px"
                },
                600 * MS_PER_PX, 'linear', function () {
                    $('#spon_large_vert').remove();
                    $('#spon_vert').show().css('overflow', 'hidden').css('height', '0').animate({
                        height: '260px'
                    },
                    260 * MS_PER_PX, 'linear', function () {
                        $('#post_spon_content').slideUp(0).slideDown(400);
                        self.UI_FinishAnimateVert()
                    })
                })
            },
            4000)
        };
        this.UI_ShowVert = function () {
            if (this.ui_advert_started) {
                return
            }
            if ($('#spon_large_vert').length == 0) {
                quakelive.HookVertLoading();
                return
            }
            this.ui_advert_started = true;
            var self = this;
            var zones = [];
            if (quakelive.IsLoggedIn()) {
                zones[zones.length] = {
                    'zone': quakelive.VERT_ZONES.sidebar_half_page_ad,
                    'display': function (vert, vertNode, isDefault) {
                        if (isDefault) {
                            $('#spon_large_vert').remove();
                            $('#spon_vert,#spon_vert .ql_vert_frame,#post_spon_content').show();
                            self.UI_FinishAnimateVert()
                        } else {
                            $('#spon_large_vert').empty().append(vertNode);
                            self.UI_StartAnimateVert()
                        }
                    }
                }
            }
            quakelive.FillVertList(zones);
            quakelive.LoadVerts(zones, {
                timeout: 1500
            });
            quakelive.HookVertLoading()
        };
        this.UI_ShowOverlay = function () {
            module.node.html("<div id='im-overlay-header'></div>" + "<div id='im-overlay-body'>" + "<p>" + "Finding friends and opponents is EASY!  <a href='javascript:;' onclick='quakelive.Goto(\"friends/search\"); return false'>Click here to start your search.</a>" + "<a class='btn_friends' href='javascript:;' onclick='quakelive.Goto(\"friends/search\"); return false'></a>" + "Click the button above to access the friends manager and <a href='javascript:;' onclick='quakelive.Goto(\"friends/search\"); return false'>add more players to your friends list</a>." + "</div>" + "<div id='im-overlay-footer'>" + "</div>");
            this.SwapOverlayTip();
            module.FitToParent()
        };
        this.UI_ShowUserReg = function () {
            $('.spon_media').remove();
            module.node.html("<div id='im-userreg'><div style='height: 100px'>&nbsp;</div><div class='reg_step_1'></div><div class='reg_step_2'></div><div class='reg_step_3'></div></div>");
            module.node.find('.reg_step_1').html('<img src="' + quakelive.resource('/images/chatfill/userreg/step_1_completed.png') + '" width="300" height="117" />');
            module.node.find('.reg_step_2').html('<img src="' + quakelive.resource('/images/chatfill/userreg/step_2_on.png') + '" width="300" height="117" />');
            module.node.find('.reg_step_3').html('<img src="' + quakelive.resource('/images/chatfill/userreg/step_3_off.png') + '" width="300" height="117" />');
            module.FitToParent()
        };
        this.UI_ShowApp = function () {
            module.node.html(module.TPL_FRIENDS_LIST);
            for (var i in this.fullRoster) {
                var contact = this.fullRoster[i];
                if (contact.CanDisplayOnRoster() && contact.group != Groups.None) {
                    contact.UI_PlaceInGroup(contact.group, true)
                }
            }
            module.FitToParent()
        };
        this.GetNumOnlineContacts = function () {
            var numOnline = 0;
            for (var i in this.fullRoster) {
                if (this.fullRoster[i].CanDisplayOnRoster()) {
                    numOnline++
                }
            }
            return numOnline
        };
        this.UI_OnRosterUpdated = function () {
            var numOnline = this.GetNumOnlineContacts();
            this.UI_Show();
            if (numOnline > 0) {
                module.node.find('#im-header').html("<span>" + numOnline + " friend" + (numOnline == 1 ? "" : "s") + " online</span>")
            }
        }
    };
    var rosterId = 0;

    function RosterItem(jid, name, s10nType, presType) {
        this.jid = jid.Clone();
        this.name = name || this.jid.username;
        this.unreadMsgCount = 0;
        this.presence = presType;
        this.subscription = s10nType;
        this.history = [];
        this.group = Groups.None;
        var data = roster.rosterData[this.name.toLowerCase()];
        this.player_id = 0;
        this.player_nick = this.name;
        this.clan = '';
        this.join_date = null;
        this.total_kills = 0;
        this.most_played_gt = 'unknown';
        this.time_played = 0;
        this.last_online = null;
        this.last_online_date = null;
        this.bio = '';
        this.inGame = false;
        this.prevServerID = 0;
        this.model = 'sarge';
        this.skin = 'default';
        this.country = 'US';
        this.country_name = 'United States';
        var node = NewItemNode(this.name);
        this.node = node;
        this.icons = new PlayerIconSet('sarge', 'default');
        this.UpdateDetails = function (data) {
            this.player_id = data.PLAYER_ID;
            this.player_nick = data.PLAYER_NICK;
            this.clan = data.PLAYER_CLAN;
            this.join_date = data.JOIN_DATE;
            this.total_kills = data.TOTAL_KILLS;
            this.most_played_gt = data.MOST_PLAYED_GT;
            this.time_played = data.TIME_PLAYED;
            this.last_online = data.LAST_ONLINE;
            this.last_online_date = data.LAST_ONLINE_DATE;
            this.bio = data.BIO;
            this.icons = new PlayerIconSet(data.MODEL, data.SKIN);
            this.model = data.MODEL;
            this.skin = data.SKIN;
            this.country = data.COUNTRY_ABBREV;
            this.country_name = data.COUNTRY_NAME
        };
        this.DisplayChatIcon = function () {
            var playerInfo = this;
            var link = $("<a href='javascript:;'></a>").bind("click", function (event) {
                quakelive.Goto("profile/summary/" + playerInfo.player_nick);
                event.stopPropagation()
            }).append(this.icons.small);
            this.node.find('.rosteritem-playericon').empty().append(link)
        };
        var rosterItem = this;
        if (data) {
            this.UpdateDetails(data)
        } else {}
        var display_name = "<span class='player_name'>";
        if (this.clan) {
            display_name += "<small>" + StripColors(this.clan) + "</small>"
        }
        display_name += this.player_nick;
        display_name += "</span>";
        this.node.find('.rosteritem-name').html(display_name);
        this.CanDisplayOnRoster = function () {
            return (this.presence != PresType.Unavailable) && (this.subscription == S10nType.Both)
        };
        this.IsSubscribed = function () {
            return this.subscription == S10nType.Both
        };
        this.IsInvited = function () {
            return (this.subscription == S10nType.NoneOut) || (this.subscription == S10nType.To)
        };
        this.IsOnline = function () {
            return (this.presence != PresType.Unavailable) && (this.presence != PresType.Unknown) && (this.subscription == S10nType.Both)
        };
        this.StartInactivityTimeout = function () {
            if (this.timeoutHandle) {
                clearTimeout(this.timeoutHandle)
            }
            var contact = this;
            this.timeoutHandle = setTimeout(function () {
                if (roster.selectedContact != contact) {
                    if (contact.group == Groups.Active) {
                        if (contact.CanDisplayOnRoster()) {
                            contact.UI_PlaceInGroup(Groups.Online)
                        } else {
                            contact.UI_RemoveFromGroup()
                        }
                        contact.timeoutHandle = null
                    }
                } else {
                    contact.StartInactivityTimeout()
                }
            },
            180 * 1000)
        };
        this.ReceivedMsg = function (what) {
            this.UI_PlaceInGroup(Groups.Active);
            if (roster.selectedContact == null) {
                roster.SelectContact(this)
            }
            this.history[this.history.length] = {
                origin: 1,
                'msg': what
            };
            if (roster.selectedContact == this) {
                this.AppendToHistory(this.history[this.history.length - 1]);
                roster.ScrollChatToBottom()
            } else {
                this.unreadMsgCount++;
                if (this.unreadMsgCount == 1) {
                    this.node.addClass('chat-unread')
                }
            }
            this.StartInactivityTimeout()
        };
        this.SendMessage = function (what) {
            quakelive.Tick();
            this.history[this.history.length] = {
                origin: 0,
                'msg': what
            };
            this.AppendToHistory(this.history[this.history.length - 1]);
            roster.ScrollChatToBottom();
            if (this.group != Groups.Active) {
                this.UI_PlaceInGroup(Groups.Active)
            }
            this.StartInactivityTimeout();
            qz_instance.IM_SendMessage(this.jid.bare, what)
        };
        this.prevChatOrigin = -1;
        this.prevChatNode = null;
        this.AppendToHistory = function (hist) {
            var html = '';
            var time = '';
            if (quakelive.cvars.GetIntegerValue("web_chattimestamps")) {
                var date = new Date();
                var min = date.getMinutes();
                var sec = date.getSeconds();
                if (min < 10) {
                    min = '0' + min
                }
                if (sec < 10) {
                    sec = '0' + sec
                }
                time = '<span class="chat-timestamp">(' + date.getHours() + ':' + min + ':' + sec + ')</span> '
            }
            if (this.prevChatOrigin != hist.origin) {
                var node = $('<div></div>');
                if (hist.origin == 0) {
                    node.attr('class', 'chat-history-me');
                    node.append(quakelive.mod_home.playericons.medium);
                    node.append("<h1>" + quakelive.username + "</h1>")
                } else {
                    node.attr('class', 'chat-history-them');
                    node.append(this.icons.medium);
                    node.append("<h1>" + this.player_nick + "</h1>")
                }
                node.append("<div>" + time + EscapeHTML(hist.msg) + "</div>");
                this.prevChatNode = node;
                module.node.find('#im-chat-body-bottom').before(this.prevChatNode);
                this.prevChatOrigin = hist.origin
            } else {
                this.prevChatNode.children('div').append("<br />" + time + EscapeHTML(hist.msg))
            }
        };
        this.FriendsContextMenuHandler = function (action, el, pos) {
            var data = el.data('contact');
            switch (action) {
            case 'premenu':
                if (data.inGame === true) {
                    $("#friendsContext").enableContextMenuItems('#join,#copy')
                } else {
                    $("#friendsContext").disableContextMenuItems('#join,#copy')
                }
                break;
            case 'join':
                join_server(data.gameStatus.ADDRESS, data.gameStatus.SERVER_ID);
                break;
            case 'copy':
                qlPrompt({
                    'input': true,
                    'readonly': true,
                    'alert': true,
                    'title': 'Link to this match',
                    'body': 'Use the URL below to link to this match directly.',
                    'inputLabel': quakelive.siteConfig.baseUrl + '/r/home/join/' + data.gameStatus.PUBLIC_ID
                });
                break;
            case 'send':
                roster.SelectContact(data);
                break;
            case 'view':
                quakelive.StopPathMonitor();
                quakelive.Goto('profile/summary/' + data.player_nick);
                quakelive.StartPathMonitor();
                break;
            default:
                break
            }
        };
        this.InitContextMenu = function () {
            if (!quakelive.siteConfig.showContextMenus) {
                return
            }
            this.node.data('contact', this);
            this.node.contextMenu({
                'menu': 'friendsContext',
                'inSpeed': 0,
                'outSpeed': 0
            },
            this.FriendsContextMenuHandler)
        };
        this.UI_PlaceInGroup = function (groupType, force) {
            if (!force) {
                roster.UI_Show()
            }
            this.DisplayChatIcon();
            if (force || this.group != groupType) {
                var prevGroup = this.group;
                this.UI_RemoveFromGroup();
                this.group = groupType;
                var contact = this;
                this.node.click(function () {
                    roster.SelectContact(contact)
                }).appendTo(module.node.find('#im-' + groupType + ' .itemlist'));
                this.InitContextMenu();
                module.UI_SortRoster(groupType);
                module.node.find('#im-' + groupType).show();
                this.UI_SetGameStatus(this.gameStatus);
                if (this.group == Groups.None && roster.selectedContact == contact) {
                    roster.DeselectContact()
                }
                if (!roster.skipNotices && this.group == Groups.Online && (prevGroup == Groups.Offline || prevGroup == Groups.None)) {
                    quakelive.notifier.Notify(quakelive.notifier.ContactPresenceNotice(this.player_nick, this.icons))
                }
            }
        };
        this.UI_RemoveFromGroup = function () {
            if (this.group == Groups.None) {
                return
            }
            if (!this.node[0].nextSibling && !this.node[0].previousSibling) {
                module.node.find('#im-' + this.group).hide()
            }
            this.node.remove();
            this.group = Groups.None
        };
        this.UI_SetGameStatus = function (status) {
            var container = this.node.children('.rosteritem-gameicon').empty();
            this.gameStatus = $.extend({},
            status);
            this.gameStatus.SERVER_ID = parseInt(this.gameStatus.SERVER_ID);
            this.gameStatus.BOT_GAME = parseInt(this.gameStatus.BOT_GAME);
            this.gameStatus.PUBLIC_ID = parseInt(this.gameStatus.PUBLIC_ID);
            this.inGame = false;
            if (this.gameStatus.BOT_GAME) {
                this.inGame = true;
                var iconNode = $('<img src="' + quakelive.resource("/images/im/icon_botmatch.png") + '" style="cursor: pointer" id="icon_' + this.jid.username + '" />');
                quakelive.matchtip.BindBotTooltip(iconNode, this.gameStatus);
                container.append(iconNode)
            } else if (this.gameStatus.SERVER_ID > 0) {
                this.inGame = true;
                var iconNode = $('<img src="' + quakelive.resource("/images/im/icon_qz.png") + '" style="cursor: pointer" id="icon_' + this.jid.username + '" />');
                quakelive.matchtip.BindMatchTooltip(iconNode, this.gameStatus.SERVER_ID);
                container.append(iconNode);
                if (this.gameStatus.SERVER_ID != 0 && this.prevServerID != this.gameStatus.SERVER_ID) {
                    this.prevServerID = this.gameStatus.SERVER_ID;
                    quakelive.notifier.Notify(quakelive.notifier.FriendInGameNotice(this.player_nick, this.icons.modelskin, this.gameStatus.ADDRESS, this.gameStatus.SERVER_ID, this.gameStatus.MAP))
                }
            }
        };
        this.OnSelected = function () {
            this.node.addClass('rosteritem-selected');
            this.node.removeClass('chat-unread');
            this.unreadMsgCount = 0;
            this.prevChatOrigin = -1;
            this.prevChatNode = null
        };
        this.OnDeselected = function () {
            this.node.removeClass('rosteritem-selected')
        }
    }

    function RecentItem(id, name, status, met, game) {
        this.id = id;
        this.name = name;
        this.status = status;
        this.met = met;
        this.game = game;
        var node = new NewItemNode(this.name);
        this.node = node;
        this.icons = new PlayerIconSet('sarge', 'default');
        var rosterItem = this;
        $.ajax({
            url: '/friends/details/' + this.name,
            dataType: 'json',
            success: function (json) {
                rosterItem.icons = new PlayerIconSet(json.MODEL, json.SKIN);
                rosterItem.node.find('.rosteritem-playericon').html(rosterItem.icons.small)
            }
        });
        this.UI_PlaceInGroup = function (groupType, force) {
            var contact = this;
            this.node.click(function () {
                quakelive.Goto("profile/summary/" + this.name)
            }).appendTo(module.node.find('#im-' + groupType + ' .itemlist'));
            module.node.find('#im-' + groupType).show()
        }
    }

    function BroadcastItem(jid, name) {
        this.jid = jid.Clone();
        this.name = name;
        this.history = [];
        this.group = Groups.None;
        this.unreadMsgCount = 0;
        this.isAdmin = true;
        var node = NewAlertNode(this.name);
        this.node = node;
        var rosterItem = this;
        this.StartInactivityTimeout = function () {
            if (this.timeoutHandle) clearTimeout(this.timeoutHandle);
            var contact = this;
            this.timeoutHandle = setTimeout(function () {
                if (node.attr('id') != 'rosteralert-selected') {
                    if (contact.group == Groups.Active) {
                        if (contact.group == Groups.Active) {
                            contact.UI_RemoveFromGroup();
                            contact.timeoutHandle = null
                        }
                    }
                } else {
                    contact.StartInactivityTimeout()
                }
            },
            15 * 1000)
        };
        this.ReceivedMsg = function (what) {
            this.UI_PlaceInGroup(Groups.Active);
            if (roster.selectedContact == null) {
                roster.SelectContact(this)
            }
            this.history[this.history.length] = {
                origin: 1,
                'msg': what
            };
            if (roster.selectedContact == this) {
                this.AppendToHistory(this.history[this.history.length - 1]);
                roster.ScrollChatToBottom()
            } else {
                this.unreadMsgCount++;
                if (this.unreadMsgCount == 1) {
                    this.node.addClass('chat-unread')
                }
            }
            this.StartInactivityTimeout()
        };
        this.prevChatOrigin = -1;
        this.prevChatNode = null;
        this.AppendToHistory = function (hist) {
            var html = '';
            if (this.prevChatOrigin != hist.origin) {
                var node = $('<div></div>');
                if (hist.origin == 0) {
                    node.attr('class', 'chat-history-me');
                    node.append(quakelive.mod_home.playericons.medium);
                    node.append("<h1>" + quakelive.username + "</h1>")
                } else {
                    node.attr('class', 'chat-history-them');
                    node.append("<h1>" + this.name + "</h1>")
                }
                node.append("<div>" + EscapeHTML(hist.msg) + "</div>");
                this.prevChatNode = node;
                module.node.find('#im-chat-body-bottom').before(this.prevChatNode);
                this.prevChatOrigin = hist.origin
            } else {
                this.prevChatNode.children('div').append("<br />" + EscapeHTML(hist.msg))
            }
        };
        this.UI_PlaceInGroup = function (groupType, force) {
            if (force || this.group != groupType) {
                this.UI_RemoveFromGroup();
                this.group = groupType;
                var contact = this;
                this.node.click(function () {
                    roster.SelectContact(contact)
                }).appendTo(module.node.find('#im-' + groupType + ' .itemlist'));
                module.UI_SortRoster(groupType);
                module.node.find('#im-' + groupType).show()
            }
        };
        this.UI_RemoveFromGroup = function () {
            if (this.group == Groups.None) {
                return
            }
            if (!this.node[0].nextSibling && !this.node[0].previousSibling) {
                module.node.find('#im-' + this.group).hide()
            }
            this.node.remove();
            this.group = Groups.None
        };
        this.OnSelected = function () {
            this.node.attr('id', 'rosteralert-selected');
            this.node.removeClass('chat-unread');
            this.unreadMsgCount = 0;
            this.prevChatOrigin = -1;
            this.prevChatNode = null
        };
        this.OnDeselected = function () {
            this.node.removeAttr('id')
        }
    }

    function NewItemNode(name) {
        this.name = name;
        var node = $("<div class='rosteritem'></div>");
        node.append("<span class='rosteritem-playericon'></span>");
        node.append("<span class='rosteritem-name'>" + this.name + "</span>");
        node.append("<span class='rosteritem-gameicon'></span>");
        return node
    }

    function NewAlertNode(name) {
        this.name = name;
        switch (name) {
        case Admins.Admin:
            this.img = "titleLiveAdmin.png";
            break;
        case Admins.Broadcast:
            this.img = "titleLiveMessage.png";
            break;
        case Admins.QLive:
            this.img = "titleQuakeLiveTeam.png";
            break;
        default:
            this.img = "titleLiveMessage.png";
            break
        }
        var node = $("<div class='rosteralert'></div>");
        node.append("<span><img src='" + quakelive.resource("/images/im/" + img) + "' width='300' height='21' /></span>");
        return node
    }

    function PrivacyList(listname) {
        this.listname = listname;
        this.privItems = [];
        this.ImportPrivList = function (json) {
            this.privItems.length = 0;
            for (var i = 0; i < json.items.length; i++) {
                var newitem = json.items[i];
                var pitem = new PrivacyItem(newitem);
                this.AddItem(pitem)
            }
            qz_instance.IM_ActivatePrivacyList(QZ_PRIVACYLIST)
        };
        this.AddItem = function (item) {
            var index = this.GetIndexByValue(item.value);
            if (index != -1) return;
            this.privItems[this.privItems.length] = item
        };
        this.RemoveItemByValue = function (value) {
            var index = this.GetIndexByValue(value);
            var item = null;
            if (index != -1) {
                var item = this.privItems[index];
                this.privItems = RemoveArrayIndex(this.privItems, index)
            }
        };
        this.GetIndexByValue = function (value) {
            var index = -1;
            for (var i = 0; i < this.privItems.length; ++i) {
                if (this.privItems[i].value == value) {
                    index = i;
                    break
                }
            }
            return index
        };
        this.GetItemByValue = function (value) {
            var index = this.GetIndexByValue(value);
            if (index != -1) return this.privItems[index];
            else return null
        };
        this.GetValueList = function () {
            var index = -1;
            var values = [];
            for (var i = 0; i < this.privItems.length; ++i) {
                values.push(this.privItems[i].value.split('@')[0])
            }
            return values
        };
        this.SaveList = function () {
            if (this.privItems.length > 0) {
                var list = {};
                list.items = this.privItems;
                list.name = QZ_PRIVACYLIST;
                qz_instance.IM_SetPrivacyList(QZ_PRIVACYLIST, JSON.stringify(list));
                qz_instance.IM_ActivatePrivacyList(QZ_PRIVACYLIST)
            } else {
                qz_instance.IM_RemovePrivacyList(QZ_PRIVACYLIST)
            }
        };
        this.BlockUser = function (name) {
            var index = this.GetIndexByValue(name);
            if (index > -1) {
                this.privItems[index].action = PrivAction.Deny
            } else {
                var jid = new JID(name.toLowerCase());
                var obj = {
                    "type": "jid",
                    "action": PrivAction.Deny,
                    "packet": 15,
                    "value": jid.bare
                };
                var pitem = new PrivacyItem(obj);
                this.AddItem(pitem)
            }
            this.SaveList()
        };
        this.UnblockUser = function (name) {
            var index = this.GetIndexByValue(name);
            var jid = new JID(name.toLowerCase());
            this.RemoveItemByValue(jid.bare);
            this.SaveList()
        }
    };

    function PrivacyItem(item) {
        this.action = item.action;
        this.packet = item.packet;
        this.type = item.type;
        this.value = item.value
    };
    var roster = module.roster = new Roster();
    var privlist = module.privlist = new PrivacyList(QZ_PRIVACYLIST);
    module.Init = function () {
        var html = "<div id='im'>" + "</div>";
        module.node = $(html)
    };
    module.LAYOUT = 'postlogin';
    module.TITLE = 'Friends';
    module.ShowContent = function (content) {
        $('#qlv_contentBody').html(content);
        var emptymsg = '';
        switch (quakelive.pathParts[1]) {
        case 'manage':
            emptymsg = 'No Friends to Manage';
            module.UI_SetupEmptyMessage(emptymsg);
            module.LoadManageItems();
            break;
        case 'incoming':
            emptymsg = 'No Invites Received';
            module.UI_SetupEmptyMessage(emptymsg);
            module.LoadIncoming();
            break;
        case 'outgoing':
            emptymsg = 'No Invites Outstanding';
            module.UI_SetupEmptyMessage(emptymsg);
            module.LoadOutgoing();
            break;
        case 'search':
            if (quakelive.pathParts[2]) {
                switch (quakelive.pathParts[2]) {
                case 'email':
                    module.UI_SetupSearchContacts();
                    break;
                case 'invite':
                    module.UI_SetupInvite();
                    break
                }
            } else {
                module.UI_SetupSearchKeyword()
            }
            break;
        case 'unblock':
            emptymsg = 'No Players Blocked';
            module.UI_SetupEmptyMessage(emptymsg);
            module.LoadBlockItems();
            break
        }
    };
    module.LoadManageItems = function () {
        if (roster.fullRoster.length == 0) {
            $("#fr_empty").show()
        } else {
            for (var i = 0; i < roster.fullRoster.length; i++) {
                if (roster.fullRoster[i].IsSubscribed()) {
                    module.UI_AddManagedItem(roster.fullRoster[i])
                }
            }
        }
    };
    module.LoadIncoming = function () {
        $.ajax({
            url: '/friends/outgoing/items',
            type: 'POST',
            data: {
                users: JSON.stringify(roster.GetIncomingValues())
            },
            dataType: 'json',
            success: function (json) {
                if (json.ECODE == 0) {
                    if (json.PENDING.length == 0) {
                        $("#fr_empty").show()
                    } else {
                        for (var i = 0; i < json.PENDING.length; i++) {
                            module.UI_AddIncomingItem(json.PENDING[i])
                        }
                    }
                }
            }
        })
    };
    module.LoadOutgoing = function () {
        $.ajax({
            url: '/friends/outgoing/items',
            type: 'POST',
            data: {
                users: JSON.stringify(roster.GetOutgoingValues())
            },
            dataType: 'json',
            success: function (json) {
                if (json.ECODE == 0) {
                    if (json.PENDING.length == 0) {
                        $("#fr_empty").show()
                    } else {
                        for (var i = 0; i < json.PENDING.length; i++) {
                            module.UI_AddOutgoingItem(json.PENDING[i])
                        }
                    }
                }
            }
        })
    };
    module.LoadBlockItems = function () {
        if (privlist.privItems.length > 0) {
            $.ajax({
                url: '/friends/unblock/items',
                type: 'POST',
                data: {
                    users: JSON.stringify(privlist.GetValueList())
                },
                dataType: 'json',
                success: function (json) {
                    if (json.ECODE == 0) {
                        if (json.BLOCKED.length == 0) {
                            $("#fr_empty").show()
                        } else {
                            for (var i = 0; i < json.BLOCKED.length; i++) {
                                module.UI_AddBlockedItem(json.BLOCKED[i])
                            }
                        }
                    }
                }
            })
        } else {
            $("#fr_empty").show()
        }
    };
    module.FitToParent = function () {
        var elemStaticHeight = {
            '#im-body': 250,
            '#im-overlay-body': 116,
            '#im-userreg': 0
        };
        var parentHeight = module.node.parent().innerHeight();
        for (var elemId in elemStaticHeight) {
            var h = (parentHeight - elemStaticHeight[elemId]);
            if (elemId == '#im-userreg' && h < 550) {
                h = 458
            }
            module.node.find(elemId).css("height", h + "px")
        }
    };
    module.MoveTo = function (nodeId) {
        var node = $(nodeId);
        if (module.node.parentNode) {
            module.node.remove()
        }
        module.node.appendTo(node);
        setTimeout(function () {
            module.FitToParent()
        },
        100)
    };
    module.IsOnRoster = function (name) {
        return roster.GetIndexByName(name) != -1
    };
    module.IsBlocked = function (name) {
        if (!privlist.privItems.length > 0) return false;
        var lowName = name.toLowerCase();
        var jid = new JID(lowName);
        var item = privlist.GetItemByValue(jid.bare);
        if (item != null) {
            if (item.type == "jid" && item.value == jid.bare) return true
        }
        return false
    };
    module.BlockPlayer = function (name) {
        privlist.BlockUser(name + '@' + quakelive.siteConfig.xmppDomain)
    };
    module.UnblockPlayer = function (name) {
        privlist.UnblockUser(name + '@' + quakelive.siteConfig.xmppDomain)
    };
    module.GetRecentPlayers = function () {
        $.ajax({
            url: '/friends/recent',
            dataType: 'json',
            success: function (json) {
                if (json["PLAYERS"] != "NO_DATA") {
                    var arr = json["PLAYERS"];
                    arr.sort(function (a, b) {
                        var x = a.PLAYER_NICK;
                        var y = b.PLAYER_NICK;
                        return ((x < y) ? -1 : ((x > y) ? 1 : 0))
                    });
                    for (i = 0; i < arr.length; i++) {
                        var contact = new RecentItem(json["PLAYERS"][i].PLAYER_ID, json["PLAYERS"][i].PLAYER_NICK, json["PLAYERS"][i].STATUS, json["PLAYERS"][i].DATE_MET, json["PLAYERS"][i].PUBLIC_ID);
                        contact.UI_PlaceInGroup(Groups.Recent)
                    }
                }
            }
        })
    };
    module.ImportRosterData = function () {
        $.ajax({
            url: '/friends/manage/items',
            dataType: 'json',
            success: roster.ImportRosterData
        })
    };
    module.ValidateSubscribe = function (name) {
        $.ajax({
            url: '/friends/validate/' + name,
            dataType: 'text',
            mode: 'queue',
            port: 'friends',
            success: function (text) {
                if (text > 0) {
                    quakelive.mod_friends.Subscribe(name)
                }
            }
        })
    };
    module.SendMailInvites = function () {
        var valid = validateMailInvites();
        if (valid) {
            var ar = new Array();
            $('.qlv_inviteEmails > input').each(function (i) {
                if ($(this).val().length > 0) {
                    ar.push($(this).val())
                }
            });
            $.ajax({
                url: '/friends/mail',
                type: 'POST',
                dataType: 'json',
                data: 'emails=' + JSON.stringify(ar) + '&subject=' + $('.qlv_inviteSubject').val() + '&msg=' + $('.qlv_inviteMessage').val(),
                success: function (json) {
                    sentMailInvites()
                }
            })
        } else {
            $('.qlv_title:eq(1)').show()
        }
    };

    function sentMailInvites() {
        if ($('.qlv_inviteEmails > input').length == 1) {
            $('.qlv_title:eq(1)').text('Invite sent!')
        } else {
            $('.qlv_title:eq(1)').text('Invites sent!')
        }
        $('.qlv_title:eq(1)').show();
        $('.qlv_inviteEmails > input:gt(0)').remove();
        $('.qlv_inviteEmails > input:eq(0)').val('');
        $('.qlv_inviteSubject').val('');
        $('.qlv_inviteMessage').val('')
    };

    function validateMailInvites() {
        var valid = true;
        var count = 0;
        $('.qlv_inviteEmails > input').each(function (i) {
            if ($(this).val().length > 0) {
                if (!isEmailValid($(this).val())) {
                    valid = false;
                    $(this).effect("highlight", {
                        color: "#FF0000"
                    },
                    3000)
                }
                count++
            }
        });
        if (count == 0) {
            valid = false;
            $('.qlv_title:eq(1)').text('Entering an email address is the point of this procedure.')
        } else if (!valid) {
            $('.qlv_title:eq(1)').text('The following don\'t seem to be email addresses.')
        }
        return valid
    };
    module.SendSearchKeywordRequest = function (val, field) {
        $.ajax({
            url: '/friends/search_items/' + val + '/100/1/' + field,
            dataType: 'json',
            success: function (json) {
                if (json["ECODE"] == 0) {
                    var msg = json["MSG"];
                    var odd = true;
                    $('.qlv_resultsTable > tbody').empty();
                    $('.qlv_searchFormResultsSummary').text(msg.length + ' Member(s) found containing "' + jQuery.trim($('.qlv_keywordInput').val()) + '".');
                    $('.qlv_keywordInput').val('');
                    if (msg.length > 0) {
                        $('.qlv_resultsListNA').hide()
                    } else {
                        $('.qlv_resultsListNA').show()
                    }
                    for (var i = 0; i < msg.length; i++) {
                        var rec;
                        if (odd == true) {
                            rec = $('<tr class="odd"></tr>')
                        } else {
                            rec = $('<tr></tr>')
                        }
                        var icons = new PlayerIconSet(msg[i].MODEL, msg[i].SKIN);
                        rec.append('<td></td>');
                        rec.find('td').append(icons.small);
                        rec.append('<td>' + msg[i].PLAYER_NICK + '</td>');
                        if (msg[i].STATUS == 1) {
                            rec.append('<td><img alt="" src="' + quakelive.resource('/images/sf/friends/online_icon.gif') + '"/></td>')
                        } else {
                            rec.append('<td></td>')
                        }
                        rec.append('<td>' + FormatTimeDelta(msg[i].LAST_ONLINE) + '</td>');
                        rec.append('<td>' + msg[i].FNAME + '</td>');
                        rec.append('<td><a class="qlv_btnSearchView" href="javascript:;" onclick="quakelive.Goto(\'profile/summary/' + msg[i].PLAYER_NICK + '\'); return false" /></td>');
                        if (module.IsOnRoster(msg[i].PLAYER_NICK.toLowerCase()) || msg[i].PLAYER_NICK.toLowerCase() == quakelive.username.toLowerCase()) {
                            rec.append('<td><img alt="" src="' + quakelive.resource('/images/sf/friends/plus_icon_gray.gif') + '"/></td>')
                        } else {
                            var node = $('<a class="qlv_btnSearchAdd" href="javascript:;" onclick="quakelive.mod_friends.Subscribe(\'' + msg[i].PLAYER_NICK.toLowerCase() + '\');" />');
                            node.click(function () {
                                $(this).parent('td').parent('tr').effect("pulsate", {
                                    times: 1
                                },
                                1000);
                                $(this).replaceWith('<img src="' + quakelive.resource('/images/sf/friends/plus_icon_gray.gif') + '"/>');
                                $(this).attr('onclick', '');
                                $(this).unbind();
                                return false
                            });
                            var td = $('<td></td>').append(node);
                            rec.append(td)
                        }
                        $('.qlv_resultsTable > tbody').append(rec);
                        odd == true ? odd = false : odd = true
                    }
                }
            }
        })
    };
    module.AnswerSubscriptionRequest = function (jid, allow) {
        var name = jid.split('@')[0];
        if (allow) {} else {}
        var reqs = roster.pendingRequests;
        var index = 0;
        for (; index < reqs.length; ++index) {
            if (reqs[index].username == name) {
                break
            }
        }
        roster.pendingRequests = RemoveArrayIndex(reqs, index);
        if (quakelive.pathParts[0] == "friends" && (quakelive.pathParts[1] == "incoming" || quakelive.pathParts[1] == "outgoing")) {
            module.UI_RemoveItem(jid)
        }
        qz_instance.IM_AnswerSubscribeRequest(name, allow ? 1 : 0)
    };
    module.Subscribe = function (name) {
        if (name.toLowerCase() != quakelive.username.toLowerCase()) {
            qz_instance.IM_Subscribe(name)
        }
    };
    module.Unsubscribe = function (who) {
        var jid = new JID(who);
        qz_instance.IM_Unsubscribe(jid.bare)
    };

    function GetRemoteRoster() {
        var roster_json = qz_instance.IM_GetRoster();
        return quakelive.Eval(roster_json) || {}
    };
    module.IM_GetPrivacyListNames = function () {
        qz_instance.IM_GetPrivacyListNames()
    };
    module.IM_GetPrivacyList = function (name) {
        qz_instance.IM_GetPrivacyList(name)
    };
    module.IM_RemovePrivacyList = function (name) {
        qz_instance.IM_RemovePrivacyList(name)
    };

    function IM_SendMessage(who, msg) {
        qz_instance.IM_SendMessage(who, msg)
    };
    module.UI_SetupEmptyMessage = function (msg) {
        $('#qlv_friendListContainer').append('<p id="fr_empty" style="display:none;" class="tc thirtyPxTxt sixtypxv midGrayTxt">' + msg + '</p>')
    };
    module.UI_AddManagedItem = function (rosterItem) {
        $("#fr_empty").hide();
        var tpl = module.TPL_MANAGE_ITEM;
        tpl = jQuery(tpl);
        tpl.attr('id', rosterItem.jid.bare);
        tpl.find(".head_icon").css('background', 'url(' + quakelive.resource('/images/players/icon_lg/' + rosterItem.model + '_' + rosterItem.skin + '.jpg') + ') no-repeat');
        tpl.find(".player_name > a").html("<span class='clan'>" + StripColors(rosterItem.clan) + "</span>" + rosterItem.player_nick);
        tpl.find(".player_name > img").attr("src", quakelive.resource("/images/flags/" + rosterItem.country.toLowerCase() + ".gif"));
        tpl.find(".player_name > img").attr("title", rosterItem.country_name);
        if (rosterItem.IsOnline()) {
            tpl.find(".online").show();
            tpl.find(".info_left").html('<b>Online Now!</b>')
        } else {
            tpl.find(".info_left").html('<b>Last online:</b> <span title="' + rosterItem.last_online_date + '">' + FormatTimeDelta(rosterItem.last_online) + ' ago</span>')
        }
        if (rosterItem.bio) {
            tpl.find(".info_middle").html(rosterItem.bio)
        } else {
            tpl.find(".info_middle").html("<b>This person has no bio entered yet.  </b>");
            tpl.find(".info_middle > b").after('To view more data on this user click the "view profile" button.')
        }
        tpl.find(".head_icon").click(function () {
            quakelive.Goto("profile/summary/" + rosterItem.name)
        });
        tpl.find(".player_name > a").click(function () {
            quakelive.Goto("profile/summary/" + rosterItem.name)
        });
        tpl.find(".btn_fr_view_profile").click(function () {
            quakelive.Goto("profile/summary/" + rosterItem.name)
        });
        tpl.find(".btn_fr_delete_friend").click(function () {
            var msg = "Are you sure you want to remove this friend?";
            if (confirm(msg)) {
                module.UI_RemoveItem(rosterItem.jid.bare);
                module.Unsubscribe(rosterItem.jid.bare)
            }
        });
        $("#qlv_friendListContainer").append(tpl)
    };
    module.UI_AddIncomingItem = function (item) {
        $("#fr_empty").hide();
        var tpl = module.TPL_INCOMING_ITEM;
        tpl = jQuery(tpl);
        var jid = new JID(item.PLAYER_NICK.toLowerCase());
        tpl.attr('id', jid.bare);
        tpl.find(".head_icon").css('background', 'url(' + quakelive.resource('/images/players/icon_lg/' + item.MODEL + '_' + item.SKIN + '.jpg') + ') no-repeat');
        tpl.find(".player_name > a").html("<span class='clan'>" + StripColors(item.PLAYER_CLAN) + "</span>" + item.PLAYER_NICK);
        tpl.find(".player_name > img").attr("src", quakelive.resource("/images/flags/" + item.COUNTRY_ABBREV.toLowerCase() + ".gif"));
        tpl.find(".player_name > img").attr("title", item.COUNTRY_NAME);
        if (item.STATUS == 1) {
            tpl.find(".online").show();
            tpl.find(".info_left").html('<b>Online Now!</b>')
        } else {
            tpl.find(".info_left").html('<b>Last online:</b> <span title="' + item.LAST_ONLINE_DATE + '">' + FormatTimeDelta(item.LAST_ONLINE) + ' ago</span>')
        }
        tpl.find(".head_icon").click(function () {
            quakelive.Goto("profile/summary/" + item.PLAYER_NICK)
        });
        tpl.find(".player_name > a").click(function () {
            quakelive.Goto("profile/summary/" + item.PLAYER_NICK)
        });
        tpl.find(".btn_fr_view_profile").click(function () {
            quakelive.Goto("profile/summary/" + item.PLAYER_NICK)
        });
        tpl.find(".btn_fr_accept_invite").click(function () {
            module.AnswerSubscriptionRequest(jid.bare, true)
        });
        tpl.find(".btn_fr_decline_invite").click(function () {
            module.AnswerSubscriptionRequest(jid.bare, false)
        });
        tpl.find(".btn_fr_block_player").click(function () {
            privlist.BlockUser(jid.bare);
            module.AnswerSubscriptionRequest(jid.bare, false)
        });
        $("#qlv_friendListContainer").append(tpl)
    };
    module.UI_AddOutgoingItem = function (item) {
        $("#fr_empty").hide();
        var tpl = module.TPL_OUTGOING_ITEM;
        tpl = jQuery(tpl);
        var jid = new JID(item.PLAYER_NICK.toLowerCase());
        tpl.attr('id', jid.bare);
        tpl.find(".head_icon").css('background', 'url(' + quakelive.resource('/images/players/icon_lg/' + item.MODEL + '_' + item.SKIN + '.jpg') + ') no-repeat');
        tpl.find(".player_name > a").html("<span class='clan'>" + StripColors(item.PLAYER_CLAN) + "</span>" + item.PLAYER_NICK);
        tpl.find(".player_name > img").attr("src", quakelive.resource("/images/flags/" + item.COUNTRY_ABBREV.toLowerCase() + ".gif"));
        tpl.find(".player_name > img").attr("title", item.COUNTRY_NAME);
        if (item.STATUS == 1) {
            tpl.find(".online").show();
            tpl.find(".info_left").html('<b>Online Now!</b>')
        } else {
            tpl.find(".info_left").html('<b>Last online:</b> <span title="' + item.LAST_ONLINE_DATE + '">' + FormatTimeDelta(item.LAST_ONLINE) + ' ago</span>')
        }
        if (item.BIO) {
            tpl.find(".info_middle").html(item.BIO)
        } else {
            tpl.find(".info_middle").html("<b>This person has no bio entered yet.  </b>");
            tpl.find(".info_middle > b").after('To view more data on this user click the "view profile" button.')
        }
        tpl.find(".head_icon").click(function () {
            quakelive.Goto("profile/summary/" + item.PLAYER_NICK)
        });
        tpl.find(".player_name > a").click(function () {
            quakelive.Goto("profile/summary/" + item.PLAYER_NICK)
        });
        tpl.find(".btn_fr_view_profile").click(function () {
            quakelive.Goto("profile/summary/" + item.PLAYER_NICK)
        });
        tpl.find(".btn_fr_revoke_invite").click(function () {
            module.UI_RemoveItem(jid.bare);
            module.Unsubscribe(jid.bare)
        });
        $("#qlv_friendListContainer").append(tpl)
    };
    module.UI_AddBlockedItem = function (item) {
        $("#fr_empty").hide();
        var tpl = module.TPL_BLOCK_ITEM;
        tpl = jQuery(tpl);
        var jid = new JID(item.PLAYER_NICK.toLowerCase());
        tpl.attr('id', jid.bare);
        tpl.find(".head_icon").css('background', 'url(' + quakelive.resource('/images/players/icon_gray_lg/' + item.MODEL + '_' + item.SKIN + '.jpg') + ') no-repeat');
        tpl.find(".player_name > a").text(StripColors(item.PLAYER_CLAN) + item.PLAYER_NICK);
        tpl.find(".player_name > img").attr("src", quakelive.resource("/images/flags/" + item.COUNTRY_ABBREV.toLowerCase() + ".gif"));
        tpl.find(".player_name > img").attr("title", item.COUNTRY_NAME);
        if (item.STATUS == 1) {
            tpl.find(".online").show();
            tpl.find(".info_left").html('<b>Online Now!</b>')
        } else {
            tpl.find(".info_left").html('<b>Last online:</b> <span title="' + item.LAST_ONLINE_DATE + '">' + FormatTimeDelta(item.LAST_ONLINE) + ' ago</span>')
        }
        if (item.BIO) {
            tpl.find(".info_middle").html(item.BIO)
        } else {
            tpl.find(".info_middle").html("<b>This person has no bio entered yet.  </b>");
            tpl.find(".info_middle > b").after('To view more data on this user click the "view profile" button.')
        }
        tpl.find(".head_icon").click(function () {
            quakelive.Goto("profile/summary/" + jid.username)
        });
        tpl.find(".player_name > a").click(function () {
            quakelive.Goto("profile/summary/" + jid.username)
        });
        tpl.find(".btn_fr_view_profile").click(function () {
            quakelive.Goto("profile/summary/" + jid.username)
        });
        tpl.find(".btn_fr_unblock_player").click(function () {
            privlist.UnblockUser(jid.bare);
            module.UI_RemoveItem(jid.bare)
        });
        $("#qlv_friendListContainer").append(tpl)
    };
    module.UI_RemoveItem = function (name) {
        $('div[id="' + name + '"]').remove();
        if ($("#qlv_friendListContainer").children("div").length == 0) {
            $("#fr_empty").show()
        }
    };
    module.REMOTE_CONTACTS = new Array();
    module.LOCAL_CONTACTS = new Array();
    module.InviteRemoteContacts = function (emails) {
        if (emails.length > 0) {
            $.ajax({
                url: '/friends/social/invite',
                type: 'POST',
                dataType: 'json',
                data: 'emails=' + emails,
                success: module.UI_RemoteInviteSuccess
            })
        }
    };
    module.UI_RemoteInviteSuccess = function (json) {
        var msg = '';
        if (json.COUNT == 0 || json.COUNT > 1) msg = json.COUNT + ' Invites Sent';
        else msg = json.COUNT + ' Invite Sent';
        $('.qlv_resultsListNA').text(msg);
        setTimeout(function () {
            self.close()
        },
        4000)
    };
    module.UI_ResetContactSearch = function () {
        quakelive.Goto("friends/social");
        module.LOCAL_CONTACTS = [];
        module.REMOTE_CONTACTS = []
    };
    module.IsLocalContact = function (email) {
        var rosterIndex = -1;
        var lcEmail = email.toLowerCase();
        for (var i = 0; i < module.LOCAL_CONTACTS.length; ++i) {
            if (module.LOCAL_CONTACTS[i].EMAIL.toLowerCase() == lcEmail) {
                rosterIndex = i;
                break
            }
        }
        return rosterIndex
    };
    module.UI_SearchContactRemote = function () {
        var tpl = module.TPL_SEARCH_EMAIL_REMOTE;
        var remote = module.REMOTE_CONTACTS;
        var odd = true;
        $('.qlv_resultsBody').empty();
        $('.qlv_resultsBody').html(tpl);
        $('#qlv_selectAllEmail').click(function () {
            if ($('#qlv_selectAllEmail').attr('checked') == true) {
                $('.qlv_emailInviteItem:not(:disabled)').attr('checked', true)
            } else if ($('#qlv_selectAllEmail').attr('checked') == false) {
                $('.qlv_emailInviteItem:not(:disabled)').attr('checked', false)
            }
        });
        $('.qlv_invitebutton').click(function () {
            var ar = new Array();
            $('.qlv_emailInviteItem:checked').each(function (i) {
                ar.push(this.value)
            });
            $('.qlv_resultsListNA').text('Sending Invites');
            $('.qlv_resultsListNA').show();
            $('.qlv_resultsTable').hide();
            module.InviteRemoteContacts(JSON.stringify(ar));
            module.REMOTE_CONTACTS = [];
            module.LOCAL_CONTACTS = []
        });
        $('.qlv_skipbutton > a').click(function () {
            self.close()
        });
        for (var i = 0; i < remote.length; i++) {
            if (module.IsLocalContact(remote[i].email) < 0) {
                var rec = $('<tr></tr>');
                if (odd == true) rec.addClass('odd');
                rec.append('<td width="39"><div align="center"><input type="checkbox" value="' + remote[i].email + '" class="qlv_emailInviteItem" /></div></td>');
                rec.append('<td></td>');
                rec.append('<td width="493">' + remote[i].name + '</td>');
                rec.append('<td></td>');
                $('.qlv_resultsTable > tbody:last').append(rec);
                odd == true ? odd = false : odd = true
            }
        }
    };
    module.UI_SearchContactSuccess = function (json, network, account) {
        $('.qlv_password').val('');
        if (json["LOCAL_LENGTH"] > 0 || json["REMOTE_LENGTH"] > 0) {
            window.resizeTo(700, 800);
            window.location = "http://" + document.domain + "/friends/social/b/" + network + "/" + account + window.location.search;
            return
        } else {
            $('.qlv_resultsListNA').text('No Results');
            $('.qlv_resultsListNA').effect("highlight", {
                color: "#FF0000"
            },
            3000)
        }
    };
    module.UI_SearchContactError = function (json) {
        if (json["FIELDS"]) {
            var fields = json["FIELDS"];
            for (var i = 0; i < fields.length; i++) {
                switch (fields[i]) {
                case "account":
                    break;
                case "domain":
                    $('.qlv_email_server').effect("highlight", {
                        color: "#FF0000"
                    },
                    3000);
                    break;
                case "network":
                    break;
                case "pw":
                    $('.qlv_password').effect("highlight", {
                        color: "#FF0000"
                    },
                    3000);
                    break;
                case "user":
                    $('.qlv_email_user').effect("highlight", {
                        color: "#FF0000"
                    },
                    3000);
                    break;
                default:
                    break
                }
            }
            $('.qlv_resultsListNA').text('Error with flashing fields.')
        } else if (json["MSG"]) {
            var msg = json["MSG"];
            $('.qlv_resultsListNA').text(msg)
        }
        $('.qlv_resultsListNA').effect("highlight", {
            color: "#FF0000"
        },
        3000)
    };
    module.UI_SetupSearchContacts = function () {
        var options = {
            url: '/friends/social/search',
            type: 'POST',
            dataType: 'json',
            success: function (json) {
                if (json["ECODE"] == 0) {
                    module.UI_SearchContactSuccess(json, $('.qlv_network').val(), $('.qlv_email_user').val())
                } else {
                    module.UI_SearchContactError(json)
                }
            },
            beforeSubmit: function (data, form, options) {
                $('.qlv_resultsListNA').text('Searching...')
            }
        };
        $('#socialform').ajaxForm(options);
        $('.qlv_findFriendsBtn').click(function () {
            $('.qlv_resultsTable > tbody').empty();
            $('.qlv_resultsListNA').show();
            $('.qlv_resultsListNA').text('Searching...');
            $('#socialform').submit()
        })
    };
    module.UI_SetupContactInvite = function () {
        $('.qlv_email_user').val('');
        $('.qlv_password').val('');
        $('.qlv_network').attr('disabled', 'true');
        $('.qlv_email_user').attr('disabled', 'true');
        $('.qlv_password').attr('disabled', 'true');
        $('.qlv_findFriendsBtn').attr('disabled', 'true');
        var json = quakelive.Eval($('#contacts_json').html()) || [];
        module.LOCAL_CONTACTS = json['LOCAL'];
        module.REMOTE_CONTACTS = json['REMOTE'];
        var local = module.LOCAL_CONTACTS;
        var remote = module.REMOTE_CONTACTS;
        $('#qlv_selectAllEmail').click(function () {
            if ($('#qlv_selectAllEmail').attr('checked') == true) {
                $('.qlv_emailInviteItem:not(:disabled)').attr('checked', true)
            } else if ($('#qlv_selectAllEmail').attr('checked') == false) {
                $('.qlv_emailInviteItem:not(:disabled)').attr('checked', false)
            }
        });
        $('.qlv_invitebutton > a').click(function () {
            $('.qlv_emailInviteItem').each(function (i) {
                if (this.checked == true && this.disabled == false) {
                    var id = $(this).attr('id');
                    $(this).attr('disabled', 'true');
                    var parent = $(this).parent('td').parent('tr');
                    parent.effect("pulsate", {
                        times: 1
                    },
                    1000);
                    parent.find('.qlv_btnSearchAdd').replaceWith('<img src="' + quakelive.resource('/images/sf/friends/plus_icon_gray.gif') + '"/>');
                    module.Subscribe(id)
                }
            });
            if (module.REMOTE_CONTACTS.length > 0) module.UI_SearchContactRemote();
            return false
        });
        var odd = true;
        if (module.LOCAL_CONTACTS.length > 0) {
            $('.qlv_resultsListNA').hide();
            for (var i = 0; i < local.length; i++) {
                var rec = $('<tr></tr>');
                if (odd == true) rec.addClass('odd');
                if (local[i].STATUS == 1) rec.addClass('online');
                var icons = new PlayerIconSet(local[i].MODEL, local[i].SKIN);
                rec.append('<td><input id="' + local[i].PLAYER_NICK.toLowerCase() + '" class="qlv_emailInviteItem" type="checkbox" /></td>');
                rec.append('<td></td>');
                rec.find('td:last').append(icons.small);
                rec.append('<td>' + local[i].PLAYER_NICK + '</td>');
                if (local[i].STATUS == 1) {
                    rec.append('<td><img alt="" src="' + quakelive.resource('/images/sf/friends/online_icon.gif') + '"/></td>')
                } else {
                    rec.append('<td></td>')
                }
                rec.append('<td>' + FormatTimeDelta(local[i].LAST_ONLINE) + '</td>');
                rec.append('<td>' + local[i].FNAME + '</td>');
                rec.append('<td><a class="qlv_btnSearchView" href="javascript:;" onclick="self.opener.quakelive.Goto(\'profile/summary/' + local[i].PLAYER_NICK + '\'); return false" /></td>');
                if (self.opener.quakelive.mod_friends.IsOnRoster(local[i].PLAYER_NICK.toLowerCase()) || local[i].PLAYER_NICK.toLowerCase() == quakelive.username.toLowerCase()) {
                    rec.append('<td><img alt="" src="' + quakelive.resource('/images/sf/friends/plus_icon_gray.gif') + '"/></td>');
                    rec.find('.qlv_emailInviteItem').attr('disabled', 'true')
                } else {
                    var node = $('<a class="qlv_btnSearchAdd" href="javascript:;" onclick="self.opener.quakelive.mod_friends.Subscribe(\'' + local[i].PLAYER_NICK.toLowerCase() + '\');" />');
                    node.click(function () {
                        $(this).parent('td').parent('tr').find('.qlv_emailInviteItem').attr('disabled', 'true');
                        $(this).parent('td').parent('tr').effect("pulsate", {
                            times: 1
                        },
                        1000);
                        $(this).replaceWith('<img src="' + quakelive.resource('/images/sf/friends/plus_icon_gray.gif') + '"/>');
                        $(this).attr('onclick', '');
                        $(this).unbind();
                        return false
                    });
                    var td = $('<td></td>').append(node);
                    rec.append(td)
                }
                $('.qlv_resultsTable > tbody').append(rec);
                odd == true ? odd = false : odd = true
            }
        } else {
            module.UI_SearchContactRemote()
        }
        if (module.REMOTE_CONTACTS.length > 0) {
            $('.qlv_skipbutton').show();
            $('.qlv_skipbutton > a').click(function () {
                module.UI_SearchContactRemote()
            })
        }
    };
    module.UI_SetupInvite = function () {
        $('.qlv_plusOption > a').click(function () {
            $('.qlv_inviteEmails > input:last').after('<input type="text" class="qlv_textfield" />')
        });
        $('.qlv_invitebutton > a').click(function () {
            module.SendMailInvites()
        })
    };
    module.UI_PerformSearch = function (field) {
        var val = $('.qlv_keywordInput').val();
        if (val.length > 0) {
            module.SendSearchKeywordRequest(val, field)
        }
    };
    module.UI_SetupSearchKeyword = function () {
        $('.qlv_keywordInput').focus();
        $('.qlv_keywordButtonEmail').click(function () {
            module.UI_PerformSearch('EMAIL');
            return false
        });
        $('.qlv_keywordButtonLastName').click(function () {
            module.UI_PerformSearch('LNAME');
            return false
        });
        $('.qlv_keywordButtonNameTag').click(function () {
            module.UI_PerformSearch('PLAYER_NICK');
            return false
        })
    };
    module.UI_SortRoster = function (groupType) {
        $.each(module.node.find('#im-' + groupType + ' .itemlist div'), function (i, val) {
            $.each(module.node.find('#im-' + groupType + ' .itemlist div'), function (i, val2) {
                if ($(val).find('>span.rosteritem-name').text().toLowerCase() < $(val2).find('>span.rosteritem-name').text().toLowerCase()) {
                    $(val2).before(val)
                }
            })
        })
    };
    quakelive.AddHook('IM_OnConnected', function () {});
    quakelive.AddHook('IM_OnDisconnected', function () {});
    quakelive.AddHook('IM_OnRosterFilled', function () {
        roster.skipNotices = true;
        roster.fullRoster = [];
        module.ImportRosterData();
        module.IM_GetPrivacyList(QZ_PRIVACYLIST);
        setTimeout(function () {
            if (roster.pendingRequests.length > 0) {
                quakelive.notifier.Notify(quakelive.notifier.PendingInviteSummaryNotice(roster.pendingRequests.length))
            }
            roster.skipNotices = false
        },
        6000)
    });
    window.IM_OnMessage = function (message_json) {
        var msg = quakelive.Eval(message_json);
        var jid = new JID(msg.who);
        var contact = roster.GetContactByJID(jid);
        if (jid.username == Admins.QLive || jid.username == Admins.Broadcast || jid.username == Admins.Admin) {
            if (!contact) {
                var contact = new BroadcastItem(jid, jid.username);
                contact.UI_PlaceInGroup(Groups.Active);
                roster.AddContact(contact)
            }
        } else if (!contact) {
            return
        }
        contact.ReceivedMsg(msg.what)
    };
    window.IM_OnPresence = function (presence_json) {
        var pres = quakelive.Eval(presence_json);
        if (pres) {
            var jid = new JID(pres.who);
            var contact = roster.GetContactByJID(jid);
            if (contact) {
                var status = quakelive.Eval(pres.status);
                contact.UI_SetGameStatus(status);
                contact.presence = pres.presence;
                if (contact.CanDisplayOnRoster()) {
                    contact.UI_PlaceInGroup(Groups.Online)
                } else {
                    contact.UI_PlaceInGroup(Groups.None)
                }
                roster.UI_OnRosterUpdated()
            } else {}
        }
    };
    window.IM_OnSubscribeRequest = function (subscribe_json) {
        var req = quakelive.Eval(subscribe_json);
        roster.AddPendingRequest(req);
        if (!roster.skipNotices) {
            var jid = new JID(req.jid);
            $.ajax({
                url: '/friends/details/' + jid.username,
                dataType: 'json',
                success: function (json) {
                    var modelskin = (json.MODEL + "_" + json.SKIN).toLowerCase();
                    quakelive.notifier.Notify(quakelive.notifier.PendingInviteNotice(req.jid, json.PLAYER_NICK, modelskin));
                    if (quakelive.pathParts[0] == "friends" && quakelive.pathParts[1] == "incoming") module.UI_AddIncomingItem(json)
                }
            })
        }
    };
    window.IM_OnItemAdded = function (json) {
        var jsob = quakelive.Eval(json);
        if (jsob) {
            var jid = new JID(jsob.jid);
            var contact = new RosterItem(jid, jid.username, S10nType.None, PresType.Unavailable);
            $.ajax({
                url: '/friends/details/' + jsob.jid.split('@')[0],
                dataType: 'json',
                success: function (json) {
                    if (json.ECODE == 0) {
                        contact.UpdateDetails(json)
                    } else {}
                }
            });
            roster.AddContact(contact)
        }
    };
    window.IM_OnItemRemoved = function (json) {
        var jsob = quakelive.Eval(json);
        if (jsob) {
            roster.RemoveContactByJID(new JID(jsob.jid));
            roster.UI_OnRosterUpdated();
            if (quakelive.pathParts[0] == "friends" && quakelive.pathParts[1] == "manage") {
                module.UI_RemoveItem(jsob.jid);
                if (roster.fullRoster.length < 1) {
                    quakelive.Goto('friends/search')
                }
            }
            quakelive.SendModuleMessage('IM_OnRosterChanged')
        }
    };
    window.IM_OnItemSubscribed = function (json) {
        var jsob = quakelive.Eval(json);
        if (jsob) {
            var contact = roster.GetContactByJID(new JID(jsob.jid));
            if (!contact) {
                return
            }
            contact.subscription = jsob.subscription;
            roster.UI_Show();
            roster.UI_OnRosterUpdated();
            if (quakelive.pathParts[0] == "friends" && quakelive.pathParts[1] == "manage") {
                module.UI_AddManagedItem(contact)
            }
            quakelive.SendModuleMessage('IM_OnRosterChanged')
        }
    };
    window.IM_OnItemUnsubscribed = function (json) {
        var jsob = quakelive.Eval(json);
        if (jsob) {
            var contact = roster.GetContactByJID(new JID(jsob.jid));
            if (!contact) {
                return
            }
            contact.subscription = jsob.subscription;
            roster.UI_OnRosterUpdated();
            contact.UI_PlaceInGroup(Groups.None);
            quakelive.SendModuleMessage('IM_OnRosterChanged')
        }
    };
    window.IM_OnItemUpdated = function (json) {
        var jsob = quakelive.Eval(json);
        if (jsob) {
            var contact = roster.GetContactByJID(new JID(jsob.jid));
            if (!contact) {
                return
            }
            contact.subscription = jsob.subscription;
            if (contact.subscription == S10nType.Both) {
                if (contact.CanDisplayOnRoster()) {
                    contact.UI_PlaceInGroup(Groups.Online)
                }
                roster.UI_OnRosterUpdated()
            } else {
                if (contact.subscription == S10nType.NoneOut || contact.subscription == S10nType.NoneOutIn) {}
            }
            quakelive.SendModuleMessage('IM_OnRosterChanged')
        }
    };
    window.IM_OnPrivacyNames = function (json) {};
    window.IM_OnPrivacyList = function (json) {
        privlist.ImportPrivList(quakelive.Eval(json) || null)
    };
    window.IM_OnPrivacyChanged = function (name) {
        module.IM_GetPrivacyList(name)
    };
    window.IM_OnPrivacyResult = function (json) {
        var result = quakelive.Eval(json) || {};
        switch (result["result"]) {
        case PrivResult.StoreSuccess:
            if (privlist.privItems.length == 0) {
                module.IM_GetPrivacyList(QZ_PRIVACYLIST)
            }
            break;
        case PrivResult.ActivateSuccess:
            break;
        case PrivResult.DefaultSuccess:
            break;
        case PrivResult.RemoveSuccess:
            PrivActiveList = null;
            break;
        case PrivResult.ItemNotFound:
            PrivActiveList = null;
            break
        }
    };
    window.IM_OnSelfPresence = function (json) {};
    window.IM_OnConnectFail = function () {
        var html = "We're sorry, but it appears you are having problems connecting to the QUAKE LIVE network. If you are behind a firewall you must make sure that it permits the following connection:<br /><br />Protocol: TCP<br />Host: " + quakelive.siteConfig.xmppDomain + "<br />Port: 5222<br /><br />Contact your network administrator for further instructions, or visit the <a href='/forum/'>QUAKE LIVE forums</a> to look for help.<br /><br />Click <b>reload</b> to try again or <a href='javascript:;' onclick='quakelive.Logout(); return false'>click here</a> to log out.</p>";
        var timeDelta = (new Date().getTime() - quakelive.initTime) / 1000;
        $.post('/user/xmpp_connect_fail/' + quakelive.userstatus + '/' + OSGetName() + '/' + BrowserGetName() + '/' + quakelive.userid + '/' + timeDelta);
        quakelive.TrackPageView('/user/xmpp_connect_fail/' + quakelive.userstatus + '/' + quakelive.userid);
        qlPrompt({
            title: 'XMPP Connection Failure',
            body: html,
            fatal: true
        })
    };
    window.IM_OnKicked = function () {
        window.onbeforeunload = undefined;
        quakelive.ShutdownGame();
        quakelive.PageRedirect('/user/logout/kicked')
    };
    module.OnVidRestart = function () {
        if (parseInt(quakelive.cvars.Get('r_fullscreen').value) !== 0) {
            $('#qlv_game_mode_chatlist').hide()
        } else {
            $('#qlv_game_mode_chatlist').show()
        }
    };
    module.OnGameStarted = function () {
        module.OnVidRestart()
    };
    quakelive.RegisterModule('friends', module)
})(jQuery);
(function ($) {
    var module = {};
    var stepStage = 0;

    function nextStage() {
        $('#step' + stepStage).slideDown('fast', function () {
            $('#step' + stepStage + '_c').fadeIn('fast', function () {
                if (stepStage++<2) {
                    setTimeout(nextStage, 800)
                }
            })
        })
    }
    module.OnOverlayLoaded = function (params) {
        if (params[0] == 'install') {
            stepStage = 0;
            setTimeout(nextStage, 500)
        }
    };
    quakelive.RegisterModule('install', module)
})(jQuery);
(function ($) {
    var module = {};
    module.Init = function () {};
    module.LAYOUT = 'postlogin';
    quakelive.AddHook('OnCharacterChanged', function (index) {
        module.UI_ChangeCharacter(index)
    });
    module.UI_ChangeCharacter = function (index) {
        var mi = quakelive.mod_prefs.models.MODELS[index];
        var details = quakelive.mod_prefs.models.DETAILS[mi.DETAILS_ID] || {
            RACE: '',
            DESC: ''
        };
        $('#qlv_MainContent').find('.characterImg > img').attr('src', quakelive.resource('/images/players/body_lg/' + mi.MODEL + '_' + mi.SKIN + '.png'));
        $('#qlv_MainContent').find('.charTypeLarge').text(mi.NAME.substr(0, 1).toUpperCase() + mi.NAME.substr(1));
        $('#qlv_MainContent').find('.charType > img').attr('src', quakelive.resource('/images/player_races/' + details.RACE + '.png'));
        $('#qlv_MainContent').find('.charProfile').text(details.DESC)
    };
    module.FocusField = function () {
        var helpNode = $('#help_' + this.id);
        if (helpNode.find('.error').size() == 0 && helpNode.find('.success').size() == 0) {
            helpNode.addClass('lgrayBack').addClass('lgrayBorder').removeClass('transBorder').find('.help').show()
        }
    };
    module.BlurField = function () {
        var helpNode = $('#help_' + this.id);
        if (helpNode.find('.error').size() == 0 && helpNode.find('.success').size() == 0) {
            helpNode.removeClass('lgrayBack').removeClass('lgrayBorder').addClass('transBorder').find('.help').hide()
        }
    };
    module.ShowContent = function (content) {
        switch (quakelive.pathParts[1]) {
        case 'edit':
            module.UI_SetupEditAccount(content);
            break;
        case 'delete':
            module.UI_SetupDeleteProfile(content);
            break
        }
    };
    var lastChosenReason = 0;
    module.UI_SetupDeleteProfile = function (content) {
        $('#qlv_contentBody').html(content).find("input,textarea").focus(module.FocusField).blur(module.BlurField);
        $('#qlv_contentBody').find("input[type='radio']").click(function () {
            lastChosenReason = $(this).val()
        });
        $('#deletebtn').click(function () {
            if (!lastChosenReason) {
                alert("You must choose a reason before you can deactivate.");
                return
            }
            if (confirm("Are you sure you want to deactivate your account?")) {
                var data = {
                    reason: lastChosenReason,
                    password: $('#pw').val(),
                    comments: $('#comments').val()
                };
                $.ajax({
                    url: '/user/delete/zap',
                    type: 'post',
                    data: data,
                    dataType: 'json',
                    success: function (json) {
                        if (json["ECODE"] == 0) {
                            quakelive.PageRedirect("/user/logout/deleted")
                        }
                    }
                })
            }
        });
        $('#cancelbtn').click(function () {
            alert("Thanks for reconsidering!");
            quakelive.Goto('home')
        })
    };
    module.UI_SetupEditAccount = function (content) {
        $('#qlv_contentBody').html(content).find("input,textarea").focus(module.FocusField).blur(module.BlurField);
        $('#state').find('option[value="' + $("#edit_hstate").val() + '"]').attr('selected', true);
        $('#country').find('option[value="' + $("#edit_hcountry").val() + '"]').attr('selected', true);
        $('#day').find('option[value="' + $("#edit_hday").val() + '"]').attr('selected', true);
        $('#month').find('option[value="' + $("#edit_hmonth").val() + '"]').attr('selected', true);
        $('#year').find('option[value="' + $("#edit_hyear").val() + '"]').attr('selected', true);
        $('input[name="shirtSize"][value="' + $("#edit_htsize").val() + '"]').attr('checked', true);
        var maxlen = 500;
        var remainder = maxlen - $('#bio').val().length;
        $('#help_bio > span').html("&nbsp;" + remainder + " Characters");
        $('#bio').keyup(function () {
            var $bio = $(this).val();
            var $rem = maxlen - $('#bio').val().length;
            $('#help_bio > span').html("&nbsp;" + $rem + " Characters")
        });
        if (quakelive.cvars.GetIntegerValue("web_chattimestamps")) {
            $('#web_chattimestamps').attr('checked', 'checked')
        }
        if (quakelive.cvars.GetIntegerValue("web_skipLauncher")) {
            $('#web_skiplauncher').attr('checked', 'checked')
        }
        $('#updatebtn').click(function () {
            module.SendAccountEdit()
        })
    };
    module.SendAccountEdit = function () {
        var latchedChat = ($('#web_chattimestamps').attr('checked')) ? 1 : 0;
        var latchedSkip = ($('#web_skiplauncher').attr('checked')) ? 1 : 0;
        quakelive.cvars.Set('web_chattimestamps', latchedChat);
        quakelive.cvars.Set('web_skiplauncher', latchedSkip);
        $.ajax({
            url: '/user/update',
            type: 'POST',
            data: $("#profile_form").formToArray(),
            dataType: 'json',
            success: function (json) {
                module.ClearFields();
                if (json["ECODE"] == 0) {
                    module.EditSuccess(json);
                    SetCvar('clan', $('#clantag').val())
                } else {
                    module.EditFail(json)
                }
            }
        })
    };
    module.EditSuccess = function (json) {
        quakelive.userinfo.IGNORED_NOTICES = json.IGNORED_NOTICES;
        quakelive.notifier.LoadFilters();
        for (var fieldName in json.FIELDS) {
            $('#help_' + fieldName + ' .error').remove();
            $('#help_' + fieldName + ' .success').remove();
            $('#help_' + fieldName).append("<span class='success'>" + json.FIELDS[fieldName] + "</span>");
            module.StyleAsSuccess(fieldName)
        }
    };
    module.EditFail = function (err) {
        for (var fieldName in err.ERRORS) {
            $('#help_' + fieldName + ' .error').remove();
            $('#help_' + fieldName + ' .success').remove();
            $('#help_' + fieldName).append("<span class='error'>" + err.ERRORS[fieldName] + "</span>");
            module.StyleAsError(fieldName)
        }
    };
    var specialErrorIds = ['bio', 'shirtSize'];
    var selectErrorIds = ['birthdate', 'country'];
    module.StyleAsError = function (id) {
        $('#wrap_' + id).addClass('orangeBorder');
        $('#label_' + id).addClass('orangeTxt');
        $('#help_' + id).addClass('orangeBack').addClass('orangeBorder')
    };
    module.StyleAsSuccess = function (id) {
        $('#wrap_' + id).addClass('greenBorder');
        $('#label_' + id).addClass('greenTxt');
        $('#help_' + id).addClass('greenBack').addClass('greenBorder')
    };
    module.StyleAsDefault = function (id) {
        $('#help_' + id + ' .error').remove();
        $('#help_' + id + ' .success').remove();
        $('#wrap_' + id).removeClass('orangeBorder');
        $('#wrap_' + id).removeClass('greenBorder');
        $('#label_' + id).removeClass('orangeTxt');
        $('#label_' + id).removeClass('greenTxt');
        $('#help_' + id).removeClass('orangeBack').removeClass('orangeBorder');
        $('#help_' + id).removeClass('greenBack').removeClass('greenBorder')
    };
    module.ClearFields = function () {
        $('#profile_form').find('input').each(function () {
            module.StyleAsDefault(this.id)
        });
        for (var index in selectErrorIds) {
            module.StyleAsDefault(selectErrorIds[index])
        }
        for (var index in specialErrorIds) {
            $('#error_' + specialErrorIds[index]).empty();
            $('#label_' + specialErrorIds[index]).removeClass('orangeTxt');
            $('#label_' + specialErrorIds[index]).removeClass('greenTxt')
        }
    };

    function OnResetFormSubmitted(responseText, statusText) {
        if (responseText != null && responseText.ECODE == 0) {
            quakelive.Overlay("user/forgot/validate")
        } else {
            $('#page-forgot-error').show().html(responseText ? responseText.MSG : 'Unknown Error - Try again');
            setTimeout(function () {
                $('#page-forgot-error').html('&nbsp;')
            },
            10000)
        }
    }
    module.SubmitPasswordReset = function () {
        var options = {
            url: '/user/forgot/handlereset',
            success: OnResetFormSubmitted,
            dataType: 'json',
            clearForm: false
        };
        $("#forgotform").ajaxSubmit(options)
    };

    function OnValidateFormSubmitted(responseText, statusText) {
        if (responseText != null && responseText.ECODE == 0) {
            quakelive.Overlay("user/forgot/success")
        } else {
            $('#page-forgot-error').show().html(responseText ? responseText.MSG : 'Unknown Error - Try again');
            setTimeout(function () {
                $('#page-forgot-error').html('&nbsp;')
            },
            10000)
        }
    }
    module.SubmitPasswordValidate = function () {
        var options = {
            url: '/user/forgot/handlevalidate',
            success: OnValidateFormSubmitted,
            dataType: 'json',
            clearForm: false
        };
        $("#validateform").ajaxSubmit(options)
    };
    module.SubmitLoginForm = function () {
        var email = $('#in_email').val().toLowerCase();
        var pass = $('#in_password').val();
        var remember = $('#in_remember').attr('checked') ? 1 : 0;
        var skipCompatCheck = false;
        var skipEmails = ['moztest@quakelive.com'];
        for (var index in skipEmails) {
            if (email == skipEmails[index]) {
                skipCompatCheck = true;
                break
            }
        }
        if (!skipCompatCheck && !quakelive.CheckBrowserCompat()) {
            return
        }
        var formData = {
            u: email,
            p: pass,
            r: remember
        };
        if (formData.u.length == 0 || formData.p.length == 0) {
            module.ShowLoginError("You must enter your email and password.");
            return
        }
        $.ajax({
            url: '/user/login',
            mode: 'abort',
            port: 'login',
            type: 'post',
            data: formData,
            dataType: 'json',
            error: module.SubmitLoginForm_Error,
            success: module.SubmitLoginForm_Success
        })
    };
    var loginErrorFxHandle = null;
    module.ShowLoginError = function (msg) {
        if (loginErrorFxHandle) {
            clearTimeout(loginErrorFxHandle);
            loginErrorFxHandle = null
        }
        $('#qlv_badLogin').fadeIn().html("<p>" + msg + "</p>");
        $('#qlv_badLogin p').effect('pulsate', {
            times: 1
        },
        1000);
        loginErrorFxHandle = setTimeout(function () {
            loginErrorFxHandle = null;
            $('#qlv_badLogin').fadeOut()
        },
        30000)
    };
    var DEFAULT_LOGIN_ERROR = "Unable to log in. Please try again later.";
    module.SubmitLoginForm_Error = function () {
        module.ShowLoginError(DEFAULT_LOGIN_ERROR)
    };
    module.SubmitLoginForm_Success = function (json) {
        if (typeof(json) == 'object') {
            if (json.ECODE === 0) {
                quakelive.TrackPageView('/Login');
                $('#qlv_badLogin').fadeOut();
                if (json.RESULT_CODE) {
                    quakelive.PageRedirect("/queue.php")
                } else {
                    quakelive.PageRedirect("/user/login_redirect")
                }
            } else {
                module.ShowLoginError(json.MSG || DEFAULT_LOGIN_ERROR)
            }
        } else {
            module.ShowLoginError(DEFAULT_LOGIN_ERROR)
        }
    };
    quakelive.RegisterModule('user', module)
})(jQuery);
(function ($) {
    var module = {};
    var Cache = {};

    function CacheMatchData(public_id) {
        if (!Cache[public_id]) {
            return null
        }
        return Cache[public_id].data
    }

    function LoadMatchData(public_id, game_type) {
        $.ajax({
            url: '/stats/matchdetails/' + public_id + '/' + game_type,
            dataType: 'json',
            mode: 'abort',
            port: 'matchdata',
            success: function (json) {
                Cache[public_id] = module.TPL_MATCH_SUMMARY;
                $('.match_' + public_id).html(Cache[public_id])
            },
            error: function (json) {
                Cache[public_id] = 'ERROR LOADING DATA';
                $('.match_' + public_id).html(Cache[public_id])
            }
        })
    }
    $.fn.extend({
        match_tooltip: function () {
            return this.each(function () {
                var matchdata = this.id.split("_");
                var self = this;
                $(this).tooltip({
                    extraClass: "match_" + matchdata[1],
                    bodyHandler: function () {
                        var cacheData = CacheMatchData(matchdata[1]);
                        if (cacheData) {}
                        LoadMatchData(matchdata[1], matchdata[0]);
                        return "<img src='" + quakelive.resource('/images/loader.gif') + "' width='62' height='13' />"
                    }
                })
            })
        }
    });
    module.ReloadOverallStats = function (autoDisplay) {
        function HandleSuccess(data) {
            module.ReloadOverallStats_Success(data);
            if (autoDisplay) {
                module.DisplayStatsData()
            }
        }
        $.ajax({
            type: 'get',
            url: '/stats/overall',
            success: HandleSuccess
        })
    };
    module.CanShowStats = function () {
        if (!quakelive.IsLoggedIn()) {
            return false
        }
        if (!qz_instance || qz_instance.IsGameRunning()) {
            return false
        }
        return true
    };
    module.Init = function () {
        function LoadStatsInterval() {
            if (module.CanShowStats()) {
                module.ReloadOverallStats(true)
            }
        };

        function InitialLoadStats() {
            if (module.CanShowStats()) {
                LoadStatsInterval();
                setInterval(LoadStatsInterval, 10 * 60 * 1000);
                quakelive.RemoveHook('OnLayoutLoaded', InitialLoadStats)
            }
        };
        quakelive.AddHook('OnLayoutLoaded', InitialLoadStats)
    };
    module.WpnDisplayText = {
        'GAUNTLET': "Gauntlet",
        'MACHINEGUN': "Machine Gun",
        'SHOTGUN': "Shotgun",
        'GRENADE': "Grenade Launcher",
        'ROCKET': "Rocket Launcher",
        'LIGHTNING': "Lightning Gun",
        'RAILGUN': "Railgun",
        'PLASMA': "Plasma Gun",
        'BFG': "BFG",
        'CHAINGUN': "Chaingun",
        'NAILGUN': "Nailgun",
        'PROXMINE': "Proximity Mine",
        'None': "None",
        'N/A': "N/A"
    };
    module.GameTypeDisplayText = {
        'DM': "Free For All",
        'TDM': "Team Death Match",
        'CTF': "Capture The Flag",
        'Tourney': "Duel",
        'TOURNEY': "Duel",
        'TOTAL': "TOTAL",
        'CA': "Clan Arena",
        'None': "None"
    };
    module.format_number = function (n) {
        return Number(n)
    };
    module.format_seconds = function (secs, fstr) {
        fstr = typeof(fstr) != 'undefined' ? fstr : 'hms';
        var mins = ((secs / 60) | 0) % 60;
        var nsecs = Math.round(secs % 60);
        var hours = ((secs / 3600) | 0) % 24;
        var days = (secs / 86400) | 0;
        var msg = '';
        if (fstr.search('d') >= 0) {
            msg += String(days) + 'd '
        }
        if (fstr.search('h') >= 0) {
            msg += String(hours) + 'h '
        }
        if (fstr.search('m') >= 0) {
            msg += String(mins) + 'm '
        }
        if (fstr.search('s') >= 0) {
            msg += String(nsecs) + 's '
        }
        return msg
    };
    module.FinishString = function (json) {
        var finish_str = 'TBD';

        function played_in_match() {
            if (json.PLAYER_RANK == null) {
                return false
            }
            return true
        }
        switch (json.GAME_TYPE.toLowerCase()) {
        case 'dm':
        case 'tourney':
            if (played_in_match()) {
                if (json.PLAYER_RANK != 1) {
                    if (json.PLAYER_RANK == 1) {
                        finish_str = 'Win'
                    } else {
                        finish_str = 'Loss'
                    }
                } else {
                    finish_str = 'Quit'
                }
            } else {
                finish_str = json.SCOREBOARD[0].PLAYER_NICK
            }
            break;
        case 'tdm':
        case 'ctf':
        case 'ca':
            if (played_in_match()) {
                if (json.I_COMPETED) {
                    if (json.I_WIN) {
                        finish_str = 'Win'
                    } else {
                        finish_str = 'Loss'
                    }
                } else {
                    finish_str = 'Quit'
                }
            } else {
                finish_str = json.WINNING_TEAM + ' Wins'
            }
            break;
        default:
            return finish_str
        }
        return finish_str
    };
    module.RankString = function (rank) {
        var mod100 = rank % 100;
        var mod10 = rank % 10;
        var suffix;
        if (mod10 == 1 && mod100 != 11) {
            suffix = 'st'
        } else if (mod10 == 2 && mod100 != 12) {
            suffix = 'nd'
        } else if (mod10 == 3 && mod100 != 13) {
            suffix = 'rd'
        } else {
            suffix = 'th'
        }
        return rank + suffix
    };
    module.WinString = function (winlossflag) {
        if (winlossflag == 1) {
            return 'Win'
        }
        return 'Loss'
    };
    module.StyleRank = function (rank) {
        if (rank >= 1 && rank <= 3) {
            return "<b>" + module.RankString(rank) + "</b>"
        }
        return module.RankString(rank)
    };
    module.FillQuickStats = function (container) {
        var node = $(module.TPL_QUICKSTATS);
        var details = module.quickstats.playerdetails.DETAILS[0];
        var records = module.quickstats.recordstats;
        node.find('.qlv_pltslb_title').html(quakelive.username);
        var lastMatch = details.LAST_MATCH[0];
        if (lastMatch != "None") {
            node.find('.qlv_pltslb_last_played').html('Last Played: ' + lastMatch)
        }
        node.find('.qlv_pltslb_character').css('background', 'url(' + quakelive.resource('/images/players/body_md/' + details.PLAYER_MODEL[0] + '_' + details.PLAYER_SKIN[0] + '.png') + ') no-repeat');
        var favGameType = details.FAV_GAMETYPE[0];
        if (favGameType != "None") {
            node.find('.fav_gametype_txt').html(module.GameTypeDisplayText[favGameType]);
            node.find('.fav_gametype_img').html('<div style="background: url(' + quakelive.resource('/images/gametypes/' + favGameType.toLowerCase() + '.png') + ') no-repeat center center; width: 100%; height: 100%"></div>')
        } else {
            node.find('.fav_gametype_txt').html("None");
            node.find('.fav_gametype_img').html('<div style="background: url(' + quakelive.resource('/images/gametypes/no_data_icon.png') + ') no-repeat center center; width: 100%; height: 100%"></div>')
        }
        if (details.FAV_ARENA[0] != "None") {
            node.find('.fav_map_txt').html(details.FAV_ARENA[0]);
            node.find('.fav_map_img').html('<div style="background: url(' + quakelive.resource('/images/levelshots/ci/' + details.FAV_ARENA_SYSNAME[0] + '.png') + ') no-repeat center center; width: 100%; height: 100%"></div>')
        } else {
            node.find('.fav_map_txt').html("None");
            node.find('.fav_map_img').html('<div style="background: url(' + quakelive.resource('/images/gametypes/no_data_icon.png') + ') no-repeat center center; width: 100%; height: 100%"></div>')
        }
        var favWeapon = details.FAV_WPN[0];
        if (favWeapon != "None") {
            node.find('.fav_weapon_txt').html(module.WpnDisplayText[favWeapon]);
            node.find('.fav_weapon_img').html('<div style="background: url(' + quakelive.resource('/images/weapons/3d/' + favWeapon.toLowerCase() + '.png') + ') no-repeat center center; width: 100%; height: 100%"></div>')
        } else {
            node.find('.fav_weapon_txt').html("None");
            node.find('.fav_weapon_img').html('<div style="background: url(' + quakelive.resource('/images/gametypes/no_data_icon.png') + ') no-repeat center center; width: 100%; height: 100%"></div>')
        }
        node.find('.total_games').html(FormatNumber(details.GAMES_PLAYED[0]));
        node.find('.total_frags').html(FormatNumber(details.TOTAL_KILLS[0]));
        node.find('.total_time').html(module.format_seconds(details.TIME_PLAYED[0]));
        var recordMap = {
            'tdm': 'TDM_RECORD',
            'ctf': 'CTF_RECORD',
            'dm': 'DM_RECORD',
            'duel': 'TRNY_RECORD',
            'total': 'TOTAL_RECORD'
        };
        for (var gameType in recordMap) {
            var recordIndex = recordMap[gameType];
            var rec = records[recordIndex][0];
            node.find('.played_' + gameType).html(FormatNumber(rec.GAMES_FINISHED[0]));
            node.find('.wins_' + gameType).html(FormatNumber(rec.WINS[0]))
        }
        container.empty().append(node)
    };
    module.LoadQuickStats = function (stats_playerid, container) {
        module.quickstats = {
            'playerdetails': null,
            'recordstats': null
        };
        $.getJSON('/stats/playerdetails/' + stats_playerid, null, function (json) {
            module.quickstats.playerdetails = json;
            if (module.quickstats.recordstats) {
                module.FillQuickStats(container)
            }
        });
        $.getJSON('/stats/recordstats/' + stats_playerid, null, function (json) {
            module.quickstats.recordstats = json;
            if (module.quickstats.playerdetails) {
                module.FillQuickStats(container)
            }
        })
    };
    module.overallStatsData = null;
    module.reloadCount = 0;
    module.DisplayStatsData = function () {
        var json = module.overallStatsData;
        var html = '';
        if (json) {
            var fields = {
                'NUM_PLAYERS': 'Online Players',
                'NUM_FRAGS': 'Frags Last Hour',
                'NUM_GAMES': 'Games Last Hour'
            };
            var validFields = [];
            for (var fieldName in fields) {
                if (json[fieldName] > 1) {
                    validFields[validFields.length] = fieldName
                }
            }
            if (validFields.length > 0) {
                var fieldName = validFields[module.reloadCount++%validFields.length];
                html += json[fieldName] + ' ' + fields[fieldName]
            }
        }
        $('#qlv_siteStatus').fadeOut('fast', function () {
            $('#qlv_siteStatus .front,#qlv_siteStatus .outline').html(html);
            $('#qlv_siteStatus').fadeIn()
        })
    };
    module.ReloadOverallStats_Success = function (data) {
        var json = quakelive.Eval(data);
        module.overallStatsData = json
    };
    quakelive.RegisterModule('stats', module)
})(jQuery);
(function ($) {
    var module = {};
    module.LAYOUT = 'postlogin';
    module.bFriendBoards = false;
    module.BASE_FILTERS = {
        'view': 'FRAGS',
        'startrec': 1,
        'numrecs': 50,
        'gt': 'ALL',
        'tf': '30DAY',
        'map': 'ALL',
        'ctry': 'ALL',
        'social': 'ALL'
    };
    module.SUMMARY_FILTER_ORDER = ['tf', 'ctry'];
    module.FRIEND_SUMMARY_FILTER_ORDER = ['gt', 'tf', 'map', 'ctry'];
    module.FILTER_ORDER = ['view', 'startrec', 'numrecs', 'tf', 'ctry'];
    module.FRIEND_FILTER_ORDER = ['view', 'gt', 'tf', 'map', 'ctry'];
    module.Init = function () {
        module.filter_params = $.extend({},
        module.BASE_FILTERS)
    };
    module.ShowContent = function (content) {
        $('#qlv_contentBody').html(content);
        for (var each in quakelive.params) {
            if (quakelive.params[each]) {
                module.filter_params[each] = quakelive.params[each]
            }
        }
        $('.filter').each(function () {
            $(this).val(module.filter_params[this.name])
        });
        if (quakelive.IsLoggedIn()) module.toggleSocialFilter(true);
        switch (quakelive.pathParts[1]) {
        case 'summary':
            module.filter_params['view'] = 'SUMMARY';
            $('.corner_img').each(function (index, domNode) {
                var leadNode = $(domNode);
                if (quakelive.mod_friends.IsBlocked(leadNode.attr("id"))) {
                    var imgpath = quakelive.SwapAvatarPath(leadNode.attr("style"), quakelive.PlayerAvatarPath.G_LG);
                    leadNode.attr("style", imgpath)
                }
            });
            break
        }
    };
    module.GetLoadPath = function () {
        switch (quakelive.pathParts[1]) {
        case 'friendsummary':
            var path = '/leaders/friendsummary/full';
            for (var i = 0; i < this.FRIEND_SUMMARY_FILTER_ORDER.length; ++i) path += '/' + (quakelive.params[this.FRIEND_SUMMARY_FILTER_ORDER[i]] || this.filter_params[this.FRIEND_SUMMARY_FILTER_ORDER[i]]);
            return path;
        case 'summary':
            var path = '/leaders/summary/full';
            for (var i = 0; i < this.SUMMARY_FILTER_ORDER.length; ++i) path += '/' + (quakelive.params[this.SUMMARY_FILTER_ORDER[i]] || this.filter_params[this.SUMMARY_FILTER_ORDER[i]]);
            return path;
        case 'friends':
            var path = '/leaders/friends/full';
            for (var i = 0; i < this.FRIEND_FILTER_ORDER.length; ++i) path += '/' + (quakelive.params[this.FRIEND_FILTER_ORDER[i]] || this.filter_params[this.FRIEND_FILTER_ORDER[i]]);
            return path;
        case 'details':
            var path = '/leaders/details/full';
            for (var i = 0; i < this.FILTER_ORDER.length; ++i) path += '/' + (quakelive.params[this.FILTER_ORDER[i]] || this.filter_params[this.FILTER_ORDER[i]]);
            return path
        }
    };
    module.set_filter_params = function (key, val) {
        module.filter_params[key] = val;
        if (key == 'social') {
            module.toggleGranularFilters(val)
        }
        if (key == 'gt' && val == 'ALL') module.toggleMapFilter(true);
        else if (key == 'gt' && val != 'ALL') module.toggleMapFilter(false);
        else if (key == 'map' && val == 'ALL') module.toggleGTFilter(true);
        else if (key == 'map' && val != 'ALL') module.toggleGTFilter(false);
        module.RefreshLeaderBoardView()
    };
    module.SetFilter = function (filterName) {
        $('.postlogin_nav > ul > .selected').removeClass('selected');
        $('#nav_' + filterName.toLowerCase()).addClass('selected');
        module.filter_params.startrec = 1;
        module.set_filter_params('view', filterName)
    };
    module.toggleSocialFilter = function (bEnable) {
        if (bEnable) {
            $('#ctrl_filter_social').attr('disabled', false);
            $('#ctrl_filter_social')[0].style.color = ''
        } else {
            $('#ctrl_filter_social').attr('disabled', true);
            $('#ctrl_filter_social')[0].style.color = '#aaa';
            module.filter_params['social'] = 'ALL';
            $('#ctrl_filter_social').val('ALL')
        }
    };
    module.toggleGTFilter = function (bEnable) {
        if (bEnable) {
            $('#ctrl_filter_gt').attr('disabled', false);
            $('#ctrl_filter_gt')[0].style.color = ''
        } else {
            $('#ctrl_filter_gt').attr('disabled', true);
            $('#ctrl_filter_gt')[0].style.color = '#aaa';
            module.filter_params['gt'] = 'ALL';
            $('#ctrl_filter_gt').val('ALL')
        }
    };
    module.toggleMapFilter = function (bEnable) {
        if (bEnable) {
            $('#ctrl_filter_map').attr('disabled', false);
            $('#ctrl_filter_map')[0].style.color = ''
        } else {
            $('#ctrl_filter_map').attr('disabled', true);
            $('#ctrl_filter_map')[0].style.color = '#aaa';
            module.filter_params['map'] = 'ALL';
            $('#ctrl_filter_map').val('ALL')
        }
    };
    module.toggleGranularFilters = function (val) {
        if (val == "FRIENDS") {
            module.toggleMapFilter(true);
            module.toggleGTFilter(true)
        } else {
            module.toggleMapFilter(false);
            module.toggleGTFilter(false)
        }
    };
    module.make_lb_urlhash = function (basepath) {
        var hash_parts = ['#' + basepath];
        if (module.filter_params['view'] == 'SUMMARY') return '#' + basepath;
        for (var each in module.filter_params) {
            param_string = each + '=' + module.filter_params[each];
            hash_parts.push(param_string)
        }
        return hash_parts.join(';')
    };
    module.set_lb_url = function (basepath) {
        var hash = module.make_lb_urlhash(basepath);
        quakelive.SetMonitorPath(hash);
        window.location.hash = hash;
        quakelive.ParsePath()
    };
    module.RefreshLeaderBoardView = function () {
        var view = module.filter_params['view'];
        var social = module.filter_params['social'];
        if (view.toUpperCase() == 'SUMMARY' && social.toUpperCase() == 'FRIENDS') {
            module.set_lb_url('leaders/friendsummary');
            module.LoadFriendSummaryBoards()
        } else if (view.toUpperCase() == 'SUMMARY') {
            module.set_lb_url('leaders/summary');
            module.LoadSummaryLeaderBoards()
        } else if (social.toUpperCase() == 'FRIENDS') {
            module.set_lb_url('leaders/friends');
            module.LoadFriendBoard(view.toUpperCase())
        } else {
            module.set_lb_url('leaders/details');
            module.LoadLeaderBoard(view.toUpperCase())
        }
    };
    module.LoadLeaderBoard = function (board, startRec, numRecs) {
        quakelive.ReloadVerts();
        startRec = startRec || module.filter_params.startrec;
        numRecs = numRecs || module.filter_params.numrecs;
        module.filter_params.startrec = startRec;
        module.filter_params.numrecs = numRecs;
        module.set_lb_url('leaders/details');
        var urlParts = [board, startRec, numRecs, module.filter_params.tf, module.filter_params.ctry];
        if ($('#leaderboard_data').size() > 0) {
            var requrl = '/leaders/details/part/' + urlParts.join('/');
            $.ajax({
                url: requrl,
                mode: 'abort',
                port: 'leaders',
                type: 'get',
                error: function () {
                    module.SetFindPlayerMsg("Error loading leaderboard")
                },
                success: function (data) {
                    $('#lb_section_header').attr("src", quakelive.resource("/images/sf/leaderboard/hdr_" + board.toLowerCase() + ".gif"));
                    $('#leaderboard_data').html(data)
                }
            })
        } else {
            var requrl = '/leaders/details/full/' + urlParts.join('/');
            $.ajax({
                url: requrl,
                mode: 'abort',
                port: 'leaders',
                type: 'get',
                error: function () {
                    module.SetFindPlayerMsg("Error loading leaderboard")
                },
                success: function (data) {
                    $('#qlv_contentBody').html(data)
                }
            })
        }
    };
    module.LoadSummaryLeaderBoards = function () {
        quakelive.ReloadVerts();
        module.set_lb_url('leaders/summary');
        var urlParts = [module.filter_params.tf, module.filter_params.ctry];
        if ($('#leaderboard_data').size() > 0) {
            var requrl = '/leaders/summary/part/' + urlParts.join('/');
            $.ajax({
                url: requrl,
                mode: 'abort',
                port: 'leaders',
                type: 'get',
                error: function () {
                    module.SetFindPlayerMsg("Error loading leaderboard summary")
                },
                success: function (data) {
                    $('#lb_section_header').attr("src", quakelive.resource("/images/sf/leaderboard/hdr_summary.gif"));
                    $('#leaderboard_data').html(data)
                }
            })
        } else {
            var requrl = '/leaders/summary/full/' + urlParts.join('/');
            $.ajax({
                url: requrl,
                mode: 'abort',
                port: 'leaders',
                type: 'get',
                error: function () {
                    module.SetFindPlayerMsg("Error loading leaderboard summary")
                },
                success: function (data) {
                    $('#qlv_contentBody').html(data)
                }
            })
        }
    };
    module.LoadFriendBoard = function (board) {
        if (!quakelive.IsLoggedIn()) module.LoadLeaderBoard(board);
        quakelive.ReloadVerts();
        module.set_lb_url('leaders/friends');
        var urlParts = [board, module.filter_params.gt, module.filter_params.tf, module.filter_params.map, module.filter_params.ctry];
        var friends = [];
        for (var i = 0; i < quakelive.mod_friends.roster.fullRoster.length; i++) {
            if (quakelive.mod_friends.roster.fullRoster[i].IsSubscribed()) {
                friends.push(quakelive.mod_friends.roster.fullRoster[i].player_id)
            }
        }
        if (friends.length > 0) {
            urlParts.push(Base64.encode(friends.join(',')))
        }
        if ($('#leaderboard_data').size() > 0) {
            var requrl = '/leaders/friends/part/' + urlParts.join('/');
            $.ajax({
                url: requrl,
                mode: 'abort',
                port: 'leaders',
                type: 'get',
                error: function () {
                    module.SetFindPlayerMsg("Error loading friends leaderboard")
                },
                success: function (data) {
                    $('#lb_section_header').attr("src", quakelive.resource("/images/sf/leaderboard/hdr_" + board.toLowerCase() + ".gif"));
                    $('#leaderboard_data').html(data)
                }
            })
        } else {
            var requrl = '/leaders/friends/full/' + urlParts.join('/');
            $.ajax({
                url: requrl,
                mode: 'abort',
                port: 'leaders',
                type: 'get',
                error: function () {
                    module.SetFindPlayerMsg("Error loading friends leaderboard")
                },
                success: function (data) {
                    $('#qlv_contentBody').html(data)
                }
            })
        }
    };
    module.LoadFriendSummaryBoards = function () {
        if (!quakelive.IsLoggedIn()) module.LoadSummaryLeaderBoards();
        quakelive.ReloadVerts();
        module.set_lb_url('leaders/friendsummary');
        var urlParts = [module.filter_params.gt, module.filter_params.tf, module.filter_params.map, module.filter_params.ctry];
        var friends = [];
        for (var i = 0; i < quakelive.mod_friends.roster.fullRoster.length; i++) {
            if (quakelive.mod_friends.roster.fullRoster[i].IsSubscribed()) {
                friends.push(quakelive.mod_friends.roster.fullRoster[i].player_id)
            }
        }
        if (friends.length > 0) {
            urlParts.push(Base64.encode(friends.join(',')))
        }
        if ($('#leaderboard_data').size() > 0) {
            var requrl = '/leaders/friendsummary/part/' + urlParts.join('/');
            $.ajax({
                url: requrl,
                mode: 'abort',
                port: 'leaders',
                type: 'get',
                error: function () {
                    module.SetFindPlayerMsg("Error loading friend leaderboard summary")
                },
                success: function (data) {
                    $('#lb_section_header').attr("src", quakelive.resource("/images/sf/leaderboard/hdr_summary.gif"));
                    $('#leaderboard_data').html(data)
                }
            })
        } else {
            var requrl = '/leaders/friendsummary/full/' + urlParts.join('/');
            $.ajax({
                url: requrl,
                mode: 'abort',
                port: 'leaders',
                type: 'get',
                error: function () {
                    module.SetFindPlayerMsg("Error loading friend leaderboard summary")
                },
                success: function (data) {
                    $('#qlv_contentBody').html(data)
                }
            })
        }
    };
    module.SetFindPlayerMsg = function (msg) {
        $('#find_player_msg').text(msg);
        if (msg.length > 0) {
            setTimeout(function () {
                $('#find_player_msg').fadeOut()
            },
            15000)
        }
    };
    module.FindPlayerClick = function () {
        module.SetFindPlayerMsg("");
        var view = module.filter_params['view'];
        if (view == 'SUMMARY') {
            view = 'WINS'
        }
        var player_name = $('#find_player_input').val();
        if (typeof(player_name) == 'undefined') {
            module.SetFindPlayerMsg("Missing Player Name");
            return
        }
        player_name = $.trim(player_name);
        if (player_name.length == 0) {
            module.SetFindPlayerMsg("Empty Player Name");
            return
        }
        var requrl = '/leaders/findplayer/' + player_name + '/' + view + '/' + module.filter_params.tf + '/' + module.filter_params.ctry;
        $.ajax({
            url: requrl,
            mode: 'abort',
            port: 'leaders',
            type: 'get',
            error: function () {
                module.SetFindPlayerMsg("Internal error - try again")
            },
            success: function (data) {
                $('#lb_section_header').attr("src", quakelive.resource("/images/sf/leaderboard/hdr_" + view.toLowerCase() + ".gif"));
                $('#leaderboard_data').html(data)
            }
        });
        return false
    };
    module.ToggleCustomize = function () {
        var node = $('.filterbar');
        var expanded = node.hasClass('filterbar_expanded');
        var curHeight = $('#leaderboard_data').height();
        var h = node.height();
        if (expanded) {
            node.removeClass('filterbar_expanded');
            $('#leaderboard_data').css('height', (curHeight + h) + 'px');
            $('.filterbar_toggle').removeClass('selected')
        } else {
            node.addClass('filterbar_expanded');
            $('#leaderboard_data').css('height', (curHeight + h) + 'px');
            $('.filterbar_toggle').addClass('selected')
        }
    };
    var focusCount = 0;
    var focusDefault = "";
    module.FocusFindPlayer = function (input) {
        var node = $(input);
        if (focusCount++==0) {
            focusDefault = node.val()
        }
        if (node.val() == focusDefault) {
            node.val('').removeClass('input_default')
        }
    };
    module.BlurFindPlayer = function (input) {
        var node = $(input);
        if (node.val() == '') {
            node.val(focusDefault).addClass('input_default')
        }
    };
    quakelive.RegisterModule('leaders', module)
})(jQuery);
(function ($) {
    var NOTIFY_TIMEOUT_DURATION = 60;
    var NOTIFY_ERROR_DURATION = 20;
    var GAMETYPENAMES = ["FFA", "DUEL", "SP", "TDM", "CTF", "CA"];
    var MenuStates = {
        MINIMIZED: 0,
        NORMAL: 1,
        INQUEUE: 2,
        READY: 3
    };
    var LFGStates = {
        DISABLED: 0,
        ENABLED: 1,
        IN_CANCELLED: 2,
        OUT_CANCELLED: 3,
        ACCEPTED: 4,
        DECLINED: 5
    };
    var module = {};
    module.MenuStates = MenuStates;
    var currentState = MenuStates.MINIMIZED;
    module.haveAssets = false;
    module.isConnected = true;
    module.lastLFGType = -1;
    module.lastLFGState = 0;
    module.lastLFGRequests = 0;
    module.cancelMessage = null;
    module.cancelTimeoutHandle = null;
    module.shown = false;
    module.ShowLFG = function () {
        if ($('#lfg').is(':visible')) {
            return
        }
        if (module.isConnected && module.haveAssets && quakelive.cvars.GetIntegerValue("web_skipLauncher") != 0) {
            module.UpdateLFGMessage(module.lastLFGRequests);
            module.SetQueue(module.lastLFGType, LFGStates.DISABLED, true);
            module.shown = true
        }
    };
    module.Init = function () {
        quakelive.AddHook('IM_OnConnected', function () {
            module.isConnected = true;
            module.ShowLFG()
        });
        quakelive.AddHook('OnDownloadGroup', function (params) {
            if (params.group == GROUP_EXTRA) {
                module.haveAssets = true;
                module.ShowLFG()
            }
        });
        quakelive.AddHook('OnGameExited', function () {
            if (currentState != MenuStates.MINIMIZED && currentState != MenuStates.NORMAL) {
                module.CloseGameNotify(LFGStates.DISABLED)
            }
        });
        quakelive.AddHook('OnServerListReload', function (json) {
            module.UpdateLFGMessage(json.lfg_requests)
        });
        quakelive.AddHook('OnContentLoaded', module.ShowLFG)
    };
    module.SetQueue = function (gameType, newState, bChangeState) {
        module.lastLFGType = gameType;
        module.lastLFGState = newState;
        $.ajax({
            url: '/lfg/setqueue',
            data: {
                'type': gameType,
                'state': newState
            },
            type: 'post',
            dataType: 'json',
            mode: 'abort',
            port: 'lfg_queue',
            success: function (json) {
                if (bChangeState) {
                    if (newState == LFGStates.DISABLED || newState == LFGStates.DECLINED) {
                        if (currentState == MenuStates.MINIMIZED) {
                            module.ChangeState(MenuStates.MINIMIZED)
                        } else {
                            module.ChangeState(MenuStates.NORMAL)
                        }
                    } else {
                        if (currentState == MenuStates.NORMAL || currentState == MenuStates.READY) {
                            module.ChangeState(MenuStates.INQUEUE)
                        } else {
                            module.ChangeState(MenuStates.NORMAL)
                        }
                    }
                }
            },
            error: function () {}
        })
    };
    module.UpdateLFGMessage = function (lfg_requests) {
        module.lastLFGRequests = lfg_requests;
        var msg;
        if (lfg_requests > 1) {
            msg = '<b>' + lfg_requests + '</b> players requesting games'
        } else {
            msg = 'Let us find a match for you!'
        }
        if (currentState == MenuStates.NORMAL) {
            $('#lfg_normal .footer').html(msg)
        } else if (currentState == MenuStates.MINIMIZED) {
            $('#lfg_minimized .footer').html(msg)
        }
    };
    module.CloseGameNotify = function (cancelState) {
        if (module.notifyTimeoutHandle) {
            clearTimeout(module.notifyTimeoutHandle);
            module.notifyTimeoutHandle = null
        }
        module.notifyServer = null;
        if (cancelState > -1) {
            module.SetQueue(module.lastLFGType, cancelState, true)
        } else {
            module.ChangeState(MenuStates.NORMAL)
        }
    };
    module.JoinGame = function () {
        var cmdString = '+connect ' + module.notifyServer.host_address;
        module.SetQueue(module.lastLFGType, LFGStates.ACCEPTED, false);
        LaunchGame(BuildCmdString() + cmdString, false, module.notifyServer)
    };
    module.WatchNotifyTimer = function () {
        $('#lfg').find('.timer').text(module.notifyTimeLeft);
        if (module.notifyTimeLeft == 0) {
            module.cancelMessage = "Timed out waiting for user input. You must join your match within 60 seconds of being found.";
            module.CloseGameNotify(LFGStates.DISABLED)
        } else {
            module.notifyTimeoutHandle = setTimeout(module.WatchNotifyTimer, 1000)
        }
        module.notifyTimeLeft--
    };
    module.CancelNotifyTimer = function () {
        if (module.notifyTimeoutHandle) {
            clearTimeout(module.notifyTimeoutHandle);
            module.notifyTimeoutHandle = null
        }
    };
    module.ChangeState = function (state) {
        var $lfg = $('#lfg');
        currentState = state;
        switch (state) {
        case MenuStates.MINIMIZED:
            $lfg.html(module.TPL_MODE_MINIMIZED);
            $lfg.find('.lfg_content').click(function () {
                module.ChangeState(MenuStates.NORMAL)
            });
            module.UpdateLFGMessage(module.lastLFGRequests);
            break;
        case MenuStates.NORMAL:
            $lfg.html(module.TPL_MODE_NORMAL);
            $lfg.find('ul.jd_menu').jdMenu();
            $lfg.find('.collapse_proxy').click(function () {
                module.ChangeState(MenuStates.MINIMIZED)
            });
            module.UpdateLFGMessage(module.lastLFGRequests);
            $lfg.find('.select_gt_5').click(function () {
                module.SetQueue(5, LFGStates.ENABLED, true)
            });
            var hideCancelBlurb = function () {
                $lfg.find('.cancel_blurb').hide();
                $lfg.find('.blurb').show()
            };
            if (module.cancelMessage) {
                $lfg.find('.blurb').hide();
                $lfg.find('.cancel_blurb').text(module.cancelMessage).show();
                if (module.cancelTimeoutHandle) {
                    clearTimeout(module.cancelTimeoutHandle)
                }
                module.cancelTimeoutHandle = setTimeout(hideCancelBlurb, NOTIFY_ERROR_DURATION * 1000);
                module.cancelMessage = null
            } else {
                hideCancelBlurb()
            }
            break;
        case MenuStates.INQUEUE:
            $lfg.html(module.TPL_MODE_INQUEUE);
            var stopSearch = function () {
                if (confirm("Stop searching for a Duel?")) {
                    module.SetQueue(module.lastLFGType, LFGStates.DISABLED, true)
                }
            };
            $lfg.find('.collapse_proxy, .btn_stop').click(stopSearch);
            module.UpdateLFGMessage(module.lastLFGRequests);
            break;
        case MenuStates.READY:
            $lfg.html(module.TPL_MODE_READY);
            $lfg.find('.levelshot').css('background-image', 'url(' + quakelive.resource('/images/levelshots/sm/' + module.notifyServer.map + '.jpg') + ')');
            $lfg.find('.description').text(module.notifyServer.map_title + ' / ' + module.notifyServer.game_type_title);
            $lfg.find('.play').click(module.JoinGame);
            $lfg.find('.decline').click(function () {
                module.CloseGameNotify(LFGStates.DECLINED)
            });
            quakelive.matchtip.BindMatchTooltip($('#lfg_ready_tooltip'), module.notifyServer.public_id);
            module.notifyTimeLeft = NOTIFY_TIMEOUT_DURATION;
            module.WatchNotifyTimer();
            break;
        default:
            return
        }
        $lfg.show()
    };
    window.OnLFGNotify = function (errorCode, json) {
        if (module.notifyTimeoutHandle != null) {
            return
        }
        var jsob = quakelive.Eval(json);
        server = quakelive.Eval(jsob.DATA);
        module.SetQueue(module.lastLFGType, LFGStates.ENABLED, false);
        module.notifyServer = server;
        module.ChangeState(MenuStates.READY)
    };
    window.OnLFGCancel = function (json) {
        var msg = quakelive.Eval(json);
        if (msg.MESSAGE == 'OK') {
            module.cancelMessage = null
        } else {
            module.cancelMessage = msg.MESSAGE
        }
        module.CloseGameNotify(-1)
    };
    quakelive.RegisterModule('lfg', module)
})(jQuery);
(function ($) {
    var module = {};
    module.LAYOUT = 'postlogin';
    module.TITLE = 'Profile';
    module.BindRecentMatches = function () {
        var basePath = quakelive.BuildSubPath(3);
        quakelive.statstip.SetOptions(null);
        $('.recent_match').each(function () {
            var matchdata = this.id.split("_");
            quakelive.statstip.BindStatsTooltip($(this), matchdata[1], matchdata[0], basePath)
        })
    };
    module.GetFriendStatus = function (playerName) {
        var status = {
            friend: false,
            blocked: false
        };
        if (quakelive.mod_friends.IsOnRoster(playerName)) {
            status.friend = true
        } else if (quakelive.mod_friends.IsBlocked(playerName)) {
            status.blocked = true
        }
        return status
    };
    var friendListReady = false;
    module.SetupVSFriendControls = function () {
        if (!friendListReady) {
            return
        }
        var playerName = $('#prf_player_name').text();
        var container = $('#prf_friend_controls').empty();
        if (playerName.toLowerCase() == quakelive.username.toLowerCase()) {
            if ($('.prf_bannedbio').length > 0) {
                container.html("<a class=\"btn_contactsupport\" href='mailto:support@quakelive.com?subject=QUAKE%20LIVE%20Flagged%20Account%20" + quakelive.username + "'></a>")
            }
            return
        }
        var status = module.GetFriendStatus(playerName);
        if (status.friend) {
            container.html("<div title=\"Already on friends list\" class=\"btn_yourfriend\"></div>" + "<a href=\"javascript:;\" title=\"Remove from Friends\" onclick=\"quakelive.mod_profile.UninvitePlayer( '" + playerName + "' ); return false\" class=\"btn_unfriend\"></a>")
        } else if (status.blocked) {
            container.html("<a href=\"javascript:;\" onclick=\"quakelive.mod_profile.UnblockPlayer( '" + playerName + "' ); return false\" class=\"btn_fr_unblock_player\"></a>")
        } else {
            container.html("<a href=\"javascript:;\" title=\"Add to Friends\" onclick=\"quakelive.mod_profile.InvitePlayer( '" + playerName + "' ); return false\" class=\"btn_friendinvite\"></a>" + "<a href=\"javascript:;\" title=\"Add to Blocked Players\" onclick=\"quakelive.mod_profile.BlockPlayer( '" + playerName + "' ); return false\" class=\"btn_block\"></a>")
        }
    };
    module.SetupFriendControls = function () {
        if (!friendListReady) {
            return
        }
        $('.prf_friend').each(function (nodeIndex, domNode) {
            var friendNode = $(domNode);
            var controlsNode = friendNode.find(".invite_controls");
            var str = controlsNode.attr('id');
            var index = str.indexOf('_');
            if (index != -1) {
                var playerName = str.substr(index + 1);
                var status = module.GetFriendStatus(playerName);
                if (status.friend) {
                    controlsNode.html("<div title=\"" + playerName + " is already your friend\" class=\"btn_fr_invite_inactive rpad_btn fl\"></div>" + "<div class=\"cl\"></div>");
                    friendNode.removeClass('is_blocked is_friend').addClass('is_friend')
                } else if (status.blocked) {
                    var imgpath = quakelive.SwapAvatarPath(friendNode.find('.head_icon').attr("style"), quakelive.PlayerAvatarPath.G_LG);
                    friendNode.find('.head_icon').attr("style", imgpath);
                    friendNode.removeClass('is_blocked is_friend').addClass('is_blocked')
                } else {
                    controlsNode.html("<a href=\"javascript:;\" onclick=\"quakelive.mod_profile.InvitePlayer( '" + playerName + "' ); return false\" class=\"btn_fr_invite rpad_btn fl\"></a>" + "<div class=\"cl\"></div>")
                }
            }
        })
    };
    module.InvitePlayer = function (name) {
        if (!confirm("Are you sure you want to add " + name + " to your friends list?")) {
            return
        }
        quakelive.mod_friends.Subscribe(name);
        var callbacks = module.sections[module.activeSection];
        if (callbacks && callbacks.OnRosterChanged) {
            callbacks.OnRosterChanged()
        }
    };
    module.UninvitePlayer = function (name) {
        if (!confirm("Are you sure you want to remove " + name + " from your friends list?")) {
            return
        }
        quakelive.mod_friends.Unsubscribe(name);
        var callbacks = module.sections[module.activeSection];
        if (callbacks && callbacks.OnRosterChanged) {
            setTimeout(callbacks.OnRosterChanged, 300)
        }
    };
    module.BlockPlayer = function (name) {
        if (!confirm("Are you sure you want to block the player " + name + "?")) {
            return
        }
        quakelive.mod_friends.BlockPlayer(name);
        module.SetupVSFriendControls()
    };
    module.UnblockPlayer = function (name) {
        if (!confirm("Are you sure you want to unblock the player " + name + "?")) {
            return
        }
        quakelive.mod_friends.UnblockPlayer(name);
        module.SetupVSFriendControls()
    };
    module.IM_OnRosterChanged = function () {
        friendListReady = true;
        if (quakelive.activeModule == module) {
            var callbacks = module.sections[module.activeSection];
            if (callbacks && callbacks.OnRosterChanged) {
                callbacks.OnRosterChanged()
            }
        }
    };
    module.AlterSummaryContent = function () {
        module.BindRecentMatches();
        module.SetupVSFriendControls();
        module.CheckRecentCompetitors()
    };
    module.AlterStatisticsContent = function () {
        module.BindRecentMatches();
        module.SetupVSFriendControls()
    };
    module.AlterAwardsContent = function () {};
    module.AlterFriendsContent = function () {
        module.SetupFriendControls()
    };
    module.AlterCompetitorsContent = function () {
        module.BindRecentMatches();
        module.SetupFriendControls()
    };
    module.AlterMatchesContent = function () {};
    module.CheckRecentCompetitors = function () {
        $('.icon_holder > img').each(function (index, domNode) {
            var compNode = $(domNode);
            if (quakelive.mod_friends.IsBlocked(compNode.attr("id"))) {
                var imgpath = quakelive.SwapAvatarPath(compNode.attr("src"), quakelive.PlayerAvatarPath.G_MD);
                compNode.attr("src", imgpath)
            }
        })
    };
    module.activeSection = '';
    module.sections = {
        'summary': {
            OnShow: module.AlterSummaryContent,
            OnRosterChanged: module.SetupVSFriendControls
        },
        'statistics': {
            OnShow: module.AlterStatisticsContent,
            OnRosterChanged: module.SetupVSFriendControls
        },
        'awards': {
            OnShow: module.AlterAwardsContent,
            OnRosterChanged: null
        },
        'friends': {
            OnShow: module.AlterFriendsContent,
            OnRosterChanged: module.SetupFriendControls
        },
        'competitors': {
            OnShow: module.AlterCompetitorsContent,
            OnRosterChanged: module.SetupFriendControls
        },
        'matches': {
            OnShow: module.AlterMatchesContent,
            OnRosterChanged: null
        }
    };
    module.activeProfileName = '';
    module.ShowContent = function (content) {
        $('#qlv_contentBody').html(content);
        if (quakelive.pathParts[0] == 'profile') {
            module.activeSection = quakelive.pathParts[1];
            var callbacks = module.sections[module.activeSection];
            if (callbacks && callbacks.OnShow) {
                callbacks.OnShow()
            }
        }
        module.activeProfileName = quakelive.pathParts[2];
        var matchPathIndex = quakelive.pathParts.length - 2;
        if (quakelive.pathParts[matchPathIndex] && quakelive.pathParts[matchPathIndex] == parseInt(quakelive.pathParts[matchPathIndex])) {
            quakelive.statstip.ShowStatsDetails(quakelive.pathParts[matchPathIndex], quakelive.pathParts[matchPathIndex + 1])
        }
        switch (quakelive.pathParts[1]) {
        case 'awards':
            var award = quakelive.GetParam('award') || 0;
            var type = quakelive.GetParam('type') || 1;
            prevSelectedTypeId = -1;
            module.AwardsSelectBar(type, quakelive.pathParts[2], award);
            break;
        case 'matches':
            module.LoadMatchesForWeek(quakelive.pathParts[2], quakelive.pathParts[3] || 'last_7_days');
            break
        }
    };
    var focusCount = 0;
    var focusDefault = "";
    module.FocusProfileJump = function (input) {
        var node = $(input);
        if (focusCount++==0) {
            focusDefault = node.val()
        }
        if (node.val() == focusDefault) {
            node.val('').removeClass('input_default')
        }
    };
    module.BlurProfileJump = function (input) {
        var node = $(input);
        if (node.val() == '') {
            node.val(focusDefault).addClass('input_default')
        }
    };
    module.SetProfileJumpMsg = function (msg) {
        $('#profil_jump_msg').text(msg);
        if (msg.length > 0) {
            setTimeout(function () {
                $('#profile_jump_msg').fadeOut()
            },
            15000)
        }
    };
    module.ProfileJumpClick = function () {
        module.SetProfileJumpMsg("");
        var player_name = $('#profile_jump_input').val();
        if (typeof(player_name) == 'undefined') {
            module.SetProfileJumpMsg("Missing Player Name");
            return
        }
        player_name = $.trim(player_name);
        if (player_name.length == 0) {
            module.SetProfileJumpMsg("Empty Player Name");
            return
        }
        quakelive.Goto('profile/summary/' + player_name);
        return false
    };
    var prevSelectedTypeId = -1;
    module.AwardsSelectBar = function (typeId, playerName, jumpAwardId) {
        var obj = $('.awardTypeId' + typeId);
        if (prevSelectedTypeId != typeId) {
            if (prevSelectedTypeId != -1) {
                $('.awardTypeId' + prevSelectedTypeId).removeClass('awardBarSel').addClass('awardBar')
            }
            prevSelectedTypeId = typeId;
            obj.removeClass('awardBar').addClass('awardBarSel');
            $('.selectedInfo').remove();
            var html = '<div class="selectedInfo"><div style="padding: 5px"><h1>Loading&hellip;</h1><br /><img src="' + quakelive.resource('/images/loader.gif') + '" width="62" height="13" style="margin: 0 auto; display: block" /></div></div>';
            obj.after($(html));
            $.ajax({
                url: '/profile/awards/' + playerName + '/' + typeId,
                mode: 'abort',
                port: 'ql_profile',
                dataType: 'html',
                success: function (data) {
                    $('.selectedInfo').html(data)
                },
                error: function (err) {
                    $('.selectedInfo').html('<h1>Error loading award data.<br />Please Try again later</h1>')
                }
            })
        } else {
            if (jumpAwardId) {} else {
                $('.awardTypeId' + prevSelectedTypeId).removeClass('awardBarSel').addClass('awardBar');
                $('.selectedInfo').remove();
                prevSelectedTypeId = -1
            }
        }
    };
    var pendingAwardsTriggered = false;
    module.IM_OnConnected = function () {
        if (pendingAwardsTriggered) {
            return
        }
        pendingAwardsTriggered = true;
        $.ajax({
            type: 'get',
            url: '/profile/trigger_pending_awards',
            dataType: 'json'
        })
    };
    $.fn.extend({
        loading: function () {
            return this.html('<div style="width: 100%; height: 100%"><img src="' + quakelive.resource('/images/loader.gif') + '" width="62" height="13" style="margin: 0 auto" /></div>')
        }
    });
    module.LoadMatchesForWeek = function (player_name, week_name) {
        $('.btn_' + week_name + ' a').addClass('selected');
        $('#matchesBlock').html('<div style="padding: 20px"><span class="verdanaBblk_11">Loading matches...</span><br /><br /><br /><img src="' + quakelive.resource('/images/loader.gif') + '" width="62" height="13" style="margin: 0 auto" /></div>');
        $.ajax({
            type: 'get',
            url: '/profile/matches_by_week/' + player_name + '/' + week_name,
            success: function (data) {
                var node = $('#matchesBlock').html(data);
                var firstBar = node.find('.selectedBG:first').prev();
                if (firstBar.size() > 0) {
                    module.MatchSelectBar(firstBar.get())
                }
            },
            error: function (err) {
                $('#matchesBlock').html('Load failed')
            }
        })
    };
    var prevMatchBar = null;
    module.MatchSelectBar = function (node) {
        prevMatchBar = node;
        if (!$(node).hasClass("selectedMatchBar")) {
            module.ActivateMatchBar(node)
        } else {
            module.DeactivateMatchBar(node)
        }
    };
    module.ActivateMatchBar = function (node) {
        $(node).removeClass("matchBar").addClass("selectedMatchBar").next().show();
        quakelive.statstip.SetOptions(null);
        var basePath = quakelive.BuildSubPath(4);
        $(node).next().find(".areaMapC").each(function () {
            var matchdata = this.id.split("_");
            quakelive.statstip.BindStatsTooltip($(this), matchdata[1], matchdata[0], basePath)
        })
    };
    module.DeactivateMatchBar = function (node) {
        $(node).addClass("matchBar").removeClass("selectedMatchBar").next().hide()
    };
    quakelive.RegisterModule('profile', module)
})(jQuery);
(function ($) {
    var module = {};
    module.skipMatchingPathUpdates = new RegExp("^#faq\\b");
    module.LAYOUT = 'postlogin';
    quakelive.RegisterModule('faq', module)
})(jQuery);
(function ($) {
    var module = {};
    module.skipMatchingPathUpdates = new RegExp("^#guide\\b");
    module.LAYOUT = 'postlogin';
    quakelive.RegisterModule('guide', module)
})(jQuery);
(function ($) {
    var module = {};
    module.GetLayout = function () {
        if (quakelive.pathParts[1] == 'eula_updated') {
            return 'bare'
        } else {
            return 'postlogin'
        }
    };
    quakelive.RegisterModule('legals', module)
})(jQuery);
(function ($) {
    var module = {};
    module.LAYOUT = 'prelogin';
    quakelive.RegisterModule('eula', module)
})(jQuery);
(function ($) {
    var module = {};
    module.LAYOUT = 'bare';
    var styledFields = {
        "forgot": ['email', 'captcha'],
        "forgot/validate": ['email', 'code', 'password', 'password2']
    };
    module.ShowContent = function (content) {
        quakelive.ShowContent(content);
        module.ResetFieldStyles();
        switch (quakelive.path) {
        case "forgot":
            $('#email').focus();
            break;
        case "forgot/validate":
            $('#email').val(quakelive.params['email'] || '');
            $('#code').val(quakelive.params['code'] || '');
            if ($('#email').val().length && $('#code').val().length) {
                $('#password').focus()
            } else if ($('#email').val().length) {
                $('#code').focus()
            } else {
                $('#email').focus()
            }
            break
        }
    };
    module.ResetFieldStyles = function () {
        if (styledFields[quakelive.path]) {
            var fields = styledFields[quakelive.path];
            for (var i in fields) {
                quakelive.mod_register.StyleAsDefault(fields[i]);
                $('#' + fields[i]).focus(quakelive.mod_register.FocusField);
                $('#' + fields[i]).blur(quakelive.mod_register.BlurField)
            }
        }
    };
    module.RequestPasswordMail = function () {
        var formData = {
            'email': $('#email').val(),
            'captcha': $('#captcha').val()
        };
        $.ajax({
            type: 'post',
            dataType: 'json',
            url: '/forgot/request_mail',
            data: formData,
            success: module.RequestPasswordMail_Success,
            error: module.RequestPasswordMail_Error
        })
    };
    module.RequestPasswordMail_Success = function (data) {
        if (data.ECODE == 0) {
            quakelive.Goto('forgot/validate;email=' + data.EMAIL)
        } else {
            module.ResetFieldStyles();
            for (var errorId in data.ERRORS) {
                quakelive.mod_register.StyleAsError(errorId);
                $('#help_' + errorId).append("<span class='error'>" + data.ERRORS[errorId] + "</span>")
            }
        }
    };
    module.RequestPasswordMail_Error = function () {
        module.RequestPasswordMail_Success({
            ECODE: -1,
            ERRORS: {
                "email": "Failed to reset password"
            }
        })
    };
    module.ChangePassword = function () {
        var formData = {
            'email': $('#email').val(),
            'code': $('#code').val(),
            'password': $('#password').val(),
            'password2': $('#password2').val()
        };
        $.ajax({
            type: 'post',
            dataType: 'json',
            url: '/forgot/change_password',
            data: formData,
            success: module.ChangePassword_Success,
            error: module.ChangePassword_Error
        })
    };
    module.ChangePassword_Success = function (data) {
        if (data.ECODE == 0) {
            qlPrompt({
                title: 'Password Changed',
                body: 'Your password has been changed!'
            });
            quakelive.Goto('home')
        } else {
            module.ResetFieldStyles();
            for (var errorId in data.ERRORS) {
                quakelive.mod_register.StyleAsError(errorId);
                $('#help_' + errorId).append("<span class='error'>" + data.ERRORS[errorId] + "</span>")
            }
        }
    };
    module.ChangePassword_Error = function () {
        module.ChangePassword_Success({
            ECODE: -1,
            ERRORS: {
                "email": "Failed to change password"
            }
        })
    };
    quakelive.RegisterModule('forgot', module)
})(jQuery);
(function ($) {
    var module = {};
    module.LAYOUT = 'prelogin';
    quakelive.RegisterModule('logoff', module)
})(jQuery);
(function ($) {
    var module = {};
    module.LAYOUT = 'postlogin';
    quakelive.RegisterModule('sorry', module)
})(jQuery);
(function ($) {
    var module = {
        LAYOUT: 'postlogin',
        TITLE: 'Forum Signature'
    };
    module.ShowContent = function (content) {
        quakelive.ShowContent(content);
        $('#mod_sig input').each(function () {
            $(this).click(function () {
                this.select()
            })
        })
    };
    quakelive.RegisterModule('sig', module)
})(jQuery);
(function ($) {
    var module = {
        LAYOUT: 'postlogin',
        TITLE: 'Practice'
    };
    var ExpandMode = {
        AUTO: 1,
        MANUAL: 2
    };
    module.expandMode = ExpandMode.MANUAL;
    module.baseDefaultGameCfg = {
        'game_type': mapdb.GameTypes.FFA,
        'arena': 'qzdm1',
        'difficulty': 0,
        'player_slots': 8,
        'player_slots_used': 1,
        'time_limit': 10,
        'round_limit': 8,
        'frag_limit': 30,
        'capture_limit': 8,
        'friendly_fire': 0,
        'dmflags': 0,
        'map_tag': mapdb.MapTags.NONE
    };
    module.gameTypeDefaults = {};
    module.gameTypeDefaults[mapdb.GameTypes.FFA] = {
        'arena': 'qzdm7',
        'time_limit': 20,
        'frag_limit': 30,
        'friendly_fire': 0,
        'dmflags': 0
    };
    module.gameTypeDefaults[mapdb.GameTypes.DUEL] = {
        'arena': 'qztourney1',
        'time_limit': 10,
        'frag_limit': 0,
        'friendly_fire': 0,
        'dmflags': 0
    };
    module.gameTypeDefaults[mapdb.GameTypes.TDM] = {
        'arena': 'qzdm6',
        'time_limit': 15,
        'frag_limit': 0,
        'friendly_fire': 1,
        'dmflags': 0
    };
    module.gameTypeDefaults[mapdb.GameTypes.CA] = {
        'arena': 'qzca1',
        'time_limit': 20,
        'round_limit': 10,
        'friendly_fire': 0,
        'dmflags': 28
    };
    module.gameTypeDefaults[mapdb.GameTypes.CTF] = {
        'arena': 'qzctf1',
        'time_limit': 20,
        'capture_limit': 8,
        'friendly_fire': 0,
        'dmflags': 0
    };
    module.Init = function () {
        module.gameTypeData = {};
        for (var i in module.gameTypeDefaults) {
            var data = {};
            data.cfg = $.extend({},
            module.baseDefaultGameCfg, module.gameTypeDefaults[i]);
            data.defaultCfg = $.extend({},
            module.baseDefaultGameCfg, module.gameTypeDefaults[i]);
            data.lockedCfg = {};
            module.gameTypeData[i] = data
        }
        module.LoadSettings();
        module.gameCfg = null;
        module.defaultGameCfg = null;
        module.gameCfgDelta = {};
        for (var index in module.gameCfg) {
            module.gameCfgDelta[index] = false
        }
    };
    var GameTypeList = function () {
        this.vector = {};
        for (var i = 0; i < arguments.length; ++i) {
            this.vector[arguments[i]] = true
        }
        this.hasGameType = function (type) {
            return typeof(this.vector[type]) != 'undefined'
        };
        this.getRandom = function () {
            var keys = [];
            for (var key in this.vector) {
                keys.push(key)
            }
            return keys[Math.floor(Math.random() * keys.length)]
        }
    };
    var ALL_GAME_TYPES = new GameTypeList(mapdb.GameTypes.FFA, mapdb.GameTypes.DUEL, mapdb.GameTypes.TDM, mapdb.GameTypes.CA, mapdb.GameTypes.CTF);
    var FloatingBox = function (userOptions) {
        var o = $.extend({
            sentinel: '',
            box: '',
            margin: 10
        },
        userOptions);
        var $box;
        this.Scroll = function () {
            if (!$(o.sentinel).length) {
                return
            }
            var sentinelTop = $(o.sentinel).offset({
                scroll: false
            }).top;
            var windowScrollTop = $(window).scrollTop();
            var field = 'padding-top';
            if (windowScrollTop > sentinelTop) {
                $box.css(field, (windowScrollTop - sentinelTop + o.margin) + 'px')
            } else {
                $box.css(field, '0px')
            }
        };
        this.Prepare = function () {
            $(window).scroll(this.Scroll);
            $box = $(o.box)
        }
    };
    module.ShowContent = function (content) {
        if (!quakelive.IsLoggedIn()) {
            return false
        }
        quakelive.ShowContent(content);
        read_bot_sk();
        PreparePanelHandlers();
        var fb;
        if (quakelive.pathParts[1] == "training") {
            fb = new FloatingBox({
                sentinel: '#prac_guidenavpanel_sentinel',
                box: '.prac_guidenavpanel'
            })
        } else {
            fb = new FloatingBox({
                sentinel: '#summary_sentinel',
                box: '.prac_summary'
            })
        }
        fb.Prepare();
        module.BarClicked('panel_gametype', true)
    };
    var bot_sk;

    function read_bot_sk() {
        var xs = 0;
        for (var i = 0; i < quakelive.session.length; ++i) {
            xs += quakelive.session.charCodeAt(i)
        }
        var r = [];
        var k = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        var s = $('#bot_sk').text();
        for (var i = 0; i < s.length; ++i) {
            var xi = ((1 + i) * xs) % k.length;
            var ci = k.indexOf(s[i]);
            if (ci < xi) {
                ci += k.length
            }
            r[i] = ci - xi
        }
        bot_sk = r
    }
    var cfgToCvars = {
        'game_type': 'g_gametype',
        'time_limit': 'timelimit',
        'round_limit': 'roundlimit',
        'frag_limit': 'fraglimit',
        'capture_limit': 'capturelimit',
        'friendly_fire': 'g_friendlyfire',
        'dmflags': 'dmflags'
    };
    module.BuildCmdString = function () {
        var params = [];
        for (var field in cfgToCvars) {
            params.push('+set ' + cfgToCvars[field] + ' ' + module.gameCfg[field])
        }
        params.push('+set sv_maxclients 16');
        if (module.gameCfg.game_type == mapdb.GameTypes.CA) {
            params.push('+set g_ca_startingArmor 100')
        }
        var difficulty = module.gameCfg.difficulty;
        if (difficulty == 0) {
            difficulty = bot_sk[module.gameCfg.game_type];
            params.push('+set bot_dynamicSkill 1')
        }
        params.push('+set g_spSkill ' + difficulty);
        params.push('+set bot_startingSkill ' + difficulty);
        params.push('+map ' + module.gameCfg['arena']);
        var playerTeam = 0;
        var teamNames = ['red', 'blue'];
        var isTeamGame = mapdb.isTeamGameType(module.gameCfg.game_type);
        if (isTeamGame) {
            params.push('+wait +team ' + teamNames[playerTeam++])
        }
        for (var i = 1; i < module.gameCfg.player_slots; ++i) {
            var botName;
            if (i - 1 < players.length) {
                botName = players[i - 1]
            } else {
                botName = botdb.botNames[Math.floor(Math.random() * botdb.botNames.length)]
            }
            if (isTeamGame) {
                params.push('+addbot ' + botName + ' ' + difficulty + ' ' + teamNames[playerTeam++%2])
            } else {
                params.push('+addbot ' + botName + ' ' + difficulty)
            }
            params.push('+wait')
        }
        return params.join(' ')
    };
    var ignoredFields = {
        'game_type': true,
        'player_slots_used': true,
        'map_tag': true
    };
    module.SaveSettings = function () {
        var data = module.gameTypeData[module.gameCfg.game_type];
        var saveData = {};
        for (var field in data.cfg) {
            if (ignoredFields[field]) {
                continue
            }
            saveData[field] = data.cfg[field]
        }
        SetCvar("web_practice_settings_" + module.gameCfg.game_type, JSON.stringify(saveData));
        SetCvar("web_practice_gametype", module.gameCfg.game_type)
    };
    module.LoadSettings = function () {
        for (var index in module.gameTypeData) {
            var data = module.gameTypeData[index];
            var json = quakelive.cvars.Get("web_practice_settings_" + index, "{}").value;
            var savedFields = quakelive.Eval(json);
            if (savedFields.arena && mapdb.maps[savedFields.arena] && mapdb.maps[savedFields.arena].hasGameType(index)) {
                data.cfg = $.extend(data.cfg, savedFields)
            }
        }
        module.defaultGameType = quakelive.cvars.Get("web_practice_gametype", mapdb.GameTypes.FFA).value
    };
    module.Play = function () {
        module.SaveSettings();
        var cmdString = module.BuildCmdString();
        LaunchGame(BuildCmdString() + cmdString, true)
    };
    module.SetGameType = function (gt) {
        var gtData = module.gameTypeData[gt];
        var oldGameCfg = module.gameCfg;
        module.gameCfg = gtData.cfg;
        module.defaultGameCfg = gtData.defaultCfg;
        module.lockedGameCfg = gtData.lockedCfg;
        for (var i in module.gameCfg) {
            module.SetGameCfg(i, module.gameCfg[i])
        }
        if (oldGameCfg) {
            module.SetGameCfg('player_slots_used', oldGameCfg.player_slots_used);
            module.SetGameCfg('map_tag', oldGameCfg.map_tag)
        }
        module.gameCfg.game_type = null;
        module.SetGameCfg('game_type', gt);
        module.CheckPlayerSlots(module.gameCfg)
    };
    module.CheckPlayerSlots = function (params) {
        var map = mapdb.maps[params.arena];
        var gt = map.gametypes[params.game_type];
        var actualPlayerSlots = params.player_slots;
        if (actualPlayerSlots != 1) {
            if (actualPlayerSlots < gt.min_players) {
                actualPlayerSlots = gt.min_players
            } else if (actualPlayerSlots > gt.max_players) {
                actualPlayerSlots = gt.max_players
            }
            if (params.game_type == mapdb.GameTypes.DUEL) {
                actualPlayerSlots = 2
            }
        }
        var $sel = $('#select_player_slots').empty();
        $sel.append('<option value="1">Just Me</option>');
        for (var i = gt.min_players; i <= gt.max_players; i += 2) {
            $sel.append('<option value="' + i + '">' + i + ' Players</option>')
        }
        module.panel_customize.SetField('player_slots', actualPlayerSlots);
        if (actualPlayerSlots != params.player_slots) {
            module.SetGameCfg('player_slots', actualPlayerSlots)
        }
    };

    function GameTypeHandler() {
        var gametypes = [{
            id: mapdb.GameTypes.FFA,
            name: 'ffa',
            title: 'Free For All',
            desc: 'If it has 2 legs and moves - shoot it! Most frags wins.'
        },
        {
            id: mapdb.GameTypes.CTF,
            name: 'ctf',
            title: 'Capture The Flag',
            desc: 'Two teams, fighting to capture the opponent\'s flag and return it to their base.'
        },
        {
            id: mapdb.GameTypes.CA,
            name: 'ca',
            title: 'Clan Arena',
            desc: 'Two teams compete to eliminate each other. Team with the last man standing wins the round.'
        },
        {
            id: mapdb.GameTypes.TDM,
            name: 'tdm',
            title: 'Team Deathmatch',
            desc: 'Team-based Free For All. The team with the most frags wins.'
        },
        {
            id: mapdb.GameTypes.DUEL,
            name: 'duel',
            title: 'Duel',
            desc: 'A 1 vs. 1 test of skill. Just you, your opponent, and the arena. Most frags wins.'
        }];
        this.Prepare = function () {
            var container = $('<div>');
            for (var index in gametypes) {
                var gt = gametypes[index];
                var link = $('<a title="' + gt.desc + '" href="javascript:;" class="btn_gametype gt_' + gt.id + '" onclick="quakelive.mod_practice.GameTypeClicked(\'' + gt.id + '\'); return false"></a>');
                link.append('<div class="gametype_' + gt.name + '"></div><h1>' + gt.title + '</h1>');
                container.append(link)
            }
            container.append('<div class="cl"></div>');
            this.$panel.find('.gametypes').empty().append(container)
        };
        this.Show = function () {};
        this.Hide = function () {};
        this.Modify = function (params, delta) {
            if (!delta.game_type) {
                return
            }
            this.$panel.find('.params').text(mapdb.GameTypeNames[params.game_type]);
            this.$panel.find('.btn_gametype').each(function () {
                var $this = $(this);
                if ($this.hasClass('gt_' + params.game_type)) {
                    $this.addClass('selected_gametype')
                } else if ($this.hasClass('selected_gametype')) {
                    $this.removeClass('selected_gametype')
                }
            })
        }
    };

    function ArenaHandler() {
        var activeTag = mapdb.MapTags.NONE,
        activeGameType = mapdb.GameTypes.NONE;
        var lastTag = mapdb.MapTags.NONE,
        lastGameType = mapdb.GameTypes.NONE;
        this.$container = null;
        this.Prepare = function () {
            var container = $('<div></div>');
            for (var index in mapdb.orderedMaps) {
                var map = mapdb.maps[mapdb.orderedMaps[index]];
                var tags = [];
                var linkClasses = ["btn_arena", "map_" + map.sysname];
                for (var i in map.tag_list) {
                    linkClasses.push('tag_' + map.tag_list[i]);
                    tags.push(mapdb.MapTagNames[map.tag_list[i]])
                }
                for (var i in map.gametypes) {
                    linkClasses.push('gt_' + map.gametypes[i].gametype)
                }
                var link = $('<a title="Tags: ' + tags.join(', ') + '" class="' + linkClasses.join(' ') + '" href="javascript:;" onclick="quakelive.mod_practice.ArenaClicked(\'' + map.sysname + '\'); return false"></a>').append('<img src="' + quakelive.resource('/images/levelshots/md/' + map.sysname + '.jpg') + '" />').append("<br />" + map.name).appendTo(container)
            }
            container.append("<div class='cl'></div>");
            this.$panel.find('.arenas').append(container);
            this.$container = container
        };
        this.Show = function () {};
        this.Hide = function () {};
        this.Modify = function (params, delta) {
            if (!delta.game_type && !delta.map_tag && !delta.arena) {
                return
            }
            var arenaClass = 'map_' + params.arena;
            if (delta.arena) {
                this.$panel.find('.params').text(mapdb.maps[params.arena].name);
                this.$panel.find('.selected_arena').removeClass('selected_arena');
                this.$panel.find('.' + arenaClass).addClass('selected_arena')
            }
            if (delta.game_type || delta.map_tag) {
                this.$container.find('.btn_arena').each(function () {
                    var $this = $(this);
                    var show = true;
                    if (!$this.hasClass('gt_' + params.game_type)) {
                        show = false
                    }
                    if (params.map_tag != mapdb.MapTags.NONE && !$this.hasClass('tag_' + params.map_tag)) {
                        show = false
                    }
                    if (show) {
                        if ($this.hasClass(arenaClass)) {
                            $this.addClass('selected_arena')
                        } else {
                            $this.removeClass('selected_arena')
                        }
                        $this.show()
                    } else {
                        $this.hide()
                    }
                })
            }
        }
    }

    function CustomizeHandler() {
        this.settings = [{
            'title': 'Difficulty',
            'description': 'Skill level of AI opponents in the match.',
            'field': 'difficulty',
            'game_types': ALL_GAME_TYPES,
            'default': 0,
            'values': [{
                'name': 'My Skill',
                'value': 0
            },
            {
                'name': 'I Can Win',
                'value': 1
            },
            {
                'name': 'Bring It On',
                'value': 2
            },
            {
                'name': 'Hurt Me Plenty',
                'value': 3
            },
            {
                'name': 'Hardcore',
                'value': 4
            },
            {
                'name': 'Nightmare',
                'value': 5
            },
            ]
        },
        {
            'title': 'Total Players',
            'description': 'Number of players to have on the server.',
            'field': 'player_slots',
            'game_types': new GameTypeList(mapdb.GameTypes.FFA, mapdb.GameTypes.TDM, mapdb.GameTypes.CA, mapdb.GameTypes.CTF),
            'default': 0,
            'values': [{
                'name': 'None',
                'value': 0
            },
            {
                'name': '2 Players',
                'value': 2
            },
            {
                'name': '4 Players',
                'value': 4
            },
            {
                'name': '6 Players',
                'value': 6
            },
            {
                'name': '8 Players',
                'value': 8
            },
            {
                'name': '10 Players',
                'value': 10
            },
            {
                'name': '12 Players',
                'value': 12
            },
            {
                'name': '14 Players',
                'value': 14
            },
            {
                'name': '16 Players',
                'value': 16
            }]
        },
        {
            'title': 'Time Limit',
            'description': 'Maximum duration of a single match.',
            'field': 'time_limit',
            'game_types': ALL_GAME_TYPES,
            'default': 0,
            'values': [{
                'name': 'None',
                'value': 0
            },
            {
                'name': '5 Minutes',
                'value': 5
            },
            {
                'name': '10 Minutes',
                'value': 10
            },
            {
                'name': '15 Minutes',
                'value': 15
            },
            {
                'name': '20 Minutes',
                'value': 20
            },
            {
                'name': '30 Minutes',
                'value': 30
            }]
        },
        {
            'title': 'Round Limit',
            'description': 'The number of rounds to play.',
            'field': 'round_limit',
            'game_types': new GameTypeList(mapdb.GameTypes.CA),
            'default': 0,
            'values': [{
                'name': 'None',
                'value': 0
            },
            {
                'name': '6 Rounds',
                'value': 6
            },
            {
                'name': '8 Rounds',
                'value': 8
            },
            {
                'name': '10 Rounds',
                'value': 10
            },
            {
                'name': '12 Rounds',
                'value': 12
            }]
        },
        {
            'title': 'Frag Limit',
            'description': 'Total frags needed to finish the match.',
            'field': 'frag_limit',
            'game_types': new GameTypeList(mapdb.GameTypes.FFA, mapdb.GameTypes.DUEL, mapdb.GameTypes.TDM),
            'default': 0,
            'values': [{
                'name': 'None',
                'value': 0
            },
            {
                'name': '10 Frags',
                'value': 10
            },
            {
                'name': '20 Frags',
                'value': 20
            },
            {
                'name': '30 Frags',
                'value': 30
            },
            {
                'name': '40 Frags',
                'value': 40
            },
            {
                'name': '50 Frags',
                'value': 50
            }]
        },
        {
            'title': 'Capture Limit',
            'description': 'Number of captures to finish the match.',
            'field': 'capture_limit',
            'game_types': new GameTypeList(mapdb.GameTypes.CTF),
            'default': 0,
            'values': [{
                'name': 'None',
                'value': 0
            },
            {
                'name': '4 Captures',
                'value': 4
            },
            {
                'name': '6 Captures',
                'value': 6
            },
            {
                'name': '8 Captures',
                'value': 8
            },
            {
                'name': '10 Captures',
                'value': 10
            },
            {
                'name': '12 Captures',
                'value': 12
            }]
        },
        {
            'title': 'Friendly Fire',
            'description': 'Whether your attacks damage teammates.',
            'field': 'friendly_fire',
            'game_types': new GameTypeList(mapdb.GameTypes.TDM),
            'default': 1,
            'values': [{
                'name': 'Disabled',
                'value': 0
            },
            {
                'name': 'Enabled',
                'value': 1
            }]
        }];
        this.GetNameForIntegerValue = function (setting, value) {
            value = parseInt(value);
            for (var i in setting.values) {
                if (setting.values[i].value == value) {
                    return setting.values[i].name
                }
            }
            return value
        };
        this.settingsLookup = {};
        for (var i in this.settings) {
            var setting = this.settings[i];
            this.settingsLookup[setting.field] = setting
        }
        var triggeredByCode = false;

        function MonitorChangeGenerator(field) {
            return function () {
                if (!triggeredByCode) {
                    module.lockedGameCfg[field] = true
                }
                module.SetGameCfg(field, $('#select_' + field).val());
                module.GameCfgUpdated()
            }
        };
        this.$container = null;
        this.Prepare = function () {
            var container = $('<div>');
            for (var index in this.settings) {
                var setting = this.settings[index];
                var $node = $('<div class="setting" id="' + setting.field + '">');
                for (var i = 0; i < mapdb.GameTypes.MAX; ++i) {
                    if (setting.game_types.hasGameType(i)) {
                        $node.addClass('gt_' + i)
                    }
                }
                var $field = $('<div class="field">');
                $field.append('<label>' + setting.title + '</label>');
                $field.append('<span>' + setting.description + '</span>');
                var $value = $('<div class="value">');
                var $select = $('<select id="select_' + setting.field + '">').change(MonitorChangeGenerator(setting.field));
                for (var index in setting.values) {
                    var v = setting.values[index];
                    $select.append('<option value="' + v.value + '">' + v.name + '</option>')
                }
                $value.append($select);
                $node.append($('<div class="field_box"></div>').append($field));
                $node.append($('<div class="value_box"></div>').append($value));
                $node.append('<div class="cl"></div>');
                container.append($node)
            }
            this.$container = container;
            this.$panel.find('.customizations').empty().append(this.$container)
        };
        this.Show = function () {};
        this.Hide = function () {};
        this.Modify = function (params, delta) {
            if (delta.game_type || delta.arena) {
                this.$panel.find('.params').text("Default");
                var self = this;
                this.$container.find('.setting').each(function () {
                    var $this = $(this);
                    var setting = self.settingsLookup[this.id];
                    if (setting.game_types.hasGameType(params.game_type)) {
                        $this.show()
                    } else {
                        $this.hide()
                    }
                })
            }
            var modified = false;
            for (var varName in delta) {
                var setting = this.settingsLookup[varName];
                if (setting) {
                    this.SetField(varName, params[varName]);
                    if (params[varName] != module.defaultGameCfg[varName]) {
                        modified = true
                    }
                }
            }
            this.$panel.find('.params').text(modified ? "Customized" : "Default")
        };
        this.SetField = function (fieldName, fieldValue, isCodeTriggered) {
            triggeredByCode = isCodeTriggered;
            $('#select_' + fieldName).val(fieldValue);
            triggeredByCode = false
        }
    }
    module.ResetCustomize = function () {
        for (var i in module.defaultGameCfg) {
            if (module.panel_customize.settingsLookup[i]) {
                module.SetGameCfg(i, module.defaultGameCfg[i])
            }
        }
        module.CheckPlayerSlots(module.gameCfg);
        module.GameCfgUpdated()
    };
    var players = [];
    module.PlayerClicked = function (node, playerName) {
        var $node = $(node);
        if ($node.hasClass('plaque_selected')) {
            for (var i = 0; i < players.length; ++i) {
                if (players[i] == playerName) {
                    players.splice(i, 1);
                    break
                }
            }
            $node.removeClass('plaque_selected');
            module.SetGameCfg('player_slots_used', module.gameCfg.player_slots_used - 1);
            module.GameCfgUpdated()
        } else {
            if (module.gameCfg.player_slots_used < module.gameCfg.player_slots) {
                players[players.length] = playerName;
                $node.addClass('plaque_selected');
                module.SetGameCfg('player_slots_used', module.gameCfg.player_slots_used + 1);
                module.GameCfgUpdated()
            }
        }
    };

    function PlayerHandler() {
        this.$container = null;
        this.Prepare = function () {
            var $container = $('<div>');
            var $plaque;
            var chosenPlayers = {};
            for (var i in players) {
                chosenPlayers[players[i]] = true
            }
            var playerName = quakelive.username;
            var playerModelskin = quakelive.playericons.modelskin;
            $plaque = $('<a href="javascript:;" class="plaque plaque_selected"></a>');
            $plaque.append('<img class="modelskin" src="' + quakelive.resource('/images/players/icon_md/' + playerModelskin + '.jpg') + '" />');
            $plaque.append('<h1>' + playerName + '</h1>');
            $plaque.append('<div class="cl"></div>');
            $container.append($('<div class="plaque_box"></div>').append($plaque));
            for (var index in botdb.bots) {
                var bot = botdb.bots[index];
                var cls = "plaque";
                if (chosenPlayers[bot.sysname]) {
                    cls += " plaque_selected"
                }
                $plaque = $('<a href="javascript:;" class="' + cls + '" id="' + bot.sysname + '" onclick="quakelive.mod_practice.PlayerClicked(this, \'' + bot.sysname + '\'); return false"><div class="add"></div><div class="remove"></div></a>');
                $plaque.append('<img class="modelskin" src="' + quakelive.resource('/images/players/icon_md/' + bot.modelskin + '.jpg') + '" />');
                $plaque.append('<h1>' + bot.name + '</h1>');
                $plaque.append('<div class="cl"></div>');
                $container.append($('<div class="plaque_box"></div>').append($plaque))
            }
            $container.append('<div class="cl"></div>');
            this.$container = $container;
            this.$panel.find('.players').empty().append(this.$container)
        };
        this.Modify = function (params, delta) {
            if (!delta.player_slots_used && !delta.player_slots) {
                return
            }
            if (delta.player_slots && params.player_slots < params.player_slots_used) {
                var playerDelta = params.player_slots_used - params.player_slots;
                for (var i = players.length - playerDelta; i < players.length; ++i) {
                    this.$container.find('#' + players[i]).removeClass('plaque_selected')
                }
                players.splice(players.length - playerDelta, playerDelta);
                module.SetGameCfg('player_slots_used', 1 + players.length);
                module.GameCfgUpdated()
            }
            var str = params.player_slots_used + " of " + params.player_slots + " slots filled";
            this.$panel.find('.params').text(str);
            if (params.player_slots_used >= params.player_slots) {
                this.$panel.find('.players').addClass('players_noslots')
            } else {
                this.$panel.find('.players').removeClass('players_noslots')
            }
        };
        this.Show = function () {};
        this.Hide = function () {}
    }

    function LaunchHandler() {
        this.Prepare = function () {
            var settings = module.panel_customize.settings;
            var $node = $('.summary_settings').empty();
            for (var index in settings) {
                var setting = settings[index];
                $node.append('<li class="summary_field_' + setting.field + '">' + setting.title + ': <b></b></li>')
            }
        };
        this.Modify = function (params, delta) {
            for (var field in delta) {
                var setting = module.panel_customize.settingsLookup[field];
                if (setting) {
                    var niceVal = module.panel_customize.GetNameForIntegerValue(setting, params[field]);
                    $('.summary_field_' + field + ' b').text(niceVal)
                }
            }
            if (delta.arena) {
                var map = mapdb.maps[params.arena];
                $('.prac_summary .summary_header').css('background-image', 'url(' + quakelive.resource('/images/levelshots/lg/' + map.sysname + '.jpg') + ')');
                $('.prac_summary .map_title').text(map.name);
                var settings = module.panel_customize.settings;
                for (var index in settings) {
                    var setting = settings[index];
                    if (!setting.game_types.hasGameType(params.game_type)) {
                        $('.summary_field_' + setting.field).hide()
                    } else {
                        $('.summary_field_' + setting.field).show()
                    }
                }
            }
            if (delta.game_type) {
                $('.prac_summary .summary_gametype').css('background-image', 'url(' + quakelive.resource('/images/start_match/gametypes_sm/' + mapdb.GameTypeShortNames[params.game_type] + '.png') + ')').text(mapdb.GameTypeNames[params.game_type])
            }
            if (delta.player_slots || delta.player_slots_used) {
                var playerName = quakelive.username;
                var playerModelskin = quakelive.playericons.modelskin;
                var $c = $('<div>');
                for (var index = 0; index < params.player_slots; ++index) {
                    var name, image;
                    $r = $('<div class="chosen_player"></div>');
                    if (index == 0) {
                        image = '/images/players/icon_md/' + playerModelskin + '.jpg';
                        name = playerName
                    } else if (index - 1 < players.length) {
                        var bot = botdb.bots[players[index - 1]];
                        image = '/images/players/icon_md/' + bot.modelskin + '.jpg';
                        name = bot.name
                    } else {
                        image = '/images/start_match/random_ai.png';
                        name = 'Random AI Player'
                    }
                    $r.append('<img class="modelskin" src="' + quakelive.resource(image) + '" />');
                    $r.append('<h1>' + name + '</h1>');
                    $r.append('<div class="cl"></div>');
                    $c.append($('<div class="chosen_player_box"></div>').append($r))
                }
                $('.prac_summary .playerlist .pl_body').empty().append($c)
            }
        };
        this.Show = function () {};
        this.Hide = function () {}
    }
    var panelHandlers = {
        'panel_gametype': new GameTypeHandler(),
        'panel_arena': new ArenaHandler(),
        'panel_customize': new CustomizeHandler(),
        'panel_players': new PlayerHandler(),
        'panel_launcher': new LaunchHandler()
    };
    module.ph = panelHandlers;
    var PrepareStages = {
        Wire: 0,
        Prepare: 1,
        Modify: 2
    };

    function PreparePanelHandlers() {
        var delta = {};
        for (var i in module.gameCfg) {
            delta[i] = true
        }
        for (var prepareStage = 0; prepareStage < 2; ++prepareStage) {
            for (var panelId in panelHandlers) {
                var handler = panelHandlers[panelId];
                if (prepareStage == PrepareStages.Wire) {
                    handler.$panel = $('#' + panelId);
                    module[panelId] = panelHandlers[panelId]
                } else if (prepareStage == PrepareStages.Prepare) {
                    handler.Prepare()
                } else {}
            }
        }
        for (var panelId in panelHandlers) {
            var handler = panelHandlers[panelId];
            handler.Modify(module.gameCfg, delta)
        }
        module.SetGameType(module.defaultGameType);
        module.GameCfgUpdated()
    };
    module.SetGameCfg = function (name, value) {
        if (typeof(module.gameCfg[name]) == 'undefined') {
            return
        }
        module.gameCfgDelta[name] = true;
        module.gameCfg[name] = value
    };
    module.GameCfgUpdated = function () {
        var delta = module.gameCfgDelta;
        module.gameCfgDelta = {};
        for (var index in panelHandlers) {
            var panel = panelHandlers[index];
            panel.Modify(module.gameCfg, delta)
        }
    };
    module.BarClicked = function (panelId, forceOn) {
        var handler = panelHandlers[panelId];
        if (!handler) {
            return
        }
        if (!forceOn && handler.$panel.hasClass('panel_expanded')) {
            handler.$panel.removeClass('panel_expanded');
            handler.Hide()
        } else {
            if (module.expandMode == ExpandMode.AUTO) {
                $('.panel_expanded').removeClass('panel_expanded')
            }
            handler.$panel.addClass('panel_expanded').show();
            handler.Show()
        }
    };
    module.ShuffleClicked = function () {
        var gt = ALL_GAME_TYPES.getRandom();
        var map = mapdb.getRandomByGameType(gt);
        module.SetGameCfg('arena', map.sysname);
        module.SetGameType(gt);
        module.GameCfgUpdated()
    };
    module.GameTypeClicked = function (gt) {
        module.SetGameType(gt);
        module.GameCfgUpdated()
    };
    module.ArenaClicked = function (sysname) {
        module.SetGameCfg('arena', sysname);
        module.CheckPlayerSlots(module.gameCfg);
        module.GameCfgUpdated()
    };
    module.LaunchTraining = function (mapName) {
        var cmdString = BuildCmdString();
        if (mapName == 'qztraining') {
            cmdString += "+set sv_maxclients 16 +set bot_dynamicSkill 1 +set g_gametype 0 +set bot_startingSkill " + bot_sk[mapdb.GameTypes.DUEL] + " +map qztraining"
        } else {
            cmdString += "+set g_gametype 0 +set dmflags 28 +set practiceflags 3 +map " + mapName + " +wait +wait +team f"
        }
        LaunchGame(cmdString, true)
    };
    module.LaunchDemo = function (demoName) {
        $('.video_embed').parent().hide();
        var cmdString = BuildCmdString() + "+set practiceflags 3 +demo " + demoName;
        LaunchGame(cmdString, true)
    };
    quakelive.RegisterModule('practice', module)
})(jQuery);
(function ($) {
    var module = {};
    module.Init = function () {};
    module.GetLayout = function () {
        return 'bare'
    };
    module.OnLayoutLoaded = function () {};
    module.ShowContent = function (content) {
        quakelive.ShowContent(content);
        module.ResetFieldStyles();
        $('#in_email').focus();
        $('.mainLogoRight').append('<div style="top: 53px" id="newnav_top"></div>');
        nav.initNav({
            'location': '#newnav_top',
            'object': nav.navbar
        })
    };
    module.SubmitLoginForm = function () {
        if (!quakelive.CheckBrowserCompat()) {
            return
        }
        var formData = {
            u: $('#in_email').val(),
            p: $('#in_password').val(),
            r: $('#in_remember').attr('checked') ? 1 : 0
        };
        if (formData.u.length === 0 || formData.p.length === 0) {
            module.ShowLoginError("You must enter your email and password.");
            return
        }
        $.ajax({
            url: '/user/login',
            mode: 'abort',
            port: 'login',
            type: 'post',
            data: formData,
            dataType: 'json',
            error: module.SubmitLoginForm_Error,
            success: module.SubmitLoginForm_Success
        })
    };
    var loginErrorFxHandle;
    module.ShowLoginError = function (msg) {
        if (loginErrorFxHandle) {
            clearTimeout(loginErrorFxHandle);
            loginErrorFxHandle = null
        }
        $('#loginError').fadeIn().html("<p>" + msg + "</p>");
        $('#loginError p').effect('pulsate', {
            times: 1
        },
        1000);
        loginErrorFxHandle = setTimeout(function () {
            loginErrorFxHandle = null;
            $('#loginError').fadeOut()
        },
        30000)
    };
    var DEFAULT_LOGIN_ERROR = "Unable to log in. Please try again later.";
    module.SubmitLoginForm_Error = function () {
        module.ShowLoginError(DEFAULT_LOGIN_ERROR)
    };
    module.SubmitLoginForm_Success = function (json) {
        if (typeof(json) == 'object') {
            if (json.ECODE === 0) {
                $('#loginError').fadeOut();
                if (json.RESULT_CODE) {
                    quakelive.PageRedirect("/queue.php")
                } else {
                    var redirect = $('#in_redirect').val();
                    quakelive.PageRedirect("/r/" + redirect)
                }
            } else {
                module.ShowLoginError(json.MSG || DEFAULT_LOGIN_ERROR)
            }
        } else {
            module.ShowLoginError(DEFAULT_LOGIN_ERROR)
        }
    };
    module.ResetFieldStyles = function () {
        var fields = ['in_email', 'in_password'];
        for (var i in fields) {
            quakelive.mod_register.StyleAsDefault(fields[i]);
            $('#' + fields[i]).focus(quakelive.mod_register.FocusField);
            $('#' + fields[i]).blur(quakelive.mod_register.BlurField)
        }
    };
    quakelive.RegisterModule('login', module)
})(jQuery);
(function ($) {
    var module = {};
    var capturedData = null;
    module.Init = function () {
        quakelive.AddHook('OnLayoutLoaded', module.checkSection)
    };
    module.LAYOUT = 'postlogin';
    module.ShowContent = function (content) {
        quakelive.ShowContent(content);
        $('#previews > a').lightbox()
    };
    module.checkSection = function () {
        try {
            var resetValance = true;
            var vnode = $('#v-' + quakelive.valanceData.name);
            if (quakelive.pathParts[0] == 'preview') {
                if (!capturedData) {
                    capturedData = {};
                    var fields = ['background-color', 'background-image', 'background-repeat', 'background-position'];
                    for (var index in fields) {
                        var field = fields[index];
                        capturedData[field] = vnode.css(field)
                    }
                }
                var valanceMapping = {
                    'dcmap07': '2009-6m6w-1',
                    'coldcaptures': '2009-6m6w-2',
                    'bloodlust': '2009-6m6w-3',
                    'classicduel': '2009-6m6w-4',
                    'conundrum': '2009-6m6w-5',
                    'quarantine': '2009-6m6w-6'
                };
                var valance = valanceMapping[quakelive.pathParts[1]];
                if (valance) {
                    vnode.css('background-color', '#000033');
                    vnode.css('background-image', 'url(' + quakelive.resource('/css/valances/' + valance + '/default.jpg') + ')');
                    vnode.css('background-repeat', 'no-repeat');
                    vnode.css('background-position', 'center top');
                    resetValance = false
                }
            }
            if (resetValance) {
                for (var field in capturedData) {
                    vnode.css(field, capturedData[field])
                }
            }
        } catch(e) {}
    };
    quakelive.RegisterModule('preview', module)
})(jQuery);
(function ($) {
    var module = {
        LAYOUT: 'postlogin',
        TITLE: 'Start a Match'
    };
    var ExpandMode = {
        AUTO: 1,
        MANUAL: 2
    };
    module.expandMode = ExpandMode.MANUAL;
    module.baseDefaultGameCfg = {
        'game_type': mapdb.GameTypes.CTF,
        'arena': 'qzdm1',
        'location': 0,
        'sv_hostname': '',
        'g_password': '',
        'difficulty': 0,
        'player_slots': 8,
        'player_slots_used': 1,
        'time_limit': 10,
        'round_limit': 8,
        'frag_limit': 30,
        'capture_limit': 8,
        'friendly_fire': 0,
        'dmflags': 0,
        'map_tag': mapdb.MapTags.NONE
    };
    module.sharedCfg = {
        'location': 0,
        'sv_hostname': '',
        'g_password': ''
    };
    module.gameTypeDefaults = {};
    module.gameTypeDefaults[mapdb.GameTypes.FFA] = {
        'arena': 'qzdm7',
        'time_limit': 20,
        'frag_limit': 30,
        'friendly_fire': 0,
        'dmflags': 0
    };
    module.gameTypeDefaults[mapdb.GameTypes.DUEL] = {
        'arena': 'qztourney1',
        'time_limit': 10,
        'frag_limit': 0,
        'friendly_fire': 0,
        'dmflags': 0
    };
    module.gameTypeDefaults[mapdb.GameTypes.TDM] = {
        'arena': 'qzdm6',
        'time_limit': 15,
        'frag_limit': 0,
        'friendly_fire': 1,
        'dmflags': 0
    };
    module.gameTypeDefaults[mapdb.GameTypes.CA] = {
        'arena': 'qzca1',
        'time_limit': 20,
        'round_limit': 10,
        'friendly_fire': 0,
        'dmflags': 28
    };
    module.gameTypeDefaults[mapdb.GameTypes.CTF] = {
        'arena': 'qzctf1',
        'time_limit': 20,
        'capture_limit': 8,
        'friendly_fire': 0,
        'dmflags': 0
    };
    module.Init = function () {
        module.gameTypeData = {};
        for (var i in module.gameTypeDefaults) {
            var data = {};
            data.cfg = $.extend({},
            module.baseDefaultGameCfg, module.gameTypeDefaults[i]);
            data.defaultCfg = $.extend({},
            module.baseDefaultGameCfg, module.gameTypeDefaults[i]);
            data.lockedCfg = {};
            module.gameTypeData[i] = data
        }
        module.LoadSettings();
        module.gameCfg = null;
        module.defaultGameCfg = null;
        module.gameCfgDelta = {};
        for (var index in module.gameCfg) {
            module.gameCfgDelta[index] = false
        }
    };
    var GameTypeList = function () {
        this.vector = {};
        for (var i = 0; i < arguments.length; ++i) {
            this.vector[arguments[i]] = true
        }
        this.hasGameType = function (type) {
            return typeof(this.vector[type]) != 'undefined'
        };
        this.getRandom = function () {
            var keys = [];
            for (var key in this.vector) {
                keys.push(key)
            }
            return keys[Math.floor(Math.random() * keys.length)]
        }
    };
    var ALL_GAME_TYPES = new GameTypeList(mapdb.GameTypes.FFA, mapdb.GameTypes.DUEL, mapdb.GameTypes.TDM, mapdb.GameTypes.CA, mapdb.GameTypes.CTF);
    var FloatingBox = function (userOptions) {
        var o = $.extend({
            sentinel: '',
            box: '',
            margin: 10
        },
        userOptions);
        var $box;
        this.Scroll = function () {
            if (!$(o.sentinel).length) {
                return
            }
            var sentinelTop = $(o.sentinel).offset({
                scroll: false
            }).top;
            var windowScrollTop = $(window).scrollTop();
            var field = 'padding-top';
            if (windowScrollTop > sentinelTop) {
                $box.css(field, (windowScrollTop - sentinelTop + o.margin) + 'px')
            } else {
                $box.css(field, '0px')
            }
        };
        this.Prepare = function () {
            $(window).scroll(this.Scroll);
            $box = $(o.box)
        }
    };
    module.ShowContent = function (content) {
        if (!quakelive.IsLoggedIn()) {
            return false
        }
        quakelive.ShowContent(content);
        PreparePanelHandlers();
        var fb;
        if (quakelive.pathParts[1] == "training") {
            fb = new FloatingBox({
                sentinel: '#prac_guidenavpanel_sentinel',
                box: '.prac_guidenavpanel'
            })
        } else {
            fb = new FloatingBox({
                sentinel: '#summary_sentinel',
                box: '.prac_summary'
            })
        }
        fb.Prepare();
        module.BarClicked('panel_gametype', true);
        module.BarClicked('panel_customize', true);
        module.BarClicked('panel_arena', true)
    };
    var cfgToCvars = {
        'sv_hostname': 'sv_hostname',
        'g_password': 'g_password',
        'game_type': 'g_gametype',
        'time_limit': 'timelimit',
        'round_limit': 'roundlimit',
        'frag_limit': 'fraglimit',
        'capture_limit': 'capturelimit',
        'friendly_fire': 'g_friendlyfire',
        'dmflags': 'dmflags'
    };
    var ignoredFields = {
        'game_type': true,
        'player_slots_used': true,
        'map_tag': true
    };
    module.SaveSettings = function () {
        var data = module.gameTypeData[module.gameCfg.game_type];
        var saveData = {};
        for (var field in data.cfg) {
            if (ignoredFields[field]) {
                continue
            }
            saveData[field] = data.cfg[field]
        }
        SetCvar("web_start_settings_" + module.gameCfg.game_type, JSON.stringify(saveData));
        SetCvar("web_start_gametype", module.gameCfg.game_type)
    };
    module.LoadSettings = function () {
        for (var index in module.gameTypeData) {
            var data = module.gameTypeData[index];
            var json = quakelive.cvars.Get("web_start_settings_" + index, "{}").value;
            var savedFields = quakelive.Eval(json);
            if (savedFields.arena && mapdb.maps[savedFields.arena] && mapdb.maps[savedFields.arena].hasGameType(index)) {
                data.cfg = $.extend(data.cfg, savedFields)
            }
        }
        module.defaultGameType = quakelive.cvars.Get("web_start_gametype", mapdb.GameTypes.CTF).value
    };
    module.Play = function () {
        module.SaveSettings();
        if (module.gameCfg.sv_hostname.length == 0 || module.gameCfg.g_password.length == 0 || module.gameCfg.location == 0) {
            qlPrompt({
                title: 'Error Launching Server',
                body: 'You must fill out all of the "Configure Private Match" settings in order to start a private match.',
                alert: true
            });
            return
        }
        var launchError = function (msg) {
            qlPrompt({
                title: 'Error Launching Server',
                body: 'There was a problem starting your private match: ' + msg,
                alert: true
            })
        };
        $.ajax({
            url: '/request/start',
            type: 'post',
            data: {
                'location': module.gameCfg.location,
                'gametype': mapdb.GameTypeShortNames[module.gameCfg.game_type],
                'mapname': module.gameCfg.arena,
                'sv_hostname': module.gameCfg.sv_hostname,
                'g_password': module.gameCfg.g_password
            },
            dataType: 'json',
            mode: 'abort',
            port: 'mod_request',
            success: function (json) {
                if (json.ECODE === 0) {
                    var msg = ["Your private match will start soon, and will remain online until it has been empty for 15 minutes.<br/><br/>", "<b>Match Name:</b> ", module.GetHostName(), "<br/>", "<b>Game Type:</b> ", mapdb.GameTypeShortNames[module.gameCfg.game_type].toUpperCase(), "<br/>", "<b>Arena:</b> ", mapdb.maps[module.gameCfg.arena].name, "<br/>", "<b>Password:</b> ", module.gameCfg.g_password, "<br/><br/>", "Make sure to click \"Customize\" on the Match Browser and choose to <br/><a href='javascript:;' onclick='quakelive.Goto(\"home;private=1\"); $(\"#prompt\").jqmHide(); return false'>Show Private Matches</a>.<br/>"].join("");
                    qlPrompt({
                        title: 'Private match request has been received!',
                        body: msg,
                        alert: true
                    })
                } else {
                    launchError(json.MSG)
                }
            },
            error: function (xmlHttp, errType, exc) {
                launchError(errType)
            }
        })
    };
    module.SetGameType = function (gt) {
        var gtData = module.gameTypeData[gt];
        var oldGameCfg = module.gameCfg;
        module.gameCfg = gtData.cfg;
        module.defaultGameCfg = gtData.defaultCfg;
        module.lockedGameCfg = gtData.lockedCfg;
        for (var i in module.gameCfg) {
            module.SetGameCfg(i, module.gameCfg[i])
        }
        if (oldGameCfg) {
            module.SetGameCfg('player_slots_used', oldGameCfg.player_slots_used);
            module.SetGameCfg('map_tag', oldGameCfg.map_tag);
            module.SetGameCfg('sv_hostname', oldGameCfg.sv_hostname);
            module.SetGameCfg('g_password', oldGameCfg.g_password);
            module.SetGameCfg('location', oldGameCfg.location)
        }
        module.gameCfg.game_type = null;
        module.SetGameCfg('game_type', gt);
        module.CheckPlayerSlots(module.gameCfg)
    };
    module.CheckPlayerSlots = function (params) {
        var map = mapdb.maps[params.arena];
        var gt = map.gametypes[params.game_type];
        var actualPlayerSlots = params.player_slots;
        if (actualPlayerSlots != 1) {
            if (actualPlayerSlots < gt.min_players) {
                actualPlayerSlots = gt.min_players
            } else if (actualPlayerSlots > gt.max_players) {
                actualPlayerSlots = gt.max_players
            }
            if (params.game_type == mapdb.GameTypes.DUEL) {
                actualPlayerSlots = 2
            }
        }
        var $sel = $('#select_player_slots').empty();
        $sel.append('<option value="1">Just Me</option>');
        for (var i = gt.min_players; i <= gt.max_players; i += 2) {
            $sel.append('<option value="' + i + '">' + i + ' Players</option>')
        }
        module.panel_customize.SetField('player_slots', actualPlayerSlots);
        if (actualPlayerSlots != params.player_slots) {
            module.SetGameCfg('player_slots', actualPlayerSlots)
        }
    };
    module.GetHostPrefix = function () {
        var newName = [quakelive.usergroup.shortName];
        newName[newName.length] = '';
        return newName.join(' ')
    };
    module.GetHostName = function () {
        var name = module.GetHostPrefix();
        if (module.gameCfg) {
            name += module.gameCfg.sv_hostname
        }
        return name
    };

    function GameTypeHandler() {
        var gametypes = [{
            id: mapdb.GameTypes.FFA,
            name: 'ffa',
            title: 'Free For All',
            desc: 'Free for all combat where the player with the most frags wins.'
        },
        {
            id: mapdb.GameTypes.CTF,
            name: 'ctf',
            title: 'Capture The Flag',
            desc: 'Two teams, fighting to capture the opponent\'s flag and return it to their base.'
        },
        {
            id: mapdb.GameTypes.CA,
            name: 'ca',
            title: 'Clan Arena',
            desc: 'Two teams compete to eliminate each other. Team with the last man standing wins the round.'
        },
        {
            id: mapdb.GameTypes.TDM,
            name: 'tdm',
            title: 'Team Deathmatch',
            desc: 'Team-based Free For All. The team with the most frags wins.'
        },
        {
            id: mapdb.GameTypes.DUEL,
            name: 'duel',
            title: 'Duel',
            desc: 'A 1 vs. 1 test of skill. Just you, your opponent, and the arena. Most frags wins.'
        }];
        this.Prepare = function () {
            var container = $('<div>');
            for (var index in gametypes) {
                var gt = gametypes[index];
                var link = $('<a title="' + gt.desc + '" href="javascript:;" class="btn_gametype gt_' + gt.id + '" onclick="quakelive.mod_request.GameTypeClicked(\'' + gt.id + '\'); return false"></a>');
                link.append('<div class="gametype_' + gt.name + '"></div><h1>' + gt.title + '</h1>');
                container.append(link)
            }
            container.append('<div class="cl"></div>');
            this.$panel.find('.gametypes').empty().append(container)
        };
        this.Show = function () {};
        this.Hide = function () {};
        this.Modify = function (params, delta) {
            if (!delta.game_type) {
                return
            }
            this.$panel.find('.params').text(mapdb.GameTypeNames[params.game_type]);
            this.$panel.find('.btn_gametype').each(function () {
                var $this = $(this);
                if ($this.hasClass('gt_' + params.game_type)) {
                    $this.addClass('selected_gametype')
                } else if ($this.hasClass('selected_gametype')) {
                    $this.removeClass('selected_gametype')
                }
            })
        }
    };

    function ArenaHandler() {
        var activeTag = mapdb.MapTags.NONE,
        activeGameType = mapdb.GameTypes.NONE;
        var lastTag = mapdb.MapTags.NONE,
        lastGameType = mapdb.GameTypes.NONE;
        this.$container = null;
        this.Prepare = function () {
            var container = $('<div></div>');
            for (var index in mapdb.orderedMaps) {
                var map = mapdb.maps[mapdb.orderedMaps[index]];
                var tags = [];
                var linkClasses = ["btn_arena", "map_" + map.sysname];
                for (var i in map.tag_list) {
                    linkClasses.push('tag_' + map.tag_list[i]);
                    tags.push(mapdb.MapTagNames[map.tag_list[i]])
                }
                for (var i in map.gametypes) {
                    linkClasses.push('gt_' + map.gametypes[i].gametype)
                }
                var link = $('<a title="Tags: ' + tags.join(', ') + '" class="' + linkClasses.join(' ') + '" href="javascript:;" onclick="quakelive.mod_request.ArenaClicked(\'' + map.sysname + '\'); return false"></a>').append('<img src="' + quakelive.resource('/images/levelshots/md/' + map.sysname + '.jpg') + '" />').append("<br />" + map.name).appendTo(container)
            }
            container.append("<div class='cl'></div>");
            this.$panel.find('.arenas').append(container);
            this.$container = container
        };
        this.Show = function () {};
        this.Hide = function () {};
        this.Modify = function (params, delta) {
            if (!delta.game_type && !delta.map_tag && !delta.arena) {
                return
            }
            var arenaClass = 'map_' + params.arena;
            if (delta.arena) {
                this.$panel.find('.params').text(mapdb.maps[params.arena].name);
                this.$panel.find('.selected_arena').removeClass('selected_arena');
                this.$panel.find('.' + arenaClass).addClass('selected_arena')
            }
            if (delta.game_type || delta.map_tag) {
                this.$container.find('.btn_arena').each(function () {
                    var $this = $(this);
                    var show = true;
                    if (!$this.hasClass('gt_' + params.game_type)) {
                        show = false
                    }
                    if (params.map_tag != mapdb.MapTags.NONE && !$this.hasClass('tag_' + params.map_tag)) {
                        show = false
                    }
                    if (show) {
                        if ($this.hasClass(arenaClass)) {
                            $this.addClass('selected_arena')
                        } else {
                            $this.removeClass('selected_arena')
                        }
                        $this.show()
                    } else {
                        $this.hide()
                    }
                })
            }
        }
    }

    function CustomizeHandler() {
        this.settings = [{
            'title': 'Match Name',
            'description': 'The name that will be displayed for your game in the Match Browser.',
            'field': 'sv_hostname',
            'game_types': ALL_GAME_TYPES,
            'default': 0,
            'input': true,
            'type': 'string',
            'max_length': '20'
        },
        {
            'title': 'Password',
            'description': 'Secures access to your game.',
            'field': 'g_password',
            'game_types': ALL_GAME_TYPES,
            'default': 0,
            'input': true,
            'type': 'string',
            'max_length': '20'
        },
        {
            'title': 'Location',
            'description': 'Geographical location where your game will be held.',
            'field': 'location',
            'game_types': ALL_GAME_TYPES,
            'default': 0,
            'values': []
        }];
        this.GetNameForIntegerValue = function (setting, value) {
            if (setting.type !== 'string') {
                value = parseInt(value)
            }
            for (var i in setting.values) {
                if (setting.values[i].value == value) {
                    return setting.values[i].name
                }
            }
            return value
        };
        this.settingsLookup = {};
        for (var i in this.settings) {
            var setting = this.settings[i];
            this.settingsLookup[setting.field] = setting
        }
        var triggeredByCode = false;

        function MonitorChangeGenerator(field, isInput) {
            return function () {
                if (!triggeredByCode) {
                    module.lockedGameCfg[field] = true
                }
                if (isInput) {
                    module.SetGameCfg(field, $('#input_' + field).val())
                } else {
                    module.SetGameCfg(field, $('#select_' + field).val())
                }
                module.GameCfgUpdated()
            }
        };
        this.$container = null;
        this.Prepare = function () {
            var container = $('<div></div>');
            for (var index in this.settings) {
                var setting = this.settings[index];
                var $node = $('<div class="setting" id="' + setting.field + '">');
                for (var i = 0; i < mapdb.GameTypes.MAX; ++i) {
                    if (setting.game_types.hasGameType(i)) {
                        $node.addClass('gt_' + i)
                    }
                }
                var $field = $('<div class="field">');
                $field.append('<label>' + setting.title + '</label>');
                $field.append('<span>' + setting.description + '</span>');
                var $value = $('<div class="value">');
                if (setting.input === true) {
                    var maxLength = setting.max_length;
                    if (setting.field == "sv_hostname") {
                        maxLength -= module.GetHostPrefix().length
                    }
                    var $input = $('<input id="input_' + setting.field + '" maxlength="' + maxLength + '" />').change(MonitorChangeGenerator(setting.field, setting.input));
                    $value.append($input)
                } else {
                    var $select = $('<select id="select_' + setting.field + '">').change(MonitorChangeGenerator(setting.field));
                    if (setting.field == "location") {
                        quakelive.mod_home.AppendLocationOptions($select)
                    } else {
                        for (var index in setting.values) {
                            var v = setting.values[index];
                            $select.append('<option value="' + v.value + '">' + v.name + '</option>')
                        }
                    }
                    $value.append($select)
                }
                $node.append($('<div class="field_box"></div>').append($field));
                $node.append($('<div class="value_box"></div>').append($value));
                $node.append('<div class="cl"></div>');
                container.append($node)
            }
            this.$container = container;
            this.$panel.find('.customizations').empty().append(this.$container)
        };
        this.Show = function () {};
        this.Hide = function () {};
        this.Modify = function (params, delta) {
            if (delta.game_type || delta.arena) {
                this.$panel.find('.params').text("Default");
                var self = this;
                this.$container.find('.setting').each(function () {
                    var $this = $(this);
                    var setting = self.settingsLookup[this.id];
                    if (setting.game_types.hasGameType(params.game_type)) {
                        $this.show()
                    } else {
                        $this.hide()
                    }
                })
            }
            if (delta.location) {
                var setting = this.settingsLookup['sv_hostname'];
                var prefix = module.GetHostPrefix();
                var maxLength = setting.max_length - prefix.length;
                if (maxLength < 4) {
                    maxLength = 4
                }
                $('#input_sv_hostname').attr('maxlength', maxLength);
                var newHostName = params.sv_hostname;
                if (newHostName.length > maxLength) {
                    newHostName = newHostName.substr(0, maxLength)
                }
                module.SetGameCfg('sv_hostname', newHostName);
                module.GameCfgUpdated()
            }
            var modified = false;
            for (var varName in delta) {
                var setting = this.settingsLookup[varName];
                if (setting) {
                    this.SetField(varName, params[varName]);
                    if (params[varName] != module.defaultGameCfg[varName]) {
                        modified = true
                    }
                }
            }
            this.$panel.find('.params').text('Required')
        };
        this.SetField = function (fieldName, fieldValue, isCodeTriggered) {
            triggeredByCode = isCodeTriggered;
            $('#select_' + fieldName).val(fieldValue);
            $('#input_' + fieldName).val(fieldValue);
            triggeredByCode = false
        }
    }
    module.ResetCustomize = function () {
        for (var i in module.defaultGameCfg) {
            if (module.panel_customize.settingsLookup[i]) {
                module.SetGameCfg(i, module.defaultGameCfg[i])
            }
        }
        module.CheckPlayerSlots(module.gameCfg);
        module.GameCfgUpdated()
    };
    var players = [];
    module.PlayerClicked = function (node, playerName) {
        var $node = $(node);
        if ($node.hasClass('plaque_selected')) {
            for (var i = 0; i < players.length; ++i) {
                if (players[i] == playerName) {
                    players.splice(i, 1);
                    break
                }
            }
            $node.removeClass('plaque_selected');
            module.SetGameCfg('player_slots_used', module.gameCfg.player_slots_used - 1);
            module.GameCfgUpdated()
        } else {
            if (module.gameCfg.player_slots_used < module.gameCfg.player_slots) {
                players[players.length] = playerName;
                $node.addClass('plaque_selected');
                module.SetGameCfg('player_slots_used', module.gameCfg.player_slots_used + 1);
                module.GameCfgUpdated()
            }
        }
    };

    function PlayerHandler() {
        this.$container = null;
        this.Prepare = function () {
            var $container = $('<div>');
            var $plaque;
            var chosenPlayers = {};
            for (var i in players) {
                chosenPlayers[players[i]] = true
            }
            var playerName = quakelive.username;
            var playerModelskin = quakelive.playericons.modelskin;
            $plaque = $('<a href="javascript:;" class="plaque plaque_selected"></a>');
            $plaque.append('<img class="modelskin" src="' + quakelive.resource('/images/players/icon_md/' + playerModelskin + '.jpg') + '" />');
            $plaque.append('<h1>' + playerName + '</h1>');
            $plaque.append('<div class="cl"></div>');
            $container.append($('<div class="plaque_box"></div>').append($plaque));
            for (var index in botdb.bots) {
                var bot = botdb.bots[index];
                var cls = "plaque";
                if (chosenPlayers[bot.sysname]) {
                    cls += " plaque_selected"
                }
                $plaque = $('<a href="javascript:;" class="' + cls + '" id="' + bot.sysname + '" onclick="quakelive.mod_request.PlayerClicked(this, \'' + bot.sysname + '\'); return false"><div class="add"></div><div class="remove"></div></a>');
                $plaque.append('<img class="modelskin" src="' + quakelive.resource('/images/players/icon_md/' + bot.modelskin + '.jpg') + '" />');
                $plaque.append('<h1>' + bot.name + '</h1>');
                $plaque.append('<div class="cl"></div>');
                $container.append($('<div class="plaque_box"></div>').append($plaque))
            }
            $container.append('<div class="cl"></div>');
            this.$container = $container;
            this.$panel.find('.players').empty().append(this.$container)
        };
        this.Modify = function (params, delta) {
            if (!delta.player_slots_used && !delta.player_slots) {
                return
            }
            if (delta.player_slots && params.player_slots < params.player_slots_used) {
                var playerDelta = params.player_slots_used - params.player_slots;
                for (var i = players.length - playerDelta; i < players.length; ++i) {
                    this.$container.find('#' + players[i]).removeClass('plaque_selected')
                }
                players.splice(players.length - playerDelta, playerDelta);
                module.SetGameCfg('player_slots_used', 1 + players.length);
                module.GameCfgUpdated()
            }
            var str = params.player_slots_used + " of " + params.player_slots + " slots filled";
            this.$panel.find('.params').text(str);
            if (params.player_slots_used >= params.player_slots) {
                this.$panel.find('.players').addClass('players_noslots')
            } else {
                this.$panel.find('.players').removeClass('players_noslots')
            }
        };
        this.Show = function () {};
        this.Hide = function () {}
    }

    function LaunchHandler() {
        this.Prepare = function () {
            var settings = module.panel_customize.settings;
            var $node = $('.summary_settings').empty();
            for (var index in settings) {
                var setting = settings[index];
                $node.append('<div class="summary_field summary_field_' + setting.field + '"><b>' + setting.title + '</b><br /><span class="summary_field_data"></span></div>')
            }
        };
        this.Modify = function (params, delta) {
            for (var field in delta) {
                var setting = module.panel_customize.settingsLookup[field];
                if (setting) {
                    var niceVal = module.panel_customize.GetNameForIntegerValue(setting, params[field]);
                    if (niceVal.length === 0) {
                        niceVal = '<span class="noneText">None</span>';
                        $('.summary_field_' + field + ' .summary_field_data').html(niceVal)
                    } else {
                        if (field == "sv_hostname") {
                            niceVal = module.GetHostName()
                        } else if (field == "location") {
                            var loc = locdb.GetByID(niceVal);
                            if (!loc) {
                                for (var ind in locdb.locations) {
                                    loc = locdb.locations[ind];
                                    break
                                }
                                if (loc) {
                                    module.gameCfg.location = loc.id
                                } else {
                                    module.gameCfg.location = 0
                                }
                            }
                            if (loc) {
                                niceVal = loc.countryAbbr + ', ' + loc.GetCityState()
                            }
                        }
                        $('.summary_field_' + field + ' .summary_field_data').text(niceVal)
                    }
                }
            }
            if (delta.arena) {
                var map = mapdb.maps[params.arena];
                $('.prac_summary .summary_header').css('background-image', 'url(' + quakelive.resource('/images/levelshots/lg/' + map.sysname + '.jpg') + ')');
                $('.prac_summary .map_title').text(map.name);
                var settings = module.panel_customize.settings;
                for (var index in settings) {
                    var setting = settings[index];
                    if (!setting.game_types.hasGameType(params.game_type)) {
                        $('.summary_field_' + setting.field).hide()
                    } else {
                        $('.summary_field_' + setting.field).show()
                    }
                }
            }
            if (delta.game_type) {
                $('.prac_summary .summary_gametype').html('<img src="' + quakelive.resource('/images/start_match/gametypes_sm/' + mapdb.GameTypeShortNames[params.game_type] + '.png') + '" /> <span style="position: relative; top: -8px;">' + mapdb.GameTypeNames[params.game_type] + "</span>")
            }
            if (delta.player_slots || delta.player_slots_used) {
                var playerName = quakelive.username;
                var playerModelskin = quakelive.playericons.modelskin;
                var $c = $('<div>');
                for (var index = 0; index < params.player_slots; ++index) {
                    var name, image;
                    $r = $('<div class="chosen_player"></div>');
                    if (index == 0) {
                        image = '/images/players/icon_md/' + playerModelskin + '.jpg';
                        name = playerName
                    } else if (index - 1 < players.length) {
                        var bot = botdb.bots[players[index - 1]];
                        image = '/images/players/icon_md/' + bot.modelskin + '.jpg';
                        name = bot.name
                    } else {
                        image = '/images/start_match/random_ai.png';
                        name = 'Random AI Player'
                    }
                    $r.append('<img class="modelskin" src="' + quakelive.resource(image) + '" />');
                    $r.append('<h1>' + name + '</h1>');
                    $r.append('<div class="cl"></div>');
                    $c.append($('<div class="chosen_player_box"></div>').append($r))
                }
            }
        };
        this.Show = function () {};
        this.Hide = function () {}
    }
    var panelHandlers = {
        'panel_gametype': new GameTypeHandler(),
        'panel_arena': new ArenaHandler(),
        'panel_customize': new CustomizeHandler(),
        'panel_launcher': new LaunchHandler()
    };
    module.ph = panelHandlers;
    var PrepareStages = {
        Wire: 0,
        Prepare: 1,
        Modify: 2
    };

    function PreparePanelHandlers() {
        var delta = {};
        for (var i in module.gameCfg) {
            delta[i] = true
        }
        for (var prepareStage = 0; prepareStage < 2; ++prepareStage) {
            for (var panelId in panelHandlers) {
                var handler = panelHandlers[panelId];
                if (prepareStage == PrepareStages.Wire) {
                    handler.$panel = $('#' + panelId);
                    module[panelId] = panelHandlers[panelId]
                } else if (prepareStage == PrepareStages.Prepare) {
                    handler.Prepare()
                } else {}
            }
        }
        for (var panelId in panelHandlers) {
            var handler = panelHandlers[panelId];
            handler.Modify(module.gameCfg, delta)
        }
        module.SetGameType(module.defaultGameType);
        module.GameCfgUpdated()
    };
    module.SetGameCfg = function (name, value) {
        if (typeof(module.gameCfg[name]) == 'undefined') {
            return
        }
        module.gameCfgDelta[name] = true;
        module.gameCfg[name] = value
    };
    module.GameCfgUpdated = function () {
        var delta = module.gameCfgDelta;
        module.gameCfgDelta = {};
        for (var index in panelHandlers) {
            var panel = panelHandlers[index];
            panel.Modify(module.gameCfg, delta)
        }
    };
    module.BarClicked = function (panelId, forceOn) {
        var handler = panelHandlers[panelId];
        if (!handler) {
            return
        }
        if (!forceOn && handler.$panel.hasClass('panel_expanded')) {
            handler.$panel.removeClass('panel_expanded');
            handler.Hide()
        } else {
            if (module.expandMode == ExpandMode.AUTO) {
                $('.panel_expanded').removeClass('panel_expanded')
            }
            handler.$panel.addClass('panel_expanded').show();
            handler.Show()
        }
    };
    module.GameTypeClicked = function (gt) {
        module.SetGameType(gt);
        module.GameCfgUpdated()
    };
    module.ArenaClicked = function (sysname) {
        module.SetGameCfg('arena', sysname);
        module.CheckPlayerSlots(module.gameCfg);
        module.GameCfgUpdated()
    };
    quakelive.RegisterModule('request', module)
})(jQuery);
(function ($) {
    var module = {};
    module.LAYOUT = 'postlogin';
    var matches = undefined;
    var template = '<div class="matchDiv"><div class="map" title="Click for Details"></div><div class="content"></div></div>';
    module.latest = 0;
    module.timeoutHandle = undefined;
    module.updateTime = 30000;
    module.Init = function () {};
    module.OnLayoutLoaded = function () {};
    module.Hook_OnContentLoaded = function (targetModule) {
        if (targetModule != module) {
            module.StopUpdates()
        }
    };
    module.ShowContent = function (content) {
        module.latest = 0;
        quakelive.ShowContent(content);
        matches = $('#recent_matches');
        module.StartUpdates()
    };
    module.StopUpdates = function () {
        if (module.timeoutHandle != null) {
            clearTimeout(module.timeoutHandle);
            module.timeoutHandle = null
        }
    };
    module.StartUpdates = function () {
        module.StopUpdates();
        module.DoUpdate()
    };
    module.DoUpdate = function () {
        $.ajax({
            type: 'GET',
            url: '/tracker/from/' + module.latest,
            dataType: 'json',
            success: function (o) {
                module.UpdateDisplay(o)
            },
            complete: function () {
                module.timeoutHandle = setTimeout(module.DoUpdate, module.updateTime)
            }
        });
        quakelive.Tick()
    };
    module.UpdateDisplay = function (o) {
        if (o.length == 0) {
            return
        }
        if (module.latest == 0) {
            matches.empty()
        }
        module.latest = o[0].PUBLIC_ID;
        for (var i = o.length - 1; i >= 0; i--) {
            var match = o[i];
            var matchnode = $(template);
            var friendlyTime = new Date(match.GAME_TIMESTAMP);
            var months = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'];
            friendlyTime = [months[friendlyTime.getMonth()], ' ', friendlyTime.getDate(), ', ', friendlyTime.getHours(), ':', ZeroPad(friendlyTime.getMinutes())].join('');
            var mapdiv = matchnode.find('.map');
            mapdiv.append('<div class="levelshot"/>');
            var levelshot = mapdiv.find('.levelshot');
            levelshot.css('background-image', 'url("' + quakelive.resource('/images/levelshots/md/' + match.MAP_NAME_SHORT + '.jpg') + '")');
            levelshot.append('<div class="gametype"><img src="' + quakelive.resource('/images/gametypes/' + match.GAME_TYPE.toLowerCase() + '_md.png') + '"/></div>');
            mapdiv.append('<div class="mapTitle">' + match.MAP_NAME + '</div>');
            mapdiv.append('<div class="gameType">' + match.GAME_TYPE_FULL + '</div>');
            mapdiv.append('<div class="gameTimestamp">' + friendlyTime + '</div>');
            var duration = ZeroPad(Math.floor(match.GAME_LENGTH / 60)) + ':' + ZeroPad(match.GAME_LENGTH % 60);
            mapdiv.append('<div class="gameLength">Duration: ' + duration + '</div>');
            mapdiv.data('id', match.PUBLIC_ID);
            mapdiv.data('gt', match.GAME_TYPE);
            mapdiv.click(function () {
                quakelive.statstip.OnClickStatsTooltip(matchnode, $(this).data('id'), $(this).data('gt'), 'tracker')
            });
            for (var thisDef in quakelive.statstip.BOARD_DEFS) {
                try {
                    matchnode.find('.content').append(quakelive.statstip.GetScoreboard(match, quakelive.statstip.BOARD_DEFS[thisDef], {
                        show_optional: false
                    }))
                } catch(e) {}
            }
            matchnode.find('.content').append('<div class="cl"></div>');
            matches.prepend(matchnode)
        }
    };
    quakelive.AddHook('OnContentLoaded', module.Hook_OnContentLoaded);
    quakelive.RegisterModule('tracker', module)
})(jQuery);
(function ($) {
    var qlxf = {};
    window.QLXFire = qlxf;
    qlxf.enabled = false;
    qlxf.Opts = null;
    qlxf.DefaultOpts = {
        gameid: 5771,
        status: 'Browsing Quake Live',
        siteurl: quakelive.siteConfig.baseUrl,
        mediaurl: quakelive.siteConfig.staticUrl,
        profileurl: '',
        username: '',
        usericon: ''
    };
    qlxf.ServerInfo = {
        mapname: '',
        joinurl: '',
        publicid: 0,
        servername: '',
        maptitle: '',
        mapicon: '',
        gametype: '',
        gametypeshort: '',
        gametypeicon: '',
        numclients: 0,
        maxclients: 0,
        redscore: 0,
        bluescore: 0,
        roundlimit: 0,
        capturelimit: 0,
        fraglimit: 0,
        timelimit: 0
    };
    qlxf.EnableXFire = function () {
        if (qlxf.enabled === true) {
            return
        }
        $.ajax({
            url: 'http://www.xfire.com/xfire_egame/egame_engine.xf',
            dataType: 'script',
            success: function () {
                if (typeof(xfire_egame) === 'undefined') {
                    return
                }
                var info = ParseModelSkin(quakelive.cvars.Get("model", "sarge/default").value);
                qlxf.DefaultOpts.usericon = quakelive.PlayerAvatarPath.MD + info.model + '_' + info.skin + '.jpg';
                qlxf.DefaultOpts.username = quakelive.username;
                qlxf.DefaultOpts.profileurl = '/r/profile/summary/' + quakelive.username;
                qlxf.DefaultXFire();
                quakelive.AddHook('OnGameUpdated', qlxf.OnGameUpdated);
                quakelive.AddHook('OnGameStarted', qlxf.OnGameStarted);
                quakelive.AddHook('OnGameExited', qlxf.OnGameExited);
                qlxf.enabled = true
            }
        })
    };
    var GAME_POLL_MS = 2 * 60 * 1000;
    var monitorHandle = null;
    var monitorPublicId = 0;

    function StopGameMonitor() {
        if (monitorHandle !== null) {
            clearTimeout(monitorHandle);
            monitorHandle = null
        }
    }

    function StartGameMonitor(public_id) {
        StopGameMonitor();
        monitorHandle = setInterval(function () {
            qlxf.PollGameInfo(public_id)
        },
        GAME_POLL_MS)
    }
    var ServerTeam = {
        Free: 0,
        Red: 1,
        Blue: 2,
        Spec: 3
    };

    function parseObject(o) {
        var opts = qlxf.Opts;
        opts.servername = o.host_name;
        opts.mapname = o.map;
        opts.maptitle = o.map_title;
        opts.mapicon = '/images/levelshots/sm/' + o.map + '.jpg';
        opts.gametype = o.game_type_title;
        opts.gametypeshort = mapdb.GameTypeShortNames[o.game_type];
        opts.gametypeicon = '/images/gametypes/' + opts.gametypeshort + '_md.png';
        opts.numclients = o.num_clients;
        opts.maxclients = o.max_clients;
        opts.redscore = o.g_redscore;
        opts.bluescore = o.g_bluescore;
        opts.roundlimit = o.roundlimit;
        opts.capturelimit = o.capturelimit;
        opts.fraglimit = o.fraglimit;
        opts.timelimit = o.timelimit;
        if (o.players) {
            function SortPlayers(a, b) {
                if (a.team == b.team) {
                    if (a.score < b.score) {
                        return 1
                    } else if (a.score > b.score) {
                        return -1
                    } else {
                        return 0
                    }
                } else {
                    if (a.team < b.team) {
                        return -1
                    } else if (a.team > b.team) {
                        return 1
                    } else {
                        return 0
                    }
                }
            }
            o.players.sort(SortPlayers);
            for (var i = 0; i < o.players.length; i++) {
                var p = o.players[i];
                p.bot = parseInt(p.bot);
                p.score = parseInt(p.score);
                p.team = parseInt(p.team);
                p.rank = parseInt(p.rank);
                var model = (p.model ? p.model.split('/') : ['sarge', 'default']);
                if (p.team == ServerTeam.Red) {
                    model[1] = 'red'
                } else if (p.team == ServerTeam.Blue) {
                    model[1] = 'blue'
                } else if (model.length == 1 || model[1] == '*') {
                    model[1] = 'default'
                }
                if (p.team == ServerTeam.Spec) {
                    p.score = "SPEC"
                }
                opts['p' + i + '_clan'] = StripColors(p.clan);
                opts['p' + i + '_name'] = StripColors(p.name) + (p.bot ? ' (Bot)' : '');
                opts['p' + i + '_icon'] = quakelive.PlayerAvatarPath.SM + model[0] + '_' + model[1] + '.jpg';
                opts['p' + i + '_score'] = p.score
            }
        }
        qlxf.UpdateXFire()
    }
    qlxf.PollGameInfo = function (server) {
        if (typeof(server) == 'object' && server.g_levelstarttime) {
            parseObject(server);
            return
        } else {
            var serverid = server.public_id || server;
            $.ajax({
                url: '/home/matchdetails/' + serverid,
                dataType: 'json',
                mode: 'abort',
                port: 'matchdetails',
                success: parseObject
            })
        }
    };
    qlxf.DefaultXFire = function () {
        qlxf.Opts = $.extend({},
        qlxf.DefaultOpts);
        qlxf.UpdateXFire()
    };
    qlxf.UpdateXFire = function () {
        xfire_egame.Start(qlxf.Opts)
    };
    qlxf.OnGameStarted = function (o) {
        qlxf.OnGameUpdated(o)
    };
    qlxf.OnGameUpdated = function (o) {
        if (!o.isBotGame && typeof(o.serverInfo) == 'object') {
            StartGameMonitor(o.serverInfo.public_id)
        } else {
            StopGameMonitor()
        }
        var opts = $.extend({},
        qlxf.DefaultOpts, qlxf.ServerInfo);
        if (o.isBotGame === true) {
            opts.status = 'Playing a Practice Match';
            qlxf.Opts = opts;
            qlxf.UpdateXFire()
        } else {
            if (o.serverInfo !== false) {
                opts.status = 'Playing ' + mapdb.GameTypeNames[o.serverInfo.game_type];
                opts.publicid = o.serverInfo.public_id;
                opts.joinurl = '/r/home/join/' + o.serverInfo.public_id;
                qlxf.Opts = opts;
                qlxf.PollGameInfo(o.serverInfo, true)
            } else {
                opts.status = 'Playing an Online Match';
                qlxf.Opts = opts
            }
        }
    };
    qlxf.OnGameExited = function (e) {
        StopGameMonitor();
        qlxf.DefaultXFire()
    }
})(jQuery);

/* JS Module Templates */
quakelive.mod_friends.TPL_MANAGE_ITEM = [unescape("%3Cdiv class=%22prf_friend%22%3E%3Cdiv class=%22head_icon interactive%22%3E%3Cimg class=%22online%22 src=%22"), quakelive.resource("/images/profile/icn_onlineflag.png"), unescape("%22 width=%2230%22 height=%2230%22 style=%22display:none;%22/%3E%3C/div%3E%3Cdiv class=%22player_name%22%3E%3Cimg width=%2216%22 height=%2211%22 /%3E%3Ca href='javascript:;'%3E%3C/a%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22info_left%22%3E%3C/div%3E%3Cdiv class=%22info_middle%22%3E%3C/div%3E%3Cdiv class=%22info_right%22%3E%3Cdiv class=%22invite_controls%22%3E%3Ca href=%22javascript:;%22 class=%22btn_fr_view_profile%22 %3E%3C/a%3E%3Cdiv class=%22cl%22/%3E%3C/div%3E%3Ca href=%22javascript:;%22 class=%22btn_fr_delete_friend%22 %3E%3C/a%3E%3C/div%3E%3C/div%3E")].join('');
quakelive.mod_friends.TPL_INCOMING_ITEM = [unescape("%3Cdiv class=%22prf_friend%22%3E%3Cdiv class=%22head_icon interactive%22%3E%3Cimg class=%22online%22 src=%22"), quakelive.resource("/images/profile/icn_onlineflag.png"), unescape("%22 width=%2230%22 height=%2230%22 style=%22display:none;%22/%3E%3C/div%3E%3Cdiv class=%22player_name%22%3E%3Cimg width=%2216%22 height=%2211%22 /%3E%3Ca href='javascript:;'%3E%3C/a%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22info_left%22%3E%3C/div%3E%3Cdiv class=%22info_middle_right%22%3E%3Cdiv class=%22invite_controls%22%3E%3Ca href=%22javascript:;%22 class=%22btn_fr_view_profile%22 %3E%3C/a%3E%3Cdiv class=%22cl%22/%3E%3C/div%3E%3Ca href=%22javascript:;%22 class=%22btn_fr_block_player%22 %3E%3C/a%3E%3C/div%3E%3Cdiv class=%22info_right%22%3E%3Cdiv class=%22invite_controls%22%3E%3Ca href=%22javascript:;%22 class=%22btn_fr_accept_invite%22 %3E%3C/a%3E%3Cdiv class=%22cl%22/%3E%3C/div%3E%3Ca href=%22javascript:;%22 class=%22btn_fr_decline_invite%22 %3E%3C/a%3E%3C/div%3E%3C/div%3E")].join('');
quakelive.mod_friends.TPL_OUTGOING_ITEM = [unescape("%3Cdiv class=%22prf_friend%22%3E%3Cdiv class=%22head_icon interactive%22%3E%3Cimg class=%22online%22 src=%22"), quakelive.resource("/images/profile/icn_onlineflag.png"), unescape("%22 width=%2230%22 height=%2230%22 style=%22display:none;%22/%3E%3C/div%3E%3Cdiv class=%22player_name%22%3E%3Cimg width=%2216%22 height=%2211%22 /%3E%3Ca href='javascript:;'%3E%3C/a%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22info_left%22%3E%3C/div%3E%3Cdiv class=%22info_middle%22%3E%3C/div%3E%3Cdiv class=%22info_right%22%3E%3Cdiv class=%22invite_controls%22%3E%3Ca href=%22javascript:;%22 class=%22btn_fr_view_profile%22 %3E%3C/a%3E%3Cdiv class=%22cl%22/%3E%3C/div%3E%3Ca href=%22javascript:;%22 class=%22btn_fr_revoke_invite%22 %3E%3C/a%3E%3C/div%3E%3C/div%3E")].join('');
quakelive.mod_friends.TPL_BLOCK_ITEM = [unescape("%3Cdiv class=%22prf_friend%22%3E%3Cdiv class=%22head_icon interactive%22%3E%3Cimg class=%22online%22 src=%22"), quakelive.resource("/images/profile/icn_onlineflag.png"), unescape("%22 width=%2230%22 height=%2230%22 style=%22display:none;%22/%3E%3C/div%3E%3Cdiv class=%22player_name%22%3E%3Cimg width=%2216%22 height=%2211%22 /%3E%3Ca href='javascript:;'%3E%3C/a%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22info_left%22%3E%3C/div%3E%3Cdiv class=%22info_middle%22%3E%3C/div%3E%3Cdiv class=%22info_right%22%3E%3Cdiv class=%22invite_controls%22%3E%3Ca href=%22javascript:;%22 class=%22btn_fr_view_profile%22 %3E%3C/a%3E%3Cdiv class=%22cl%22/%3E%3C/div%3E%3Ca href=%22javascript:;%22 class=%22btn_fr_unblock_player%22 %3E%3C/a%3E%3C/div%3E%3C/div%3E")].join('');
quakelive.mod_friends.TPL_SEARCH_EMAIL_REMOTE = [unescape("%3Cdiv class=%22qlv_searchForm%22%3E%3Cdiv class=%22qlv_success_left%22%3E%3Cimg src=%22"), quakelive.resource("/images/sf/friends/invite_success.gif"), unescape("%22 width=%22215%22 height=%22103%22 /%3E%3Cp%3E&nbsp;%3C/p%3E%3C/div%3E%3Cdiv class=%22qlv_searchForm_right%22%3E%3Cp class=%22footerCopy%22%3E&nbsp;%3C/p%3E%3Cp style=%22margin-bottom: 0px;%22%3E%3Cspan style=%22font-family: Arial,Helvetica,sans-serif; font-size: 12pt; font-weight: bold;%22%3EInvites Sent! %3Cbr /%3E However, you have Gmail contacts that are not current QUAKE LIVE players.%3C/span%3E%3Cbr /%3E%3Cbr /%3ESelect which contacts to invite from the list.%3C/p%3E%3Cp%3E%3C/p%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22qlv_resultListIE6Fix%22%3E%3Cdiv class=%22qlv_resultsList_popup%22%3E%3Cdiv class=%22qlv_resultsListNA%22 style=%22margin: 20px; text-align: center; font-size: 16px; font-family: Arial; display: none;%22%3E%3C/div%3E%3Ctable cellpadding=%220%22 cellspacing=%220%22 class=%22qlv_resultsTable%22%3E%3Ctr%3E%3Ctd%3E%3Cdiv align=%22center%22%3E%3Cinput id=%22qlv_selectAllEmail%22 type=%22checkbox%22 /%3E%3C/div%3E%3C/td%3E%3Ctd%3E%3Cspan style=%22width:198px;%22%3E%3Cimg src=%22"), quakelive.resource("/images/sf/friends/sort_down_icon.gif"), unescape("%22 /%3E%3C/span%3E%3C/td%3E%3Ctd width=%22485%22 style=%22width:198px;%22%3E  email%3C/td%3E%3Ctd width=%2233%22%3E%3Cdiv align=%22right%22%3E%3C/div%3E%3C/td%3E%3C/tr%3E%3Ctbody%3E%3C/tbody%3E%3C/table%3E%3C/div%3E%3C/div%3E%3Cp class=%22qlv_skipbutton%22%3E%3Ca href=%22javascript:;%22 onclick=%22return false%22 /%3E%3C/p%3E%3Cp class=%22qlv_invitebutton%22%3E%3Ca href=%22javascript:;%22 onclick=%22return false%22 /%3E%3C/p%3E")].join('');
quakelive.mod_friends.TPL_FRIENDS_LIST = [unescape("%3Cdiv id=%22im-header%22%3E%3C/div%3E%3Cdiv id=%22im-body%22%3E%3Cdiv id=%22im-active%22%3E%3Ch1%3E%3C/h1%3E%3Cdiv class=%22itemlist%22%3E%3C/div%3E%3C/div%3E%3Cdiv id=%22im-online%22%3E%3Ch1%3E%3C/h1%3E%3Cdiv class=%22itemlist%22%3E%3C/div%3E%3C/div%3E%3C/div%3E%3Cdiv id=%22im-footer%22%3E%3C/div%3E")].join('');
quakelive.mod_prefs.TPL_CHARACTER = [unescape("%3Cdiv class=%22innerpanel fl%22%3E%3Cdiv class=%22rollover fl%22%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.Nav('character')%22 class=%22btn_character fl selected%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.Nav('controls_movement')%22 class=%22btn_controls fl%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.Nav('settings_basic')%22 class=%22btn_settings fl%22%3E%3C/a%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22character_gallery fl%22%3E%3Cdiv class=%22thirtypxhigh%22%3E%3C/div%3E%3Cdiv id=%22character_list%22 class=%22character_select fl%22%3E%3Cimg src=%22"), quakelive.resource("/images/loader.gif"), unescape("%22 width=%2262%22 height=%2213%22 /%3E Loading model list&hellip;%3C/div%3E%3Cdiv class=%22fl twentypxh long%22%3E%3Cdiv class=%22fl%22%3E%3Cdiv id=%22cfg_char_lgicon%22 class=%22char_lgicon fl%22%3E%3C/div%3E%3Cdiv class=%22fl twelvepxv tenpxh%22%3E%3Cdiv id=%22cfg_char_name%22 style=%22width: 220px; height: 24px%22%3E%3C/div%3E%3Cdiv id=%22cfg_char_race%22 style=%22width: 220px; height: 24px%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3Cdiv id=%22cfg_char_description%22 class=%22fl tenpxv eightypxhigh footerCopy%22 style=%22overflow: hidden%22%3E%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3Cdiv class=%22fifteenpxhigh%22%3E%3C/div%3E%3Cdiv class=%22team_game_version%22%3E%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3Cdiv id=%22cfg_char_redteam%22 class=%22red_team fl%22%3E%3C/div%3E%3Cdiv id=%22cfg_char_blueteam%22 class=%22blue_team fl%22%3E%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22fl%22 style=%22position: relative%22%3E%3Cdiv id=%22cfg_char_body%22 style=%22position: absolute; top: 10px; left: -15px%22 class=%22bodyshot fl%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3Cdiv class=%22twentypxh twentytwopxv%22%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.ResetDefaults(); return false%22 class=%22fl reset_settings_defaults%22%3E%3C/a%3E%3Cdiv class=%22fl tenpxh light-midGrayTxt footerCopy%22%3EReset Defaults for all game settings%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3C/div%3E")].join('');
quakelive.mod_prefs.TPL_SETTINGS_BASIC = [unescape("%3Cdiv class=%22innerpanellong fl%22%3E%3Cdiv class=%22rollover fl%22%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.Nav('character')%22 class=%22btn_character fl%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.Nav('controls_movement')%22 class=%22btn_controls fl%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.Nav('settings_basic')%22 class=%22btn_settings fl selected%22%3E%3C/a%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3Cdiv%3E%3Cdiv class=%22fl%22 style=%22width: 276px;%22%3E&nbsp;%3C/div%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.Nav('settings_basic')%22 class=%22btn_basic_active fl%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.Nav('settings_advanced')%22 class=%22btn_advanced fl%22%3E%3C/a%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22fl sixteenpxv%22%3E%3Cdiv class=%22fl twentypxh%22%3E%3Cdiv class=%22panel_audio%22%3E%3Cdiv class=%22twentythreepxhigh%22%3E%3C/div%3E%3Cdiv class=%22fourteenpxh footerCopy%22%3E%3Cp%3E%3Cdiv class='fl'%3EEffects volume:&nbsp;%3C/div%3E %3Cdiv id='effects_volume_value' class='fl'%3E%3C/div%3E%3Cdiv class='cl'%3E%3C/div%3E%3C/p%3E%3Cdiv id=%22slider_s_volume%22 class=%22slider ui-slider%22%3E%3C/div%3E%3Cdiv class=%22sliderpxh%22%3E%3Cdiv class=%22fl ninePxTxt lightGrayTxt%22%3Emin%3C/div%3E%3Cdiv class=%22fr ninePxTxt lightGrayTxt%22%3Emax%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22fourpxv%22%3E%3C/div%3E%3Cdiv class=%22fourteenpxh footerCopy%22%3E%3Cp%3E%3Cdiv class='fl'%3EMusic volume:&nbsp;%3C/div%3E %3Cdiv id='music_volume_value' class='fl'%3E%3C/div%3E%3Cdiv class='cl'%3E%3C/div%3E%3C/p%3E%3Cdiv id=%22slider_s_musicvolume%22 class=%22slider ui-slider%22%3E%3C/div%3E%3Cdiv class=%22sliderpxh%22%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3Cdiv class=%22fl ninePxTxt lightGrayTxt%22%3Emin%3C/div%3E%3Cdiv class=%22fr ninePxTxt lightGrayTxt%22%3Emax%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22twentypxv%22%3E%3C/div%3E%3Cdiv class=%22panel_video%22%3E%3Cdiv class=%22twentythreepxhigh%22%3E%3C/div%3E%3Cdiv class=%22fourteenpxh twohundredseventywide%22%3E%3Cdiv class=%22fl med%22%3E%3Cdiv class=%22footerCopy thirtypxhigh%22%3EPlay Full Screen:%3C/div%3E%3Cdiv class=%22footerCopy thirtypxhigh%22%3EFull Screen Resolution:%3C/div%3E%3Cdiv class=%22footerCopy thirtypxhigh%22%3EBrowser Resolution:%3C/div%3E%3Cdiv class=%22footerCopy%22%3E%3Cp%3E%3Cdiv class='fl'%3EBrightness:&nbsp;%3C/div%3E %3Cdiv id='brightness_value' class='fl'%3E%3C/div%3E%3Cdiv class='cl'%3E%3C/div%3E%3C/p%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22fl fourteenpxh%22%3E%3Cdiv class=%22ninePxTxt lightGrayTxt thirtypxhigh%22 id=%22r_fullscreen%22%3E%3C/div%3E%3Cdiv class=%22thirtypxhigh%22%3E%3Cselect id='select_r_mode' name='r_mode'%3E%3C/select%3E%3C/div%3E%3Cdiv class=%22thirtypxhigh%22%3E%3Cselect id='select_r_inbrowsermode' name='r_inbrowsermode'%3E%3C/select%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3Cdiv id=%22slider_r_gamma%22 class=%22slider ui-slider%22%3E%3C/div%3E%3Cdiv class=%22sliderpxh%22%3E%3Cdiv class=%22fl ninePxTxt lightGrayTxt%22%3Emin%3C/div%3E%3Cdiv class=%22fr ninePxTxt lightGrayTxt%22%3Emax%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3C/div%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22panel_weapons fl twentypxh%22%3E%3Cdiv style=%22height: 25px%22%3E&nbsp;%3C/div%3E%3Cdiv class=%22fourteenpxh twohundredseventywide%22%3E%3Cdiv class=%22fl%22%3E%3Cdiv class=%22footerCopy thirtypxhigh%22%3EAuto Switch:%3C/div%3E%3C/div%3E%3Cdiv class=%22fl twentypxh%22%3E%3Cdiv class=%22ninePxTxt lightGrayTxt thirtypxhigh%22 id=%22cg_autoswitch%22%3E%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3Cdiv class=%22footerCopy%22%3ERail Gun Primary Color:%3C/div%3E%3Cdiv id=%22color1_select%22 class=%22rail_select%22%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.SelectColor('color1', 1); return false%22 id=%22color1_1%22 class=%22red%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.SelectColor('color1', 2); return false%22 id=%22color1_2%22 class=%22green%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.SelectColor('color1', 3); return false%22 id=%22color1_3%22 class=%22yellow%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.SelectColor('color1', 4); return false%22 id=%22color1_4%22 class=%22blue%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.SelectColor('color1', 5); return false%22 id=%22color1_5%22 class=%22ltpurple%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.SelectColor('color1', 6); return false%22 id=%22color1_6%22 class=%22purple%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.SelectColor('color1', 7); return false%22 id=%22color1_7%22 class=%22white%22%3E%3C/a%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3Cdiv class=%22tenpxhigh%22%3E%3C/div%3E%3Cdiv class=%22footerCopy%22%3ERail Gun Secondary Color:%3C/div%3E%3Cdiv id=%22color2_select%22 class=%22rail_select%22%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.SelectColor('color2', 1); return false%22 id=%22color2_1%22 class=%22red%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.SelectColor('color2', 2); return false%22 id=%22color2_2%22 class=%22green%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.SelectColor('color2', 3); return false%22 id=%22color2_3%22 class=%22yellow%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.SelectColor('color2', 4); return false%22 id=%22color2_4%22 class=%22blue%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.SelectColor('color2', 5); return false%22 id=%22color2_5%22 class=%22ltpurple%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.SelectColor('color2', 6); return false%22 id=%22color2_6%22 class=%22purple%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.SelectColor('color2', 7); return false%22 id=%22color2_7%22 class=%22white%22%3E%3C/a%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3Cdiv class=%22fifteenpxhigh%22%3E%3C/div%3E%3Cdiv class=%22footerCopy%22%3ECrosshair Symbol:%3C/div%3E%3Cdiv id=%22crosshair_select%22 class=%22crosshair_select%22%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.SelectCrosshair(1); return false%22 id=%22crosshair_1%22 class=%22a%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.SelectCrosshair(2); return false%22 id=%22crosshair_2%22 class=%22b%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.SelectCrosshair(3); return false%22 id=%22crosshair_3%22 class=%22c%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.SelectCrosshair(4); return false%22 id=%22crosshair_4%22 class=%22d%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.SelectCrosshair(5); return false%22 id=%22crosshair_5%22 class=%22e%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.SelectCrosshair(6); return false%22 id=%22crosshair_6%22 class=%22f%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.SelectCrosshair(7); return false%22 id=%22crosshair_7%22 class=%22g%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.SelectCrosshair(8); return false%22 id=%22crosshair_8%22 class=%22h%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.SelectCrosshair(9); return false%22 id=%22crosshair_9%22 class=%22i%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.SelectCrosshair(10); return false%22 id=%22crosshair_10%22 class=%22j%22%3E%3C/a%3E%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3Cdiv class=%22tenpxhigh%22%3E%3C/div%3E%3Cdiv class=%22footerCopy%22%3ECrosshair Color:%3C/div%3E%3Cdiv id=%22color2_select%22 class=%22rail_select%22%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.SelectColor('cg_crosshairColor', 1); return false%22 id=%22cg_crosshairColor_1%22 class=%22red%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.SelectColor('cg_crosshairColor', 2); return false%22 id=%22cg_crosshairColor_2%22 class=%22yellow%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.SelectColor('cg_crosshairColor', 3); return false%22 id=%22cg_crosshairColor_3%22 class=%22green%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.SelectColor('cg_crosshairColor', 4); return false%22 id=%22cg_crosshairColor_4%22 class=%22blue%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.SelectColor('cg_crosshairColor', 5); return false%22 id=%22cg_crosshairColor_5%22 class=%22purple%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.SelectColor('cg_crosshairColor', 6); return false%22 id=%22cg_crosshairColor_6%22 class=%22ltpurple%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.SelectColor('cg_crosshairColor', 7); return false%22 id=%22cg_crosshairColor_7%22 class=%22white%22%3E%3C/a%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22character_overlay fl%22%3E%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3Cdiv class=%22twentypxh%22%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.ResetDefaults(); return false%22 class=%22fl reset_settings_defaults%22%3E%3C/a%3E%3Cdiv class=%22fl tenpxh light-midGrayTxt footerCopy%22%3EReset Defaults for all game settings%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3C/div%3E")].join('');
quakelive.mod_prefs.TPL_SETTINGS_ADVANCED = [unescape("%3Cdiv class=%22innerpanellong fl%22%3E%3Cdiv class=%22rollover fl%22%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.Nav('character')%22 class=%22btn_character fl%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.Nav('controls_movement')%22 class=%22btn_controls fl%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.Nav('settings_basic')%22 class=%22btn_settings fl selected%22%3E%3C/a%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3Cdiv%3E%3Cdiv class=%22fl%22 style=%22width: 276px;%22%3E&nbsp;%3C/div%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.Nav('settings_basic')%22 class=%22btn_basic fl%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.Nav('settings_advanced')%22 class=%22btn_advanced_active fl%22%3E%3C/a%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22fl sixteenpxv%22%3E%3Cdiv class=%22fl hundredwide%22%3E&nbsp;%3C/div%3E%3Cdiv class=%22fl%22%3E%3Cdiv class=%22panel_audio_advanced%22%3E%3Cdiv class=%22twentythreepxhigh%22%3E%3C/div%3E%3Cdiv class=%22fourteenpxh twohundredseventywide%22%3E%3Cdiv class=%22fl hundredwide%22%3E%3Cdiv class=%22footerCopy thirtypxhigh%22%3EDoppler%3C/div%3E%3C/div%3E%3Cdiv class=%22fl fourteenpxh%22%3E%3Cdiv class=%22ninePxTxt lightGrayTxt thirtypxhigh%22 id=%22s_doppler%22%3E%3C/div%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22twentypxv%22%3E%3C/div%3E%3Cdiv class=%22panel_options_advanced%22%3E%3Cdiv class=%22twentythreepxhigh%22%3E%3C/div%3E%3Cdiv class=%22fourteenpxh twohundredseventywide%22%3E%3Cdiv class=%22fl med tenpxh%22%3E%3Cdiv class=%22tenpxhigh%22%3E%3C/div%3E%3Cdiv class=%22footerCopy thirtypxhigh%22%3EDraw Target Names%3C/div%3E%3Cdiv class=%22footerCopy thirtypxhigh%22%3EVoice Chat%3C/div%3E%3Cdiv class=%22footerCopy thirtypxhigh%22%3EVoice Text%3C/div%3E%3Cdiv class=%22footerCopy thirtypxhigh%22%3ETaunts%3C/div%3E%3C/div%3E%3Cdiv class=%22fl%22%3E%3Cdiv class=%22tenpxhigh%22%3E%3C/div%3E%3Cdiv class=%22ninePxTxt lightGrayTxt thirtypxhigh%22 id=%22cg_drawtargetnames%22%3E%3C/div%3E%3Cdiv class=%22ninePxTxt lightGrayTxt thirtypxhigh%22 id=%22cg_playvoicechats%22%3E%3C/div%3E%3Cdiv class=%22ninePxTxt lightGrayTxt thirtypxhigh%22 id=%22cg_showvoicetext%22%3E%3C/div%3E%3Cdiv class=%22ninePxTxt lightGrayTxt thirtypxhigh%22 id=%22cg_allowtaunt%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22advanced_panels_right fl%22%3E%3Cdiv class=%22twentyfivepxhigh%22%3E%3C/div%3E%3Cdiv class=%22panel_video_advanced fl%22%3E%3Cdiv class=%22thirtypxhigh%22%3E%3C/div%3E%3Cdiv class=%22twentypxh twohundredseventywide%22%3E%3Cdiv class=%22fl%22%3E%3Cdiv class=%22footerCopy thirtypxhigh hundredtwentywide%22%3ELighting Model%3C/div%3E%3Cdiv class=%22footerCopy thirtypxhigh hundredtwentywide%22%3EGeometry Detail%3C/div%3E%3Cdiv class=%22footerCopy thirtypxhigh hundredtwentywide%22%3ETexture Filter%3C/div%3E%3Cdiv class=%22footerCopy thirtypxhigh hundredtwentywide%22%3ETexture Quality%3C/div%3E%3Cdiv class=%22footerCopy thirtypxhigh hundredtwentywide%22%3ETexture Compression%3C/div%3E%3C/div%3E%3Cdiv class=%22fl twentypxh%22%3E%3Cdiv class=%22thirtypxhigh hundredwide tr%22%3E%3Cselect id=%22select_r_vertexlight%22 name=%22r_vertexlight%22%3E%3C/select%3E%3C/div%3E%3Cdiv class=%22thirtypxhigh hundredwide tr%22%3E%3Cselect id=%22select_r_lodbias%22 name=%22r_lodbias%22%3E%3C/select%3E%3C/div%3E%3Cdiv class=%22thirtypxhigh hundredwide tr%22%3E%3Cselect id=%22select_r_texturemode%22 name=%22r_texturemode%22%3E%3C/select%3E%3C/div%3E%3Cdiv class=%22thirtypxhigh hundredwide tr%22%3E%3Cselect id=%22select_r_picmip%22 name=%22r_picmip%22%3E%3C/select%3E%3C/div%3E%3Cdiv class=%22ninePxTxt lightGrayTxt thirtypxhigh hundredwide tr%22 id=%22r_ext_compressed_textures%22%3E%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3Cdiv class=%22footerCopy%22%3E%3Cp%3E%3Cdiv class='fl'%3EField of view:&nbsp;%3C/div%3E %3Cdiv id='fov_value' class='fl'%3E%3C/div%3E%3Cdiv class='cl'%3E%3C/div%3E%3C/p%3E%3Cdiv id=%22slider_cg_fov%22 class=%22slider ui-slider%22%3E%3C/div%3E%3Cdiv class=%22sliderpxh%22%3E%3Cdiv class=%22fl ninePxTxt lightGrayTxt%22%3Emin%3C/div%3E%3Cdiv class=%22fr ninePxTxt lightGrayTxt%22%3Emax%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22fifteenpxhigh%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22fifteenpxhigh%22%3E%3C/div%3E%3C/div%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3Cdiv class=%22twentypxh twentypxlh%22%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.ResetDefaults(); return false%22 class=%22fl reset_settings_defaults%22%3E%3C/a%3E%3Cdiv class=%22fl tenpxh light-midGrayTxt footerCopy%22%3EReset Defaults for all game settings%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3C/div%3E")].join('');
quakelive.mod_prefs.TPL_CONTROLS_ACTIONS = [unescape("%3Cdiv class=%22innerpanellong fl%22%3E%3Cdiv class=%22rollover fl%22%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.Nav('character'); return false%22 class=%22btn_character fl%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.Nav('controls_movement'); return false%22 class=%22btn_controls fl selected%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.Nav('settings_basic'); return false%22 class=%22btn_settings fl%22%3E%3C/a%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3Cdiv class=%22innerpanelsubnav%22%3E%3Cdiv class=%22fl%22 style=%22width:132px;%22%3E&nbsp;%3C/div%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.Nav('controls_movement'); return false%22 class=%22btn_movement fl%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.Nav('controls_actions'); return false%22 class=%22btn_actions fl selected%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.Nav('controls_weapons'); return false%22 class=%22btn_weapons fl%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.Nav('controls_mouse'); return false%22 class=%22btn_mouse fl%22%3E%3C/a%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22innerpanelsettings%22%3E%3Cdiv class=%22controlsBG fl%22%3E%3Cdiv class=%22row%22%3E%3Cdiv class=%22medlong fl twentypxh fourpxpadtop%22%3E%3Cdiv class=%22txtCommand%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22sixtypxwide fl fourpxpadtop%22%3E%3Cdiv class=%22txtMainKey%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3Cdiv id=%22controls_actions_binds0%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22greyVertLine fl%22%3E%3C/div%3E%3Cdiv class=%22controlsBG fl%22%3E%3Cdiv class=%22row%22%3E%3Cdiv class=%22medlong fl twentypxh fourpxpadtop%22%3E%3Cdiv class=%22txtCommand%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22sixtypxwide fl fourpxpadtop%22%3E%3Cdiv class=%22txtMainKey%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3Cdiv id=%22controls_actions_binds1%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22fivepxhigh%22%3E%3C/div%3E%3Cdiv class=%22mainkeyhr%22%3E%3C/div%3E%3Cdiv class=%22keyboard_container%22%3E%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3Cdiv class=%22threepxhigh%22%3E%3C/div%3E%3Cdiv class=%22twentypxh%22%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.ResetDefaults(); return false%22 class=%22fl reset_settings_defaults%22%3E%3C/a%3E%3Cdiv class=%22fl tenpxh light-midGrayTxt footerCopy%22%3EReset Defaults for all game settings%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3C/div%3E")].join('');
quakelive.mod_prefs.TPL_CONTROLS_MOVEMENT = [unescape("%3Cdiv class=%22innerpanellong fl%22%3E%3Cdiv class=%22rollover fl%22%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.Nav('character'); return false%22 class=%22btn_character fl%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.Nav('controls_movement'); return false%22 class=%22btn_controls fl selected%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.Nav('settings_basic'); return false%22 class=%22btn_settings fl%22%3E%3C/a%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3Cdiv class=%22innerpanelsubnav%22%3E%3Cdiv class=%22fl%22 style=%22width:132px;%22%3E&nbsp;%3C/div%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.Nav('controls_movement'); return false%22 class=%22btn_movement fl selected%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.Nav('controls_actions'); return false%22 class=%22btn_actions fl%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.Nav('controls_weapons'); return false%22 class=%22btn_weapons fl%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.Nav('controls_mouse'); return false%22 class=%22btn_mouse fl%22%3E%3C/a%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22innerpanelsettings%22%3E%3Cdiv class=%22controlsBG fl%22%3E%3Cdiv class=%22row%22%3E%3Cdiv class=%22medlong fl twentypxh fourpxpadtop%22%3E%3Cdiv class=%22txtCommand%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22sixtypxwide fl fourpxpadtop%22%3E%3Cdiv class=%22txtMainKey%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3Cdiv id=%22controls_movement_binds0%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22greyVertLine fl%22%3E%3C/div%3E%3Cdiv class=%22controlsBG fl%22%3E%3Cdiv class=%22row%22%3E%3Cdiv class=%22medlong fl twentypxh fourpxpadtop%22%3E%3Cdiv class=%22txtCommand%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22sixtypxwide fl fourpxpadtop%22%3E%3Cdiv class=%22txtMainKey%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3Cdiv id=%22controls_movement_binds1%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22fivepxhigh%22%3E%3C/div%3E%3Cdiv class=%22mainkeyhr%22%3E%3C/div%3E%3Cdiv class=%22keyboard_container%22%3E%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3Cdiv class=%22threepxhigh%22%3E%3C/div%3E%3Cdiv class=%22twentypxh%22%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.ResetDefaults(); return false%22 class=%22fl reset_settings_defaults%22%3E%3C/a%3E%3Cdiv class=%22fl tenpxh light-midGrayTxt footerCopy%22%3EReset Defaults for all game settings%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3C/div%3E")].join('');
quakelive.mod_prefs.TPL_CONTROLS_WEAPONS = [unescape("%3Cdiv class=%22innerpanellong fl%22%3E%3Cdiv class=%22rollover fl%22%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.Nav('character'); return false%22 class=%22btn_character fl%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.Nav('controls_movement'); return false%22 class=%22btn_controls fl selected%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.Nav('settings_basic'); return false%22 class=%22btn_settings fl%22%3E%3C/a%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3Cdiv class=%22innerpanelsubnav%22%3E%3Cdiv class=%22fl%22 style=%22width:132px;%22%3E&nbsp;%3C/div%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.Nav('controls_movement'); return false%22 class=%22btn_movement fl%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.Nav('controls_actions'); return false%22 class=%22btn_actions fl%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.Nav('controls_weapons'); return false%22 class=%22btn_weapons fl selected%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.Nav('controls_mouse'); return false%22 class=%22btn_mouse fl%22%3E%3C/a%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22innerpanelsettings%22%3E%3Cdiv class=%22controlsBG fl%22%3E%3Cdiv class=%22row%22%3E%3Cdiv class=%22medlong fl twentypxh fourpxpadtop%22%3E%3Cdiv class=%22txtCommand%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22sixtypxwide fl fourpxpadtop%22%3E%3Cdiv class=%22txtMainKey%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3Cdiv id=%22controls_weapons_binds0%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22greyVertLine fl%22%3E%3C/div%3E%3Cdiv class=%22controlsBG fl%22%3E%3Cdiv class=%22row%22%3E%3Cdiv class=%22medlong fl twentypxh fourpxpadtop%22%3E%3Cdiv class=%22txtCommand%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22sixtypxwide fl fourpxpadtop%22%3E%3Cdiv class=%22txtMainKey%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3Cdiv id=%22controls_weapons_binds1%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22fivepxhigh%22%3E%3C/div%3E%3Cdiv class=%22mainkeyhr%22%3E%3C/div%3E%3Cdiv class=%22keyboard_container%22%3E%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3Cdiv class=%22threepxhigh%22%3E%3C/div%3E%3Cdiv class=%22twentypxh%22%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.ResetDefaults(); return false%22 class=%22fl reset_settings_defaults%22%3E%3C/a%3E%3Cdiv class=%22fl tenpxh light-midGrayTxt footerCopy%22%3EReset Defaults for all game settings%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3C/div%3E")].join('');
quakelive.mod_prefs.TPL_CONTROLS_MOUSE = [unescape("%3Cdiv class=%22innerpanellong fl%22%3E%3Cdiv class=%22rollover fl%22%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.Nav('character'); return false%22 class=%22btn_character fl%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.Nav('controls_movement'); return false%22 class=%22btn_controls fl selected%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.Nav('settings_basic'); return false%22 class=%22btn_settings fl%22%3E%3C/a%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3Cdiv class=%22innerpanelsubnav%22%3E%3Cdiv class=%22fl%22 style=%22width:132px;%22%3E&nbsp;%3C/div%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.Nav('controls_movement'); return false%22 class=%22btn_movement fl%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.Nav('controls_actions'); return false%22 class=%22btn_actions fl%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.Nav('controls_weapons'); return false%22 class=%22btn_weapons fl%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.Nav('controls_mouse'); return false%22 class=%22btn_mouse fl selected%22%3E%3C/a%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22innerpanelsettings%22%3E%3Cdiv class=%22fl%22%3E%3Cdiv class=%22mc_panel%22%3E%3Cimg src=%22"), quakelive.resource("/images/sf/registration/controls/mouse_invert_label.gif"), unescape("%22 class=%22label%22 /%3E%3Cdiv class=%22tenpxv%22%3E%3C/div%3E%3Cdiv class=%22mc_opts tc%22%3E%3Cdiv class=%22fl tenpxwide%22%3E&nbsp;%3C/div%3E%3Cdiv class=%22fl%22%3E%3Cdiv class=%22fivepxv%22%3E%3C/div%3E%3Cdiv id=%22m_pitch%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22fl tenpxwide%22%3E&nbsp;%3C/div%3E%3Cdiv class=%22fl tl%22%3E&quot;On&quot; will reverse the direction%3Cbr /%3Eof looking up and down.%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22greyVertLine fl%22%3E%3C/div%3E%3Cdiv class=%22fl%22%3E%3Cdiv class=%22mc_panel%22%3E%3Cimg src=%22"), quakelive.resource("/images/sf/registration/controls/mouse_sensitivity_label.gif"), unescape("%22 class=%22label%22 /%3E%3Cdiv class=%22mc_opts%22%3E%3Cp%3E%3Cdiv class='fl'%3EMouse sensitivity:&nbsp;%3C/div%3E %3Cdiv id='mouse_sens_value' class='fl'%3E%3C/div%3E%3Cdiv class='cl'%3E%3C/div%3E%3C/p%3E%3Cdiv class=%22fivepxv%22%3E%3C/div%3E%3Cdiv id=%22slider_sensitivity%22 class=%22slider ui-slider%22%3E%3C/div%3E%3Cdiv class=%22sliderpxh%22%3E%3Cdiv class=%22fl ninePxTxt lightGrayTxt%22%3Emin%3C/div%3E%3Cdiv class=%22fr ninePxTxt lightGrayTxt%22%3Emax%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3C/div%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22fivepxhigh%22%3E%3C/div%3E%3Cdiv class=%22mainkeyhr%22%3E%3C/div%3E%3Cdiv class=%22keyboard_container%22%3E%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3Cdiv class=%22threepxhigh%22%3E%3C/div%3E%3Cdiv class=%22twentypxh%22%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.ResetDefaults(); return false%22 class=%22fl reset_settings_defaults%22%3E%3C/a%3E%3Cdiv class=%22fl tenpxh light-midGrayTxt footerCopy%22%3EReset Defaults for all game settings%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3C/div%3E")].join('');
quakelive.mod_prefs.TPL_KEYBOARD = [unescape("%3Cdiv id=%22qlv_keyboard%22%3E%3Cdiv class=%22left%22%3E%3Cdiv%3E%3Cspan class=%22key_ESCAPE esc%22%3E%3C/span%3E%3Cspan class=%22key_F1 f1%22%3E%3C/span%3E%3Cspan class=%22key_F2 f2%22%3E%3C/span%3E%3Cspan class=%22key_F3 f3%22%3E%3C/span%3E%3Cspan class=%22key_F4 f4%22%3E%3C/span%3E%3Cspan class=%22key_F5 f5%22%3E%3C/span%3E%3Cspan class=%22key_F6 f6%22%3E%3C/span%3E%3Cspan class=%22key_F7 f7%22%3E%3C/span%3E%3Cspan class=%22key_F8 f8%22%3E%3C/span%3E%3Cspan class=%22key_F9 f9%22%3E%3C/span%3E%3Cspan class=%22key_F10 f10%22%3E%3C/span%3E%3Cspan class=%22key_F11 f11%22%3E%3C/span%3E%3Cspan class=%22key_F12 f12%22%3E%3C/span%3E%3C/div%3E%3Cdiv%3E%3Cspan class=%22key_TILDE tilde%22%3E%3C/span%3E%3Cspan class=%22key_1 k1%22%3E%3C/span%3E%3Cspan class=%22key_2 k2%22%3E%3C/span%3E%3Cspan class=%22key_3 k3%22%3E%3C/span%3E%3Cspan class=%22key_4 k4%22%3E%3C/span%3E%3Cspan class=%22key_5 k5%22%3E%3C/span%3E%3Cspan class=%22key_6 k6%22%3E%3C/span%3E%3Cspan class=%22key_7 k7%22%3E%3C/span%3E%3Cspan class=%22key_8 k8%22%3E%3C/span%3E%3Cspan class=%22key_9 k9%22%3E%3C/span%3E%3Cspan class=%22key_0 k0%22%3E%3C/span%3E%3Cspan class=%22key_MINUS minus%22%3E%3C/span%3E%3Cspan class=%22key_EQUALS equal%22%3E%3C/span%3E%3Cspan class=%22key_BACKSPACE backspace%22%3E%3C/span%3E%3C/div%3E%3Cdiv%3E%3Cspan class=%22key_TAB tab%22%3E%3C/span%3E%3Cspan class=%22key_Q q%22%3E%3C/span%3E%3Cspan class=%22key_W w%22%3E%3C/span%3E%3Cspan class=%22key_E e%22%3E%3C/span%3E%3Cspan class=%22key_R r%22%3E%3C/span%3E%3Cspan class=%22key_T t%22%3E%3C/span%3E%3Cspan class=%22key_Y y%22%3E%3C/span%3E%3Cspan class=%22key_U u%22%3E%3C/span%3E%3Cspan class=%22key_I i%22%3E%3C/span%3E%3Cspan class=%22key_O o%22%3E%3C/span%3E%3Cspan class=%22key_P p%22%3E%3C/span%3E%3Cspan class=%22key_LEFTBRACKET lbrack%22%3E%3C/span%3E%3Cspan class=%22key_RIGHTBRACKET rbrack%22%3E%3C/span%3E%3Cspan class=%22key_BACKSLASH bslash%22%3E%3C/span%3E%3C/div%3E%3Cdiv%3E%3Cspan class=%22key_CAPSLOCK capslock%22%3E%3C/span%3E%3Cspan class=%22key_A a%22%3E%3C/span%3E%3Cspan class=%22key_S s%22%3E%3C/span%3E%3Cspan class=%22key_D d%22%3E%3C/span%3E%3Cspan class=%22key_F f%22%3E%3C/span%3E%3Cspan class=%22key_G g%22%3E%3C/span%3E%3Cspan class=%22key_H h%22%3E%3C/span%3E%3Cspan class=%22key_J j%22%3E%3C/span%3E%3Cspan class=%22key_K k%22%3E%3C/span%3E%3Cspan class=%22key_L l%22%3E%3C/span%3E%3Cspan class=%22key_SEMICOLON semicolon%22%3E%3C/span%3E%3Cspan class=%22key_APOSTROPHE apos%22%3E%3C/span%3E%3Cspan class=%22key_ENTER return%22%3E%3C/span%3E%3C/div%3E%3Cdiv%3E%3Cspan class=%22key_SHIFT shiftl%22%3E%3C/span%3E%3Cspan class=%22key_Z z%22%3E%3C/span%3E%3Cspan class=%22key_X x%22%3E%3C/span%3E%3Cspan class=%22key_C c%22%3E%3C/span%3E%3Cspan class=%22key_V v%22%3E%3C/span%3E%3Cspan class=%22key_B b%22%3E%3C/span%3E%3Cspan class=%22key_N n%22%3E%3C/span%3E%3Cspan class=%22key_M m%22%3E%3C/span%3E%3Cspan class=%22key_COMMA comma%22%3E%3C/span%3E%3Cspan class=%22key_PERIOD period%22%3E%3C/span%3E%3Cspan class=%22key_FORWARDSLASH fslash%22%3E%3C/span%3E%3Cspan class=%22key_SHIFT shiftr%22%3E%3C/span%3E%3C/div%3E%3Cdiv%3E%3Cspan class=%22key_CTRL ctrll%22%3E%3C/span%3E%3Cspan class=%22key_LEFTWIN winl%22%3E%3C/span%3E%3Cspan class=%22key_LEFTALT altl%22%3E%3C/span%3E%3Cspan class=%22key_SPACE spacebar%22%3E%3C/span%3E%3Cspan class=%22key_RIGHTALT altr%22%3E%3C/span%3E%3Cspan class=%22key_RIGHTWIN winr%22%3E%3C/span%3E%3Cspan class=%22key_CTRL ctrlr%22%3E%3C/span%3E%3Ca href=%22#%22 class=%22%22%3E%3C/a%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22center%22%3E%3Cdiv%3E%3Cspan class=%22key_PRTSCRN prtscr%22%3E%3C/span%3E%3Cspan class=%22key_SCROLLLOCK scrolllock%22%3E%3C/span%3E%3Cspan class=%22key_PAUSE pausebreak%22%3E%3C/span%3E%3C/div%3E%3Cdiv%3E%3Cspan class=%22key_INS insert%22%3E%3C/span%3E%3Cspan class=%22key_HOME home%22%3E%3C/span%3E%3Cspan class=%22key_PGUP pgup%22%3E%3C/span%3E%3C/div%3E%3Cdiv%3E%3Cspan class=%22key_DEL delete%22%3E%3C/span%3E%3Cspan class=%22key_END end%22%3E%3C/span%3E%3Cspan class=%22key_PGDN pgdown%22%3E%3C/span%3E%3C/div%3E%3Cdiv%3E%3Cspan class=%22key_UPARROW arrowup%22%3E%3C/span%3E%3C/div%3E%3Cdiv%3E%3Cspan class=%22key_LEFTARROW arrowleft%22%3E%3C/span%3E%3Cspan class=%22key_DOWNARROW arrowdown%22%3E%3C/span%3E%3Cspan class=%22key_RIGHTARROW arrowright%22%3E%3C/span%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22tenkey%22%3E%3Cdiv%3E%3Ca href=%22#%22 class=%22scrollLights%22%3E%3C/a%3E%3C/div%3E%3Cdiv%3E%3Cspan class=%22key_KP_NUMLOCK numlock%22%3E%3C/span%3E%3Cspan class=%22key_KP_SLASH slash%22%3E%3C/span%3E%3Cspan class=%22key_KP_STAR asterick%22%3E%3C/span%3E%3Cspan class=%22key_KP_MINUS minus%22%3E%3C/span%3E%3C/div%3E%3Cdiv%3E%3Cspan class=%22key_KP_HOME seven%22%3E%3C/span%3E%3Cspan class=%22key_KP_UPARROW eight%22%3E%3C/span%3E%3Cspan class=%22key_KP_PGUP nine%22%3E%3C/span%3E%3C/div%3E%3Cdiv%3E%3Cspan class=%22key_KP_LEFTARROW four%22%3E%3C/span%3E%3Cspan class=%22key_KP_5 five%22%3E%3C/span%3E%3Cspan class=%22key_KP_RIGHTARROW six%22%3E%3C/span%3E%3Cspan class=%22key_KP_PLUS tkPlus%22%3E%3C/span%3E%3C/div%3E%3Cdiv%3E%3Cspan class=%22key_KP_END one tkRow5%22%3E%3C/span%3E%3Cspan class=%22key_KP_DOWNARROW two tkRow5%22%3E%3C/span%3E%3Cspan class=%22key_KP_PGDN three tkRow5%22%3E%3C/span%3E%3C/div%3E%3Cdiv%3E%3Cspan class=%22key_KP_INS zero tkRow6%22%3E%3C/span%3E%3Cspan class=%22key_KP_DEL tkDelete tkRow6%22%3E%3C/span%3E%3Cspan class=%22key_KP_ENTER tkEnter%22%3E%3C/span%3E%3C/div%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22mouse fl%22 %3E%3Cdiv class=%22mouse_top%22%3E%3C/div%3E%3Ca class=%22key_KP_MOUSE2 btn_rmouse%22%3E%3C/a%3E%3Cdiv class=%22mouse_body%22%3E%3C/div%3E%3Cdiv class=%22mouse_bottom%22%3E%3C/div%3E%3C/div%3E")].join('');
quakelive.mod_prefs.TPL_OVERLAY_CONTAINER = [unescape("%3Cdiv style='width: 100%; height: 100%'%3E%3Cdiv id=%22qlv_prefsoverlay%22 class=%22tl%22%3E%3Cdiv id=%22qlv_regWindow%22 class=%22regNone%22%3E%3C/div%3E%3C/div%3E%3Cdiv id=%22qlv_registrationContent%22 class=%22tl tenpxpad%22%3E%3Cdiv class=%22fortypxhigh%22%3E%3C/div%3E%3Cdiv class=%22registration leftAlign%22%3E%3Cdiv%3E%3Cdiv class=%22title fl%22%3E%3C/div%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.CloseOverlay(); return false%22 class=%22close_window fr%22%3E%3C/a%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22fiftypxhigh%22%3E%3C/div%3E%3Cdiv%3E%3Cdiv class=%22fifteenpxhigh%22%3E%3C/div%3E%3Cdiv id=%22configContainer%22 style=%22position: relative; z-index: 1%22%3E%3C/div%3E%3C/div%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E")].join('');
quakelive.mod_stats.TPL_QUICKSTATS = [unescape("%3Ca href=%22javascript:;%22 onclick=%22quakelive.Goto('stats'); return false%22 class=%22qlv_plts_offline%22%3E %3Cimg src=%22"), quakelive.resource("/images/sf/login/btn_viewfullstats.png"), unescape("%22 alt=%22offline%22 width=%22160%22 height=%2220%22 /%3E %3C/a%3E%3Cdiv class=%22qlv_plts_leftbox%22%3E%3Cdiv class=%22qlv_pltslb_top%22%3E %3Cspan class=%22qlv_pltslb_title%22%3E%3C/span%3E %3Cspan class=%22qlv_pltslb_last_played%22%3E%3C/span%3E %3C/div%3E%3Cdiv class=%22qlv_pltslb_bottom%22%3E%3Cdiv class=%22qlv_pltslb_character nametag-body-md%22%3E%3C/div%3E%3Ctable class=%22qlv_pltslb_bl%22%3E%3Ctr%3E%3Ctd%3E%3Cspan class=%22title%22%3EMost Played Arena%3C/span%3E %3Cspan class=%22fav_map_txt%22%3E%3C/span%3E %3C/td%3E%3Ctd height=%2260%22 width=%22100%22 class=%22fav_map_img tc%22%3E%3C/td%3E%3C/tr%3E%3Ctr%3E%3Ctd%3E%3Cspan class=%22title%22%3EMost Games Played%3C/span%3E %3Cspan class=%22fav_gametype_txt%22%3E%3C/span%3E %3C/td%3E%3Ctd height=%2260%22 width=%22100%22 class=%22fav_gametype_img tc%22%3E%3C/td%3E%3C/tr%3E%3Ctr%3E%3Ctd%3E%3Cspan class=%22title%22%3EWeapon of Choice%3C/span%3E %3Cspan class=%22fav_weapon_txt%22%3E%3C/span%3E %3C/td%3E%3Ctd height=%2260%22 width=%22100%22 class=%22fav_weapon_img%22%3E%3C/td%3E%3C/tr%3E%3C/table%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22qlv_plts_rightbox%22%3E%3Cdiv class=%22qlv_pltsrb_top%22%3E%3Ctable%3E%3Ctr class=%22qlv_pltslb_hd%22%3E%3Ctd%3ETotal Frags:%3C/td%3E%3Ctd style=%22width:94px%22 class=%22total_frags%22%3E%3C/td%3E%3C/tr%3E%3Ctr%3E%3Ctd%3ETotal Games Played:%3C/td%3E%3Ctd class=%22total_games%22%3E%3C/td%3E%3C/tr%3E%3Ctr%3E%3Ctd%3ETotal Time Played:%3C/td%3E%3Ctd class=%22total_time%22%3E%3C/td%3E%3C/tr%3E%3C/table%3E%3C/div%3E%3Cdiv class=%22qlv_pltsrb_middle%22%3E%3C/div%3E%3Cdiv class=%22qlv_pltsrb_bottom%22%3E%3Ctable%3E%3Ctr class=%22qlv_pltsrb_hd%22%3E%3Ctd%3EGame Type%3C/td%3E%3Ctd class=%22tc%22%3EPlayed%3C/td%3E%3Ctd class=%22tc%22%3EWins%3C/td%3E%3C/tr%3E%3Ctr%3E%3Ctd%3EDeath Match%3C/td%3E%3Ctd class=%22tc played_dm%22%3E%3C/td%3E%3Ctd class=%22tc wins_dm%22%3E%3C/td%3E%3C/tr%3E%3Ctr%3E%3Ctd%3EDuel%3C/td%3E%3Ctd class=%22tc played_duel%22%3E%3C/td%3E%3Ctd class=%22tc wins_duel%22%3E%3C/td%3E%3C/tr%3E%3Ctr%3E%3Ctd%3ECapture The Flag%3C/td%3E%3Ctd class=%22tc played_ctf%22%3E%3C/td%3E%3Ctd class=%22tc wins_ctf%22%3E%3C/td%3E%3C/tr%3E%3Ctr%3E%3Ctd%3ETeam Death Match%3C/td%3E%3Ctd class=%22tc played_tdm%22%3E%3C/td%3E%3Ctd class=%22tc wins_tdm%22%3E%3C/td%3E%3C/tr%3E%3Ctr class=%22qlv_pltsrb_totals%22%3E%3Ctd%3ETOTALS%3C/td%3E%3Ctd class=%22tc played_total%22%3E%3C/td%3E%3Ctd class=%22tc wins_total%22%3E%3C/td%3E%3C/tr%3E%3C/table%3E%3C/div%3E%3C/div%3E")].join('');
quakelive.mod_stats.TPL_MATCH_SUMMARY = [unescape("%3Cdiv id=%22stats_tip%22 style=%22position: absolute; z-index: 1000; left: 0; top: 0; display: none%22%3E%3Cimg src=%22"), quakelive.resource("/images/sf/pop_up/game_data_windows/onOver/shadow_top.png"), unescape("%22 width=%22385%22 height=%225%22 /%3E%3Cdiv style=%22background: url("), quakelive.resource("/images/sf/pop_up/game_data_windows/onOver/shadow_middle.png"), unescape("); width: 385px; text-align: center%22%3E%3Cdiv class=%22popheaderS%22%3E%3Cimg src=%22"), quakelive.resource("/images/sf/pop_up/game_data_windows/onOver/hdr_gamesummary.png"), unescape("%22 class=%22fl%22 style=%22margin-left: 10px; margin-top: 2px%22 /%3E%3Cimg src=%22"), quakelive.resource("/images/sf/pop_up/game_data_windows/onOver/btn_clickformore.png"), unescape("%22 class=%22fr%22 style=%22margin-right: 10px; margin-top: 5px%22 /%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3Cdiv id=%22stats_datacontainer%22 class=%22popupBorder%22%3E%3Cdiv class=%22tc%22%3E%3Cimg src=%22"), quakelive.resource("/images/loader.gif"), unescape("%22 width=%2262%22 height=%2213%22 style=%22margin: 20px 0px%22 /%3E%3C/div%3E%3C/div%3E%3C/div%3E%3Cimg src=%22"), quakelive.resource("/images/sf/pop_up/game_data_windows/onOver/shadow_bottom.png"), unescape("%22 width=%22385%22 height=%225%22 /%3E%3C/div%3E")].join('');
quakelive.mod_stats.TPL_MATCH_SUMMARY_INNER = [unescape("%3Cdiv class=%22mainData%22%3E%3Cdiv id=%22match_mapshot%22%3E%3C/div%3E%3Cdiv id=%22match_maindata%22 class=%22mainDataInfo%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22dataDetail%22%3E%3Cdiv class=%22match_highlights Norm11px%22%3E%3C/div%3E%3C/div%3E")].join('');
quakelive.mod_stats.TPL_MATCH_DETAILS = [unescape("%3Cdiv id=%22stats_details%22 style=%22position: absolute; z-index: 1001; left: 0; top: 0%22%3E%3Cimg src=%22"), quakelive.resource("/images/sf/pop_up/game_data_windows/onClick/shadow_top.png"), unescape("%22 width=%22645%22 height=%225%22 /%3E%3Cdiv style=%22background: url("), quakelive.resource("/images/sf/pop_up/game_data_windows/onClick/shadow_middle.png"), unescape("); width: 645px; text-align: center; margin: 0 auto%22%3E%3Cdiv class=%22statsDetailsBody%22%3E%3Cdiv id=%22stats_details_top_vert%22 style=%22background: url("), quakelive.resource("/images/sf/pop_up/game_data_windows/onClick/bkd_header.jpg"), unescape(") no-repeat; width: 635px; height: 40px%22%3E%3C/div%3E%3Cdiv class=%22popupBorderW%22%3E%3Cdiv%3E%3Cdiv id=%22match_gametype%22 class=%22gameTypeContainer fl%22%3ELoading&hellip;%3C/div%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.statstip.CloseStatsDetails(); return false%22 class=%22closeBtn fr%22%3E%3C/a%3E%3Cdiv id=%22stats_datacontainer%22 class=%22cl%22%3E%3Cdiv class=%22tc%22%3E%3Cimg src=%22"), quakelive.resource("/images/loader.gif"), unescape("%22 width=%2262%22 height=%2213%22 style=%22margin: 20px 0px%22 /%3E%3C/div%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22statsDetailsFooter%22%3E%3Cdiv class=%22adContainer%22 id=%22stats_details_bot_vert%22 style=%22background: url("), quakelive.resource("/images/a/full.jpg"), unescape(") no-repeat; width: 468px; height: 60px%22%3E%3C/div%3E%3C/div%3E%3C/div%3E%3C/div%3E%3C/div%3E%3Cimg src=%22"), quakelive.resource("/images/sf/pop_up/game_data_windows/onClick/shadow_bottom.png"), unescape("%22 width=%22645%22 height=%225%22 /%3E%3C/div%3E")].join('');
quakelive.mod_stats.TPL_MATCH_DETAILS_INNER = [unescape("%3Cdiv class=%22mainDataW%22%3E%3Cdiv id=%22match_mapshot%22%3E%3C/div%3E%3Cdiv id=%22match_maindata%22 class=%22mainDataInfoW%22%3E%3C/div%3E%3C/div%3E%3Cdiv id=%22match_vscontainer%22 class=%22fr%22%3E%3C/div%3E%3Cdiv class=%22matchNavBar%22%3E%3Cdiv class=%22leftSide%22%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.statstip.SetDetailsMode('scoreboard'); return false%22 class=%22fl nav_scoreboard selected%22%3EScoreboard%3C/a%3E%3Cspan class=%22fl%22%3E&nbsp;|&nbsp;%3C/span%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.statstip.SetDetailsMode('weaponaccuracy'); return false%22 class=%22fl nav_weaponaccuracy%22%3EWeapon Accuracy%3C/a%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22rightSide%22%3E%3Cspan class=%22fr addthis_container%22%3E%3C/span%3E%3Cspan class=%22fr%22%3E&nbsp;&nbsp;%3C/span%3E%3Ca href=%22javascript:;%22 class=%22share_email fr%22%3Eemail%3C/a%3E%3Ca href=%22javascript:;%22 class=%22share_email_img share_email fr%22%3E%3C/a%3E%3Cspan class=%22fr%22%3E&nbsp;&nbsp;%3C/span%3E%3Ca href=%22javascript:;%22 class=%22share_link fr%22%3Elink%3C/a%3E%3Ca href=%22javascript:;%22 class=%22share_link_img share_link fr%22%3E%3C/a%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22dataDetailL%22%3E%3Cdiv class=%22match_scoreboard Norm11px%22%3E%3C/div%3E%3Cdiv class=%22match_weapons Norm11px%22 style=%22display: none%22%3E%3C/div%3E%3Cdiv class=%22match_weaponaccuracy Norm11px%22 style=%22display: none%22%3E%3C/div%3E%3C/div%3E")].join('');
quakelive.mod_stats.TPL_MATCH_VSCONTAINER = [unescape("%3Cdiv class=%22vsFrameContainer%22%3E%3Cdiv class=%22gameTypeIcon%22%3E%3C/div%3E%3Cdiv class=%22headNum1%22%3E%3C/div%3E%3Cdiv class=%22headNum2%22%3E%3C/div%3E%3Cdiv class=%22vsFrame%22%3E%3C/div%3E%3Cdiv class=%22rankNum1%22%3E%3C/div%3E%3Cdiv class=%22scoreNum1%22%3E%3C/div%3E%3Cdiv class=%22nameNum1%22%3E%3C/div%3E%3Cdiv class=%22flagNum1%22%3E%3C/div%3E%3Cdiv class=%22rankNum2%22%3E%3C/div%3E%3Cdiv class=%22scoreNum2%22%3E%3C/div%3E%3Cdiv class=%22nameNum2%22%3E%3C/div%3E%3Cdiv class=%22flagNum2%22%3E%3C/div%3E%3Cdiv class=%22noPlayer2%22%3ENo Teammate Available%3C/div%3E%3C/div%3E")].join('');
quakelive.mod_lfg.TPL_MODE_MINIMIZED = [unescape("%3Cdiv class=%22lfg_content%22 id=%22lfg_minimized%22%3E%3Cdiv class=%22footer%22%3E%3C/div%3E%3C/div%3E")].join('');
quakelive.mod_lfg.TPL_MODE_NORMAL = [unescape("%3Cdiv class=%22lfg_content%22 id=%22lfg_normal%22%3E%3Cdiv class=%22collapse_proxy%22%3E%3C/div%3E%3Cul class=%22jd_menu%22%3E%3Cli class=%22top%22%3E%3Ca href=%22javascript:;%22 class=%22accessible%22 style=%22position: relative; padding-left: 20px; padding-right: 31px%22%3E%3Cdiv class=%22arrow_right%22%3E%3C/div%3ESelect Game Type%3C/a%3E%3Cul%3E%3Cli class=%22select_gt_5 tl%22%3E%3Cimg src=%22"), quakelive.resource("/images/lfg/tny.png"), unescape("%22 width=%2220%22 height=%2220%22 /%3EDuel%3C/li%3E%3C/ul%3E%3C/li%3E%3C/ul%3E%3Cdiv class=%22blurb%22%3EWe'll find an opponent at your skill level, then alert you when the game is ready.%3C/div%3E%3Cdiv class=%22cancel_blurb%22%3E%3C/div%3E%3Cdiv class=%22footer%22%3E%3C/div%3E%3C/div%3E")].join('');
quakelive.mod_lfg.TPL_MODE_READY = [unescape("%3Cdiv class=%22lfg_content%22 id=%22lfg_matchready%22%3E%3Cdiv class=%22description%22%3E%3C/div%3E%3Cdiv id=%22lfg_ready_tooltip%22%3E%3Cdiv class=%22levelshot%22%3E%3C/div%3E%3Ca href=%22javascript:;%22 class=%22play%22%3E%3C/a%3E%3C/div%3E%3Ca href=%22javascript:;%22 class=%22decline%22%3E%3C/a%3E%3Cdiv class=%22timer_header%22%3Eopen for%3C/div%3E%3Cdiv class=%22timer%22%3E%3C/div%3E%3C/div%3E")].join('');
quakelive.mod_lfg.TPL_MODE_INQUEUE = [unescape("%3Cdiv class=%22lfg_content%22 id=%22lfg_inqueue%22%3E%3Cdiv class=%22collapse_proxy%22%3E%3C/div%3E%3Cdiv class=%22blurb%22%3EWe're now finding you a Duel at your skill level. Please wait&hellip;%3C/div%3E%3Cdiv class=%22footer%22%3E%3Cimg src=%22"), quakelive.resource("/images/loader.gif"), unescape("%22 class=%22fl ticker%22 /%3E%3Cspan class=%22fl search_status%22%3ESearching%3C/span%3E%3Ca href=%22javascript:;%22 class=%22btn_stop fr%22%3E%3C/a%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3C/div%3E")].join('');
quakelive.mod_home.TPL_TOUR_OVERLAY = [unescape("%3Cdiv class=%22jqmWindow%22 id=%22tour_overlay%22%3E    %3Ca class=%22jqmClose%22%3E%3C/a%3E    %3Cdiv class='header'%3E        %3Cimg src=%22"), quakelive.resource("/images/tour_header.png"), unescape("%22 width=%22411%22 height=%2248%22 /%3E    %3C/div%3E    %3Cdiv class=%22tc%22%3E        %3Ciframe src=%22"), quakelive.resource("/flash/tour/index_tour.html"), unescape("?4ae775c206b24%22 width=%22960%22 height=%22425%22 marginwidth=%220%22 marginheight=%220%22 frameborder=%220%22 scrolling=%22no%22 /%3E    %3C/div%3E%3C/div%3E")].join('');