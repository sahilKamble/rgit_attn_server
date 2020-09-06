document
    .querySelector('#register')
    .addEventListener('click', async function (event) {
        event.preventDefault();
        let form = {};

        let formData = new FormData(document.querySelector('#myForm'));
        for (let key of formData.keys()) {
            form[key] = formData.get(key);
        }
        let httpHeaders = { 'Content-Type': 'application/json' };
        let url = '/users/register';
        let myHeaders = new Headers(httpHeaders);
        let data = {
            username: form.username.trim(),
            password: form.password.trim(),
        };
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
            console.log('error');
        } else {
            window.location.href = '/users/login';
        }
    });
