/**
 * Created by endre on 05.11.15.
 */

function randomGauss() {
    "use strict";
    // See http://c-faq.com/lib/gaussian.html
    // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random

    var v1, v2, S;

    do {
        v1 = 2 * Math.random() - 1;
        v2 = 2 * Math.random() - 1;
        S = v1 * v1 + v2 * v2;
    } while(S >= 1 || S == 0);

    // Ideally alternate between v1 and v2
    return v1 * Math.sqrt(-2 * Math.log(S) / S);
}

function generateRandomData(count, generator, validator, maxTriesMultiplicator) {
    "use strict";
    var dataList = [];

    if (maxTriesMultiplicator === undefined) {
        maxTriesMultiplicator = 2;
    }

    var maxTries = maxTriesMultiplicator * count;

    if (validator === undefined) {
        validator = function() {
            return true;
        };
    }
    var i = 0;
    var numTries = 0;

    while (i < count && numTries < maxTries) {
        var data = generator();

        if (validator(data)) {
            // Accept the generated data
            dataList.push(data);

            i += 1;
        }

        numTries += 1;
    }

    if (numTries == maxTries) {
        console.warn("Maximized tries, generated " + i + " items");
    }

    return dataList;
}

/**
 * Generate random 3d position using a uniform distribution.
 * Centered at center and with maxmimum spread at radius.
 *
 * @param {THREE.Vector3} center center of the distribution
 * @param {Number} radius the maximum spread
 * @returns {THREE.Vector3} a random position
 */
function randomUniformPositionMaker(center, radius) {
    "use strict";
    var pos = new THREE.Vector3();

    pos.x = radius * (2 * Math.random() - 1);
    pos.y = radius * (2 * Math.random() - 1);
    pos.z = radius * (2 * Math.random() - 1);

    pos.add(center);

    return pos;
}

/**
 * Generate a random 3d position using a Gauss distribution.
 *
 * @param {THREE.Vector3} center the mean of the distribution, most values concentrated here
 * @param {Number} radius the standard deviation, the typical spread radius, points will exceed this value
 * @returns {THREE.Vector3}
 */
function randomGaussPositionMaker(center, radius) {
    "use strict";
    var pos = new THREE.Vector3();

    pos.x = radius * randomGauss();
    pos.y = radius * randomGauss();
    pos.z = radius * randomGauss();

    pos.add(center);

    return pos;
}

function gauss(x, mean, stdDev) {
    "use strict";
    var areaSmoother = Math.sqrt(2*Math.PI);
    var posAndStretch = Math.pow((x - mean)/stdDev, 2)/2;

    return (1/(stdDev*areaSmoother))*Math.exp(-posAndStretch);
}
