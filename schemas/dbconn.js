const mongoose = require('mongoose');

// 몽구스 연결 함수
async function connect() {
  // 만일 배포용이 아니라면, 디버깅 on
  /*
  if (process.env.NODE_ENV !== 'production') {
    mongoose.set('debug', true); // 몽고 쿼리가 콘솔에서 뜨게 한다.
  }
*/
  let retCode = 0;
  try {
    await mongoose.connect(process.env.MONGO_REMOTE, {
      dbName: 'mydb', // 실제로 데이터 저장할 db명
    });

  } catch (err) {
    retCode = 99;
  }
  return retCode;
  //.then(() => console.log('connected to mongodb'))
  //  .catch(e => console.error(e));
};

// 몽구스 커넥션에 이벤트 리스너를 달게 해준다. 에러 발생 시 에러 내용을 기록하고, 연결 종료 시 재연결을 시도한다.
mongoose.connection.on('error', (error) => {
  console.error('몽고디비 연결 에러', error);
});

mongoose.connection.on('disconnected', () => {
  console.error('몽고디비 연결이 끊겼습니다. 연결을 재시도합니다.');
  connect(); // 연결 재시도
});

module.exports = connect;