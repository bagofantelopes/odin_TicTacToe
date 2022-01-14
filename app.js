// module which generates the gameboard
const gameBoard = (() => {

    let board = [];
    board.length = 9;
    board.fill('test', 0, 9);
    console.log(board);

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
            game_square = document.createElement('div')
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
            }
        });
        // add the main game board to the DOM
        document.querySelector('#main').appendChild(main_board);
    }

    return { board, makeBoard };
})();

const Player = (name, symbol) => {
    const getName = () => name;
    const getSymbol = () => symbol;

    const getPlayerInfo = () => {
        console.log(`${getName()}, ${getSymbol()}`)
    };

    return {getName, getSymbol, getPlayerInfo};
};

const Gameplay = (array, player1, player2) => {
    
};  

let jimmy = Player('jimmy', 'x');
let bobby = Player('bobby', 'o');
jimmy.getPlayerInfo();
gameBoard.makeBoard();
console.log(gameBoard.board);