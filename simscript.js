var colors = ['green', 'red', 'yellow', 'blue'],
    sounds = {
        'green': new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3'),
        'red': new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3'),
        'yellow': new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3'),
        'blue': new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3'),
        'wrong': new Audio('http://freesound.org/data/previews/216/216090_3450800-lq.mp3')
    },
    aiSequence = [],
    len = 0,
    playerSequence = [],
    shineLen = 300,
    intervalLen = 1200,
    count = 0,
    onFlag = false,
    playerFlag = false,
    strictFlag = false;

function playerTrue() { //player's turn;
    playerFlag = true;
    $('.box').addClass('true');
}

function playerFalse() { //AI's turn;
    playerFlag = false;
    $('.box').removeClass('true');
}

function win() { //player won;
    var winSound = new Audio('http://freesound.org/data/previews/109/109662_945474-lq.mp3');
    setTimeout(function() {
        winSound.play();
        count = 0;
        $('.dash').text('V');
        $('.dash').fadeTo('fast', 0).fadeTo('fast', 1).fadeTo('fast', 0).fadeTo('fast', 1).fadeTo('fast', 0).fadeTo('fast', 1);
        $('.box').fadeTo('fast', 0).fadeTo('fast', 1).fadeTo('fast', 0).fadeTo('fast', 1).fadeTo('fast', 0).fadeTo('fast', 1);
    }, 1000);

    return setTimeout(function() {
        playerSequence = [];
        aiSequence = [];
        aiPush();
        aiPlay();
    }, 2000);

}

function aiPush() { //make aiSequence;
    aiSequence.push(colors[Math.floor(Math.random() * colors.length)]);
    return setTimeout(counting, 300);

}

function aiSteps(i) { // AI play sounds and show colors;

    $('.' + aiSequence[i]).addClass('shine');
    sounds[aiSequence[i]].play();

    setTimeout(function() {
        $('.' + aiSequence[i]).removeClass('shine');
    }, shineLen);
}

function counting() { // panel number is counting and showing;
    count++;
    $('.dash').text(count < 10 ? '0' + count : count);
}

function countingError() { // understrict model, panel number back to 0 and shine;
    count = 0;
    $('.dash').text('!!').fadeTo('fast', 0).fadeTo('fast', 1).fadeTo('fast', 0).fadeTo('fast', 1);
}

function aiPlay() { //play aiSequence;//keypoint!!!
    var i = 0,
        len = aiSequence.length; //replace for loop;
    function loop() { //replace for loop;
        if (i < len) {
            playerFalse() //playerFlag=false;
            aiSteps(i);
            i++;
            setTimeout(loop, intervalLen); //keypoint!!!
        } else {
            // call another function;
            console.log(i)
            playerTrue() //playerFlag=true;
        }
    }
    setTimeout(loop, intervalLen); //keypoint!!!
    //setTimeout(counting, intervalLen);
}

function playerPush(option) { //make playerSequence;
    var playerColor = $(option).attr('value');
    playerSequence.push(playerColor);
    sounds[playerColor].play();
    $('.' + playerColor).addClass('shine');
    setTimeout(function() {
        $('.' + playerColor).removeClass('shine');
    }, shineLen);
}

function startMove() { //player starts game;
    playerSequence = [];
    aiSequence = [];
    count = 0;
    aiPush();
    aiPlay();
}

function wrongMove() { //player moves wrong;
    playerSequence = [];
    console.log('not match');
    sounds.wrong.play();
    // countingError();
}

function compare() { //compare aiSequence and playerSequence;
    var playerLength = playerSequence.length - 1;
    if (playerSequence[playerLength] !== aiSequence[playerLength]) { //aiSequence not equal to playerSequence;
        if (strictFlag) { //strict model is on;
            playerFalse(); //playerFlag=false;
            setTimeout(wrongMove, 500);
            setTimeout(countingError, 500);
            setTimeout(startMove, 1000);

        } else { //strict model is off;
            playerFalse(); //playerFlag=false;
            $('.dash').text('!!').fadeTo('fast', 0).fadeTo('fast', 1).fadeTo('fast', 0).fadeTo('fast', 1);
            setTimeout(function() {
                $('.dash').text(count < 10 ? '0' + count : count);
            }, 1200);
            setTimeout(wrongMove, 500);
            setTimeout(aiPlay, 1000);
        }
    } else { //aiSequence equal to playerSequence;
        console.log('good move') //player moves correctly but not yet completes all the moves;
        if (playerSequence.join('') === aiSequence.join('')) { //aiSequence equal to playerSequence;
            len = aiSequence.length; //replace for loop;

            if (len === 20) { //player wins;
                return win();
            } else { //AI moves to next level (count) and play;
                playerSequence = [];
                aiPush();
                console.log(aiSequence)
                return aiPlay();
            }
        }
    }
}

$('.big').click(function() { //switch on off button;
    if (!onFlag) {
        onFlag = true;
        $('.small').addClass('turnon');
        $('.dash').addClass('turn');
    } else {
        onFlag = false;
        strictFlag = false;
        aiSequence = [];
        playerSequence = [];
        $('.dash').text('--');
        count = 0;
        console.clear();
        $('.small').removeClass('turnon');
        $('.dash').removeClass('turn');
        $('.upper').removeClass('act');
    }
})

$('.middle').click(function() { // press start button and game starts;
    if (onFlag) {
        startMove();
    }
});

$('.box').click(function() { //player clicks color parts and play sound and color shines;
    if (onFlag && playerFlag) {
        playerPush(this);
        compare();
    }
})
$('.right').click(function() { //press strict button and turn on or off strict model;
    if (onFlag) {
        if (!strictFlag) {
            strictFlag = true;
            $('.upper').addClass('act');
        } else {
            strictFlag = false;
            $('.upper').removeClass('act');
        }
    }
})
