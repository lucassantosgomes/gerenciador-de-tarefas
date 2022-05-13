'use strict'
const btnImportante = document.getElementById('important')
const btnNormal = document.getElementById('normal')
btnImportante.addEventListener('click', () => {
  const inputValue = getValue()
  addTask('important', inputValue)
})
btnNormal.addEventListener('click', () => {
  const inputValue = getValue()
  addTask('normal', inputValue)
})
const obj = {
  idExisting: []
}
for (let i = 0; i <= 200; i++) {
  if (localStorage.getItem(i)) {
    obj.idExisting.push(i)
    replaceTextCreateTaskStoredLocal(i)
  }
}
function replaceTextCreateTaskStoredLocal(key) {
  let storedText = localStorage.getItem(key)
  if (storedText.includes('imptt')) {
    storedText = storedText.replace('imptt', '')
    if (storedText.includes(' dn')) {
      storedText = storedText.replace(' dn', '')
      addTask('important', storedText, key)
      taskDone(key)
    } else addTask('important', storedText, key)
  } else {
    if (storedText.includes(' dn')) {
      storedText = storedText.replace(' dn', '')
      addTask('normal', storedText, key)
      taskDone(key)
    } else addTask('normal', storedText, key)
  }
}
function getValue() {
  return document.getElementById('write-task').value
}
function createElementHTML(stringElement) {
  const elemento = document.createElement(stringElement)
  return elemento
}
function addTask(level, inputValue, identification) {
  if (inputValue.length > 0) {
    let randomId
    if (!identification) {
      randomId = randomIdGenerator()
      level === 'important'
        ? localStorage.setItem(randomId, inputValue + ' imptt')
        : localStorage.setItem(randomId, inputValue)
    } else randomId = identification
    let taskLevel = document.getElementById('tasks-' + level)
    let task = createElementHTML('li')
    task.classList.add('task')
    const textTask = createElementHTML('p')
    document.getElementById('write-task').value = ''
    task.id = randomId
    let footerTask = addFooterTask(randomId)
    textTask.id = randomId + 'text'
    textTask.textContent = inputValue
    task.appendChild(textTask)
    task.appendChild(footerTask)
    taskLevel.appendChild(task)
  }
}
function addFooterTask(taskId) {
  const conteinerFooter = createElementHTML('div')
  conteinerFooter.classList.add('conteiner-footer-task')
  const checkBox = addCheckBox(taskId)
  conteinerFooter.appendChild(checkBox)
  const icons = addIcnos(taskId)
  conteinerFooter.appendChild(icons)
  const date = addDate()
  conteinerFooter.appendChild(date)
  return conteinerFooter
}
function addIcnos(taskId) {
  const icons = createElementHTML('div')
  icons.classList.add('icons')
  const trash = addIconTrash(taskId)
  icons.appendChild(trash)
  const edit = addIconEdit(taskId)
  icons.appendChild(edit)
  const arrowsUpDown = addIconArrows(taskId)
  icons.appendChild(arrowsUpDown)
  return icons
}

function addCheckBox(taskId) {
  const labelCheck = createElementHTML('label')
  labelCheck.textContent = 'feito'
  const checkBox = createElementHTML('input')
  checkBox.type = 'checkbox'
  checkBox.title = 'okay'
  checkBox.id = 'checkBox' + taskId
  checkBox.classList.add('check-box')
  checkBox.addEventListener('change', () =>
    checkBox.checked ? taskDone(taskId) : noTaskDone(taskId)
  )
  labelCheck.appendChild(checkBox)
  return labelCheck
}
function addIconTrash(taskId) {
  const trash = createElementHTML('img')
  trash.src = './imagens/icone-lixeira.png'
  trash.alt = 'icone lixeira'
  trash.title = 'apagar'
  trash.addEventListener('click', () => {
    const task = document.getElementById(taskId)
    obj.idExisting.splice(obj.idExisting.indexOf(taskId), 1)
    task.parentNode.removeChild(task)
    localStorage.removeItem(taskId)
  })
  return trash
}
function addIconEdit(taskId) {
  const edit = document.createElement('img')
  edit.src = './imagens/icone-editar.png'
  edit.alt = 'icone editar'
  edit.title = 'editar'
  edit.addEventListener('click', () => {
    const task = document.getElementById(taskId)
    const textTask = document.getElementById(taskId + 'text').textContent
    document.getElementById('write-task').value = textTask
    task.parentNode.removeChild(task)
    localStorage.removeItem(taskId)
  })
  return edit
}
function addIconArrows(taskId) {
  const arrowsUpDown = document.createElement('img')
  arrowsUpDown.src = './imagens/icone-setas.png'
  arrowsUpDown.alt = 'icone setas'
  arrowsUpDown.title = 'mudar nivel'
  arrowsUpDown.addEventListener('click', () => {
    const task = document.getElementById(taskId)
    const elementPai = task.parentNode
    elementPai.id === 'tasks-important'
      ? document.getElementById('tasks-normal').appendChild(task)
      : document.getElementById('tasks-important').appendChild(task)
  })
  return arrowsUpDown
}
function addDate() {
  const nowDate = new Date()
  const date = createElementHTML('p')
  date.classList.add('date')
  date.textContent = `${nowDate.getDate()}/${nowDate.getMonth() + 1}`
  return date
}
function randomIdGenerator() {
  let randomId = Math.floor(Math.random() * 200 + 1)
  if (obj.idExisting.length > 0) {
    for (let i = 0; i <= obj.idExisting.length; i++)
      if (obj.idExisting[i] === randomId) randomIdGenerator()
    obj.idExisting.push(randomId)
    return randomId
  }
  obj.idExisting.push(randomId)
  return randomId
}
function taskDone(taskId) {
  const task = document.getElementById(taskId)
  task.classList.add('task-done')
  let textTask = localStorage.getItem(taskId)
  if (!textTask.includes(' dn')) {
    localStorage.setItem(taskId, `${textTask} dn`)
  }
  let checkbox = document.querySelector(`#checkBox${taskId}`)
  checkbox.checked = true
}
function noTaskDone(taskId) {
  const task = document.getElementById(taskId)
  task.classList.remove('task-done')
  let textTask = localStorage.getItem(taskId)
  textTask = textTask.replace(' dn', '')
  localStorage.setItem(taskId, textTask)
}
