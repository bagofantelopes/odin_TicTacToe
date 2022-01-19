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
        document.getElementById('main').style.display = 'none';
    };

    return { board, makeBoard };
})();

// module to add functionality to the display (let the game "be played")
// also gathers the moves!
const displayController = (() => {

    // lets player1 select whether they want to be 'X' or 'O'
    // player2 will be whichever one player1 did not choose
    const playerSetup = (playerObj1, playerObj2) => {
        x = document.getElementById('x_button');
        x.addEventListener('click', e => {
            if(!playerObj1.getSymbol()) {
                playerObj1.setSymbol('X');
                playerObj2.setSymbol('O');
                document.getElementById('player_move_select_panel').style.display = 'none';
                document.getElementById('main').style.display = 'block';
            };
        });

        o = document.getElementById('o_button');
        o.addEventListener('click', e => {
            if(!playerObj1.getSymbol()) {
                playerObj1.setSymbol('O');
                playerObj2.setSymbol('X');
                document.getElementById('player_move_select_panel').style.display = 'none';
                document.getElementById('main').style.display = 'block';
            };
        });

        document.getElementById('name_submit').addEventListener('click', e => {
            player1Name = document.getElementById('player_1_name');
            playerObj1.setName(player1Name.innerText);
    
            console.log(playerObj1.getName());
    
            player2Name = document.getElementById('player_2_name');
            playerObj2.setName = player2Name.innerText;    
        });

    };

    // a simple bool to occilate between the player turns
    // is there maybe a better way to handle this?
    // Fine for now
    player1_turn = true;
    
    // event handlers and logic for players clicking on the gameboard
    // will not let a player add their move to a tile if the tile is occupied
    // appends the move to the "moves" array as well
    const playerMoves = (playerObj1, playerObj2, moves) => {
        let nodelist = document.querySelectorAll('#main #game_board .board_row .board_square')
        //console.log(nodelist);
        nodelist.forEach((square) => {
            square.addEventListener('click', e => {
                if (player1_turn) {
                    let i = e.currentTarget.getAttribute('data-index');
                    moves[i] = playerObj1.getSymbol();
                    if (e.currentTarget.innerText == '') {
                        e.currentTarget.innerText = playerObj1.getSymbol();
                        gameLogic.detectWinner(moves, playerObj1.getSymbol());
                        player1_turn = false;    
                    }
                } else if (!player1_turn) {
                    let i = e.currentTarget.getAttribute('data-index');
                    moves[i] = playerObj2.getSymbol();
                    if (e.currentTarget.innerText == '') {
                        e.currentTarget.innerText = playerObj2.getSymbol();
                        gameLogic.detectWinner(moves, playerObj2.getSymbol());
                        player1_turn = true;
                    }
                }
            });
        });
    };

    return { playerSetup, playerMoves }
})();

const gameLogic = (() => {

    // checks for a winner of the game each time a move is made
    // @param arr The array of moves so far
    // @param char The symbol of the player who just made a move
    const detectWinner = (arr, char) => {

        let nodelist = document.querySelectorAll('.board_square');

        // check rows for win
        // i+=3 so it doesn't erroneously look at sequential (array)
        // indices that appear in different 'rows' of the gameboard as a win
        for (i = 0; i < arr.length; i+=3) {
            if (arr[i] == '')
                continue;
            if (arr[i] == arr[i+1] && arr[i] == arr[i+2]){
                alert(
                    `Row victory for Player ${char} at ${nodelist[i].getAttribute('data-index')},
                    ${nodelist[i+1].getAttribute('data-index')},
                    ${nodelist[i+2].getAttribute('data-index')}`
                );
                break;
            }
        }

        // check columns for win
        // no index iteration oddities like with the rows, for some reason
        for (i = 0; i < arr.length; i++) {
            if (arr[i] == '')
                continue;
            if (arr[i] == arr[i+3] && arr[i] == arr[i+6]) {
                alert(
                    `Column victory for Player ${char} at ${nodelist[i].getAttribute('data-index')},
                    ${nodelist[i+3].getAttribute('data-index')},
                    ${nodelist[i+6].getAttribute('data-index')}`
                );
                break;
            }
        }

        // check for diagonal wins
        for (i = 0; i < arr.length; i++) {
            if (arr[i] == '')
                continue;
            if (arr[i] == arr[i+4] && arr[i] == arr[i+8]) {
                alert(
                    `Diagonal victory for Player ${char} at ${nodelist[i].getAttribute('data-index')},
                    ${nodelist[i+4].getAttribute('data-index')},
                    ${nodelist[i+8].getAttribute('data-index')}`
                );
                break;
            } else if (arr[i] == arr[i+2] && arr[i] == arr[i+4]) {
                alert(
                    `Diagonal victory for Player ${char} at ${nodelist[i].getAttribute('data-index')},
                    ${nodelist[i+2].getAttribute('data-index')},
                    ${nodelist[i+4].getAttribute('data-index')}`
                );
                break;

            }
        }
    };

    return { detectWinner };

})();

const Player = () => {
    let symbol = '';
    let name = '';
    let wins = '';

    const getName = () => name;
    const setName = (str) => name = str;

    const setSymbol = (str) => symbol = str;
    const getSymbol = () => symbol;

    const setWins = (num) => wins = num;
    const getWins = () => wins;


    return {
        getName, setName, 
        getSymbol, setSymbol,
        getWins, setWins,
    };
};



let player1 = Player();
let player2 = Player();

gameBoard.makeBoard();
displayController.playerSetup(player1, player2);
displayController.playerMoves(player1, player2, gameBoard.board);

let test_button = document.getElementById('test_button');
test_button.addEventListener('click', e => {
    console.log(gameBoard.board);
})