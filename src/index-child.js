import { calTime, colorScale } from "./utils/utilities.js";
import DBcrud from "./utils/DBcrud.js";
const db = new DBcrud();
const cardShow = document.getElementById("card-show");
var widgetStyle = ""

cardShow.addEventListener("mouseover", (event) => {
  event.preventDefault()
  cardShow.style.cursor = "pointer";
  return false;
}, false)

const returnCard = (cards) => {
  return cards
    .map((card) => {
      var minute = calTime(card.start, card.time.H, card.time.M)
      var hour = minute / 60
      var day = hour / 24
      var perc = (day / 30) * 100;
      perc = perc > 100 ? 99 : perc;
      return `    
  <div class="card" style="text-align: center;background: transparent;border: none;">
<div class="single-chart">
  <svg viewBox="0 0 36 36" class="circular-chart" >
    <path class="circle-bg ${widgetStyle}"
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
    <text x="18" y="21" class="percentage ${widgetStyle}" style="font-size:0.8em;">${day > 1 ? Math.ceil(day) : hour > 1 ? Math.ceil(hour) : minute}</text>
    <text x="18" y="25" class="percentage ${widgetStyle}" style="font-size: 0.3em;">${day > 1 ? "Days" : hour > 1 ? "Hours" : "Minutes"}</text>
  </svg>
</div>
<div class="card-body">
  <p class="card-text" style="${widgetStyle == "light-mode" ? "color: #111;" : "color: white;"}">${card.title}</p>
</div>
</div>
`;
    })
    .join(" ");
};

//re-calculate time and re-render cards
const displayCard = () => {
  var tasks = JSON.parse(window.localStorage.getItem('tasks'))
  var outOfDate = tasks.filter((t) => calTime(t.start, t.time.H, t.time.M) < 0);
  if(outOfDate.lenght){
    outOfDate.map(async (t)=> await db.deleteTask(t.id))
  }
  tasks = JSON.parse(window.localStorage.getItem('tasks'))
  cardShow.innerHTML = returnCard(tasks);
}

window.onload = async function () {
  var mainWidget = document.getElementById('widget-main')
  var widgetTransparent = window.localStorage.getItem('widget-transparent')
  mainWidget.style.background = `rgba(0, 0, 0, ${widgetTransparent})`
  if (window.localStorage.getItem("light-mode-widget") == 'true') {
    mainWidget.style.background = `rgba(225, 225, 225, ${widgetTransparent})`
    widgetStyle = "light-mode"
  }
  displayCard()
};

setInterval(displayCard, 60000)