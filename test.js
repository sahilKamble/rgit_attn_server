var XLSX = require('xlsx') 
var subject ="MP";
var subjectId ="" ;
var div = "";
var attendees = ['sebin francis','paras','sahil2','kapse'];
const url  = "https://attn-server.herokuapp.com/";
var url_subj = url+"subjects?name="+subject;
var attendance = [];
//const needle = require('needle');
var X = require('xmlhttprequest').XMLHttpRequest;


let request1 = new X();
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
      
      
      let request2 = new X();
      request2.open("GET", url_subjectStudents);
      request2.send();
      request2.onload = () => {
    
      if(request2.status === 200){
          var jsonObj2 = JSON.parse(request2.responseText);
          console.log(jsonObj2);
          var ws = XLSX.utils.json_to_sheet(jsonObj2);
                var wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, 'test');
                XLSX.writeFile(wb, 'test.xlsx')
          
          var countKey = Object.keys(jsonObj2).length;
          for( i = 0 ; i < attendees.length;i++ ){
          for( j = 0;j < countKey;j++){
              if(attendees[i] == jsonObj2[j].name){
                  console.log(attendees[i]+'PRESENT');
                  var data = {
                    "student":jsonObj2[j]._id,
                    "subject":subjectId
                  }
                  attendance.push(data);
              }
   
            };    
          };
          

/*          needle('post',  "https://attn-server.herokuapp.com/attn", attendance, {json: true})
            .then((res) => {
              console.log(`Status: ${res.statusCode}`);
              console.log('Body: ', res.body);
            }).catch((err) => {
              console.error(err);
              });
*/

        }else {
             console.log('error ${request2.status} ${request2.statusText}')
            }
        }




    }else {
        console.log('error ${request1.status} ${request1.statusText}')
      } 
}