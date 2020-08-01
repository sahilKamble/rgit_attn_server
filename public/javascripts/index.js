
var subject ="MP";
var subjectId ="" ;
var div = "";
var attendees = ['sebin francis','paras','sahil2','kapse'];
const url  = "https://attn-server.herokuapp.com/";
var url_subj = url+"subjects?name="+subject;
let request1 = new XMLHttpRequest();
request1.open("GET", url_subj);
request1.send();
request1.onload = () => {
    if(request1.status === 200){
        var jsonObj1 = JSON.parse(request1.responseText);
        console.log(jsonObj1);
        subjectId = jsonObj1[0]._id;
        console.log(subjectId);
        var url_subjectStudents = url+"subjects/"+subjectId+"/students";
        console.log(url_subjectStudents); 
    }
}
