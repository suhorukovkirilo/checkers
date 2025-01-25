const themeSwitch = document.getElementById("theme-switch");
const html = document.querySelector('html');

if (localStorage.getItem("theme") === null) {
    localStorage.setItem("theme", "light")
};

themeSwitch.setAttribute("theme", localStorage.getItem("theme"));
html.setAttribute("theme", localStorage.getItem("theme"));

if (localStorage.getItem("theme") == "dark") {
    document.querySelector("header .settings").src = "files/img/settings-black.svg"; 
};

themeSwitch.addEventListener('click', function() {
    var white = '#ffffff';
    var black = '#1f1f1f';

    var theme = this.getAttribute('theme');
    theme = theme == "light" ? "dark" : "light";
    localStorage.setItem("theme", theme);
    this.setAttribute('theme', theme);

    var bg = document.createElement("div")
    bg.id = 'bg';
    bg.style.backgroundColor = theme == "light" ? white : black;

    document.body.appendChild(bg);
    document.body.classList.add('hide-scrollbar');

    setTimeout(function() {
        document.querySelector("header .settings").src = theme == "dark" ? "files/img/settings-black.svg" : "files/img/settings.svg";
        html.setAttribute('theme', theme);
        document.body.style.backgroundColor = theme == "light" ? black : white;
        for (var el of document.querySelectorAll('[_src_]')) {
            var [src, _src_] = [el.getAttribute('_src_'), el.getAttribute('src')];
            el.setAttribute('src', src);
            el.setAttribute('_src_', _src_);
        };   
    }, 1500);

    setTimeout(function() {
        document.body.removeChild(bg);
        document.body.removeAttribute('style');

        if (document.getElementById('bg') == null) {
            document.body.classList.remove('hide-scrollbar');
        };

    }, 2300);
});