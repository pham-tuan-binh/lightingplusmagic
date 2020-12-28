$(document).ready(function () {
  $("#datepicker").datepicker();
  $("#datepicker").datepicker("setDate", "0");
  let intervalWorker = new Worker("calculation.js");
});
