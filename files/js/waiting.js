const inputUrl = document.querySelector('input');
const inputCode = document.querySelectorAll('input')[1];

inputUrl.value = location.href.split('/game')[0] + '/join?game=' + TOKEN;
inputCode.value = TOKEN;

let socket = io();

socket.on('gameStart', function(data) {
    if (data.TOKEN == TOKEN) {
        location.href = location.href.replace('/play', '/game');
    };
});