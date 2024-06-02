const inputSlider = document.querySelector("[data-slider]");
const lengthdisplay = document.querySelector("[data-length]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercase = document.querySelector("#uppercase");
const lowercase = document.querySelector("#lowercase");
const numbercheck = document.querySelector("#number");
const symbols = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generate-password");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbol = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

// initailly
let password = "";
let passwordlength = 8;
let checkcount = 0;
handleslider();
// set strenght circle color to grey 
setindicator("#ccc");

// set the lenght of the password
function handleslider() {
    inputSlider.value = passwordlength;
    lengthdisplay.innerText = passwordlength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordlength - min)*100/(max- min)) + "% 100%";
}

// set indicator on the UI 
function setindicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 2px ${color}`;
}

function getRandomInteger(min, max) {
   return Math.floor(Math.random() * (max - min)) + min;
}

function generatorrndnumber() {
    return getRandomInteger(0, 9);
}
console.log('Start');
// Here we have used ASCII value to generate uppercase and lowercase letter
function generatelowercase() {
    return String.fromCharCode(getRandomInteger(97, 123));
}
console.log('done');
function generateuppercase() {
    return String.fromCharCode(getRandomInteger(65, 91));
}
console.log('Done2');
function generatesymbol() {
    const randNum = getRandomInteger(0, symbol.length)
    console.log('Symbol function generated')
    return symbol.charAt(randNum);
}

// function for strength of password 
function setstrength() {
    let upper = false;
    let lower = false;
    let num = false;
    let sym = false;
    if (uppercase.checked) upper = true;
    if (lowercase.checked) { lower = true; }
    if (numbercheck.checked) { num = true; }
    if (symbols.checked) { sym = true; }

    if (upper && num && (lower || sym) && passwordlength >= 8) {
        setindicator('#00ff00');
    } else if ((lower || upper) && (num || sym) && passwordlength >= 6) {
        setindicator('#ffff00');
    } else {
        setindicator('#ff0000');
    }
}

async function copycontent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch (e) {
        copyMsg.innerText = "Failed to copy";
    }
    // copy wala span visible
    // based on the concept of promise
    copyMsg.classList.add("active");
    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 3000);
}

// Event listener on input slider
inputSlider.addEventListener('input', (e) => {
    passwordlength = e.target.value;
    // to show change on UI we will use this number
    handleslider();
})

function handleCheckBoxChange() {
    checkcount = 0;
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked) {
            checkcount++;
        }
    });
    // special case 
    if (passwordlength < checkcount) {
        passwordlength = checkcount;
        handleslider();
    }
}
// Event listener on checkboxes
allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange)
})

// Event listener on copy btn
copyBtn.addEventListener('click', () => {
    if (passwordDisplay.value) {
        copycontent();
    }
});

// shuffle password
function shufflePassword(array){
    // Fisher Yate method

    for(let i=array.length-1;i>0;i--){
        // for(let i=0;i=array.length -1;i++){
        const j= Math.floor(Math.random()*(i+1));
        // swaping 
        const temp = array[i];
        array[i]=array[j];
        array[j] = temp;
    }

    // putting the elements 
    let str="";
    array.forEach((element) => (str += element));
    return str;
}

generateBtn.addEventListener('click', () => {

    // if none of the check box is checked
    if (checkcount == 0)
        return;

    if (passwordlength < checkcount) {
        passwordlength = checkcount;
        handleslider();
    }

    console.log('starting')
    // let's brake new password 
    // so remove odd password
    password = "";

    // firstly put acc to checked boxes
    // no need of this
    // if(uppercase.checked){
    //     password += generateuppercase();
    // }
    // if(lowercase.checked){
    //     password =+  generatelowercase();
    // }
    // if(numbercheck.checked){
    //     password += generatorrndnumber();
    // }
    // if(symbols.checked){
    //     password += generatesymbol();
    // }

    // by using function
    let funcArr = [];

    if (uppercase.checked) {
        funcArr.push(generateuppercase);
    }
    if (lowercase.checked) {
        funcArr.push(generatelowercase);
    }
    if (numbercheck.checked) {
        funcArr.push(generatorrndnumber);
    }
    if (symbols.checked) {
        funcArr.push(generatesymbol);
    }


    // compulory addition
    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
        console.log("done");
    }


    // remaining addition
    for (let i = 0; i < passwordlength - funcArr.length; i++) {
        let randIndex = getRandomInteger(0, funcArr.length);
        console.log("randIndex - " + randIndex);
        password += funcArr[randIndex]();
    }

    // shuffle password
    password = shufflePassword(Array.from(password));

    // show password in UI 
    passwordDisplay.value = password;

    // now calculate the strenght of password
    setstrength();
});
