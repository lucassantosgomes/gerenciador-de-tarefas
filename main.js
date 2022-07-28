'use strict';
const btnImportante = document.getElementById('important');
const btnNormal = document.getElementById('normal');
const inputTask = document.getElementById('write-task');
const checkboxAddTask = document.getElementById('checkbox-add-task');
const sectionAddTask = document.getElementById('section-inputs-task');
const idExisting = [];
const semana = [
  'Domingo',
  'Segunda',
  'Terça',
  'Quarta',
  'Quinta',
  'Sexta',
  'Sábado'
];
function taskInLocalStorage() {
  for (let i = 0; i <= 200; i++) {
    localStorage.removeItem(i);
    const keyTask = `task${i}`;
    const taskStorage = localStorage.getItem(keyTask);
    if (taskStorage) {
      const taskStorageObj = JSON.parse(taskStorage);
      idExisting.push(taskStorageObj.id);
      addTask(taskStorageObj);
    }
  }
}
taskInLocalStorage();
function randomIdGenerator() {
  let randomId = Math.floor(Math.random() * 200 + 1);
  if (idExisting.includes(randomId)) randomIdGenerator();
  idExisting.push(randomId);
  return randomId;
}
function getDate() {
  const date = new Date();
  return `${semana[date.getDay()]}, ${date.getDate()}/${date.getMonth() + 1}`;
}
class PropsTask {
  constructor(level, text) {
    (this.level = level),
      (this.text = text),
      (this.date = getDate()),
      (this.done = false),
      (this.id = randomIdGenerator());
  }
}
btnImportante.addEventListener('click', () => {
  if (!inputTask.value) return;
  const datasTasks = new PropsTask('important', inputTask.value);
  localStorage.setItem(`task${datasTasks.id}`, JSON.stringify(datasTasks));
  console.log(datasTasks);
  addTask(datasTasks);
});
btnNormal.addEventListener('click', () => {
  if (!inputTask.value) return;
  const datasTasks = new PropsTask('normal', inputTask.value);
  localStorage.setItem(`task${datasTasks.id}`, JSON.stringify(datasTasks));
  console.log(datasTasks);
  addTask(datasTasks);
});
checkboxAddTask.addEventListener('change', () => {
  checkboxAddTask.checked
    ? (sectionAddTask.style.display = 'block')
    : (sectionAddTask.style.display = 'none');
});
function createElementHTML(stringElement) {
  const elemento = document.createElement(stringElement);
  return elemento;
}
function addTask(data) {
  let taskLevel = document.getElementById('tasks-' + data.level);
  let task = createElementHTML('li');
  task.classList.add('task');
  if (data.done) task.classList.add('task-done');
  const textTask = createElementHTML('p');
  document.getElementById('write-task').value = '';
  task.id = data.id;
  let footerTask = addFooterTask(data);
  textTask.id = data.id + 'text';
  textTask.textContent = data.text;
  task.appendChild(textTask);
  task.appendChild(footerTask);
  taskLevel.appendChild(task);
}
function addFooterTask(dataTask) {
  const conteinerFooter = createElementHTML('div');
  conteinerFooter.classList.add('conteiner-footer-task');
  const checkBox = addCheckBox(dataTask);
  conteinerFooter.appendChild(checkBox);
  const icons = addIcnos(dataTask);
  conteinerFooter.appendChild(icons);
  const getDate = addDate(dataTask.date);
  conteinerFooter.appendChild(getDate);
  return conteinerFooter;
}
function addIcnos(dataTask) {
  const icons = createElementHTML('div');
  icons.classList.add('icons');
  const trash = addIconTrash(dataTask.id);
  icons.appendChild(trash);
  const edit = addIconEdit(dataTask.id);
  icons.appendChild(edit);
  const arrowsUpDown = addIconArrows(dataTask);
  icons.appendChild(arrowsUpDown);
  return icons;
}
function addCheckBox(dataTask) {
  const labelCheck = createElementHTML('label');
  labelCheck.textContent = 'feito';
  const checkBox = createElementHTML('input');
  checkBox.type = 'checkbox';
  checkBox.title = 'okay';
  checkBox.id = 'checkBox' + dataTask.id;
  checkBox.classList.add('check-box');
  checkBox.checked = dataTask.done;
  checkBox.addEventListener('change', () =>
    checkBox.checked ? taskDone(dataTask) : noTaskDone(dataTask)
  );
  labelCheck.appendChild(checkBox);
  return labelCheck;
}
function addIconTrash(taskId) {
  const trash = createElementHTML('img');
  trash.src = './imagens/trash-outline.svg';
  trash.alt = 'icone lixeira';
  trash.title = 'apagar';
  trash.addEventListener('click', () => {
    const task = document.getElementById(taskId);
    idExisting.splice(idExisting.indexOf(taskId), 1);
    task.parentNode.removeChild(task);
    localStorage.removeItem(`task${taskId}`);
  });
  return trash;
}
function addIconEdit(taskId) {
  const edit = document.createElement('img');
  edit.src = './imagens/create-outline.svg';
  edit.alt = 'icone editar';
  edit.title = 'editar';
  edit.addEventListener('click', () => {
    const task = document.getElementById(taskId);
    const textTask = document.getElementById(taskId + 'text').textContent;
    document.getElementById('write-task').value = textTask;
    task.parentNode.removeChild(task);
    localStorage.removeItem(`task${taskId}`);
  });
  return edit;
}
function addIconArrows(dataTask) {
  const arrowsUpDown = document.createElement('img');
  arrowsUpDown.src = './imagens/swap-vertical-outline.svg';
  arrowsUpDown.alt = 'icone setas';
  arrowsUpDown.title = 'mudar nivel';
  arrowsUpDown.addEventListener('click', () => {
    const task = document.getElementById(dataTask.id);
    const elementPai = task.parentNode;
    if (elementPai.id === 'tasks-important') {
      document.getElementById('tasks-normal').appendChild(task);
      dataTask.level = 'normal';
      localStorage.setItem(`task${dataTask.id}`, JSON.stringify(dataTask));
    } else {
      document.getElementById('tasks-important').appendChild(task);
      dataTask.level = 'important';
      localStorage.setItem(`task${dataTask.id}`, JSON.stringify(dataTask));
    }
  });
  return arrowsUpDown;
}
function addDate(date) {
  const dateP = createElementHTML('p');
  dateP.classList.add('date');
  dateP.textContent = date;
  return dateP;
}
function taskDone(dataTask) {
  const task = document.getElementById(dataTask.id);
  task.classList.add('task-done');
  const checkbox = document.querySelector(`#checkBox${dataTask.id}`);
  checkbox.checked = true;
  dataTask.done = true;
  localStorage.setItem(`task${dataTask.id}`, JSON.stringify(dataTask));
}
function noTaskDone(dataTask) {
  const task = document.getElementById(dataTask.id);
  task.classList.remove('task-done');
  dataTask.done = false;
  localStorage.setItem(`task${dataTask.id}`, JSON.stringify(dataTask));
}
