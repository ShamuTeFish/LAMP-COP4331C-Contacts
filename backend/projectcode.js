//Change this as necessary to reflect new domain/file layout...
const urlBase = 'http://209.38.140.72'; 
const contactFile = "placeholder.html";

let userId = 0;
let fName = '';
let lName = '';

function refreshValues()
{
    userId = 0;
    fName = '';
    lName = '';
}

//Implement md5 password hasing later...
function login()
{
    refreshValues();

    //Grabbing login info from HTML file and setting error text to default
    let login = document.getElementById("loginEmail").value;
    let password = document.getElementById("loginPassword").value;
    document.getElementById("loginErr").innerHTML = "";

    let temp = {login:login, password:password};
    let jsonPayload = JSON.stringify(temp);

    let url = urlBase + '/Login.php';

    let xhr = new XMLHttpRequest();

    //Sends information to Login.php
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try
    {
        //Performs function once connection with server is established
        xhr.onreadystatechange = function()
        {
            //If server sent back a response that wasn't an error
            if(this.readyState == 4 && this.status == 200)
            {
                let jsonObject = JSON.parse(xhr.responseText);
                userId = jsonObject.Id;

                //Incorrect email/password
                if(userId < 1)
                {
                    document.getElementById("loginErr").innerHTML = "Incorrect email or password. Please try again.";
                    return;
                }

                fName = jsonObject.first_name;
                lName = jsonObject.last_name;

                cookieSave();

                window.location.href = contactFile;
            }
        };

        xhr.send(jsonPayload);
    }

    catch(err)
    {
        document.getElementById("loginErr").innerHTML = err.message;
    }

}

function logout()
{
	refreshValues();
	document.cookie = "fName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

//Can't be tested just yet, need proper php and API implemented for it
function register()
{
}

function cookieSave()
{
    let minutes = 10;
    let date = new Date();
    date.setTime(date.getTime() + (minutes*60*1000));
    document.cookie = "fName=" + fName + ",lName=" + lName + ",userId=" + userId + ";expires=" + date.toGMTString();
}