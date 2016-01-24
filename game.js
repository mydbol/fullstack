var gameOfLife = {
  width: 250,
  height: 250,
  stepInterval: 100,
  totalLiving: null,
  currentInterval: null,
  createAndShowBoard: function() {
    // create <table> element
    var goltable = document.createElement("tbody");

    // build Table HTML
    var tablehtml = '';
    for (var h = 0; h < this.height; h++) {
      tablehtml += "<tr id='row+" + h + "'>";
      for (var w = 0; w < this.width; w++) {
        tablehtml += "<td data-status='dead' id='" + w + "-" + h + "'></td>";
      }
      tablehtml += "</tr>";
    }
    goltable.innerHTML = tablehtml;

    // add table to the #board element
    var board = document.getElementById('board');
    board.appendChild(goltable);

    // once html elements are added to the page, attach events to them
    this.setupBoardEvents();
  },

  forEachCell: function(iteratorFunc) {
    /* 
      Write forEachCell here. You will have to visit
      each cell on the board, call the "iteratorFunc" function,
      and pass into func, the cell and the cell's x & y
      coordinates. For example: iteratorFunc(cell, x, y)
    */
    for (var y = 0; y < this.height; y++) {
      for (var x = 0; x < this.width; x++) {
        iteratorFunc(document.getElementById(x + '-' + y), x, y);
        //var id=''+x + "-" +y+'';
        //document.getElementById(id).style.backgroundColor="red";
      }
    }
  },

  initButtons: function() {
    var stepBtn = document.getElementById('step_btn');
    var playBtn = document.getElementById('play_btn');
    var resetBtn = document.getElementById('reset_btn');
    var clearBtn = document.getElementById('clear_btn');

    stepBtn.onclick = function(e) {
      clearInterval(this.currentInterval)
      this.forEachCell(this.step);
      //this.totalLiving = 0;
      this.forEachCell(this.UpdateBoard.bind(this));
    }.bind(this); // this points to the gameOfLife{}

    clearBtn.onclick = function(e) {
      console.log('clear button clicked!')
      clearInterval(this.currentInterval)
      this.totalLiving = 0;
      this.forEachCell(function(cell, x, y) {
        cell.className = "dead"; // set class to dead, this will change color to white
        cell.setAttribute('data-status', 'dead'); // set all dead
        cell.setAttribute('fateValue', 'dead') // clear fate
      });
    }.bind(this);

    playBtn.onclick = function(e) {
      clearInterval(this.currentInterval)
      console.log('play Button clicked!')
      this.enableAutoPlay();
    }.bind(this);

    resetBtn.onclick = function(e) {
      // clear everything, and then
      // go through cells and set to random alive/dead

      this.forEachCell(function(cell, x, y) {
        var rand = Math.floor(Math.random() * 2);
        var deadOrAlive = (rand === 0) ? "dead" : "alive";
        cell.className = deadOrAlive;
        cell.setAttribute('data-status', deadOrAlive);
        cell.setAttribute('fateValue', deadOrAlive);

      })
      this.forEachCell(this.UpdateBoard)
      //this.totalLiving = 0;
    }.bind(this);
  },


  setupBoardEvents: function() {
    // each board cell has an CSS id in the format of: "x-y" 
    // where x is the x-coordinate and y the y-coordinate
    // use this fact to loop through all the ids and assign
    // them "on-click" events that allow a user to click on 
    // cells to setup the initial state of the game
    // before clicking "Step" or "Auto-Play"

    // clicking on a cell should toggle the cell between "alive" & "dead"
    // for ex: an "alive" cell be colored "blue", a dead cell could stay white

    // EXAMPLE FOR ONE CELL
    // Here is how we would catch a click event on just the 0-0 cell
    // You need to add the click event on EVERY cell on the board

    var onCellClick = function(e) {
      // QUESTION TO ASK YOURSELF: What is "this" equal to here?

      // how to set the style of the cell when it's clicked
      if (this.getAttribute('data-status') == 'dead') {
        this.className = "alive";
        this.setAttribute('data-status', 'alive');
      }
      else {
        this.className = "dead";
        this.setAttribute('data-status', 'dead');
      }
    };
    //this.forEachCell();
    this.forEachCell(function(cell, x, y) {
      // iterate once, cell gets set to current element by id;
      //var id=''+x + "-" +y+'';
      //cell.style.backgroundColor="red";
      cell.onclick = onCellClick
        //var currentCell = cell + x + y;
        //currentCell.onclick = onCellClick
    });
    //var cell00 = document.getElementById('0-0');
    //cell00.onclick = onCellClick;


    // initialize buttons
    this.initButtons();

  },
  // Any live cell with two or three live neighbors lives on to the next generation.
  // Any live cell with fewer than two live neighbors dies, as if caused by under-population.
  // Any live cell with more than three live neighbors dies, as if by overcrowding.
  // Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.
  step: function(cell, xIn, yIn) {
    // Here is where you want to loop through all the cells
    // on the board and determine, based on it's neighbors,
    // whether the cell should be dead or alive in the next
    // evolution of the game. 
    // You need to:
    // 1. Count alive neighbors for all cells
    var livingNeighbors = 0;
    for (var y = yIn - 1; y <= yIn + 1; y++) { // when yIn = 1, y = 0 to 2
      for (var x = xIn - 1; x <= xIn + 1; x++) { // when xIn = 1, x = 0 to 2
        if ((yIn === y) && (xIn === x)) {
          continue;
        } // skip myself
        var cell = document.getElementById(x + '-' + y); // overwrite passed in cell, set to el
        if ((cell != null)) {
          if (cell.getAttribute('data-status') === 'alive') {
            livingNeighbors++; //
          }
        }
      }
    }
    //console.log(xIn + ' : ' + yIn + ' cell has ' + livingNeighbors + ' neighbors');
    var myCell = document.getElementById(xIn + '-' + yIn); // once again, grab cell (previously availble as cell..) and set to myCell
    var myStatus = myCell.getAttribute('data-status'); // => alive/dead
    if ((myCell != null)) {
      //alive cases
      if (myStatus === 'alive') {
        // Any live cell with two or three live neighbors lives on to the next generation.
        if ((livingNeighbors === 2) || (livingNeighbors === 3)) {
          myCell.setAttribute('fateValue', 'alive');
        }else{
          // Any live cell with fewer than two live neighbors dies, as if caused by under-population.
          myCell.setAttribute('fateValue', 'dead');
        }
      } else if ((livingNeighbors === 3) && (myStatus === 'dead')) {         //dead case
          myCell.setAttribute('fateValue', 'alive');
      }
    }
  },

  UpdateBoard: function(cell, x, y) {
    //var cell = document.getElementById(x + '-' + y); // not needed, being passed by this.forEachCell
    cell.setAttribute('data-status', cell.getAttribute('fateValue')); // setting attribute, never gets removed between clears*
    cell.className = cell.getAttribute('fateValue'); // possibly causing issue on subsequent games, fateValue is never reset between games
    if (cell.className === 'alive') {
      this.totalLiving++;
    };
/*    
    if (cell.className === 'dead') {
      this.totalLiving--;
    };
  */
  },

  enableAutoPlay: function() {
    // Start Auto-Play by running the 'step' function
    // automatically repeatedly every fixed time interval
    //clearInterval(this.currentInterval);

    this.currentInterval = setInterval(function() {
      if (this.totalLiving === 0) {
        clearInterval(this.currentInterval);
      }
      this.totalLiving = 0;
      this.forEachCell(this.step);
      this.forEachCell(this.UpdateBoard.bind(this));
      //console.log(this.totalLiving)
    }.bind(this), this.stepInterval)
  }

};

gameOfLife.createAndShowBoard();
