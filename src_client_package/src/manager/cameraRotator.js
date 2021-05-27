let cameraRotator = {};

cameraRotator.isChange = false;
cameraRotator.data = '';
cameraRotator.lastKey = 0;

class CameraRotator {
    start(camera, basePosition, lookAtPosition, offsetVector, heading = 0, fov = undefined) {
        this.camera = camera;
        this.basePosition = basePosition;
        this.lookAtPosition = lookAtPosition;
        this.offsetVector = offsetVector;
        this.heading = heading;
        this.baseHeading = heading;
        this.currentPoint = { x: 0, y: 0 };
        this.isPause = false;
        this.zUp = 0;
        this.zUpMultipler = 4;
        this.offsetMultipler = offsetVector.y;
        this.offsetBound = [ 5, 10 ];
        this.xBound = [ 0, 360 ];
        this.zBound = [ -0.8, 1 ];

        this.changePosition();

        camera.pointAtCoord(lookAtPosition.x, lookAtPosition.y, lookAtPosition.z);

        if (fov) {
            camera.setFov(fov);
        }

        this.activate(true);
    }

    pause(state) {
        this.isPause = state;
    }

    stop() {
        this.activate(false);
    }

    reset() {
        this.heading = this.baseHeading;
        this.zUp = 0;
        this.changePosition();
    }

    setXBound(min, max) {
        this.xBound = [ min, max ];
    }

    setOffsetBound(min, max) {
        this.offsetBound = [ min, max ];
    }

    setZBound(min, max) {
        this.zBound = [ min, max ];
    }

    setZUpMultipler(value) {
        this.zUpMultipler = value;
    }

    getRelativeHeading() {
        return this.normilizeHeading(this.baseHeading - this.heading);
    }

    activate(state) {
        /* this.camera.setActive(state);
        mp.game.cam.renderScriptCams(state, false, 3000, true, false); */
        this.isActive = state;
    }

    isCamera() {
        return this.camera;
    }

    onMouseMove(dX, dY) {
        this.heading = this.normilizeHeading(this.heading + dX * 100);

        let relativeHeading = this.getRelativeHeading();

        if (this.xBound[0] !== -360 && this.xBound[1] !== 360) {
            if (relativeHeading > this.xBound[0] && relativeHeading < this.xBound[1]) {
                relativeHeading = Math.abs(this.xBound[0] - relativeHeading) > Math.abs(this.xBound[1] - relativeHeading)
                    ? this.xBound[1]
                    : this.xBound[0];
            }
        }

        this.heading = this.normilizeHeading(-relativeHeading + this.baseHeading);
        this.zUp += dY * this.zUpMultipler * -1;

        /*let message = `1: ${this.heading + dX * 100}`;
        message += `\n2: ${-relativeHeading + this.baseHeading}`;
        message += `\n3: ${relativeHeading > this.xBound[0] && relativeHeading < this.xBound[1]}`;

        mp.game.graphics.drawText(message, [0.5, 0.5], {
            font: 7,
            color: [255, 255, 255, 185],
            scale: [0.5, 0.5],
            outline: true,
            centre: true
        });*/

        if (this.zUp > this.zBound[1]) {
            this.zUp = this.zBound[1];
        } else if (this.zUp < this.zBound[0]) {
            this.zUp = this.zBound[0];
        }

        this.changePosition();
    }

    onMouseScroll(sU, sD) {
        this.offsetMultipler -= sU / 5;
        this.offsetMultipler += sD / 5;

        if (this.offsetMultipler > this.offsetBound[1]) {
            this.offsetMultipler = this.offsetBound[1];
        } else if (this.offsetMultipler < this.offsetBound[0]) {
            this.offsetMultipler = this.offsetBound[0];
        }
        this.offsetVector = new mp.Vector3(this.offsetVector.x, this.offsetMultipler, this.offsetVector.z);

        /*let message = `1: ${this.offsetMultipler}`;

        mp.game.graphics.drawText(message, [0.5, 0.5], {
            font: 7,
            color: [255, 255, 255, 185],
            scale: [0.5, 0.5],
            outline: true,
            centre: true
        });*/

        this.changePosition();
    }

    changePosition() {
        const position = mp.game.object.getObjectOffsetFromCoords(this.basePosition.x, this.basePosition.y,
            this.basePosition.z + this.zUp, this.heading, this.offsetVector.x, this.offsetVector.y, this.offsetVector.z);

        this.camera.setCoord(position.x, position.y, position.z);
    }

    isPointEmpty() {
        return this.currentPoint.x === 0 && this.currentPoint.y === 0;
    }

    setPoint(x, y) {
        this.currentPoint = { x, y };
    }

    getPoint() {
        return this.currentPoint;
    }

    normilizeHeading(heading) {
        return heading;
    }
}

export default {Rotator: CameraRotator};