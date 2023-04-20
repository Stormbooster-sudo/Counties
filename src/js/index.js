var sidenav = document.getElementById("sidenavbar")
var cardShow = document.getElementById("card-show");
var doneCardShow = document.getElementById("done-card-show")
const add_btn = document.getElementById("add-btn");
const logout_btn = document.getElementById("logout-btn")
var headerTitle = document.getElementById("header-title")
const taskCount = document.getElementById('task-count')
const doneTaskCount = document.getElementById('done-task-count')
var mainStyle = ""
var task = {title:"", detail:"", start: new Date(), status: 'undone', color: '#46AF5F'}
var sort_task = []
var outOfDate = []
var done_task = []

const navbar = (page) =>{
  return `
  <a href="index.html" class="${page[0]}"><i class="bi bi-house-door" style="font-size: 26px; margin-right: 1px;"></i></a>
    <a href="calendar.html" class="${page[1]}"><i class="bi bi-calendar3" style="font-size: 23px; margin-right: 3px;margin-left: 3px;"></i></a>
    <a href="setting.html" class="${page[2]}"><i class="bi bi-gear" style="font-size: 26px; margin-right: 1px;"></i></a>  
    <a class="logout-btn" style="position: fixed;bottom: 0;text-align: center;width: 3.2em;" data-bs-toggle="modal" data-bs-target="#logoutAlert"><i class="bi bi-box-arrow-left" style="font-size: 23px; margin-right: 6px;margin-left: 2px;padding-top: 4px"></i></a>
  `
}

const addTask = async () =>{
  console.log(task)
  const res = await window.electronAPI.addTask(task)
  if(res){
    await fetchData()
  }
}

const markAsDone = async (id) => {
  console.log(id);
  const res = await window.electronAPI.doneTask(id);
  if(res){
    await fetchData()
  }
};

const deleteTask = async (id) => {
  console.log(id);
  const res = await window.electronAPI.deleteTask(id);
  if(res){
    await fetchData()
  }
};

const clearDoneTasks = async () =>{
  const res = await window.electronAPI.deleteBatchTasks(done_task)
  if(res){
    await fetchData()
  }
  console.log(res)
}

const quitWindow = () => {
  window.electronAPI.closeWindow()
}
const calDay = (d) => {
  var date1 = new Date(d);
  var date2 = new Date();
  // console.log(date2)
  var difDate = date1.getTime() - date2.getTime();
  // console.log(difDate / (1000 * 3600 * 24))
  var days = Math.round(difDate / (1000 * 3600 * 24));
  return days;
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
const returnCard = (cards) => {
  return cards
    .map((card) => {
      console.log(card)
      var perc = (calDay(card.start) / 30) * 100;
      perc = perc > 100 ? 99 : perc;
      // console.log(perc)
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
            ${calDay(card.start) == 0 ? `<text x="18" y="20" class="percentage ${mainStyle}" style="font-size:0.50em;">Today</text>` :`<text x="18" y="19" class="percentage ${mainStyle}" style="font-size:0.70em;">${calDay(card.start)}</text>`}
            <text x="18" y="24" class="percentage ${mainStyle}" style="font-size: 0.3em;">${
              calDay(card.start) == 0 ? "" : "Days"
            }</text>
          </svg>
        </div>
        <div class="card-body">
          <h5 class="card-title">${card.title}</h5>
          <p class="card-text">${card.detail}</p>
        </div>
  </div>
  <div class="modal fade" id="openCard${
    card._id
  }" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header" style="background-color:${colorScale(perc)};" >
        <h5 class="modal-title" id="exampleModalLongTitle">Due ${
          card.start
        }</h5>
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
      console.log(card)
      var perc = (calDay(card.start) / 30) * 100;
      perc = perc > 100 ? 99 : perc;
      // console.log(perc)
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
  <div class="modal fade" id="openDoneCard${card._id}" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header" style="background-color: gray;" >
        <h5 class="modal-title" id="exampleModalLongTitle">Due ${card.start}</h5>
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
  console.log(tasks)
  if (tasks.length != null) {
    sort_task = tasks
      .sort((t1, t2) => new Date(t1.start) - new Date(t2.start))
      .filter((t) => t.status == "undone");

    window.localStorage.setItem('undone_task', JSON.stringify(sort_task))

    outOfDate = sort_task.filter((t) => calDay(t.start) < 0);
    sort_task = sort_task.filter((t) => calDay(t.start) >= 0);
    done_task = tasks.filter((t) => t.status == "done");

    if (outOfDate.length) {
      // console.log(outOfDate.length)
      outOfDate.map(
        async (task) => await window.electronAPI.deleteTask(task.id)
      );
    }
    console.log(sort_task)
  }
  cardShow.innerHTML = returnCard(sort_task);
  taskCount.innerText = sort_task.length
  doneCardShow.innerHTML = returnDoneCard(done_task);
  doneTaskCount.innerText = done_task.length
  window.localStorage.setItem('tasks',JSON.stringify(sort_task));
}

window.onload = async function () {
  sidenav.innerHTML += navbar(['active','',''])
  if(window.localStorage.getItem("light-mode") == "true"){
    lightMode()
    mainStyle = "light-mode"
  }
  
  await fetchData()
  // console.log(username)
};


setInterval(function() {window.location.reload()}, 3600000)