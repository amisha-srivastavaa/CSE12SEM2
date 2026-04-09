let newheading =document.getElementById("heading");
newheading.innerHTML = "DOM manupulation in JavaScript";
newheading.style.color = "blue";
newheading.style.fontSize = "30px";
newheading.style.textAlign = "center";
let para = document.getElementById("para");
para.innerHTML = "This is a paragraph demonstrating DOM manipulation.";
para.style.color = "green";
para.style.fontSize = "20px";
para.style.textAlign = "center";    
let button = document.getElementById("myButton");
button.addEventListener("click", function() {
    alert("Button clicked!");
});