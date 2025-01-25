const express = require('express');
const app = express();
const server = require('http').Server(app);
const socketIO = require('socket.io')(server);
const cookies = require('cookie-parser')('It^s a secret');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const fs = require('fs');
const { request } = require('http');
const cookieAge = 14 * 24 * 60 * 60 * 1000;

let games = {};
let db = JSON.parse(fs.readFileSync('db.json', 'utf-8'));

app.use(cookies);
app.use('/files', express.static('files'));
app.use(bodyParser.urlencoded({extended: false}))

app.get('/', (request, response) => {
    let html = HTML('home.html', {})
    response.send(html)
});

app.get('/home', (request, response) => {
    let html = HTML('home.html', {});
    response.send(html)
});

app.get('/verify', (request, response) => {
    let query = request.query;
    let hash = query.hash;
    delete query.hash;
    const dataCheckString = Object.keys(query).sort().map(key => `${key}=${query[key]}`).join("\n");
  
    const secretKey = crypto.createHash('sha256').update(TELEGRAM_BOT_TOKEN).digest();
    const hmac = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');
    query.verified = hmac == hash;
    console.log("New login verification: ", query.verified);
    if (query.verified) {
        if (!Object.keys(db.accounts).includes(query.id)) {
            db.accounts[query.id] = {auth_date: query.auth_date,
                                     name: `${query.first_name} ${query.last_name}`.replace('undefined', ''),
                                     username: query.username,
                                     photo_url: query.photo_url,
                                     hash: hash,
                                     games: 0,
                                     won: 0};
            fs.writeFileSync('db.json', JSON.stringify(db), 'utf-8');                         
        };
    };
    query.hash = hash;
    response.send(JSON.stringify(query));
});

app.get('/profile', (request, response) => {
    let html = HTML('profile.html', {});
    response.send(html)
});

app.get('/create', (request, response) => {
    let cookies = request.cookies;
    let html = HTML('create.html', {name: cookies.name || ""})
    response.send(html)
})

app.get('/login', (request, response) => {
    let html = HTML('login.html', {});
    response.send(html);
});

app.post('/create', (request, response) => {
    let html, name = request.body.name, Account_TOKEN = request.body.Account_TOKEN;
    if (3 > name.length || name.length > 16) {
        html = HTML('create.html', {
            name: name, 
            message: 3 > name.length ? `Your name is too short` : `Your name is too long`
        });
        response.send(html);
    } else {
        response.cookie('name', name, {maxAge: cookieAge, secure: true});
        const TOKEN = newTOKEN();
        games[TOKEN] = {players: [name, null], board: [
            ["black", 0, 0, false], ["black", 2, 0, false], ["black", 4, 0, false], ["black", 6, 0, false], ["black", 1, 1, false], 
            ["black", 3, 1, false], ["black", 5, 1, false], ["black", 7, 1, false], ["black", 0, 2, false], ["black", 2, 2, false], 
            ["black", 4, 2, false], ["black", 6, 2, false], ["white", 1, 5, false], ["white", 3, 5, false], ["white", 5, 5, false], 
            ["white", 7, 5, false], ["white", 2, 6, false], ["white", 4, 6, false], ["white", 6, 6, false], ["white", 0, 6, false],
            ["white", 1, 7, false], ["white", 3, 7, false], ["white", 5, 7, false], ["white", 7, 7, false]
        ], moves: 'white', ended: false, winner: null, continue: [null, null], Account_TOKEN: [Account_TOKEN, null]}
        response.cookie('TOKEN', TOKEN, {maxAge: cookieAge, secure: true});
        response.redirect('/game');
    };
});

app.get('/join', (request, response) => {
    if (request.query.game == null) {
        let html = HTML('join.html', {});
        response.send(html)
    } else if (!Object.keys(games).includes(request.query.game)) {
        response.send("Запрошувальне посилання не дійсне")
    } else {
        response.cookie('TOKEN', request.query.game, {maxAge: cookieAge, secure: true});
        let html = HTML('create.html', {name: request.cookies.name || ""});
        response.send(html);
    };
});

app.post('/join', (request, response) => {
    let TOKEN = request.query.game, name = request.body.name, Account_TOKEN = request.body.Account_TOKEN;
    if (!Object.keys(games).includes(request.query.game)) {
        response.send("Запрошувальне посилання не дійсне")
    } else {
        if (name == games[TOKEN].players[0]) {
            let html = HTML('index.html', {name: request.cookies.name || ""});
            response.send(html);
        } else {
            response.cookie('name', name, {maxAge: cookieAge, secure: true})
            response.cookie('TOKEN', TOKEN, {maxAge: cookieAge, secure: true})
            games[TOKEN].players[1] = name;
            if (Account_TOKEN) {
                games[TOKEN].Account_TOKEN[1] = Account_TOKEN;
            };
            console.log(games[TOKEN]);
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
            opponent: name == games[TOKEN].players[0] ? games[TOKEN].players[1] : games[TOKEN].players[0],
            board: JSON.stringify(games[TOKEN].board), 
            color: color,
            gameEnded: games[TOKEN].ended,
            victory: game.winner == null ? null : game.winner == name ? true : false,
            move: games[TOKEN].moves == color}
        );
        response.send(html);
    };
});

