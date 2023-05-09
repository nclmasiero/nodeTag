function isOverlapping(p1, p2) {
    return getDistance(p1, p2) <= p1.radius + p2.radius;
}

function getDistance(p1, p2) {
    let xDist = Math.abs(p1.position.x - p2.position.x);
    let yDist = Math.abs(p1.position.y - p2.position.y);
    return Math.sqrt(xDist * xDist + yDist * yDist);
}

module.exports.isOverlapping = isOverlapping;