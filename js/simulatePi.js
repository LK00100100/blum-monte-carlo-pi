// Terminology i use
// canvas: the entire drawing space
// inner square: takes up sub-space within the canvas. These are blue dots
// inner circle: within the inner square. These are orange dots.

//constants used by the #circle-canvas
const CANVAS_CONST = {
    MAX_HEIGHT: 300,
    MAX_WIDTH: 300,
    SQUARE_LEFT_X: 10,
    SQUARE_RIGHT_X: 20,
    SQUARE_UP_Y: 10,
    SQUARE_DOWN_Y: 10
};

//the inner-square to draw stuff used by the #circle-canvas
const INNER_SQUARE = {
    SQUARE_LEFT_X: 20,
    SQUARE_RIGHT_X: CANVAS_CONST.MAX_WIDTH - 20,
    SQUARE_UP_Y: 20,
    SQUARE_DOWN_Y: CANVAS_CONST.MAX_HEIGHT - 20
};

//initialize canvas. called by html's body onload.
function initCanvas() {
    let canvas = document.getElementById("circle-canvas");

    canvas.setAttribute("height", CANVAS_CONST.MAX_HEIGHT);
    canvas.setAttribute("width", CANVAS_CONST.MAX_WIDTH);
};

//actually does the monte carlo simulation
function simulate() {
    clearCanvas();
    
    //note: you can get this from an input box later...
    let numPointsToGenerate = 1000;

    let canvas = document.getElementById("circle-canvas");
    let ctx = canvas.getContext("2d");

    //get a bunch of random points and draw them.
    for (let i = 0; i < numPointsToGenerate; i++) {
        let random_x = getRandomIntInclusive(INNER_SQUARE.SQUARE_LEFT_X, INNER_SQUARE.SQUARE_RIGHT_X);
        let random_y = getRandomIntInclusive(INNER_SQUARE.SQUARE_UP_Y, INNER_SQUARE.SQUARE_DOWN_Y);

        let targetColor = "blue";
        if(isWithinInnerCircle(random_x, random_y))
            targetColor = "orange";

        drawCircle(ctx, random_x, random_y, targetColor);
    }
};

//clears the canvas completely
function clearCanvas() {
    let canvas = document.getElementById("circle-canvas");
    let context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
};

/**
 * Checks if this point(x, y) is within the inner circle that's
 * within the inner-square
 * @param {Number} x 
 * @param {Number} y 
 * @returns {Boolean} true if in the inner-circle
 */
function isWithinInnerCircle(x, y) {

    //inner cirlce radius. also inner square length
    let radius = (INNER_SQUARE.SQUARE_RIGHT_X - INNER_SQUARE.SQUARE_LEFT_X) / 2;
    let circleCenterX =  INNER_SQUARE.SQUARE_LEFT_X + radius;
    let circleCenterY = INNER_SQUARE.SQUARE_UP_Y + radius;

    let fromCenterX = Math.abs(x - circleCenterX);
    let fromCenterY = Math.abs(y - circleCenterY);

    let distanceFromCenter = Math.sqrt((fromCenterX * fromCenterX) + (fromCenterY * fromCenterY));

    return distanceFromCenter <= radius;
}

/**
 * Draws a circle on the canvas at x, y
 * @param {CanvasRenderingContext2D} ctx 
 * @param {Number} x canvas coordinate 
 * @param {Number} y canvas coordinate
 * @param {String} targetColor the optional target color for the circle.
 * Default is no fill. ex: blue.
 */
function drawCircle(ctx, x, y, targetColor) {
    let radius = 3;
    let startAngle = 0;
    let endAngle = 2 * Math.PI;

    //draw a circle
    ctx.beginPath();
    ctx.arc(x, y, radius, startAngle, endAngle);
    ctx.stroke();

    if (targetColor) {
        ctx.fillStyle = targetColor;
        ctx.fill();
    }
};

/**
 * from mozilla
 * Generates a random number.
 * getRandomInt(1, 3) => 1, 2 or 3
 * @param {Number} min 
 * @param {Number} max 
 */
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
};