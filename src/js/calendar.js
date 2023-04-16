const alertModal = new bootstrap.Modal('#alertModal')
const confirmButton = document.getElementById("confirm-change")
const selectedDate = document.getElementById("add-calendar-modal")
const sidenav = document.getElementById("sidenavbar")
var task = {title:"", detail:"", start: new Date(), status: 'undone', color: '#46AF5F'}

const addTaskCalendarModal = (date) =>{
    console.log(date)
    return `<div class="modal fade" id="addTaskModalCalendar" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Add Task on ${date}</h5>
          <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form>
            <div class="form-group">
              <label for="taskTitle">Title</label>
              <input id="taskTitle" class="form-control" type="text" rows="1"  placeholder="Task Title" onchange="task.title = this.value">
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
        <div class="modal-footer" >
          <button id="add-btn" type="button" class="btn btn-primary" style="width: 100%;background-color:rgb(73, 129, 73); border: none;" data-bs-dismiss="modal" >Add</button>
        </div>
      </div>
    </div>
  </div>`
}

document.addEventListener("DOMContentLoaded", function () {
    sidenav.innerHTML += navbar(['','active'])
    var calendarEl = document.getElementById("calendar");
    window.onload = async function () {
      const tasks = JSON.parse(await window.localStorage.getItem('undone_task'))
      var tasks_data = tasks.map((t) =>t.doc)
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
        eventDrop: function(info){
          const data = {id: info.event.id, start: info.event.startStr}
          alertModal.show()
          confirmButton.addEventListener('click', async function(event) {
            const res = await window.electronAPI.updateDateTask(data)
            alertModal.hide()
          })
        },
        dateClick: function(info) {
            task.start = info.dateStr
            selectedDate.innerHTML += addTaskCalendarModal(info.dateStr)
            var addTaskModal = new bootstrap.Modal('#addTaskModalCalendar')
            var addTaskModalEl = document.getElementById("addTaskModalCalendar")
            var addBtn = document.getElementById("add-btn")
            addTaskModal.show()
            console.log('clicked ' + info.dateStr); 
            addTaskModalEl.addEventListener('hidden.bs.modal', async function(event) {
                selectedDate.innerHTML = ""
            })
            addBtn.addEventListener('click',async ()=>{
                const res = await window.electronAPI.addTask(task)
                if(res){
                    var getUpdateTasks = await window.electronAPI.getTasks()
                    if (getUpdateTasks.length != null) {
                        sort_task = getUpdateTasks
                        .sort((t1, t2) => new Date(t1.doc.start) - new Date(t2.doc.start))
                        .filter((t) => t.doc.status == "undone");
                        window.localStorage.setItem('undone_task', JSON.stringify(sort_task))
                        sort_task = sort_task.filter((t) => calDay(t.doc.start) >= 0);
                        window.localStorage.setItem('tasks',JSON.stringify(sort_task));
                    }
                }
                window.location.reload()
            })
          },
        eventClick:function(info){
          console.log(info.event)
        },
        events: tasks_data
      });

      calendar.render();
    };
  });
