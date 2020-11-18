layui.extend({
    admin: 'lib/admin' //核心模块
  }).define(['admin'], function (exports) {
    var $=layui.$, 
    element = layui.element,
    admin = layui.admin,
    tab_index = admin.tab_index, //当前显示的标签页
    // 打开tab选项卡
    addTab= function (url, text) {
        var is_exist = false;

        url = url.replace(/(^http(s*):)|(\?[\s\S]*$)/g, '');
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
    };

    exports('index',{
        addTab: addTab
    });
})