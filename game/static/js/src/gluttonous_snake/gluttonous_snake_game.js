'use strict';

const WIDTH = 1600
const HEIGHT = 1200
const UNIT_LENGTH = 50

class Node {
    constructor(x, y) {
        this.x = x
        this.y = y
    }

    equal(node) {
        if (this.x === node.x && this.y === node.y) {
            return true
        }
        return false
    }
}

class GluttonousSnakeObject {
    constructor(ctx) {
        this.ctx = ctx
        this.nodes = []
        let ninja = new Image()
        ninja.src = '/static/images/gluttonous_snake/ninja.png'
        let dragon = new Image()
        dragon.src = '/static/images/gluttonous_snake/dragon.png'
        this.images = {'ninja': ninja, 'dragon': dragon}
        this.unit_image = this.images['ninja']
    }

    draw() {
        for (let node of this.nodes) {
            this.ctx.drawImage(this.unit_image, node.x, node.y, UNIT_LENGTH, UNIT_LENGTH)
        }
    }

    // switch the image bewteen the two types
    switch_unit_image() {
        this.unit_image = this.unit_image === this.images['ninja'] ? this.images['dragon'] : this.images['ninja']
    }
}

class Snake extends GluttonousSnakeObject {
    constructor(ctx) {
        super(ctx)
        let head = new Node(Math.floor(Math.random()*(WIDTH/UNIT_LENGTH-1))*UNIT_LENGTH, Math.floor(Math.random()*(HEIGHT/UNIT_LENGTH-1))*UNIT_LENGTH)
        this.nodes = [head, new Node(head.x+UNIT_LENGTH, head.y)]
        this.unit_image = this.images['ninja']
        this.direction = 'left'
    }

    draw() {
        super.draw()
        this.ctx.fillStyle = 'blue'
        this.ctx.fillRect(this.nodes[0].x, this.nodes[0].y, UNIT_LENGTH, UNIT_LENGTH)
        this.ctx.fillStyle = 'purple'
        this.ctx.fillRect(this.nodes.slice(-1)[0].x, this.nodes.slice(-1)[0].y, UNIT_LENGTH, UNIT_LENGTH)
    }

    grow() {
        switch (this.direction) {
            case 'left':
                this.nodes.unshift(new Node(this.nodes[0].x-UNIT_LENGTH, this.nodes[0].y))
                break
            case 'up':
                this.nodes.unshift(new Node(this.nodes[0].x, this.nodes[0].y-UNIT_LENGTH))
                break
            case 'right':
                this.nodes.unshift(new Node(this.nodes[0].x+UNIT_LENGTH, this.nodes[0].y))
                break
            case 'down':
                this.nodes.unshift(new Node(this.nodes[0].x, this.nodes[0].y+UNIT_LENGTH))
                break
            default:
                alert('Direction Error!')
        }
    }
}

class Food extends GluttonousSnakeObject {
    constructor(ctx) {
        super(ctx)
        this.nodes = [new Node(Math.floor(Math.random()*WIDTH/UNIT_LENGTH)*UNIT_LENGTH, Math.floor(Math.random()*HEIGHT/UNIT_LENGTH)*UNIT_LENGTH)]
        this.unit_image = this.images['dragon']
    }

    generate() {
        this.nodes = [new Node(Math.floor(Math.random()*WIDTH/UNIT_LENGTH)*UNIT_LENGTH, Math.floor(Math.random()*HEIGHT/UNIT_LENGTH)*UNIT_LENGTH)]
    }
}

function detect_overlap(snake_nodes, specific_node) {
    for (let node of snake_nodes) {
        if (specific_node.equal(node)) {
            return true
        }
    }
    return false
}

function detect_border(snake_nodes) {
    if (
        snake_nodes[0].x >= 0 && snake_nodes[0].x <= WIDTH - UNIT_LENGTH
        && snake_nodes[0].y >= 0 && snake_nodes[0].y <=HEIGHT - UNIT_LENGTH
    ) {
        return false
    } else {
        return true
    }
}
