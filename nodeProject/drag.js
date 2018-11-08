/*@Project : copyNpaste
 *@File name : drag.js
 *@Date : 2018.10.26
 *@Author : 우나연
 *@Desc : 웹 확장프로그램>> 드래그 저장*/
/*
	// 사용할 모듈 정리
	1. request (파라미터값과 헤더설정을 추가하여 웹서버에 요청을 )
	2. express (웹 서버 기능) 
	3. mysql (데이터베이스 접근)
	4. querystring (파라미터 처리)
	5. cors(Access-Control-Allow-Origin 헤더를 설정)>>맞춤법검사에 적용필요
 */

var request = require("request");
var express = require('express');
var mysql = require("mysql");
var qs = require("querystring");
var app = express();
var cors = require('cors');
var con = mysql.createConnection({
	host: "192.168.0.141",
	port: 3306,
	user: "copyNpaste",
	password: "1004",
	database: "copynpaste"
});

function drag(request, response) {
	var pData = "";
	request.on("data", function (data) {
		pData += data;
	});
	request.on("end", function () {
		var param = qs.parse(pData);
/*		console.log(param);
		console.log(param.dragText);*/
		var userEmail = param.userEmail;
		var dragText = param.dragText;
		var dragOrigin = param.dragOrigin;
		var dragOriginLink = param.dragOriginLink;
		
		var sql = "insert into drag (dragNum, userEmail, dragText, dragOrigin, dragOriginLink) " +
				  "select max(dragNum)+1, ?, ?, ? ,? from drag ";
		con.query(
				sql, 
				[userEmail, dragText, dragOrigin, dragOriginLink],  
				function (err, result) {
					if (err) {
						console.log("등록 중 오류 발생");
						console.log(err);
						return;
					}
					response.end();
				}
		);
		
	});
}

app.use(cors());

app.post('/drag', function(req, res){
	console.log("드래그 요청");
	drag(req, res);
});

app.listen(10020,function() {
	console.log("10020 드래그 서버 구동중");
});






