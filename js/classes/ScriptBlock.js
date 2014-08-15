define(['lib/SCjs', '../vars', 'clz/LogBlock'], function(sc, vars, LogBlock) {
	var d, area, clear_btn, excute_btn, lb, SB;
	d = $(vars.selectors.script_cnt);
	clear_btn = d.find('button[name=clear]');
	excute_btn = d.find('button[name=excute]');
	lb = sc.create(LogBlock);
	SB = sc.define({
		excute : function() {
			lb.println('-----Start excute-----');
			lb.println('-----Excute complete-----');
		}
	});
	return SB;
});
