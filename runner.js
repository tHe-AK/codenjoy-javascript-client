/*-
 * #%L
 * Codenjoy - it's a dojo-like platform from developers to developers.
 * %%
 * Copyright (C) 2018 Codenjoy
 * %%
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public
 * License along with this program.  If not, see
 * <http://www.gnu.org/licenses/gpl-3.0.html>.
 * #L%
 */

var util = require('util');
var WSocket = require('ws');
var Solver = Solver | require('solver');

var browser = (browser !== undefined);

var log = function(string) {
    console.log(string);
    if (browser) {
        printLogOnTextArea(string);
    }
};

var printArray = function (array) {
   var result = [];
   for (var index in array) {
       var element = array[index];
       result.push(element.toString());
   }
   return "[" + result + "]";
};

var processBoard = function(boardString) {
    var board = new Board(boardString);
    if (browser) {
        printBoardOnTextArea(board.boardAsString());
    }

    var logMessage = board + "\n\n";
    var answer = new DirectionSolver(board).get().toString();
    logMessage += "Answer: " + answer + "\n";
    logMessage += "-----------------------------------\n";
    
    log(logMessage);

    return answer;
};

var parseBoard = function(message) {
    var pattern = new RegExp(/^board=(.*)$/);
    var parameters = message.match(pattern);
    var board = parameters[1];
    return board;
}

// you can get this code after registration on the server with your email
var url = "http://codenjoy.com:80/codenjoy-contest/board/player/3edq63tw0bq4w4iem7nb?code=12345678901234567890";

url = url.replace("http", "ws");
url = url.replace("board/player/", "ws?user=");
url = url.replace("?code=", "&code=");

function connect() {
    var socket = new WSocket(url);
    log('Opening...');

    socket.on('open', function() {
        log('Web socket client opened ' + url);
    });

    socket.on('close', function() {
        log('Web socket client closed');

        if (!browser) {
            setTimeout(function() {
                connect();
            }, 5000);
        }
    });

    socket.on('message', function(message) {
        var board = parseBoard(message);
        var answer = processBoard(board);
        socket.send(answer);
    });

    return socket;
}

if (!browser) {
    connect();
}

var random = function(n){
    return Math.floor(Math.random()*n);
};



