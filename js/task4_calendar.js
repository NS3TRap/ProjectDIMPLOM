var Cal = function(divId) {

    //Сохраняем идентификатор div
    this.divId = divId;

    //Устанавливаем текущий месяц, год
    var d = new Date();
  
    this.currMonth = d.getMonth('9');
    this.currYear = d.getFullYear('23');
    this.currDay = d.getDate('19');
  };

  Cal.prototype.getCurrentMonth = function(){
    return this.currMonth;
  }

  Cal.prototype.getCurrentFullYear = function(){
    return this.currYear;
  }

  //Склонение слова в зависимости от числа
function getDeclinationWord(remainder) {
  if (remainder == 1)
      return 'задание';
  else if (remainder >= 2 && remainder <= 4)
      return 'задания';
  else if ((remainder >= 5 && remainder <= 9) || remainder == 0)
      return 'заданий';
}

  function getDayPanelHTML(status, d, m, data, i, y = 0){
    if(status == 'hidden')
        html = '<div id="'+i+'" onclick="handlingEvents(event)" class="memsui--day-panel memsui--day-panel_hidden memsui--selected-mark_hidden">';
    else if(status == 'active'){
        html = '<div id="'+i+'" onclick="handlingEvents(event)" class="memsui--day-panel memsui--day-panel_active">';
    }
    else if(status == 'default')
        html = '<div id="'+i+'" onclick="handlingEvents(event)" class="memsui--day-panel memsui--selected-mark_hidden">';

    var all_tasks_text = data.get('unread_notifications').size + data.get('deadline_tasks').size + data.get('test_tasks').size,
    count_unread_notification = data.get('unread_notifications').size,
    count_deadline_task = data.get('deadline_tasks').size,
    count_test_task = data.get('test_tasks').size;

    var hidden_unread = count_unread_notification == 0 ? 'memsui--indicator_hidden' : '',
    hidden_deadline = count_deadline_task == 0 ? 'memsui--indicator_hidden': '',
    hidden_test = count_test_task == 0 ? 'memsui--indicator_hidden' : '';
    //formating date
    if(d<10)
        d = '0' + d;
    
    m +=1;
    if(m<10)
        m = '0' + m;
    html += '<div class="memsui--day-panel-top">'+
    '<div class="memsui--information-window">'+
    '<div class="memsui--information-window__date">'+d+'.'+m+'</div>'+
    '<div class="memsui--information-window__text">'+all_tasks_text+' '+getDeclinationWord(all_tasks_text%10)+'</div></div>'+
    '<div class="memsui--marks-zone"><div class="memsui--selected-mark ">'+
    '<div class="memsui--selected-mark__central-circle"></div></div></div></div>'+
    '<div class="memsui--day-panel-bottom"><div class="memsui--indicators-panel">'+
    '<div class="memsui--indicator memsui--indicator_unread-notification '+hidden_unread+'">'+
    '<div class="memsui--indicator__count">'+count_unread_notification+'</div></div>'+
    '<div class="memsui--indicator memsui--indicator_task-deadline '+hidden_deadline+'">'+
    '<div class="memsui--indicator__count">'+count_deadline_task+'</div></div>'+
    '<div class="memsui--indicator memsui--indicator_test-task '+hidden_test+'">'+
    '<div class="memsui--indicator__count">'+count_test_task+'</div></div>'+
    '</div></div></div>';
    return html;
  }
  
  // Переход к следующему месяцу
  Cal.prototype.nextMonth = function(data) {
    if ( this.currMonth == 11 ) {
      this.currMonth = 0;
      this.currYear = this.currYear + 1;
    }
    else {
      this.currMonth = this.currMonth + 1;
    }
    this.showcurr(data);
  };

    // Переход к выбранному месяцу
    Cal.prototype.selectMonth = function(m,y,data) {
          this.currMonth = m;
          this.currYear = y;
        this.showcurr(data);
      };
  
  // Переход к предыдущему месяцу
  Cal.prototype.previousMonth = function(data) {
    if ( this.currMonth == 0 ) {
      this.currMonth = 11;
      this.currYear = this.currYear - 1;
    }
    else {
      this.currMonth = this.currMonth - 1;
    }
    this.showcurr(data);
  };
  
  // Показать текущий месяц
  Cal.prototype.showcurr = function(data) {
    this.showMonth(this.currYear, this.currMonth, data);
  };
  
  
  
  // Показать месяц (год, месяц)
  Cal.prototype.showMonth = function(y, m, data) {
  
    var d = new Date()
    // Первый день недели в выбранном месяце 
    , firstDayOfMonth = new Date(y, m, 7).getDay()
    // Последний день выбранного месяца
    , lastDateOfMonth =  new Date(y, m+1, 0).getDate()
    // Последний день предыдущего месяца
    , lastDayOfLastMonth = m == 0 ? new Date(y-1, 11, 0).getDate() : new Date(y, m, 0).getDate();
  
    html = '';
    // Записываем дни
    var r=0;
    var i=1;
    var chk = new Date();
    var chkY = chk.getFullYear();
    var chkM = chk.getMonth();
    var q = 0;
    do {
  
      var dow = new Date(y, m, i).getDay();
  
      // Начать новую строку в понедельник
      if ( dow == 1 ) {
        html += '<div class="memsui--days-panel-row">';
        r++;
      }
      
      // Если первый день недели не понедельник показать последние дни предидущего месяца
      else if ( i == 1 ) {
        html += '<div class="memsui--days-panel-row">';
        var k = lastDayOfLastMonth - firstDayOfMonth+1;
        for(var j=0; j < firstDayOfMonth; j++) {
            if (chkY == m-1 && chkM == m-1 && k == chk.getDate()) 
                html += getDayPanelHTML('active', k, m == 0 ? 11 : m-1, data.get(q), q, this.currYear);
            else if(chkY == this.currYear && chkM == m-1 && k < chk.getDate())
                html += getDayPanelHTML('hidden', k, m == 0 ? 11 : m-1, data.get(q), q);
            else if(chkY > this.currYear || (chkY == this.currYear && chkM > m-1))
                html += getDayPanelHTML('hidden', k, m == 0 ? 11 : m-1, data.get(q), q);
            else 
                html += getDayPanelHTML('default', k, m == 0 ? 11 : m-1, data.get(q), q);
          q++;
          k++;
        }
        r++;
      }
  
      // Записываем текущий день в цикл
      if (chkY == this.currYear && chkM == this.currMonth && i == chk.getDate()) 
        html += getDayPanelHTML('active', i, m, data.get(q), q, this.currYear);
      else if(chkY == this.currYear && chkM == this.currMonth && i < chk.getDate())
        html += getDayPanelHTML('hidden', i, m, data.get(q), q);
      else if(chkY > this.currYear || (chkY == this.currYear && chkM > this.currMonth))
        html += getDayPanelHTML('hidden', i, m, data.get(q), q);
      else 
        html += getDayPanelHTML('default', i, m, data.get(q), q);
      
      q++;
      // закрыть строку в воскресенье
      if ( dow == 0 ) {
        html += '</div>';
      }
      // Если последний день месяца не воскресенье, показать первые дни следующего месяца
      else if ( i == lastDateOfMonth ) {
        var k=1;
        for(dow; dow < 7; dow++) {
            if (chkY == m+1 && chkM == m+1 && k == chk.getDate()) 
                html += getDayPanelHTML('active', k, m == 11 ? 0 : m+1, data.get(q), q, this.currYear);
            else if(chkY == this.currYear && chkM == m+1 && k < chk.getDate())
                html += getDayPanelHTML('hidden', k, m == 11 ? 0 : m+1, data.get(q), q);
            else if(chkY > this.currYear || (chkY == this.currYear && chkM > m+1))
                html += getDayPanelHTML('hidden', k, m == 11 ? 0 : m+1, data.get(q), q);
            else 
                html += getDayPanelHTML('default', k, m == 11 ? 0 : m+1, data.get(q), q);
          q++;
          k++;
        }
        html += '</div>';
      }
  
      i++;
    }while(i <= lastDateOfMonth);

    if(r<6){
        dow = 0;
        html += '<div class="memsui--days-panel-row">';
        dayWeekLastDayOfMonth = new Date(y, m+1, 0).getDay();
        if(dayWeekLastDayOfMonth == 0){
            k = 1;
            for(dow; dow < 7; dow++) {
                if (chkY == m+1 && chkM == m+1 && k == chk.getDate()) 
                    html += getDayPanelHTML('active', k, m == 11 ? 0 : m+1, data.get(q), q, this.currYear);
                else if(chkY == this.currYear && chkM == m+1 && k < chk.getDate())
                    html += getDayPanelHTML('hidden', k, m == 11 ? 0 : m+1, data.get(q), q);
                else if(chkY > this.currYear || (chkY == this.currYear && chkM > m+1))
                    html += getDayPanelHTML('hidden', k, m == 11 ? 0 : m+1, data.get(q), q);
                else 
                    html += getDayPanelHTML('default', k, m == 11 ? 0 : m+1, data.get(q), q);
            q++;
            k++;
            }
            html += '</div>';
        } else{
            for(dow; dow < 7; dow++) {
                if (chkY == m+1 && chkM == m+1 && k == chk.getDate()) 
                    html += getDayPanelHTML('active', k, m == 11 ? 0 : m+1, data.get(q),q, this.currYear);
                else if(chkY == this.currYear && chkM == m+1 && k < chk.getDate())
                    html += getDayPanelHTML('hidden', k, m == 11 ? 0 : m+1, data.get(q), q);
                else if(chkY > this.currYear || (chkY == this.currYear && chkM > m+1))
                    html += getDayPanelHTML('hidden', k, m == 11 ? 0 : m+1, data.get(q), q);
                else 
                    html += getDayPanelHTML('default', k, m == 11 ? 0 : m+1, data.get(q), q);
            q++;
            k++;
            }
            html += '</div>';
        }
    }
  
    // Записываем HTML в div
    document.getElementsByClassName(this.divId)[0].innerHTML = html;
  };