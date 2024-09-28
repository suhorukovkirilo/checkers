if (name === '{{ name }}') {
    name = '';
};

if (message !== '{{ message }}') {
    document.getElementById('message').innerHTML = message
    document.getElementById('message').style.margin = '10px'
};

const input = document.querySelector('input');
const button = document.querySelector('button');

input.value = name

button.onclick = (event) => {
    if (3 > input.value.length || input.value.length > 16) {
        event.preventDefault();
    };
};

input.oninput = () => {
    let message = document.getElementById('message');
    if (input.value.length < 3) {
        message.innerHTML = "Ваше ім'я занадто коротке";
        message.style.margin = '10px';
    } else if (input.value.length > 16) {
        message.innerHTML = "Ваше ім'я занадто довге";
        message.style.margin = '10px';
    } else {
        message.innerHTML = "";
        message.style.margin = '0';
    }
};
