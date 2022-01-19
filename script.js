// Quering The Dom
const mainContainer = document.querySelector('.QA');
const questionEl = document.querySelector('.question');
const answersEl = document.querySelector('.answers');
const controlsEl = document.querySelector('.controls');
const nextBtn = document.getElementById('next');
const backBtn = document.getElementById('back');
const submitBtn = document.getElementById('submit');
const persentEl = document.querySelector('.persent span');
const resultesEl = document.querySelector('.resultes');
const progressEl = document.querySelector('.resultes .progress');
const resutlesWrongeEl = document.querySelector('.wrong-answers');
const refreshBtn = document.querySelector('.refresh');
const topWrongBox = document.querySelector('.resultes h2');

// Helping Varibles
let length = 5;
let questionIdx = 0;
let answersArr = Array(length);
let rightAnswersArr = [];
let rightAnswersLength = 0;
let wrongArrObj = [];
let persent = 0;
let animatedPersent = 0;

// Getting The Data
function getData(url) {
    const request = new XMLHttpRequest();
    request.addEventListener('readystatechange', function () {
        if (this.readyState === 4 && this.status === 200) {
            let responseData = shuffle(JSON.parse(this.responseText));
            length = responseData.length < length ? responseData.length : length;
            let data = responseData.slice(0, length);
            // Get The Right Answers
            data.forEach(item => rightAnswersArr.push(item.right_answer));
            // Calling Functions
            updateUI(data[questionIdx]);
            // "nextBtn" EventListener
            nextBtn.addEventListener('click', () => {
                if (questionIdx < length - 1) {
                    questionIdx++
                    grouping();
                }
            });
            // "backBtn" EventListener
            backBtn.addEventListener('click', () => {
                if (!questionIdx <= 0) {
                    questionIdx--;
                    grouping();
                }
            });
            // Grouping Function
            function grouping() {
                updateUI(data[questionIdx]);
                // Buttons Activation Functions
                activeNextBtn();
                activeBackBtn();
                updateQValue();
            }
            // Submit Button
            submitBtn.addEventListener('click', () => {
                checkAnswers(data);
                resultesFunc();
            });
        }
    });
    request.open('GET', url, true);
    request.send();    
}
getData('https://github0045.github.io/Quiz_App_Json_Data/html_Questions.json');

// Shuffle Function
function shuffle(arr) {
    for (let i = 0; i < arr.length; i++) {
        let random = Math.floor(Math.random() * arr.length);
        let item = arr[i];
        arr[i] = arr[random];
        arr[random] = item;
    }
    return arr;
}

// UpdateUI Function
function updateUI(data) {
    // Clear The Text
    questionEl.textContent = '';
    answersEl.textContent = '';
    // Helping Varibles
    const questionText = document.createTextNode(data.title);
    let answersArr = [];
    // Pushing Answers To The "answersArr" Array
    for (let item in data) {
        if (item.includes('answer_')) {
            answersArr.push(item);
        }
    }
    // Looping In The Answers & Appending Children
    answersArr.forEach(answer => {
        // Create Answer Element
        const span = document.createElement('span');
        const answerText = document.createTextNode(data[answer]);
        span.append(answerText);
        answersEl.appendChild(span);
    });
    questionEl.append(questionText);
    // Adding The a,b,c,d
    const answersSpan = document.querySelectorAll('.answers span');
    let alphaOrder = ['a', 'b', 'c', 'd'];
    answersSpan.forEach((span, idx) => {
        span.textContent = `${alphaOrder[idx]}. ${span.textContent}`
    });
}

// Check Activation Btns
// NextBtn
function activeNextBtn() {
    if (questionIdx < length - 1) {
        nextBtn.classList.add('active');
    } else {
        nextBtn.classList.remove('active');
    }
}
activeNextBtn();
// BackBtn
function activeBackBtn() {
    if (!questionIdx <= 0) {
        backBtn.classList.add('active');
    } else {
        backBtn.classList.remove('active');
    }
}
activeBackBtn();

// Answers Toggle Active
answersEl.addEventListener('click', e => {
    const answers = [...answersEl.children];
    if (e.target.tagName === 'SPAN') {
        if (!e.target.classList.contains('active')) {
            answers.forEach(answer => answer.classList.remove('active'));
            e.target.classList.add('active');
        } else if (e.target.classList.contains('active')) {
            e.target.classList.remove('active');
        }
        // Edit The "answersArr"
        answersArr[questionIdx] = e.target.classList.contains('active') ? e.target.textContent.slice(3) : '';
        // Calling Functions
        changeProgress();
        activeSubmit();
    }
});

