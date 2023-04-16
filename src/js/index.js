var tasks = []
var sort_task = []
var outOfDate = []
var done_task = []

const MaskAsDone = async (id) => {
  console.log(id);
  const res = await window.electronAPI.doneTask(id);
  console.log(res);
  window.location.reload();
};
const deleteTask = async (id) => {
  console.log(id);
  const res = await window.electronAPI.deleteTask(id);
  console.log(res);
  window.location.reload();
};

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
  var r,
    g,
    b = 0;
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
      var perc = (calDay(card.doc.start) / 30) * 100;
      perc = perc > 100 ? 99 : perc;
      // console.log(perc)
      return `    
      <div class="card" style="width: 15rem;text-align: center;min-width: 15em;border:none;cursur: pointer;" data-bs-toggle="modal" data-bs-target="#openCard${
        card.id
      }">
        <div class="single-chart">
          <svg viewBox="0 0 36 36" class="circular-chart" >
            <path class="circle-bg"
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
            ${calDay(card.doc.start) == 0 ? `<text x="18" y="20" class="percentage" style="font-size:0.50em;">Today</text>` :`<text x="18" y="19" class="percentage" style="font-size:0.70em;">${calDay(card.doc.start)}</text>`}
            <text x="18" y="24" class="percentage" style="font-size: 0.3em;">${
              calDay(card.doc.start) == 0 ? "" : "Days"
            }</text>
          </svg>
        </div>
        <div class="card-body">
          <h5 class="card-title">${card.doc.title}</h5>
          <p class="card-text">${card.doc.detail}</p>
        </div>
  </div>
  <div class="modal fade" id="openCard${
    card.id
  }" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header" style="background-color:${colorScale(perc)};" >
        <h5 class="modal-title" id="exampleModalLongTitle">${
          card.doc.title
        }</h5>
        <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <p class="due-text">Due : ${card.doc.start}</p>
        <p>"${card.doc.detail}"</p>
      </div>
      <div class="modal-footer">
        <button id="done-btn" type="button" class="btn btn-primary"  style="width: 100%;" onclick=\"MaskAsDone(\'${
          card.id
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
      var perc = (calDay(card.doc.start) / 30) * 100;
      perc = perc > 100 ? 99 : perc;
      // console.log(perc)
      return `    
      <div class="card" style="width: 15rem;text-align: center;min-width: 15em;border:none;cursur: pointer;" data-bs-toggle="modal" data-bs-target="#openDoneCard${card.id}">
        <div class="single-chart">
          <svg viewBox="0 0 36 36" class="circular-chart" >
            <path class="circle-bg"
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
            <text x="18" y="20" class="percentage">Done!</text>
          </svg>
        </div>
        <div class="card-body">
          <h5 class="card-title">${card.doc.title}</h5>
          <p class="card-text">${card.doc.detail}</p>
        </div>
  </div>
  <div class="modal fade" id="openDoneCard${card.id}" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header" style="background-color: gray;" >
        <h5 class="modal-title" id="exampleModalLongTitle">${card.doc.title}</h5>
        <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <p>"${card.doc.detail}"</p>
        <p class="due-text">Due : ${card.doc.start}</p>
      </div>
      <div class="modal-footer">
        <button id="done-btn" type="button" class="btn btn-danger" data-bs-dismiss="modal" style="width: 100%;" onclick=\"deleteTask(\'${card.id}\')\" >Delete</button>
      </div>
    </div>
  </div>
</div>
  `;
    })
    .join(" ");
};

setInterval(function() {window.location.reload()}, 3600000)

window.onload = async function () {
  tasks = await window.electronAPI.getTasks()
  if (tasks.length != null) {
    sort_task = tasks
      .sort((t1, t2) => new Date(t1.doc.start) - new Date(t2.doc.start))
      .filter((t) => t.doc.status == "undone");

    window.localStorage.setItem('undone_task', JSON.stringify(sort_task))

    outOfDate = sort_task.filter((t) => calDay(t.doc.start) < 0);
    sort_task = sort_task.filter((t) => calDay(t.doc.start) >= 0);
    done_task = tasks.filter((t) => t.doc.status == "done");

    if (outOfDate.length) {
      // console.log(outOfDate.length)
      outOfDate.map(
        async (task) => await window.electronAPI.deleteTask(task.id)
      );
    }
    console.log(sort_task)
    cardShow.innerHTML += returnCard(sort_task);
    doneCardShow.innerHTML += returnDoneCard(done_task);
  }
  console.log(done_task)
  console.log(outOfDate)
  console.log(sort_task)
  window.localStorage.setItem('tasks',JSON.stringify(sort_task));
  // console.log(username)
};


