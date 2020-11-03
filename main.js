const taskTextElement = document.getElementById('taskText');
const deadlineDateElement = document.getElementById('deadlineDate');
const deadlineTimeElement = document.getElementById('deadlineTime');
const ALERT_DANGER = 'alert-danger';
const ALERT_SUCCESS = 'alert-success';
const CHARS = '';

window.onload = function () {
  if (!localStorage.getItem('tasks')) {
    localStorage.setItem('tasks', '[]');
  }
  restrictPastDates();
  loadAllTasks();
};

function restrictPastDates() {
  const temp = new Date();
  const today = new Date(temp.getTime() - temp.getTimezoneOffset() * 60000)
    .toISOString()
    .split('T')[0];
  document.getElementById('deadlineDate').setAttribute('min', today);
}

function save() {
  try {
    const task = taskTextElement.value;
    const deadlineDate = deadlineDateElement.value;
    const deadlineTime = deadlineTimeElement.value;
    const deadline = deadlineTime
      ? new Date(`${deadlineDate} ${deadlineTime}`)
      : new Date(`${deadlineDate} 23:59:59`);
    resetInputsAlert();
    if (validateInput(task, deadline)) {
      const formattedDate = createFormattedDate(deadline);
      const newTaskObject = {
        task,
        deadlineDate: formattedDate,
        deadlineTime,
        created: Date.now(),
        done: false,
      };
      saveTask(newTaskObject);
      loadNewTask(newTaskObject);
      clearInputs();
    }
  } catch (error) {
    console.log(error);
  }
}

function loadNewTask(taskObject) {
  const newTask = document.createElement('div');
  let classes = [
    'd-flex',
    'justify-content-center',
    'col-lg-3',
    'col-md-4',
    'col-sm-6',
    'my-5',
  ];
  if (taskObject.done) {
    classes.push('done');
  }
  newTask.classList.add(...classes);
  newTask.id = taskObject.created;
  newTask.innerHTML = `<div class="card fade-in-2">
    <div class="row justify-content-end pt-4 px-3 pb-1">
    <button onclick="crossTask(${taskObject.created})" class="btn close">
      <i class="far fa-check-circle"></i>
      </button>
      <button onclick="deleteTask(${taskObject.created})" class="btn close">
        <i class="far fa-times-circle"></i>
      </button>
    </div>
    <div class="task-text text-center px-3">
      <p>
        ${taskObject.task}
      </p>
    </div>
    <div class="task-date-time mt-2 ml-3">
      <p class="underline">Deadline</p>
      <p>${taskObject.deadlineDate}</p>
      <p>${taskObject.deadlineTime}</p>
    </div>
  </div>`;
  const tasksRow = document.getElementById('tasksRow');
  tasksRow.insertBefore(newTask, tasksRow.firstChild);
}

function deleteTask(taskCreationDate) {
  let taskElement = document.getElementById(taskCreationDate);
  taskElement.classList.add('fade-out-1');
  window.setTimeout(function () {
    taskElement.remove();
  }, 500);
  let tasksArray = JSON.parse(localStorage.getItem('tasks'));
  tasksArray = tasksArray.filter((task) => {
    return task.created !== taskCreationDate;
  });
  localStorage.setItem('tasks', JSON.stringify(tasksArray));
}

function crossTask(taskCreationDate) {
  let tasksArray = JSON.parse(localStorage.getItem('tasks'));
  const taskIndex = tasksArray.findIndex(
    (task) => task.created === taskCreationDate
  );
  if (tasksArray[taskIndex].done) {
    document.getElementById(taskCreationDate).classList.remove('done');
    tasksArray[taskIndex].done = false;
  } else {
    document.getElementById(taskCreationDate).classList.add('done');
    tasksArray[taskIndex].done = true;
  }

  localStorage.setItem('tasks', JSON.stringify(tasksArray));
}

function loadAllTasks() {
  const tasks = JSON.parse(localStorage.getItem('tasks'));
  for (const task of tasks) {
    loadNewTask(task);
  }
}

function saveTask(taskObject) {
  let tasksArray = JSON.parse(localStorage.getItem('tasks'));
  tasksArray.push(taskObject);
  localStorage.setItem('tasks', JSON.stringify(tasksArray));
}

function createFormattedDate(date) {
  const day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);
  const month = new Intl.DateTimeFormat('en', { month: 'short' }).format(date);
  const year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
  return `${day}-${month}-${year}`;
}

function validateInput(task, deadline) {
  if (task.trim() == '') {
    showNewAlert('Task cannot be empty', ALERT_DANGER);
    taskTextElement.classList.add('is-invalid');
    return false;
  }

  const now = new Date();
  if (deadline < now) {
    showNewAlert('Task deadline has already passed', ALERT_DANGER);
    deadlineTimeElement.classList.add('is-invalid');
    return false;
  }

  showNewAlert('Task has been added', ALERT_SUCCESS);
  return true;
}

function resetInputsAlert() {
  taskTextElement.classList.remove('is-invalid');
  deadlineTimeElement.classList.remove('is-invalid');
}

function clearInputs() {
  resetInputsAlert();
  taskTextElement.value = '';
  deadlineDateElement.value = '';
  deadlineTimeElement.value = '';
}

function showNewAlert(msg, type) {
  window.scrollTo(0, 0);

  const alert = document.createElement('div');
  const container = document.getElementById('formContainer');
  const exclamationIcon = '<i class="fas fa-exclamation-circle"></i>';
  const checkIcon = '<i class="fas fa-check-square"></i>';

  alert.classList.add('alert');
  alert.classList.add('fade-in-1');
  alert.classList.add(type);
  alert.innerHTML =
    type == ALERT_DANGER ? `${exclamationIcon} ${msg}` : `${checkIcon} ${msg}`;

  container.insertBefore(alert, container.firstChild);

  window.setTimeout(function () {
    alert.classList.add('fade-out-1');
  }, 3000);
  window.setTimeout(function () {
    alert.remove();
  }, 3500);
}
