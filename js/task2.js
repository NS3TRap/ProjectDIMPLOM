const flatpick = flatpickr("#weekSelector", {
    "plugins": [new weekSelect({})],
    defaultDate : "today",
    "locale" : "ru",
    altInput : true,
    altFormat : "d F",
    dateFormat : "d m",
    "onChange": [changeDate()],
    "onReady": [changeDate()]
});

//обработка изменении даты
function changeDate() {
    return function () {
        if (this.weekEndDay.toLocaleString("ru", { month: 'long' }) == this.weekStartDay.toLocaleString("ru", { month: 'long' })) {
            startWeekDay = this.weekStartDay.toLocaleString("ru", { day: '2-digit' });
            endWeekday = this.weekEndDay.toLocaleString("ru", { day: '2-digit', month: 'long' });
        } else {
            startWeekDay = this.weekStartDay.toLocaleString("ru", { day: '2-digit', month: 'short' });
            endWeekday = this.weekEndDay.toLocaleString("ru", { day: '2-digit', month: 'short' });
        }
        this._input.value = startWeekDay + "-" + endWeekday;
        setDateAttributes(this.weekStartDay);
        fetchRequest();
    };
}

//показать инф окно
function showInformationPanel(event){
    let selectedColumn = event.target;

    let activityDiagram = document.querySelectorAll('.memsui--activity-diagram');
    activityDiagram.forEach((box) => {
        let informationWindow = box.querySelector('.memsui--information-window');

        let Text = 'Сделано: ' + selectedColumn.dataset.count;
        setTextInfoWindow(box, selectedColumn, Text);

        informationWindow.classList.add('memsui--information-window_display-block');

        calcLocation(informationWindow, Text, box, selectedColumn);

    });
}

//вставка данных в инф окно
function setTextInfoWindow(box, selectedColumn, Text) {
    let informationWindowText = box.querySelectorAll('.memsui--information-window__text');
    informationWindowText[0].textContent = selectedColumn.dataset.date;
    informationWindowText[1].textContent = Text;
}

//подсчет расположения информационного окна
function calcLocation(informationWindow, Text, box, selectedColumn) {
    let widthIW = 85;
    informationWindow.style.width = widthIW + 'px';
    if (Text.length > 11) {
        widthIW = informationWindow.getBoundingClientRect().width + (Text.length - 11) * 6;
        informationWindow.style.width = widthIW + 'px';
    }
    let infoWindowTriangle = box.querySelector('.memsui--information-window__triangle');
    let widthIWT = infoWindowTriangle.getBoundingClientRect().width;
    infoWindowTriangle.style.left = Math.round(widthIW / 2 - widthIWT / 2) + 'px';

    let sizeColumn = selectedColumn.getBoundingClientRect();
    let sizeBoxColumns = box.querySelector('.memsui--columns').getBoundingClientRect();
    let sizeInformationWindow = informationWindow.getBoundingClientRect();

    let countColumns = box.querySelectorAll('.memsui--columns__column').length;
    let paddingWidth = Math.round((sizeBoxColumns.width - countColumns * sizeColumn.width) / (countColumns - 1));
    let interval = sizeColumn.width + paddingWidth;

    let left_px = Math.round(selectedColumn.dataset.number * interval - widthIW / 2 - paddingWidth - sizeColumn.width / 2);
    let top_px = Math.round(sizeBoxColumns.height - (10 + sizeColumn.height + sizeInformationWindow.height));
    informationWindow.style.left = left_px + 'px';
    informationWindow.style.top = top_px + 'px';
}

//скрыть информационную панель
function hideInformationWindow(event){
    let selectedColumn = event.target;
    let activityDiagram = document.querySelectorAll('.memsui--activity-diagram');
    activityDiagram.forEach((box) => {
        let informationWindow = box.querySelector('.memsui--information-window');

        if(!selectedColumn.classList.contains('memsui--columns__column'))
            informationWindow.classList.remove('memsui--information-window_display-block');
    });
}

