$(document).ready(function(){
    attachJobAction()
    syncMachineStatus($("#Job_machine_id"))
    
    $("div.add-stage a").click(function(){
        if($("div.stage-detail:last").find("div.job").size() < 1){
            alert(lang.alertEmptyStageExist)
            return false
        }
        var lastStage = $("div.stage-detail:last").clone()
        $(lastStage).find("div.job").remove()
        $(this).parent("div.add-stage").before(lastStage)
        attachJobAction()
        return true
    })
})

// attach job
var attachJobAction = function() {
    $("div.add-job").unbind("click").click(function() {
        jobForm.dlgInit(lang.Add, $(this))
        jobForm.dlgShow()
    })
    $("div.stage-detail div.close a").unbind("click").click(function(event){
        deleteStage(event, $(this).parents("div.stage-detail"))
    })
    renameStage()
    makeSortable()
}

// rename all stage
var renameStage = function() {
    var index = 1
    $("span.stage-name").each(function(){
        $(this).text(lang.stage + " " + index++)
    })
}

// delete stage
var deleteStage = function(event, cur_stage) {
    if($("div.stage-detail").size() > 1) {
        var jobs = cur_stage.nextAll("div.stage-detail").find("input.stage-num")
        jobs.each(function(index){
            $(this).val($(this).val() - 1)
        })
        cur_stage.remove()
    }
    renameStage()
    event.stopImmediatePropagation()
}

// make job moveable
var makeSortable = function() {
    $(".stage-sortable").sortable({
        items: ".job,.add-job",
        connectWith: ".stage-sortable",
        placeholder: "job-sort-highlight",
        cancel: ".add-job",
        distance: 10,
        remove: function (event, ui) {
            if ($(this).find("div.job").size() <= 0) {
                var jobs = $(this).parents("div.stage-detail").nextAll("div.stage-detail").find("input.stage-num")
                jobs.each(function(index){
                    $(this).val($(this).val() - 1)
                })
                $(this).parents("div.stage-detail").remove()
                renameStage()
            }
            event.stopImmediatePropagation()
        },
        receive: function (event, ui) {
            var stage_num = $(this).find(".job").not(ui.item).find("input.stage-num:last").val()
            if (typeof(stage_num) == 'undefined') {
                stage_num = parseInt($(".job").not(ui.item).find("input.stage-num").filter(":last").val())
                if (isNaN(stage_num))
                    stage_num = 0
                else
                    stage_num++
            }
            ui.item.find(".stage-num").val(stage_num)
            event.stopImmediatePropagation()
        }
    }).disableSelection()
}