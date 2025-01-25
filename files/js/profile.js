if (localStorage.getItem("auth") != "true") {
    location.href = '/login?=/profile';
} else {
    const username = localStorage.getItem("username");
    const firstName = localStorage.getItem("first_name");
    const lastName = localStorage.getItem("last_name");
    const photoUrl = localStorage.getItem("photo_url");

    document.querySelector('.profile .pic img').src = photoUrl;
    document.querySelector('.profile span.us').innerHTML = username;
    document.querySelector('.profile span.fn').innerHTML = firstName;
    document.querySelector('.profile span.ln').innerHTML = lastName;
};


document.querySelector('.logout').onclick = () => {
    localStorage.setItem("auth", "false");
    location.href = '/home';
};
