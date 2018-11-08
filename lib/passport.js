var fs = require('file-system');
var member; 
var memberInfo; //String


module.exports = function (app) {

    var passport = require('passport'),
        LocalStrategy = require('passport-local').Strategy,
        GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

    app.use(passport.initialize());
    
    //3. 사용자 직렬화. 정보 받아서 파일에 씀
    passport.serializeUser(function (user, done) {  //Strategy 성공 시 호출됨. 로그인이 성공하면, serializeUser 메서드를 이용하여 사용자 정보를 Session에 저장할 수 있다.    
        //정보 받아옴
        var email = user.emails[0].value;
		var displayName = user.displayName;
		var photos = user.photos[0].value;
		var queryResult;
		//정보 정렬
		member = {userEmail:email, userNick:displayName, userPhoto:photos, userSocialStatus:3};
		memberInfo=JSON.stringify(member);
		//정보를 파일로 씀
		var data =  memberInfo; //파일에 쓰일 내용
		try {
			console.log('파일 생성');
			fs.writeFileSync('public/userInfo.txt', data, 'utf-8');
		} catch (err) { }
		done(null, user);     //function(user,done)을 이용해서 session에 저장할 정보를 두번째 인자로 넘김
    });


    //1. 클라이언트 아이디, 콜백 주소 등 모듈로 등록해 불러옴
    var googleCredentials = require('../config/google.json');

    //2. 1번 모듈 이용해 로그인
    passport.use(new GoogleStrategy({
            clientID: googleCredentials.web.client_id, //클라이언트 아이디
            clientSecret: googleCredentials.web.client_secret, //클라이언트 시크릿
            callbackURL: googleCredentials.web.redirect_uris[0], //콜백 주소
    		passReqToCallback: googleCredentials.web.passReqToCallback
        },
        function (request, accessToken, refreshToken, profile, done) {//내가 받아올 정보
        	return done(null, profile);
        }
    ));

    //Authenticate Requests 인증 요청
    //0. 인증 요청. 정보 받을 스코프 지정
    app.get('/auth/google.do',
        passport.authenticate('google', {
            scope: ['https://www.googleapis.com/auth/plus.login', 'email'] } )
        	);

    //4. 마지막 접속
    app.get('/auth/google/callback', //여기로 접속하면 
        passport.authenticate('google', { //이 미들웨어 리턴
            failureRedirect: 'http://localhost:8090/copyNpaste/' //로그인에 실패한 경우 여기로 보냄
        }),
        function (req, res) { //로그인 성공하면~~   
    		res.redirect('/auth/memberCheck'); //로그인 성공하면 여기로 이동시켜라
        });
    
    return passport;
    
}
