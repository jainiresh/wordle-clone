const tileDisplay = document.querySelector('.tile-container');
const keyboard = document.querySelector('.key-container');
const messageDisplay = document.querySelector('.message-container');
let wordle ;

const getWordle = () => {
  console.log('started');
  const url = 'http://localhost:3000/word';
  fetch(url)
  .then(response => response.json())
  .then(json => {
    console.log(json);
    wordle = json.toUpperCase();
  })
  .catch((err) => {
    console.log(err);
  })
}

getWordle();

const keys = [
   'Q',
   'W',
   'E',
   'R',
   'T',
   'Y',
   'U',
   'I',
   'O',
   'P',
   'A',
   'S',
   'D',
   'F',
   'G',
   'H',
   'J',
   'K',
   'L',
   'ENTER',
   'Z',
   'X',
   'C',
   'V',
   'B',
   'N',
   'M',
  '<<'];

  const guessRows = [
    ['','','','',''],
    ['','','','',''],
    ['','','','',''],
    ['','','','',''],
    ['','','','','' ]
  ];

  let currentRow = 0;
  let currentTile = 0;
  let isGameOver = false;

  guessRows.forEach((guessRow, inc) => {
    const guessRowElement = document.createElement('div');
    guessRowElement.setAttribute('id', 'guessRow-' + inc);
    
    guessRow.forEach((gRE, inc2) =>{
      const innerTile = document.createElement('div');
      innerTile.setAttribute('id', 'guessRow-' + inc + '-innerTile-' + inc2);
      innerTile.classList.add('tile');
      guessRowElement.append(innerTile);
    })

    tileDisplay.append(guessRowElement);
  })

  const clickHandler = (letter) =>{
    console.log('clicked ', letter);

    if(letter == '<<'){
      deleteLetter();
      return;
    }
    if(letter == 'ENTER'){
      checkRow();
      return;
    }
    addLetter(letter);
  }

  const addLetter = (letter) =>{

    if(currentTile < 5 && currentRow < 5){
    const tile = document.getElementById('guessRow-'+currentRow+'-innerTile-'+currentTile);
    tile.textContent = letter;

    guessRows[currentRow][currentTile] = letter;
    tile.setAttribute('data', letter); // to color the tiles
    console.log(guessRows);

    currentTile+= 1;
    
  }
}

  const deleteLetter = () => {
    if(currentTile > 0){
    currentTile -= 1;
    const tile = document.getElementById('guessRow-'+currentRow+'-innerTile-'+currentTile);
    tile.textContent = '';
    guessRows[currentRow][currentTile] = '';
    tile.setAttribute('data', '');
    }
   
  }

  const checkRow = () => {
    const guessWord = guessRows[currentRow].join('');

    console.log(`Guess is ${guessWord} and the actual answer is ${wordle}`)
    if(currentTile >= 5){
     
      fetch(`http://localhost:3000/check/?word=${guessWord}`)
      .then(response => response.json())
      .then(json => {
        if(json.message !== 'Found'){
          showMessage('Word Not in List');
          return;
        }
        else{

          console.log(`Current Guess is : ${guessWord}`);
      flipTiles();
      if(guessWord === wordle){
          showMessage('Excellent !'); 
            currentRow += 1;
            isGameOver = true;
            return;
    }
    else
      {
        if(currentRow >= 4){
          isGameOver = false;
          showMessage('Game Over')
          return;
        } 
        if(currentRow < 4){
          currentRow += 1;
          currentTile = 0;
        }
      }

        }
      })
      .catch(e => console.log(e));
      
    }
  }

  const showMessage = ( message ) =>{
    const messageElement = document.createElement('p');
    messageElement.textContent = message;
    messageDisplay.append(messageElement);
    setTimeout(() => {
      messageDisplay.removeChild(messageElement)
    }, 2000);
  }

  const addColorToKeyBoard = ( letter, classToBeAdded )=>{
    const key = document.getElementById(letter);
    key.classList.add(classToBeAdded);
  }

  const flipTiles = () =>{
    
    const rowTiles = document.querySelector('#guessRow-'+currentRow).childNodes;
    
    let temp = wordle;
    const guess = [];

    rowTiles.forEach((tile, index) =>{
      guess.push({letter : tile.getAttribute('data'), color: 'gray-overlay'});
      console.log(guess[index])
    })



    guess.forEach((g, index) =>{
        if(g.letter === wordle[index]){
          g.color = 'green-overlay';
          temp = temp.replace(g.letter, '');
        }
    })

    guess.forEach((g)=>{
      if(temp.includes(g.letter)){
        g.color = 'yellow-overlay';
        temp = temp.replace(g.letter, '');
      }
    })
   
    rowTiles.forEach((rowTile, index) =>{ 

      setTimeout(()=>{
          rowTile.classList.add('flip');
          rowTile.classList.add(guess[index].color);
          addColorToKeyBoard(guess[index].letter, guess[index].color);
      }, 500 * index)

      
    })
  }

  keys.forEach((key) => {
    const buttonElement = document.createElement('button');
    buttonElement.textContent = key;
    buttonElement.setAttribute('id', key);
    buttonElement.addEventListener('click',() => clickHandler(key));
    keyboard.append(buttonElement);
  })