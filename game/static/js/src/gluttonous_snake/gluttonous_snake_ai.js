'use strict';

/*
My method

Stratege 1: use BFS algorithm to calculate the way to food. If the way exists, then evaluate the safety of the path. If there is a way to the tail after the snake follow the path, the path is considered safe.

Stratage 2: Choose a neighbor node of the head as the next node. Make sure there is a way to the tail if the snake moves to the neighbor node. On this basis, select the neighbor farthest to the tail, which tend to leave more space and choices for the head.

Principle: Method 1 is our first choice. When no safe way to the food can be found, we perform Strategy 2. Because Strategy 1 has been executed from the very beginning, an appropriate neighbor can always be found in Strategy 2. Notice the snake may fall into endless loop because there is actually no solution in the end.
*/

let stage = $('#stage')
stage.css({'width': `${WIDTH/2}px`, 'height': `${HEIGHT/2}px`})
stage.attr({'width': WIDTH, 'height': HEIGHT})
let ctx = stage[0].getContext('2d')

let snake = new Snake(ctx)
let food = new Food(ctx)
let q_flag = true
let timeout = 10

$(document).keydown(function(event) {
    switch (event.keyCode) {
        case 81:
            if (q_flag) {
                clearTimeout(timer)
            } else {
                timer = setTimeout(step, timeout)
            }
            q_flag = !q_flag
            break
    }
})

let path = []
let timer = setTimeout(step, 10)

function step() {
    path = bfs(snake.nodes, food.nodes[0])
    if (path.length > 0 && evaluate_safety(snake.nodes, path, 'food')) {
        snake.direction = calc_direction(snake.nodes[0], path[0])
    } else { // no safe way to get the food
        snake.direction = wander(snake.nodes, food.nodes[0])
        if (snake.direction.length === 0) {
            clearTimeout(timer)
            alert('No solution!')
        }
    }

    snake.grow()
    // determine whether the snake has eaten the food
    if (detect_overlap(snake.nodes, food.nodes[0])) {
        snake.switch_unit_image()
        food.switch_unit_image()
        // determine whether the new food overlaps with the snake
        while (detect_overlap(snake.nodes, food.nodes[0])) {
            if (snake.nodes.length === WIDTH*HEIGHT/UNIT_LENGTH/UNIT_LENGTH) {
                alert('WINNER WINNER CHICKEN DINNER!   (*´∀`)~♥')
                return
            }
            food.generate()
        }
    } else {
        snake.nodes.pop()
    }
    this.ctx.clearRect(0,0,WIDTH,HEIGHT)
    snake.draw()
    food.draw()

    timer = setTimeout(step, timeout)
}

function wander(snake_nodes, food_node) {
    let head = snake_nodes[0]
    let tail = snake_nodes.slice(-1)[0]
    let neighbors = [
        new Node(head.x-UNIT_LENGTH, head.y),
        new Node(head.x+UNIT_LENGTH, head.y),
        new Node(head.x, head.y-UNIT_LENGTH),
        new Node(head.x, head.y+UNIT_LENGTH),
    ]
    // sort by the distance to the tail from far to near
    neighbors.sort(function(n1, n2) {
        let diff = Math.abs(n1.x-tail.x)+Math.abs(n1.y-tail.y) - Math.abs(n2.x-tail.x)-Math.abs(n2.y-tail.y)
        if (diff < 0) {
            return 1
        }
        if (diff > 0) {
            return -1
        }
        return 0
    })
    for (let i = 0; i < 4; i++) {
        let neighbor = neighbors[i]
        if (
            !detect_overlap(snake_nodes.slice(0,-1), neighbor) // tail node is also a safety neighbor for the next move
            && !food_node.equal(neighbor) // because the wander method is used when the way to the food directly is not safe, the food cannot be the safe neighbor
            && !detect_border([neighbor])
            && evaluate_safety(snake_nodes, [neighbor], 'neighbor')
        ) {
            return calc_direction(head, neighbor)
        }
    }
    return ''
}

// detect if there is a way to the tail after the snake follow the path, which means the safety of the path
function evaluate_safety(snake_nodes, path, destination) {
    let virtual_snake = new Snake(ctx)
    virtual_snake.nodes = snake_nodes.slice()
    path.forEach(function(ele, index) {
        virtual_snake.direction = calc_direction(virtual_snake.nodes[0], path[index])
        virtual_snake.grow()
        if (index < path.length-1 || destination === 'neighbor') { // if the destination is food, the last action is not move but grow only
            virtual_snake.nodes.pop()
        }
    })
    let safe_path = bfs(virtual_snake.nodes, virtual_snake.nodes.slice(-1)[0])
    if (safe_path.length === 0) {
        return false
    }
    return true
}

function calc_direction(node, next_node) {
    let direction = ''
    switch ([next_node.x-node.x, next_node.y-node.y].toString()) {
        case `-${UNIT_LENGTH},0`:
            direction = 'left'
            break
        case `0,-${UNIT_LENGTH}`:
            direction = 'up'
            break
        case `${UNIT_LENGTH},0`:
            direction = 'right'
            break
        case `0,${UNIT_LENGTH}`:
            direction = 'down'
            break
    }
    return direction
}

// breadth first search
function bfs(snake_nodes, specific_node) {
    let queue = [snake_nodes[0]]
    let visited = []
    let parents = [] // record the parent node of each nodes
    for (let i = 0; i < 32; i++) {
        visited[i] = [...new Array(24)].map(x => false)
        parents[i] = [...new Array(24)]
    }

    while (queue.length > 0) {
        let node = queue[0]
        queue.shift()
        let neighbors = [
            new Node(node.x-UNIT_LENGTH, node.y),
            new Node(node.x+UNIT_LENGTH, node.y),
            new Node(node.x, node.y-UNIT_LENGTH),
            new Node(node.x, node.y+UNIT_LENGTH),
        ]
        for (let i = 0; i < 4; i++) {
            let neighbor = neighbors[i]
            if (specific_node.equal(neighbor)) {
                parents[neighbor.x/UNIT_LENGTH][neighbor.y/UNIT_LENGTH] = node
                // output the path according to parents
                let path = []
                let foobar = specific_node
                while (!foobar.equal(snake_nodes[0])) {
                    path.push(foobar)
                    foobar = parents[foobar.x/UNIT_LENGTH][foobar.y/UNIT_LENGTH]
                }
                path.reverse()
                return path
            }
            if (
                !detect_overlap(snake_nodes, neighbor) && !detect_border([neighbor])
                && !visited[neighbor.x/UNIT_LENGTH][neighbor.y/UNIT_LENGTH]
            ) {
                queue.push(neighbor)
                visited[neighbor.x/UNIT_LENGTH][neighbor.y/UNIT_LENGTH] = true
                parents[neighbor.x/UNIT_LENGTH][neighbor.y/UNIT_LENGTH] = node
            }
        }
    }
    return []
}
