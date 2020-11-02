const taskTextElement = document.getElementById('taskText');
const deadlineDateElement = document.getElementById('deadlineDate');
const  deadlineTimeElement = document.getElementById('deadlineTime');
function save() {
  const taskText = taskTextElement.value;
  const deadlineDate = deadlineDateElement.value;
  const deadlineTime = deadlineTimeElement.value;
  const deadline = deadlineTime
    ? new Date(`${deadlineDate} ${deadlineTime}`)
    : new Date(`${deadlineDate} 23:59:59`);
  taskTextElement.classList.add('is-invalid');
}

function validateInput() {
  
}