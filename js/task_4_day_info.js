var Filtr = function() {
    this.data = getDataFromServer()

    this.test = true;
    this.practice = true;
    this.lecture = true;
    this.controlTask = true;
    this.notices = true;
    this.searchFieldValue = '';
}

Filtr.prototype.copyMap = function(map = new Map()){
    let copyMap = new Map();
    map.forEach(function(day, numDay, m){
        copyMap.set(Number(numDay), new Map([
            ['unread_notifications', new Map()],
            ['deadline_tasks', new Map()],
            ['test_tasks', new Map()]
        ]));
        day.forEach(function (tasks, type, m){
            tasks.forEach(function(task, numTask, m ){
                copyMap.get(numDay).get(type).set(Number(numTask), new Map());
                task.forEach(function(data, id, m){
                    copyMap.get(numDay).get(type).get(numTask).set(String(id),data);
                });
            })
        });
    });
    return copyMap;
}

Filtr.prototype.getFilteringData = function() {
    var filteringData = this.copyMap(this.data);
    if(this.test && this.practice && this.lecture && this.controlTask && this.notices)
        return filteringData;

    if(!this.test){
        for (const [day, el] of filteringData){//день
            for (const [type, tasks] of el){  // тип индикатора(задание)
                for (const [key, task] of tasks) {
                    if(task.get('type').toLowerCase() == 'тест')
                        tasks.delete(key);
                }
            }                 
        }
    }

    if(!this.practice){
        for (const [day, el] of filteringData){//день
            for (const [type, tasks] of el){  // тип индикатора(задание)
                for (const [key, task] of tasks) {
                    if(task.get('type').toLowerCase() == 'практика')
                        tasks.delete(key);
                }
            }                 
        }
    }

    if(!this.lecture){
        for (const [day, el] of filteringData){//день
            for (const [type, tasks] of el){  // тип индикатора(задание)
                for (const [key, task] of tasks) {
                    if(task.get('type').toLowerCase() == 'лекция')
                        tasks.delete(key);
                }
            }                 
        }
    }

    if(!this.controlTask){
        for (const [day, el] of filteringData){//день
            for (const [type, tasks] of el){  // тип индикатора(задание)
                for (const [key, task] of tasks) {
                    if(task.get('type').toLowerCase() == 'контрольное задание')
                        tasks.delete(key);
                }
            }                 
        }
    }

    if(!this.notices){
        for (const [day, el] of filteringData){//день
            for (const [type, tasks] of el){  // тип индикатора(задание)
                for (const [key, task] of tasks) {
                    if(task.get('type').toLowerCase() == 'уведомление')
                        tasks.delete(key);
                }
            }                 
        }
    }

    return filteringData;
}

function hideSelectedMark(){
    var i = 0;
    while (i < 42){
        el = document.getElementById(i.toString());
        el.classList.add('memsui--selected-mark_hidden');
        i++ 
    }
}

function getSelectedDay(i, m, y){
    var firstDayOfMonth = new Date(y, m, 7).getDay(), 
    lastDayOfLastMonth = m == 0 ? new Date(y-1, 11, 0).getDate() : new Date(y, m, 0).getDate();
    var dow = new Date(y, m, 1).getDay();
    if ( dow == 1 ) 
        startDate = new Date(y, m, 1);
    else {
        if (c.getCurrentMonth() == 0 )
            startDate = new Date(y-1, 11, lastDayOfLastMonth - firstDayOfMonth+1);
        else 
            startDate = new Date(y, m-1, lastDayOfLastMonth - firstDayOfMonth+1);
    }   
    
    return startDate.setDate(startDate.getDate() + i);
}

