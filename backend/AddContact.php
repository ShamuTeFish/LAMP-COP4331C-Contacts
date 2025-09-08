<?php

$inData = getRequestInfo();

$userId = $inData["userId"];
$firstName = $inData["firstName"];
$lastName = $inData["lastName"];
$email = $inData["email"];
$phone = $inData["phone"];

$conn = new mysqli("localhost", "TheBeast", "COP##4331C", "PROJECT");
if ($conn->connect_error) 
{
    returnWithError($conn->connect_error);
} 
else
{
    $stmt = $conn->prepare("INSERT INTO Users (userId, first_name, last_name, email, phone) VALUES(?, ?, ?, ?, ?)");
    if (!$stmt) {
        returnWithError($conn->error);
    } else
    {
        $stmt->bind_param("issss", $userId, $firstName, $lastName, $email, $phone);
        if (!$stmt->execute()) {
            returnWithError($stmt->error);
        } else {
            $stmt->close();
            $conn->close();
            returnWithSuccess("Contact added successfully");
        }
    }
}

function getRequestInfo()
{
    return json_decode(file_get_contents('php://input'), true);
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
