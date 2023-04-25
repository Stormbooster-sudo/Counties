const addTask = async (task, modal) => {
    if((task.title == "") || (task.start == null)){
        var reqLabel = document.getElementsByClassName("require-label")
        Array.prototype.forEach.call(reqLabel, function(el) {
            el.innerText = "*require"
        })
        return
    }
    const res = await window.electronAPI.addTask(task)
    if (res.ok) {
        await fetchData()
        task = { title: "", detail: "", start: null, time: { H: "00", M: "00" }, status: 'undone', color: '#46AF5F' }
        if (window.location.href.split('/').pop() == "calendar.html") {
            window.location.reload()
        }
        modal.hide()
    }
}

const markAsDone = async (id) => {
    const res = await window.electronAPI.doneTask(id);
    if (res.ok) {
        await fetchData()
        if (window.location.href.split('/').pop() == "calendar.html") {
            window.location.reload()
        }
    }
};

const deleteTask = async (id) => {
    const res = await window.electronAPI.deleteTask(id);
    if (res.ok) {
        await fetchData()
    }
};

const clearDoneTasks = async () => {
    const res = await window.electronAPI.deleteBatchTasks(done_task)
    if (res) {
        await fetchData()
    }
}