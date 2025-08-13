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
const categoryButtons = document.querySelectorAll(".left-container__cat-btn button");

loadElements();

formAdd.addEventListener("submit", formHandle);

for(let btn of categoryButtons) {
    btn.addEventListener("click", catBtnFunc);
}

function mySaveLocale() {
    const myList = todoLists.querySelectorAll(".ul-main__li-submain");

    const arrayList = [];

    for(let i of myList) {
        const id = i.getAttribute("item-id");
        const text = i.querySelector(".li-submain__text").textContent;
        const completed = i.hasAttribute("item-completed");

        arrayList.push({id,text,completed});
    }

    localStorage.setItem("todos", JSON.stringify(arrayList));
}

function loadElements() {
    // const items = [
    //     {id:1, text: "Ben yazdım", completed: false},
    //     {id:2, text: "Beşiktaş ulan", completed: true},
    //     {id:3, text: "Olcak mı", completed: false},
    //     {id:4, text: "Length test", completed: false},
    // ];

    const items = JSON.parse(localStorage.getItem("todos")) || [];


    lengthTodo.textContent = items.length ? `${items.length}` : "load items";

    completeTodoLength()
    

    for(let todo of items) {
        const li = createElemen(todo);
        todoLists.appendChild(li);
    }
}

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

    const i = document.createElement("i");
    i.className = "fa-solid fa-circle-minus delete-btn";
    i.addEventListener("click", trashBtn);

    li.appendChild(input);
    li.appendChild(div);
    li.appendChild(i);
    return li;
}

function formHandle(e) {
    e.preventDefault();
    console.log(e.target);

    const input = document.getElementById("input-add");

    if(input.value.trim().length == 0) {
        alert("Birşey girmelisin");
        return;
    }

    addTask(input);
    
}

function addTask(input) {
    const item = createElemen({
        id: generateId(),
        text: input.value,
        completed: false,
    });

    
    todoLists.appendChild(item);
    mySaveLocale()
    updateFilter();
    
    input.value = "";

    lengthTodo.textContent = todoLists.children.length ? `${todoLists.children.length}` : "Not Todos";
}

function generateId() {
    return Date.now().toString();
}

function trashBtn(e) {
    console.log(e.target);
    const trash = e.target.parentElement;

    todoLists.removeChild(trash);

    lengthTodo.textContent = todoLists.children.length ? `${todoLists.children.length}` : "Not Todos";
    completeTodoLength();
    mySaveLocale()
    
}

function changeInputComp(e) {
    console.log(e.target.parentElement);
    const li = e.target.parentElement;

    li.toggleAttribute("item-completed", e.target.checked);

    updateFilter(); 
    completeTodoLength();
    mySaveLocale()
}

function completeTodoLength() {
    const list = todoLists.children;

    let compTodoLength = 0;

    for(let comp of list) {
        const checkbox = comp.querySelector('input[type="checkbox"]');

        if(checkbox && checkbox.checked) {
            compTodoLength++;
        }
    };

    compTodo.textContent =  `${compTodoLength}`;
}

function catBtnFunc(e) {    
    const btnTarget = e.target;

    for(let btn of categoryButtons) {
        btn.classList.add("btn-secondary");
        btn.classList.remove("btn-primary");
    }

    btnTarget.classList.add("btn-primary");
    btnTarget.classList.remove("btn-secondary");

    console.log(btnTarget.getAttribute("item-filter"));  
    catBtnFilters(btnTarget.getAttribute("item-filter")); 
}

function catBtnFilters(filterType) {
    const list = todoLists.querySelectorAll("li");

    for(let btnFilter of list) {
        btnFilter.classList.remove("d-flex");
        btnFilter.classList.remove("d-none");

        const completed = btnFilter.hasAttribute("item-completed");

        if(filterType == "completed") {
            btnFilter.classList.toggle(completed ? "d-flex" : "d-none");
        } else if(filterType == "uncompleted") {
            btnFilter.classList.toggle(completed ? "d-none" : "d-flex");
        } else {
            btnFilter.classList.toggle("d-flex");
        }
    }
}

function updateFilter() {
    const updateBtn = document.querySelector(".btn-primary[item-filter]");

    catBtnFilters(updateBtn.getAttribute("item-filter"));
}