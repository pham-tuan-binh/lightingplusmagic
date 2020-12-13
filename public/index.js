function toggleHidden(initiator, recipents) {
  initiator.addEventListener("click", () => {
    for (let element of recipents) {
      element.classList.toggle("block");
      element.classList.toggle("hidden");
    }
  });
}

function initScrollTo(initiators, recipent) {
  for (let item of initiators) {
    item.addEventListener("click", () => {
      recipent.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
}

window.onload = () => {
  let mobileMenuButton = document.getElementById("mobile-menu-button");
  let mobileMenuRecipents = document.getElementsByClassName(
    "mobile-menu-recipents"
  );

  let homeButtons = document.getElementsByClassName("home-link");
  let home = document.getElementById("home-to");

  let introButtons = document.getElementsByClassName("intro-link");
  let intro = document.getElementById("intro-to");

  let productButtons = document.getElementsByClassName("product-link");
  let product = document.getElementById("product-to");

  let contactButtons = document.getElementsByClassName("contact-link");
  let contact = document.getElementById("contact-to");

  initScrollTo(homeButtons, home);
  initScrollTo(introButtons, intro);
  initScrollTo(productButtons, product);
  initScrollTo(contactButtons, contact);

  toggleHidden(mobileMenuButton, mobileMenuRecipents);
};
