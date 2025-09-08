<?php

$inData = getRequestInfo();

$contactId = $inData["contactId"];
$userId = $inData["userId"];
$firstName = $inData["firstName"];
$lastName = $inData["lastName"];
$email = $inData["email"];
$phone = $inData["phone"];

$conn = new mysqli("localhost", "TheBeast", "COP##4331C", "COP4331");
if ($conn->connect_error) 
{
    returnWithError($conn->connect_error);
} 
else
{
    // First verify the contact belongs to the user
    $checkStmt = $conn->prepare("SELECT Id FROM Contacts WHERE Id = ? AND userId = ?");
    $checkStmt->bind_param("ii", $contactId, $userId);
    $checkStmt->execute();
    $result = $checkStmt->get_result();
    
    if ($result->num_rows == 0) {
        $checkStmt->close();
        $conn->close();
        returnWithError("Contact not found or access denied");
        exit();
    }
    $checkStmt->close();
    
    $stmt = $conn->prepare("UPDATE Contacts SET first_name = ?, last_name = ?, email = ?, phone = ? WHERE Id = ? AND userId = ?");
    if (!$stmt) {
        returnWithError($conn->error);
    } else
    {
        $stmt->bind_param("ssssii", $firstName, $lastName, $email, $phone, $contactId, $userId);
        if (!$stmt->execute()) {
            returnWithError($stmt->error);
        } else {
            $stmt->close();
            $conn->close();
            returnWithSuccess("Contact updated successfully");
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
