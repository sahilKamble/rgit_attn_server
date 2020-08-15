async function buildTable(data) {


    let tableName = document.createElement("th");
    tableName.className = "col";
    tableName.innerHTML = "Name";
    tableHeader.appendChild(tableName);

    let tableRoll = document.createElement("th");
    tableRoll.className = "col";
    tableRoll.innerHTML = "Roll No.";
    tableHeader.appendChild(tableRoll);

    for (attn of data[0].attn) {
        let tableRoll = document.createElement("th");
        tableRoll.className = "col attn";
        let d = new Date(attn.date);
        tableRoll.innerHTML = d.toLocaleString('en-US', {
            timeStyle: "short",
            dateStyle: "short"
        });
        tableHeader.appendChild(tableRoll);
    }

    let lect = data[0].attn.length;
    let tableTotal = document.createElement("th");
    tableTotal.className = "col attn";
    tableTotal.innerHTML = "Total/" + lect;
    tableHeader.appendChild(tableTotal);

    for (student_info of data) {
        const roll = student_info.student.roll;
        const name = student_info.student.name;
        const div = student_info.student.div;
        let entry = document.createElement("tr");
        entry.className = "table-row";
        let tableName = document.createElement("td");
        tableName.className = "col name";
        tableName.innerHTML = toTitleCase(name);
        entry.appendChild(tableName);
        let tableRoll = document.createElement("td");
        tableRoll.className = "col";
        tableRoll.innerHTML = div + roll;
        entry.appendChild(tableRoll);
        var count = 0;
        for (attn of student_info.attn) {

            const s = attn.present ? "P" : "A";
            if (attn.present) {
                count++;
            }
            let tableAttn = document.createElement("td");
            tableAttn.className = "col";
            tableAttn.innerHTML = s;
            entry.appendChild(tableAttn);

        }
        let tableAttn = document.createElement("td");
        tableAttn.className = "col";
        tableAttn.innerHTML = count;
        entry.appendChild(tableAttn);
        tableBody.appendChild(entry);
    }

    table.classList.remove('hidden');
    document.querySelector('.button-excel').disabled = false;

}

async function req(sid) {
    let kek = [];
    let url = 'https://attn-server.herokuapp.com/subjects' + sid + '/students';
    document.querySelector(".show-attendance").disabled = true;

    let res = await fetch(url);
    let data = await res.json();
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

    let attn = await fetch('https://attn-server.herokuapp.com/abs/table' + sid);
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