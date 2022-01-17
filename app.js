// module which generates the gameboard
const gameBoard = (() => {

    let board = [];
    board.length = 9;
    board.fill('', 0, 9);

    const makeBoard = () => {
        squareCounter = 0;
        rowCounter = 0;
        let main_board = document.createElement('div');
        main_board.setAttribute('id', 'game_board');    
        let row = document.createElement('div');
        row.setAttribute('data-index', rowCounter);
        row.setAttribute('class', 'board_row');

        board.forEach((square, index) => {
            // create individual squares and add them to a row
            game_square = document.createElement('div');
            game_square.setAttribute('class', 'board_square');
            game_square.setAttribute('data-index', index);
            game_square.innerText = square;
            row.appendChild(game_square);
            squareCounter++;

            // add rows to the main game board
            if (squareCounter == 3) {
                main_board.appendChild(row);
                rowCounter++;
                row = document.createElement('div');
                row.setAttribute('class', 'board_row');
                row.setAttribute('data-index', rowCounter);
                squareCounter = 0;
            };
        });
        // add the main game board to the DOM
        document.querySelector('#main').appendChild(main_board);
    };

    return { board, makeBoard };
})();

// module to add functionality to the display (let the game "be played")
// also gathers the moves!
const displayController = (() => {
    player_turn = true;
    let moves = [];
    moves.length = 9;

    const playerMoves = () => {
        let nodelist = document.querySelectorAll('#main #game_board .board_row .board_square')
        //console.log(nodelist);
        nodelist.forEach((square) => {
            square.addEventListener('click', e => {
                if (player_turn) {
                    let i = e.currentTarget.getAttribute('data-index');
                    moves[i] = 'X';
                    e.currentTarget.innerText = 'X';
                    player_turn = false;
                } else if (!player_turn) {
                    let i = e.currentTarget.getAttribute('data-index');
                    moves[i] = 'O';
                    e.currentTarget.innerText = 'O';
                    player_turn = true;
                }

            });
        });
    };

    return { playerMoves, moves }
})();

const Player = (name, symbol) => {
    const getName = () => name;
    const getSymbol = () => symbol;

    const getPlayerInfo = () => {
        console.log(`${getName()}, ${getSymbol()}`)
    };

    return {getName, getSymbol, getPlayerInfo};
};



let player1 = Player('jimmy', 'x');
let player2 = Player('bobby', 'o');
player1.getPlayerInfo();
gameBoard.makeBoard();
displayController.playerMoves();

let test_button = document.getElementById('test_button');
test_button.addEventListener('click', e => {
    console.log(displayController.moves);
})