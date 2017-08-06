// ========== tetris ==========
// initialize
// the first and last values of the array are used to judge the state instead of display bricks
const row_n = 26+2 // array row number
const col_n = 18+2 // array column number
const type_array = ['O','I','Z','S','J','L','T']
let stage_array = []
let current_stage = []
let tetromino = []
let timer
let tetromino_type
let q_flag = true
for (let i = 0; i < row_n; i++) {
    let foo = []
    for (let j = 0; j < col_n; j++) {
        foo.push(0)
    }
    stage_array.push(foo)
}
update_ui(stage_array)

$(document).keydown(function(event) {
    switch (event.keyCode) {
        case 81:
            if (q_flag === true) {
                console.log('Stop');
                clearTimeout(timer)
                q_flag = false
            } else {
                console.log('Restart');
                timer = setTimeout(move_down,200)
                q_flag = true
            }
            break
        case 40:
            console.log('Down');
            move_down()
            break
        case 37:
            console.log('Left');
            move_horizontally('left')
            break
        case 39:
            console.log('Right');
            move_horizontally('right')
            break
        case 38:
            console.log('Up-Rotate')
            rotate()
            break
        default:
            console.log('Invalid button')
    }
})

create_tetromino() // start game!

// ====================

function update_ui(current_stage) {
    let stage = $('div#tetris')
    stage.empty()
    let s = ''
    for (let i = 1; i < row_n - 1; i++) {
        for (let j = 1; j < col_n - 1; j++) {
            if (current_stage[i][j] === 1) {
                s += `<div style="position: absolute; top: ${(i-1)*20}px; left: ${(j-1)*20}px;" class="brick"></div>`
            }
        }
    }
    stage.append(s) // do not append in the loop for performance reasons

    // display the rotation center for debug
    try {
        let valid_coordinates = []
        for (let i = 0; i < row_n; i++) {
            for (let j = 0; j < col_n; j++) {
                if (tetromino[i][j] === 1) {
                    valid_coordinates.push([i,j])
                }
            }
        }
        let [center_x, center_y] = calc_center(valid_coordinates)
        stage.append(`<div style="position: absolute; top: ${(center_x-1)*20}px; left: ${(center_y-1)*20}px; background-image: linear-gradient(to right bottom, violet, orange);" class="brick"></div>`)
        // stage.append(`<div style="position: absolute; top: ${(center_x-1)*20}px; left: ${(center_y-1)*20}px; background-color: rgba(255, 127, 250, 1)" class="brick"></div>`)
    } catch (e) {
        console.log(e);
    } finally {

    }
}

// generate a tetromino randomly
function create_tetromino() {
    // detect whether the game is over
    for (let j = 1; j < col_n - 1; j++) {
        if (current_stage.length > 0 && current_stage[2][j] === 1) {
            alert('Tetris Over!')
            return
        }
    }

    // generate the first 2 rows of the tetromino(array)
    tetromino_type = type_array[Math.floor(Math.random()*7)]
    console.log(tetromino_type);
    let s
    switch (tetromino_type) {
        case 'O':
            s = '00000000011000000000,' +
                '00000000011000000000'
            break
        case 'I':
            s = '00000000111100000000,' +
                '00000000000000000000'
            break
        case 'Z':
            s = '00000000110000000000,' +
                '00000000011000000000'
            break
        case 'S':
            s = '00000000011000000000,' +
                '00000000110000000000'
            break
        case 'J':
            s = '00000000111000000000,' +
                '00000000001000000000'
            break
        case 'L':
            s = '00000000011100000000,' +
                '00000000010000000000'
            break
        case 'T':
            s = '00000000111000000000,' +
                '00000000010000000000'
            break
        default:
            s = '01111111111111111110,01111111111111111110'
    }
    tetromino = string_to_tetromino(s)

    // generate the first blank row of the tetromino(array)
    tetromino.unshift(generate_zero(col_n))
    // generate the next 25(=26+2-3) blank rows of the tetromino(array)
    for (let i = 3; i < row_n; i++) {
        tetromino.push(generate_zero(col_n))
    }

    current_stage = add(stage_array,tetromino)
    update_ui(current_stage)

    // set the falling down animation
    timer = setTimeout(move_down,200)
}

function move_down() {
    clearTimeout(timer)
    let sub_tetromino = deepcopy(tetromino)
    sub_tetromino.pop()
    sub_tetromino.unshift(generate_zero(col_n))
    let flag = detect_state(stage_array,sub_tetromino)
    if (flag === true) {
        tetromino = sub_tetromino
        current_stage = add(stage_array,tetromino)
        update_ui(current_stage)
        timer = setTimeout(move_down,200)
    } else {
        eliminate()
        // no need to update ui here even if the current_stage has changed
        // because ui will be updated in create_tetromino
        stage_array = deepcopy(current_stage)
        create_tetromino()
    }
}

