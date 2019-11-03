function reqListener () {
    var obj = JSON.parse(this.responseText);

    setTimeout(function(){

        const username = document.querySelector('div.username')
        username.textContent = obj.data.first_name + " " + obj.data.last_name;

        const bio = document.querySelector('div.bio')
        bio.textContent = obj.data.email;

        const avatar = document.querySelector('img.avatar');
        avatar.src = obj.data.avatar;
    }, 2000);
}

var oReq = new XMLHttpRequest();
oReq.addEventListener("load", reqListener);
oReq.open("GET", "https://reqres.in/api/users/2");
oReq.send();
