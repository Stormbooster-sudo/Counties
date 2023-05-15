import DBcrud from "./utils/DBcrud.js";
import fetch from "./utils/fetch.js";
import {customTimePicker, calTime, colorScale} from "./utils/utilities.js"
const db = new DBcrud();
const add_btn = document.getElementById("add-btn");
var headerTitle = document.getElementById("header-title")
var mainStyle = ""
var modalHasShow = false

//fetch and display data
const fetchData = async () => {
  const cardShow = document.getElementById("card-show");
  const doneCardShow = document.getElementById("done-card-show")
  const taskCount = document.getElementById('task-count')
  const doneTaskCount = document.getElementById('done-task-count')
  const res = await fetch();
  const {sort_task, done_task} = res;
  cardShow.innerHTML = returnCard(sort_task);
  taskCount.innerText = sort_task.length
  doneCardShow.innerHTML = returnDoneCard(done_task);
  doneTaskCount.innerText = done_task.length

  //add eventListerner for done button for each card
  Array.prototype.forEach.call(document.querySelectorAll(".done-btn"), el => {
    el.addEventListener("click", async (event)=>{
        event.preventDefault();
        const id = event.target.value;
        console.log(id)
        const res = await db.markAsDone(id);
        if(res){
          await fetchData()
        }
        return
      })
  })
  //add eventListerner for delete button for each card
  Array.prototype.forEach.call(document.querySelectorAll(".delete-btn"), el => {
    el.addEventListener("click", async (event)=>{
        event.preventDefault();
        const id = event.target.value;
        console.log(id)
        const res = await db.deleteTask(id);
        if(res){
          await fetchData()
        }
        return
      })
  })
}

//listening to clear all done card button
document.getElementById("clear-done-cards").addEventListener("click",async (event)=>{
  event.preventDefault()
  const done_task = window.localStorage.getItem("done_tasks");
  if(done_task){
    const res = await db.clearDoneTasks(JSON.parse(done_task));
    if(res)
      await fetchData()
  }
  return
})

//toggle add task form to display
var addTaskModal = new bootstrap.Modal('#addTaskModal')
document.getElementById("add-task-btn").addEventListener("click", ()=>{
  addTaskModal.show()
} )
//add task form submit handler
document.getElementById("task-form").addEventListener("submit", async (event)=>{
  event.preventDefault();
  var task = { title: "", detail: "", start: null, time: { H: "00", M: "00" }, status: 'undone', color: '#46AF5F' }
  task.title = document.getElementById("taskTitle").value;
  task.detail = document.getElementById("taskDetail").value;
  task.start= document.getElementById("startDate").value;
  task.time.H = document.getElementById("hour-select").value;
  task.time.M = document.getElementById("minute-select").value;
  task.color = document.getElementById("taskCalendarColor").value;
  //validation
  if ((task.title == "") || (task.start == null)) {
    var reqLabel = document.getElementsByClassName("require-label")
    Array.prototype.forEach.call(reqLabel, function (el) {
      el.innerText = "*require"
    })
    return
  }
  const res = await db.addTask(task);
  if(res)
    await fetchData()
  addTaskModal.hide()
})

