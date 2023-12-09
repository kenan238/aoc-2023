function read_file(_f) {
	var _file = file_text_open_read(_f)
	var _dat = file_text_readln(_file);
	while (!file_text_eof(_file)) {
		_dat += file_text_readln(_file)
	}
	file_text_close(_file);
	
	return _dat;
}