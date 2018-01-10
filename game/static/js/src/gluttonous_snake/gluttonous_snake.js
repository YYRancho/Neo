'use strict';

class GluttonousSnakeObject {
    constructor(ctx) {
        this.ctx = ctx
        this.pos_arr = []
        let ninja = new Image()
        ninja.src = '/static/images/gluttonous_snake/ninja.png'
        let dragon = new Image()
        dragon.src = '/static/images/gluttonous_snake/dragon.png'
        this.images = {'ninja': ninja, 'dragon': dragon}
        this.unit =  this.images['ninja']
    }

    draw() {
        for (let pos of this.pos_arr) {
            this.ctx.drawImage(this.unit, pos[0], pos[1], 50, 50)
        }
    }

    // switch the image bewteen the two types
    switch_unit() {
        this.unit = this.unit === this.images['ninja'] ? this.images['dragon'] : this.images['ninja']
    }
}

class Snake extends GluttonousSnakeObject {
    constructor(ctx) {
        super(ctx)
        let head_pos = [Math.ceil(Math.random()*30)*50, Math.ceil(Math.random()*22)*50]
        this.pos_arr = [head_pos, [head_pos[0]+50, head_pos[1]]]
        this.unit = this.images['ninja']
        this.direction = 'left'
    }

    move() {
        this.grow()
        this.pos_arr.pop()
    }

    grow() {
        switch (this.direction) {
            case 'left':
            this.pos_arr.unshift([this.pos_arr[0][0]-50, this.pos_arr[0][1]])
            break
            case 'up':
            this.pos_arr.unshift([this.pos_arr[0][0], this.pos_arr[0][1]-50])
            break
            case 'right':
            this.pos_arr.unshift([this.pos_arr[0][0]+50, this.pos_arr[0][1]])
            break
            case 'down':
            this.pos_arr.unshift([this.pos_arr[0][0], this.pos_arr[0][1]+50])
            break
        }
    }
}

class Food extends GluttonousSnakeObject {
    constructor(ctx) {
        super(ctx)
        this.pos_arr = [[Math.ceil(Math.random()*31)*50, Math.ceil(Math.random()*23)*50]]
        this.unit = this.images['dragon']
    }

    generate() {
        this.pos_arr = [[Math.ceil(Math.random()*31)*50, Math.ceil(Math.random()*23)*50]]
    }
}

function detect_overlap(pos_list, specific_pos) {
    for (let pos of pos_list) {
        if (pos.toString() === specific_pos.toString()) {
            return true
        }
    }
    return false
}

function detect_border(snake_pos_arr) {
    if (
        snake_pos_arr[0][0] >= 0 && snake_pos_arr[0][0] <= 1550
        && snake_pos_arr[0][1] >= 0 && snake_pos_arr[0][1] <=1150
    ) {
        return false
    } else {
        return true
    }
}

// ========== the game starts ==========

let stage = $('#stage')
stage.css({'width': '800px', 'height': '600px'})
stage.attr({'width': '1600', 'height': '1200'})
let ctx = stage[0].getContext('2d')

let snake = new Snake(ctx)
let food = new Food(ctx)
let loaded = 0
for (let image_name in snake.images) {
    snake.images[image_name].onload = function() {
        loaded += 1
        if (loaded === Object.getOwnPropertyNames(snake.images).length) {
            snake.draw()
            food.draw()
        }
    }
}

$(document).keydown(function(event) {
    switch (event.keyCode) {
        case 37:
            if (snake.direction !== 'right') {
                snake.direction = 'left'
            }
            break
        case 38:
            if (snake.direction !== 'down') {
                snake.direction = 'up'
            }
            break
        case 39:
            if (snake.direction !== 'left') {
                snake.direction = 'right'
            }
            break
        case 40:
            if (snake.direction !== 'up') {
                snake.direction = 'down'
            }
            break
    }
})

let timer = setInterval(function() {
    snake.move()
    // determine whether the snake run into the border or itself
    if (detect_border(snake.pos_arr) || detect_overlap(snake.pos_arr.slice(1), snake.pos_arr[0])) {
        alert('Gluttonous Snake Over!')
        clearInterval(timer)
        return
    }
    // determine whether the snake has eaten the food
    if (detect_overlap(snake.pos_arr, food.pos_arr[0])) {
        snake.switch_unit()
        food.switch_unit()
        snake.grow()
        // determine whether the new food overlaps with the snake
        while (detect_overlap(snake.pos_arr, food.pos_arr[0])) {
            food.generate()
        }
    }
    this.ctx.clearRect(0,0,1600,1200)
    snake.draw()
    food.draw()
}, 100)
