if (message !== '{{ message }}') {
    document.getElementById('message').innerHTML = message
    document.getElementById('message').style.margin = '10px'
};

const input = document.getElementById('code');
const button = document.querySelector('button');

button.onclick = (event) => {
    if (input.value.length != 6) {
        event.preventDefault();
    } else {
        event.preventDefault();
        let loc = location.href.split('?')[0].split('#')[0];
        location.href = loc + '?game=' + input.value;
    }
};

input.oninput = () => {
    let message = document.getElementById('message');
    if (input.value.length < 6) {
        message.innerHTML = "Код гри занадто короткий";
        message.style.margin = '10px';
    } else if (input.value.length > 6) {
        message.innerHTML = "Код гри занадто довгий";
        message.style.margin = '10px';
    } else {
        message.innerHTML = "";
        message.style.margin = '0';
    }
};