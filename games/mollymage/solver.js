/*-
 * #%L
 * Codenjoy - it's a dojo-like platform from developers to developers.
 * %%
 * Copyright (C) 2012 - 2022 Codenjoy
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


var MollymageSolver = module.exports = {


    get: function (board) {
        /**
         * @return next hero action
         */

        var Games = require('./../../engine/games.js');
        var Point = require('./../../engine/point.js');
        var Direction = Games.require('./direction.js');
        var Element = Games.require('./elements.js');
        var Stuff = require('./../../engine/stuff.js');
        
        // TODO your code here
        
        let prevAction = [];
        let action = getAction(prevAction);

        // const hero = board.getHero();

        while (!isSafe(action) && prevAction.length < 4) {
            prevAction.push(action);
            action = getAction(prevAction);
        }
        
        // console.log(arr[index]);
        return action;

        function getTargets() {
            let targets = [];
            targets = targets.concat(board.getTreasureBoxes());
            targets = targets.concat(board.getOtherHeroes());
            board.removeDuplicates(targets);
            return targets;
        }

        function isPlacingBombBenefits() {
            // get heros, boxes to explode 
            const targets = getTargets();
            const heroPotion = board.getHero();
            const bombEffect = getBombEffect(heroPotion);

            return bombEffect.some(point => targets.includes(point));
        }

        function getAction(prevAction) {
            let arr = [Direction.LEFT, Direction.RIGHT, Direction.UP, Direction.DOWN, Direction.ACT].filter(act => !prevAction.includes(act));
            let index = getRandomInt(0, arr.length - 1);
            return arr[index];


            if (!isBombPresent() && isCurrentPositionSafe() && isPlacingBombBenefits()) {
                return Direction.ACT;
            }

            const option = [Direction.LEFT, Direction.RIGHT, Direction.UP, Direction.DOWN];
            option.forEach(o => {
                let heroPosition = board.getHero()
                let xAxis = heroPosition[0] + 3
                let yAxis = heroPosition[1] + 3
                if(xAxis <=32 && yAxis <=32){
                    
                }
            })



            // return Direction.RIGHT;

        }

        function isBombPresent() {
            return board.getPotions().includes(board.getHero());
        }

        function getBombEffect(potion) {
            let result = [];
            result.push(potion);
            result.push(new Point(potion.getX() - 3, potion.getY()));
            result.push(new Point(potion.getX() - 2, potion.getY()));
            result.push(new Point(potion.getX() - 1, potion.getY()));
            result.push(new Point(potion.getX() + 1, potion.getY()));
            result.push(new Point(potion.getX() + 2, potion.getY()));
            result.push(new Point(potion.getX() + 3, potion.getY()));
            result.push(new Point(potion.getX()    , potion.getY() - 3));
            result.push(new Point(potion.getX()    , potion.getY() - 2));
            result.push(new Point(potion.getX()    , potion.getY() - 1));
            result.push(new Point(potion.getX()    , potion.getY() + 1));
            result.push(new Point(potion.getX()    , potion.getY() + 2));
            result.push(new Point(potion.getX()    , potion.getY() + 3));
            return result;
        }


        
        function isSafe(action) {
            const aboutToExplode = board.getBarriers().map(({x, y}) => [x,y]);
            const hero = board.getHero();
            // console.log(aboutToExplode);
            // console.log(action.changeX(hero.x), action.changeY(hero.y));
            return !aboutToExplode.some(([x, y]) => x == action.changeX(hero.x) && y == action.changeY(hero.y));
        }

        function isCurrentPositionSafe() {
            const aboutToExplode = getImmidiateBombZones();
            const hero = board.getHero();
            return !aboutToExplode.some(([x, y]) => x == hero.x && y == hero.y);
        }
        
        function getRandomInt(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        function getImmidiateBombZones() {
            var aboutToExplode = board.getPotions();
            var restrictedPoints = [];
            // console.log('aboutToExplode', aboutToExplode);
            aboutToExplode.forEach(({x, y}) => {
                var bombRange = 3;
                for (i=-bombRange; i<=bombRange; i++) {
                    restrictedPoints.push([x+i, y]);
                    restrictedPoints.push([x, y+i]);
                }
            });

            const enemyHeroes = board.getEnemyHeroes();
            const ghosts = board.getGhosts();
            [...enemyHeroes, ...ghosts].forEach(({x, y}) => {
                restrictedPoints.push([x, y])
            })
            return restrictedPoints;
        }
    }


};
