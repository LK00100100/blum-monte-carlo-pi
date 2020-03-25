/**
 * Terminology i use
 * canvas: the entire drawing space
 * inner square: takes up sub-space within the canvas. These are blue dots
 * inner circle: within the inner square. These are orange dots.
 */

window.onload = init;

//constants used by the #circle-canvas
//re-set by initCanvas if the screen gets smaller
const CANVAS_CONST = {
    MAX_HEIGHT: 500,
    MAX_WIDTH: 500,
};

//the inner-square to draw stuff used by the #circle-canvas
const INNER_SQUARE_BORDER_PX = 20;  //the pixel thickness of the inner square border
const INNER_SQUARE = {
    SQUARE_LEFT_X: INNER_SQUARE_BORDER_PX,
    SQUARE_RIGHT_X: "init'd by initInnerSquare",
    SQUARE_UP_Y: INNER_SQUARE_BORDER_PX,
    SQUARE_DOWN_Y: "init'd by initInnerSquare"
};

//called when the document loads.
function init() {
    initCanvas();
    initInnerSquare();
}

//initialize canvas.
function initCanvas() {
    let canvas = document.getElementById("circle-canvas");

    //if it's on a smaller screen, make it smaller.
    //should be a square.
    CANVAS_CONST.MAX_HEIGHT = Math.min(CANVAS_CONST.MAX_HEIGHT, document.body.clientWidth);
    CANVAS_CONST.MAX_WIDTH = Math.min(CANVAS_CONST.MAX_WIDTH, document.body.clientWidth);

    canvas.setAttribute("height", CANVAS_CONST.MAX_HEIGHT);
    canvas.setAttribute("width", CANVAS_CONST.MAX_WIDTH);
};

function initInnerSquare() {
    INNER_SQUARE.SQUARE_RIGHT_X = CANVAS_CONST.MAX_WIDTH - INNER_SQUARE_BORDER_PX;
    INNER_SQUARE.SQUARE_DOWN_Y = CANVAS_CONST.MAX_HEIGHT - INNER_SQUARE_BORDER_PX;
}

//
/**
 * actually does the monte carlo simulation 
 * 
 * points are generated.
 * then various UI elements are updated.
 */
function simulate() {
    clearCanvas();

    let numPoints = document.getElementById("num-points-input").value;
    let numPointsToGenerate = parseInt(numPoints);

    let canvas = document.getElementById("circle-canvas");
    let ctx = canvas.getContext("2d");

    //list of [[x, y, isWithinCircle]...]
    //ex: [[1,2 , true]]
    //NOTE: could use dict/obj if this gets more complicated
    let points = [];

    //get a bunch of random points and draw them.
    for (let i = 0; i < numPointsToGenerate; i++) {
        let random_x = getRandomIntInclusive(INNER_SQUARE.SQUARE_LEFT_X, INNER_SQUARE.SQUARE_RIGHT_X);
        let random_y = getRandomIntInclusive(INNER_SQUARE.SQUARE_UP_Y, INNER_SQUARE.SQUARE_DOWN_Y);

        let isWithinCircle = isWithinInnerCircle(random_x, random_y);

        let targetColor = "blue";
        if (isWithinCircle)
            targetColor = "orange";

        drawCircle(ctx, random_x, random_y, targetColor);

        points.push([random_x, random_y, isWithinCircle]);
    }

    //update UI elements
    updatePointsTableElement(points);
    updatePointsStatsAndHistory(points);
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
    let circleCenterX = INNER_SQUARE.SQUARE_LEFT_X + radius;
    let circleCenterY = INNER_SQUARE.SQUARE_UP_Y + radius;

    let fromCenterX = Math.abs(x - circleCenterX);
    let fromCenterY = Math.abs(y - circleCenterY);

    let distanceFromCenter = Math.sqrt((fromCenterX * fromCenterX) + (fromCenterY * fromCenterY));

    return distanceFromCenter <= radius;
}

/**
 * Draws a small circle on the canvas at x, y
 * @param {CanvasRenderingContext2D} ctx 
 * @param {Number} x canvas coordinate 
 * @param {Number} y canvas coordinate
 * @param {String} targetColor the optional target color for the circle.
 * Default is no fill. ex: blue.
 */
