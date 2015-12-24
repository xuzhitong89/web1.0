var QueryBuilder = (function() {
    
    return function(id, options){
        var _id, _tables, _panel, _cTable, _action, _queryListUrl, _createQueryUrl, _updateQueryUrl, _deleteQueryUrl
        
        this.action = function() {
            
        },
        
        this.getId = function() {
            return _id
        },
        
        this.setId = function(id) {
            _id = id
        },
        
        this.getTables = function(){
            return _tables
        }
        
        this.setTables = function(tables){
            _tables = tables
        }
        
        this.getPanel = function(){
            return _panel
        }
        
        this.setPanel = function(panel){
            _panel = panel
        }
        
        this.getCTable = function() {
            return _cTable
        }
        
        this.setCTable = function(cTable) {
            _cTable = cTable
        }
        
        this.getAction = function() {
            return _action
        }
        
        this.setAction = function(action) {
            _action = action
        }
        
        this.getQueryListUrl = function(url) {
            return _queryListUrl
        }
        
        this.setQueryListUrl = function(url) {
            _queryListUrl = url
        }
        
        this.getCreateQueryUrl = function(url) {
            return _createQueryUrl
        }
        
        this.setCreateQueryUrl = function(url) {
            _createQueryUrl = url
        }
        
        this.getUpdateQueryUrl = function(url) {
            return _updateQueryUrl
        }
        
        this.setUpdateQueryUrl = function(url) {
            _updateQueryUrl = url
        }        
        
        this.getDeleteQueryUrl = function(url) {
            return _deleteQueryUrl
        }
        
        this.setDeleteQueryUrl = function(url) {
            _deleteQueryUrl = url
        }        
        this.init(id, options)
    }
})()

QueryBuilder.Component = {
    SYNTAX_PATTERN: /^@[a-zA-Z0-9_]* ([a-zA-Z0-9_]*:\([^:]*\)[ |]+)*[a-zA-Z0-9_]*:\([^:]*\)$/,
    SPLIT_GROUP_PATTERN: /([^ |]*:\([^:]*\)([ |]?))/g,
    TABLE_PATTERN: /^@([a-zA-Z0-9_]*) .*/,
    
    getValStr: function(operator, val) {
        var str = val
        if(operator != "") {
            str = operator + "{" + str + "}"
        }
        return str
    },
    
    getLogicStr: function(logic) {
        var str = ' '
        if('OR' == logic) {
            str = '|'
        }
        return str
    },
    
    getLogicFlag: function(str) {
        var logic = 'AND'
        if('|' == str) {
            logic = 'OR'
        }
        return logic
    },
    
    trim: function(str) {
        return str.replace(/(^[\s\|]*)|([\s\|]*$)/g,'')
    },
    
    getTableByStr: function(str) {
        if(str.match(this.SYNTAX_PATTERN)) {
            str = str.match(this.TABLE_PATTERN)
        }
        return str[1]
    },
    
    getConArrByStr: function(str) {
        var conditions = new Array()
        if(str.match(this.SYNTAX_PATTERN)) {
            var groups = str.match(this.SPLIT_GROUP_PATTERN)
            $(groups).each(function(i, el){
                var arr = el.match(/(.*):\((.*)\)([| ]?)/)
                var field = arr[1]
                var logic = QueryBuilder.Component.getLogicFlag(arr[3])
                
                var valArr = arr[2].match(/(.{1,2})\{(.*)\}/)
                var val = arr[2]
                var operator = ''
                if(valArr) {
                    operator = valArr[1]
                    val = valArr[2]
                }
                conditions.push([field, operator, val, logic])
            })
        } else {
            conditions = [['name', '=', str]]
        }
        return conditions
    }
}

