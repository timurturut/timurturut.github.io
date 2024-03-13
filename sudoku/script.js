
document.addEventListener('DOMContentLoaded',function(){
    let board = []

    const gridSize = 9;
    const solveButton = document.getElementById("solveButton");
    const easyButton = document.getElementById("easy")
    const mediumButton = document.getElementById("medium")
    const hardButton = document.getElementById("hard")
    const turutButton = document.getElementById("turut")
    const resetButton = document.getElementById("resetButton")
    const visualizeButton = document.getElementById("visualizeButton")
    solveButton.addEventListener('click',solveSudoku);
    visualizeButton.addEventListener('click',solveSudokuDetailed);
    resetButton.addEventListener('click',resetGrid);
    
    easyButton.addEventListener('click', () => fillSudoku(1));
    mediumButton.addEventListener('click', () => fillSudoku(2));
    hardButton.addEventListener('click', () => fillSudoku(3));


    const sudokuGrid = document.getElementById("sudokuGrid");

    for(let row = 0 ; row < gridSize; row++){
        const newRow = document.createElement("tr");
        for(let col = 0; col < gridSize; col++){
            const cell = document.createElement('td');
            const input = document.createElement('input');
            input.type = "number";
            input.className = "cell";
            input.id = `cell-${row}-${col}`;
            cell.appendChild(input);
            newRow.appendChild(cell);
        }
        sudokuGrid.appendChild(newRow);
    }
});

async function fillSudoku(level){
    resetGrid();
    try {
        var jsonObject = await getBoard(level);
        console.log(jsonObject);
    } catch (error) {
        console.error('Failed to fill Sudoku:', error);
    }

    const gridSize = 9;
    board = jsonObject.response['unsolved-sudoku'];

    for(let row = 0 ; row < gridSize ; row++){
        for(let col = 0 ;  col < gridSize; col++){
            const cellId = `cell-${row}-${col}`;
            if (board[row][col] !== 0){
                document.getElementById(cellId).value = board[row][col];
                document.getElementById(cellId).readOnly = true;
                document.getElementById(cellId).classList.add("constant")
            }

        }
    }
}

function resetGrid(){
    gridSize = 9;
    for(let row = 0 ; row < gridSize ; row++){
        for(let col = 0 ;  col < gridSize; col++){
            const cellId = `cell-${row}-${col}`;
            document.getElementById(cellId).value = "";
            document.getElementById(cellId).readOnly = false;
            document.getElementById(cellId).classList.remove("constant")
            document.getElementById(cellId).classList.remove("solved")
        }
    }

    board = []

}

async function solveSudoku(){
    if(solveSudokuHelper(board)){
        let animations = []
        solveSudokuHelper(animations);
        console.log(animations);
        for(let row = 0 ; row < gridSize ; row++){
            for(let col = 0 ; col < gridSize ; col++){
                const cellId = `cell-${row}-${col}`;
                const cell = document.getElementById(cellId);

                if(!cell.classList.contains("constant")){
                    cell.value = board[row][col];
                    cell.classList.add("solved");
                    await sleep(20); //for visualization
                }
            }
        }
    }else{
        alert("No solution exist for the given sudoku puzzle");
    }
}

async function solveSudokuDetailed(){
        let animations = []
        solveSudokuHelper(animations);
        console.log(animations)

        for(let animation = 0 ; animation < animations.length ; animation++){
            const cellId = `cell-${animations[animation][0]}-${animations[animation][1]}`;
            const cell = document.getElementById(cellId);
            
            if(!cell.classList.contains("constant")){
                if(animations[animation][2] === 0){
                    cell.value = "";
                    cell.classList.remove("solved");
                    await sleep(20); //for visualization
                }
                else{
                    cell.value = animations[animation][2];
                    cell.classList.add("solved");
                    await sleep(20); //for visualization
                }
               
            }
        }
}



function solveSudokuHelper(animations){
    const gridSize = 9;
    for(let row = 0 ; row < gridSize ; row++){
        for(let col = 0 ; col < gridSize; col++){
            if(board[row][col] === 0){
                for(let num = 1 ; num <= 9 ; num++){
                    if (isValidMove(row,col,num)){
                        animations.push([row,col,num])
                        board[row][col] = num
                        if (solveSudokuHelper(animations)){
                            return true;
                        }
                        animations.push([row,col,0])
                        board[row][col] = 0
                    }
                }
                return false;
            }
        }
    }
    return true; // last call to wake up recursive childs
}

function isValidMove(row,col,num){
    gridSize = 9;

    //row check
    for(let check = 0  ; check < gridSize ; check++){
        if(board[check][col] === num){
            return false;
        }
    }
    //col check

    for(let check = 0  ; check < gridSize ; check++){
        if(board[row][check] === num){
            return false;
        }
    }

    //3x3 check
    const startRow = Math.floor(row / 3) * 3
    const startCol = Math.floor(col / 3) * 3

    for(let i = 0 ; i < 3 ; i++){
        for(let j = 0 ; j < 3 ; j++){
            if(board[startRow + i][startCol + j] === num){
                return false;
            }
        }
    }
    
    return true;
}

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve,ms));
}


async function getBoard(diff){
    const url = `https://sudoku-board.p.rapidapi.com/new-board?diff=${diff}&stype=list&solu=false`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'aa29752935msh8d2d988f7588dbcp108388jsn30e0c791d7eb',
            'X-RapidAPI-Host': 'sudoku-board.p.rapidapi.com'
        }
    };
    
    try {
        const response = await fetch(url, options);
        const result = await response.json();
        // console.log(result);
        return result;
    } catch (error) {
        console.error(error);
    }

}





// async function solveSudoku2(){
//     const gridSize = 9;
//     const sudokuArray = [];

//     // Fill the SudokuArray with input values from the grid
//     for(let row = 0 ; row < gridSize; row++){
//         sudokuArray[row] = []
//         for(let col = 0; col < gridSize; col++){
//             const cellId = `cell-${row}-${col}`;
//             const cellValue = document.getElementById(cellId).value;

//             sudokuArray[row][col] = cellValue !== "" ? parseInt(cellValue) : 0;
//         }
//     }

//     // Identify user-input cells and mark them
//     for(let row = 0 ; row < gridSize; row++){
//         for(let col = 0 ; col < gridSize; col++){
//             const cellId = `cell-${row}-${col}`;
//             const cell = document.getElementById(cellId);

//             if(sudokuArray[row][col] !== 0){
//                 cell.classList.add("userInput")
//             }

//         }
//     }

//     //Solve the sudoku and display the solution

//     if(solveSudokuHelper(sudokuArray)){
//         for(let row = 0 ; row < gridSize ; row++){
//             for(let col = 0 ; col < gridSize ; col++){
//                 const cellId = `cell-${row}-${col}`;
//                 const cell = document.getElementById(cellId);

//                 if(!cell.classList.contains("userInput")){
//                     cell.value = sudokuArray[row][col];
//                     cell.classList.add("solved");
//                     await sleep(20); //for visualization
//                 }
//             }
//         }
//     }else{
//         alert("No solution exist for the given sudoku puzzle");
//     }
// }
