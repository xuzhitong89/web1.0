(function($) {
    $.fn.extend({
        tip: {
            NoCron: "Not set CronTime",
            Minute: "Minute ",
            Hour: "Hour ",
            Day: "Day ",
            Month: "Month ",
            Week: "Week ",
            Every: "Every ",
            NotSupport: "Not Support ",
            Empty: "can not be empty.",
            And: " And "
        },
        initial: function(dlg_id) {
            var $this = this;
            this.on("click", function(){
                //init component data
                $this._parse();
                $this._validate();
                $("input[role^='every_']").removeClass("active");
                $("#" + dlg_id).dialog("open");
            });
        },
        setval: function() {
            if(this._validate() == true)
            {
                var minute = $("input[role='input_minute']").val();
                var hour = $("input[role='input_hour']").val();
                var day = $("input[role='input_day']").val();
                var month = $("input[role='input_month']").val();
                var week = $("input[role='input_week']").val();
                this.val($.trim(minute + " " + hour + " " + day + " " + month + " " + week));
                return true;
            }
            return false;
        },
        _parse: function() {
            var cronText = this.val();
            var part = cronText.split(/\s+/);
            if(part.length != 5)
                part = ['', '', '', '', ''];
            
            $("input[role='input_minute']").val(part[0]);
            $("input[role='input_hour']").val(part[1]);
            $("input[role='input_day']").val(part[2]);
            $("input[role='input_month']").val(part[3]);
            $("input[role='input_week']").val(part[4]);
        },
        _validate: function() {
            $("input[role^='input_']").removeClass("error");

            var minute = $("input[role='input_minute']").val();
            var hour = $("input[role='input_hour']").val();
            var day = $("input[role='input_day']").val();
            var month = $("input[role='input_month']").val();
            var week = $("input[role='input_week']").val();
            
            var tip = this.tip.NoCron;
            var res = true;
            if(minute != "" || hour != "" || day != "" || month != "" || week != "")
            {
                // pattern: 3 parts, part 1: */n; part 2: a,b,c; part 3: i-j/n
                
                var isset = function(value){return (typeof value != "undefined") && (value !== "")};
                tip = '';
                var dayFlag = false;
                // Minute Part Check
                var minutePattern = /^(((?:(?:[0-9]|[1-5][0-9]),)*(?:[0-9]|[1-5][0-9]))|([0-9]|[1-5][0-9])-([0-9]|[1-5][0-9])(?:\/([1-2][0-9]|30))?)$/;
                var minuteMatch = minute.match(minutePattern);
                if(minuteMatch === null || (isset(minuteMatch[5]) && minuteMatch[5] >= minuteMatch[6]))
                {
                    $("input[role='input_minute']").addClass("error");
                    res = false;
                    if(minute == "")
                        tip += this.tip.Minute + this.tip.Empty + "<br />";
                    else
                        tip += this.tip.Minute + this.tip.NotSupport + "\"" + minute + "\"<br />";
                }
                else
                {
                    var minuteTip = "";
                    if(isset(minuteMatch[2]))
                    {
                        minuteTip = minuteMatch[2] + " " + this.tip.Minute;
                    }
                    if(isset(minuteMatch[3]))
                    {
                        minuteTip = minuteMatch[3] + "-" + minuteMatch[4] + " " + this.tip.Minute;
                        if(isset(minuteMatch[5]))
                            minuteTip = minuteMatch[3] + "-" + minuteMatch[4] + " " + this.tip.Every + minuteMatch[5] + " " + this.tip.Minute;
                    }
                }

                // Hour Part Check
                var hourPattern = /^((\*)(?:\/([2-9]|1[0-2]))?|((?:(?:[0-9]|1[0-9]|2[0-3]),)*(?:[0-9]|1[0-9]|2[0-3]))|([0-9]|1[0-9]|2[0-3])-([0-9]|1[0-9]|2[0-3])(?:\/([2-9]|1[0-2]))?)$/;
                var hourMatch = hour.match(hourPattern);
                if(hourMatch === null || (isset(hourMatch[5]) && hourMatch[5] >= hourMatch[6]))
                {
                    $("input[role='input_hour']").addClass("error");
                    res = false;
                    if(hour == "")
                        tip += this.tip.Hour + this.tip.Empty + "<br />";
                    else
                        tip += this.tip.Hour + this.tip.NotSupport + "\"" + hour + "\"<br />";
                }   
                else
                {
                    var hourTip = "";
                    if(isset(hourMatch[2]))
                    {
                        hourTip = this.tip.Every + this.tip.Hour;
                        if(isset(hourMatch[3]))
                            hourTip = this.tip.Every + hourMatch[3] + " " + this.tip.Hour;
                    }
                    if(isset(hourMatch[4]))
                    {
                        hourTip = hourMatch[4] + " " + this.tip.Hour;
                    }
                    if(isset(hourMatch[5]))
                    {
                        hourTip = hourMatch[5] + "-" + hourMatch[6] + " " + this.tip.Hour;
                        if(isset(hourMatch[7]))
                            hourTip = hourMatch[5] + "-" + hourMatch[6] + " " + this.tip.Every + hourMatch[7] + " " + this.tip.Hour;
                    }
                }

                //Day Part Check
                var dayPattern = /^((\*)(?:\/([2-9]|1[0-5]))?|((?:(?:[1-9]|[1-2][0-9]|3[0-1]),)*(?:[1-9]|[1-2][0-9]|3[0-1]))|([1-9]|[1-2][0-9]|3[0-1])-([1-9]|[1-2][0-9]|3[0-1])(?:\/([2-9]|1[0-5]))?)$/;
                var dayMatch = day.match(dayPattern);
                if(dayMatch === null || (isset(dayMatch[5]) && dayMatch[5] >= dayMatch[6]))
                {
                    $("input[role='input_day']").addClass("error");
                    res = false;
                    if(day == "")
                        tip += this.tip.Day + this.tip.Empty + "<br />";
                    else
                        tip += this.tip.Day + this.tip.NotSupport + "\"" + day + "\"<br />";
                }   
                else
                    dayFlag = true;

                //Month Part Check
                var monthPattern = /^((\*)(?:\/([2-6]))?|((?:(?:[1-9]|1[0-2]),)*(?:[1-9]|1[0-2]))|([1-9]|1[0-2])-([1-9]|1[0-2])(?:\/([2-6]))?)$/;
                var monthMatch = month.match(monthPattern);
                if(monthMatch === null || (isset(monthMatch[5]) && monthMatch[5] >= monthMatch[6]))
                {
                    $("input[role='input_month']").addClass("error");
                    res = false;
                    if(month == "")
                        tip += this.tip.Month + this.tip.Empty + "<br />";
                    else
                        tip += this.tip.Month + this.tip.NotSupport + "\"" + month + "\"<br />";
                } 
                else
                {
                    var monthTip = "";
                    if(isset(monthMatch[2]))
                    {
                        monthTip = this.tip.Every + this.tip.Month;
                        if(isset(monthMatch[3]))
                            monthTip = this.tip.Every + monthMatch[3] + " " + this.tip.Month;
                    }
                    if(isset(monthMatch[4]))
                    {
                        monthTip = monthMatch[4] + " " + this.tip.Month;
                    }
                    if(isset(monthMatch[5]))
                    {
                        monthTip = monthMatch[5] + "-" + monthMatch[6] + " " + this.tip.Month;
                        if(isset(monthMatch[7]))
                            monthTip = monthMatch[5] + "-" + monthMatch[6] + " " + this.tip.Every + monthMatch[7] + " " + this.tip.Month;
                    }
                }

                // Week Part Check
                var weekPattern = /^((\*)(?:\/([2-3]))?|((?:[0-7],)*[0-7])|([0-7])-([0-7])(?:\/([2-3]))?)$/;
                var weekMatch = week.match(weekPattern);
                if(weekMatch === null || (isset(weekMatch[5]) && weekMatch[5] >= weekMatch[6]))
                {
                    $("input[role='input_week']").addClass("error");
                    res = false;
                    if(week == "")
                        tip += this.tip.Week + this.tip.Empty + "<br />";
                    else
                        tip += this.tip.Week + this.tip.NotSupport + "\"" + week + "\"<br />";
                    dayFlag = false;
                }
                else
                    dayFlag = dayFlag && true;
                
                if(dayFlag)
                {
                    var dayTip = "";
                    if(isset(dayMatch[2]) && !isset(dayMatch[3]) && isset(weekMatch[2]) && !isset(weekMatch[3]))
                    {
                        dayTip = this.tip.Every + this.tip.Day;
                    }
                    else
                    {
                        //day of month part
                        var dayStr = "";
                        if(isset(dayMatch[2]) && isset(dayMatch[3]))
                        {
                            dayStr = this.tip.Every + " " + dayMatch[3] + " " + this.tip.Day;
                        }
                        if(isset(dayMatch[4]))
                        {
                            dayStr = dayMatch[4] + " " + this.tip.Day;
                        }
                        if(isset(dayMatch[5]))
                        {
                            dayStr = dayMatch[5] + "-" + dayMatch[6] + " " + this.tip.Day;
                            if(isset(dayMatch[7]))
                                dayStr = dayMatch[5] + "-" + dayMatch[6] + " " + this.tip.Every + " " + dayMatch[7] + " " + this.tip.Day;
                        }
                        
                        //day of week part
                        var weekStr = "";
                        var first = 0;
                        var second = 0;
                        var step = 1;
                        if(isset(weekMatch[2]) && isset(weekMatch[3]))
                        {
                            second = 6;
                            step = weekMatch[3];
                            weekStr = join(",", range(first, second, step));
                        }
                        if(isset(weekMatch[4]))
                        {
                            weekStr = weekMatch[4];
                        }
                        if(isset(weekMatch[5]))
                        {
                            first = weekMatch[5];
                            second = weekMatch[6];
                            step = 1;
                            if(isset(weekMatch[7]))
                                step = weekMatch[7];
                            weekStr = join(",", range(first, second, step));
                        }
                        if(weekStr)
                            weekStr = this.tip.Every + this.tip.Week + " " + weekStr;
                        
                        if(dayStr && weekStr)
                            dayTip = dayStr + this.tip.And + weekStr;
                        else
                            dayTip = dayStr + weekStr;
                    }
                }
                
                if(res)
                {
                    tip = monthTip + "; " + dayTip + "; " + hourTip + "; " + minuteTip;
                }
            }
            $("div.cron-tip").html(tip);
            
            return res;
        }
    });

    $("input[role='every_hour']").on('click', function(){
        var minute = Math.round(Math.random() * 59);
        $("input[role='input_minute']").val(minute);
        $("input[role='input_hour']").val("*");
        $("input[role='input_day']").val("*");
        $("input[role='input_month']").val("*");
        $("input[role='input_week']").val("*");
    })
    $("input[role='every_day']").on('click', function(){
        var minute = Math.round(Math.random() * 59);
        var hour = Math.round(Math.random() * 8);
        $("input[role='input_minute']").val(minute);
        $("input[role='input_hour']").val(hour);
        $("input[role='input_day']").val("*");
        $("input[role='input_month']").val("*");
        $("input[role='input_week']").val("*");
    })
    $("input[role='every_week']").on('click', function(){
        var minute = Math.round(Math.random() * 59);
        var hour = Math.round(Math.random() * 8);
        $("input[role='input_minute']").val(minute);
        $("input[role='input_hour']").val(hour);
        $("input[role='input_day']").val("*");
        $("input[role='input_month']").val("*");
        $("input[role='input_week']").val("0");
    })
    $("input[role='every_month']").on('click', function(){
        var minute = Math.round(Math.random() * 59);
        var hour = Math.round(Math.random() * 8);
        $("input[role='input_minute']").val(minute);
        $("input[role='input_hour']").val(hour);
        $("input[role='input_day']").val("1");
        $("input[role='input_month']").val("*");
        $("input[role='input_week']").val("*");
    })
    
    $("input[role^='every_']").on('click', function(){
        $("input[role^='every_']").removeClass("active");
        $(this).addClass("active");
        $(this)._validate();
    })
    
    $("input[role^='input_']").on('change', function(){
        $("input[role^='every_']").removeClass("active");
        $(this)._validate();
    })
})(jQuery);
