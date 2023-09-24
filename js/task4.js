const flatpick = flatpickr("#weekSelector", {
    plugins: [
        new monthSelectPlugin({
          shorthand: false, //defaults to false
          dateFormat: "F Y", //defaults to "F Y"
          altFormat: "F Y", //defaults to "F Y"
          theme: "light" // defaults to "light"
        })
    ],
    defaultDate : "today",
    "locale" : "ru",
    altInput : true,
    clickOpens : false,
    "onChange": [changeDate()]
});	

var ids=[];

var Scrollbar = window.Scrollbar;
Scrollbar.init(document.getElementsByClassName('memsui--tasks-colletcions')[0],
                {'alwaysShowTracks' : true,
                 'overscrollEffectColor' : '#D6E3ED'});

var c = new Cal("memsui--days-panel");
var filtr = new Filtr();
//обработка изменении даты
function changeDate() {
    return function (date) {
        resizeWeekSelector();
        listOfTasksByDay = getDataFromServer();
        c.selectMonth(date[0].getMonth(), date[0].getFullYear(), listOfTasksByDay);
    };
}

function clearIdsToOneElement () {
    while (ids.length > 1)
        ids.pop();
}

function randomInteger(min, max) {
    // случайное число от min до (max+1)
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
  }

function generateData(){
    let data = new Map(),
    i = 0;
    while (i != 42) {
        var count_unread_notification = randomInteger(0, 12),
        count_deadline_task = randomInteger(0, 12),
        count_test_task = randomInteger(0, 12);
        data.set(i , new Map([
            ['unread_notifications', new Map()],
            ['deadline_tasks', new Map()],
            ['test_tasks', new Map()]
        ]));
        for (k = 0; k < count_unread_notification; k++) {
            if(randomInteger(1,2) == 1)
                data.get(i).get('unread_notifications').set(k, new Map([
                    ['type', 'Уведомление'],
                    ['course_name', 'YAYAYA'],
                    ['teacher', 'Иванов И.И.']
                ]));
            else
                data.get(i).get('unread_notifications').set(k, new Map([
                    ['type', 'Лекция'],
                    ['course_name', 'YAYAYA'],
                    ['title_of_task', 'YAYAYA'],
                    ['expiration-date', 'до 00.00.2023']

                ]));
        }
        for (k = 0; k < count_deadline_task; k++) {
                data.get(i).get('deadline_tasks').set(k, new Map([
                    ['type', 'Тест'],
                    ['course_name', 'YAYAYA'],
                    ['title_of_task', 'YAYAYA'],
                    ['expiration-date', 'до 00.00.2023']
                ]));
        }
        for (k = 0; k < count_test_task; k++) {
            data.get(i).get('test_tasks').set(k, new Map([
                ['type', 'Тест'],
                ['course_name', 'YAYAYA'],
                ['title_of_task', 'YAYAYA'],
                ['expiration-date', 'до 00.00.2023']
            ]));
        }
        i++;
    }
    return data;
}

function getDataFromServer(){
    //подготовка данных к отправке
    var firstDayOfMonth = new Date(c.getCurrentFullYear(), c.getCurrentMonth(), 7).getDay(), 
    lastDayOfLastMonth = c.getCurrentMonth() == 0 ? new Date(c.getCurrentFullYear()-1, 11, 0).getDate() : new Date(c.getCurrentFullYear(), c.getCurrentMonth(), 0).getDate();
    var dow = new Date(c.getCurrentFullYear(), c.getCurrentMonth(), 1).getDay();
    date = {
        startDate: new Date(),
        endDate: new Date()
    };
    if ( dow == 1 ) {
        date.startDate = new Date(c.getCurrentFullYear(), c.getCurrentMonth(), 1);
        date.endDate = new Date(c.getCurrentFullYear(), c.getCurrentMonth(), 1);
        date.endDate.setDate(date.endDate.getDate() + 41);
    } else {
        if (c.getCurrentMonth() == 0 ){
            date.startDate = new Date(c.getCurrentFullYear()-1, 11, lastDayOfLastMonth - firstDayOfMonth+1);
            date.endDate = new Date(c.getCurrentFullYear()-1, 11, lastDayOfLastMonth - firstDayOfMonth+1);
        } else {
            date.startDate = new Date(c.getCurrentFullYear(), c.getCurrentMonth()-1, lastDayOfLastMonth - firstDayOfMonth+1);
            date.endDate = new Date(c.getCurrentFullYear(), c.getCurrentMonth()-1, lastDayOfLastMonth - firstDayOfMonth+1);
        }
        date.endDate.setDate(date.endDate.getDate() + 41);
    }
    /*
    url = ''; 
    let response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(date)
    });
      
    let result = new Map(await response.json());
    
    let counts = [];
    result.forEach(function(value, key){
        counts.push(value);
    });
    */
   data = generateData();
   return data;
}

function showFiltr() {
    document.getElementsByClassName("memsui--filter")[0].style.display = "block";
    document.getElementsByClassName("memsui--legend-overlay")[0].style.display = "none";  
}
  
