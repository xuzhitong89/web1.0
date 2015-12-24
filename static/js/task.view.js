var flagRun = function(){
    $("a[rel=popover]").popover();
    $(".popover.bottom").remove();
    var currentRun = $("div.run-block").has($("input[name='taskrun_id'][value='" + $("#VTaskRun_id").val() + "']"));
    if(currentRun.length)
    {
        $("div.current-arrow").show().css("left", currentRun.position().left + currentRun.width()/2 - 29);
    }
    else
        $("div.current-arrow").hide();
    
    $("a.pagination").click(function(e){
        if(!$(this).hasClass("disabled"))
        {
            $.fn.yiiListView.update("vruns", {url: $(this).attr("href")});
            $("#vruns").removeClass('list-view-loading');
            $("#recentruns").addClass('list-view-loading');
        }
        e.preventDefault();
    })
}

$(document).ready(function(){
    flagRun();
    $(window).resize(function(){
        flagRun();
    })
    $("input.update-task").click(function(){
        var taskId = $("#task-id").val();
        location.href = getRootPath() + "/task/update/id/" + taskId;
    })
    $("input.copy-task").click(function(){
        var taskId = $("#task-id").val();
        location.href = getRootPath() + "/task/copy/id/" + taskId;
    })
    $("input.delete-task").click(function(){
        if(confirm(lang.confrimDeleteTask)){
            var taskId = $("#task-id").val();
            var data = {"id" : taskId};
            $.getJSON(getRootPath() + "/task/delete", data, function(json){
                if(json.flag) {
                    location.href = getRootPath() + "/task";
                } else {
                    alert(lang.deleteFailed);
                }
            })
        }
    })
    $("input.run-task").click(function(){
        var taskId = $("#task-id").val();
        location.href = getRootPath() + "/task/createrun/id/" + taskId;
    })
    $("input.cancel-run").click(function(){
        $(this).attr("disabled", "disabled");
        $(this).val(lang.Cancelling);
        var data = {id : $("#VTaskRun_id").val()};
        $.getJSON(toast.cancelTaskRun, data, function(json){
            $("tr:contains(" + json.id + ")").children("td.run-status").text(json.status);
            $("td.summary-status").text(json.status);
            location.reload();
        });
    })
    $("input.task-detail").click(function(){
        $("input.task-detail").toggleClass("active");
        $("div.task-detail").slideToggle("fast");
    })
    $("input.update-history").click(function(){
        $("input.update-history").toggleClass("active");
        $("div.update-history").slideToggle("fast");
        if($("div.update-history div.list-view").size() == 0)
            $("div.history-content").load(getRootPath() + "/task/getHistory/id/" + $("#task-id").val());
    })
    
    $(".return").click(function(){
        location.href = getRootPath() + "/task/index"
    })
    
    $("td#view-allrun-case").click(function() {
        var taskRunId = $("#VTaskRun_id").val();
        var url = getRootPath() + "/run/case/taskrun/" + taskRunId;
        window.open(url, '', "width=1100, height=600, top=100, left=100, resizable=yes, scrollbars=1");
    })
    $("td#view-allrun-passed-case").click(function() {
        var taskRunId = $("#VTaskRun_id").val();
        var url = getRootPath() + "/run/case/taskrun/" + taskRunId + "/filter/0";
        window.open(url, '', "width=1100, height=600, top=100, left=100, resizable=yes, scrollbars=1");
    })
    $("td#view-allrun-failed-case").click(function() {
        var taskRunId = $("#VTaskRun_id").val();
        var url = getRootPath() + "/run/case/taskrun/" + taskRunId + "/filter/1";
        window.open(url, '', "width=1100, height=600, top=100, left=100, resizable=yes, scrollbars=1");
    })
    $("td#view-allrun-null-case").click(function() {
        var taskRunId = $("#VTaskRun_id").val();
        var url = getRootPath() + "/run/case/taskrun/" + taskRunId + "/filter/2|3";
        window.open(url, '', "width=1100, height=600, top=100, left=100, resizable=yes, scrollbars=1");
    })
    
    if($("#task-running-flag").val()) {
        var taskRunID = $("#VTaskRun_id").val();
        var getstages = setInterval(function() {
        $("div#stages-detail").load(
            getRootPath() + "/run/getStages/id/" + taskRunID);
        $.getJSON(getRootPath() + "/run/getTaskRunStatus/id/" + taskRunID, function(json){
            if(json.hascompleted) {
                clearInterval(getstages);
                location.reload();
            }
        });
        }, toast.heartbeat);
    }
});