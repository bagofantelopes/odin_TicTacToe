// module which generates the gameboard
const gameBoard = (() => {

    let board = [];
    board.length = 9;
    board.fill('', 0, 9);

    // function which generates the HTML for the game board
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

            // add rows to the main game board once they have 3 squares appended
            if (squareCounter == 3) {
                main_board.appendChild(row);
                rowCounter++;
                row = document.createElement('div');
                row.setAttribute('class', 'board_row');
                row.setAttribute('data-index', rowCounter);
                squareCounter = 0;
            };
        });
        document.querySelector('#win_panel').style.display = 'none';
        document.querySelector('#main').appendChild(main_board); // add the main game board to the DOM
        document.getElementById('main').style.display = 'none';
    };
    return { board, makeBoard };
})();

// module to add functionality to the display (let the game "be played")
// also gathers the moves!
const displayController = (() => {

    // sets up the initial game state to be ready for play
    // @param player1, player2 The Player objects
    const gameSetup = (player1, player2, moves) => {

        player1.setSymbol('X');
        player2.setSymbol('O');

        // event handler for the button to start the whole game!
        document.getElementById('game_start').addEventListener('click', e => {
            playerMoves(player1, player2, gameBoard.board);
            document.getElementById('game_start').style.display = 'none';
            playerOneName = document.getElementById('player_1_name').value;
            if (!playerOneName) {
                player1.setName('Player 1');
            } else {    
                player1.setName(playerOneName);
            }
            document.getElementById('player_1_label').innerText = `${player1.getName()}`;
            document.getElementById('player_1_name').style.display = 'none';

            playerTwoName = document.getElementById('player_2_name').value;
            if (!playerTwoName){
                player2.setName('Player 2')
            } else {
                player2.setName(playerTwoName);
            }
            document.getElementById('player_2_label').innerText = `${player2.getName()}`;
            document.getElementById('player_2_name').style.display = 'none';

            document.getElementById('main').style.display = 'block'; // show the game board!

            let playerOneStats = document.createElement('p')
            playerOneStats.setAttribute('id', 'player_one_stats');
            playerOneStats.innerText = `Games Won: ${player1.getWins()}`;
            document.querySelector('#player_1_panel').appendChild(playerOneStats);

            let playerTwoStats = document.createElement('p');
            playerTwoStats.setAttribute('id', 'player_two_stats');
            playerTwoStats.innerText = `Games Won: ${player2.getWins()}`;
            document.querySelector('#player_2_panel').appendChild(playerTwoStats);
        });

        // RESET GAME FUNCTION
        let reset = document.getElementById('reset_button');
        reset.addEventListener('click', e => {
            gameBoard.board.fill('',0, 9);
            let nodelist = document.querySelectorAll('#main #game_board .board_row .board_square')
            nodelist.forEach((square) => {
                square.innerText = '';
                square.style.pointerEvents = 'fill';
            });
            gameLogic.reset();
        })
    };

    // a simple bool to occilate between the player turns
    player1_turn = true;
    
    // event handlers and logic for players clicking on the gameboard
    // will not let a player add their move to a tile if the tile is occupied
    // appends the move to the "moves" array as well
    // @param player1, player2 The two Player objects 
    // @param moves The board array from gameBoard.board module; 
    const playerMoves = (player1, player2, moves) => {
        let nodelist = document.querySelectorAll('#main #game_board .board_row .board_square')
        //console.log(nodelist);
        nodelist.forEach((square) => {
            square.addEventListener('click', e => {
                if (player1_turn) {
                    let i = e.currentTarget.getAttribute('data-index');
                    moves[i] = player1.getSymbol();
                    if (e.currentTarget.innerText == '') {
                        e.currentTarget.innerText = player1.getSymbol();
                        gameLogic.detectWinner(e, moves, player1);
                        player1_turn = false;    
                    }
                } else if (!player1_turn) {
                    let i = e.currentTarget.getAttribute('data-index');
                    moves[i] = player2.getSymbol();
                    if (e.currentTarget.innerText == '') {
                        e.currentTarget.innerText = player2.getSymbol();
                        gameLogic.detectWinner(e, moves, player2);
                        player1_turn = true;
                    }
                }
            });
        });
    };
    return { gameSetup, playerMoves }
})();


// module to run the game 'logic'
// just checks for win conditions, displays victory messages and updates player stats on wins, etc.
const gameLogic = (() => {

    let moves_remaining = 9;
    const reset = () => {
        moves_remaining = 9;
        document.querySelector('#win_panel').style.display = 'none';
    };

    // checks for a winner of the game each time a move is made
    // @param arr The array of moves made so far
    // @param player The player who just made a move
    // @param e The last square that was clicked on`
    const detectWinner = (e, arr, player) => {

        // to flag a tie when combined with moves_remaining
        let win = false;
        for (i = 0; i < arr.length; i++) {
            // check columns for win
            // no index oddities like with the rows were noticed so just iterate through normally
            if (arr[i] == '')
                continue;
            if (arr[i] == arr[i+3] && arr[i] == arr[i+6]) {
                win = true;
                game_end_events.handleWin(e, player, win)
                break;
            
            // check rows for wins
            // Unlike with columns just iterating through the array will detect sequential squares
            // in different rows and erroneously report a win
            // so the exta code restricts the check to the start of each row (indices 0, 3, 6)
            } else if ((i == 0 || i%3 == 0) && arr[i] == arr[i+2] && arr[i+1] == arr[i+2]) {
                win = true;
                game_end_events.handleWin(e, player, win);
                break;
                
            // diagonals had a similar problem to rows, but a simple clause
            // to restrict the initial indice checked keeps things working
            } else if (i == 0 && arr[0] == arr[i+4] && arr[i+4] == arr[i+8]) {
                win = true;
                game_end_events.handleWin(e, player, win)
                break;
            } else if (i == 2 && arr[2] == arr[4] && arr[4] == arr[6]) {
                win = true;
                game_end_events.handleWin(e, player, win)
                break;
            }
        }
        moves_remaining--;
        if (moves_remaining <= 0 && win == false) {
            game_end_events.handleTie(e, win);
        }
    };

    let win_panel = document.querySelector('#win_panel')
    let p = document.createElement('p');
    win_panel.appendChild(p);

    // object to handle the various game end states
    const game_end_events = {
    
        handleWin(e, player) {
            let nodelist = document.querySelectorAll('#main #game_board .board_row .board_square')
            nodelist.forEach(square => {
                square.style.pointerEvents = 'none'; // disable clicks since game is over
            });
            player.setWins();
            win_panel.style.display = 'flex';
            if(player.getSymbol() == 'X') {
                document.querySelector('#player_one_stats').innerText = 
                    `Games Won: ${player.getWins()}`;

                p.innerText = `Victory for ${player.getName()}!`
            } else if(player.getSymbol() == 'O') {
                document.querySelector('#player_two_stats').innerText = 
                    `Games Won: ${player.getWins()}`;

                p.innerText = `Victory for ${player.getName()}!`
            }
        },

        handleTie(e, win) {
            alert('SHIT IS TIED YO')

        },
    }
    return { detectWinner, reset };
})();

// factory function to make Player objects
// Has suite of getters and setters to access or update Player parameters as needed
const Player = () => {
    let symbol = '';
    let name = '';
    let wins = 0;

    const getName = () => name;
    const setName = (str) => name = str;

    const setSymbol = (str) => symbol = str;
    const getSymbol = () => symbol;

    const setWins = () => wins++;
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
displayController.gameSetup(player1, player2, gameBoard.board);
//displayController.playerMoves(player1, player2, gameBoard.board);