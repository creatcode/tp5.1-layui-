layui.extend({
    notice: 'lib/notice/notice', //扩展消息通知模快
}).define(['notice', 'element'], function (exports) {
    var $ = layui.$,
        element = layui.element,
        notice = parent.layui.notice,
        spread_sm = 'layadmin-side-spread-sm',
        shrink_right = 'layui-icon-shrink-right',
        spread_left = 'layui-icon-spread-left',
        side_shrink = 'layadmin-side-shrink',
        tab_index = 0; //当前显示的标签页


    // notice通知模快配置,透明度默认.95
    notice.options = {
        closeButton: true,//显示关闭按钮
        debug: false,//启用debug
        positionClass: "toast-top-right",//弹出的位置,
        showDuration: "1000",//显示的时间
        hideDuration: "1000",//消失的时间
        timeOut: "6000",//停留的时间
        extendedTimeOut: "1000",//控制时间
        showEasing: "swing",//显示时的动画缓冲方式
        hideEasing: "linear",//消失时的动画缓冲方式
        iconClass: 'toast-info', // 自定义图标，有内置，如不需要则传空 支持layui内置图标/自定义iconfont类名
        onclick: null, // 点击关闭回调
    };

    // 方法
    var admin = {
        notice: notice,
        deviceInfo: function () {
            var screen_width = $(window).width()
            if (screen_width > 1200) {
                return 3; //大屏幕
            } else if (screen_width > 992) {
                return 2; //中屏幕
            } else if (screen_width > 768) {
                return 1; //小屏幕
            } else {
                return 0; //超小屏幕
            }
        },
        // 侧边栏伸缩
        sideBar: function (status) {
            // status spread:展开  收缩:shrink,null
            var sideElem = $("#admin-app-flexible"),
                screenType = admin.deviceInfo();
            if (status == "spread") {
                // 改变切换图标样式
                sideElem.addClass(shrink_right).removeClass(spread_left)
                if (screenType < 2) {
                    $('#admin-app').addClass(spread_sm)
                } else {
                    $('#admin-app').removeClass(spread_sm)
                }

                $('#admin-app').removeClass(side_shrink)
            } else {
                // 改变切换图标样式
                sideElem.addClass(spread_left).removeClass(shrink_right)
                if (screenType < 2) {
                    $('#admin-app').removeClass(side_shrink)
                } else {
                    $('#admin-app').addClass(side_shrink)
                }
                $('#admin-app').removeClass(spread_sm)
            }
        },
        //全屏
        fullScreen: function () {
            var ele = document.documentElement
                , reqFullScreen = ele.requestFullScreen || ele.webkitRequestFullScreen
                    || ele.mozRequestFullScreen || ele.msRequestFullscreen;
            if (typeof reqFullScreen !== 'undefined' && reqFullScreen) {
                reqFullScreen.call(ele);
            };
        },

        //退出全屏
        exitScreen: function () {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        },
        // 打开tab选项卡
        addTab: function (url, text) {
            var is_exist = false;

            url = url.replace(/(^http(s*):)|(\?[\s\S]*$)/g, '');
            // url = "/text" + url;
            // tab_index = 0;
            // 判断是否存在已打开的相同选项卡
            $("#admin-app-tab>li").each(function (index) {
                if ($(this).attr('lay-id') == url) {
                    is_exist = true;
                    tab_index = index;
                    return false;
                }
            })

            if (!is_exist) {
                $("#admin-app-body").append([
                    '<div class="layadmin-tabsbody-item layui-show">'
                    , '<iframe src="' + url + '" frameborder="0" class="layadmin-iframe"></iframe>'
                    , '</div>'
                ].join(''))

                tab_index = $("#admin-app-tab").find('li').length;

                element.tabAdd("layadmin-layout-tabs", {
                    title: '<span>' + text + '</span>',
                    id: url,
                });

            }

            // 当前显示，其余隐藏
            $("#admin-app-body").find(".layadmin-tabsbody-item").eq(tab_index).addClass("layui-show").siblings().removeClass("layui-show");

            // 定位当前tab
            element.tabChange("layadmin-layout-tabs", url);

            // 如果是当前页则刷新
            if ($("#admin-app-body").find(".layadmin-tabsbody-item").eq(tab_index).find('iframe').attr('src') == url) {
                event.refresh()
            }

        }
    }

    // 事件 (元素加上admin-event属性可触发)
    var event = {
        flexible: function (obj) {
            // 判断侧边栏状态
            var status = obj.find('#admin-app-flexible').hasClass('layui-icon-spread-left') ? "spread" : "shrink";
            admin.sideBar(status);
        },
        screeView: function (obj) {
            var status = obj.children('i').hasClass("layui-icon-screen-full") ? "normal" : "full";
            if (status == "normal") {
                admin.fullScreen();
                obj.children('i').removeClass('layui-icon-screen-full').addClass('layui-icon-screen-restore')
            } else {
                admin.exitScreen();
                obj.children('i').removeClass('layui-icon-screen-restore').addClass('layui-icon-screen-full')
            }
        },
        refresh: function () {
            // var now_index = 0;
            // $("#admin-app-body>li").each(function (index) {
            //     if ($(this).hasClass('lay-show')) {
            //         now_index = index;
            //         return false;
            //     }
            // })

            $("#admin-app-body").find(".layadmin-tabsbody-item").eq(tab_index).find('.layadmin-iframe')[0].contentWindow.location.reload(true);
        },
        delete: function () {
            notice.warning('!!!');
        }

    }



    // 菜单点击
    $("#admin-app-menu>li").on('click', 'a:not([href^="javascript:;"])', function (e) {
        e.preventDefault();
        var href = $(this).attr('href'),
            text = $(this).text();
        if (href != "javascript:;") {
            location.hash = href;
            admin.addTab(href, text || "新标签页");
        }

    });

    // 打开标签页方法
    $("body").on('click', '*[lay-href]', function () {

        var href = $(this).attr('lay-href'),
            text = $(this).attr('lay-text');
        var topLayui = parent === self ? admin : top.layui.admin;
        topLayui.addTab(href, text || $(this).text());
        refresh_menu();
        // admin.addTab(href, text || $(this).text());
    })

    // 更新菜单
    function refresh_menu(href, is_refresh = true) {
        var user_href = href ? href : location.hash,
            is_match = false,
            main_usr = $("#admin-app-menu>li>a").eq(0).attr("href");
        user_href.indexOf(main_usr) == -1;
        user_href = user_href.replace("#", "");

        if (user_href != "") {
            $("#admin-app-menu>li a:not([href^='javascript:;'])").each(function () {
                if ($(this).attr("href").indexOf(user_href) > -1) {
                    is_match = true;
                    $(this).trigger('click');
                    // if (user_href.indexOf(main_usr)>-1) {
                    //     $(this).parent().addClass('layui-this');
                    // }else{
                    //     $(this).trigger('click');
                    // }
                    $(this).closest("li").addClass("layui-nav-itemed");
                    $(this).closest("li").siblings().removeClass("layui-nav-itemed");
                    $(this).parents("dd:not(:first)").addClass("layui-nav-itemed");
                    $(this).parents("dd").siblings().removeClass("layui-nav-itemed");
                    return false;
                }
            });
        }

        if (is_match !== true) {
            $("#admin-app-menu>li").eq(0).addClass('layui-this');
            $("#admin-app-menu>li").siblings().removeClass("layui-nav-itemed");
            $("#admin-app-menu>li").siblings().find('dd').removeClass("layui-nav-itemed");
            $("#admin-app-menu>li").siblings().find('dd').removeClass("layui-this");

            var error_match = false;
            var href = location.hash;
            href = href.replace("#", "");
            $("#admin-app-head>li a[lay-href]").each(function () {
                if ($(this).attr("lay-href").indexOf(href) > -1) {
                    $(this).trigger('click');
                    error_match = true;
                    return false;
                }
            });

            if (error_match === false) {
                admin.addTab(href, '错误页面');
            }
        }
        return is_match;
    }

    if (window.parent === this.window) {
        refresh_menu();
    }

    // 点击第一个菜单栏时
    $("#admin-app-menu>li:first").on('click', function () {
        $(this).siblings().removeClass('layui-nav-itemed');
        $(this).siblings().children().find('dd').removeClass('layui-nav-itemed');
    })

    // 监听选项卡切换
    element.on('tab(layadmin-layout-tabs)', function (data) {
        $("#admin-app-body").find(".layadmin-tabsbody-item").eq(data.index).addClass("layui-show").siblings().removeClass("layui-show");
        // 重置当前索引
        tab_index = data.index;

        // 更新菜单显示状态
        var lay_id = $(this).attr('lay-id');
        location.hash = lay_id
        // refresh_menu();
    });

    // 监听选项卡删除
    element.on('tabDelete(layadmin-layout-tabs)', function (data) {
        $("#admin-app-body").find(".layadmin-tabsbody-item").eq(data.index).remove();
        refresh_menu();
    });

    // 监听导航菜单点击
    element.on('nav(layadmin-system-side-menu)', function (elem) {
        if (elem.siblings('.layui-nav-child')[0] && $("#admin-app").hasClass('side_shrink')) {
            admin.sideBar('spread');
        };
    });



    // 监听hash改变
    window.onhashchange = function () {
        refresh_menu();
    }

    // 移动端初始状态值隐藏
    if (admin.deviceInfo() < 2) {
        admin.sideBar();
    }

    // 窗口resize事件
    $(window).resize(function () {
        admin.sideBar();
    });

    // 注册事件全局点击事件
    $("body").on('click', '*[admin-event]', function () {
        var _this = $(this),
            event_fn = _this.attr('admin-event');
        event[event_fn] && event[event_fn].call(this, _this);
    });






    exports('admin', admin)
})