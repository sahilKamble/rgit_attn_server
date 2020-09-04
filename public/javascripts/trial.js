var list = [];
function handleFile(e) {
  var files = e.target.files,
    f = files[0];
  var reader = new FileReader();
  reader.onload = function (e) {
    var data = new Uint8Array(e.target.result);
    var workbook = XLSX.read(data, { type: "array" });
    console.log(workbook.Sheets);

    let sheetsList = workbook.SheetNames;
    /* DO SOMETHING WITH workbook HERE */
    var wsj = XLSX.utils.sheet_to_json(workbook.Sheets[sheetsList[0]]);
    //console.log(wsj);
    for (student of wsj) {
      let abc = {
        name: student.name,
        roll: student.roll,
        div: student.div,
        dept: student.dept,
      };
      list.push(abc);
    }
    console.log(list);
    // if (list) {
    //   let request = new XMLHttpRequest();
    //   request.open("POST", "http://localhost:3000/students", true);
    //   request.setRequestHeader("Content-Type", "application/json");
    //   request.send(JSON.stringify(list));
    // }
  };
  reader.readAsArrayBuffer(f);
}
async function addstud() {
  if (list) {
    let request = new XMLHttpRequest();
    request.open("POST", "http://localhost:3000/students", true);
    request.setRequestHeader("Content-Type", "application/json");
    request.send(JSON.stringify(list));
  }
}
let xl = document.querySelector("#xlf");
xl.addEventListener("change", handleFile, false);
