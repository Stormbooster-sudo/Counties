var task = {title:"", detail:"", start: new Date(), time:{H: "00", M: "00"}, status: 'undone', color: '#46AF5F'}
var sort_task = []
var outOfDate = []
var done_task = []

var sidenav = document.getElementById("sidenavbar")
const navbar = (page) =>{
    return `
    <a href="index.html" class="${page[0]}"><i class="bi bi-house-door" style="font-size: 26px; margin-right: 1px;"></i></a>
      <a href="calendar.html" class="${page[1]}"><i class="bi bi-calendar3" style="font-size: 23px; margin-right: 3px;margin-left: 3px;"></i></a>
      <a href="setting.html" class="${page[2]}"><i class="bi bi-gear" style="font-size: 26px; margin-right: 1px;"></i></a>  
      <a class="logout-btn" style="position: fixed;bottom: 0;text-align: center;width: 3.2em;" data-bs-toggle="modal" data-bs-target="#logoutAlert"><i class="bi bi-box-arrow-left" style="font-size: 23px; margin-right: 6px;margin-left: 2px;padding-top: 4px"></i></a>
    `
  }

  const exitModal = document.getElementById('exit-modal')
  const exitAlertModal = () => {
    return`
    <div class="modal fade zoom-in" id="logoutAlert" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog  modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Quit?</h5>
          <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          Are you sure you want to quit?
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">No</button>
          <button id="logout-btn" type="button" class="btn btn-primary" onclick="quitWindow()">Sure</button>
        </div>
      </div>
    </div>
  </div>
    `
  }

  const add24HourTimePicker = () =>{
    var hourSelect =  document.getElementById('hour-select')
    var minuteSelect = document.getElementById('minute-select')
    for (var i = 0; i<24; i++){
        var opt = document.createElement('option');
        if(i < 10){
          opt.value = '0' + i;
          opt.innerHTML = '0' + i;
        }
        else{
          opt.value = i;
          opt.innerHTML = i;
        }
        hourSelect.appendChild(opt);
    }
    for (var i = 0; i<12; i++){
        var opt = document.createElement('option');
        if(i * 5 < 10){
          opt.value = '0' + (i * 5);
          opt.innerHTML = '0' + (i * 5);
        }
        else{
          opt.value = (i * 5);
          opt.innerHTML = (i * 5);
        }
        minuteSelect.appendChild(opt);
    }
  }

  const addTask = async () =>{
    const res = await window.electronAPI.addTask(task)
    if(res.ok){
      await fetchData()
      if(window.location.href.split('/').pop() == "calendar.html"){
        window.location.reload()
      }
    }
  }

  const markAsDone = async (id) => {
    const res = await window.electronAPI.doneTask(id);
    if(res.ok){
      await fetchData()
      if(window.location.href.split('/').pop() == "calendar.html"){
        window.location.reload()
      }
    }
  };

  const quitWindow = () => {
    window.electronAPI.closeWindow()
  }
  const calDay = (d, h, m) => {
    var date1 = new Date(d + ` ${h}:${m}:00`);
    var date2 = new Date();
    var difDate = date1.getTime() - date2.getTime();
    return Math.round(difDate / (1000 * 60));
  };
  
  const colorScale = (perc) => {
    var r,g,b = 0;
    if (perc < 50) {
      r = 255;
      g = Math.round(5.1 * perc);
    } else {
      g = 255;
      r = Math.round(510 - 5.1 * perc);
    }
    var h = r * 0x10000 + g * 0x100 + b * 0x1;
    return "#" + ("000000" + h.toString(16)).slice(-6);
  };


  const lightMode = () =>{
    document.getElementsByTagName('body')[0].classList.add("light-mode")
    document.getElementById('sidenavbar').classList.add("light-mode")
    var modalHeader = document.getElementsByClassName("modal-header")
    var modalBody = document.getElementsByClassName("modal-body")
    var modalFooter = document.getElementsByClassName("modal-footer")
    for(var i = 0; i < modalHeader.length; i++){
        modalHeader[i].classList.add('light-mode')
        modalBody[i].classList.add('light-mode')
        modalFooter[i].classList.add('light-mode')
    }
  }

  const fetchData = async () => {
    var tasks = await window.electronAPI.getTasks()
    tasks = tasks.map((t) =>t.doc)
    if (tasks.length != null) {
      sort_task = tasks
        .sort((t1, t2) => calDay(t1.start, t1.time.H, t1.time.M) - calDay(t2.start, t2.time.H, t2.time.M))
        .filter((t) => t.status == "undone");
  
      window.localStorage.setItem('undone_task', JSON.stringify(sort_task))
  
      outOfDate = sort_task.filter((t) => calDay(t.start, t.time.H, t.time.M) < 0);
      sort_task = sort_task.filter((t) => calDay(t.start, t.time.H, t.time.M) >= 0);
      done_task = tasks.filter((t) => t.status == "done");
  
      if (outOfDate.length) {
        outOfDate.map(
          async (task) => await window.electronAPI.deleteTask(task._id)
        );
      }
    }
    if(window.location.href.split('/').pop() == "index.html"){
      cardShow.innerHTML = returnCard(sort_task);
      taskCount.innerText = sort_task.length
      doneCardShow.innerHTML = returnDoneCard(done_task);
      doneTaskCount.innerText = done_task.length
      window.localStorage.setItem('tasks',JSON.stringify(sort_task));
    }
  }