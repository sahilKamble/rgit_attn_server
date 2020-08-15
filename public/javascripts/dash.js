let req = new XMLHttpRequest();
req.open("GET", "/users/me");
req.send();
req.onload = function() {
    if (req.status === 200) {
        var jsonObj = JSON.parse(req.responseText);
        const name = document.querySelector('#name');
        console.log(jsonObj)
        const uname = document.createTextNode(jsonObj.username)
        name.appendChild(uname)
        let subjects = jsonObj.subjects;
        for (subject of subjects) {
            // const roll = student_info.student.roll;
            // const name = student_info.student.name;
            // const div = student_info.student.div;
            // // const id = student._id;
            // // let res = await fetch(attnurl + sid + "/" + id);
            // // let attns = await res.json();
            // // // console.log(attns)
            // let entry = document.createElement("tr");
            // entry.className = "table-row";
            // let tableName = document.createElement("td");
            // tableName.className = "col name";
            // tableName.innerHTML = toTitleCase(name);
            // entry.appendChild(tableName);
            // let tableRoll = document.createElement("td");
            // tableRoll.className = "col";
            // tableRoll.innerHTML = div + roll;
            // entry.appendChild(tableRoll);
            // // document.write(roll+ "  " + name + "  ");
            // var count = 0;
            // for (attn of student_info.attn) {
    
            //     // console.log(attn.date)
            //     const s = attn.present ? "P" : "A";
            //     if (attn.present) {
            //         count++;
            //     }
            //     let tableAttn = document.createElement("td");
            //     tableAttn.className = "col";
            //     tableAttn.innerHTML = s;
            //     entry.appendChild(tableAttn);
            //     // document.write(s + ' ');
    
            }
        
    }
}
