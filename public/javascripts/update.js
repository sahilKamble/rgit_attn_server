document.querySelector('#passchange').addEventListener('click', async function (event) {
    event.preventDefault();
    let form = {};
    
    let formData = new FormData(document.querySelector('#myForm'));
    for (let key of formData.keys()) {
        form[key] = formData.get(key);
    }
    let httpHeaders = { 'Content-Type': 'application/json' };
    let url = '/users/updatepass';
    let myHeaders = new Headers(httpHeaders);
    let data = {
        username: form.username.trim(),
        oldpassword: form.oldpassword.trim(),
        newpassword: form.newpassword.trim()
    }
    const res = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: myHeaders,
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    })
    let resData = res;
    console.log(resData.status);

    const resjson = await res.json();
     console.log(resjson);
   
    if(resData.status != 200) {
      console.log('error');
    } else {
        alert(resjson.message);
        if(resjson.message =='User not found' || resjson.message =='Incorrect password' ||resjson.message =='Something went wrong!! Please try again after sometimes.' ){
            window.location.href = "/users/updatepass";
        }else{
            window.location.href = "/users/login";

        }
        
       
    }
});