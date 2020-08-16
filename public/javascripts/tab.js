function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}

async function buildTable(data) {
    var tableHeader = document.querySelector(".table-header");
    var tableBody = document.querySelector(".table-body");

    let tableName = document.createElement("th");
    tableName.className = "colm";
    tableName.innerHTML = "Name";
    tableHeader.appendChild(tableName);

    let tableRoll = document.createElement("th");
    tableRoll.className = "colm";
    tableRoll.innerHTML = "Roll No.";
    tableHeader.appendChild(tableRoll);

    for (attn of data[0].attn) {
        let tableRoll = document.createElement("th");
        tableRoll.className = "colm attn";
        let d = new Date(attn.date);
        tableRoll.innerHTML = d.toLocaleString('en-US', {
            timeStyle: "short",
            dateStyle: "short"
        });
        tableHeader.appendChild(tableRoll);
    }

    let lect = data[0].attn.length;
    let tableTotal = document.createElement("th");
    tableTotal.className = "colm attn";
    tableTotal.innerHTML = "Total/" + lect;
    tableHeader.appendChild(tableTotal);

    for (student_info of data) {
        const roll = student_info.student.roll;
        const name = student_info.student.name;
        const div = student_info.student.div;
        let entry = document.createElement("tr");
        entry.className = "table-row";
        let tableName = document.createElement("td");
        tableName.className = "colm name";
        tableName.innerHTML = toTitleCase(name);
        entry.appendChild(tableName);
        let tableRoll = document.createElement("td");
        tableRoll.className = "colm";
        tableRoll.innerHTML = div + roll;
        entry.appendChild(tableRoll);
        var count = 0;
        for (attn of student_info.attn) {

            const s = attn.present ? "P" : "A";
            if (attn.present) {
                count++;
            }
            let tableAttn = document.createElement("td");
            tableAttn.className = "colm";
            tableAttn.innerHTML = s;
            entry.appendChild(tableAttn);

        }
        let tableAttn = document.createElement("td");
        tableAttn.className = "colm";
        tableAttn.innerHTML = count;
        entry.appendChild(tableAttn);
        tableBody.appendChild(entry);
    }
    table = document.querySelector('.table-div');
    table.classList.remove('hidden');
    document.querySelector('.button-excel').disabled = false;

}

async function req(sid) {
    let kek = [];
    let url = '/subjects' + sid + '/students';

    let me = await fetch('https://attn-server.herokuapp.com/users/me');
    let meInfo = await me.json();
    console.log(meInfo);
    const name = document.querySelector('#name');
    const uname = document.createTextNode(meInfo.username);
    name.appendChild(uname);

    let res = await fetch(url);
    let data = await res.json();
    let subject = data.name;
    let heading = document.querySelector('h1');
    heading.innerHTML = toTitleCase(subject);

    let students = data.students
        .sort((a, b) => a.roll - b.roll)
        .sort((a, b) => a.div - b.div);

    for (student of students) {
        let hmm = {
            "attn": [],
            "student": student,
        }
        kek.push(hmm);
    }

    let attn = await fetch('/abs/table' + sid);
    let days = await attn.json();
    console.log(days);
    for (day of days) {
        let abs = day.absentStudents;
        let date = day.date;

        for (student of kek) {
            let present = true;
            for (absent of abs) {
                if (student.student._id == absent) {
                    student.attn.push({
                        "date": date,
                        "present": false
                    })
                    present = false;
                }
            }

            if (present) {
                student.attn.push({
                    "date": date,
                    "present": true
                })
            }
        }
    }

    buildTable(kek);
}

function convert() {
    let table = document.querySelector(".attendance-table");
    TableToExcel.convert(table, {
        name: "Attendance.xlsx"
    });
}

url = window.location.href;
let subid = /\/[\w]+$/.exec(url);
console.log(subid);
req(subid);

$(document).ready(function () {
    $('tbody').scroll(function (e) { //detect a scroll event on the tbody
        /*
    Setting the thead left value to the negative valule of tbody.scrollLeft will make it track the movement
    of the tbody element. Setting an elements left value to that of the tbody.scrollLeft left makes it maintain 			it's relative position at the left of the table.    
    */
        $('thead').css("left", -$("tbody").scrollLeft()); //fix the thead relative to the body scrolling
        $('thead th:nth-child(1)').css("left", $("tbody").scrollLeft()); //fix the first cell of the header
        $('tbody td:nth-child(1)').css("left", $("tbody").scrollLeft()); //fix the first column of tdbody
        $('thead th:nth-child(2)').css("left", $("tbody").scrollLeft());
        $('tbody td:nth-child(2)').css("left", $("tbody").scrollLeft());
    });
});