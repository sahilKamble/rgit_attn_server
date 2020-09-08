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

                let temp = '<tr><th>Roll number</th>';
                temp += '<th>Name</th>';

                data.forEach((u) => {
                    temp += '<tr>';
                    temp += `<td><input type="checkbox" name="value" id="c2" value="${u._id}" checked><label for="nroll">${u.div}${u.roll}</label></td>`;
                    temp += `<td>${u.name}</td>`;
                });

                document.getElementById('data').innerHTML = temp;
            }
        });
    });
}

async function postClass() {
    let data = {};
    let sclass = [];
    let students = document.querySelectorAll('input[name=\'value\']:checked');

    for(let student of students) {
        sclass.push(student.value);
    }

    // console.log(sclass);
    data = {
        name: N_sub,
        teacher: teach_id,
        students: sclass,
    };

    console.log(data);
//     let res = await fetch('/subjects', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(data),
//     });
//     let resp = await res.json();
//     console.log(resp);
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
    
}
