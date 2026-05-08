<?php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'maghreb_validator');

function getDB() {
    $db = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    if ($db->connect_error) die("Erreur BDD");
    $db->set_charset("utf8mb4");
    return $db;
}

function logPhoneValidation($phone, $status, $msg) {
    $db = getDB();
    $stmt = $db->prepare("INSERT INTO phone_logs (phone_number, status, message) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $phone, $status, $msg);
    $res = $stmt->execute();
    $db->close();
    return $res;
}
function getPhoneLogsHistory($limit = 50) {
    $db = getDB();
    $res = $db->query("SELECT * FROM phone_logs ORDER BY created_at DESC LIMIT ".intval($limit));
    $logs = $res->fetch_all(MYSQLI_ASSOC);
    $db->close();
    return $logs;
}
?>