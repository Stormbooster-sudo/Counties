
const cardShow = document.getElementById("card-show");
var widgetStyle = ""

const returnCard = (cards) => {
  return cards
    .map((card) => {
      var minute = calDay(card.start, card.time.H, card.time.M)
      var hour = minute / 60
      var day = hour / 24
      var perc = (day / 30) * 100;
      perc = perc > 100 ? 99 : perc;
      return `    
  <div class="card ${widgetStyle}" style="text-align: center;;background: transparent;border: none;">
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
  <p class="card-text">${card.title}</p>
</div>
</div>
`;
    })
    .join(" ");
};

const displayCard = () => {
  cardShow.innerHTML = returnCard(JSON.parse(window.localStorage.getItem('tasks')));
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