function hideFiltr() {
    document.getElementsByClassName("memsui--filter")[0].style.display = "none";
}

function showLegend() {
    document.getElementsByClassName("memsui--legend-overlay")[0].style.display = "block";
    document.getElementsByClassName("memsui--filter")[0].style.display = "none";
}

function hideLegend() {
    document.getElementsByClassName("memsui--legend-overlay")[0].style.display = "none";
}

buttonChange.onclick = function (e) {
    flatpick.open();
}

nextMonth.onclick = function (e) {
    let nextDate = flatpick.selectedDates[0];
    flatpick.setDate(nextDate.setMonth(nextDate.getMonth() + 1), true);
    resizeWeekSelector();
}

lastMonth.onclick = function (e) {
    let nextDate = flatpick.selectedDates[0];
    flatpick.setDate(nextDate.setMonth(nextDate.getMonth() - 1), true);
    resizeWeekSelector();
}

test.onclick = function (e) {
    if (filtr.test) {
        e.currentTarget.innerHTML = '<path d="M0.5 4C0.5 2.61929 1.61929 1.5 3 1.5H11C12.3807 1.5 13.5 2.61929 13.5 4V12C13.5 13.3807 12.3807 14.5 11 14.5H3C1.61929 14.5 0.5 13.3807 0.5 12V4Z" stroke="#D6E3ED"/>';
        filtr.test = false;
        c.showcurr(filtr.getFilteringData());
        showTasksOfSelectedDays(ids, filtr.getFilteringData(), c.currMonth,c.currYear);
    } else {
        e.currentTarget.innerHTML = '<path d="M0.5 4C0.5 2.61929 1.61929 1.5 3 1.5H11C12.3807 1.5 13.5 2.61929 13.5 4V12C13.5 13.3807 12.3807 14.5 11 14.5H3C1.61929 14.5 0.5 13.3807 0.5 12V4Z" stroke="#D6E3ED"/>'+
        '<path d="M18 1L7 12L2 7" stroke="#7B98AB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
        filtr.test = true;
        c.showcurr(filtr.getFilteringData());
        showTasksOfSelectedDays(ids, filtr.getFilteringData(), c.currMonth,c.currYear);
    }
}

practice.onclick = function (e) {
    if (filtr.practice) {
        e.currentTarget.innerHTML = '<path d="M0.5 4C0.5 2.61929 1.61929 1.5 3 1.5H11C12.3807 1.5 13.5 2.61929 13.5 4V12C13.5 13.3807 12.3807 14.5 11 14.5H3C1.61929 14.5 0.5 13.3807 0.5 12V4Z" stroke="#D6E3ED"/>';
        filtr.practice = false;
        c.showcurr(filtr.getFilteringData());
        showTasksOfSelectedDays(ids, filtr.getFilteringData(), c.currMonth,c.currYear);
    } else {
        e.currentTarget.innerHTML = '<path d="M0.5 4C0.5 2.61929 1.61929 1.5 3 1.5H11C12.3807 1.5 13.5 2.61929 13.5 4V12C13.5 13.3807 12.3807 14.5 11 14.5H3C1.61929 14.5 0.5 13.3807 0.5 12V4Z" stroke="#D6E3ED"/>'+
        '<path d="M18 1L7 12L2 7" stroke="#7B98AB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
        filtr.practice = true;
        c.showcurr(filtr.getFilteringData());
        showTasksOfSelectedDays(ids, filtr.getFilteringData(), c.currMonth,c.currYear);
    }
}

lecture.onclick = function (e) {
    if (filtr.lecture) {
        e.currentTarget.innerHTML = '<path d="M0.5 4C0.5 2.61929 1.61929 1.5 3 1.5H11C12.3807 1.5 13.5 2.61929 13.5 4V12C13.5 13.3807 12.3807 14.5 11 14.5H3C1.61929 14.5 0.5 13.3807 0.5 12V4Z" stroke="#D6E3ED"/>';
        filtr.lecture = false;
        c.showcurr(filtr.getFilteringData());
        showTasksOfSelectedDays(ids, filtr.getFilteringData(), c.currMonth,c.currYear);
    } else {
        e.currentTarget.innerHTML = '<path d="M0.5 4C0.5 2.61929 1.61929 1.5 3 1.5H11C12.3807 1.5 13.5 2.61929 13.5 4V12C13.5 13.3807 12.3807 14.5 11 14.5H3C1.61929 14.5 0.5 13.3807 0.5 12V4Z" stroke="#D6E3ED"/>'+
        '<path d="M18 1L7 12L2 7" stroke="#7B98AB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
        filtr.lecture = true;
        c.showcurr(filtr.getFilteringData());
        showTasksOfSelectedDays(ids, filtr.getFilteringData(), c.currMonth,c.currYear);
    }  
}