function move_horizontally(direction) {
    let sub_tetromino = deepcopy(tetromino)

    // find valid rows
    let valid_row_coordinates = []
    for (let i = 0; i < row_n; i++) {
        for (let j = 1; j < col_n; j++) {
            if (sub_tetromino[i][j] === 1) {
                valid_row_coordinates.push(i)
                break
            }
        }
    }
    // move left
    if (direction === 'left') {
        for (let i of valid_row_coordinates) {
            sub_tetromino[i].shift()
            sub_tetromino[i].push(0)
        }
    }
    // move right
    if (direction === 'right') {
        for (let i of valid_row_coordinates) {
            sub_tetromino[i].pop()
            sub_tetromino[i].unshift(0)
        }
    }

    let flag = detect_state(stage_array,sub_tetromino)
    if (flag === true) {
        tetromino = sub_tetromino
        current_stage = add(stage_array,tetromino)
        update_ui(current_stage)
    }
}

function rotate() {
    // if the tetromino is 'O' type, do not rotate
    // or the rotataion result will be like a horizontal movement, because of the strategy of center calculation
    if (tetromino_type === 'O') {
        return
    }

    let valid_coordinates = []
    for (let i = 0; i < row_n; i++) {
        for (let j = 0; j < col_n; j++) {
            if (tetromino[i][j] === 1) {
                valid_coordinates.push([i,j])
            }
        }
    }

    let sub_tetromino = []
    for (let i = 0; i < row_n; i++) {
        sub_tetromino.push(generate_zero(col_n))
    }

    let [center_x, center_y] = calc_center(valid_coordinates)
    // Traverse the possible positions of the brick relative to the center
    // In fact, it can be divided into two categories, 90 degree and 45 degree
    for (let i = 0; i < valid_coordinates.length; i++) {
        let x = valid_coordinates[i][0]
        let y = valid_coordinates[i][1]
        if (x === center_x) {
            sub_tetromino[center_x-(center_y-y)][center_y] = 1
        } else if (y === center_y) {
            sub_tetromino[center_x][center_y+(center_x-x)] = 1
        } else {
            if (x < center_x && y < center_y) {
                sub_tetromino[x][2*center_y-y] = 1
            } else if (x < center_x && y > center_y) {
                sub_tetromino[2*center_x-x][y] = 1
            } else if (x > center_x && y < center_y) {
                sub_tetromino[2*center_x-x][y] = 1
            } else if (x > center_x && y > center_y) {
                sub_tetromino[x][2*center_y-y] = 1
            }
        }
    }

    let flag = detect_state(stage_array,sub_tetromino)
    if (flag === true) {
        tetromino = sub_tetromino
        current_stage = add(stage_array,tetromino)
        update_ui(current_stage)
    }
}

function eliminate() {
    // calculate the lines to eliminate
    rows_to_eliminate = []
    for (let i = row_n - 2; i > 0; i--) {
        let flag = 1
        for (let j = 1; j < col_n - 1; j++) {
            if (current_stage[i][j] === 0) {
                flag = 0
                break
            }
        }
        if (flag === 1) {
            rows_to_eliminate.push(i)
        }
    }

    // eliminate and fill zero
    console.log(rows_to_eliminate);
    for (let i of rows_to_eliminate) {
        current_stage.splice(i,1)
    }
    for (let i = 0; i < rows_to_eliminate.length; i++) {
        current_stage.unshift(generate_zero(col_n))
    }
}

function calc_center(valid_coordinates) {
    let sum_x = 0
    let sum_y = 0
    for (let i = 0; i < valid_coordinates.length; i++) {
        sum_x += valid_coordinates[i][0]
        sum_y += valid_coordinates[i][1]
    }
    return [Math.round(sum_x/valid_coordinates.length),Math.round(sum_y/valid_coordinates.length)]
}

// calculate the current_stage = stage_array + tetromino, which is for rendering.
function add(stage_array,tetromino) {
    let current_stage = deepcopy(stage_array); // copy stage_array to current_stage
    for (let i = 0; i < row_n; i++) {
        for (let j = 0; j < col_n; j++) {
            current_stage[i][j] += tetromino[i][j]
        }
    }
    return current_stage
}

function detect_state(stage_array,tetromino) {
    let current_stage = add(stage_array,tetromino)
    for (let i = 0; i < row_n; i++) {
        for (let j = 0; j < col_n; j++) {
            // detect the state that the new tetromino collide with the old tetrominoes
            if (current_stage[i][j] === 2) {
                return false
            }
            // detect the state that the new tetromino collide with the floor or wall
            if ((current_stage[i][j]===1)&&((i===0)||(i===row_n - 1)||(j===0)||(j===col_n - 1))) {
                return false
            }
        }
    }
    return true
}

function string_to_tetromino(s) {
    let tetromino = []
    let foo = s.split(',')
    for (let i of [0,1]) {
        let bar = foo[i].split('')
        let foobar = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19].map(x => Number(bar[x]))
        tetromino.push(foobar)
    }
    return tetromino
}

function deepcopy(arr) {
    let out = []
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] instanceof Array){
            out[i] = deepcopy(arr[i])
        }
        else out[i] = arr[i];
    }
    return out;
}

function generate_zero(n) {
    let res = []
    for (let j = 0; j < n; j++) {
        res.push(0)
    }
    return res
}
