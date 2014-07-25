var Intro = (function (Transition) {
    "use strict";

    function Intro(stage, sceneStorage, gameLoop) {
        this.stage = stage;
        this.sceneStorage = sceneStorage;
        this.gameLoop = gameLoop;
    }

    function calcScreenConst(domain, numerator, denominator) {
        return Math.floor(domain / numerator * (denominator || 1));
    }

    Intro.prototype.show = function (nextScene) {
        var screenWidth = 320;
        var screenHeight = 480;

        var firstBg = this.stage.drawFresh(calcScreenConst(screenWidth, 2), calcScreenConst(screenHeight, 2),
            'background', 0);
        var firstBgPath = this.stage.getPath(calcScreenConst(screenWidth, 2), calcScreenConst(screenHeight, 2),
            calcScreenConst(screenWidth, 2), calcScreenConst(screenHeight, 2) - screenHeight, 120, Transition.LINEAR);

        var scrollingBackGround = this.stage.getDrawable(calcScreenConst(screenWidth, 2),
                calcScreenConst(screenHeight, 2) + screenHeight, 'background', 0);
        var scrollingBgPath = this.stage.getPath(calcScreenConst(screenWidth, 2),
                calcScreenConst(screenHeight, 2) + screenHeight, calcScreenConst(screenWidth, 2),
            calcScreenConst(screenHeight, 2), 120, Transition.LINEAR);

        var self = this;

        var speedY = 0; // 600

        var speedDrawableOne = this.stage.getDrawable(calcScreenConst(screenWidth, 4), speedY, 'speed', 1);
        var speedDrawableTwo = this.stage.getDrawable(calcScreenConst(screenWidth, 8, 7),
                speedY - calcScreenConst(screenHeight, 5), 'speed', 1);
        var speedDrawableThree = this.stage.getDrawable(calcScreenConst(screenWidth, 16),
                speedY - calcScreenConst(screenHeight, 5, 2), 'speed', 1);
        var speedDrawableFour = this.stage.getDrawable(calcScreenConst(screenWidth, 16, 7),
                speedY - calcScreenConst(screenHeight, 5, 3), 'speed', 1);
        var speedDrawableFive = this.stage.getDrawable(calcScreenConst(screenWidth, 16),
                speedY - calcScreenConst(screenHeight, 5, 4), 'speed', 1);
        var speedDrawableSix = this.stage.getDrawable(calcScreenConst(screenWidth, 3, 2),
                speedY - calcScreenConst(screenHeight, 16, 5), 'speed', 1);

        var irgendwas = calcScreenConst(screenHeight, 12);
        var x = calcScreenConst(screenWidth, 2),
            y = screenHeight + irgendwas,
            yEnd = - irgendwas;

        var irgendwasLogo = calcScreenConst(screenHeight, 48, 5);
        var letsplayIO = this.stage.getDrawable(x, y + irgendwasLogo, 'letsplayIO', 2);
        var letsplayIOPath = this.stage.getPath(x, y + irgendwasLogo, x, yEnd - irgendwasLogo, 120, Transition.EASE_OUT_IN_SIN);

        var presentsDrawable = this.stage.getDrawable(x, y, 'presents', 2);
        var irgendwasPresents = irgendwasLogo * 2;
        var presentsPath = this.stage.getPath(x, y + irgendwasPresents, x, yEnd + irgendwasLogo, 120, Transition.EASE_OUT_IN_SIN);

        var logoYEnd = calcScreenConst(screenHeight, 32, 7);
        var logoDrawable = this.stage.animateFresh(x, y, 'logo-anim/logo', 44);
        var logoInPath = this.stage.getPath(x, y, x, logoYEnd, 120, Transition.EASE_OUT_QUAD);

        var lastY = letsplayIO.y;
        var speedos = [speedDrawableOne, speedDrawableTwo, speedDrawableThree, speedDrawableFour, speedDrawableFive,
            speedDrawableSix];
        speedos.forEach(function (speeeed) {
            self.stage.draw(speeeed);
        });

        var hasNotStarted = true;
        var yVelocity = calcScreenConst(screenHeight, 48);
        this.gameLoop.add('z_parallax', function () {
            var delta = lastY - letsplayIO.y;
            lastY = letsplayIO.y;

            speedos.forEach(function (speeeeeeed) {
                speeeeeeed.y += yVelocity;

                speeeeeeed.y -= delta * 2;

                if (speeeeeeed.y > 600) {
                    self.stage.remove(speeeeeeed);
                }
            });

            if (speedDrawableOne.y >= screenHeight && hasNotStarted) {
                hasNotStarted = false;

                self.stage.move(firstBg, firstBgPath, function () {
                    self.stage.remove(firstBg);
                });
                self.stage.move(scrollingBackGround, scrollingBgPath, function () {
                    scrollingBackGround.y = calcScreenConst(screenHeight, 2);
                });

                self.stage.move(letsplayIO, letsplayIOPath, function () {
                    self.stage.remove(letsplayIO);
                });

                self.stage.move(presentsDrawable, presentsPath, function () {
                    self.stage.remove(presentsDrawable);
                });

                var speedStripes;
                self.stage.moveLater({item: logoDrawable, path: logoInPath, ready: function () {

                    self.gameLoop.remove('z_parallax');
                    self.next(nextScene, logoDrawable, speedStripes, scrollingBackGround);

                }}, 90, function () {
                    var delay = 30;
                    speedStripes = showSpeedStripes(self.stage, delay);
                });
            }
        });

        function showSpeedStripes(stage, delay) {
            var speedStripes = [];

            speedStripes.push(drawSpeed(stage, calcScreenConst(screenWidth, 4), 0 + delay));
            speedStripes.push(drawSpeed(stage, calcScreenConst(screenWidth, 3, 2), 34 + delay));
            speedStripes.push(drawSpeed(stage, calcScreenConst(screenWidth, 8, 7), 8 + delay));
            speedStripes.push(drawSpeed(stage, calcScreenConst(screenWidth, 16, 7), 24 + delay));
            speedStripes.push(drawSpeed(stage, calcScreenConst(screenWidth, 16), 16 + delay));

            return speedStripes;
        }

        function drawSpeed(stage, x, delay) {
            var speedImgWidthHalf = Math.floor(stage.getSubImage('speed').width / 2);
            return stage.moveFreshLater(x, - speedImgWidthHalf, 'speed', x, screenHeight + speedImgWidthHalf, 30,
                Transition.LINEAR, delay, true);
        }
    };

    Intro.prototype.next = function (nextScene, logoDrawable, speedStripes, backGround) {
        this.sceneStorage.logo = logoDrawable;
        this.sceneStorage.speedStripes = speedStripes;
        this.sceneStorage.backGround = backGround;

        nextScene();
    };

    return Intro;
})(Transition);