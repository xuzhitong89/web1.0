/**
 * get root path
 * 获取根目录
 */
var getRootPath = function() {
    var strFullPath = window.location.href;
    var strPath = window.location.pathname;
    var pos = strFullPath.indexOf(strPath);
    var prePath = strFullPath.substring(0, pos);
    return prePath;
}

/**
 * in array
 * 判断值是否存在于数组
 *
 * @param e 需要判断的值
 * @return 如果不在数组中则返回-1，如果在数组中返回在数组中的位置
 */
Array.prototype.in_array = function(e) {
    for(i = 0; i < this.length && this[i] != e; i++) {
        // empty
    }
    return (i == this.length)?-1:i;
}

/**
 * input focus function
 * 输入框获得焦点事件
 *
 * @param clazz input的class名称
 */
var inputFocus = function() {
    //useless
    return true;
    
    var clazz = arguments[0] ? arguments[0] : 'focus';
    $("." + clazz).focus(function(){
        $(this).css("border", "2px solid #6694E3");
        $(this).css("padding", "2px 0 2px 2px");
        $(this).css("margin", "0");
    })
    $("." + clazz).blur(function(){
        $(this).css("border", "1px solid #CCCCCC");
        $(this).css("border-top-color", "#666666");
        $(this).css("padding", "3px 0 3px 3px");
        $(this).css("margin-right", "1px");
    })
}

/**
 * get project tree
 * 获取项目树
 * 
 * @param url 跳转路径
 * @param selectId 产品下拉列表元素ID
 * @param treeId 项目树元素ID
 */
var getProjectTree = function(url) {
    var selectId = arguments[1] ? arguments[1] : 'products';
    var treeId    = arguments[2] ? arguments[2] : 'project-tree';

    var data = {'productid': $("select#" + selectId).val()}
    $.get(toast.getProjectTree, data, function(html){
        $("div#" + treeId).html(html);
        $("div#" + treeId).treeview({
            persist: "cookie",
            collapsed: true
        });
        var project = location.href.match(/parent_id[%5D|\]]{1,3}\/(\d+)/);
        if(project != null) {
            var project_id = project[1];
            $("div#" + treeId + " a[data-project-id=" + project_id +"]").css("font-weight", "bold");
        }

        $("div#" + treeId + " a").click(function(){
             location.href = getRootPath() + url + $(this).attr("data-project-id");
        })
    })
}

/**
 * product change
 * 产品下拉列表改变值事件
 *
 * @param url 跳转路径
 * @param selectId 产品下拉列表元素ID
 */
var productChange = function(url) {
    var selectId = arguments[1] ? arguments[1] : "products";
    $("select#" + selectId).change(function(){
        if(typeof(url) != "undefined") {
            location.href = getRootPath() + url + $(this).val();
        }
    });
}

/**
 * replace project options
 * 替换项目选项
 *
 * @param Integer selectId 项目下拉列表元素ID
 * @param Integer productId 产品ID
 */
var replaceProjectOpts = function(selectId, productId) {
    var data = {'productid' : productId};
    $.get(toast.getProjectOpts, data, function(html){
        $("select#" + selectId).html(html);
    })
}


/**
 * find project
 * 选择项目
 *
 * @param productId 产品ID
 * @param projectSelect 项目下拉列表ID
 * @param title 对话框ID
 */
var findProject = function(productId, projectSelect) {
    var title    = arguments[2] ? arguments[2] : '';
    var dailogId = dailog("dailog",title);
    var data = {'productid': productId}
    $.get(toast.getProjectTree, data, function(html){
        $("div#" + dailogId).html(html);
        $("div#" + dailogId).treeview({
            persist: "cookie",
            collapsed: true
        });
        $("div#" + dailogId + " a").click(function(){
            var projectId = $(this).attr("data-project-id");
            $("select#" + projectSelect).val(projectId);
            $("a#dailog-close").click();
        })
    })
}

/**
 * dailog
 * 对话框
 *
 * @param dailogId 对话框ID
 * @param title 对话框标题
 * @param width 对话框宽度
 * @param top 对话框位置高度
 */
