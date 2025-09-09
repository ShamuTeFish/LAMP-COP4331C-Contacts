//Change this as necessary to reflect new domain/file layout...
const urlBase = 'http://209.38.140.72/backend'; 
const contactFile = "placeholder.html";

let userId = 0;
let fName = '';
let lName = '';
let warningImg = document.createElement('img');
warningImg.src = 'css/warning-sign-30915_1280.png';
warningImg.id = 'warningImg';

function refreshValues()
{
    userId = 0;
    fName = '';
    lName = '';
}

//Implement md5 password hashing later...
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
                let error = jsonObject.error;

                if(error !== "")
                {
                    document.getElementById("loginErr").innerHTML = error;
                    document.getElementById("loginErr").appendChild(warningImg);
                    return;
                }

                userId = jsonObject.Id;
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

function parseEmail(email)
{
   let emailSplit = parseEmail.split("@");

    //Emails cannot have more than 2 @
    if(emaiLSplit.length == 2)
    {
        let localPart = emailSplit[0];
        let domain = emailSplit[1];

        //If email domain is an IP Address...
        if(domain.charAt(0) == '[' && domain.charAt(domain.length - 1) == ']')
        {
        }
    }

    return false;
}

function register()
{
    userId = 0;
    fName = document.getElementById("firstName").value;
    lName = document.getElementById("lastName").value;
    let login = document.getElementById("regEmail").value;
    let password = document.getElementById("regPassword").value;
    //let hash = md5(password);
    document.getElementById("regErr").innerHTML = "";

    let temp = {login:login, password:password, first_name:fName, last_name:lName};
    let jsonPayload = JSON.stringify(temp);

    let url = urlBase + '/JEANRegister.php';

    let xhr = new XMLHttpRequest();

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try
    {
        xhr.onreadystatechange = function()
        {
            if(this.readyState == 4 && this.status == 200)
            {
                let jsonObject = JSON.parse(xhr.responseText);

                if (jsonObject.error !== "")
                {
                    document.getElementById("regErr").innerHTML = jsonObject.error;
                    return;
                } 

                userId = jsonObject.Id;

                cookieSave();

                window.location.href = contactFile;
            }
        };

        xhr.send(jsonPayload);
    }

    catch(err)
    {
        document.getElementById("regErr").innerHTML = err.message;
    }
}

function cookieSave()
{
    let minutes = 20;
    let date = new Date();
    date.setTime(date.getTime() + (minutes*60*1000));
    document.cookie = "fName=" + fName + ",lName=" + lName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");

	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");

		if( tokens[0] == "fName" )
		{
			firstName = tokens[1];
		}

		else if( tokens[0] == "lName" )
		{
			lastName = tokens[1];
		}

		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}

	else
	{
        document.getElementById("fullName").innerHTML = firstName + " " + lastName;
	}
}