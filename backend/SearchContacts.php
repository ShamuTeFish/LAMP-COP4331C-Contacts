<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$inData = getRequestInfo();

// Validate required fields
if (!isset($inData["userId"]) || !isset($inData["search"])) {
    returnWithError("userId and search are required");
    exit();
}

$searchResults = "";
$searchCount = 0;

$conn = new mysqli("localhost", "TheBeast", "COP##4331C", "COP4331");
if ($conn->connect_error) {
    returnWithError($conn->connect_error);
    exit();
}

$stmt = $conn->prepare("SELECT Id, first_name, last_name, email, phone FROM Contacts WHERE userId=? AND (first_name LIKE ? OR last_name LIKE ? OR email LIKE ? OR phone LIKE ?)");
if (!$stmt) {
    returnWithError($conn->error);
    exit();
}

$searchTerm = "%" . $inData["search"] . "%";
$stmt->bind_param("issss", $inData["userId"], $searchTerm, $searchTerm, $searchTerm, $searchTerm);

if (!$stmt->execute()) {
    returnWithError("SQL Execution Error: " . $stmt->error);
    exit();
}

$result = $stmt->get_result();

while($row = $result->fetch_assoc()) {
    if ($searchCount > 0) {
        $searchResults .= ",";
    }
    $searchCount++;
    $searchResults .= '{"id":' . $row["Id"] . ',"firstName":"' . $row["first_name"] . '","lastName":"' . $row["last_name"] . '","email":"' . $row["email"] . '","phone":"' . $row["phone"] . '"}';
}

if ($searchCount == 0) {
    returnWithError("No Records Found");
} else {
    returnWithInfo($searchResults);
}

$stmt->close();
$conn->close();

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
    $retValue = '{"results":[],"error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}

function returnWithInfo($searchResults)
{
    $retValue = '{"results":[' . $searchResults . '],"error":""}';
    sendResultInfoAsJson($retValue);
}
	
?>
