//Change this as necessary to reflect new domain/file layout...
const urlBase = 'http://209.38.140.72/backend'; 
const contactFile = "placeholder.html";

let userId = 0;
let fName = '';
let lName = '';

//Related to Contact's
let contactEdited = null;
let contactEditedname = null;

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

function CreateContactPop()
{
document.getElementById("ContactPopup").style.visibility = "visible";

}

function SubmitContact()
{


let ContNameF = document.getElementById("PopNameF").value;
let ContNameL = document.getElementById("PopNameL").value;
let ContEmail = document.getElementById("PopEmail").value;
let ContPhone = document.getElementById("PopPhone").value;


if(contactEdited){
    const Contact = contactEdited
 Contact.ContNameF = ContNameF;
 Contact.ContNameL = ContNameL;
 Contact.ContEmail = ContEmail;
 Contact.ContPhone = ContPhone;

contactEditedname.value = Contact.ContNameF + " " + Contact.ContNameL;

contactEdited = null;
contactEditedname = null;
}
else{

const Contact = {
    ContID: Date.now(), //Gets the current time from 1970 in miliseconds, Good for unique ID's.
    ContNameF,
    ContNameL,
    ContEmail,
    ContPhone
    };
    CreateContact(Contact);
}


document.getElementById("ContactPopup").style.visibility = "hidden";
}

function CreateContact(Contact)
{

const ContactTab = document.createElement("div");
const Contactname = document.createElement("input");
const EditBut = document.createElement("button");
const DeleteBut = document.createElement("button");

ContactTab.className = "ContactTab";

Contactname.readOnly = true;
Contactname.value = Contact.ContNameF + " " + Contact.ContNameL;

EditBut.onclick = () => EditCont(Contact , Contactname)
DeleteBut.onclick = () => DeleteCont(ContactTab)

ContactTab.appendChild(Contactname);
ContactTab.appendChild(EditBut);
ContactTab.appendChild(DeleteBut);

document.getElementById("SearchList").appendChild(ContactTab);

}

function EditCont(Contact, Contactname)
{
contactEdited = Contact;
contactEditedname = Contactname;

document.getElementById("PopNameF").value = Contact.ContNameF
document.getElementById("PopNameL").value = Contact.ContNameL
document.getElementById("PopEmail").value = Contact.ContEmail
document.getElementById("PopPhone").value = Contact.ContPhone

document.getElementById("ContactPopup").style.visibility = "visible";
}

function DeleteCont(ContactTab)
{
 ContactTab.remove();
}