QueryBuilder.prototype = {
    confirmDeleteQuery: '是否删除搜索',
    confirmUpdateQuery: '是否修改搜索',
    saveQueryLabel: '给保存的搜索命名',
    emptyTitleError: '搜索名称不能为空',

    options: {
        qb: this,
        tables: [],
        cTable: '',
        action: '',
        queryListUrl: '',
        createQueryUrl: '',
        updateQueryUrl: '',
        deleteQueryUrl: '',
        keyClick: function(queryStr) {
            location.href = queryStr
        },
        btnClick: function(queryStr) {
            location.href = queryStr
        },
        queryClick: function(queryStr) {
            location.href = queryStr
        },
        reset: function() {
            var table = $(this.qb.getPanel()).find("select[name=table]").val()
            location.href = this.qb.getAction().replace(/\#table\#/, table)
        }
    },

    init: function(id, options) {
        var qb = this
        this.options.qb = this
        this.options = $.extend({}, this.options, options)
        this.setTables({})
        this.setPanel($("#" + id).next().next(".qb-search-panel"))
        this.setId(id)
        this.setCTable(this.options.cTable)
        this.setAction(this.options.action)
        this.setQueryListUrl(this.options.queryListUrl)
        this.setCreateQueryUrl(this.options.createQueryUrl)
        this.setUpdateQueryUrl(this.options.updateQueryUrl)
        this.setDeleteQueryUrl(this.options.deleteQueryUrl)
        
        for(var name in this.options.tables) {
            var tableOpt = this.options.tables[name]
            var table = new Table(name, tableOpt)
            this.addTable(table)
        }
        
        var q = location.href.match(/(\/|\&|\?)q(\=|\/)([^\/\&]*)/)
        if(q) {
            $("#" + id).val(decodeURIComponent(q[3]))
        }
        
        $(this.getPanel()).find(".reset-query").click(function(){
            $("#" + qb.getId()).val("")
            qb.options.reset()
            $(this).parents(".qb-search-panel").find(".qb-search-panel-x").click()
        })
        
        this.setTableOpts()
        this.paint(false)
        this.fillQueryList()
        this.saveQueryList()
        this.run()
    },
    
    paint: function(fillData) {
        $(this.getPanel()).find(".condition").remove()

        if(!fillData) {
            var str = $("#" + this.getId()).val()
            var table = QueryBuilder.Component.getTableByStr(str)
            $(this.getPanel()).find("select[name=table]").val(table)
        
            var conditions = QueryBuilder.Component.getConArrByStr(str)
            for(var i = conditions.length; i > 0; i--) {
                this.newItem($(this.getPanel()).find(".table-list"), conditions[i-1][0],
                    conditions[i-1][1], conditions[i-1][2], conditions[i-1][3])
            }
        } else {
            this.newItem($(this.getPanel()).find(".table-list"), 'name')
        }
        
        var qb = this
        $(this.getPanel()).find("select[name=table]").change(function(){
            qb.paint(true)
        })
    },
    
    setTableOpts: function(){
        for(var i in this.getTables()) {
            var table = this.getTables()[i]
            $(this.getPanel()).find("select[name=table]").append("<option value=\"" 
                + table.getName() + "\">" + table.getLabel() + "</option>")
        }
        
        $(this.getPanel()).find("select[name=table]").val(this.getCTable())
    },

    addTable: function(table) {
        var tables = this.getTables()
        tables[table.getName()] = table
        this.setTables(tables)
    },
    
    getCurrentTable: function() {
        var i = $(this.getPanel()).find("select[name=table]").val()
        if(null == i) {
            i = this.getCTable()
            $(this.getPanel()).find("select[name=table]").val(i)
        }
        return this.getTables()[i]
    },
    
    newItem: function(pos) {
        var cTable = this.getCurrentTable()
        $(pos).after(cTable.getFieldList())
        if(arguments[1])
            $(pos).next().find(".field").val(arguments[1])
        var i = $(pos).next().find(".field").val()
        var cItem = cTable.getItems()[i]
        
        cItem.replaceTo($(pos).next().find(".field"), this, 
            arguments[2], arguments[3], arguments[4])
    },
    
    run: function() {
        var qb = this
        $("#" + this.getId()).parent().css("white-space", "nowrap")
        $("#" + this.getId()).next(".qb-search-btn").click(function(){
            qb.paint(false)
            $(this).next(".qb-search-panel").show()
            if("0px" == $(this).next().css("right")) {
                qbRight = $(this).prev().offset().left + $(this).prev().width()
                panelRight= $(this).next().offset().left + $(this).next().width()
                right = (panelRight - qbRight)/2 + "px"
                $(this).next().css("right", right)
            }
            $(this).addClass("nobg")
        })
        
        $("#" + this.getId()).focus(function(){
            $(this).next().next().children(".qb-search-panel-x").click()
            $(document).keydown(function(event){ 
                if(13 == event.keyCode) {
                    var str = $("#" + qb.getId()).val()
                    if('' != str) {
                        var table = $(qb.getPanel()).find("select[name=table]").val()
                        str = qb.getAction().replace(/\#table\#/, table) + "/q/" + str
                    } else {
                        str = qb.getAction().replace(/\#table\#/, qb.getCTable())
                    } 
                    qb.options.keyClick(str)
                }
            })
        })
        
        divBlur(".qb-search-panel", function(event, obj){
            if($(".qb-search-panel").css("display") != "none"
                && !$(event.target).hasClass("qb-search-btn")
                && !$(event.target).parents().hasClass("ui-dialog")
                && !$(event.target).hasClass("ui-dialog")
                && !$(event.target).hasClass("ui-widget-overlay")) {
                $(obj).children(".qb-search-panel-x").click()
            }
        })
    
        $("#" + this.getId()).next().next(".qb-search-panel").find(".qb-search-panel-x").click(function(){
            $(this).parent(".qb-search-panel").hide()
            $(this).parent().prev(".qb-search-btn").removeClass("nobg")
        })
        
        $("#" + this.getId()).next().next(".qb-search-panel").find(".search-btn").click(function(){
            var table = $(qb.getPanel()).find("select[name=table]").val()
            var str = qb.getQueryStr()
            $("#" + qb.getId()).val(str)
            str = qb.getAction().replace(/\#table\#/, table) + "/q/" + str
            qb.options.btnClick(str)
            $(this).parents(".qb-search-panel").find(".qb-search-panel-x").click()
        })
    },
    
    saveQueryList: function() {
        var qb = this
        $(this.getPanel()).next(".save-query-dialog").dialog({
            modal: true,
            resizable: false,
            title: qb.saveQueryLabel,
            position: ['center', 130],
            autoOpen: false
        })
        
        $(this.getPanel()).find(".save-query").click(function(){
            $(".dialog-error").hide()
            $(".query-title").val("")
            if($(".query-list .current a").text()) {
                $(".query-title").val($(".query-list .current a").text())
            }
            $(".save-query-dialog .save").removeAttr("disabled")
            $(".save-query-dialog").dialog("open")
        })
        
        $(".save-query-dialog .save").click(function(){
            var dialog = $(this).parents(".save-query-dialog")
            if(!$(this).parent().prev("input").val()) {
                $(this).parent().prevAll(".dialog-error").text(qb.emptyTitleError)
                $(this).parent().prevAll(".dialog-error").show()
                return
            } else {
                var title = $(this).parent().prev("input").val()
                var data = {
                    "Query[title]": title,
                    "Query[query_str]": qb.getQueryStr(),
                    "Query[table]":  $(qb.getPanel()).find("select[name=table]").val()
                }
                
                var updateFlag = false
                $(".query").each(function(i, el){
                    if($(el).children("a").text() == title) {
                        updateFlag = true
                    }
                })
                url = qb.getCreateQueryUrl()
                if(updateFlag) {
                    if(confirm(qb.confirmUpdateQuery + " " + title)) {
                        url = qb.getUpdateQueryUrl()
                    } else {
                        return
                    }
                }
                $.getJSON(url, data, function(response){
                    if(response.status) {
                        $(dialog).find(".save").attr("disabled", "disabled")
                        qb.fillQueryList()
                        dialog.dialog("close")
                    } else {
                        $(dialog).find(".dialog-error").text(response.error)
                        $(dialog).find(".dialog-error").show()
                    }
                })
            }
        })
        
        $(".save-query-dialog .cancel").click(function(){
            $(".save-query-dialog").dialog("close")
        })
    },
    
    getQueryStr: function() {
        var table = $(this.getPanel()).find("select[name=table]").val()
        var str  = "@" + table + " "
        $(this.getPanel()).find(".condition").each(function(i, el){
            str += $(el).find(".field").val() + ":("
                + QueryBuilder.Component.getValStr($(el).find(".operator").val(), $(el).find(".val").val())
                + ")"
                + QueryBuilder.Component.getLogicStr($(el).find(".logic").val()) 
        })
        return QueryBuilder.Component.trim(str)
    },
    
    fillQueryList: function() {
        var qb = this
        var table = $(qb.getPanel()).find("select[name=table]").val()
        var data = {table: table}
        $.getJSON(this.getQueryListUrl(), data, function(list){
            $(qb.getPanel()).find(".query").remove()
            var cookie_query_id = $.cookie("query-id")
            $(list).each(function(i, el){
                var clazz = "query"
                if(el.id == cookie_query_id) {
                    clazz += " current"
                    var cookieOption = {path: "/"}
                    $.cookie("query-id", "", cookieOption)
                }
                var url = qb.getAction().replace(/\#table\#/, table) + "/q/" + el.query_str
                $(qb.getPanel()).find(".query-list").append("<div class=\"" + clazz + "\"><a href=\"javascript:\" data-url=\"" + url + "\" title=\"" + el.title + "\">" 
                    + el.title + "</a><i class=\"delete-query\" data-query-id=\"" + el.id + "\"></i></div>")
            })
            
            $(".query a").click(function(){
                var id = $(this).next().attr("data-query-id")
                var cookieOption = {path: "/"}
                $.cookie("query-id", id, cookieOption)
                var q = $(this).attr("data-url").match(/(\/|\&|\?)q(\=|\/)([^\/\&]*)/)
                if(q) {
                    $("#" + qb.getId()).val(decodeURIComponent(q[3]))
                }  else {
                    $("#" + qb.getId()).val("")
                }
                qb.options.queryClick($(this).attr("data-url"))
                $(this).parents(".qb-search-panel").find(".qb-search-panel-x").click()
            })
            
            $(".query .delete-query").click(function(){
                if(!confirm(qb.confirmDeleteQuery + " " + $(this).prev("a").text())) {
                    return
                }
                var data = {id: $(this).attr("data-query-id")}
                var cQuery = this
                $.getJSON(qb.getDeleteQueryUrl(), data, function(response){
                    if(response.status) {
                        $(cQuery).parent(".query").remove()
                    }
                })
            })
        })
    }
}

var Table = (function() {
    
    return function(name, opt) {
        var _name, _label, _items
        
        this.getName = function() {
            return _name
        }
        
        this.setName = function(name) {
            _name = name
        }
        
        this.getLabel = function() {
            return _label
        }
        
        this.setLabel = function(label) {
            _label = label
        }
        
        this.getItems = function() {
            return _items
        }
        
        this.setItems = function(items) {
            _items = items
        }
        
        this.init(name, opt)
    }
})()

Table.prototype = {
    init: function(name, tableOpt) {
        this.setName(name)
        this.setLabel(tableOpt.label)
        this.setItems({})

        for(var field in tableOpt.items) {
            var opt = {
                "label": "", 
                "opeartors": {}, 
                "type": "text", 
                "data": {}, 
                "bind": {}
            }
            var itemOpt = $.extend(opt, tableOpt.items[field])
            var item = new Item(field, itemOpt.label, itemOpt.operators,
                itemOpt.type, itemOpt.data, itemOpt.bind)
            this.addItem(item)
        }
    },
    
    addItem: function(item) {
        var items = this.getItems()
        items[item.getField()] = item
        this.setItems(items)
    },
    
    getFieldList: function() {
        var html = "<div class=\"item condition\"><select class=\"field\">"
        for(var i in this.getItems()){
            var el = this.getItems()[i]
            html += "<option value=\"" + el.getField() + "\">" + el.getLabel() + "</option>" 
        }
        html += "</select>"
        + "</div>"
        return html
    }
}

var Item = (function() {
    
    return function(field, label, operators, type, data, bind) {
        var _field, _label, _operators, _type, _data, _bind
        
        this.getField = function() {
            return _field
        }
        
        this.setField = function(field) {
            _field = field
        }
        
        this.getLabel = function() {
            return _label
        }
        
        this.setLabel = function(label) {
            _label = label
        }
        
        this.getOperators = function() {
            return _operators
        }
        
        this.setOperators = function(operators) {
            _operators = operators
        }
        
        this.getType = function() {
            return _type
        }
        
        this.setType = function(type) {
            _type = type
        }
    
        this.getData = function() {
            return _data
        }
        
        this.setData = function(data) {
            _data = data
        }
        
        this.getBind = function() {
            return _bind
        }
        
        this.setBind = function(bind) {
            _bind = bind
        }
        
        this.init(field, label, operators, type, data, bind)
    }
})()

Item.prototype = {
    init: function(field, label, operators, type, data, bind) {
        this.setField(field)
        this.setLabel(label)
        this.setOperators(operators)
        this.setType(type)
        this.setData(data)
        this.setBind(bind)
    },
    
    getOperatorList: function() {
        html = "<select class=\"operator\">"
        operators = this.getOperators()
        for(var operator in operators){
            html += "<option value=\"" + operator + "\">" 
            + operators[operator] + "</option>"
        }
        html += "</select>"
        return html
    },
    
    getValHtml: function() {
        if(this.getType() == 'text')
            html = "<input class=\"val\" type=\"text\" />"
        else {
            html = "<select class=\"val\">"
            if(typeof this.getData() == "object" && typeof this.getData().length == "number") {
                $(this.getData()).each(function(i, el){
                    html += "<option value=\"" + i + "\">" 
                    + el + "</option>"
                })
            } else {
                for(var i in this.getData()) {
                    var label = this.getData()[i]
                    html += "<option value=\"" + i + "\">" 
                    + label + "</option>"
                } 
            }
            html += "</select>"
        }
        return html
    },
    
    getLogicHtml: function() {
        html = "<select class=\"logic\"><option value=\"AND\">并且</option>"
        + "<option value=\"OR\">或者</option></select>"
        return html
    },
    
    getActionHtml: function() {
        html = "<i class=\"add\"></i><i class=\"del\"></i>"
        return html
    },
    
    replaceTo: function(pos, qb) {
        $(pos).nextAll(".operator").remove()
        $(pos).nextAll(".val").remove()
        $(pos).nextAll(".logic").remove()
        $(pos).nextAll(".add").remove()
        $(pos).nextAll(".del").remove()
        
        $(pos).after(this.getActionHtml())
        $(pos).after(this.getLogicHtml())
        $(pos).after(this.getValHtml())
        $(pos).after(this.getOperatorList())
        
        if(arguments[2])
            $(pos).nextAll(".operator").val(arguments[2])
        if(arguments[3])
            $(pos).nextAll(".val").val(arguments[3])
        if(arguments[4])
            $(pos).nextAll(".logic").val(arguments[4])
        
        $(pos).nextAll(".add").click(function(){
            qb.newItem($(this).parents(".item"))
        })
        $(pos).nextAll(".del").click(function(){
            if($(".condition").size() > 1) {
                $(this).parents(".item").remove()
            } else {
                $(this).prevAll(".val").val("")
                $(this).parents(".qb-search-panel").prevAll(".qb-search").val("")
            }
        })
        
        $(pos).unbind("change")
        $(pos).change(function(){
            var cItem = qb.getCurrentTable().getItems()[$(this).val()]
            cItem.replaceTo(pos, qb,
                $(this).nextAll(".operator").val(),
                $(this).nextAll(".val").val(), 
                $(this).nextAll(".logic").val())
        })

        for(var type in this.getBind()) {
            var func = this.getBind()[type]
            $(pos).nextAll(".val").bind(type, func)
        }
    }
}

var divBlur = function(obj, func) {
    $(obj).click(function(event){
        event.stopPropagation()
    })
    $(document).click(function(event){
        func(event, obj)
    })
}