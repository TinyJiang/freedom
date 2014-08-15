requirejs.config({
	paths : {
		lib : './lib',
		clz : './classes',
		sc : 'lib/SCjs'
	}
});
requirejs(['sc', 'clz/ScriptBlock'], function(sc, ScriptBlock) {
	var sb = sc.create(ScriptBlock);
	sb.excute();
});
