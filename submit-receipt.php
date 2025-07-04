<?php
header('Content-Type: application/json');

$nome     = $_POST['nome']     ?? '';
$cognome  = $_POST['cognome']  ?? '';
$indirizzo = $_POST['indirizzo'] ?? '';
$cap      = $_POST['cap']      ?? '';
$citta    = $_POST['citta']    ?? '';
$email    = $_POST['email']    ?? '';
$file     = $_FILES['screenshot'] ?? null;

// Validate
if (!$nome || !$cognome || !$indirizzo || !$cap || !$citta || !$email || !$file) {
    echo json_encode(['success' => false, 'message' => 'Tutti i campi sono obbligatori']);
    exit;
}

// File upload
$uploadDir = __DIR__ . '/uploads/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

$filename = 'receipt-' . time() . '-' . basename($file['name']);
$targetPath = $uploadDir . $filename;

if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
    echo json_encode(['success' => false, 'message' => 'Errore nel salvataggio della ricevuta']);
    exit;
}

// Save to DB
try {
    $pdo = new PDO('mysql:host=localhost;dbname=promo_giveaway;charset=utf8mb4', 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $pdo->prepare('INSERT INTO participants (nome, cognome, indirizzo, cap, citta, email, receipt_filename) VALUES (?, ?, ?, ?, ?, ?, ?)');
    $stmt->execute([$nome, $cognome, $indirizzo, $cap, $citta, $email, $filename]);

    // Send email via Node.js
    $response = sendEmailViaNode($email, $nome, $cognome);

    echo json_encode([
        'success' => true,
        'message' => $response['success']
            ? 'Grazie per aver partecipato! Controlla la tua email. 👀'
            : 'Partecipazione registrata, ma email non inviata.',
        'participantId' => $pdo->lastInsertId()
    ]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Errore server: ' . $e->getMessage()]);
}

function sendEmailViaNode($email, $nome, $cognome) {
    $url = 'http://localhost:3001/send-mail'; // change if hosted elsewhere
    $payload = json_encode([
        'email'   => $email,
        'nome'    => $nome,
        'cognome' => $cognome
    ]);

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST           => true,
        CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
        CURLOPT_POSTFIELDS     => $payload
    ]);

    $result = curl_exec($ch);
    $err    = curl_error($ch);
    curl_close($ch);

    if ($err || !$result) {
        return ['success' => false];
    }

    return json_decode($result, true);
}