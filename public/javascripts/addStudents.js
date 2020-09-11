var list;
var department;

function ShowAndHide() {
    var dept = document.querySelector('#dept-dropdown');
    department = dept.options[dept.selectedIndex].value;
    console.log(dept.options[dept.selectedIndex].value);
}

function handleFile(e) {
    list = [];
    var files = e.target.files,
        f = files[0];
    var reader = new FileReader();
    reader.onload = function (e) {
        var data = new Uint8Array(e.target.result);
        var workbook = XLSX.read(data, { type: 'array' });
        // console.log(workbook.Sheets);

        let sheetsList = workbook.SheetNames;
        /* DO SOMETHING WITH workbook HERE */
        var worksheet = XLSX.utils.sheet_to_json(
            workbook.Sheets[sheetsList[0]]
        );
        console.log(worksheet);
        ShowAndHide();
        for (student of worksheet) {
            let abc = {
                name: student.name,
                roll: student.roll,
                div: student.div,
                dept: department,
            };
            list.push(abc);
        }
        // console.log(list);
    };
    reader.readAsArrayBuffer(f);
}

async function addstud() {
    if (list) {
        console.log(list);
        let request = new XMLHttpRequest();
        request.open('POST', '/students', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify(list));
    }
}

let xl = document.querySelector('#xlf');
xl.addEventListener('change', handleFile, false);

function logout() {
    fetch('/users/logout')
        .then((res) => res.json())
        .then((data) => {
            if (data.success) {
                window.location.href = '/users/login';
            }
        });
}


var teach_id;
var filt;
var N_sub;

function showStudents() {
    document.querySelector('.students-list').hidden = false;
    filt = document.getElementById('sub_div').value;
    N_sub = document.getElementById('subject1').value;

    fetch('/users/me').then((res) => {
        res.json().then((data) => {
            teach_id = data._id;
        });
    });

    fetch(`/students${filt}`).then((res) => {
        res.json().then((data) => {
            console.log(data);
            if (data.length > 0) {
                data.sort(function (a, b) {
                    if (a.div == b.div) {
                        return a.roll - b.roll;
                    }
                });

                // let temp = '<tr><th>Roll number</th>';
                // temp += '<th>Name</th>';

                // data.forEach((u) => {
                //     temp += '<tr>';
                //     temp += `<td><input type="checkbox" name="value" id="c2" value="${u._id}" checked><label for="nroll">${u.div}${u.roll}</label></td>`;
                //     temp += `<td>${u.name}</td>`;
                // });

                let tableHeader = document.querySelector('.table-header');
                let tableBody = document.querySelector('.table-body');
                tableHeader.innerHTML = '';
                tableBody.innerHTML = '';

                let checkboxCell = document.createElement('th');
                let checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'toggle-checkbox';
                checkbox.checked = true;
                checkbox.className = 'toggle-checkbox';
                checkboxCell.className = 'checkbox';
                checkboxCell.appendChild(checkbox);
                tableHeader.appendChild(checkboxCell);


                let roll = document.createElement('th');
                roll.className = 'roll-no';
                roll.innerHTML = 'Roll Number';
                tableHeader.appendChild(roll);

                let name = document.createElement('th');
                name.className = 'student-name';
                name.innerHTML = 'Name';
                tableHeader.appendChild(name);

                for(let student of data) {
                    let row = document.createElement('tr');
                    let checkboxCell = document.createElement('td');
                    let roll = document.createElement('td');

                    let checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.className = 'checkbox';
                    checkbox.id = student._id;
                    checkbox.value = student._id;
                    checkbox.checked = true;
                    checkboxCell.for = student._id;
                    checkboxCell.className = 'checkbox-cell';
                    checkboxCell.appendChild(checkbox);
                    row.appendChild(checkboxCell);
                    
                    let label = document.createElement('label');
                    label.setAttribute('for', student._id);
                    label.innerText = `${student.div}${student.roll}`;
                    roll.className = 'roll-no';
                    roll.appendChild(label);

                    let name = document.createElement('td');
                    name.innerHTML = student.name;
                    name.className = 'student-name';
                    row.appendChild(roll);
                    row.appendChild(name);
                    tableBody.appendChild(row);
                }

                document.querySelector('.toggle-checkbox').addEventListener('change', toggleSelects);
            }
        });
    });
    

}

async function postClass() {
    let data = {};
    let sclass = [];
    let students = document.querySelectorAll('input[class=\'checkbox\']:checked');

    for(let student of students) {
        sclass.push(student.value);
    }

    data = {
        name: N_sub,
        teacher: teach_id,
        students: sclass,
    };

    console.log(data);

    let res = await fetch('/subjects', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
   
    if(res.status === 200)
        alert('Subject created');
    else 
        alert('error... something went wrong');
    
}

function logout() {
    fetch('/users/logout')
        .then((res) => res.json())
        .then((data) => {
            if (data.success) {
                window.location.href = '/users/login';
            }
        });
}

function toggleSelects() {
    let checkboxes = document.querySelectorAll('.checkbox');
    for (let checkbox of checkboxes) {
        checkbox.checked =  !checkbox.checked;
    }
}
