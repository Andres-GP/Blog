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
});
