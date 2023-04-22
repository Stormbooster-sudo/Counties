const alertModal = new bootstrap.Modal('#alertModal')
const confirmButton = document.getElementById("confirm-change")
const cancelButton = document.getElementById("cancel-change")
const selectedDate = document.getElementById("add-calendar-modal")
const selectedTask = document.getElementById("detail-calendar-modal")
var mainStyle = ""
var task = {title:"", detail:"", start: new Date(), status: 'undone', color: '#46AF5F'}

const addTaskCalendarModal = (date) =>{
    return `<div class="modal fade zoom-in" id="addTaskModalCalendar" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header ${mainStyle}">
          <h5 class="modal-title">Add Task on ${date}</h5>
          <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body ${mainStyle}">
          <form>
            <div class="form-group">
              <label for="taskTitle">Title</label>
              <input id="taskTitle" class="form-control" type="text" rows="1"  placeholder="Task Title" onchange="task.title = this.value">
            </div>
            <div class="form-group" >
              <label for="startDatetime">Due Time</label>
              <div class="row" id="startDatetime">
                <div class="col-2" style="padding-right: 0;"> 
                  <select class="form-select" id="hour-select" onchange="task.time.H = this.value"></select>
                </div>
                <div class="col-1" style="padding: 0; width: 10px;text-align: center;">
                  <p>:</p>
                </div>
                <div class="col-2" style="padding: 0;">
                  <select class="form-select" id="minute-select" onchange="task.time.M = this.value"></select>
                </div>
              </div>
            </div>
            <div class="form-group">
              <label for="taskDetail">Detail</label>
              <textarea class="form-control" id="taskDetail" rows="3" placeholder="Task Detail" onchange="task.detail = this.value"></textarea>
            </div>
            <div class="form-group">
              <label for="taskCalendarColor">Color (Calendar)</label>
              <input id="taskCalendarColor" type="color" list="presets" rows="4" value="#46AF5F" onchange="task.color = this.value">
                <datalist id="presets">
                  <option value="#46AF5F">Medium Sea Green</option>
                  <option value="#F6AF41">Yellow</option>
                  <option value="#E0002F">Red</option>
                  <option value="#FF00FF">Fuchsia</option>
                  <option value="#0000FF">Blue</option>
                  <option value="#1987B5">Aqua</option>
                </datalist>
            </div>
          </form>
        </div>
        <div class="modal-footer ${mainStyle}" >
          <button id="add-btn" type="button" class="btn btn-primary" style="width: 100%;background-color:rgb(73, 129, 73); border: none;" data-bs-dismiss="modal" >Add</button>
        </div>
      </div>
    </div>
  </div>`
}

const taskDetailCalendarModal = (task) =>{
  return `
  <div class="modal fade zoom-in" id="taskDetailModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header" style="background-color:${task.color};" >
        <h5 class="modal-title" id="exampleModalLongTitle">Due ${`${task.start} ${task.time.H}:${task.time.M}`}</h5>
        <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body ${mainStyle}">
        <h6>${task.title}</h6>
        <p>"${task.detail}"</p>
      </div>
      <div class="modal-footer ${mainStyle}">
        <button id="done-btn" type="button" class="btn btn-primary"  style="width: 100%;" >Mask as Done</button>
        <button type="button" class="btn btn-danger" data-bs-dismiss="modal" style="width: 100%;">Close</button>
      </div>
    </div>
  </div>
</div>
  `
}

document.addEventListener("DOMContentLoaded", function () {
    sidenav.innerHTML += navbar(['','active',''])
    exitModal.innerHTML += exitAlertModal()
    var calendarEl = document.getElementById("calendar");
    window.onload = async function () {
      var tasks_data = JSON.parse(await window.localStorage.getItem('undone_task'))
      tasks_data.map((t) => t.id = t._id)
      var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: "dayGridMonth",
        height: 750,
        selectable: true,
        headerToolbar: {
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth",
        },
        editable: true,
        dayMaxEventRows: true,
        eventDrop: function(info){
          const data = {id: info.event.id, start: info.event.startStr}
          alertModal.show()
          confirmButton.addEventListener('click', async function(event) {
            const res = await window.electronAPI.updateDateTask(data)
            if(res.ok){
              await fetchData()
              tasks_data = JSON.parse(window.localStorage.getItem('undone_task'))
              tasks_data.map((t) => t.id = t._id)
            }
            alertModal.hide()
          })
          cancelButton.addEventListener('click', event => {
            window.location.reload()
          })
        },
        dateClick: function(info) {
            task.start = info.dateStr
            selectedDate.innerHTML += addTaskCalendarModal(info.dateStr)
            var addTaskModal = new bootstrap.Modal('#addTaskModalCalendar')
            var addTaskModalEl = document.getElementById("addTaskModalCalendar")
            var addBtn = document.getElementById("add-btn")
            add24HourTimePicker()
            addTaskModal.show()
            addTaskModalEl.addEventListener('hidden.bs.modal', async function(event) {
                selectedDate.innerHTML = ""
            })
            addBtn.addEventListener('click',async ()=>{
                const res = await window.electronAPI.addTask(task)
                if(res.ok){
                    await fetchData()
                }
                window.location.reload()
            })
          },
        eventClick:function(info){
          var clickedTask = tasks_data.filter((t)=> t.id == info.event.id)
            selectedTask.innerHTML += taskDetailCalendarModal(clickedTask[0])
            var taskDetailModal = new bootstrap.Modal("#taskDetailModal")
            var taskDetailModalEl = document.getElementById("taskDetailModal")
            var doneTaskBtn = document.getElementById("done-btn")
            taskDetailModal.show()
            taskDetailModalEl.addEventListener('hidden.bs.modal', async function(event) {
                selectedTask.innerHTML = ""
            })
            doneTaskBtn.addEventListener('click', async ()=>{
              await markAsDone(clickedTask[0].id)
              tasks_data = tasks_data.filter((t)=> t.id != clickedTask[0].id)
              window.localStorage.setItem("undone_task", JSON.stringify(tasks_data))
            })
        },
        events: tasks_data
      });

      calendar.render();
      if(window.localStorage.getItem("light-mode") == 'true'){
        var aTag = document.getElementsByTagName("a")
        for(var i = 0; i < aTag.length; i++){
          aTag[i].style.color = "black"
        }
        mainStyle = "light-mode"
        lightMode()
      }
    };
  });
