<?php
require_once __DIR__ . '/config.php';
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    header('Content-Type: application/json');

    $input = json_decode(file_get_contents('php://input'), true);
    $phone = $_POST['phone'] ?? $input['phone'] ?? '';
    $phone = preg_replace('/[^0-9+]/', '', $phone);
    
    if (str_starts_with($phone, '00')) {
        $phone = '+' . substr($phone, 2);
    }
    $masterRegex = "/^\+(222[0-9]{8}|212[0-9]{9}|213[0-9]{9}|216[0-9]{8}|218[0-9]{9})$/";
    $isValid = preg_match($masterRegex, $phone);
    if ($isValid) {
        $status = 'success';
        $message = 'Accès autorisé pour le Maghreb';
        $responseCode = 200;
    } else {
        $status = 'error';
        $message = 'Cet indicateur est formellement interdit.';
        $responseCode = 403;
    }
    logPhoneValidation($phone, $status, $message);
    http_response_code($responseCode);
    echo json_encode([
        "status" => $status,
        "message" => $message,
        "number" => $phone
    ]);
    exit();
}
if ($_SERVER["REQUEST_METHOD"] === "GET" && isset($_GET['action']) && $_GET['action'] === 'history') {
    header('Content-Type: application/json');
    $logs = getPhoneLogsHistory(100);
    echo json_encode($logs);
    exit();
}
header('Content-Type: text/html; charset=UTF-8');
readfile(__DIR__ . '/index.html');
?>