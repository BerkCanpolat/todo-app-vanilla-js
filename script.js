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
