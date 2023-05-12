class DBcrud {
    addTask = async (task) => {
        const res = await window.electronAPI.addTask(task)
        if (res.ok) {
            return 1;
        }
        return 0;
    }

    markAsDone = async (id) => {
        const res = await window.electronAPI.doneTask(id);
        if (res.ok) {
            return 1;
        }
        return 0;
    };

    deleteTask = async (id) => {
        const res = await window.electronAPI.deleteTask(id);
        if (res.ok) {
            return 1;
        }
        return 0;
    };

    clearDoneTasks = async (done_task) => {
        const res = await window.electronAPI.deleteBatchTasks(done_task)
        if (res) {
            return 1;
        }
        return 0;
    }

    updateDateTask = async (update_data) => {
        const res = await window.electronAPI.updateDateTask(update_data);
        if(res){
            return 1;
        }
        return 0;
    }
}

export default DBcrud
