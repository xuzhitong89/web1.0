var jobForm = function(){    
    var runTabInit = function() {
        $("#run-tabs li").click(function(){
            if("command-tab" == $(this).attr("id")) {
                jobForm.turnOnCommandMode()
                $("#Job_type").val(0)
            } else {
                jobForm.turnOnTestCaseMode()
                $("#Job_type").val(1)
            }
        }) 
    }

    var commandTabInit = function() {
        $("#command-tabs li").click(function(){
            switch($(this).attr("id")) {
                case "basic-command-tab": {
                    jobForm.showBasicCommandView()
                    $("#Command_mode").val(0)
                    break
                }
                case "ut-command-tab": {
                    jobForm.showUTCommandView()
                    $("#Command_mode").val(1)
                    break
                }
                case "comparison-command-tab": {
                    jobForm.showComparisonCommandView()
                    $("#Command_mode").val(2)
                    break
                }
                case "ci-command-tab": {
                    jobForm.showCICommandView()
                    $("#Command_mode").val(4)
                    break
                }
                default: {
                    break
                }
            }
        })
    }
    
    var ut2Basic = function () {
            var command = [];
            var utCmd = $("#ut-command").val();
            utCmd = "-u \"" + utCmd.replace(/\\/, "\\").replace(/"/, "\\\"").replace("\r", "").replace("\n", ";") + "\"";
            command.push(utCmd);
            var codePath = $("#code-path").val();
            if(codePath.match(/^(\/|[a-zA-Z]:).*/)) {
                codePath = "-l \"" +  codePath.replace(/\\/, "\\").replace(/"/, "\\\"") + "\"";
            } else {
                codePath = "-s \"" +  codePath.replace(/\\/, "\\").replace(/"/, "\\\"") + "\"";
            }
            command.push(codePath);
            $("#ut-command-fields input:checked").each(function(k, v){
                command.push($(v).val());
            })
            if(command.length > 0) {
                command.unshift(toast.ut_run);
            }
            if($("#other-opts").val()) {
                command.push($("#other-opts").val());
            }
            if($("#make-tool").val()) {
                command.push($("#make-tool").val());
            }
            $("#Command_command").val(command.join(" "));
            utParser($("#make-tool").val());
    }
    
    var basic2Ut = function() {
        var OPT_TEXT_LABEL = '_OPT_TEXT_LABEL_'
        var command = $("#Command_command").val()
        var opts = command.split("/unittest_run")
        if(2 == opts.length) {
            var argTexts = opts[1].match(/".*?[^\\]*?"/g)
            var args = opts[1].replace(/".*?[^\\]*?"/g, OPT_TEXT_LABEL)
            var argv = $.trim(args).split(" ")
            var otherArgv = []
            for(var idx = 0, i = 0; i < argv.length; i++) {
                var val = argv[i]
                if("-y" == val) {
                    val = "-y"
                }
                if("-H" == val) {
                    continue
                }
                var obj = $("#ut-command-fields input[value=\"" + val + "\"]")
                if("-u" == val) {
                    if(argv[i+1] && OPT_TEXT_LABEL == argv[i+1]) {
                        $("#ut-command").val(argTexts[idx++].slice(1, -1))
                        i++
                    }
                } else if("-s" == val || "-l" == val) {
                    if(argv[i+1] && OPT_TEXT_LABEL == argv[i+1]) {
                        $("#code-path").val(argTexts[idx++].slice(1, -1))
                        i++
                    }
                } else if(obj.length > 0) {
                    $(obj).attr("checked", "checked")
                } else if($("#make-tool option[value=\"" + val + "\"]").length > 0) {
                    $("#make-tool").val(val)
                    utParser(val)
                } else {
                    if(OPT_TEXT_LABEL == val) {
                        val = argTexts[idx++]
                    }
                    otherArgv.push(val)
                }
            }
            $("#other-opts").val(otherArgv.join(" "))
        }
    }
    
    var ci2Basic = function () {
        var ciCommand = jobForm.ciCommand;
        var ciConfig = $("#ci-config-filename a").attr("href");
        var ciStage = "";
        $("input[ext='CI-Stage']:checked").each(function(){
            ciStage += $(this).val();
        })
        var ciOthers = $("#ci-other-opts").val();
        if(ciConfig && ciStage)
        {
            $("#Command_command").val(ciCommand + " -c " + ciConfig + " -s " + ciStage + " " + ciOthers);
            $("#Command_parser_id").select2("val", $("#ci-parser").select2("val"))
            return true;
        }
        else
        {
            alert(lang.alertCISave);
            return false;
        }
    }
    
    var basic2Ci = function() {
        var command = $.trim($("#Command_command").val())
        var regexp = new RegExp("^" + jobForm.ciCommand + "\\s+-c\\s+(http://.*)\\s+-s\\s+([ubdf]+)(?:\\s+(.*))?$");
        var match = command.match(regexp);
        if(match)
        {
            var ciConfig = match[1];
            var ciStage = match[2];
            var ciConfigName = ciConfig.replace(/^.*(\/)/, '');
            $("#ci-config-filename").html("<a href='" + ciConfig + "' target='_blank' title='" + ciConfigName + "'>" + ciConfigName + "</a>");
            $("#ci-config-newname").val(ciConfigName);
            $("a.ci-config-edit").show();
            var stages = ciStage.split("")
            for(var i = 0; i < stages.length; i++)
            {
                $("input[ext='CI-Stage'][value='" + stages[i] + "']").attr("checked", "checked")
            }
            $("#ci-parser").select2("val", $("#Command_parser_id").select2("val"))
            if(match[3])
                $("#ci-other-opts").val(match[3]);
            return true;
        }
        else
            return false;
    }
    
    var utParser = function(val) {
        switch(val) {
            case "": {
                $("#Command_parser_id").val(4)
                break
            }
            case "-M": {
                $("#Command_parser_id").val(15)
                break
            }
            case "--python": {
                $("#Command_parser_id").val(19)
                break
            }
            case "--php": {
                $("#Command_parser_id").val(10)
                break                    
            }
            case "--perl": {
                $("#Command_parser_id").val(20)
                break                    
            }
            case "--shell": {
                $("#Command_parser_id").val(23)
                break                    
            }
            default: {
                 break
            }
        }
    }
    
    var ciTabInit = function() {
        jobForm.ciCommand = toast.ci_run
        $("#ci-config-input").change(function(){
            $(this).attr("name", "attachment")
            $("#job-form").ajaxSubmit({
                url: toast.upload,
                type: 'POST',
                dataType: 'json',
                success: function(json) {
                    if(json.error > 0) {
                        alert(json.message);
                    } else {
                        $("#ci-config-filename").html("<a href='" + json.url + "' target='_blank' title='" + json.name + "'>" + json.name + "</a>");
                        $("#ci-config-newname").val(json.newname);
                        $("a.ci-config-edit").show();
                    }
                }
            })
        })
        
        $("a.ci-config-new").click(function(){
            var url = getRootPath() + "/task/editconfig";
            window.open(url, '', "width=800, height=480, top=100, left=100, resizable=yes, scrollbars=1");
        })
        $("a.ci-config-edit").click(function(){
            var url = getRootPath() + "/task/editconfig/name/" + $("input#ci-config-newname").val();
            window.open(url, '', "width=800, height=480, top=100, left=100, resizable=yes, scrollbars=1");
        })
    }
    
    var caseSelectorBind = function() {
        $(".select-case").unbind().click(function(){
            $('#query-result option').each(function(){
                if($(this).attr('selected')){
                    addCaseOpt($(this), $("#selected-case"))
                }
            });
            return false
        })
        $(".cancel-case").unbind().click(function(){
            $('#selected-case option').each(function(){
                if($(this).attr('selected')){
                    addCaseOpt($(this), $("#query-result"))
                }
            });
            return false
        })
        $("#query-result option").live("dblclick", function(){
            addCaseOpt($(this), $("#selected-case"))
            return false
        })
        $("#selected-case option").live("dblclick", function(){
            addCaseOpt($(this), $("#query-result"))
            return false
        })
        $("#query-result option, #selected-case option").live("mousedown", function(e){
            if(2 == e.which) {
                window.open(toast.viewCase + $(this).val(), "_blank")
            }
        })
        $(".move-up").unbind().click(function(e){
            $current = $first = $("#selected-case option:selected:first")
            if($current.val() != $("#selected-case option:first").val()) {
                $current = $current.prev()
            }
            $("#selected-case option:selected").each(function(k, v){
                if($current.val() != $(v).val()) {
                    $current.before($(v))
                }
            })
            if($first.val() != $("#selected-case option:selected:first").val()) {
                $("#selected-case option:selected:first").before($first)
            }
            e.preventDefault()
            e.stopImmediatePropagation()
        })
        $(".move-down").unbind().click(function(e){
            $current = $("#selected-case option:selected:last")
            if($current.val() != $("#selected-case option:last").val()) {
                $current = $current.next()
            }
            $("#selected-case option:selected").each(function(k, v){
                if($current.val() != $(v).val()) {
                    $current.after($(v))
                    $current = $(v)   
                }
            })
            e.preventDefault()
            e.stopImmediatePropagation()
        })
    }
    
    var addCaseOpt = function($opt, $to) {
        if($to.find("option[value=" + $opt.val() +"]").length > 0) {
            $to.find("option[value=" + $opt.val() +"]").remove()
        }
        $to.append($opt)
    }
    
    return{
        init: function(){
            runTabInit()
            commandTabInit()
            ciTabInit()
            this.showBasicCommandView()
            $("#Command_command").next().addClass("focus")
        },
        turnOnCommandMode: function() {
            $("#run-tabs li").removeClass("selected")
            $("#test-case-fields").hide()
            $("#command-tab").addClass("selected")
            $("#command-fields").show()
        },
        turnOnTestCaseMode: function() {
            caseSelectorBind()
            $("#run-tabs li").removeClass("selected")
            $("#command-fields").hide()
            $("#test-case-tab").addClass("selected")
            $("#test-case-fields").show()
        },
        showBasicCommandView: function() {
            this.turnOnCommandMode()
            $("#command-tabs li").removeClass("selected")
            $("#basic-command-tab").addClass("selected")
            $("#ut-command-fields").hide()
            $("#ci-command-fields").hide()
            $("#basic-command-fields").show()
        },
        showUTCommandView: function() {
            this.turnOnCommandMode()
            $("#command-tabs li").removeClass("selected")
            $("#ut-command-tab").addClass("selected")
            $("#basic-command-fields").hide()
            $("#ci-command-fields").hide()
            $("#ut-command-fields").show()
        },
        showCICommandView: function() {
            this.turnOnCommandMode()
            $("#command-tabs li").removeClass("selected")
            $("#ci-command-tab").addClass("selected")
            $("#basic-command-fields").hide()
            $("#ut-command-fields").hide()
            $("#ci-command-fields").show()
        },
        switchCommandModeWithTaskType: function() {
            switch($("#Task_type").val()) {
                case "1": {
                    jobForm.showUTCommandView()
                    $("#Command_mode").val(1)
                    break
                }
                case "6": {
                    jobForm.showCICommandView()
                    $("#Command_mode").val(4)
                    break
                }
                default: {
                    jobForm.showBasicCommandView()
                    break
                }
            }
        },
        switchCommandMode: function(mode) {
            switch(mode) {
                // basic command
                case "0": {
                    jobForm.showBasicCommandView()
                    break
                }
                // ut command
                case "1": {
                    basic2Ut()
                    jobForm.showUTCommandView()
                    break
                }
                // ci_test
                case "4": {
                    if(basic2Ci())
                        jobForm.showCICommandView()
                    else
                        jobForm.showBasicCommandView()
                    break
                }
                default: {
                    break
                }
            }
            $("#Command_mode").val(mode)
        },
        setCommand: function(name, id) {
            $("#Command_command").val("")
            $("#Command_parser_id").val("")
            if(-1 == id) {
                $("#Job_command_id").val("")
                name = ""
            } else if(id > 0) {
                $.getJSON(getRootPath() + "/command/getCommandDetail", {id:id}, function(json){
                    $("#Command_parser_id").select2("val", json.parser_id)
                    $("#Command_command").val(json.command)
                    jobForm.switchCommandMode(json.mode)
                    if($("#Job_command_id option[value='" + id + "']").length == 0) {
                        $("#Job_command_id option[value!='']:first").after("<option value='" + json.id + "' owner='other'>"+ json.name + "</option>")
                        $("#Job_command_id_input").val(json.name)
                        $("#Command_name").val(json.name)
                    }
                    $("#Job_command_id").val(id)
                })
            }
            $("#Command_name").val(name)
        }, 
        dlgInit: function(label, job) {
            $("#dlg-add-job")
            .dialog("option", "title", label)
            .dialog("option", "buttons", [{
                text: label,
                click: function() {
                    $("#Command_name").val($("#Job_command_id_input").val());

                    var maxJobNum = 0
                    $.each($(".add-stage").parent().find(".job-num"), function(i, job){
                        if(parseInt($(job).val()) > maxJobNum) {
                            maxJobNum = parseInt($(job).val())
                        }
                    })
                            
                    var stage_num = job.parent().find(".stage-num:last").val()
                    if('undefined' == typeof(stage_num)) {
                        stage_num = parseInt($(".stage-num:last").val()) + 1
                    }
                    if(isNaN(stage_num)) {
                        stage_num = 0
                    }
                    $("#job-form #Job_stage_num").val(stage_num)
                            
                    if(!$("#Job_machine_id_input").val()) {
                        $("#Job_machine_id").val("")
                    }
                    
                    if($("#ut-command-fields").css("display") != "none") {
                        ut2Basic()
                    } else if($("#ci-command-fields").css("display") != "none") {
                        if(!ci2Basic())
                            return false;
                    }
                    
                    if($("#test-case-fields").css("display") != "none") {
                        $("#selected-case option").attr("selected", "selected")
                    }
                    
                    $.getJSON(getRootPath() + "/task/validateJobData", $("#job-form").serialize(), function(json){
                        if(0 == json.command_code) {
                            if(json.command.newone) {
                                $("#Job_command_id option[value!='']:first").after("<option value='" 
                                    + json.command.id + "'>"
                                    + json.command.name + "</option>")
                                $("#Job_command_id").val(json.command.id)
                            } else {
                                $("#Job_command_id option[value='" + json.command.id + "']").text(json.command.name)
                            }
                        }
                
                        if(0 == json.job_code)
                        {
                            if(lang.Add == label) {
                                $(job).before('<div class="job"></div>')
                                $(job).prev().load(getRootPath() + "/task/getJobView/jobNum/" 
                                    + (maxJobNum + 1), $("#job-form").serialize())
                            } else {
                                var jobNum = $(job).find(".job-num").val()
                                var curJob = $(".job-num[value=" + jobNum + "]").parent()
                                curJob.load(getRootPath() + "/task/getJobView/jobNum/" + jobNum, $("#job-form").serialize())
                            }
                    
                            $("#job-error").hide()
                            $("#dlg-add-job").dialog("close")
                        } else {
                            var html = ''
                            for(var item in json.errors)
                            {
                                html += '<p>' + json.errors[item] + '</p>'
                            }
                            $("#job-error").html(html).show()
                        }
                    })
                    
                    return true
                }
            },
            {
                text: lang.Cancel,
                click: function() {
                    $(this).dialog("close")
                }
            }
            ])
            jobForm.switchCommandModeWithTaskType();
        },
        dlgLoad: function(job) {
            jobForm.clear()
            var jobNum = $(job).find(".job-num").val()
            var command_id = $("#Jobs_" + jobNum + "_command_id").val()
            var machine_id = $("#Jobs_" + jobNum + "_machine_id").val()
            $("#Job_type").val($("#Jobs_" + jobNum + "_type").val())
            if("0" == $("#Job_type").val()) {
                this.turnOnCommandMode()
                jobForm.setCommand($("#command-" + jobNum + "-name").val(), command_id)
                $("#Job_command_id_input").val($("#command-" + jobNum + "-name").val())   
            } else {
                this.turnOnTestCaseMode()
                $("input[name=\"Jobs[" + jobNum + "][test_case_ids][]\"]").each(function(k, v){
                    var option = "<option value=\"" + $(v).val() + "\" title=\"" +
                        $("input[name=\"Jobs[" + jobNum + "][test_case_urls][]\"]").eq(k).val()
                        + "\">" + $("input[name=\"Jobs[" + jobNum + "][test_case_names][]\"]").eq(k).val() + "</option>"
                    $("#selected-case").append(option)
                })
            }
            $("#Job_machine_id").val(machine_id)
            $("#Job_machine_id_input").val($("#machine-" + jobNum + "-name").val())
            
            $("#Job_id").val($("#Jobs_" + jobNum + "_id").val())
            $("#Job_stage_num").val($("#Jobs_" + jobNum + "_stage_num").val())
            $("#Job_sudoer").val($("#Jobs_" + jobNum + "_sudoer").val())
            $("#Job_timeout").val($("#Jobs_" + jobNum + "_timeout").val())
            $("#Job_failed_repeat").val($("#Jobs_" + jobNum + "_failed_repeat").val())
            $("input[name='Job[crucial]']").removeAttr('checked')
            $("input[name='Job[crucial]'][value='" + $("#Jobs_" + jobNum + "_crucial").val() + "']").attr('checked', true)
        },
        dlgShow: function() {
            $("#dlg-add-job").dialog("open")
        },
        clear: function() {
            $("#job-error").hide()
            $("#Job_id").val("")
            $("#Job_stage_num").val("")
            $("#Command_name").val("")
            $("#Job_command_id").val("")
            $("#Job_command_id_input").val("")
            $("#Command_command").val("")
            $("#Command_parser_id").select2("val", "")
            $("#Job_machine_id").val("")
            $("#Job_machine_id_input").val("")
            $("#Job_sudoer").val("root")
            $("#Job_timeout").val("1440")
            $("#Job_failed_repeat").val("0")
            $("#Job_crucial_0").removeAttr("checked")
            $("#Job_crucial_1").attr("checked", true)
            $("#ut-command-fields input[type=text]").val("")
            $("#ut-command-fields input").removeAttr("checked")
            $("#ut-command-fields textarea").val("")
            $("#Command_mode").val(0)
            $("#Job_command_id option[owner='other']").remove()
            $("#search").val("")
            $("#query-result").text("")
            $("#selected-case").text("")
            $("#ci-command-fields input[type=text]").val("")
            $("#ci-command-fields input").removeAttr("checked")
            $("#ci-config-input").val("")
            $("#ci-config-newname").val("")
            $("#ci-config-filename").html("")
            $("#ci-parser").select2("val", "")
            $("a.ci-config-edit").hide()
            $("input.select2-input.select2-default").width("100%") //fix select2 bug: placeholder display part
        }
    }
}()

$(document).ready(function(){
    jobForm.init()
})
