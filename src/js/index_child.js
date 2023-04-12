const cardShow = document.getElementById("card-show");
const calDay = (d) => {
  var date1 = new Date(d);
  var date2 = new Date();
  var difDate = date1.getTime() - date2.getTime();
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
      var perc = (calDay(card.data.start) / 30) * 100;
      perc = perc > 100 ? 99 : perc;
      console.log(perc);
      return `    
  <div class="card" style="text-align: center;;background: transparent;border: none;">
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
    <text x="18" y="19" class="percentage" style="font-size:0.45em;">${calDay(card.data.start) == 0 ? "Today" : calDay(card.data.start)}</text>
    <text x="18" y="24" class="percentage" style="font-size: 0.3em;">${calDay(card.data.start) == 0 ? "" : "Days"}</text>
  </svg>
</div>
<div class="card-body">
  <p class="card-text">${card.data.title}</p>
</div>
</div>
`;
    })
    .join(" ");
};
window.onload = async function () {
  const tasks = await window.electronAPI.getTasks();
  var sort_task = tasks
    .sort((t1, t2) => new Date(t1.data.start) - new Date(t2.data.start))
    .filter((t) => t.data.status == "undone");
  var outOfDate = sort_task.filter((t) => calDay(t.data.start) < 0)
  if(outOfDate.length){
    // console.log(outOfDate.length)
    outOfDate.map(async task  => await window.electronAPI.deleteTask(task.id))
}
  // console.log(sort_task);
  cardShow.innerHTML = returnCard(sort_task);
};