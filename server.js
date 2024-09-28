const express = require('express');
const app = express();
const server = require('http').Server(app);
const socketIO = require('socket.io')(server);
const cookies = require('cookie-parser')('It^s a secret');
const bodyParser = require('body-parser')

const fs = require('fs');

let games = {};

app.use(cookies);
app.use('/files', express.static('files'));
app.use(bodyParser.urlencoded({extended: false}))

app.get('/', (request, response) => {
    let cookies = request.cookies;
    console.log(cookies);
    let html = HTML('index.html', {name: cookies.name || ""})
    response.send(html)
});

app.post('/', (request, response) => {
    let html, name = request.body.name;
    if (3 > name.length || name.length > 16) {
        html = HTML('index.html', {
            name: name, 
            message: 3 > name.length ? 'Ваш пароль занадто короткий' : 'Ваш пароль занадто довгий'
        });
        response.send(html);
    } else {
        response.cookie('name', name, {maxAge: 14 * 24 * 3600, secure: true});
        const TOKEN = newTOKEN();
        games[TOKEN] = {players: [name, null], board: [
            ["black", 0, 0], ["black", 2, 0], ["black", 4, 0], ["black", 6, 0], ["black", 1, 1], 
            ["black", 3, 1], ["black", 5, 1], ["black", 7, 1], ["black", 0, 2], ["black", 2, 2], 
            ["black", 4, 2], ["black", 6, 2], ["white", 1, 5], ["white", 3, 5], ["white", 5, 5], 
            ["white", 7, 5], ["white", 2, 6], ["white", 4, 6], ["white", 6, 6], ["white", 0, 6],
            ["white", 1, 7], ["white", 3, 7], ["white", 5, 7], ["white", 7, 7]
        ], moves: 'white'}
        response.cookie('TOKEN', TOKEN, {maxAge: 14 * 24 * 3600, secure: true});
        response.redirect('/game');
    };
});

app.get('/join', (request, response) => {
    if (!Object.keys(games).includes(request.query.game)) {
        response.send("Запрошувальне посилання не дійсне")
    } else {
        console.log(request.query.game);
        response.cookie('TOKEN', request.query.game, {maxAge: 14 * 24 * 3600, secure: true});
        let html = HTML('index.html', {name: request.cookies.name || ""});
        response.send(html);
    };
});

app.post('/join', (request, response) => {
    let TOKEN = request.query.game, name = request.body.name;
    if (!Object.keys(games).includes(request.query.game)) {
        response.send("Запрошувальне посилання не дійсне")
    } else {
        if (name == games[TOKEN].players[0]) {
            let html = HTML('index.html', {name: request.cookies.name || ""});
            response.send(html);
        } else {
            response.cookie('name', name, {maxAge: 14 * 24 * 3600, secure: true})
            response.cookie('TOKEN', TOKEN, {maxAge: 14 * 24 * 3600, secure: true})
            games[TOKEN].players[1] = name;
            socketIO.emit('gameStart', {TOKEN: TOKEN});
            response.redirect('/game');
        };
    };
});

app.get('/game', (request, response) => {
    const TOKEN = request.cookies.TOKEN;
    const name = request.cookies.name;
    let html, game = games[TOKEN];
    if (!Object.keys(games).includes(TOKEN) || !games[TOKEN].players.includes(name)) {
        response.redirect('/');
    } else if (game.players[1] == null) {
        html = HTML('waiting.html', {TOKEN: request.cookies.TOKEN}); 
        response.send(html);
    } else  {
        let color = name == games[TOKEN].players[0] ? 'white' : 'black';
        let html = HTML('game.html', {
            TOKEN: TOKEN, 
            name: name, 
            board: JSON.stringify(games[TOKEN].board), 
            color: color,
            move: games[TOKEN].moves == color}
        );
        response.send(html);
    };
});

function HTML(file, Vars) {
    let html = fs.readFileSync(file, 'utf-8');
    for (let Var of Object.keys(Vars)) {
        html = html.replace(`{{ ${Var} }}`, Vars[Var])
    };
    return html
};

function newTOKEN(length=16) {
    const symbols = "1234567890abcdefghijklmnopqrstuvwxyz".split('');
    const randint = (min, max) => Math.floor(Math.random() * (max - min) + min);

    let TOKEN = '';
    while (TOKEN.length < length) {
        TOKEN += symbols[randint(0, symbols.length)]
    };
    return TOKEN
};

socketIO.on('connection', function(socket) {
    socket.on('move', function(data) {
        let game = games[data.TOKEN];
        if(Object.keys(games).includes(data.TOKEN) && game.players.includes(data.sender)) {
            let board = game.board;
            for (let i = 0; i < board.length; i++) {
                let [color, x, y] = board[i];
                if (x == data.from[0] && y == data.from[1]) {
                    if (color == game.moves && ((color == 'white' && data.sender == game.players[0]) || (color == 'black' && game.players[1]))) {
                        board[i][1] = data.to[0];
                        board[i][2] = data.to[1];
                        game.moves = game.moves == 'white' ? 'black' : 'white';
                        for (let i = 0; i < board.length; i++) {
                            let [color, x, y] = board[i];
                            if (x === data.kill[0] && y === data.kill[1]) {
                                board.splice(i, 1);
                            };
                        };
                        socketIO.emit('gameMove', {board: board, moves: game.moves, TOKEN: data.TOKEN});
                    };
                    break
                };
            };
        };
    })
});

server.listen(port=9000);
