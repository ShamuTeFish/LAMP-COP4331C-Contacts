<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$inData = getRequestInfo();

// Validate required fields
if (!isset($inData["login"]) || !isset($inData["password"]) || !isset($inData["first_name"]) || !isset($inData["last_name"])) {
    returnWithError("All fields are required: login, password, first_name, last_name");
    exit();
}

$login = $inData["login"];
$password = $inData["password"];
$firstName = $inData["first_name"];
$lastName = $inData["last_name"];



// Database connection
$conn = new mysqli("localhost", "TheBeast", "COP##4331C", "COP4331");
if ($conn->connect_error) 
{
    returnWithError($conn->connect_error);
} 
else
{
    // Check if the login already exists
    $checkStmt = $conn->prepare("SELECT login FROM Users WHERE login = ?");
    $checkStmt->bind_param("s", $login);
    $checkStmt->execute();
    $result = $checkStmt->get_result();

    if ($result->num_rows > 0) {
        $checkStmt->close();
        $conn->close();
        returnWithError("Login already exists");
        exit();
    }
    $checkStmt->close();

    
    $stmt = $conn->prepare("INSERT INTO Users (first_name, last_name, login, password) VALUES(?, ?, ?, ?)");
    if (!$stmt) {
        returnWithError($conn->error);
    } else
    {
        $stmt->bind_param("ssss", $firstName, $lastName, $login, $password);
        if (!$stmt->execute()) {
            if ($conn->errno == 1062) { 
                returnWithError("Login already exists");
            } else {
                returnWithError($stmt->error);
            }
        } else {
            $stmt->close();

            //Frontend needs to keep track of newly registered user's ID
            $idStmt = $conn->prepare("SELECT Id FROM Users WHERE Login =? AND Password =?");
            $idStmt->bind_param("ss", $inData["login"], $inData["password"]);
            $idStmt->execute();
            $result = $idStmt->get_result();

            $row = $result->fetch_assoc();
            returnWithInfo($row['Id']);
            $idStmt->close();
            $conn->close();
        }
    }
    
}

// Function to get JSON input
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

// Function to send JSON response
function sendResultInfoAsJson($obj)
{
    header('Content-type: application/json');
    echo $obj;
}

// Function to return error messages
function returnWithError($err)
{
    $retValue = '{"error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}

function returnWithInfo($id)
{
    $retValue = '{"id":' . $id . ',"error":""}';
    sendResultInfoAsJson($retValue);
}
?>