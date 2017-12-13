var input = 347991;
var start = 10;
var end = 25;
var inputs = makeInputsArray(start, end);

function makeInputsArray(start, end) {
	var array = [];
	for(var i = 0; i <= end - start; i++) {
		array[i] = start + i;
	}
	return array;
}

function oddCeil(num) {
	var ceil = Math.ceil(num);
	if (ceil%2) {
		return ceil;
	} else {
		return ceil + 1;
	}
}

function maxRoot(num) {
	return oddCeil(Math.sqrt(num));
}

function radius(num) {
	return (maxRoot(num) + 1) / 2;
}

function points(num) {
	var mr = maxRoot(num);
	var inc = mr - 1;
	var lowerMax = Math.pow((mr - 2), 2);

	var right = lowerMax + ((mr - 1) / 2);
	var top = right + inc;
	var left = top + inc;
	var bottom = left + inc;
	return [right, top, left, bottom];
}

function pointFromRadialIndex(radialIndex) {
	var rad = radius(radialIndex);
	var pointArr = points(radialIndex);
	var minToPoint = Infinity;
	for(var i = 0; i < 4; i++) {
		var point = pointArr[i];
		var more = radialIndex - point;
		var less = point - radialIndex;
		if (less >= 0 && less < minToPoint) {
			minToPoint = less;
		} else if (more >= 0 && more < minToPoint) {
			minToPoint = more;
		}
	}
	var radial = rad - 1;
	var tangential = minToPoint;

	var mr = maxRoot(radialIndex);
	var inc = mr - 1;
	var lowerLayerMax = Math.pow((mr - 2), 2);

	var oct = Math.ceil((radialIndex - lowerLayerMax) / inc * 2);
	var offset = (radialIndex - lowerLayerMax - 1) % inc;
	var x, y;
	switch(oct) {
		case 1:
			x = radial;
			y = -tangential
			break;
		case 2:
			x = radial;
			y = tangential;
			break;
		case 3:
			x = tangential;
			y = radial;
			break;
		case 4:
			x = -tangential;
			y = radial;
			break;
		case 5:
			x = -radial;
			y = tangential;
			break;
		case 6:
			x = -radial;
			y = -tangential
			break;
		case 7:
			x = -tangential;
			y = -radial;
			break;
		case 8:
			x = tangential;
			y = -radial;
			break;
	}
	/* r = radial layer
	 * x = cartesian x
	 * y = cartesian y
	 * o = octant
	 * d = side offset
	 */
	return { r: rad, x: x, y: y, o: oct, d: offset };

}

// for (var i = 0; i < inputs.length; i++) {
// 	console.log('' + (start+i), '=>', radialToCartesian(inputs[i]));
// }
// console.log(minManhatten(input));
var point = pointFromRadialIndex(input);
console.log(Math.abs(point.x) + Math.abs(point.y));