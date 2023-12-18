/// @description Solve
var _data = string_split(read_file("data.txt"), "\r\n")

part1 = 0
part2 = 0

for (var i = 0; i < array_length(_data); i++) {
	var _line = string_split(_data[i], " ");
	var _nbrs = array_map(_line, function (_el) {
		return real(_el);
	})
	
	var _seqs = [];
	var _cur = _nbrs;
	array_push(_seqs, _cur); 
	
	do {
		_cur = array_diff(_cur);
		array_push(_seqs, _cur);
	} until array_zerod(_cur);
	
	var _extrapd = extrapolate(_seqs)
	var _value = _extrapd[0][array_length(_extrapd[0]) - 1]
	var _value2 = _extrapd[0][0]
	part1 += _value
	part2 += _value2
}