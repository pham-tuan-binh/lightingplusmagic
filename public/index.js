String.prototype.formatUnicorn =
  String.prototype.formatUnicorn ||
  function () {
    "use strict";
    var str = this.toString();
    if (arguments.length) {
      var t = typeof arguments[0];
      var key;
      var args =
        "string" === t || "number" === t
          ? Array.prototype.slice.call(arguments)
          : arguments[0];

      for (key in args) {
        str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), args[key]);
      }
    }

    return str;
  };

function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function validatePhone(phone) {
  const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
  return re.test(String(phone).toLowerCase());
}

function toggleHidden(initiator, recipents) {
  initiator.addEventListener("click", () => {
    for (let element of recipents) {
      element.classList.toggle("block");
      element.classList.toggle("hidden");
    }
  });
}

function getFormData(form) {
  if (
    !(
      form.first_name.value &&
      form.last_name.value &&
      form.email_address.value &&
      form.phone_number.value &&
      form.content.value
    )
  )
    return false;

  if (!validateEmail(form.email_address.value)) return false;
  if (!validatePhone(form.phone_number.value)) return false;

  return {
    first: form.first_name.value,
    last: form.last_name.value,
    email: form.email_address.value,
    number: form.phone_number.value,
    content: form.content.value,
  };
}

function initScrollTo(initiators, recipent) {
  for (let item of initiators) {
    item.addEventListener("click", () => {
      recipent.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
}

function submitForm(data) {
  if (!data) return alert("Incorrect form");

  console.log(data);

  let request =
    "https://form.jotform.com/203474570534455?name[first]={first}&name[last]={last}&email6={email}&phoneNumber11={number}&describeYour={content}";

  request = request.formatUnicorn(data);

  window.open(request, "_blank");
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

  let form = document.contact_form;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    submitForm(getFormData(form));
  });

  initScrollTo(homeButtons, home);
  initScrollTo(introButtons, intro);
  initScrollTo(productButtons, product);
  initScrollTo(contactButtons, contact);

  toggleHidden(mobileMenuButton, mobileMenuRecipents);
};
