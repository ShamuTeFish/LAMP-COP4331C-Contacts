<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$inData = getRequestInfo();

// Validate required fields
if (!isset($inData["userId"]) || !isset($inData["firstName"]) || !isset($inData["lastName"]) || !isset($inData["email"]) || !isset($inData["phone"])) {
    returnWithError("All fields are required: userId, firstName, lastName, email, phone");
    exit();
}

$userId = $inData["userId"];
$firstName = $inData["firstName"];
$lastName = $inData["lastName"];
$email = $inData["email"];
$phone = $inData["phone"];

$conn = new mysqli("localhost", "TheBeast", "COP##4331C", "COP4331");
if ($conn->connect_error) {
    returnWithError($conn->connect_error);
    exit();
}

$stmt = $conn->prepare("INSERT INTO Contacts (userId, first_name, last_name, email, phone) VALUES(?, ?, ?, ?, ?)");
if (!$stmt) {
    returnWithError($conn->error);
    exit();
}

$stmt->bind_param("issss", $userId, $firstName, $lastName, $email, $phone);
if (!$stmt->execute()) {
    returnWithError($stmt->error);
    exit();
}

$stmt->close();
$conn->close();
returnWithSuccess("Contact added successfully");

function getRequestInfo()
{
    $inputData = file_get_contents('php://input');
    if ($inputData) {
        return json_decode($inputData, true);
    } else {
        returnWithError("No input received");
        exit();
    }
}

function sendResultInfoAsJson($obj)
{
    header('Content-type: application/json');
    echo $obj;
}

function returnWithError($err)
{
    $retValue = '{"error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}

function returnWithSuccess($message)
{
    $retValue = '{"success":"' . $message . '","error":""}';
    sendResultInfoAsJson($retValue);
}

?>
