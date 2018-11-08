/*@Project : copyNpaste
 *@File name : drag.js
 *@Date : 2018.10.26
 *@Author : 우나연
 *@Desc : 웹 확장프로그램>> 로그인 */
/*
	// 사용할 모듈 정리
	1. request (파라미터값과 헤더설정을 추가하여 웹서버에 요청을 )
	2. express (웹 서버 기능) 
	4. querystring (파라미터 처리)
	5. cors(Access-Control-Allow-Origin 헤더를 설정)>>맞춤법검사에 적용필요
	6. axios (요청/응답 객체)
 */
var http = require("http");
var request = require("request");
var express = require('express');
var app = express();
var axios = require('axios');
var cors = require('cors');
var loginResult = []; 


function login(userEmail, userPwd) {
	var params = { userEmail: userEmail, userPwd: userPwd}
	 axios(	{
		 	 method:'post',
		 	 baseURL: 'http://localhost:8090/copyNpaste/',
			 url:'member/loginExtention.json', 
			 data: params,
			 proxy:false
					  })
		  .then(function (response) {
				loginResult = [];
				if (response.data.userEmail != null){
					loginResult = {"loginChk":"true","userEmail":response.data.userEmail, "userNick": response.data.userNick, "userPhoto": response.data.userPhoto};
				}else {
					loginResult = {"loginChk":"false"};
				}

		  })
		  .catch(function (error) {
		    console.log(error);
		  });
}


app.use(cors());

app.post('/login', function(req, res){
	console.log("로그인 요청");
	var param = req.query;
	var userEmail = param.userEmail;
	var userPwd = param.userPwd;
	login(userEmail, userPwd);
	setTimeout(function() { 
	console.log(loginResult);
	res.send(loginResult);
	}, 1600)
});

app.listen(10030,function() {
	console.log("10030 로그인 서버 구동중");
});