controlTask.onclick = function (e) {
    if (filtr.controlTask) {
        e.currentTarget.innerHTML = '<path d="M0.5 4C0.5 2.61929 1.61929 1.5 3 1.5H11C12.3807 1.5 13.5 2.61929 13.5 4V12C13.5 13.3807 12.3807 14.5 11 14.5H3C1.61929 14.5 0.5 13.3807 0.5 12V4Z" stroke="#D6E3ED"/>';
        filtr.controlTask = false;
        c.showcurr(filtr.getFilteringData());
        showTasksOfSelectedDays(ids, filtr.getFilteringData(), c.currMonth,c.currYear);
    } else {
        e.currentTarget.innerHTML = '<path d="M0.5 4C0.5 2.61929 1.61929 1.5 3 1.5H11C12.3807 1.5 13.5 2.61929 13.5 4V12C13.5 13.3807 12.3807 14.5 11 14.5H3C1.61929 14.5 0.5 13.3807 0.5 12V4Z" stroke="#D6E3ED"/>'+
        '<path d="M18 1L7 12L2 7" stroke="#7B98AB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
        filtr.controlTask = true;
        c.showcurr(filtr.getFilteringData());
        showTasksOfSelectedDays(ids, filtr.getFilteringData(), c.currMonth,c.currYear);
    } 
}

notices.onclick = function (e) {
    if (filtr.notices) {
        e.currentTarget.innerHTML = '<path d="M0.5 4C0.5 2.61929 1.61929 1.5 3 1.5H11C12.3807 1.5 13.5 2.61929 13.5 4V12C13.5 13.3807 12.3807 14.5 11 14.5H3C1.61929 14.5 0.5 13.3807 0.5 12V4Z" stroke="#D6E3ED"/>';
        filtr.notices = false;
        c.showcurr(filtr.getFilteringData());
        showTasksOfSelectedDays(ids, filtr.getFilteringData(), c.currMonth,c.currYear);
    } else {
        e.currentTarget.innerHTML = '<path d="M0.5 4C0.5 2.61929 1.61929 1.5 3 1.5H11C12.3807 1.5 13.5 2.61929 13.5 4V12C13.5 13.3807 12.3807 14.5 11 14.5H3C1.61929 14.5 0.5 13.3807 0.5 12V4Z" stroke="#D6E3ED"/>'+
        '<path d="M18 1L7 12L2 7" stroke="#7B98AB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
        filtr.notices = true;
        c.showcurr(filtr.getFilteringData());
        showTasksOfSelectedDays(ids, filtr.getFilteringData(), c.currMonth,c.currYear);
    } 
}

searchField.addEventListener('keydown', function(e) {
    if (e.keyCode === 13)
    showTasksOfSelectedDays(ids, filtr.getFilteringData(), c.currMonth,c.currYear, e.currentTarget.value);
});

searchButton.onclick = function (e){
    showTasksOfSelectedDays(ids, filtr.getFilteringData(), c.currMonth,c.currYear, e.currentTarget.parentElement.children[0].value);
}

window.onload = function (e) {
    resizeWeekSelector();
    // Начать календарь	
    c.showcurr(filtr.getFilteringData());
    el = document.getElementsByClassName('memsui--day-panel_active')[0];
    ids.push(el.id);
    showTasksOfSelectedDays(ids, filtr.getFilteringData(), c.currMonth,c.currYear);
}
//обработка событий
function handlingEvents(event) {
    if (event.currentTarget.classList[0] == 'memsui--day-panel') {
        if (event.ctrlKey || event.altKey) {
            clearIdsToOneElement();
            if (Number(ids[0]) < event.currentTarget.id) { 
                for (var i = 1; i <= event.currentTarget.id-Number(ids[0]); i++)
                    ids.push(Number(ids[0])+i);
            } else {
                for (var i = 1; i <= Number(ids[0])-event.currentTarget.id; i++)
                    ids.push(Number(ids[0])-i);
            }
            showTasksOfSelectedDays(ids, filtr.getFilteringData(), c.currMonth,c.currYear);
        } else {
            ids = [];
            ids.push(event.currentTarget.id);
            showTasksOfSelectedDays(ids, filtr.getFilteringData(), c.currMonth,c.currYear);
        }
    } else if(event.currentTarget.classList[0] == 'memsui--tasks-colletcions__multiple-day-item') {
        containerEl = event.currentTarget.parentElement;
        containerEl.classList.toggle('memsui--tasks-colletcions__multiple-day-item_active');
        for (let i = 1; i < containerEl.children.length; i++)
            containerEl.children[i].classList.toggle('memsui--tasks-colletcions__element_hidden');
    } else if(event.currentTarget.classList[0] == 'memsui--tasks-colletcions__element') {
        containerEl = event.currentTarget.parentElement;
        for (let childEl of containerEl.children)
            childEl.classList.remove('memsui--tasks-colletcions__element_active');
        event.currentTarget.classList.add('memsui--tasks-colletcions__element_active');
    }
}

//изменение ширины input
function resizeWeekSelector(){
    let activityDiagram = document.querySelectorAll('.memsui--month-picker');
    activityDiagram.forEach((box) => {
        let input = box.querySelectorAll('.memsui--month-picker__date');
        input.forEach(function(el, index, input){
            length = el.value.length;
            el.setAttribute("size", length);
        });
        box.querySelector('.memsui--month-picker__button').classList.remove('memsui--month-picker__button_hidden');
    });
}

