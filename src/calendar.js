import fetch from "./utils/fetch.js"
import DBcrud from "./utils/DBcrud.js"
import { customTimePicker, convertDateFormat } from "./utils/utilities.js"
const db = new DBcrud()
const alertModal = new bootstrap.Modal('#alertModal')
const confirmButton = document.getElementById("confirm-change")
const cancelButton = document.getElementById("cancel-change")
const selectedDate = document.getElementById("add-calendar-modal")
const selectedTask = document.getElementById("detail-calendar-modal")

const addTaskCalendarModal = (date) => {
  return `<div class="modal fade zoom-in" id="addTaskModalCalendar" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header" style="border: none;">
          <h5 class="modal-title">Add Task on ${convertDateFormat(date)}</h5>
          <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form action="" id="calendar-task-form">
            <div class="form-group">
              <label for="taskTitle">Title</label>
              <p class="require-label"></p>
              <input id="taskTitle" class="form-control" type="text" rows="1"  placeholder="Task Title">
            </div>
            <div class="form-group" >
              <label for="startDatetime">Due Time</label>
              <div class="row" id="startDatetime">
                <div class="col-2" style="padding-right: 0;"> 
                  <select class="form-select" id="hour-select"></select>
                </div>
                <div class="col-1" style="padding: 0; width: 10px;text-align: center;">
                  <p>:</p>
                </div>
                <div class="col-2" style="padding: 0;">
                  <select class="form-select" id="minute-select"></select>
                </div>
              </div>
            </div>
            <div class="form-group">
              <label for="taskDetail">Detail</label>
              <textarea class="form-control" id="taskDetail" rows="3" placeholder="Task Detail"></textarea>
            </div>
            <div class="form-group">
              <label for="taskCalendarColor">Color (Calendar)</label>
              <input id="taskCalendarColor" type="color" list="presets" rows="4" value="#46AF5F">
                <datalist id="presets">
                  <option value="#46AF5F">Medium Sea Green</option>
                  <option value="#F6AF41">Yellow</option>
                  <option value="#E0002F">Red</option>
                  <option value="#FF00FF">Fuchsia</option>
                  <option value="#0000FF">Blue</option>
                  <option value="#1987B5">Aqua</option>
                </datalist>
            </div>
            <button id="add-btn" type="submit" class="btn btn-primary" style="width: 100%;background-color:rgb(73, 129, 73); border: none;">Add</button>
          </form>
        </div>
        <div class="modal-footer" >
        </div>
      </div>
    </div>
  </div>`
}

const taskDetailCalendarModal = (task) => {
  return `
  <div class="modal fade zoom-in" id="taskDetailModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header" style="background-color:${task.color};" >
        <h5 class="modal-title" id="exampleModalLongTitle">Due ${`${convertDateFormat(task.start)} ${task.time.H}:${task.time.M}`}</h5>
        <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <h6>${task.title}</h6>
        <p>"${task.detail}"</p>
      </div>
      <div class="modal-footer">
        <button id="done-btn" type="button" class="btn btn-primary"  style="width: 100%;" >Mask as Done</button>
        <button type="button" class="btn btn-danger" data-bs-dismiss="modal" style="width: 100%;">Close</button>
      </div>
    </div>
  </div>
</div>
  `
}

document.addEventListener("DOMContentLoaded", function () {
  //load common apparence and pre-load custion time picker
  navbar(document.getElementById("sidenavbar"), ['', 'active', ''])
  exitAlertModal(document.getElementById('exit-modal'))
  //calendar render
  window.onload = async function () {
    var tasks_data = JSON.parse(await window.localStorage.getItem('undone_task'))
    tasks_data.map((t) => t.id = t._id)
    //calendar
    var calendarEl = document.getElementById("calendar");
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
      //drag and drop event handler
      eventDrop: function (info) {
        const data = { id: info.event.id, start: info.event.startStr }
        alertModal.show()
        confirmButton.addEventListener('click', async function (event) {
          const res = await db.updateDateTask(data)
          if (res) {
            await fetch()
            tasks_data = JSON.parse(window.localStorage.getItem('undone_task'))
            tasks_data.map((t) => t.id = t._id)
          }
          alertModal.hide()
        })
        cancelButton.addEventListener('click', event => {
          window.location.reload()
        })
      },
      //add task on selected date handler
      dateClick: function (info) {
        selectedDate.innerHTML += addTaskCalendarModal(info.dateStr)
        var addTaskModal = new bootstrap.Modal('#addTaskModalCalendar')
        var addTaskModalEl = document.getElementById("addTaskModalCalendar")
        var hourSelect = document.getElementById('hour-select')
        var minuteSelect = document.getElementById('minute-select')
        customTimePicker(hourSelect, minuteSelect)
        addTaskModal.show()
        //add task form event listener
        document.getElementById("calendar-task-form").addEventListener("submit", async (event) => {
          event.preventDefault();
          var task = { title: "", detail: "", start: null, time: { H: "00", M: "00" }, status: 'undone', color: '#46AF5F' }
          task.start = info.dateStr
          task.title = document.getElementById("taskTitle").value;
          task.detail = document.getElementById("taskDetail").value;
          task.time.H = document.getElementById("hour-select").value;
          task.time.M = document.getElementById("minute-select").value;
          task.color = document.getElementById("taskCalendarColor").value;
          //validation
          if ((task.title == "")) {
            var reqLabel = document.getElementsByClassName("require-label")
            Array.prototype.forEach.call(reqLabel, function (el) {
              el.innerText = "*require"
            })
            return
          }
          console.log(task)
          const res = await db.addTask(task);
          if (res){
            await fetch()
            window.location.reload()
          }
          addTaskModal.hide()
        })
        //closing modal
        addTaskModalEl.addEventListener('hidden.bs.modal', async function (event) {
          selectedDate.innerHTML = ""
        })
      },
      //task's detail modal showing handler
      eventClick: function (info) {
        var clickedTask = tasks_data.filter((t) => t.id == info.event.id)
        selectedTask.innerHTML += taskDetailCalendarModal(clickedTask[0])
        var taskDetailModal = new bootstrap.Modal("#taskDetailModal")
        var taskDetailModalEl = document.getElementById("taskDetailModal")
        var doneTaskBtn = document.getElementById("done-btn")
        taskDetailModal.show()
        //mark as done task handler
        doneTaskBtn.addEventListener('click', async () => {
          const res = await db.markAsDone(clickedTask[0].id)
          tasks_data = tasks_data.filter((t) => t.id != clickedTask[0].id)
          window.localStorage.setItem("undone_task", JSON.stringify(tasks_data))
          if (res) {
            window.location.reload()
          }
        })
        //closing modal
        taskDetailModalEl.addEventListener('hidden.bs.modal', async function (event) {
          selectedTask.innerHTML = ""
        })
      },
      events: tasks_data
    });
    calendar.render();
    //Set text theme
    if (window.localStorage.getItem("light-mode") == "true") {
      var aTag = document.getElementsByTagName("a")
      for (var i = 0; i < aTag.length; i++) {
        aTag[i].style.color = "black"
      }
    }
  };
});
