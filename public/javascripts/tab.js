var list = [];
var subject;
var gotUsers = false

url = window.location.href;
var subid = /\/[\w]+$/.exec(url);
console.log(subid);
req(subid);


function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}

async function buildTable(data,daily_attn) {

    
    let tableHeader = document.querySelector(".table-header");
    let tableBody = document.querySelector(".table-body");

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
        tableRoll.className = "colm date";
        tableRoll.setAttribute('aria-label', attn.id);
        let d = new Date(attn.date);
        tableRoll.innerHTML = d.toLocaleString('en-US', {
            timeStyle: "short",
            dateStyle: "short"
        });
        tableHeader.appendChild(tableRoll);
    }

    let lect = data[0].attn.length;
    let tableTotal = document.createElement("th");
    tableTotal.className = "colm";
    tableTotal.innerHTML = "Total/" + lect;
    tableHeader.appendChild(tableTotal);
    
  
 
   
    for (student_info of data) {
        
        const roll = student_info.student.roll;
        const name = student_info.student.name;
        const div = student_info.student.div;
        const id = student_info.student._id;
        let entry = document.createElement("tr");
        entry.className = "table-row";
        let tableName = document.createElement("td");
        tableName.className = "colm name";
        tableName.innerHTML = toTitleCase(name);
        entry.appendChild(tableName);
        let tableRoll = document.createElement("td");
        tableRoll.className = "collg";
        tableRoll.innerHTML = div + roll;
        entry.appendChild(tableRoll);
        
       


        var count = 0;
       
        for (attn of student_info.attn) {
            

            const s = attn.present ? "P" : "A";
            if (attn.present) {
                count++; 
                                                    
            }
            
            
            let tableAttn = document.createElement("td");
            tableAttn.className = "colm attn";
            // this is attn or abslist id something
            tableAttn.setAttribute('aria-label', attn.id);
            tableAttn.innerHTML = s;
            //this is student id
            tableAttn.id = id;
            // tableAttn.contentEditable = true;
            entry.appendChild(tableAttn);

        }
        


        let tableAttn = document.createElement("td");
        tableAttn.className = "colm";
        tableAttn.innerHTML = count;
        entry.appendChild(tableAttn);
        tableBody.appendChild(entry);

    
    

    }

      let entry = document.createElement("tr");
      entry.className = "table-row";
      let dailyattn = document.createElement("td");
      dailyattn.className = "table-row";
      dailyattn.innerHTML = "Daily Attendance";
      entry.appendChild(dailyattn);
      tableBody.appendChild(entry);

      let troll = document.createElement("td");
      troll.className = "table-row";
      troll.innerHTML = `Strength ${data.length}`;
      entry.appendChild(troll);
      tableBody.appendChild(entry);
      
      for(ss=0;ss<daily_attn.length;ss++){
        
        let dattn = document.createElement("td");
        dattn.className = "table-row";
        dattn.innerHTML = daily_attn[ss];
        entry.appendChild(dattn);
        tableBody.appendChild(entry);
    }


        table = document.querySelector('.table-wrapper');
        table.classList.remove('hidden');
        document.querySelector('.button-excel').disabled = false;
        document.querySelector('.button-edit').disabled = false;
        document.querySelector('.button-del').disabled = false;
        if (document.querySelector('.container-fluid').clientWidth < document.querySelector('.attendance-table').clientWidth) {
            let width = document.querySelector('.container-fluid').clientWidth;
            document.querySelector('.table-view').clientWidth = width + 'px';
        } else {
            $(".table-view").css({ 'width': document.querySelector('.attendance-table').clientWidth + 'px' });
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
    subject = toTitleCase(data.name);
    let heading = document.querySelector('h1');
    heading.innerHTML = subject;

    let students = data.students

    for (student of students) {
        let hmm = {
            "attn": [],
            "student": student,
        }
        kek.push(hmm);
    }

    let attn = await fetch('/abs/table' + sid);
    let days = await attn.json();
   console.log('yyyyyy'+days);
  

   var m=0;
    for (day of days) {
        let abs = day.absentStudents;
        let date = day.date;
        let id = day._id;

         var v = 0;
        for (student of kek) {
            let present = true;
            for (absent of abs) {
                if (student.student._id == absent) {
                    student.attn.push({
                        "date": date,
                        "present": false,
                        "id": id
                    })
                    present = false;

                    
                }
            }

            if (present) {
                student.attn.push({
                    "date": date,
                    "present": true,
                    "id": id
                })
                   v = v + 1;
                 daily_attn[m] = v;
                  
            }
            
        }
        m=m+1
    }

    console.log('check this'+daily_attn);

    console.log({ kek });
    buildTable(kek,daily_attn);
}

function convert() {

    //CURRENT DATE CODE START
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    let yyyy = today.getFullYear();

    today = `${dd.toString().padStart(2, '0')}-${mm.toString().padStart(2, '0')}-${yyyy}`;
    //CURRENT DATE CODE END

    let table = document.querySelector(".attendance-table");
    TableToExcel.convert(table, {
        name: `${subject} ${today} Attendance.xlsx`
    });
}

