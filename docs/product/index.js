
function toggleHidden(initiator, recipents) {
  initiator.addEventListener("click", () => {
    for (let element of recipents) {
      element.classList.toggle("block");
      element.classList.toggle("hidden");
    }
  });
}

window.onload = () => {
  let mobileMenuButton = document.getElementById("mobile-menu-button");
  let mobileMenuRecipents = document.getElementsByClassName(
    "mobile-menu-recipents"
  );

  toggleHidden(mobileMenuButton, mobileMenuRecipents);
};
