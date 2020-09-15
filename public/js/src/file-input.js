var fileInput = document.querySelector(".inputfile");

var label = fileInput.nextElementSibling;
var labelVal = label.innerHTML;

fileInput.addEventListener("change", function (e) {
  var fileName = e.target.value.split("\\").pop();

  if (fileName) {
    label.querySelector("span").innerHTML = fileName;
  } else {
    label.innerHTML = labelVal;
  }
});
