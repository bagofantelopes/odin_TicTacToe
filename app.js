const Gameboard = () => {
    let count = 0;
    let boardSpaces = [
    '[]','[]','[]',
    '[]','[]','[]',
    '[]','[]','[]'];
    const makeBoard = () => {
        console.log(boardSpaces);
    }
    return { makeBoard };
}

const Player = (name, symbol) => {
    const getName = () => name;
    const getSymbol = () => symbol;

    const getPlayerInfo = () => {
        console.log(`${getName()}, ${getSymbol()}`)
    };

    return {getPlayerInfo};
}

let jimmy = Player('jimmy', 'x');
jimmy.getPlayerInfo();

let board1 = Gameboard();
board1.makeBoard();