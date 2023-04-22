var cardShow = document.getElementById("card-show");
var doneCardShow = document.getElementById("done-card-show")
const add_btn = document.getElementById("add-btn");
var headerTitle = document.getElementById("header-title")
const taskCount = document.getElementById('task-count')
const doneTaskCount = document.getElementById('done-task-count')
var mainStyle = ""
var modalHasShow = false

const deleteTask = async (id) => {
  const res = await window.electronAPI.deleteTask(id);
  if(res.ok){
    await fetchData()
  }
};

const clearDoneTasks = async () =>{
  const res = await window.electronAPI.deleteBatchTasks(done_task)
  if(res){
    await fetchData()
  }
}

const returnCard = (cards) => {
  return cards
    .map((card) => {
      var minute = calDay(card.start, card.time.H, card.time.M)
      var hour = minute / 60
      var day = hour / 24
      var perc = (day / 30) * 100;
      perc = perc > 100 ? 99 : perc;
      return `    
      <div class="card ${mainStyle}" style="width: 15rem;text-align: center;min-width: 15em;border:none;cursur: pointer;" data-bs-toggle="modal" data-bs-target="#openCard${
        card._id
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
  <div class="modal fade zoom-in" id="openCard${
    card._id
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
        <button id="done-btn" type="button" class="btn btn-primary"  data-bs-dismiss="modal" style="width: 100%;" onclick=\"markAsDone(\'${
          card._id
        }\')\" >Mask as Done</button>
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
        <button id="done-btn" type="button" class="btn btn-danger" data-bs-dismiss="modal" style="width: 100%;" onclick=\"deleteTask(\'${card._id}\')\" >Delete</button>
      </div>
    </div>
  </div>
</div>
  `;
    })
    .join(" ");
};

window.onload = async function () {
  sidenav.innerHTML += navbar(['active','',''])
  exitModal.innerHTML += exitAlertModal()
  add24HourTimePicker()
  if(window.localStorage.getItem("light-mode") == "true"){
    lightMode()
    mainStyle = "light-mode"
  }
  
  await fetchData()

  var modals = document.getElementsByClassName('modal')
  console.log(modals)
  for(var i = 0; i < modals.length; i++){
    modals[i].addEventListener('show.bs.modal', event => {
      modalHasShow = true
    })
    modals[i].addEventListener('hide.bs.modal',async function(event) {
      modalHasShow = false
      await fetchData()
    })
  }
};


setInterval(async function(){
  if(!modalHasShow)
    await fetchData()
}, 60000)