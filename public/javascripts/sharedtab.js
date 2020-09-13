var subject;

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

async function buildTable(data, daily_attn) {
    let tableHeader = document.querySelector('.table-header');
    let tableBody = document.querySelector('.table-body');

    let tableName = document.createElement('th');
    tableName.className = 'colm';
    tableName.innerHTML = 'Name';
    tableHeader.appendChild(tableName);

    let tableRoll = document.createElement('th');
    tableRoll.className = 'colm';
    tableRoll.innerHTML = 'Roll No.';
    tableHeader.appendChild(tableRoll);

    for (let attn of data[0].attn) {
        let tableRoll = document.createElement('th');
        tableRoll.className = 'colm date';
        tableRoll.setAttribute('aria-label', attn.id);
        let d = new Date(attn.date);
        tableRoll.innerHTML = d.toLocaleString('en-US', {
            timeStyle: 'short',
            dateStyle: 'short',
        });
        tableHeader.appendChild(tableRoll);
    }

    let lect = data[0].attn.length;
    let tableTotal = document.createElement('th');
    tableTotal.className = 'colm';
    tableTotal.innerHTML = 'Total/' + lect;
    tableHeader.appendChild(tableTotal);

    for (let student_info of data) {
        const roll = student_info.student.roll;
        const name = student_info.student.name;
        const div = student_info.student.div;
        const id = student_info.student._id;
        let entry = document.createElement('tr');
        entry.className = 'table-row';
        let tableName = document.createElement('td');
        tableName.className = 'colm name';
        tableName.innerHTML = toTitleCase(name);
        entry.appendChild(tableName);
        let tableRoll = document.createElement('td');
        tableRoll.className = 'collg';
        tableRoll.innerHTML = div + roll;
        entry.appendChild(tableRoll);

        var count = 0;

        for (let attn of student_info.attn) {
            let tableAttn = document.createElement('td');
            const s = attn.present ? 'P' : 'A';
            if (attn.present) {
                count++;
            } else {
                tableAttn.className = 'abs';
            }

            tableAttn.className += ' colm attn';
            // this is attn or abslist id something
            tableAttn.setAttribute('aria-label', attn.id);
            tableAttn.innerHTML = s;
            //this is student id
            tableAttn.id = id;
            // tableAttn.contentEditable = true;
            entry.appendChild(tableAttn);
        }

        let tableAttn = document.createElement('td');
        tableAttn.className = 'colm';
        tableAttn.innerHTML = count;
        entry.appendChild(tableAttn);
        tableBody.appendChild(entry);
    }

    let entry = document.createElement('tr');
    entry.className = 'table-row';
    let dailyattn = document.createElement('td');
    dailyattn.className = 'table-row';
    dailyattn.innerHTML = 'Daily Attendance';
    entry.appendChild(dailyattn);
    tableBody.appendChild(entry);

    let troll = document.createElement('td');
    troll.className = 'table-row';
    troll.innerHTML = `Strength ${data.length}`;
    entry.appendChild(troll);
    tableBody.appendChild(entry);

    for (let ss = 0; ss < daily_attn.length; ss++) {
        let dattn = document.createElement('td');
        dattn.className = 'table-row';
        dattn.innerHTML = daily_attn[ss];
        entry.appendChild(dattn);
        tableBody.appendChild(entry);
    }

    let table = document.querySelector('.table-wrapper');
    table.classList.remove('hidden');
    document.querySelector('.button-excel').disabled = false;

    if (
        document.querySelector('.container-fluid').clientWidth <
        document.querySelector('.attendance-table').clientWidth
    ) {
        let width = document.querySelector('.container-fluid').clientWidth;
        document.querySelector('.table-view').clientWidth = width + 'px';
    } else {
        $('.table-view').css({
            width:
                (document.querySelector('.attendance-table').clientWidth) + 'px',
        });
        document.querySelector('.table-wrapper').style.maxHeight = '100%';
    }
}

async function req(sid) {
    let kek = [];
    let daily_attn = [];
    let url = '/subjects' + sid + '/students';

    // let me = await fetch('https://attn-server.herokuapp.com/users/me');
    // let meInfo = await me.json();
    // console.log(meInfo);
    // const name = document.querySelector('#name');
    // const uname = document.createTextNode(meInfo.username);
    // name.appendChild(uname);

    let res = await fetch(url);
    let data = await res.json();
    console.log(data);
    if (data.name) {
        subject = toTitleCase(data.name);
        let heading = document.querySelector('h1');
        heading.innerHTML = subject;

        let students = data.students;

        for (let student of students) {
            let hmm = {
                attn: [],
                student: student,
            };
            kek.push(hmm);
        }

        let attn = await fetch('/abs/table' + sid);
        let days = await attn.json();

        var m = 0;
        for (let day of days) {
            let abs = day.absentStudents;
            let date = day.date;
            let id = day._id;

            var v = 0;
            for (let student of kek) {
                let present = true;
                for (let absent of abs) {
                    if (student.student._id == absent) {
                        student.attn.push({
                            date: date,
                            present: false,
                            id: id,
                        });
                        present = false;
                    }
                }

                if (present) {
                    student.attn.push({
                        date: date,
                        present: true,
                        id: id,
                    });
                    v = v + 1;
                    daily_attn[m] = v;
                }
            }
            m = m + 1;
        }

        buildTable(kek, daily_attn);
    }
}

function convert() {
    //CURRENT DATE CODE START
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    let yyyy = today.getFullYear();

    today = `${dd.toString().padStart(2, '0')}-${mm
        .toString()
        .padStart(2, '0')}-${yyyy}`;
    //CURRENT DATE CODE END

    let table = document.querySelector('.attendance-table');
    TableToExcel.convert(table, {
        name: `${subject} ${today} Attendance.xlsx`,
    });
}

let url = window.location.href;
let subid = /\/[\w]+$/.exec(url);

req(subid);
