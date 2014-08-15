define(['sc', '../vars'], function(sc, vars) {
	var d, area, clear_btn, print, init;
	d = $(vars.selectors.log_cnt);
	area = d.find('textarea');
	clear_btn = d.find('button[name=clear]');
	init = function() {
		clear_btn.on('click', function() {
			area.empty();
		});
	};
	print = function(msg) {
		area.append(msg);
	}
	init();
	return sc.define({
		println : function(msg) {
			print(msg);
			print('\n');
		},
		print : print
	});
});