app.get('/FAQ', (request, response) => {
    let html = HTML('faq.html', {})
    response.send(html);
});

function HTML(file, Vars) {
    let html = fs.readFileSync('files/html/' + file, 'utf-8');
    let header = fs.readFileSync('files/html/header.html', 'utf-8');
    html = html.replace('{{ header }}', header);
    let background = fs.readFileSync('files/html/background.html', 'utf-8');
    html = html.replace('{{ background }}', background);
    for (let Var of Object.keys(Vars)) {
        html = html.replace(`{{ ${Var} }}`, Vars[Var])
    };
    return html
};

function newTOKEN(length=6) {
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
                let [color, x, y, queen] = board[i];
                if (x == data.from[0] && y == data.from[1]) {
                    if (color == game.moves && ((color == 'white' && data.sender == game.players[0]) || (color == 'black' && game.players[1]))) {
                        board[i][1] = data.to[0];
                        board[i][2] = data.to[1];
                        if ((color == "white" && data.to[1] == 0) || (color == "black" && data.to[1] == 7)) {
                            board[i][3] = true;
                        };
                        game.moves = game.moves == 'white' ? 'black' : 'white';
                        for (let i = 0; i < board.length; i++) {
                            let [color, x, y] = board[i];
                            if (x === data.kill[0] && y === data.kill[1]) {
                                board.splice(i, 1);
                            };
                        };
                        socketIO.emit('gameMove', {board: board, moves: game.moves, TOKEN: data.TOKEN});

                        let count = {white: 0, black: 0};
                        for (let checker of board) {
                            if (checker[0] == "white") {
                                count.white += 1;
                            } else if (checker[0] == "black") {
                                count.black += 1;
                            };
                        };
                        if (count.white == 0 || count.black == 0) {
                            game.ended = true;
                            game.winner = count.white == 0 ? game.players[1] : game.players[0];
                            if(game.Account_TOKEN[0] !== null) {
                                for (let id of Object.keys(db.accounts)) {
                                    if (db.accounts[id].hash == game.Account_TOKEN[0]) {
                                        db.accounts[id].games += 1;
                                        db.accounts[id].won += count.white == 0 ? 0 : 1;
                                    };
                                };
                            };
                            if(game.Account_TOKEN[1] !== null) {
                                for (let id of Object.keys(db.accounts)) {
                                    if (db.accounts[id].hash == game.Account_TOKEN[1]) {
                                        db.accounts[id].games += 1;
                                        db.accounts[id].won += count.black == 0 ? 0 : 1;
                                    };
                                };
                            };
                            socketIO.emit('gameEnded', {TOKEN: data.TOKEN, winner: game.winner})
                        };
                    };
                    break
                };
            };
        };
    });

    socket.on('newGame', function(data) {
        let game = games[data.TOKEN];
        if(Object.keys(games).includes(data.TOKEN) && game.players.includes(data.player)) {
            let n = data.player == game.players[0] ? 0 : 1;
            game.continue[n] = data.agree;
            if (game.continue[0] && game.continue[1]) {
                games[data.TOKEN] = {players: game.players, board: [
                    ["black", 0, 0, false], ["black", 2, 0, false], ["black", 4, 0, false], ["black", 6, 0, false], ["black", 1, 1, false], 
                    ["black", 3, 1, false], ["black", 5, 1, false], ["black", 7, 1, false], ["black", 0, 2, false], ["black", 2, 2, false], 
                    ["black", 4, 2, false], ["black", 6, 2, false], ["white", 1, 5, false], ["white", 3, 5, false], ["white", 5, 5, false], 
                    ["white", 7, 5, false], ["white", 2, 6, false], ["white", 4, 6, false], ["white", 6, 6, false], ["white", 0, 6, false],
                    ["white", 1, 7, false], ["white", 3, 7, false], ["white", 5, 7, false], ["white", 7, 7, false]
                ], moves: 'white', ended: false, winner: null, continue: [null, null], Account_TOKEN: games[data.TOKEN].Account_TOKEN};
                socketIO.emit('gameRestart', {TOKEN: data.TOKEN})
            };
        };
    });
});

server.listen(port=9000);
