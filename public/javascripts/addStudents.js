var list = [];
var department;

function ShowAndHide() {
    var dept = document.querySelector('#dept-dropdown');
    department = dept.options[dept.selectedIndex].value;
    console.log(dept.options[dept.selectedIndex].value);
}

function handleFile(e) {
    list = [];
    var files = e.target.files,
        f = files[0];
    var reader = new FileReader();
    reader.onload = function (e) {
        var data = new Uint8Array(e.target.result);
        var workbook = XLSX.read(data, { type: 'array' });
        // console.log(workbook.Sheets);

        let sheetsList = workbook.SheetNames;
        /* DO SOMETHING WITH workbook HERE */
        var worksheet = XLSX.utils.sheet_to_json(
            workbook.Sheets[sheetsList[0]]
        );
        console.log(worksheet);
        ShowAndHide();
        for (student of worksheet) {
            let abc = {
                name: student.name,
                roll: student.roll,
                div: student.div,
                dept: department,
            };
            list.push(abc);
        }
        // console.log(list);
    };
    reader.readAsArrayBuffer(f);
}

async function addstud() {
    if (list) {
        let request = new XMLHttpRequest();
        request.open('POST', '/students', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify(list));
    }
}
let xl = document.querySelector('#xlf');
xl.addEventListener('change', handleFile, false);

function ShowAndHide() {
    var sub = document.querySelector('#inlineFormCustomSelect');
    d = sub.options[sub.selectedIndex].value;
    console.log(sub.options[sub.selectedIndex].value)
  
  }
