
// var subject ="MP";
// var subjectId ="" ;
// var div = "";
// var attendees = ['sebin francis','paras','sahil2','kapse'];
// const url  = "https://attn-server.herokuapp.com/";
// var url_subj = url+"subjects?name="+subject;
// let request1 = new XMLHttpRequest();
// request1.open("GET", url_subj);
// request1.send();
// request1.onload = () => {
//     if(request1.status === 200){
//         var jsonObj1 = JSON.parse(request1.responseText);
//         console.log(jsonObj1);
//         subjectId = jsonObj1[0]._id;
//         console.log(subjectId);
//         var url_subjectStudents = url+"subjects/"+subjectId+"/students";
//         console.log(url_subjectStudents); 
//         console.log('test');
//     }

const url  = "https://attn-server.herokuapp.com/attn/table/5f206d58ea613a00172d89ff";

async function req() {       
    let req = await fetch(url);
    let res = await req.json();
    var table = '';
    console.log(res.students.length);
    var rows = res.students.length;
    for(var r = -1; r < rows; r++) {
        table += '<tr>';
        for(var c = -2 ; c < res.dates.length; c++) {
            if(r === -1 && c === -1) table += '<td>' + " " + '</td>';
            else if(r === -1 ) {
                var d = new Date(res.dates[c])
                table += '<td>' + d.toLocaleString() + '</td>'
            }
            else if(c === -2) table += '<td>' + res.students[r].roll + '</td>';
            else if(c === -1) table += '<td>' + res.students[r].name + '</td>';
            else table += '<td>' + res.students[r].attn[c] + '</td>';
        }
        table += '</tr>';
    }
    document.write('<table border=1>' + table + '</table>');
}
req();