// Function Active Submit Function
function activeSubmit() {
    let arr = Array.from(answersArr, item => item || '');
    let condition = arr.includes('');
    if (!condition) {
        submitBtn.classList.add('active')
    } else {
        submitBtn.classList.remove('active')
    }
}

// Check Right Answers Function
function checkAnswers(data) {
    for (let i = 0; i < length; i++) {
        if (answersArr[i] === rightAnswersArr[i]) {
            rightAnswersLength++;
        } else {
            let obj = {
                question: data[i].title,
                choosenAnswer: answersArr[i],
                right: rightAnswersArr[i]
            };
            wrongArrObj.push(obj);
        }
    }
    // Calling Functions
    updataResultesUI(wrongArrObj);
}

// Update The Value Function
function updateQValue() {
    // Get The Answers Elements
    const answersSpans = document.querySelectorAll('.answers span');
    if (answersArr[questionIdx]) {
        answersSpans.forEach(span => {
            if (span.textContent.includes(answersArr[questionIdx])) {
                span.classList.add('active');
            }
        });
    }
}

// Change Progress Function
function changeProgress() {
    persent = Math.round((answersArr.filter(item => item).length * 100) / length);
    let duration = 200 / persent;
    let int = setInterval(() => {
        if (animatedPersent < persent) {
            animatedPersent++;
        } else if (animatedPersent > persent) {
            animatedPersent--;
        } else clearInterval(int);
        persentEl.textContent = animatedPersent;
    }, duration);
    document.documentElement.style.setProperty('--progress', `${persent}%`);
}

// Show Resultes Function
function resultesFunc() {
    let val = ((length - wrongArrObj.length) * 100) / length;
    let animatedVal = 0;
    let speed = val > 50 ? 1 : .5;
    let duration = val ? speed : 0;
    // Show The Resultes Progress
    resultesEl.classList = 'resultes';
    let int = setInterval(() => {
        if (animatedVal <= val) {
            animatedVal++;
            progressEl.style.backgroundImage = `conic-gradient(#3c59fb 0%, #3c59fb ${animatedVal - 1}%, transparent ${animatedVal - 1}%)`;
            progressEl.dataset.persent = `${animatedVal - 1}%`;
        } else clearInterval(int);
    }, (duration * 1000) / val);
    // Automatic Scroll To The Wrong Answers El
    setTimeout(() => {
        let bodyHeight = topWrongBox.offsetTop - 55;
        document.documentElement.scrollTo(0, bodyHeight);
    }, (duration * 1000) + 500);
    // Removing The Elements
    mainContainer.remove();
    controlsEl.remove();
    console.log(speed)
}

// Update Resultes UI Function
function updataResultesUI(arr) {
    // Clearing The Parent Before Adding Children
    resutlesWrongeEl.textContent = '';
    // Looping Throw The Data
    if (arr.length) {
        arr.forEach(item => {
            // Creating The Elements
            const wrongElCreated = document.createElement('div');
            const questionCreated = document.createElement('div');
            const rightCreated = document.createElement('div');
            const wrongCreated = document.createElement('div');
            // Create The Textnodes
            const questionTextNode = document.createTextNode(item.question);
            const rightTextNode = document.createTextNode(item.right);
            const wrongTextNode = document.createTextNode(item.choosenAnswer);
            // Setting The Classes And Attr
            wrongElCreated.classList = 'wrong';
            questionCreated.classList = 'qestion';
            rightCreated.classList = 'right-answer';
            wrongCreated.classList = 'wrong-answer';
            // Creating The Icons
            const rightIcon = document.createElement('i');
            const wrongIcon = document.createElement('i');
            rightIcon.classList = 'far fa-lightbulb';
            wrongIcon.classList = 'fas fa-times';
            // Appending Children & Textnodes
            questionCreated.append(questionTextNode);
            rightCreated.append(rightTextNode, rightIcon);
            wrongCreated.append(wrongTextNode, wrongIcon);
            wrongElCreated.append(questionCreated, rightCreated, wrongCreated);
            resutlesWrongeEl.appendChild(wrongElCreated);
        });
    } else resutlesWrongeEl.innerHTML = `<span class="msg">You Have No Mistakes !</span>`;
}

// Refresh Button
refreshBtn.addEventListener('click', () => window.location.reload());