var dailog = function() {
    var dailogId = arguments[0] ? arguments[0] : 'dailog';
    var title    = arguments[1] ? arguments[1] : '';
    var connent  = arguments[2] ? arguments[2] : ''
    var width    = arguments[3] ? arguments[3] : 700;
    var top      = arguments[4] ? arguments[4] : 120;
        
    var html = '<div class="overlay"></div><div id="' + dailogId + '" class="dailog">'
             + '<div class="close">'
             + '<a id="dailog-close" href="javascript:;">X</a>'
             + '<div class="dailog-title">' + title + '</div></div>'
             + '<div id="' + dailogId +'-content">'
             + connent
             + '</div></div>';
    $("select").hide();
    $("body").append(html);
    $("div#" + dailogId).css({
        "width": width + "px",
        "top": (top + self.pageYOffset) + "px"
    });
    $("div.overlay").height($(document).height());
    $("a#dailog-close").click(function(){
       $("div#" + dailogId).remove();
       $("div.overlay").remove();
       $("select").show();
    });
    center($("div#" + dailogId));
    return dailogId + "-content";
}

/**
 * center
 * 元素浏览器居中
 *
 * @param Object obj 居中对象
 */
var center = function(obj) {
    var windowWidth = document.documentElement.clientWidth;
    var popupWidth = $(obj).width();
    $(obj).css({
        "left": (windowWidth - popupWidth) / 2
    });
}

/**
 * sync machine status
 * 同步机器状态
 *
 * @param Object machinesSelect 机器下拉列表对象
 */
var syncMachineStatus = function(machineSelect) {
    $.get(toast.syncMachineStatus, function(data){
        var json = eval(data);
        $(machineSelect).find("option").addClass("blocked");
        $.each(json,function(k, v){
            $(machineSelect).find("option[value=" + v.id + "]").removeClass("blocked").addClass(v.clazz);
        })
    })
}

/**
 * get command form
 * 获取命令表单
 *
 * @param Object parentObj 父对象
 */
var getCommandForm = function(parentObj) {
    var type = arguments[1] ? arguments[1] : '';
    var data = {'type' : type};
    $.get(toast.getCommandForm, data, function(html){
        $(parentObj).html(html);
        syncMachineStatus($(parentObj).find("select.machine-list"));
        $("button.add-machine").click(function(){
            window.open(getRootPath() + "/machine/create", "", "width=900, height=400, top=100, left= 100, resizable=no");
            $("a.refresh").click(function(){
                var data = {name: $(this).prev('button').prev('select').attr('name')};
                $.get(toast.getMachineOpts, data, function(html){
                    $("a.refresh").prev('button').prev('select').replaceWith(html);
                    syncMachineStatus($("select.machine-list"));
                });
            })
        })
        inputFocus();
    });
}

/**
 * human time
 * 人性化时间
 *
 * @param String savetime
 */
var humanTime  = function(saveTime) {
    var now = new Date();
    var old = saveTime;
    var diffValue = now.getTime() - old.getTime();

    var minute = 1000 * 60;
    var minuteC  = diffValue/minute;

    var result = '';
    result = lang.savedDraftAt + parseInt(minuteC) + lang.minutes;

    return result;
}

var setListHeight = function(){
    var top = $(".widget-view .table-body").position().top;
    var bottom = $(".footer").height() + $(".widget-view .pager").height() + 40;
    $(".widget-view .table-body").height($(window).height() - top - bottom);
    if($(".widget-view table.items").outerHeight() > $(".widget-view .table-body").outerHeight())
    {
        $(".widget-view .table-body").css('margin-right', '-15px');
    }
    else
    {
        $(".widget-view .table-body").css('margin-right', '0');
    }
    $("html").css('overflow-y', 'hidden');
    $("#project-tree").height($(".widget-view").outerHeight());
}

var triggerPageSizeChange = function(){
    $("select.page-size").change(function(){
        var data = {'pagesize': $(this).val()};
        $.get(toast.setPageSize, data, function(){
            location.reload();
        });
    })
}

var executeFuncByName = function (funcName, context /*, args */) {
  var args = Array.prototype.slice.call(arguments).splice(2)
  var namespaces = funcName.split(".")
  var func = namespaces.pop()
  for(var i = 0; i < namespaces.length; i++) {
    context = context[namespaces[i]]
  }
  if(undefined == context[func]) 
    return false
  else
    return context[func].apply(this, args)
}
