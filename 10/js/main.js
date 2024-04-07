(function () {
    let isPause = false;
    let animationId = null;

    let speed = 3;
    let score = 0;

    const car = document.querySelector('.car');
    const carInfo = {
        ...createElementInfo(car),
        move: {
            top: null,
            bottom: null,
            left: null,
            right: null,
        },
    };

    const coin = document.querySelector('.coin');
    const coinInfo = createElementInfo(coin);

    const danger = document.querySelector('.danger');
    const dangerInfo = createElementInfo(danger);

    const arrow = document.querySelector('.arrow');
    const arrowInfo = createElementInfo(arrow);

    const gameButton = document.querySelector('.game-button');
    const gameScore = document.querySelector('.game-score');
    const backdrop = document.querySelector('.backdrop');


    document.addEventListener('keydown', (event) => {
        if (isPause) {
            return;
        }
        
        const code = event.code;
        // WASD
        if (code === 'ArrowUp' && carInfo.move.top === null) {
            if (carInfo.move.bottom) {
                return;
            }
            carInfo.move.top = requestAnimationFrame(carMoveToTop(car, carInfo));
        }
        else if (code === 'ArrowDown' && carInfo.move.bottom === null) {
            if (carInfo.move.top) {
                return;
            }
            carInfo.move.bottom = requestAnimationFrame(carMoveToBottom(car, carInfo));
        }
        else if (code === 'ArrowLeft' && carInfo.move.left === null) {
            if (carInfo.move.right) {
                return;
            }
            carInfo.move.left = requestAnimationFrame(carMoveToLeft(car, carInfo));
        }
        else if (code === 'ArrowRight' && carInfo.move.right === null) {
            if (carInfo.move.left) {
                return;
            }
            carInfo.move.right = requestAnimationFrame(carMoveToRight(car, carInfo));
        }
    }); 

    document.addEventListener('keyup', (event) => {
        const code = event.code;
        
        if (code === 'ArrowUp') {
            cancelAnimationFrame(carInfo.move.top);
            carInfo.move.top = null;
        }
        else if (code === 'ArrowDown') {
            cancelAnimationFrame(carInfo.move.bottom);
            carInfo.move.bottom = null;
        }
        else if (code === 'ArrowLeft') {
            cancelAnimationFrame(carInfo.move.left);
            carInfo.move.left = null;
        }
        else if (code === 'ArrowRight') {
            cancelAnimationFrame(carInfo.move.right);
            carInfo.move.right = null;
        }
    });

    animationId = requestAnimationFrame(startGame);

    function startGame() {
        elementAnimation(danger, dangerInfo, speed, -250);

        if (dangerInfo.visible && hasCollision(carInfo, dangerInfo)) {
            return finishGame();
        }

        treesLogic.treesAnimation(speed);
        elementAnimation(coin, coinInfo, speed, -100);

        if (coinInfo.visible && hasCollision(carInfo, coinInfo)) {
            score++;
            gameScore.innerText = score;
            coin.style.display = 'none';
            coinInfo.visible = false;

            if (score % 3 === 0) {
                speed += 2;
            }
        }

        elementAnimation(arrow, arrowInfo, speed, -600);

        if (arrowInfo.visible && hasCollision(carInfo, arrowInfo)) {
            arrow.style.display = 'none';
            arrowInfo.visible = false;
            danger.style.opacity = 0.2;
            dangerInfo.visible = false;

            arrowInfo.ignoreAppearance = true;
            dangerInfo.ignoreAppearance = true;

            speed += 10;

            setTimeout(() => {
                danger.style.opacity = 1;
                speed -= 10;

                setTimeout(() => {
                    dangerInfo.visible = true;
                    arrowInfo.ignoreAppearance = false;
                    dangerInfo.ignoreAppearance = false;
                }, 500);
            }, 1000);
        }

        animationId = requestAnimationFrame(startGame);
    }

    function cancelAnimations() {
        cancelAnimationFrame(animationId);
        cancelAnimationFrame(carInfo.move.top);
        cancelAnimationFrame(carInfo.move.bottom);
        cancelAnimationFrame(carInfo.move.left);
        cancelAnimationFrame(carInfo.move.right);
    }

    function finishGame() {
        cancelAnimations();

        gameScore.style.display = 'none';
        gameButton.style.display = 'none';
        backdrop.style.display = 'flex';

        const scoreText = backdrop.querySelector('.finish-text-score');
        scoreText.innerText = score;
    }

    gameButton.addEventListener('click', () => {
        isPause = !isPause;
        if (isPause) {
            cancelAnimations();

            gameButton.children[0].style.display = 'none';
            gameButton.children[1].style.display = 'initial';
        }
        else {
            animationId = requestAnimationFrame(startGame);
            gameButton.children[0].style.display = 'initial';
            gameButton.children[1].style.display = 'none';
        }
    });
})();
