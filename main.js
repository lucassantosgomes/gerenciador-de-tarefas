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
    createTaskStoredLocal(i)
  }
}
function createTaskStoredLocal(key) {
  let storedText = localStorage.getItem(key)
  if (storedText.includes('imptt')) {
    let textReplace = storedText.replace('imptt', '')
    addTask('important', textReplace, key)
  } else addTask('normal', storedText, key)
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
    let taskLevel = document.getElementById('tasks-' + level)
    let task = createElementHTML('li')
    task.classList.add('task')
    task.textContent = inputValue
    document.getElementById('write-task').value = ''
    let randomId
    if (!identification) {
      randomId = randomIdGenerator()
      level === 'important'
        ? localStorage.setItem(randomId, inputValue + ' imptt')
        : localStorage.setItem(randomId, inputValue)
    } else randomId = identification
    task.id = randomId
    task.ondblclick = () => (task.style.backgroundColor = 'lime')
    let icons = addIcons(randomId)
    task.appendChild(icons)
    taskLevel.appendChild(task)
  }
}
function addIcons(randomId) {
  const icons = createElementHTML('div')
  icons.classList.add('icons')
  const trash = addIconTrash(randomId)
  icons.appendChild(trash)
  const edit = addIconEdit(randomId)
  icons.appendChild(edit)
  const arrowsUpDown = addIconArrows(randomId)
  icons.appendChild(arrowsUpDown)
  return icons
}
function addIconTrash(randomId) {
  const trash = createElementHTML('img')
  trash.src = './imagens/icone-lixeira.png'
  trash.alt = 'icone lixeira'
  trash.title = 'apagar'
  trash.addEventListener('click', () => {
    const task = document.getElementById(randomId)
    obj.idExisting.splice(obj.idExisting.indexOf(randomId), 1)
    task.parentNode.removeChild(task)
    localStorage.removeItem(randomId)
  })
  return trash
}
function addIconEdit(randomId) {
  const edit = document.createElement('img')
  edit.src = './imagens/icone-editar.png'
  edit.alt = 'icone editar'
  edit.title = 'editar'
  edit.addEventListener('click', () => {
    const task = document.getElementById(randomId)
    const textTask = task.textContent
    task.parentNode.removeChild(task)
    document.getElementById('write-task').value = textTask
    localStorage.removeItem(randomId)
  })
  return edit
}
function addIconArrows(randomId) {
  const arrowsUpDown = document.createElement('img')
  arrowsUpDown.src = './imagens/icone-setas.png'
  arrowsUpDown.alt = 'icone setas'
  arrowsUpDown.title = 'mudar nivel'
  arrowsUpDown.addEventListener('click', () => {
    const task = document.getElementById(randomId)
    const elementPai = task.parentNode
    elementPai.id === 'tasks-important'
      ? document.getElementById('tasks-normal').appendChild(task)
      : document.getElementById('tasks-important').appendChild(task)
  })
  return arrowsUpDown
}
function randomIdGenerator() {
  let randomId = Math.floor(Math.random() * 200)
  if (obj.idExisting.length > 0) {
    for (let i = 0; i <= obj.idExisting.length; i++)
      if (obj.idExisting[i] === randomId) randomIdGenerator()
    obj.idExisting.push(randomId)
    return randomId
  }
  obj.idExisting.push(randomId)
  return randomId
}