const returnCard = (cards) => {
  return cards
    .map((card) => {
      var minute = calTime(card.start, card.time.H, card.time.M)
      var hour = minute / 60
      var day = hour / 24
      var perc = (day / 30) * 100;
      perc = perc > 100 ? 99 : perc;
      return `    
      <div class="card ${mainStyle}" style="width: 15rem;text-align: center;min-width: 15em;border:none;cursur: pointer;" data-bs-toggle="modal" data-bs-target="#openCard${card._id
        }">
        <div class="single-chart">
          <svg viewBox="0 0 36 36" class="circular-chart" >
            <path class="circle-bg ${mainStyle}"
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path class="circle" style="stroke:${colorScale(perc)};"
              stroke-dasharray="${perc}, 100"
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <text x="18" y="19" class="percentage ${mainStyle}" style="font-size:0.70em;">${day > 1 ? Math.ceil(day) : hour > 1 ? Math.ceil(hour) : minute}</text>
            <text x="18" y="24" class="percentage ${mainStyle}" style="font-size: 0.3em;">${day > 1 ? "Days" : hour > 1 ? "Hours" : "Minutes"}</text>
          </svg>
        </div>
        <div class="card-body">
          <h5 class="card-title">${card.title}</h5>
          <p class="card-text">${card.detail}</p>
        </div>
  </div>
  <div class="modal fade zoom-in" id="openCard${card._id
        }" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header" style="background-color:${colorScale(perc)};" >
        <h5 class="modal-title" id="exampleModalLongTitle">Due ${`${card.start} ${card.time.H}:${card.time.M}`}</h5>
        <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body ${mainStyle}">
        <h6>${card.title}</h6>
        <p>"${card.detail}"</p>
      </div>
      <div class="modal-footer ${mainStyle}">
        <button id="done-btn" type="button" class="btn btn-primary done-btn"  data-bs-dismiss="modal" style="width: 100%;" value="${card._id}" >Mask as Done</button>
        <button type="button" class="btn btn-danger" data-bs-dismiss="modal" style="width: 100%;">Close</button>
      </div>
    </div>
  </div>
</div>
  `;
    })
    .join(" ");
};

const returnDoneCard = (cards) => {
  return cards
    .map((card) => {
      return `    
      <div class="card ${mainStyle}" style="width: 15rem;text-align: center;min-width: 15em;border:none;cursur: pointer;" data-bs-toggle="modal" data-bs-target="#openDoneCard${card._id}">
        <div class="single-chart">
          <svg viewBox="0 0 36 36" class="circular-chart" >
            <path class="circle-bg ${mainStyle}"
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path class="circle" style="stroke:gray;"
              stroke-dasharray="0, 100"
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <text x="18" y="20" class="percentage ${mainStyle}">Done!</text>
          </svg>
        </div>
        <div class="card-body">
          <h5 class="card-title">${card.title}</h5>
          <p class="card-text">${card.detail}</p>
        </div>
  </div>
  <div class="modal fade zoom-in" id="openDoneCard${card._id}" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header" style="background-color: gray;" >
        <h5 class="modal-title" id="exampleModalLongTitle">Due ${`${card.start} ${card.time.H}:${card.time.M}`}</h5>
        <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body ${mainStyle}">
        <p class="due-text">Done : ${card.done}</p>
        <h6>${card.title}</h6>
        <p>"${card.detail}"</p>
      </div>
      <div class="modal-footer ${mainStyle}">
        <button id="delete-btn" type="button" class="btn btn-danger delete-btn" data-bs-dismiss="modal" style="width: 100%;" value="${card._id}" >Delete</button>
      </div>
    </div>
  </div>
</div>
  `;
    })
    .join(" ");
};

//checking if there's a modal is open, prevent bug
const modalEventFlag = () => {
  var modals = document.getElementsByClassName('modal')
  for (var i = 0; i < modals.length; i++) {
    modals[i].addEventListener('show.bs.modal', event => {
      modalHasShow = true
    })
    modals[i].addEventListener('hide.bs.modal', async function (event) {
      modalHasShow = false
      await fetchData()
      modalEventFlag()
    })
  }
}

window.onload = async function () {
  //load common apparence and pre-load custion time picker
  var hourSelect = document.getElementById('hour-select')
  var minuteSelect = document.getElementById('minute-select')
  customTimePicker(hourSelect, minuteSelect);
  navbar(document.getElementById("sidenavbar"), ['active', '', '']);
  exitAlertModal(document.getElementById('exit-modal'));
  //check theme mode
  if (window.localStorage.getItem("light-mode") == "true") {
    lightMode()
    mainStyle = "light-mode"
  }

  await fetchData()
  modalEventFlag()
};


setInterval(async function () {
  if (!modalHasShow) {
    await fetchData()
    modalEventFlag()
  }
}, 60000)