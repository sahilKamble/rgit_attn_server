document.querySelector('.login').addEventListener('keyup', () => {
    let form = document.querySelector('.login');
    let formdata = new FormData(form);
    let empty = false;
    for (let field of formdata.keys()) {
        if (!formdata.get(field).length) {
            empty = true;
        }
    }
    if (empty) {
        document.querySelector('.form-submit').disabled = true;
    } else {
        document.querySelector('.form-submit').disabled = false;
    }
});

document.addEventListener('submit', async function (event) {
    event.preventDefault();
    let form = {};
    console.log(event.target);
    let formData = new FormData(event.target);
    for (let key of formData.keys()) {
        form[key] = formData.get(key);
    }

    let httpHeaders = { 'Content-Type': 'application/json' };
    let url = '/users/login';
    let myHeaders = new Headers(httpHeaders);
    let data = {
        username: form.user.trim(),
        password: form.pass.trim(),
    };
    var err = document.querySelector('.error');
    let res = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: myHeaders,
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    let resData = res;
    console.log(resData.status);
    if (resData.status != 200) {
        err.classList.remove('hidden');
    } else {
        window.location.href = '/users/dash';
    }
});
