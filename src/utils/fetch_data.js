var sort_task = []
var outOfDate = []
var done_task = []

const fetchData = async () => {
    var tasks = await window.electronAPI.getTasks()
    tasks = tasks.map((t) => t.doc)
    if (tasks.length != null) {
        sort_task = tasks
            .sort((t1, t2) => calDay(t1.start, t1.time.H, t1.time.M) - calDay(t2.start, t2.time.H, t2.time.M))
            .filter((t) => t.status == "undone");

        window.localStorage.setItem('undone_task', JSON.stringify(sort_task))

        outOfDate = sort_task.filter((t) => calDay(t.start, t.time.H, t.time.M) < 0);
        sort_task = sort_task.filter((t) => calDay(t.start, t.time.H, t.time.M) >= 0);
        done_task = tasks.filter((t) => t.status == "done");

        if (outOfDate.length) {
            outOfDate.map(
                async (task) => await window.electronAPI.deleteTask(task._id)
            );
        }
    }
    if (window.location.href.split('/').pop() == "index.html") {
        cardShow.innerHTML = returnCard(sort_task);
        taskCount.innerText = sort_task.length
        doneCardShow.innerHTML = returnDoneCard(done_task);
        doneTaskCount.innerText = done_task.length
        window.localStorage.setItem('tasks', JSON.stringify(sort_task));
    }
}