document.addEventListener("DOMContentLoaded", function () {
  const allButtons = document.querySelectorAll(".searchBtn");
  const searchBar = document.querySelector(".searchBar");
  const searchInput = document.getElementById("searchInput");
  const searchClose = document.getElementById("searchClose");

  allButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      searchBar.style.visibility = "visible";
      searchBar.classList.add("open");
      btn.setAttribute("aria-expanded", "true");
      searchInput.focus();
    });
  });

  searchClose.addEventListener("click", function () {
    searchBar.style.visibility = "hidden";
    searchBar.classList.remove("open");
    allButtons.forEach((btn) => btn.setAttribute("aria-expanded", "false"));
  });

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      fetch("/logout")
        .then((res) => {
          if (res.ok) {
            window.location.href = "/";
          }
        })
        .catch((err) => console.error("Error al cerrar sesión:", err));
    });
  }

  const flashes = document.querySelectorAll(".flash");
  flashes.forEach((flash) => {
    setTimeout(() => {
      flash.style.opacity = "0";
      flash.style.transform = "translateY(-10px)";
      setTimeout(() => flash.remove(), 300);
    }, 4000);
  });

  flash.addEventListener("click", () => {
    flash.style.animation = "slideOut 0.3s forwards";
  });
});
