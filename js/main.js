// 사용변수
const GAME_TIME = 9;
let score = 0; // 점수
let time = GAME_TIME;
let isPlaying = false;
let timeInterval;
let checkInterval;
let words = ['Hello', 'Banana', 'Apple'];

const wordInput = document.querySelector('.word-input');
const wordDisplay = document.querySelector('.word-display');
const scoreDisplay = document.querySelector('.score');
const timeDisplay = document.querySelector('.time');
const button = document.querySelector('.button');

// 초기값 세팅
init();

function init() {
    buttonChange("게임 로딩중...");
    getWords();
    wordInput.addEventListener('input', checkMatch) // input창에 입력한 값을 가져오기 위해 이벤트 생성-wordInput.addEventListener('이벤트', '기능')
}

// 게임시작 함수
function run() {
    if (isPlaying) { // 게임 중일 때는 게임시작 버튼이 다시 눌리지 않도록 함
        return;
    }
    isPlaying = true;
    time = GAME_TIME;
    wordInput.focus();
    scoreDisplay.innerText = 0;
    timeInterval = setInterval(countDown, 1000);
    checkInterval = setInterval(checkStatus, 50);
    buttonChange("게임 중");
}

function checkStatus() {
    if (isPlaying && time === 0) {
        buttonChange("게임시작"); // 게임종료 후 버튼 다시 활성화
        clearInterval(checkInterval);
    }
    
}

// 단어 불러오기
function getWords() {
    // 랜덤 단어 api 사용해서 단어 불러오기
    axios.get('http://random-word-api.herokuapp.com/word?number=100')
        .then(function (response) {
            // handle success
            response.data.forEach((word) => {
                if (word.length < 10) { // 단어 길이가 10보다 작으면
                    words.push(word); // words 배열에 push (배열 뒤에 word값 추가)
                }
            })
            console.log(response.data);
            buttonChange("게임시작");
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
}

// 단어 일치 체크하는 함수
function checkMatch() {
    //console.log(wordInput.value) input창에 입력되는 값 콘솔창으로 확인
    //console.log(wordDisplay.innerHTML) html 코드에 있는 .word-display의 값 확인
    //console.log(wordInput.value, wordDisplay.innerText) input창과 html코드 속 값들 확인 (공백 없이 확인하기 위해 .innerText사용)
    //console.log(wordInput.value.toLowerCase() === wordDisplay.innerText.toLowerCase()) // input창의 값과 html코드 속 값이 같은지 확인

    if (wordInput.value.toLowerCase() === wordDisplay.innerText.toLowerCase()) {
        wordInput.value = ""; // 초기화 후에는 input창 비워주기
        if (!isPlaying) {
            return;
        }
        score++;
        scoreDisplay.innerText = score; // score부분을 증가한 점수로 초기화
        //time = GAME_TIME;

        // 랜덤하게 단어 출력
        const randomIndex = Math.floor(Math.random() * words.length);
        wordDisplay.innerText = words[randomIndex];
    }
}

// 게임시작 버튼을 눌렀을 때 시간이 바뀌도록 설정
function countDown() {
    time > 0 ? time-- : isPlaying = false; // (조건) ? 참일 경우 : 거짓일 경우 --> time이 0보다 크면-참:1초씩 감소, 거짓:게임종료
    if (!isPlaying) { // isPlaying이 false면 (게임종료 시)
        clearInterval(timeInterval); // timeInterval 값 clear -> 종료시키기 -남은시간 0으로 만들기
        score = 0; // 점수도 0으로 초기화
    }
    timeDisplay.innerText = time;
}

// 버튼 바꾸는 함수
function buttonChange(text) {
    button.innerText= text;
    text === '게임시작' ? button.classList.remove('loading') : button.classList.add('loading'); // 전달된 text가 '게임시작'이면 button의 .loading 클래스 삭제, 아니면 button의 .loading 클래스 추가
}