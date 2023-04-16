const alertModal = new bootstrap.Modal('#alertModal')
const confirmButton = document.getElementById("confirm-change")

document.addEventListener("DOMContentLoaded", function () {
    var calendarEl = document.getElementById("calendar");
    window.onload = async function () {
      const tasks = JSON.parse(await window.localStorage.getItem('undone_task'))
      var tasks_data = tasks.map((t) =>t.doc)
      tasks_data.map((t) => t.id = t._id)
      console.log(tasks_data)
      var event = [{id: '0123456', start: '2023-04-17', title: 'testtt'}]
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
          console.log(info.event.id)
          console.log(info.event.startStr)
          console.log(info.event)
          const data = {id: info.event.id, start: info.event.startStr}
          alertModal.show()
          confirmButton.addEventListener('click', async function(event) {
            const res = await window.electronAPI.updateDateTask(data)
            alertModal.hide()
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
