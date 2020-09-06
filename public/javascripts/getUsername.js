var user = new XMLHttpRequest();
user.open('GET', '/users/me');
user.send();
user.onload = function () {
    if (user.status === 200) {
        let jsonObj = JSON.parse(user.responseText);
        const name = document.querySelector('#name');
        const uname = document.createTextNode(jsonObj.username);
        name.appendChild(uname);
    }
};