function showTasksOfSelectedDays (id = [], data = Map(), m, y, searchValue = ''){
    if (id.length == 1){
        hideSelectedMark();
        dayName = new Intl.DateTimeFormat("RU", { weekday: "long" }).format(getSelectedDay(Number(id[0]), m, y));
        document.getElementsByClassName('memsui--day-info__current-day')[0].textContent = dayName;
        el = document.getElementById(id[0]);
        el.classList.remove('memsui--selected-mark_hidden');
        var html = '<div class="memsui--tasks-colletcions__day-container">', i = 1;
        daydata = data.get(Number(id[0]));
        daydata.forEach(element => {
            element.forEach(task =>{
                if(searchValue == task.get('type') || searchValue == ''){
                    active = i == 1 ? 'memsui--tasks-colletcions__element_active' : '';
                    if(task.size == 3){
                        html += '<div onclick="handlingEvents(event)" class="memsui--tasks-colletcions__element '+active+'">'+
                                '<div class="memsui--tasks-colletcions__information memsui--tasks-colletcions__information_justify-content_flex-start">'+
                                '<div class="memsui--tasks-colletcions__type">'+task.get('type')+'</div></div>'+
                                '<div class="memsui--tasks-colletcions__additional-Information">'+
                                    task.get('course_name')+'. '+task.get('teacher')+
                                '</div></div>';
                        i++;
                    }else{
                        html += '<div onclick="handlingEvents(event)" class="memsui--tasks-colletcions__element '+active+'">'+
                                '<div class="memsui--tasks-colletcions__information">'+
                                '<div class="memsui--tasks-colletcions__type">'+task.get('type')+'</div>'+
                                '<div class="memsui--tasks-colletcions__expiration-date">'+task.get('expiration-date')+'</div></div>'+
                                '<div class="memsui--tasks-colletcions__additional-Information">'+
                                task.get('course_name')+'. '+task.get('title_of_task')+
                                '</div></div>';
                        i++;
                    }
                }
            });
        });
        html += '</div>'
    } else {
        hideSelectedMark();
        var dates = [];
        id.forEach(identifier =>{
            el = document.getElementById(identifier);
            el.classList.remove('memsui--selected-mark_hidden');
            dates.push(getSelectedDay(Number(identifier), m, y));
        });
        currentDayText = new Intl.DateTimeFormat("RU", { day: '2-digit', month: "2-digit" }).format(dates[0]) + '-' + 
        new Intl.DateTimeFormat("RU", { day: '2-digit', month: "2-digit" }).format(dates[dates.length-1]);

        document.getElementsByClassName('memsui--day-info__current-day')[0].textContent = currentDayText;
        var html = '';

        id.forEach(function callback(value, index) {
            dateText = new Intl.DateTimeFormat("RU", { day: '2-digit', month: "long" }).format(dates[index]);
            if(searchValue.toLowerCase() == dateText.toLowerCase() || searchValue == ''){
                html += '<div class="memsui--tasks-colletcions__multiple-day-container">';
                html += '<div onclick="handlingEvents(event)" class="memsui--tasks-colletcions__multiple-day-item">'+
                        '<div class="memsui--tasks-colletcions__text">'+
                        '<div class="memsui--tasks-colletcions__date">'+dateText+'</div>'+
                        '<div class="memsui--tasks-colletcions__button-show">'+
                        '<div class="memsui--tasks-colletcions__line-horizontal"></div>'+
                        '<div class="memsui--tasks-colletcions__line-vertical"></div></div>'+
                        '<div class="memsui--tasks-colletcions__button-hide">'+
                        '<div class="memsui--tasks-colletcions__line-horizontal"></div>'+
                        '</div></div></div>';
                daydata = data.get(Number(value));
                daydata.forEach(element => {
                    element.forEach(task =>{
                        if(task.size == 3){
                            html += '<div class="memsui--tasks-colletcions__element memsui--tasks-colletcions__element_active memsui--tasks-colletcions__element_hidden">'+
                                    '<div class="memsui--tasks-colletcions__information memsui--tasks-colletcions__information_justify-content_flex-start">'+
                                    '<div class="memsui--tasks-colletcions__type">'+task.get('type')+'</div></div>'+
                                    '<div class="memsui--tasks-colletcions__additional-Information">'+
                                        task.get('course_name')+'. '+task.get('teacher')+
                                    '</div></div>';
                            i++;
                        }else{
                            html += '<div class="memsui--tasks-colletcions__element memsui--tasks-colletcions__element_active memsui--tasks-colletcions__element_hidden">'+
                                    '<div class="memsui--tasks-colletcions__information">'+
                                    '<div class="memsui--tasks-colletcions__type">'+task.get('type')+'</div>'+
                                    '<div class="memsui--tasks-colletcions__expiration-date">'+task.get('expiration-date')+'</div></div>'+
                                    '<div class="memsui--tasks-colletcions__additional-Information">'+
                                    task.get('course_name')+'. '+task.get('title_of_task')+
                                    '</div></div>';
                            i++;
                        }
                    });
                });
                html += '</div>';
            }
        });
        
    }
    document.getElementsByClassName('scroll-content')[0].innerHTML = html;
}