function rebulidtable() {
    let edit = document.querySelector('.button-edit');
    edit.hidden = false;
    let save = document.querySelector('.button-save');
    save.hidden = true;
    let del = document.querySelector('.button-del');
    del.hidden = false;
    let delsave = document.querySelector('.button-delsave');
    delsave.hidden = true;
    let cancel = document.querySelector('.button-cancel');
    cancel.hidden = true;
    let tableHeader = document.querySelector(".table-header");
    let tableBody = document.querySelector(".table-body");
    tableHeader.innerHTML = "";
    tableBody.innerHTML = "";
    url = window.location.href;
    let subid = /\/[\w]+$/.exec(url);
    console.log(subid);
    req(subid);
}

function edit() {
    let edit = document.querySelector('.button-edit');
    edit.hidden = true;
    let save = document.querySelector('.button-save');
    save.hidden = false;
    let del = document.querySelector('.button-del');
    del.hidden = true;
    let cancel = document.querySelector('.button-cancel');
    cancel.hidden = false;
    let attns = document.querySelectorAll('.attn');
    for (attn of attns) {
        attn.addEventListener('click', (e) => {
            let target = e.srcElement;
            if (target.innerHTML == 'P') {
                target.innerHTML = 'A';
            } else {
                target.innerHTML = 'P';
            }
            if (target.getAttribute('class').includes('edited')) {
                list.pop(target.getAttribute('aria-label'));
                target.classList.remove('edited');
            } else {
                list.push(target.getAttribute('aria-label'));
                target.classList.add('edited');
            }
        })
    }
}

async function save() {
    //console.log('tes');
    var idList = new Set(list);
    console.log(idList);
    for (id of idList) {
        let studentList = [];
        let column = document.querySelectorAll(`[aria-label="${id}"]`);
        // console.log(column);
        for (row of column) {
            if (row.innerHTML === 'A')
                studentList.push(row.id);
        }
        console.log(studentList);
        data = {
            "absentStudents": studentList
        }
        console.log(JSON.stringify(data));
        let res = await fetch('/abs/' + id, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify(data)
        });
        let resp = await res.json();
        //console.log(resp);
    }
    // if(resp !== 200)
    rebulidtable();

}

function del() {
    let edit = document.querySelector('.button-edit');
    edit.hidden = true;
    let del = document.querySelector('.button-del');
    del.hidden = true;
    let delsave = document.querySelector('.button-delsave');
    delsave.hidden = false;
    let cancel = document.querySelector('.button-cancel');
    cancel.hidden = false;
    let attns = document.querySelectorAll('.date');
    for (attn of attns) {
        attn.addEventListener('click', (e) => {
            let target = e.srcElement;
            let id = target.getAttribute('aria-label');
            if (target.getAttribute('class').includes('todel')) {
                list.pop(id);
                target.classList.remove('todel');
                let column = document.querySelectorAll(`[aria-label="${id}"]`);
                for (row of column) {
                    row.classList.remove('del-colm')
                }
            } else {
                list.push(id);
                target.classList.add('todel');
                let column = document.querySelectorAll(`td[aria-label="${id}"]`);
                for (row of column) {
                    row.classList.add('del-colm')
                }
            }
        })
    }
}

async function delsave() {
    //console.log('delsave');
    var idList = new Set(list);
    console.log(idList);
    for (id of idList) {
        console.log(id)
        let res = await fetch('/abs/' + id, {
            method: "DELETE",
        });
        let resp = await res.json();
    }
    // if(resp !== 200)
    rebulidtable();
}

function cancel() {
    list = [];
    rebulidtable();
}

async function share() {
    if(!gotUsers) {
        let req = await fetch("/users/names")
        let resp = await req.json();
        console.log(resp)
        let users = document.querySelector('#userlist');
        for (user of resp) {
            let entry = document.createElement("a");
            let subspan = document.createElement("span");
            entry.className = "row user list-group-item list-group-item-action";
            subspan.className = "col";
            subspan.innerHTML = user.username;
            //entry.innerHTML = subject.name;
            // entry.setAttribute('onClick', 'shareto()');
            entry.setAttribute('aria-label', user._id)
            entry.appendChild(subspan);
            users.appendChild(entry);
        }
        gotUsers = true;
        var userids = document.querySelectorAll(".user");
        
        for(var i = 0; i < userids.length; i++){
            userids[i].addEventListener("click", async function(e){
                uid = this.getAttribute("aria-label");
                let url = '/subjects'+ subid + '/shared/' + uid
                console.log(url)
                const response = await fetch(url, {
                method: 'POST', 
                });
                alert("Subject shared")
            });     
        }
    }
}




// $(document).ready(function () {
//     $('tbody').scroll(function (e) { //detect a scroll event on the tbody
//         /*
//     Setting the thead left value to the negative valule of tbody.scrollLeft will make it track the movement
//     of the tbody element. Setting an elements left value to that of the tbody.scrollLeft left makes it maintain 			it's relative position at the left of the table.    
//     */
//         $('thead').css("left", -$("tbody").scrollLeft()); //fix the thead relative to the body scrolling
//         $('thead th:nth-child(1)').css("left", $("tbody").scrollLeft()); //fix the first cell of the header
//         $('tbody td:nth-child(1)').css("left", $("tbody").scrollLeft()); //fix the first column of tdbody
//         $('thead th:nth-child(2)').css("left", $("tbody").scrollLeft());
//         $('tbody td:nth-child(2)').css("left", $("tbody").scrollLeft());
//     });
// });
