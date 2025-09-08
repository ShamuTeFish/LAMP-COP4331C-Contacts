
<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$inData = getRequestInfo();

// Validate required fields
if (!isset($inData["login"]) || !isset($inData["password"])) {
    returnWithError("Login and password are required");
    exit();
}

$conn = new mysqli("localhost", "TheBeast", "COP##4331C", "COP4331"); 	
if ($conn->connect_error) {
    returnWithError($conn->connect_error);
    exit();
}

$stmt = $conn->prepare("SELECT Id, first_name, last_name FROM Users WHERE login = ? AND password = ?");
if (!$stmt) {
    returnWithError($conn->error);
    exit();
}

$stmt->bind_param("ss", $inData["login"], $inData["password"]);
if (!$stmt->execute()) {
    returnWithError("Login failed: " . $stmt->error);
    exit();
}

$result = $stmt->get_result();
if ($row = $result->fetch_assoc()) {
    returnWithInfo($row['first_name'], $row['last_name'], $row['Id']);
} else {
    returnWithError("Invalid login credentials");
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
    $retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}

function returnWithInfo($firstName, $lastName, $id)
{
    $retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
    sendResultInfoAsJson($retValue);
}
	
?>
