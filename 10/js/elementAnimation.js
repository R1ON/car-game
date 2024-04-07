function elementAnimation(elem, elemInfo, speed, elemInitialYCoord) {
    let newYCoord = elemInfo.coords.y + speed;
    let newXCoord = elemInfo.coords.x;

    if (newYCoord > window.innerHeight) {
        newYCoord = elemInitialYCoord;

        const direction = parseInt(Math.random() * 2);
        const maxXCoord = (roadWidth + 1 - elemInfo.width);
        const randomXCoord = parseInt(Math.random() * maxXCoord);

        if (direction === 0) { // Двигаем влево
            newXCoord = -randomXCoord;
        }
        else if (direction === 1) { // Двигаем вправо
            newXCoord = randomXCoord;
        }


        if (!elemInfo.ignoreAppearance) {
            elem.style.display = 'initial';
            elemInfo.visible = true;
        } 

        newXCoord = direction === 0
            ? -randomXCoord
            : randomXCoord;
    }

    elemInfo.coords.y = newYCoord;
    elemInfo.coords.x = newXCoord;
    elem.style.transform = `translate(${newXCoord}px, ${newYCoord}px)`;
}