# shopping_CRUD

shopping_CRUD + login

npm install express, mysql2, sequelize, nodemon, sequelize-cli, jsonwebtoken, cookie-parser, dotenv

env : MYSQL_USERNAME, MYSQL_PASSWORD, MYSQL_DATABASE, MYSQL_HOST, TOKEN_KEY, SALT_ROUND_KEY

실행 : nodemon app.js

api 요청 명세서 : https://docs.google.com/spreadsheets/d/1ksj2iN7nyEOqSt3KDdvTjov7pggK9extDC5TAqggsnQ/edit?usp=sharing

DB ERD : https://www.erdcloud.com/d/DFrZZXjrQHmzsG4hk

<img width="621" alt="캡처" src="https://github.com/asdfg20564/programmers/assets/44521546/19efecda-6278-4bc5-8e6b-a2a75e39d046">

---

1. **암호화 방식**
- 비밀번호를 DB에 저장할 때 Hash를 이용했는데, Hash는 `단방향 암호화`와 `양방향 암호화` 중 어떤 암호화 방식에 해당할까요?

   _hash는 복호화가 불가능한 단방향 암호이다._
  
- 비밀번호를 그냥 저장하지 않고 Hash 한 값을 저장 했을 때의 좋은 점은 무엇인가요?

  _비밀번호를 더 안전하게 보관할 수 있다. 사용자가 입력할 때만 그 비밀번호를 입력하고, 어디에도 평문이 남아있지 않으니 DB를 해킹한 해커나 DB를 보는 관리자 역시 사용자의 비밀번호를 알지 못한다._
  

2. **인증 방식**
- JWT(Json Web Token)을 이용해 인증 기능을 했는데, 만약 Access Token이 노출되었을 경우 발생할 수 있는 문제점은 무엇일까요?

  _누구든 Access Token을 통해 인증된 사용자인 것으로 속여 해당 사이트를 이용할 수 있게 되고 서버는 이미 발급한 token에 대한 제어권이 존재하지 않다._
  
- 해당 문제점을 보완하기 위한 방법으로는 어떤 것이 있을까요?

  _Refresh token을 사용하여 access token의 유효기간을 짧게 두고 해당 사용자가 요청할 때마다 access를 허가하도록 한다._
  

3. **인증과 인가**
- 인증과 인가가 무엇인지 각각 설명해 주세요.

   _인증 : Authentication, 사용자가 누구인지 서버에게 인증한다._
  _인가 : Authorization, 인증된 사용자에게 특정 권한을 인가한다._
  
- 과제에서 구현한 Middleware는 인증에 해당하나요? 인가에 해당하나요? 그 이유도 알려주세요.

   _인가에 해당한다. 로그인에 성공한 사람에게 특정 api를 사용할 수 있도록 해주기 때문이다._
  

4. **Http Status Code**
- 과제를 진행하면서 `사용한 Http Status Code`를 모두 나열하고, 각각이 `의미하는 것`과 `어떤 상황에 사용`했는지 작성해 주세요.

  _200: ok, 기본 성공._
  _201: created, 회원 가입 등 정보 생성._
  _400: bad request, 올바르지 못한 입력 등 서비스 불가._
  _401: Unauthorized, 권한 없음._
  _404: not found, 찾을 수 없음._
  

5. **리팩토링**
- MongoDB, Mongoose를 이용해 구현되었던 코드를 MySQL, Sequelize로 변경하면서, 많은 코드 변경이 있었나요? 주로 어떤 코드에서 변경이 있었나요?

  _몇 가지 변경은 있었다. 바로 모델을 적는 것이 아닌 sequelize로 table을 create한 후에 사용하였다. 또, table 변경이 있을 때는 migration을 다시 적용해야했다. 모델에서와 table에서도 완전히 동일하진 않았다. 하지만 사용하는 함수 등 코드 자체는 크게 달라지진 않았다._
  
- 만약 이렇게 DB를 변경하는 경우가 또 발생했을 때, 코드 변경을 보다 쉽게 하려면 어떻게 코드를 작성하면 좋을 지 생각나는 방식이 있나요? 있다면 작성해 주세요.

  _우선 모델에서 가져와 사용한 코드는 비슷하니 그대로 모든 모델에 적용할 수 있는 함수들을 사용하고, sequelize 등을 통해 DB와 해당 모델을 연결할 수 있도록 한다._


6. **서버 장애 복구**
- 현재는 PM2를 이용해 Express 서버의 구동이 종료 되었을 때에 Express 서버를 재실행 시켜 장애를 복구하고 있습니다. 만약 단순히 Express 서버가 종료 된 것이 아니라, AWS EC2 인스턴스(VM, 서버 컴퓨터)가 재시작 된다면, Express 서버는 재실행되지 않을 겁니다. AWS EC2 인스턴스가 재시작 된 후에도 자동으로 Express 서버를 실행할 수 있게 하려면 어떤 조치를 취해야 할까요?
(Hint: PM2에서 제공하는 기능 중 하나입니다.)

  _pm2 startup 을 사용하면 서버컴퓨터가 재시작 후 자동으로 서버가 실행된다._


7. **개발 환경**
- nodemon은 어떤 역할을 하는 패키지이며, 사용했을 때 어떤 점이 달라졌나요?

  _node로 실행 중인 서버를 모니터링 하고 에러가 나도 바로 꺼지지 않으며 코드의 변경이 있을 때 자동으로 현재 실행 중인 서버에 반영해주는 확장 모듈이다._

- npm을 이용해서 패키지를 설치하는 방법은 크게 일반, 글로벌(`--global, -g`), 개발용(`--save-dev, -D`)으로 3가지가 있습니다. 각각의 차이점을 설명하고, nodemon은 어떤 옵션으로 설치해야 될까요?

  _일반적으론 해당하는 디렉토리 내에서만 패키지를 설치하게 된다. 글로벌은 어떠한 폴더에도 사용할 수 있도록 전역에 설치하는 옵션이다. 개발용은 실제 프로그램엔 포함되지 않아도 되지만, 개발 과정에서 사용해야 하는 파일을 다운 받을 때 사용한다. nodemon은 다른 곳에서도 사용할 일이 많기 때문에 -g 옵션으로 다운받았다._
