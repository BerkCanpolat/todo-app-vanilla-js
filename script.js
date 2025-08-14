// Nav menu dropdown
const secretMenu = document.querySelector(".main-header__secret-menu");
const secretMenuClick = document.querySelector(".header-h1");

secretMenuClick.addEventListener("mouseenter", openSecretMenu);
secretMenu.addEventListener("mouseenter", openSecretMenu);

secretMenuClick.addEventListener("mouseleave", checkCloseMenu);
secretMenu.addEventListener("mouseleave", checkCloseMenu);

let menuTimer;

function openSecretMenu() {
  clearTimeout(menuTimer);
  secretMenu.classList.add("secret-menu-js");
}

function checkCloseMenu() {
  menuTimer = setTimeout(() => {
    secretMenu.classList.remove("secret-menu-js");
  }, 200);
}

// Todo-Lists
const todoLists = document.getElementById("todo-lists");
const lengthTodo = document.querySelector(".span-length");
const formAdd = document.getElementById("form-add");
const compTodo = document.querySelector(".comp-todo");
const categoryButtons = document.querySelectorAll(
  ".left-container__cat-btn button"
);
const btnDanger = document.querySelector(".btn-danger");
const successAlert = document.querySelector(".success");
const failAlert = document.querySelector(".fail");
const changeTaskText = document.querySelector(".righ-container__h1");

//App Init
document.addEventListener("DOMContentLoaded", function () {
  loadElements();

  formAdd.addEventListener("submit", formHandle);

  for (let btn of categoryButtons) {
    btn.addEventListener("click", catBtnFunc);
  }

  alertItems();
  btnDanger.addEventListener("click", clearAll);
});


//Local Storage
function mySaveLocale() {
  const myList = todoLists.querySelectorAll(".ul-main__li-submain");

  const arrayList = [];

  for (let i of myList) {
    const id = i.getAttribute("item-id");
    const text = i.querySelector(".li-submain__text").textContent;
    const completed = i.hasAttribute("item-completed");

    arrayList.push({ id, text, completed });
  }

  localStorage.setItem("todos", JSON.stringify(arrayList));
}

//Load Element
function loadElements() {
  const items = JSON.parse(localStorage.getItem("todos")) || [];

  lengthTodo.textContent = items.length ? `${items.length}` : "0";

  completeTodoLength();

  for (let todo of items) {
    const li = createElemen(todo);
    todoLists.appendChild(li);
  }
}

//Create Function
function createElemen(item) {
  const li = document.createElement("li");
  li.className = "ul-main__li-submain";
  li.setAttribute("item-id", item.id);
  li.toggleAttribute("item-completed", item.completed);

  const input = document.createElement("input");
  input.classList.add("li-submain__input");
  input.type = "checkbox";
  input.placeholder = "Add a new task";
  input.checked = item.completed;
  input.addEventListener("change", changeInputComp);

  const div = document.createElement("div");
  div.classList.add("li-submain__text");
  div.textContent = item.text;
  div.addEventListener("click", editModeOpen);
  div.addEventListener("blue", editModeClose);
  div.addEventListener("keydown", editModeCancel);

  const i = document.createElement("i");
  i.className = "fa-solid fa-circle-minus delete-btn";
  i.addEventListener("click", trashBtn);

  li.appendChild(input);
  li.appendChild(div);
  li.appendChild(i);
  return li;
}

//Form submit
function formHandle(e) {
  e.preventDefault();
  console.log(e.target);

  const input = document.getElementById("input-add");

  if (input.value.trim().length == 0) {
    failAlert.style.display = "block";
    setTimeout(() => {
      failAlert.style.display = "none";
    }, 2000);
    return;
  }

  addTask(input);
  successAlert.style.display = "block";
  setTimeout(() => {
    successAlert.style.display = "none";
  }, 2000);
}

//Add Task Function
function addTask(input) {
  const item = createElemen({
    id: generateId(),
    text: input.value,
    completed: false,
  });

  todoLists.appendChild(item);
  mySaveLocale();
  updateFilter();
  alertItems();

  input.value = "";

  lengthTodo.textContent = todoLists.children.length
    ? `${todoLists.children.length}`
    : "0";
}

//Random id
function generateId() {
  return Date.now().toString();
}

//Remove Function
function trashBtn(e) {
  const confettiUL = todoLists.querySelectorAll("li").length;

  if (confettiUL > 0) {
    console.log(e.target);
    const trash = e.target.parentElement;

    todoLists.removeChild(trash);

    if (todoLists.querySelectorAll("li").length === 0) {
      confettiFunction();
    }
  } else {
    confettiFunction();
  }

  lengthTodo.textContent = todoLists.children.length
    ? `${todoLists.children.length}`
    : "0";
  completeTodoLength();
  mySaveLocale();
  alertItems();
}

