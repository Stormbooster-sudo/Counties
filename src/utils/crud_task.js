const addTask = async (task) => {
    const res = await window.electronAPI.addTask(task)
    if (res.ok) {
        await fetchData()
        if (window.location.href.split('/').pop() == "calendar.html") {
            window.location.reload()
        }
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