function random(min, max, exept = []) {
    let random = Math.floor(Math.random() * (max - min + 1)) + min
    while (exept.includes(random)) {
        random = Math.floor(Math.random() * (max - min + 1)) + min
    }
    return random
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function createBoard(n) {
    for (let i = 0; i < n * n; i++) {
        Grid.innerHTML += '<div> </div>';
    }
}

function moveRight(coordinate) {
    let newCoo
    if ((coordinate + 1) % n == 0) {
        newCoo = coordinate - n + 1
    } else {
        newCoo = coordinate + 1
    }
    return newCoo
}

function moveLeft(coordinate) {
    let newCoo
    if ((coordinate) % n == 0) {
        newCoo = coordinate + n - 1
    } else {
        newCoo = coordinate - 1
    }
    return newCoo
}

function moveUp(coordinate) {
    let newCoo
    if (coordinate < n) {
        newCoo = coordinate + n * n - n
    } else {
        newCoo = coordinate - n
    }
    return newCoo
}

function moveDown(coordinate) {
    let newCoo
    if (n * n - n - 1 < coordinate && coordinate) {
        newCoo = coordinate - n * n + n
    } else {
        newCoo = coordinate + n
    }
    return newCoo
}

function draw() {
    x.forEach(function(s) {
        s.style.background = BGcolor
        s.style.border = String(xBorderDim) + 'px solid ' + xBorderColor

    })
    for (let j = 0; j < snake.length; j++) {
        x[snake[j]].style.background = snakeColor
        if (j != snake.length - 1) {
            if (snake[j + 1] == moveUp(snake[j])) {
                x[snake[j]].style.borderTop = xBorderDim + 'px solid ' + snakeColor
                x[snake[j + 1]].style.borderBottom = xBorderDim + 'px solid ' + snakeColor
            }
            if (snake[j + 1] == moveDown(snake[j])) {
                x[snake[j]].style.borderBottom = xBorderDim + 'px solid ' + snakeColor
                x[snake[j + 1]].style.borderTop = xBorderDim + 'px solid ' + snakeColor
            }
            if (snake[j + 1] == moveLeft(snake[j])) {
                x[snake[j]].style.borderLeft = xBorderDim + 'px solid ' + snakeColor
                x[snake[j + 1]].style.borderRight = xBorderDim + 'px solid ' + snakeColor
            }
            if (snake[j + 1] == moveRight(snake[j])) {
                x[snake[j]].style.borderRight = xBorderDim + 'px solid ' + snakeColor
                x[snake[j + 1]].style.borderLeft = xBorderDim + 'px solid ' + snakeColor
            }
        }
    }
    x[snake[0]].style.background = headColor
    if (foodExists) {
        x[food].style.background = foodColor
        x[food].style.border = xBorderDim + 'px solid ' + foodBorderColor
        x[moveUp(food)].style.borderBottom = xBorderDim + 'px solid ' + foodBorderColor
        x[moveDown(food)].style.borderTop = xBorderDim + 'px solid ' + foodBorderColor
        x[moveRight(food)].style.borderLeft = xBorderDim + 'px solid ' + foodBorderColor
        x[moveLeft(food)].style.borderRight = xBorderDim + 'px solid ' + foodBorderColor

    }
    document.querySelector('.container').style.background = snakeColor
    drawing = false
}


function arrLeft(arr) {
    if (arr.includes(moveLeft(arr[0]))) {
        console.log('coallision!')
        state = 'P'
        return 0;
    }
    arr.unshift(moveLeft(arr[0]))
    arr.pop()
    draw()
    return arr
}

async function arringLeft(arr, time) {
    if (leftD) {
        leftD = false
        while (state == 'L' && arrLeft(arr) !== 0) {
            await sleep(time)
        }
        leftD = true
    }
}

function arrRight(arr) {
    if (arr.includes(moveRight(arr[0]))) {
        console.log('coallision!')
        state = 'P'
        return 0;
    }
    arr.unshift(moveRight(arr[0]))
    arr.pop()
    draw()
    return arr
}
async function arringRight(arr, time) {
    if (rightD) {
        rightD = false
        while (state == 'R' && arrRight(arr) !== 0) {
            await sleep(time)
        }
        rightD = true
    }
}

function arrUp(arr) {
    if (arr.includes(moveUp(arr[0]))) {
        console.log('coallision!')
        state = 'P'
        return 0;
    }
    arr.unshift(moveUp(arr[0]))
    arr.pop()
    draw()
    return arr
}
async function arringUp(arr, time) {
    if (upD) {
        upD = false
        while (state == 'U' && arrUp(arr) !== 0) {
            await sleep(time)
        }
        upD = true
    }
}

function arrDown(arr) {
    if (arr.includes(moveDown(arr[0]))) {
        console.log('coallision!')
        state = 'P'
        return 0;
    }
    arr.unshift(moveDown(arr[0]))
    arr.pop()
    draw()
    return arr
}
async function arringDown(arr, time) {
    if (downD) {
        downD = false
        while (state == 'D' && arrDown(arr) !== 0) {
            await sleep(time)
        }
        downD = true
    }
}

async function grow(checkInterval, spawnDelay) {
    while (true) {
        await sleep(checkInterval)
        if (snake.includes(food)) {
            //fancy mode
            if (fancyMode) {
                snakeColor = foodColor
                headColor = foodColor
                xBorderColor = darkColors[colorI]
                colorI = random(0, colors.length - 1)
                foodColor = colors[colorI]
                foodBorderColor = darkColors[colorI]
            }
            score++
            scoreP.innerHTML = score
            x[food].style.background = headColor //miam
            foodExists = false
            snake.push(snake[snake.length - 1]) //woah i am biggER
            await sleep(spawnDelay) // waiting for food ...
            food = random(0, n * n - 1, snake) //oh it looks delicious
            foodExists = true
            console.log(snake)
            draw()
        }

    }
}
async function timer() {
    while (true) {
        await sleep(1000)
        if (state != 'P') {
            time++
            timeP.innerHTML = time
        }
    }
}

function switchMode() {
    if (document.querySelector('#fancyModeCB').checked) {
        fancyMode = true
    } else {
        fancyMode = false
        snakeColor = 'black'
        headColor = 'black'
        xBorderColor = 'black'
        foodColor = 'grey'
        foodBorderColor = 'grey'
        draw()
    }
}

function initialise() {
    xBorderColor = 'black'
    BGcolor = 'white'

    //initialisations
    score = 0
    time = 0
    lastMove = ''
    state = 'P'
    downD = true
    upD = true
    leftD = true
    rightD = true
    if (document.querySelector('#fancyModeCB').checked) {
        fancyMode = true
    } else {
        fancyMode = false
    }

    // game parameters

    //snake
    snake = [random(0, n * n - 1)]
    snakeColor = 'black'
    headColor = 'black'

    //food
    foodColor = 'grey'
    foodBorderColor = 'grey'
    food = random(0, n * n - 1, snake)
    foodExists = true
    colorI = '0'
    draw()
}

//grid
var Grid = document.querySelector('.grid');
var n = 20
var gridBorderColor = 'black'
var gridBorderDim = 0
var gridDim = 500
createBoard(n)

//container
var gap = 5
var container = document.querySelector('.container')
var containerDim = gridDim + 2 * (gap + gridBorderDim)

//x
x = Array.from(Grid.querySelectorAll('div'))
var xBorderColor = 'black'
var BGcolor = 'white'
var xBorderDim = 1
var xDim = gridDim / n - 2 * xBorderDim

//initialisations
var scoreP = document.querySelector('.scoreContainer p')
var score = 0
var timeP = document.querySelector('.timeContainer p')
var time = 0
var lastMove = ''
var state = 'P'
var downD = true
var upD = true
var leftD = true
var rightD = true
var fancyMode = false

// game parameters
var period = 150

//snake
var snake = [random(0, n * n - 1)]
var snakeColor = 'black'
var headColor = 'black'

//food
var foodColor = 'grey'
var foodBorderColor = 'grey'
var food = random(0, n * n - 1, snake)
var foodExists = true

var colors = ['grey', 'red', 'cyan', 'purple', 'yellow', 'green', 'orange', 'brown', 'pink']
var darkColors = ['black', 'brown', 'blue', 'rgb(54, 5, 99)', 'orange', 'rgb(10, 53, 1)', 'red', 'black', 'violet']
var colorI = '0'

//applying styles
Grid.style.width = String(gridDim) + 'px';
Grid.style.height = String(gridDim) + 'px';
Grid.style.marginTop = String(gap) + 'px'
Grid.style.border = gridBorderDim + 'px solid ' + gridBorderColor
container.style.width = String(containerDim) + 'px'
container.style.height = String(containerDim) + 'px'
for (let i = 0; i < x.length; i++) {
    x[i].style.width = String(xDim) + 'px';
    x[i].style.height = String(xDim) + 'px';
}

draw()
grow(10, 0)
timer()

document.addEventListener('keydown', function(e) {
    if (state == 'P') {
        if ((e.key == 'ArrowUp' || e.code == 'KeyW')) {
            state = 'U'
            arringUp(snake, period)
            lastMove = 'U'
        } else if ((e.key == 'ArrowDown' || e.code == 'KeyS')) {
            state = 'D'
            arringDown(snake, period)
            lastMove = 'D'
        } else if ((e.key == 'ArrowLeft' || e.code == 'KeyA')) {
            state = 'L'
            arringLeft(snake, period)
            lastMove = 'L'
        } else if ((e.key == 'ArrowRight' || e.code == 'KeyD')) {
            state = 'R'
            arringRight(snake, period)
            lastMove = 'R'
        } else {
            if (lastMove == 'U') {
                state = 'U';
                arringUp(snake, period)
            }
            if (lastMove == 'D') {
                state = 'D';
                arringDown(snake, period)
            }
            if (lastMove == 'R') {
                state = 'R';
                arringRight(snake, period)
            }
            if (lastMove == 'L') {
                state = 'L';
                arringLeft(snake, period)
            }
        }
    } else {
        if ((e.key == 'ArrowUp' || e.code == 'KeyW') && lastMove != 'U' && lastMove != 'D') {
            state = 'U'
            arringUp(snake, period)
            lastMove = 'U'
        } else if ((e.key == 'ArrowDown' || e.code == 'KeyS') && lastMove != 'D' && lastMove != 'U') {
            state = 'D'
            arringDown(snake, period)
            lastMove = 'D'
        } else if ((e.key == 'ArrowLeft' || e.code == 'KeyA') && lastMove != 'L' && lastMove != 'R') {
            state = 'L'
            arringLeft(snake, period)
            lastMove = 'L'
        } else if ((e.key == 'ArrowRight' || e.code == 'KeyD') && lastMove != 'R' && lastMove != 'L') {
            state = 'R'
            arringRight(snake, period)
            lastMove = 'R'
        } else if (
            e.key != 'ArrowRight' &&
            e.key != 'ArrowLeft' &&
            e.key != 'ArrowUp' &&
            e.key != 'ArrowDown' &&
            e.code != 'KeyW' &&
            e.code != 'KeyA' &&
            e.code != 'KeyS' &&
            e.code != 'KeyD') {
            state = 'P'
        }
    }
})