function showStudents(){

fetch("http://localhost:3000/students?div=A").then(
    res=>{
        res.json().then(
            data=>{
                 
                console.log(data); 
                if(data.length>0){

                    data.sort(function (a, b) {
                    return a.roll - b.roll;});


                    var temp = "<tr><th>Roll number</th>";
                     temp += "<th>Name</th>";

                     
               

                    data.forEach((u)=>{
                        temp +="<tr>";
                        
                        temp +="<td>"+`<input type="checkbox"  name="value" id="c2" value="${u._id}"  checked ><label for="nroll">`+u.roll+"</label></td>";
                        temp +="<td>"+u.name+"</td>";
                    })
                    
                    document.getElementById("data").innerHTML = temp;
                }
            }
        )
    }
)

$(document).ready(function () {
    $("#save-class").click(function () {
        var sclass = [];
        $.each($("input[name='value']:checked"), function () {
            sclass.push($(this).val());
            
        });
        alert("Members added are: " + sclass.join(", "));

        console.log(sclass);
    });
});

}


  student_id = {
     "_id": sclass
     }
  var stud_id = JSON.stringify(student_id);
  console.log(stud_id);
