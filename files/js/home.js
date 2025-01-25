const startBoard = [
    ["black", 0, 0, false], ["black", 2, 0, false], ["black", 4, 0, false], ["black", 6, 0, false], ["black", 1, 1, false], 
    ["black", 3, 1, false], ["black", 5, 1, false], ["black", 7, 1, false], ["black", 0, 2, false], ["black", 2, 2, false], 
    ["black", 4, 2, false], ["black", 6, 2, false], ["white", 1, 5, false], ["white", 3, 5, false], ["white", 5, 5, false], 
    ["white", 7, 5, false], ["white", 2, 6, false], ["white", 4, 6, false], ["white", 6, 6, false], ["white", 0, 6, false],
    ["white", 1, 7, false], ["white", 3, 7, false], ["white", 5, 7, false], ["white", 7, 7, false]
];

const moveTime = 650;

for (let [color, x, y, queen] of startBoard) {
    let checker = document.createElement('div');
    checker.setAttribute('color', color);
    checker.style.cssText = `--x: ${x}; --y: ${y}`;
    document.querySelector('.checkers').appendChild(checker);
};

function move([x1, y1], [x2, y2, queen], [killX, killY], [restoreX, restoreY, restoreColor]) {
    for (let checker of document.querySelectorAll('.checkers *')) {
        if (checker.style.cssText === `--x: ${x1}; --y: ${y1};`) {
            checker.style.cssText = `--x: ${x2}; --y: ${y2};`;
            setTimeout(() => {
                if (queen) {
                    let img = document.createElement('img');
                    img.src = 'files/img/queen.png';
                    checker.appendChild(img);
                } else if (queen === false) {
                    checker.innerHTML = '';
                };
            }, moveTime / 4);
            if (killX !== undefined && killY !== undefined) {
                for (let checker of document.querySelectorAll('.checkers *')) {
                    if (checker.style.cssText === `--x: ${killX}; --y: ${killY};`) { 
                        setTimeout(() => checker.remove(), moveTime / 4);
                    };
                };
            } else if (restoreX !== undefined && restoreY !== undefined) {
                setTimeout(() => {
                    let checker = document.createElement('div');
                    checker.setAttribute('color', restoreColor);
                    checker.style.cssText = `--x: ${restoreX}; --y: ${restoreY}`;
                    document.querySelector('.checkers').appendChild(checker);
                    checker.setAttribute('isQueen', 'false');
                }, moveTime / 4);
            };
            break
        };
    };
};

