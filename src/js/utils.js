let Utils = {};

Utils.checkRectAbove = (ax, ay, bx, by, aWidth, bWidth) => {
    let x = Math.max(ax, bx);
    let n1 = Math.min(ax + aWidth, bx + bWidth);

    return (n1 >= x && ay < by);
}

Utils.getRandomFromRange = (min, max) => {
    return Math.random() * (max - min) + min;
}

Utils.checkCollision = (ax, ay, bx, by, aWidth, bWidth, aHeight, bHeight) => {
    var x = Math.max(ax, bx);
    var n1 = Math.min(ax + aWidth, bx + bWidth);
    var y = Math.max(ay, by);
    var n2 = Math.min(ay + aHeight, by + bHeight);
    
    return { 
        collide: (n1 >= x && n2 >= y),
        ydir: ((ay < by) ? -1: 1)
    };
};

Utils.hexToRgbA = (hex, opacity) => {
    let c;

    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c = hex.substring(1).split('');

        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }

        c = `0x${c.join('')}`

        return `rgba(${(c>>16)&255}, ${(c>>8)&255}, ${c&255},${opacity})`;
    }
    throw new Error('Bad Hex');
}

Utils.arrayToRGBAString = (arr, opacity) => {
    return 'rgba('+arr[0]+', '+arr[1]+', '+arr[2]+', '+opacity+')';                                                                                                                                   
}

export default Utils;