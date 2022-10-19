(function () {
    let isPause = false;
    let animationId = null;

    const speed = 3;

    const car = document.querySelector('.car');
    const carCoords = getCoords(car);
    const carWidth = car.clientWidth / 2;
    const carHeight = car.clientHeight;
    const carMoveInfo = {
        top: null,
        bottom: null,
        left: null,
        right: null,
    };

    const coin = document.querySelector('.coin');
    const coinCoord = getCoords(coin);
    const coinWidth = coin.clientWidth / 2;
    const coinHeight = coin.clientHeight;

    const danger = document.querySelector('.danger');
    // const dangerCoord = getCoords(danger);
    // const dangerWidth = danger.clientWidth / 2;

    const arrow = document.querySelector('.arrow');
    // const arrowCoord = getCoords(arrow);
    // const arrowWidth = arrow.clientWidth / 2;

    const road = document.querySelector('.road');
    const roadHeight = road.clientHeight;
    const roadWidth = road.clientWidth / 2;

    const trees = document.querySelectorAll('.tree');
    const treesCoords = [];

    for (let i = 0; i < trees.length; i++) {
        const tree = trees[i];
        const coordsTree = getCoords(tree);

        treesCoords.push(coordsTree);
    }


    document.addEventListener('keydown', (event) => {
        // if (isPause) {
        //     return;
        // }
        
        const code = event.code;
        // WASD
        if (code === 'ArrowUp' && carMoveInfo.top === null) {
            if (carMoveInfo.bottom) {
                return;
            }
            carMoveInfo.top = requestAnimationFrame(carMoveToTop);
        }
        else if (code === 'ArrowDown' && carMoveInfo.bottom === null) {
            if (carMoveInfo.top) {
                return;
            }
            carMoveInfo.bottom = requestAnimationFrame(carMoveToBottom);
        }
        else if (code === 'ArrowLeft' && carMoveInfo.left === null) {
            if (carMoveInfo.right) {
                return;
            }
            carMoveInfo.left = requestAnimationFrame(carMoveToLeft);
        }
        else if (code === 'ArrowRight' && carMoveInfo.right === null) {
            if (carMoveInfo.left) {
                return;
            }
            carMoveInfo.right = requestAnimationFrame(carMoveToRight);
        }
    }); 

    document.addEventListener('keyup', (event) => {
        const code = event.code;
        
        if (code === 'ArrowUp') {
            cancelAnimationFrame(carMoveInfo.top);
            carMoveInfo.top = null;
        }
        else if (code === 'ArrowDown') {
            cancelAnimationFrame(carMoveInfo.bottom);
            carMoveInfo.bottom = null;
        }
        else if (code === 'ArrowLeft') {
            cancelAnimationFrame(carMoveInfo.left);
            carMoveInfo.left = null;
        }
        else if (code === 'ArrowRight') {
            cancelAnimationFrame(carMoveInfo.right);
            carMoveInfo.right = null;
        }
    });

    function carMoveToTop() {
        const newY = carCoords.y - 5;

        // if (newY < 0) {
        //     return;
        // }
        
        carCoords.y = newY;
        carMove(carCoords.x, newY);
        carMoveInfo.top = requestAnimationFrame(carMoveToTop);
    }

    function carMoveToBottom() {
        const newY = carCoords.y + 5;

        // if ((newY + carHeight) > roadHeight) {
        //     return;
        // }

        carCoords.y = newY;
        carMove(carCoords.x, newY);
        carMoveInfo.bottom = requestAnimationFrame(carMoveToBottom);
    }

    function carMoveToLeft() {
        const newX = carCoords.x - 5;

        // if (newX < -roadWidth + carWidth) {
        //     return;
        // }

        carCoords.x = newX;
        carMove(newX, carCoords.y);
        carMoveInfo.left = requestAnimationFrame(carMoveToLeft);
    }

    function carMoveToRight() {
        const newX = carCoords.x + 5;

        // if (newX > roadWidth - carWidth) {
        //     return;
        // }

        carCoords.x = newX;
        carMove(newX, carCoords.y);
        carMoveInfo.right = requestAnimationFrame(carMoveToRight);
    }

    function carMove(x, y) {
        console.log(hasCollision())
        car.style.transform = `translate(${x}px, ${y}px)`; 
    }

    animationId = requestAnimationFrame(startGame);

    function startGame() {
        treesAnimation();
        elementAnimation(coin, coinCoord, coinWidth, -100);
        // elementAnimation(danger, dangerCoord, dangerWidth, -250);
        // elementAnimation(arrow, arrowCoord, arrowWidth, -600);

        animationId = requestAnimationFrame(startGame);
    }

    function treesAnimation() {
        for (let i = 0; i < trees.length; i++) {
            const tree = trees[i];
            const coords = treesCoords[i];

            let newYCoord = coords.y + speed;

            if (newYCoord > window.innerHeight) {
                newYCoord = -370;
            }

            treesCoords[i].y = newYCoord;
            tree.style.transform = `translate(${coords.x}px, ${newYCoord}px)`;
        }
    }
    
    function elementAnimation(elem, elemCoord, elemWidth, elemInitialYCoord) {
        let newYCoord = elemCoord.y + speed;
        let newXCoord = elemCoord.x;

        if (newYCoord > window.innerHeight) {
            newYCoord = elemInitialYCoord;

            const direction = parseInt(Math.random() * 2);
            const maxXCoord = (roadWidth + 1 - elemWidth);
            const randomXCoord = parseInt(Math.random() * maxXCoord);
    
            // if (direction === 0) { // Двигаем влево
            //     newXCoord = -randomXCoord;
            // }
            // else if (direction === 1) { // Двигаем вправо
            //     newXCoord = randomXCoord;
            // }
    
            newXCoord = direction === 0
                ? -randomXCoord
                : randomXCoord;
        }

        elemCoord.y = newYCoord;
        elemCoord.x = newXCoord;
        elem.style.transform = `translate(${newXCoord}px, ${newYCoord}px)`;
    }

    function getCoords(element) {
        const matrix = window.getComputedStyle(element).transform;
        const array = matrix.split(',');
        const y = array[array.length - 1];
        const x = array[array.length - 2];
        const numericY = parseFloat(y);
        const numericX = parseFloat(x);

        return { x: numericX, y: numericY };
    }

    function hasCollision() {
        const carYTop = carCoords.y;
        const carYBottom = carCoords.y + carHeight;

        const carXLeft = carCoords.x - carWidth;
        const carXRight = carCoords.x + carWidth;

        const coinYTop = coinCoord.y;
        const coinYBottom = coinCoord.y + coinHeight;

        const coinXLeft = coinCoord.x - coinWidth;
        const coinXRight = coinCoord.x + coinWidth;

        // y
        if (carYTop > coinYBottom || carYBottom < coinYTop) {
            return false;
        }

        // x
        if (carXLeft > coinXRight || carXRight < coinXLeft) {
            return false;
        }

        return true;
    }

    const gameButton = document.querySelector('.game-button');
    gameButton.addEventListener('click', () => {
        isPause = !isPause;
        if (isPause) {
            cancelAnimationFrame(animationId);
            cancelAnimationFrame(carMoveInfo.top);
            cancelAnimationFrame(carMoveInfo.bottom);
            cancelAnimationFrame(carMoveInfo.left);
            cancelAnimationFrame(carMoveInfo.right);   
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
