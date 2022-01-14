const Gameboard = (() => {
    let turnCounter = 0;
    let board = document.querySelectorAll('.board_square');
    let board2 = [];
    board2.length = 9;
    board2.fill('test', 0, 8);


    board.forEach((square, index) => {
        square.addEventListener('click', (e) => {
            let p = document.createElement('p')
            if (turnCounter == 0) {
                p.innerText = 'x';
                p.setAttribute('class', 'player_move_x');
                turnCounter = 1;
            } else if (turnCounter == 1) {
                p.innerText = 'o';
                p.setAttribute('class', 'player_move_o');
                turnCounter = 0;
            }
            square.appendChild(p);
        })
    })
    const makeBoard = () => {
        console.log(board2);
    }
    return { makeBoard };
})();

const Player = (name, symbol) => {
    const getName = () => name;
    const getSymbol = () => symbol;

    const getPlayerInfo = () => {
        console.log(`${getName()}, ${getSymbol()}`)
    };

    return {getPlayerInfo};
};

const Gameplay = (player1, player2) => {

};  

let jimmy = Player('jimmy', 'x');
let bobby = Player('bobby', 'o');
jimmy.getPlayerInfo();


Gameboard.makeBoard();