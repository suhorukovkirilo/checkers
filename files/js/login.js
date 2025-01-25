if (localStorage.getItem("auth") == "true") {
    redirect();
};

function onTelegramAuth(u) {
    fetch(`/verify?id=${u.id}&first_name=${u.first_name}&last_name=${u.last_name}&username=${u.username}&photo_url=${u.photo_url}&auth_date=${u.auth_date}&hash=${u.hash}`)
    .then(response => response.json())
    .then(data => {
        const {first_name, last_name, username, photo_url, auth_date, hash, verified} = data;
        const _ = (i) => (i.replace("undefined", ""));
        localStorage.setItem("first_name", _(first_name));
        localStorage.setItem("last_name", _(last_name));
        localStorage.setItem("username", _(username));
        localStorage.setItem("photo_url", _(photo_url));
        localStorage.setItem("auth_date", _(auth_date));
        localStorage.setItem("ACCOUNT_TOKEN", _(hash));
        localStorage.setItem("auth", "true");
        redirect();
    });
};

function redirect() {
    const url = location.href.split('login?=')[1];
    if (['/create', '/profile'].includes(url)) {
        location.href = url;
    };
};