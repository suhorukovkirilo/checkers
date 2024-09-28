let socket = io();
let hints = {};

socket.on('gameMove', function(data) {
    console.log('Server response detected...')
    if (data.TOKEN == TOKEN) {
        document.querySelector('.checkers').innerHTML = '';
        for (let [color, x, y] of data.board) {
            let checker = document.createElement('div');
            checker.setAttribute('color', color);
            checker.style.cssText = `--x: ${x}; --y: ${y}`;
            document.querySelector('.checkers').appendChild(checker);
        };
        
        canMove = data.moves == playerColor ? 'true': 'false';
        if (canMove == 'true') {
            document.querySelector('h2').innerHTML = 'Ваш хід (' + playerColor + ')';
        } else {
            document.querySelector('h2').innerHTML = 'Хід суперника (Ваш колір - ' + playerColor + ')';
        };
    };

    for (let checker of document.querySelectorAll('.checkers div')) {
        checker.onclick = Checkeronclick;
    };
});

for (let [color, x, y] of startBoard) {
    let checker = document.createElement('div');
    checker.setAttribute('color', color);
    checker.style.cssText = `--x: ${x}; --y: ${y}`;
    document.querySelector('.checkers').appendChild(checker);
};

if (canMove == 'true') {
    document.querySelector('h2').innerHTML = 'Ваш хід (' + playerColor + ')';
} else {
    document.querySelector('h2').innerHTML = 'Хід суперника (Ваш колір - ' + playerColor + ')';
};

function Checkeronclick() {
    console.log('checker clicked')
        for (let hint of document.querySelectorAll('.checkers .hint')) {
            hint.remove();
        };
        if (!(canMove == 'true')) {
            console.log('move prevented')
            return 0
        };
        let pos = getPos(this);
        let blacks = [], whites = [];
        for (let black of document.querySelectorAll('.checkers div[color="black"]')) {
            blacks.push(getPos(black));
        };
        for (let white of document.querySelectorAll('.checkers div[color="white"]')) {
            whites.push(getPos(white));
        };
        let color = 'white';
        for (let black of blacks) {
            if (black[0] == pos[0] && black[1] == pos[1]) {
                color = 'black';
                break
            };
        };
        if (color != playerColor) {
            console.log(color, playerColor)
            return 0
        };
        for (let {x, y, kill} of getPossibleWays(blacks, whites, pos, color)) {
            let hint = document.createElement('div');
            hint.classList.add('hint');
            hint.style.cssText = `--x: ${x}; --y: ${y}`;
            const uid = randint(11111111, 99999999).toString();
            hint.setAttribute('uid', uid);
            hints[uid] = {x: x, y: y, kill: kill};
            hint.onclick = function() {
                let hint = hints[this.getAttribute('uid')];
                let x = hint.x, y = hint.y, kill = hint.kill;
                console.log('emit move')
                socket.emit('move', {from: pos, to: [x, y], kill: kill, sender: playerName, TOKEN: TOKEN});
            };
            document.querySelector('.checkers').appendChild(hint);
        };
};

for (let checker of document.querySelectorAll('.checkers div')) {
    checker.onclick = Checkeronclick;
};


const getPos = (obj) => [Number(obj.style.getPropertyValue('--x')), Number(obj.style.getPropertyValue('--y'))];
const randint = (min, max) => Math.round(Math.random() * (max - min) + min);

function getPossibleWays(blacks, whites, check, color) {
    console.log(check);
    const boardSize = 8;
    const directions = {black: [
        [1, 1], [-1, 1]
    ], white: [
        [1, -1], [-1, -1]
    ]};

    
    // Check if a position is within the bounds of the board
    function isOnBoard([row, col]) {
        return row >= 0 && row < boardSize && col >= 0 && col < boardSize;
    }
    
    // Check if the square is free
    function isSquareFree(pos) {
        for (let check of blacks.concat(whites)) {
            if (check[0] == pos[0] && check[1] == pos[1]) {
                return false;
            };
        };
        return true;
    }
    
    const [row, col] = check;
    const moves = [];

    for (const [dRow, dCol] of directions[color]) {
        let newRow = row + dRow;
        let newCol = col + dCol;
        console.log([newRow, newCol]);
        
        // Check if a simple move is possible
        if (isOnBoard([newRow, newCol])) {
            if (isSquareFree([newRow, newCol])) {
                moves.push({x: newRow, y: newCol, kill: [9, 9]});
            } else {
                let rivals = color == 'white' ? blacks : whites;
                for (let rival of rivals) {
                    if (rival[0] == newRow && rival[1] == newCol && isSquareFree([newRow + dRow, newCol + dCol])) {
                        moves.push({x: newRow + dRow, y: newCol + dCol, kill: [newRow, newCol]});
                    };
                };
            };
        }
    }
    
    return moves;
}