class Player {
  constructor(boardSelector, name) {
    this.name = name;
    this.boardSelector = boardSelector;
    this.board = [];
    this.pieces = [2,3,3,4,5];
    this.score = this.pieces.reduce((sum,val) => sum += val,0);
    this.scoreBoard = document.getElementById(`${this.boardSelector.id}-remaining`)
    this.scoreBoard.innerText = `Pieces remaining: ${this.score}`;
  }

  decrementScore() {
    this.score--;
    this.scoreBoard.innerText = `Pieces remaining: ${this.score}`;
  }
}

class Game {
  constructor(p1, p2, messageBox, boardSize = 10){
    this.messageBox = messageBox;
    this.messageBox.innerText = `${p1.name}'s Turn`;
    this.boardSize = boardSize;
    p1.board = this.makeBoard(p1.pieces);
    p2.board = this.makeBoard(p2.pieces);
    this.players = {p1, p2};
    this.currentPlayer = p1;
    this.makeHTMLBoard(p1);
    this.makeHTMLBoard(p2);
  }

  makeBoard(pieces) {
    let board = new Array(this.boardSize)
      .fill(null)
      .map(row => Array(this.boardSize)
        .fill(0))

    for(let piece of pieces) {
      this.setPiece(piece, board);  
    }

    return board;
  }

  setPiece(pieceSize, board) {
    let direction, xDir, yDir, xMaxStart, yMaxStart, xStart, yStart;

    do {
      direction = Math.round(Math.random());
      xDir = direction === 0 ? 1 : 0;
      yDir = direction === 1 ? 1 : 0;
      xMaxStart = board[0].length - pieceSize * xDir;
      yMaxStart = board.length - pieceSize * yDir;
      xStart = Math.floor(Math.random() * xMaxStart);
      yStart = Math.floor(Math.random() * yMaxStart)
    } while (!this.isValidPosition(xStart, yStart, xDir, yDir, pieceSize, board))
    
    for(let i = 0; i < pieceSize; i++) {
      const xNext = xStart + xDir * i;
      const yNext = yStart + yDir * i;
      board[yNext][xNext] = 1;
    }
  }

  isValidPosition(x,y, xDir, yDir, pieceSize, board) {
    
    for(let i = 0; i < pieceSize; i++) {
      const xNext = x + xDir * i;
      const yNext = y + yDir * i;
      if(board[yNext][xNext] === 1) return false;
    }

    return true;
  }

  makeHTMLBoard(player) {
    let rowLabel = 'A';

    player.boardSelector.addEventListener('click', e => {
      const cell = e.target.closest('td');

      if(cell.id && !cell.style.backgroundColor)
        this.handleClick(player.boardSelector, cell)
    })

    let firstRow = document.createElement('tr');
    for(let i = 0; i <= player.board[0].length; i++) {
      let col = document.createElement('td')
      if(i !== 0) col.innerText = i;
      firstRow.appendChild(col);
    }
  
    player.boardSelector.appendChild(firstRow)
  
    for(let i = 0; i < player.board.length; i++) {
      let currentRow = document.createElement('tr');
      let firstCol = document.createElement('td');
      
      firstCol.innerText = String.fromCharCode(rowLabel.charCodeAt() + i)
      currentRow.appendChild(firstCol);

      for(let j = 0; j < player.board[0].length; j++) {
        let col = document.createElement('td');
      
        col.id = `${player.boardSelector.id}-${i}-${j}`;

        currentRow.appendChild(col);
      }
      player.boardSelector.appendChild(currentRow);
    }
  }

  handleClick (board, cell) {
    if(board === this.currentPlayer.boardSelector) {
      const coordinate = cell.id;
      const [, y, x] = coordinate.split('-');
      
      this.updateScore(cell, x, y);
        
      this.currentPlayer.score === 0
        ? this.endGame()
        : this.switchPlayers();
    }
  }

  updateScore(cell, x, y) {
    if(this.currentPlayer.board[x][y]) {
      cell.style.backgroundColor = 'red';
      this.currentPlayer.decrementScore();
    } else {
      cell.style.backgroundColor = 'grey';
    }
  }

  switchPlayers () {
    this.currentPlayer = this.currentPlayer === this.players.p1 
      ? this.players.p2
      : this.players.p1;
    
    this.messageBox.innerText = `${this.currentPlayer.name}'s Turn`;
  }

  endGame () {
    this.messageBox.innerText = `${this.currentPlayer.name} Wins!`;
    this.currentPlayer = null;
  }

}

const startContainer = document.getElementById('start-game-container')
const start = document.getElementById('start-game')
let game, p1, p2;

start.addEventListener('click', () => {
  p1 = new Player(document.getElementById('p1'), document.getElementById('p1-name').value);
  p2 = new Player(document.getElementById('p2'), document.getElementById('p2-name').value);
  game = new Game(p1, p2, document.getElementById('message'));
  startContainer.style.display = 'none';
});