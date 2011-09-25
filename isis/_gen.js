var fs = require('fs');

var make = function(path, value) {
	var status = ' ';
	
	if (path[path.length - 1] == '/') {
		path = path.slice(0, path.length - 1);
		
		try {
			if (!fs.statSync(path).isDirectory()) {
				status = 'E';
			}
		} catch (e) {
			status = 'C';
			
			fs.mkdirSync(path, 0755);
		}
	} else {
		try {
			if (!fs.statSync(path).isFile()) {
				status = 'E';
			}
		} catch (e) {
			status = 'C';
			
			fs.writeFileSync(path, value);
		}
		
		if (status == ' ' && fs.readFileSync(path) != value) {
			status = 'W';
			
			fs.writeFileSync(path, value);
		}
	}
	
	console.log('%s %s', status, path)
}

var generate = function(action) {
	if (action == 'create') {
		return {
			'./app/' : null,
			'./app/client/' : null,
			'./app/server/' : null,
			'./app/shared/' : null,
			'./app/server/handler.js' : 'handler.js',
			'./launch.js' : 'launch.js'
		}
	} else if (action) {
		console.log('  Unknown action ' + JSON.stringify(action) +
			'\n\n  Usage: isis action [args]\n');
	} else {
		console.log('  Nothing to do.\n\n  Usage: isis action [args]\n')
	}
}

exports.execute = function(args) {
	var action = args.length > 0 ? args[0] : null;
	var isis_directory = __dirname;
	
	if (!action) {
		try {
			if (!fs.statSync('./app').isDirectory())
				throw './app should be directory';
		} catch(e) {
			action = 'create';
		}
	}
	
	if (args.length > 2) {
		console.log('usage: isis create [directory]');
		return 1;
	}
	
	var directory = (args.length == 2 ? args[1] : '.');
	var behaviors = generate(action);
	
	for (var filename in behaviors) {
		if (behaviors[filename]) {
			make(filename, fs.readFileSync(isis_directory + '/' + behaviors[filename]));
		} else {
			make(filename);
		}
	}
	
	/*
	if (action == 'create') {
		
		if (args.length > 2) {
			console.log('usage: isis create [directory]');
			return 1;
		}
		
		
		make('./app/');
		make('./app/client/');
		make('./app/server/');
		make('./app/shared/');
		make('./app/handler.js', 'exports.Application = { }');
		
	} else if (action) {
		console.log('Unknown action ' + JSON.stringify(action));
		return 1;
	} else {
		console.log('  Nothing to do.\n\n  Usage: isis action [arguments]\n');
	}
	*/
	
	return 0;
}