function action() {
    const actions = [
        () => move([1, 5], [2, 4], [], []),
        () => move([2, 4], [3, 3], [], []),
        () => move([4, 2], [2, 4], [3, 3], []),
        () => move([3, 5], [1, 3], [2, 4], []),
        () => move([2, 2], [0, 4], [1, 3], []),
        () => move([4, 6], [3, 5], [], []),
        () => move([6, 2], [7, 3], [], []),
        () => move([2, 6], [1, 5], [], []),
        () => move([0, 4], [2, 6], [1, 5], []),
        () => move([2, 6], [4, 4], [3, 5], []),
        () => move([5, 5], [3, 3], [4, 4], []),
        () => move([7, 1], [6, 2], [], []),
        () => move([0, 6], [1, 5], [], []),
        () => move([6, 2], [5, 3], [], []),
        () => move([1, 5], [2, 4], [], []),
        () => move([0, 2], [1, 3], [], []),
        () => move([2, 4], [0, 2], [1, 3], []),
        () => move([3, 3], [4, 2], [], []),
        () => move([5, 1], [3, 3], [4, 2], []),
        () => move([3, 1], [4, 2], [], []),
        () => move([5, 7], [4, 6], [], []),
        () => move([2, 0], [3, 1], [], []),
        () => move([0, 2], [2, 0, true], [1, 1], []),
        () => move([3, 3], [2, 4], [] ,[]),
        () => move([1, 7], [0, 6], [], []),
        () => move([4, 2], [3, 3], [], []),
        () => move([2, 0], [4, 2], [3, 1], []),
        () => move([4, 2], [6, 4], [5, 3], []),
        () => move([7, 3], [5, 5], [6, 4], []),
        () => move([6, 6], [4, 4], [5, 5], []),
        () => move([4, 4], [2, 2], [3, 3], []),
        () => move([6, 0], [5, 1], [], []),
        () => move([7, 5], [6, 4], [], []),
        () => move([5, 1], [6, 2], [], []),
        () => move([7, 7], [6, 6], [], []),
        () => move([6, 2], [7, 3], [], []),
        () => move([4, 6], [3, 5], [], []),
        () => move([2, 4], [4, 6], [3, 5], []),
        () => move([3, 7], [5, 5], [4, 6], []),
        () => move([4, 0], [5, 1], [], []),
        () => move([6, 4], [5, 3], [], []),
        () => move([0, 0], [1, 1], [], []),
        () => move([2, 2], [0, 0, true], [1, 1], []),
        () => move([5, 1], [4, 2], [], []),
        () => move([5, 3], [3, 1], [4, 2], []),
        () => move([7, 3], [6, 4], [], []),
        () => move([5, 5], [7, 3], [6, 4], []),
        () => move([8, 8], [8, 8], [], []),

        // reversed

        () => move([8, 8], [8, 8], [], []),
        () => move([7, 3], [5, 5], [], [6, 4, 'black']),
        () => move([6, 4], [7, 3], [], []),
        () => move([3, 1], [5, 3], [], [4, 2, 'black']),
        () => move([4, 2], [5, 1], [], []),
        () => move([0, 0], [2, 2, false], [], [1, 1, 'black']),
        () => move([1, 1], [0, 0], [], []),
        () => move([5, 3], [6, 4], [], []),
        () => move([5, 1], [4, 0], [], []),
        () => move([5, 5], [3, 7], [], [4, 6, 'black']),
        () => move([4, 6], [2, 4], [], [3, 5, 'white']),
        () => move([3, 5], [4, 6], [], []),
        () => move([7, 3], [6, 2], [], []),
        () => move([6, 6], [7, 7], [], []),
        () => move([6, 2], [5, 1], [], []),
        () => move([6, 4], [7, 5], [], []),
        () => move([5, 1], [6, 0], [], []),
        () => move([2, 2], [4, 4], [], [3, 3, 'black']),
        () => move([4, 4], [6, 6], [], [5, 5, 'black']),
        () => move([5, 5], [7, 3], [], [6, 4, 'white']),
        () => move([6, 4], [4, 2], [], [5, 3, 'black']),
        () => move([4, 2], [2, 0], [], [3, 1, 'black']),
        () => move([3, 3], [4, 2], [], []),
        () => move([0, 6], [1, 7], [], []),
        () => move([2, 4], [3, 3], [], []),
        () => move([2, 0], [0, 2, false], [], [1, 1, 'black']),
        () => move([3, 1], [2, 0], [], []),
        () => move([4, 6], [5, 7], [], []),
        () => move([4, 2], [3, 1], [], []),
        () => move([3, 3], [5, 1], [], [4, 2, 'white']),
        () => move([4, 2], [3, 3], [], []),
        () => move([0, 2], [2, 4], [], [1, 3, 'black']),
        () => move([1, 3], [0, 2], [], []),
        () => move([2, 4], [1, 5], [], []),
        () => move([5, 3], [6, 2], [], []),
        () => move([1, 5], [0, 6], [], []),
        () => move([6, 2], [7, 1], [], []),
        () => move([3, 3], [5, 5], [], [4, 4, 'black']),
        () => move([4, 4], [2, 6], [], [3, 5, 'white']),
        () => move([2, 6], [0, 4], [], [1, 5, 'white']),
        () => move([1, 5], [2, 6], [], []),
        () => move([7, 3], [6, 2], [], []),
        () => move([3, 5], [4, 6], [], []),
        () => move([0, 4], [2, 2], [], [1, 3, 'white']),
        () => move([1, 3], [3, 5], [], [2, 4, 'black']),
        () => move([2, 4], [4, 2], [], [3, 3, 'white']),
        () => move([3, 3], [2, 4], [], []),
        () => move([2, 4], [1, 5], [], []),
    ];

    let current = -1;

    console.log(actions.length);

    setInterval(function() {
        current += 1;
        if (current == actions.length + 1) current = 0;
        actions[current]();
    }, moveTime);
};

function onTelegramAuth(u) {
    const keys = Object.keys(u);
    let fetchUrl = '/verify?';
    for (let key of keys ) {fetchUrl += `${key}=${u[key]}&`};

    fetch(fetchUrl)
    .then(response => response.json())
    .then(data => {
        const {first_name, last_name, username, photo_url, auth_date, hash, verified} = data;
        if (verified) {
            const _ = (i) => (i ? i.replace("undefined", "") : '');
            localStorage.setItem("first_name", _(first_name));
            localStorage.setItem("last_name", _(last_name));
            localStorage.setItem("username", _(username));
            localStorage.setItem("photo_url", _(photo_url));
            localStorage.setItem("auth_date", _(auth_date));
            localStorage.setItem("ACCOUNT_TOKEN", _(hash));
            localStorage.setItem("auth", "true");
            location.href = '/profile';
        } else {
            location.href = '/';
        }
    });
};

setTimeout(action, 500)