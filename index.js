var gameStart = false;
var game = new Game();
var buttonNumLookup = { green: 0, red: 1, yellow: 2, blue: 3 };
var buttonIDLookup = { 0: "green", 1: "red", 2: "yellow", 3: "blue" };
var buttonAudio = {};

$(document).keypress(function (e) {
    if (e.key == 'Enter' && gameStart === false) {
        gameStart = true;
        game.nextLevel();
        console.log('Game Started');
    }
});

$(".btn").click(function () {
    if (gameStart) {
        flashButton(this);
        playSound(this);
        game.pressButton(this.id);
    }
})

for (var button in buttonNumLookup) {
    buttonAudio[button] = new Audio("sounds/" + button + ".mp3");
}
buttonAudio['wrong'] = new Audio("sounds/wrong.mp3");

function flashButton(button) {
    $(button).addClass("pressed");
    setTimeout(function (e) {
        $(e).removeClass("pressed");
    }, 100, $(button)); //pass this to setTimeout callback
}

function playSound(button) {
    buttonAudio[$(button)[0].id].currentTime = 0;
    buttonAudio[$(button)[0].id].play();
}

function Game() {
    this.level = 0;
    this.pattern = [];
    this.userPattern = [];
    this.nextLevel = function () {
        this.level++;
        this.pattern.push(Math.floor(Math.random() * 4));
        $("title").text("Level " + this.level);
        $("#level-title").text("Level " + this.level);
        this.animatePattern();
        console.log(this.pattern);
    }
    this.failGame = function () {
        console.log('Game Over');
        this.level = 0;
        this.pattern = [];
        this.userPattern = [];
        gameStart = false;
        $("title").text("Game Over");
        $("#level-title").text("Game Over");
        buttonAudio['wrong'].currentTime = 0;
        buttonAudio['wrong'].play();
    }
    this.pressButton = function (buttonID) {
        this.userPattern.push(buttonNumLookup[buttonID]);
        if (this.userPattern[this.userPattern.length - 1] !== this.pattern[this.userPattern.length - 1]) {
            this.failGame();
        }
        else if (this.userPattern.length === this.pattern.length) {
            this.userPattern = [];
            this.nextLevel();
        }
        console.log(this.userPattern);
    }
    this.animatePattern = function () {
        for (let i = 0; i < this.pattern.length; i++) {
            var buttonID = buttonIDLookup[this.pattern[i]];
            setTimeout(flashButton, 500 + 300 * (i), $("#" + buttonID));
        }
    }
}