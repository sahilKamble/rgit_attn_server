regform.onsubmit = async (e) => {
    e.preventDefault();
    var data = new FormData(regform)
    var body = {
        username : data.get("username"),
        password: data.get("password")
    }
    console.log(body);
    let response = await fetch('/users/login', {
      method: 'POST',
      body: body.toString()
    });

    let result = await response.json();
    console.log(result);
};