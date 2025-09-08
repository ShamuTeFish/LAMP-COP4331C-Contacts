<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$inData = getRequestInfo();

// Validate required fields
if (!isset($inData["contactId"]) || !isset($inData["userId"])) {
    returnWithError("contactId and userId are required");
    exit();
}

$contactId = $inData["contactId"];
$userId = $inData["userId"];

$conn = new mysqli("localhost", "TheBeast", "COP##4331C", "COP4331");
if ($conn->connect_error) {
    returnWithError($conn->connect_error);
    exit();
}
// First verify the contact belongs to the user
$checkStmt = $conn->prepare("SELECT Id FROM Contacts WHERE Id = ? AND userId = ?");
if (!$checkStmt) {
    returnWithError($conn->error);
    exit();
}

$checkStmt->bind_param("ii", $contactId, $userId);
if (!$checkStmt->execute()) {
    returnWithError("Verification failed: " . $checkStmt->error);
    exit();
}

$result = $checkStmt->get_result();
if ($result->num_rows == 0) {
    $checkStmt->close();
    $conn->close();
    returnWithError("Contact not found or access denied");
    exit();
}
$checkStmt->close();

$stmt = $conn->prepare("DELETE FROM Contacts WHERE Id = ? AND userId = ?");
if (!$stmt) {
    returnWithError($conn->error);
    exit();
}

$stmt->bind_param("ii", $contactId, $userId);
if (!$stmt->execute()) {
    returnWithError($stmt->error);
    exit();
}

if ($stmt->affected_rows > 0) {
    $stmt->close();
    $conn->close();
    returnWithSuccess("Contact deleted successfully");
} else {
    $stmt->close();
    $conn->close();
    returnWithError("Contact not found");
}

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
