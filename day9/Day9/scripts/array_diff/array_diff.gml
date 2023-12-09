function array_diff(_arr) {
	var _final = [];
	for (var i = 0; i < array_length(_arr) - 1; i++) {
		var _diff = _arr[i + 1] - _arr[i];
		array_push(_final, _diff)
	}
	
	return _final;
}

function array_zerod(_arr) {
	for (var i = 0; i < array_length(_arr); i++) {
		if _arr[i] != 0
			return false;
	}
	
	return true;
}

function extrapolate(_arrs) {
	for (var i = array_length(_arrs) - 1; i >= 0; i--) {
		var _arr = _arrs[i];
		if array_zerod(_arr)
			continue;
			
		var _len = array_length(_arr);
		
		var _left = _arr[_len - 1];
		var _leftest = _arr[0];
		var _bottom_arr = _arrs[i + 1];
		var _bottom_len = array_length(_bottom_arr);
		var _bottom = _bottom_arr[_bottom_len - 1];
		var _bottom_left = _bottom_arr[0];
		
		array_push(_arr, _left + _bottom)
		array_insert(_arr, 0, _leftest - _bottom_left)
		_arrs[i] = _arr;
	}
	
	return _arrs;
}