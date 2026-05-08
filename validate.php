<?php
header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $input = json_decode(file_get_contents('php://input'), true);
    $phone = $_POST['phone'] ?? $input['phone'] ?? '';
    $phone = preg_replace('/[^0-9+]/', '', $phone);
    if (str_starts_with($phone, '00')) {
        $phone = '+' . substr($phone, 2);
    }
    $masterRegex = "/^\+(222[0-9]{8}|212[0-9]{9}|213[0-9]{9}|216[0-9]{8}|218[0-9]{9})$/";
    if (preg_match($masterRegex, $phone)) {
        echo json_encode([
            "status" => "success",
            "message" => "Accès autorisé pour le Maghreb",
            "number" => $phone
        ]);
    } else {
        http_response_code(403);
        echo json_encode([
            "status" => "denied",
            "message" => "Cet indicateur est formellement interdit."
        ]);
    }
} else {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Méthode non autorisée"]);
}
?>