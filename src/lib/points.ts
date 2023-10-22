export function centerOfMass(points : number[][]) {
    const sum = points.reduce((acc, point) => {
        acc.x += point[0];
        acc.y += point[1];
        return acc;
    }, { x: 0, y: 0 });
    return { x: sum.x / points.length, y: sum.y / points.length };
}

export function distance(point1 : number[], point2 : number[]) {
    return Math.sqrt(Math.pow(point1[0] - point2[0], 2) + Math.pow(point1[1] - point2[1], 2));
}

export function radius(points : number[][]) {
    const { x: centerX, y: centerY } = centerOfMass(points);
    const radius = Math.max(...points.map(coord => {
        const dx = coord[0] - centerX;
        const dy = coord[1] - centerY;
        return Math.sqrt(dx * dx + dy * dy);  // Euclidean distance
    }));
}