//Input Change Function
function changeInputComp(e) {
  console.log(e.target.parentElement);
  const li = e.target.parentElement;

  li.toggleAttribute("item-completed", e.target.checked);

  updateFilter();
  completeTodoLength();
  mySaveLocale();

  const allInputs = document.querySelectorAll('li input[type="checkbox"]');
  const allCompleted = [...allInputs].every((input) => input.checked);

  if (allCompleted && allInputs.length > 0) {
    startConfetti();
  }
}

//Completed Todo Length Function
function completeTodoLength() {
  const list = todoLists.children;

  let compTodoLength = 0;

  for (let comp of list) {
    const checkbox = comp.querySelector('input[type="checkbox"]');

    if (checkbox && checkbox.checked) {
      compTodoLength++;
    }
  }

  compTodo.textContent = `${compTodoLength}`;
}

//Filter Categories
function catBtnFunc(e) {
  const btnTarget = e.target;

  for (let btn of categoryButtons) {
    btn.classList.add("btn-secondary");
    btn.classList.remove("btn-primary");
  }

  btnTarget.classList.add("btn-primary");
  btnTarget.classList.remove("btn-secondary");

  console.log(btnTarget.getAttribute("item-filter"));
  catBtnFilters(btnTarget.getAttribute("item-filter"));
}

//Filter Categories Function
function catBtnFilters(filterType) {
  const list = todoLists.querySelectorAll("li");

  for (let btnFilter of list) {
    btnFilter.classList.remove("d-flex");
    btnFilter.classList.remove("d-none");

    const completed = btnFilter.hasAttribute("item-completed");

    if (filterType == "completed") {
      btnFilter.classList.toggle(completed ? "d-flex" : "d-none");
      changeTaskText.textContent = "Completed Tasks";
    } else if (filterType == "uncompleted") {
      btnFilter.classList.toggle(completed ? "d-none" : "d-flex");
      changeTaskText.textContent = "Uncompleted Tasks";
    } else {
      btnFilter.classList.toggle("d-flex");
      changeTaskText.textContent = "All Tasks";
    }
  }
}

//Update Filter Categories Function
function updateFilter() {
  const updateBtn = document.querySelector(".btn-primary[item-filter]");

  catBtnFilters(updateBtn.getAttribute("item-filter"));
}

//Deletes all tasks
function clearAll() {
  todoLists.innerHTML = "";
  localStorage.clear();

  alertItems();
  completeTodoLength();

  lengthTodo.textContent = todoLists.children.length
    ? `${todoLists.children.length}`
    : "0";
}

//alerts you depending on whether it is a task or not
function alertItems() {
  const li = todoLists.querySelectorAll("li").length == 0;

  const alert = document.querySelector(".no-todo-items-alert");
  const categoryDiv = document.querySelector(".left-container__cat-btn");

  alert.classList.toggle("d-none", !li);
  categoryDiv.classList.toggle("d-none", li);
  btnDanger.classList.toggle("d-none", li);
}

//allows us to update the added tasks
function editModeOpen(e) {
  const li = e.target.parentElement;
  if (li.hasAttribute("item-completed") == false) {
    e.target.contentEditable = true;
  }
}

//allows us to exit the update
function editModeClose(e) {
  e.target.contentEditable = false;

  mySaveLocale();
}

//Pressing the Enter key saves and closes the update.
function editModeCancel(e) {
  if (e.key == "Enter") {
    e.preventDefault();
    editModeClose(e);
  }
}

//set off confetti
function confettiFunction() {
  var count = 200;
  var defaults = {
    origin: { y: 0.7 },
  };

  function fire(particleRatio, opts) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });
  fire(0.2, {
    spread: 60,
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
}

//set off confetti
function startConfetti() {
  var defaults = {
    spread: 360,
    ticks: 50,
    gravity: 0,
    decay: 0.94,
    startVelocity: 30,
    colors: ["FFE400", "FFBD00", "E89400", "FFCA6C", "FDFFB8"],
  };

  function shoot() {
    confetti({
      ...defaults,
      particleCount: 40,
      scalar: 1.2,
      shapes: ["star"],
    });

    confetti({
      ...defaults,
      particleCount: 10,
      scalar: 0.75,
      shapes: ["circle"],
    });
  }

  setTimeout(shoot, 0);
  setTimeout(shoot, 100);
  setTimeout(shoot, 200);
  setTimeout(shoot, 300);
  setTimeout(shoot, 400);
}
