// Initialize
const buttons = document.querySelectorAll('.btn');
const date = document.querySelector('#date p');
const time = document.querySelector('#hour p');
const display = document.querySelector('#display-body p');
const displayHistoric = document.querySelector('#display-historic p');
let audio = new Audio('click.mp3');
let locale = 'pt-BR';
let lastOperator = '';
let lastNumber = '';
let operation = [];
let limited = 0;
initialize()

function initialize() {

    setLastNumberToDisplay();

    setDisplayDateTime();

    setInterval(()=>{
        setDisplayDateTime();
    }, 1000);

    initButtonsEvents();

    initKeyBoard();

}

function playAudio() {

     audio.currentTime = 0;

    audio.play();

}

function initKeyBoard() {

    document.addEventListener('keyup', e => {

        playAudio();

        switch(e.key) {
            case '+':
            case '-':
            case '/':
            case '*':
                addOperation(e.key);
                setHistoricToDisplay();
                break;
            case 'Enter':
            case '=':
                calc();
                break;
            case ',':
            case '.':
                addDot();
                break;
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
            case '0':
                addOperation(parseInt(e.key));
                setHistoricToDisplay();
                break;
            case 'Backspace':
                clearAllOrEntry();
                setHistoricToDisplay();
                limited = 0;
            break;
    
        };

    });

}

function setDisplayDateTime() {
    let currentDate = new Date;

    date.innerHTML = currentDate.toLocaleDateString(locale);

    time.innerHTML = currentDate.toLocaleTimeString(locale);
}

function initButtonsEvents() {
    buttons.forEach((btn) => {
        btn.addEventListener('click', e => {

            let textBtn = e.target.innerHTML;
            execBtn(textBtn);

        });
    });
}

function execBtn(value) {

    playAudio();
    
    switch(value) {

        case '+':
            addOperation(value);
            setHistoricToDisplay();
            break;
        case '-':
            addOperation(value);
            setHistoricToDisplay();
            break;
        case '÷':
            addOperation('/');
            setHistoricToDisplay();
            break;
        case 'x':
            addOperation('*');
            setHistoricToDisplay();
            break;
        case '=':
            calc();
            break;
        case ',':
            addDot();
            break;
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
        case '0':
            addOperation(parseInt(value));
            setHistoricToDisplay();
            break;
        case 'backspace':
            clearAllOrEntry();
            setHistoricToDisplay();
            limited = 0;
        break;

    };

}

function pushOperator(value) {

    operation.push(value);

    if(operation.length > 3) {

        calc();

    }

}

function getLastOperation() {

    return operation[operation.length-1];

}

function setLastOperation(value) {

    operation[operation.length - 1] = value;

}

function addOperation(value) {

    if (isNaN(getLastOperation())) {
        

        if (isAOperator(value)) {

            setLastOperation(value);

            limited = 0;

        } else {

            pushOperator(value);

            setLastNumberToDisplay();

            limited++;

        }

    } else {

        if(isAOperator(value)) {

            pushOperator(value);
            limited = 0;

        } else {

            if(limited <= 11) {
                let newValue = getLastOperation().toString() + value.toString();
                setLastOperation(newValue);

                limited++;

                setLastNumberToDisplay();

            }
        }

    } 
}

function isAOperator(value) {

    return(['+', '-', '*', '/'].indexOf(value) > - 1);

}

function getLastItem(isOperator = true) {

    let lastItem;

    for (let i = operation.length-1; i >= 0; i--) {

        if (isAOperator(operation[i]) == isOperator) {
            lastItem = operation[i];
            break;
        }

    };

    if (!lastItem) {

        lastItem = (isOperator) ? lastOperator : lastNumber;

    }

    return lastItem;

}

function setLastNumberToDisplay() {

    let lastNumber = getLastItem(false);

    if(!lastNumber) lastNumber = 0;

    display.innerHTML = lastNumber.toString().substr(0,12);

    setHistoricToDisplay();
  
}

function setHistoricToDisplay() {

    displayHistoric.innerHTML = operation.join(' ');

}

function clearAllOrEntry() {

    if(operation.length == 0){

        operation = [];
        lastNumber = '';
        isOperator = '';
        setLastNumberToDisplay();

    } else {

        operation.pop();
        setLastNumberToDisplay();

    }

}

function calc() {

    limited = 0;

    let last = '';

    lastOperator = getLastItem();

    if (operation.length < 3) {

        let firstItem = operation[0];

        operation = [firstItem, lastOperator, lastNumber];

    }

    if (operation.length > 3) {

        last = operation.pop();

        lastNumber = getResult();

    } else if (operation.length == 3) {

        lastNumber = getResult(false);

    }

    let result = getResult();

    operation = [result];

    if (last) operation.push(last);

    setLastNumberToDisplay();

}

function getResult() {

    try {

        return eval(operation.join(""));

    } catch(e) {

        setTimeout(() => {

            setError();

        }, 1);

    };

}

function addDot() {

    let lastOperation = getLastOperation();

    if (typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) return;

    if (isAOperator(lastOperation) || !lastOperation) {

        pushOperator('0.');

    } else {

        setLastOperation(lastOperation.toString() + '.');

    }

    setLastNumberToDisplay();

}

function setError() {

    display.innerHTML = "Error";

}