function drawCircle(ctx, x, y, targetColor) {
    let radius = 2;
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

/**
 * Clears and updates the points table
 * @param {Array} points an array of arrays.
 * [[x:Number, y:Number, isWithinCircle:Boolean]]
 */
function updatePointsTableElement(points) {
    let tableElement = document.getElementById("points-table");
    tableElement.textContent = "";

    //make title header
    let tableRow = document.createElement("tr");
    let tableHeader = document.createElement("th");
    tableHeader.setAttribute("colspan", 4);
    tableHeader.textContent = "Points";
    tableElement.appendChild(tableHeader);

    //make header
    tableRow = document.createElement("tr");

    let headerNum = document.createElement("th")
    headerNum.textContent = "#";

    let headerX = document.createElement("th")
    headerX.textContent = "X";

    let headerY = document.createElement("th")
    headerY.textContent = "Y";

    let headerInCircle = document.createElement("th")
    headerInCircle.textContent = "In Inner Circle";

    tableRow.appendChild(headerNum);
    tableRow.appendChild(headerX);
    tableRow.appendChild(headerY);
    tableRow.appendChild(headerInCircle);
    tableElement.appendChild(tableRow);

    //create a data row for each point
    points.forEach((point, rowNum) => {
        let x = point[0];
        let y = point[1];
        let isWithinCircle = point[2];

        let textColor = isWithinCircle ? "orange-text" : "blue-text";

        //create a row
        let tableRow = document.createElement("tr");

        let dataRowNum = document.createElement("td")
        dataRowNum.textContent = rowNum;

        let dataX = document.createElement("td")
        dataX.textContent = x;

        let dataY = document.createElement("td")
        dataY.textContent = y;

        let dataInCircle = document.createElement("td")
        dataInCircle.setAttribute("class", textColor);
        dataInCircle.textContent = isWithinCircle;

        //add to row and table
        tableRow.appendChild(dataRowNum);
        tableRow.appendChild(dataX);
        tableRow.appendChild(dataY);
        tableRow.appendChild(dataInCircle);
        tableElement.appendChild(tableRow);
    });

}

/**
 * updates the points stats with actual stats
 * and the pi history table
 * @param {Array} points an array of arrays.
 * [[x:Number, y:Number, isWithinCircle:Boolean]]
 */
function updatePointsStatsAndHistory(points) {
    document.getElementById("points-stats").style.display = "block";

    const numInCircle = points.filter(point => point[2] == true).length;
    const numOutCircle = points.length - numInCircle;
    const totalPoints = points.length;

    let totalMessage = "Total # Points: " + totalPoints;
    let inCircleMessage = "# Points in of circle: " + numInCircle;
    let outCircleMessage = "# Points out of circle: " + numOutCircle
    let piEstimate = 4 * (numInCircle / totalPoints);
    let piEstimateMessage = "Pi Estimate: " + piEstimate;

    document.getElementById("num-points-total").textContent = totalMessage;
    document.getElementById("num-points-in-circle").textContent = inCircleMessage;
    document.getElementById("num-points-out-circle").textContent = outCircleMessage;
    document.getElementById("pi-text").textContent = piEstimateMessage;

    appendPiHistory(piEstimate, totalPoints);
}

/**
 * Adds a pi entry to the pi history table
 * @param {Number} pi 
 * @param {Number} numPoints total number of points used
 */
function appendPiHistory(pi, numPoints) {
    let piTable = document.getElementById("pi-history-table");

    let numEntries = piTable.children.length;

    //create and append row
    let tableRow = document.createElement("tr");

    let tdNum = document.createElement("td");
    tdNum.textContent = numEntries;

    let tdPi = document.createElement("td");
    tdPi.textContent = pi;

    let tdNumPoints = document.createElement("td");
    tdNumPoints.textContent = numPoints;

    tableRow.appendChild(tdNum);
    tableRow.appendChild(tdPi);
    tableRow.appendChild(tdNumPoints);
    piTable.appendChild(tableRow);
}
