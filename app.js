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
        // add the main game board to the DOM
        document.querySelector('#main').appendChild(main_board);
        document.getElementById('main').style.display = 'none';
    };

    return { board, makeBoard };
})();

// module to add functionality to the display (let the game "be played")
// also gathers the moves!
const displayController = (() => {

    // sets up the initial game state to be ready for play
    // @param player1, player2 The Player objects
    const gameSetup = (player1, player2) => {

        player1.setSymbol('X');
        player2.setSymbol('O');

        // event handler for 
        document.getElementById('game_start').addEventListener('click', e => {
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


            // show the game board!
            document.getElementById('main').style.display = 'block';

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
            });
            gameLogic.reset();
        })

    };

    // a simple bool to occilate between the player turns
    // is there maybe a better way to handle this? Fine for now
    player1_turn = true;
    
    // event handlers and logic for players clicking on the gameboard
    // will not let a player add their move to a tile if the tile is occupied
    // appends the move to the "moves" array as well
    // @param player1, player2 The two Player objects 
    // @param moves The board array from gameBoard.board module; 
    //        player moves are added to it and the array is passed to gameLogic.detectWinner with each move
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
        console.log(moves_remaining);
    };

    // checks for a winner of the game each time a move is made
    // @param arr The array of moves so far, still originally the board array from gameBoard.board module
    // @param player The player who just made a move
    // @param e The last square that was clicked on
    const detectWinner = (e, arr, player) => {

        // check rows for win
        // i+=3 so it doesn't erroneously look at sequential (array)
        // indices that appear in different 'rows' of the gameboard as a win
        for (i = 0; i < arr.length; i+=3) {
            if (arr[i] == '')
                continue;
            if (arr[i] == arr[i+1] && arr[i] == arr[i+2]){
                game_end_events.handleEvent(e, player)
                break;            
            }
        }

        // check columns for win
        // no index oddities like with the rows were noticed so just iterate through normally
        for (i = 0; i < arr.length; i++) {
            if (arr[i] == '')
                continue;
            if (arr[i] == arr[i+3] && arr[i] == arr[i+6]) {
                game_end_events.handleEvent(e, player)
                break;
                
            // diagonals prove tricky, most likely because the logic of how I 
            // setup the gameboard is flawed somewhere (or the way of doing things is really dumb)
            // seems to work without error though

            // detects a 'top-left' to 'bottom-right'
            } else if (i == 0 && arr[0] == arr[i+4] && arr[i+4] == arr[i+8]) {
                game_end_events.handleEvent(e, player)
                break;

            // detects a 'top-right' to 'bottom-left'
            } else if (i == 2 && arr[2] == arr[4] && arr[4] == arr[6]) {
                game_end_events.handleEvent(e, player)
                break;
            }
        }

        // This should detect and fire a tie game in most instances
        // currently if the last move affects a win, this will still fire,
        // but once we move the win prompts to the DOM that shouldn't be an issue anymore
        moves_remaining--;
        //console.log(moves_remaining);
        if (moves_remaining <= 0) {
            alert('TIE GAME');
        }
    };


    let win_panel = document.querySelector('#win_panel')
    let p = document.createElement('p');
    win_panel.appendChild(p);

    // object to handle the various game end states
    const game_end_events = {
    
        handleEvent(e, player) {
            switch(e.type) {
                case 'click':
                    this.handlers.click(e, player);
            }
        },

        handlers: {
            click(e, player) {
                player.setWins();
                win_panel.style.display = 'flex';
                console.log(`victory for ${player.getName()} yayyy!`)
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
displayController.gameSetup(player1, player2);
displayController.playerMoves(player1, player2, gameBoard.board);