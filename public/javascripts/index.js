// const url = "https://attn-server.herokuapp.com/attn/table/5f206d58ea613a00172d89ff";
// const attnurl = "https://attn-server.herokuapp.com/attn/sub/";
// const studentsurl = "https://attn-server.herokuapp.com/subjects/";

var subjects = {};
var tableHeader = document.querySelector(".table-header");
var tableBody = document.querySelector(".table-body");
let request1 = new XMLHttpRequest();
request1.open("GET", "https://attn-server.herokuapp.com/subjects");
request1.send();
request1.onload = () => {

    if (request1.status === 200) {
        var jsonObj = JSON.parse(request1.responseText);
        // console.log(jsonObj1);
        var i = 2;
        for (subject of jsonObj) {
            subjects[subject.name] = subject._id;
            var option = document.createElement("option");
            option.classList.add("item");
            option.setAttribute("value", "item-" + i++);
            var node = document.createTextNode(subject.name);
            option.appendChild(node);
            var element = document.getElementById("subjects");
            element.appendChild(option);
        }
        console.log(subjects);
    }
}

function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}

async function req(sid) {
    const url2 = "https://attn-server.herokuapp.com/attn/table/" + sid;

    document.querySelector(".show-attendance").disabled = true;
    console.log(tableHeader);
    // console.log(studentsurl + sid + "/students");
    // let resp = await fetch(studentsurl + sid + "/students");
    // let data = await resp.json();
    // // console.log(data);
    // let students = data.students
    //     .sort((a, b) => a.roll - b.roll)
    //     .sort((a, b) => a.div - b.div);


    let tableName = document.createElement("th");
    tableName.className = "col";
    tableName.innerHTML = "Name";
    tableHeader.appendChild(tableName);

    let tableRoll = document.createElement("th");
    tableRoll.className = "col";
    tableRoll.innerHTML = "Roll No.";
    tableHeader.appendChild(tableRoll);

    let res = await fetch(url2);
    let data = await res.json();
    for (attn of data[0].attn) {
        let tableRoll = document.createElement("th");
        tableRoll.className = "col attn";
        let d = new Date(attn.date);
        // console.log(d);
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
        // const id = student._id;
        // let res = await fetch(attnurl + sid + "/" + id);
        // let attns = await res.json();
        // // console.log(attns)
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
        // document.write(roll+ "  " + name + "  ");
        var count = 0;
        for (attn of student_info.attn) {

            // console.log(attn.date)
            const s = attn.present ? "P" : "A";
            if (attn.present) {
                count++;
            }
            let tableAttn = document.createElement("td");
            tableAttn.className = "col";
            tableAttn.innerHTML = s;
            entry.appendChild(tableAttn);
            // document.write(s + ' ');

        }
        let tableAttn = document.createElement("td");
        tableAttn.className = "col";
        tableAttn.innerHTML = count;
        entry.appendChild(tableAttn);
        tableBody.appendChild(entry);
        // document.write('<br/>');
    }
    document.querySelector(".show-attendance").disabled = false;
}

function show() {
    tableHeader.innerHTML = '';
    tableBody.innerHTML = '';
    var sub = document.querySelector('#subjects');
    var subject = sub.options[sub.selectedIndex].text;
    var id = subjects[subject];
    table = document.querySelector('.attendance-table');
    // console.log(sub.selectedIndex);
    if (sub.selectedIndex == 0) {
        table.classList.add('hidden');
        document.querySelector('.button-excel').disabled = true;

    } else {
        table.classList.remove('hidden');
        req(id);
        document.querySelector('.button-excel').disabled = false;
    }
}

function convert() {
    let table = document.querySelector(".attendance-table");
    console.log(table);
    TableToExcel.convert(table, {
        name: "Attendance.xlsx"
    });
}

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