import { calTime } from "./utilities.js"
const fetch = async () => {
    var sort_task = []
    var outOfDate = []
    var done_task = []
    var tasks = await window.electronAPI.getTasks()
    tasks = tasks.map((t) => t.doc)
    if (tasks.length != null) {
        sort_task = tasks
            .sort((t1, t2) => calTime(t1.start, t1.time.H, t1.time.M) - calTime(t2.start, t2.time.H, t2.time.M))
            .filter((t) => t.status == "undone");

        window.localStorage.setItem('undone_task', JSON.stringify(sort_task))

        outOfDate = sort_task.filter((t) => calTime(t.start, t.time.H, t.time.M) < 0);
        sort_task = sort_task.filter((t) => calTime(t.start, t.time.H, t.time.M) >= 0);
        done_task = tasks.filter((t) => t.status == "done");

        if (outOfDate.length) {
            outOfDate.map(
                async (task) => await window.electronAPI.deleteTask(task._id)
            );
        }
        window.localStorage.setItem('tasks', JSON.stringify(sort_task));
        window.localStorage.setItem('done_tasks', JSON.stringify(done_task));
    }
    return {sort_task, done_task}
}
export default fetch