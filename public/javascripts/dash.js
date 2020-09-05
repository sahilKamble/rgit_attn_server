let req = new XMLHttpRequest();
req.open("GET", "/users/me");
req.send();
req.onload = function() {
    if (req.status === 200) {
        let subjectList = document.querySelector('#subjlist');
        let jsonObj = JSON.parse(req.responseText);
        const name = document.querySelector('#name');
      
        const uname = document.createTextNode(jsonObj.username);
        name.appendChild(uname);
        let subjects = jsonObj.subjects;
        for (subject of subjects) {
            
            let entry = document.createElement("a");
            let tabico = document.createElement("i");
            let subspan = document.createElement("span");
            entry.className = "row list-group-item list-group-item-action";
            subspan.className = "col";
            tabico.className = "col-1 fas fa-table";
            subspan.innerHTML = subject.name;
            //entry.innerHTML = subject.name;
            entry.setAttribute('href', '/users/attn/' + subject._id);
            entry.appendChild(tabico);
            entry.appendChild(subspan);
            subjectList.appendChild(entry);
        }
        let addentry = document.createElement("a");
        let addico = document.createElement("i");
        let addspan = document.createElement("span");
        addentry.className = "row list-group-item list-group-item-action disabled";
        addspan.className = "col";
        addico.className = "col-1 fas fa-plus";
        addspan.innerHTML = "Add another class ...";
        addentry.setAttribute('href', 'addClass.html');
        addentry.appendChild(addico);
        addentry.appendChild(addspan);
        subjectList.appendChild(addentry);
    }
}

let req2 = new XMLHttpRequest();
req2.open("GET", "/users/shared");
req2.send();
req2.onload = function() {
    if (req2.status === 200) {
        let subjectList = document.querySelector('#sharedlist');
        let jsonObj2 = JSON.parse(req2.responseText);
      
        
        let subjects = jsonObj2.sharedSubjects;
        for (subject of subjects) {
           
            let entry = document.createElement("a");
            let tabico = document.createElement("i");
            let subspan = document.createElement("span");
            entry.className = "row list-group-item list-group-item-action";
            subspan.className = "col";
            tabico.className = "col-1 fas fa-table";
            subspan.innerHTML = subject.name;
            //entry.innerHTML = subject.name;
            entry.setAttribute('href', '/users/sharedattn/' + subject._id);
            entry.appendChild(tabico);
            entry.appendChild(subspan);
            subjectList.appendChild(entry);
        }
    }
}

function logout() {
    fetch("/users/logout")
    .then(res => res.json())
    .then(data => {
        if(data.success){
            window.location.href = "/users/login"
        }
    })
}