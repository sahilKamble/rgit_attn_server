let req = new XMLHttpRequest();
req.open("GET", "/users/me");
req.send();
req.onload = function() {
    if (req.status === 200) {
        let subjectList = document.querySelector('.list-group');
        var jsonObj = JSON.parse(req.responseText);
        const name = document.querySelector('#name');
        console.log(jsonObj);
        const uname = document.createTextNode(jsonObj.username);
        name.appendChild(uname);
        let subjects = jsonObj.subjects;
        for (subject of subjects) {
            console.log(subject.name);
            let entry = document.createElement("a");
            entry.className = "list-group-item list-group-item-action";
            entry.innerHTML = subject.name;
            entry.setAttribute('href', '/users/attn/' + subject._id);
            subjectList.appendChild(entry);
        }
    }
}