//запрос данных у сервера и вставка данных
async function fetchRequest(startWeekDay, endWeekday){
    /*
    let date = {
        startWeekDay: startWeekDay,
        endWeekday: endWeekday
    };
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
    //-------------Удалить-потом--------------------------
    let counts = [];
    let maxCount = 0, avgCount, sumCount = 0;  
    for(i = 0; i < 7; i++){ //типо запрос
        counts.push(randomInteger(0,100));
        if(counts[i] > maxCount)
            maxCount = counts[i];
        sumCount += counts[i];
    }
    //получение рандомных данных(вместо запроса, для проверки)
    function randomInteger(min, max) {
        let rand = min + Math.random() * (max + 1 - min);
        return Math.floor(rand);
    }
    //-----------------------------------------------------  

    let activityDiagram = document.querySelectorAll('.memsui--activity-diagram');
    activityDiagram.forEach((box) => {
        let columns = box.querySelectorAll('.memsui--columns__column');
        columns.forEach(function(element, i, columns){
            element.dataset.count = counts[i];
        });
        avgCount = Math.round(sumCount / counts.length);    

        let remainder = maxCount % 10;
        let maxCountText = getDeclinationWord(remainder);
        document.querySelector('.memsui--max-number-of-tasks__number').textContent = maxCount;
        document.querySelector('.memsui--max-number-of-tasks__text').textContent = maxCountText;

        remainder = avgCount % 10;
        let avgCountText = getDeclinationWord(remainder);
        document.querySelector('.memsui--avg-number-of-tasks__number').textContent = avgCount;
        document.querySelector('.memsui--avg-number-of-tasks__text').textContent = avgCountText;
    });
    resizeHeightColumn();
}

//Склонение слова в зависимости от числа
function getDeclinationWord(remainder) {
    if (remainder == 1)
        return 'задача';
    else if (remainder >= 2 && remainder <= 4)
        return 'задачи';
    else if ((remainder >= 5 && remainder <= 9) || remainder == 0)
        return 'задач';
}

//Изменение размеров столбцов
function resizeHeightColumn(){
    let sumCount = 0;
    let activityDiagram = document.querySelectorAll('.memsui--activity-diagram');
    activityDiagram.forEach((box) => {
        let columns = box.querySelectorAll('.memsui--columns__column');
        columns.forEach(function(element, i, columns){
            sumCount += Number(element.dataset.count);
        });

        let columnsBox = box.querySelector('.memsui--columns');
        let columnsBox_height = columnsBox.getBoundingClientRect().height - 10;

        columns.forEach(function(element, i, columns){
            if(Number(element.dataset.count) === 0){
                element.style.height = '';
                element.classList.add('memsui--columns__column_empty');
            } else {
                element.classList.remove('memsui--columns__column_empty');
                let height = Math.round((element.dataset.count/sumCount) * columnsBox_height) + 10;
                element.style.height = height + 'px';
            }
        });
    });
}

//установка данных в столбцы
function setDateAttributes(WeekDate){
    let activityDiagram = document.querySelectorAll('.memsui--activity-diagram');
    activityDiagram.forEach((box) => {
        let columns = box.querySelectorAll('.memsui--columns__column');
        columns.forEach(function(element, i, columns){
            element.dataset.date = WeekDate.toLocaleString("ru", {day: '2-digit', month : '2-digit'});
            WeekDate.setDate(WeekDate.getDate() + 1);
        });
    });
}

//обработка событий
function handlingEvents(event){
    if(event.currentTarget.localName === 'button')
        flatpick.open();
    if(event.currentTarget.id == "nextWeek"){
        let nextDate = flatpick.selectedDates[0];
        flatpick.setDate(nextDate.setDate(nextDate.getDate() + 7), true);
        resizeWeekSelector();
    }
    if(event.currentTarget.id == "lastWeek"){
        let nextDate = flatpick.selectedDates[0];
        flatpick.setDate(nextDate.setDate(nextDate.getDate() - 7), true);
        resizeWeekSelector();
    }
    if(event.type == 'load')
        resizeWeekSelector();
}

//изменение ширины input
function resizeWeekSelector(){
    let activityDiagram = document.querySelectorAll('.memsui--week-selector');
    activityDiagram.forEach((box) => {
        let input = box.querySelectorAll('.memsui--week-selector_date-text');
        input.forEach(function(el, index, input){
            length = el.value.length;
            el.setAttribute("size", length);
        });
        box.querySelector('.memsui--button-arrow').classList.remove('memsui--button-arrow_hidden');
    });
}