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
    const Contact = contactEdited;
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

EditBut.onclick = () => EditCont(Contact , Contactname);
DeleteBut.onclick = () => DeleteCont(ContactTab);

ContactTab.appendChild(Contactname);
ContactTab.appendChild(EditBut);
ContactTab.appendChild(DeleteBut);

document.getElementById("SearchList").appendChild(ContactTab);

}

function EditCont(Contact, Contactname)
{
contactEdited = Contact;
contactEditedname = Contactname;

document.getElementById("PopNameF").value = Contact.ContNameF;
document.getElementById("PopNameL").value = Contact.ContNameL;
document.getElementById("PopEmail").value = Contact.ContEmail;
document.getElementById("PopPhone").value = Contact.ContPhone;

document.getElementById("ContactPopup").style.visibility = "visible";
}

function DeleteCont(ContactTab)
{
 ContactTab.remove();
}
