const req = require('xmlhttprequest').XMLHttpRequest;
var xhttp = new req();
const url = 'http://localhost:3000/users/login';
xhttp.open("POST", url, true);
xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
xhttp.send("username=Sahil_2k&password=123");
console.log(xhttp.responseText);
