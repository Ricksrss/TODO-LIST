const renderTasksProgressData = (tasks) => {
    let tasksProgress;
    const tasksProgressDOM = document.getElementById('tasks-progress');

    if (tasksProgressDOM) tasksProgress = tasksProgressDOM;
    else {
        const newTaskProgressDOM = document.createElement('div');
        newTaskProgressDOM.id = 'tasks-progress';
        document.getElementsByTagName('footer')[0].appendChild(newTaskProgressDOM);
        tasksProgress = newTaskProgressDOM;
    }

    const doneTasks = tasks.filter(({ checked }) => checked).length
    const totalTasks = tasks.length;
    tasksProgress.textContent = `${doneTasks}/${totalTasks} concluídas`;

}


const getTasksFromLocalStorage = () => {
    const localTasks = JSON.parse(window.localStorage.getItem('tasks'));
    return localTasks ? localTasks : [];
}

const setTasksInLocalStorage = (tasks) => {
    window.localStorage.setItem('tasks', JSON.stringify(tasks));
}

const removeTask = (taskId) => {
    const tasks = getTasksFromLocalStorage();
    const updatedTasks = tasks.filter(({ id }) => parseInt(id) !== parseInt(taskId));
    setTasksInLocalStorage(updatedTasks)
    renderTasksProgressData(updatedTasks)

    document
        .getElementById("todo-list")
        .removeChild(document.getElementById(taskId));
};

const removeDoneTask = () => {
    const tasks = getTasksFromLocalStorage()
    const taskToRemove = tasks.filter(({ checked }) => checked).map(({ id }) => id);

    const updatedTasks = tasks.filter(({ checked }) => !checked);
    setTasksInLocalStorage(updatedTasks)
    renderTasksProgressData(updatedTasks)


    taskToRemove.forEach((id) => {
        document.getElementById("todo-list").removeChild(document.getElementById(id));
    });
};


const createTaskListItem = (task, checkbox) => {
    const toDo = document.createElement('li');

    const removeTaskButton = document.createElement('button');
    removeTaskButton.textContent = 'x';
    removeTaskButton.ariaLabel = 'remover tarefa';

    removeTaskButton.onclick = () => removeTask(task.id);

    toDo.id = task.id;
    toDo.appendChild(checkbox);
    toDo.appendChild(removeTaskButton);
    list.appendChild(toDo);
    return toDo;
};

const onCheckBoxClick = (event) => {
    const [id] = event.target.id.split('-');
    const tasks = getTasksFromLocalStorage();

    const updatedTasks = tasks.map((task) => {
        return parseInt(task.id) === parseInt(id)
            ? { ...task, checked: event.target.checked }
            : task
    })
    setTasksInLocalStorage(updatedTasks)
    renderTasksProgressData(updatedTasks)

}

const getCheckboxInput = ({ id, description, checked }) => {
    const checkbox = document.createElement('input');
    const label = document.createElement('label');
    const wrapper = document.createElement('div');
    const checkboxId = `${id}-checkbox`;

    checkbox.type = 'checkbox';
    checkbox.id = checkboxId;
    checkbox.checked = checked || false;
    checkbox.addEventListener('change', onCheckBoxClick)

    label.textContent = description;
    label.htmlFor = checkboxId;

    wrapper.className = 'checkbox-label-container';

    wrapper.appendChild(checkbox);
    wrapper.appendChild(label);

    return wrapper;
};

const getNewTaskId = () => {
    const tasks = getTasksFromLocalStorage()
    const lastId = tasks[tasks.length - 1]?.id;
    return lastId ? lastId + 1 : 1;
};

const getNewTaskData = (event) => {
    const description = event.target.elements.description.value;
    const id = getNewTaskId();

    return { description, id };
};

const getCreatedTaskInfo = (event) => new Promise((resolve) =>
    setTimeout(() => {
        resolve(getNewTaskData(event))
    }, 3000));


const createTask = async (event) => {
    event.preventDefault();
    document.getElementById('save-task').setAttribute('disabled', true)

    const newTaskData = await getCreatedTaskInfo(event);
    const checkbox = getCheckboxInput(newTaskData);
    createTaskListItem(newTaskData, checkbox);

    const tasks = getTasksFromLocalStorage();
    const updatedTasks = [...tasks, { id: newTaskData.id, description: newTaskData.description, checked: false }];

    setTasksInLocalStorage(updatedTasks)
    renderTasksProgressData(updatedTasks)


    document.getElementById('description').value = ''
    document.getElementById('save-task').removeAttribute('disabled')
};

let list;

window.onload = function () {
    const form = document.getElementById('create-todo-form');
    list = document.getElementById('todo-list');

    form.addEventListener('submit', createTask);

    const tasks = getTasksFromLocalStorage();
    tasks.forEach((task) => {
        const checkbox = getCheckboxInput(task);
        createTaskListItem(task, checkbox);
    });

    renderTasksProgressData(tasks)
};
