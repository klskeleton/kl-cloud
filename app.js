var express = require('express');
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();
var config = require('dist/klcloud.config.js')
var multiparty = require("multiparty")


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
	extended: false
}))

app.all('*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "content-type");
	res.header("Access-Control-Allow-Methods", "GET,POST");

	next();
});

 

// async version with basic error handling
function walk(currentDirPath, callback) {
	var list = []
	var fs = require('fs'),
		path = require('path');
	fs.readdir(currentDirPath, function(err, files) {
		if (err) {
			callback()
		} else {
			for (let i = 0; i < files.length; i++) {
				var filePath = path.join(currentDirPath, files[i]);
				var stat = fs.statSync(filePath);
				if (stat.isFile()) {
					list.push({
						file_name: files[i],
						file_stat: stat,
						file_path: filePath.replace(/\\/g, "/"),
						is_file: true
					});
					//callback(文件路径，是否为文件，或者是文件夹)
				} else if (stat.isDirectory()) {
					list.push({
						file_name: files[i],
						file_stat: stat,
						file_path: filePath.replace(/\\/g, "/"),
						is_file: false
					});
				}
			}
			callback(list)
		}
	});
}


function formatReq(code, msg, data) {
	return {
		code: code,
		data: data,
		message: msg
	}
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));
// // 访问静态资源
app.use(express.static(path.resolve(__dirname, 'dist/')));
// 访问单页
app.get('/', function(req, res) {
	var html = fs.readFileSync(path.resolve(__dirname, 'dist/index.html'), 'utf-8');
	res.writeHead(200, {"Content-Type": "text/html"});
	
	res.send(html);
});



//获取路径下的文件
app.post('/api/file/open', (req, res) => {
	
	console.log("获取路径下的文件", req.body);
	
	
	let file_type = req.body.path.substring(req.body.path.lastIndexOf('.') + 1, req.body.path.length)
	console.log(file_type)
	if (file_type.match(/(png|jpg|svg|gif|jpeg|ico)/)) {
		fs.readFile(req.body.path,'binary',function(err,data){
		    if(err){
		        console.log(err)
		    }else{
				
		        console.log('数据读取成功');
				const buffer = new Buffer.from(data, 'binary');
				let src = 'data:image/'+ file_type +';base64,' + buffer.toString('base64');
				res.send(formatReq(1, "获取成功", src))
		    }
		});
		// res.set('content-type', 'image/png'); //设置返回类型
		// var stream = fs.createReadStream(req.body.path);
		// var responseData = []; //存储文件流
		// if (stream) { //判断状态
		// 	stream.on('data', function(chunk) {
		// 		responseData.push(chunk);
		// 	});
		// 	stream.on('end', function() {
		// 		var finalData = Buffer.concat(responseData);
		// 		res.write(finalData,'binary');
		// 		res.end();
		// 	});
		// }
		// console.log("获取图片", __dirname + "\\" + req.body.path.replace(/\//g, '\\'))
		// res.sendFile(__dirname + "\\" + req.body.path.replace(/\//g, '\\'));
	} else {
		var content = fs.readFileSync(req.body.path, 'utf-8');
		res.send(formatReq(1, "获取成功", content))
		res.end()
	}


})

//获取路径下的文件夹
app.post('/api/file/list', (req, res) => {
	console.log("获取路径下的文件夹", req.body);
	walk(req.body.path, file_list => {
		res.send(formatReq(1, "获取成功", file_list))
		res.end()
	})
})

//上传文件
app.post('/api/file/upload', (req, res) => {
	//利用multiparty中间件获取文件数据
	let uploadDir = './' //这个不用改，因为并不是保存在这个目录下，这只是作为中间目录，待会要重命名文件到指定目录的

	let form = new multiparty.Form()

	form.uploadDir = uploadDir
	form.keepExtensions = true; //是否保留后缀
	form.parse(req, function(err, fields, files) { //其中fields表示你提交的表单数据对象，files表示你提交的文件对象
		console.log("上传文件", fields)
		console.log("files", files)
		let save_path = fields.path

		if (err) {
			console.log(err)
			res.send(formatReq(0, "上传失败"))
		} else {

			let file_list = []
			if (!files.file) res.send(formatReq(0, "上传失败"))
			else {
				//所有文件重命名，（因为不重名的话是随机文件名）
				files.file.forEach(file => {
					/*
					 * file.path 文件路径
					 * save_path+originalFilename   指定上传的路径 + 原来的名字
					 */
					fs.rename(file.path, save_path + file.originalFilename, function(err) {
						if (err) {
							// console.log("重命名失败")
						} else {
							// console.log("重命名成功")
						}
					});

				})
				if (err) {
					console.log(err)
					res.send(formatReq(0, "上传失败"))
				} else {
					//返回所有上传的文件信息

					res.send(formatReq(1, "上传成功"))
				}
			}

		}
	})
	// fs.writeFile(req.fields.path, req.files,{encoding: 'utf8'} ,(err) => {
	// 	if (err) {
	// 	  res.send(formatReq(0,"上传文件失败"))
	// 	} else {
	// 	  res.send(formatReq(1,"上传文件成功"))
	// 	}
	//   res.end()
	// });
})

//创建文件夹
app.post('/api/folder/create', (req, res) => {
	console.log("创建文件夹", req.body);
	fs.mkdir(req.body.path, (err) => {
		if (err) {
			console.log(err);
			res.send(formatReq(0, "创建文件夹失败"))
		} else {
			res.send(formatReq(1, "创建文件夹成功"))
		}
		res.end()
	});

})

//创建文件
app.post('/api/file/create', (req, res) => {
	console.log("创建文件", req.body);
	fs.writeFile(req.body.path, "", (err) => {
		if (err) {
			console.log(err);
			res.send(formatReq(0, "创建文件失败"))
		} else {
			res.send(formatReq(1, "创建文件成功"))
		}
		res.end()
	});
})
//删除目录
app.post('/api/folder/remove', (req, res) => {
	console.log("删除目录", req.body);
	fs.rmdir(req.body.path, (err) => {
		if (err) {
			console.log(err);
			res.send(formatReq(0, "删除文件夹失败"))
		} else {
			res.send(formatReq(1, "删除文件夹成功"))
		}
		res.end()
	})
})


//删除文件
app.post('/api/file/remove', (req, res) => {
	console.log("删除文件", req.body);
	fs.unlink(req.body.path, (err) => {
		if (err) {
			console.log(err);
			res.send(formatReq(0, "删除文件失败"))
		} else {
			res.send(formatReq(1, "删除文件成功"))
		}
		res.end()
	})

})



app.get('/api/login/:account/:password', function(req, res) {
	if (req.params.account =='admin' && req.params.password == '132525') {
		res.send({
			code: 1,
			message: '登录成功'
		});
	} else {
		res.send({
			code: 0,
			message: '登录失败'
		});
	}
	res.end()

});

// 监听
app.listen(config.port, function() {
	console.log('success listen in port:' + config.port, '\nyour login info : ' + JSON.stringify(config.login));
});
