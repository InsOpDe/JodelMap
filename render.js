

let shifted = false;
let map = {};
let mapArr =[];

$(function(){
    // Backbone code in here
    registerKeybinding();

    let $map = $('#map');
    $map.css('width', config.mapWidth + "px");
    $map.css('height', config.mapHeight + "px");

    let countX = config.mapWidth / (config.squareSize + config.pixelMargin);
    let countY = config.mapHeight / (config.squareSize + config.pixelMargin);
    countX = Math.floor(countX);
    countY = Math.floor(countY);
    console.log(countX);
    console.log(countY);

    for(let y = 0; y < countY; y++){
        mapArr[y] = [];
        let $row = $('<div class="row"></div>');
        for(let x = 0; x < countX; x++){
            mapArr[y][x] = 0;
            let key = y+"-"+x;
            // console.log(key, y, x);
            map[key] = 0;

            let $square = $('<div id="' + key + '" class="square"></div>');
            $square.css('width', config.squareSize + 'px');
            $square.css('height', config.squareSize + 'px');
            $square.css('margin-right', config.pixelMargin + 'px');
            $square.css('margin-bottom', config.pixelMargin + 'px');
            $square.hover((e)=>{onHover(e, x, y)});
            $row.append($square);
        }
        $map.append($row);
    }


    loadJSON();

    // getSquareByCoordinate(5.409291, 55.003605);
    // getSquareByCoordinate(9.261301, 55.003605); //55.086051, 6.019533
    // getSquareByCoordinate(13.261301, 55.003605); //55.086051, 6.019533
    // getSquareByCoordinate(13.413, 52.533); // berlin
    // getSquareByCoordinate(14.761301, 47.278319); //47.178319, 15.261301
    // getSquareByCoordinate(14.761301, 43.178319); //47.178319, 15.261301


});


function onHover(e, x, y){
    $square = $(e.currentTarget);
    if(!shifted) {
        addSquare($square,x,y)
    } else {
        $square.removeClass('square-fill');
        mapArr[y][x] = 0;
        map[y+"-"+x] = 0;
    }
    // console.log(x,y)
}

function addSquare($square,x,y){
    $square.addClass('square-fill');
    mapArr[y][x] = 1;
    map[y+"-"+x] = 1;
}

function registerKeybinding(){
    $(document).on('keyup keydown', function(e){
        shifted = e.shiftKey
        console.log(shifted);
    } );
}

(function(console){

    console.save = function(data, filename){

        if(!data) {
            console.error('Console.save: No data')
            return;
        }

        if(!filename) filename = 'console.json'

        if(typeof data === "object"){
            data = JSON.stringify(data, undefined, 4)
        }

        var blob = new Blob([data], {type: 'text/json'}),
            e    = document.createEvent('MouseEvents'),
            a    = document.createElement('a')

        a.download = filename
        a.href = window.URL.createObjectURL(blob)
        a.dataset.downloadurl =  ['text/json', a.download, a.href].join(':')
        e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
        a.dispatchEvent(e)
    }
})(console)

function loadJSON(){
    $.getJSON('map.json', function(data){
        for(let i in data) {
            let y = i.match(/\d*/)[0];
            let x = i.match(/-\d*/)[0].match(/\d*/g)[1];
            let key = y+"-"+x;

            if(data[i]) {
                addSquare($("#" + key),x,y)
            }
        }
        loadCities();
    })
}


let coordWidth = Math.abs(config.topLeft.long - config.bottomRight.long);
let coordHeight = Math.abs(config.topLeft.lat - config.bottomRight.lat);
let pixelProCoordinateX = coordWidth / config.mapWidth ;
let pixelProCoordinateY = coordHeight / config.mapHeight ;
let coordinateProSquareX = (config.squareSize + config.pixelMargin) * pixelProCoordinateX;
let coordinateProSquareY = (config.squareSize + config.pixelMargin) * pixelProCoordinateY;
console.log("coordWidth", coordWidth);
console.log("coordHeight", coordHeight);
console.log(pixelProCoordinateX, pixelProCoordinateY);
console.log(coordinateProSquareX, coordinateProSquareY);


function loadCities(){
    $.getJSON('allCities.json', function(allCities){


        for(let i in allCities) {
            let city = allCities[i];
            city.coordinates = getSquareByCoordinate(city.long, city.lat)
        }
        window.allCities = allCities;
    })
}


function getSquareByCoordinate(long, lat) {
    let startLong = config.topLeft.long;
    let startLat = config.topLeft.lat;

    let dLong = Math.abs(startLong - long);
    let dLat = Math.abs(startLat - lat);

    let squareX = dLong / coordinateProSquareX;
    let squareY = dLat / coordinateProSquareY;
    squareX = Math.round(squareX);
    squareY = Math.round(squareY);
    // console.log(squareX, squareY);
    let id = '#'+squareY+"-"+squareX;
    $(id).css("background-color", "red");
    return {x:squareX, y:squareY}
}
