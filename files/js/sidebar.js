if (localStorage.getItem("rain") === null) {
    localStorage.setItem("rain", "true")
};

if (localStorage.getItem("theme") === null) {
    localStorage.setItem("theme", "true")
};

const sidebar = document.querySelector('.sidebar');
sidebar.classList.add('hide');

document.querySelector('header .settings').onclick = () => {
    if (sidebar.classList.contains('hide')) {
        sidebar.classList.remove('hide');
        sidebar.style.visibility = 'visible';
    } else {
        sidebar.classList.add('hide');
    }
};


window.onload = () => {
    if (localStorage.getItem("rain") == "false") {
        document.querySelector('.background .rain').innerHTML = '';
    } else {
        document.querySelector('.rain-settings input').checked = true;
    };

    document.querySelector('.rain-settings input').onclick = function(checkbox) {
        if (checkbox.srcElement.checked == false) {
            document.querySelector('.background .rain').innerHTML = '';
            localStorage.setItem("rain", "false")
        } else {
            localStorage.setItem("rain", "true");
            location.reload();
        };
    };

    document.querySelector('.theme-settings input').onclick = function(checkbox) {
        document.getElementById('theme-switch').click();
        setTimeout(function() {
            document.querySelector('.theme-settings input').checked = false
        }, 1500)
    };

    document.querySelector('.data-settings input').onclick = function(checkbox) {
        localStorage.clear();
        setTimeout(function() {
            document.querySelector('.data-settings input').checked = false
        }, 1000);
        setTimeout(function() {location.reload()}, 1500);
    };
}