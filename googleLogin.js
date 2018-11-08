var http = require("http");
var request = require("request");
var express = require('express');
var axios = require('axios');
var path = require('path');
var fs = require('fs');
var app = express();
var cors = require('cors');
var mysql = require("mysql");
var stt = require('serve-static');
var con = mysql.createConnection({
	host: "192.168.0.141",
	port: 3306,
	user: "copyNpaste",
	password: "1004",
	database: "copynpaste"
});

var passport = require('./lib/passport')(app);
/*var authRouter = express.Router();

app.use('/auth', authRouter);*/
app.use('/public', stt(path.join(__dirname, 'public')));
app.use(cors());

app.use('/auth/memberCheck', function(req, res){
	var data= fs.readFileSync('/public/userInfo.txt', 'utf-8');
	console.log('data: ' + data);
	var memberInfo = JSON.parse(data);
	var email = memberInfo.userEmail;
	
	//기존 회원인지 확인
	con.connect(function(err) {
		 if (err) throw err;
		 
		 con.query("select count(userEmail) as 'checkUserEmail' from users where userEmail='" + email + "'", 
				  	function (err, result, fields) {
			    		if (err) throw err;
			    		var queryResult = result[0].checkUserEmail;
			    			
			    		//기존 회원인 경우
			    		if (queryResult > 0){
			    			res.redirect('http://localhost:8090/copyNpaste');
			    			console.log('??');
			    		//기존 회원이 아닌 경우
			    		}else{
			    			res.redirect('http://localhost:8090/copyNpaste/member/googleOauth.do');
			    			console.log('--');
			    		}
			    	res.end();	
			  		});		  
				});
});

app.use('/auth/userInfo', function(req, res){
	var data = fs.readFileSync('userInfo.txt', 'utf-8');
	console.log(data);
	//혹은 res.send(파일);
});

app.listen(10040,function() {
	console.log("10040 구글 로그인 서버 구동중");
});



