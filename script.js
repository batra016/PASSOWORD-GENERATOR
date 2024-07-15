const inputslider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthnumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copybtn = document.querySelector("[data-copy]");
const copymessage = document.querySelector("[data-copying-message]");
const uppercase = document.querySelector("#uppercase");
const lowercase = document.querySelector("#lowercase");
const num = document.querySelector("#numbers");
const sym = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generatebtn = document.querySelector(".generatebutton");
// will access all checkbox
const allcheckbox = document.querySelectorAll("input[type = checkbox]");
//string of character
const string1 = '!@#$%^&*(){}:">?<|\[],.+-/;';

// variable intialisation
let password = "" ; // password is empty in starting
let passwordLength = 10; // reload krke dekhle page ko
let checkcount = 0 // eek hi checkbox already checked h
indicatorr("#ccc")
//function call
handleslider();



//slider function 
function handleslider(){
    inputslider.value = passwordLength; //is line ki koi need nhi hai waise
    lengthDisplay.innerText = passwordLength;
    //jitni value hai utna portion purple hai baki black hai 
    const min = inputslider.min;
    const max = inputslider.max;
    inputslider.style.backgroundSize= ((passwordLength-min)*100/(max-min)) + "% 100%";
    // 100% showing height wla part
}

//indicator function 
function indicatorr(color){
    indicator.style.backgroundColor = color;
    // shadow
    indicator.style.boxShadow = `1px 1px 20px ${color}`;
}

//function random integer - to get the no for password
function getrandom(min,max){
    return Math.floor(Math.random()*(max-min)) + min;
}

// to get the no for password
function generaterandom(){
    return getrandom(0,9);
}
// to get lowercase for password
function generatelowercase(){
    // to convert the ascii value to character we will use String.fromCharCode
    return String.fromCharCode(getrandom(97,123)); // 97 is ascii value of a and 123 is z
}
// to get uppercase for password
function generateuppercase(){
    // to convert the ascii value to character we will use String.fromCharCode
    return String.fromCharCode(getrandom(65,91)); // 65 is ascii value of A and 91 is Z
}
// to get symbol for password
function generatesymbol(){
    const randno = getrandom(0,string1.length);
    const rr =  Math.floor(randno);
    return string1.charAt(rr);
}

//calculate strength 
function calstrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasSymbol = false;
    let hasNumber = false;

    if(uppercase.checked){
        hasUpper = true;
    }
    if(lowercase.checked){
        hasLower = true;
    }
    if(num.checked){
        hasNumber = true;
    }
    if(sym.checked){
        hasSymbol = true;
    }
    //these are the rules that can be st according to u
    if(hasUpper && hasLower && (hasNumber || hasSymbol) && passwordLength>=8 ){
        indicatorr("#0f0");
    }
    else if((hasLower|| hasUpper) && (hasNumber|| hasSymbol) && passwordLength>=6){
        indicatorr("#ff0");
    }
    else{
        indicatorr("#f00")
    }
}

// copy function  - async hoga kyuki we need to use await keyword
async function copycontent(){
    // error ko hnadle krne kai liye try catch block
    try{
       await navigator.clipboard.writeText(passwordDisplay.value);
       copymessage.innerText= "Copied";
    }
    catch(e){
        copymessage.innerText= "failed";
    }
    

    // active css ki class hai
    copymessage.classList.add("active");
    // after 2 sec copied wala text htana hai 
    setTimeout(
        function(){
            copymessage.classList.remove("active");
        }, 2000
    );
}

//slider event listner
// input event listner - The InputEvent Object handles events that occur when an input element is changed.
inputslider.addEventListener("input", function(e){ // simple lang mai bolu tu value aayi password length mai set kri wo value and handle slider ko pass krdi and handle slider no ki value ko change krega
    passwordLength = e.target.value;
    handleslider();
});

// copy button event listner
//why cant be straight away add onclick to it - we cant because there is a cond that if the password is avaliable that only er can copy
copybtn.addEventListener("click", function(){
    if(passwordDisplay.value){
        copycontent(); // is password display value is non empty then only we can proceed
    }
});


// handling checkbox


//function handlechange
function handlechange(){
    checkcount = 0; // will change count to 0
    allcheckbox.forEach(
        function(checkbox){
            if(checkbox.checked){
                checkcount++;
            }
        }
    );
    
    // if user has selected all 4 checkbox and passowrd length is suppose one then the length will automatically change to 4 by default
    if(passwordLength<checkcount){
        passwordLength = checkcount;
        // and for every passwordlength change u need to handle slider
        handleslider();
    }


}

// saare checkbox mai sai koi bhi change hoga toh eek event listner call hoga
// The forEach() method calls a function for each element in an array
allcheckbox.forEach(
    function(checkbox){
        checkbox.addEventListener("change", handlechange); // koi bhi eek checkbox mai bhi change hoga tb bhi handle change function will be called
    }
)

//shuffle password function - refer copy for explanation
// FISHERS YATES METHOD
function shufflepassword(array){
    for(let i = array.length-1;i>0;i--){
        const j = Math.floor(Math.random()*(i+1));
        // swap i and j
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str= "";
    array.forEach(function(el){
        str+= el;
    });
    return str;

}


// MAIN PART OF CODE - BUTTON PR CLICK PR KYA HOGA 
generatebtn.addEventListener("click", function(){
    // sbse phele baat will no of checkbox checked
    if(checkcount<=0){
       return;
    }
    // agar kaam checkbox hai same condition
    if(passwordLength<checkcount){
        passwordLength = checkcount;
        // and for every passwordlength change u need to handle slider
        handleslider();
    }

    // then haam agar koi previous password generated hai toh empty krdenge
    password="";

    // abh we will create an array jisme wo saare checkbox function include krlenge jo tick hai
    let funcArr = []; // empty array
    if(uppercase.checked){
        funcArr.push(generateuppercase);
    }
    if(lowercase.checked){
        funcArr.push(generatelowercase);
    }
    
    if(num.checked){
        funcArr.push(generaterandom);
    }
    console.log("hello");
    if(sym.checked){
        funcArr.push(generatesymbol);
    }

    // abh jo jo tick hai compulsory hai add krna add them
    for(let i =0;i<funcArr.length;i++){
        password += funcArr[i](); // Call the function at funcArr[i] and concatenate its return value to password
    }

    //remaning addition

    for(let i =0;i<passwordLength-funcArr.length;i++){
        let randindex = getrandom(0, funcArr.length); //randomly choosing 1 func out of all the func which are present
        password += funcArr[randindex]();
    }

    // shuffle the password
    password = shufflepassword(Array.from(password)); // password ki string  ko array ki form mai bhejdiya

    //display it
    passwordDisplay.value = password;

    //strength calculate
    calstrength();

});

