<?php
declare(strict_types=1);

$recipientEmail = 'service@flowcoreplumbing.com';
$companyName = 'FlowCore Plumbing';
$allowedServices = [
    'Residential Plumbing',
    'Commercial Plumbing',
    'Drain Cleaning',
    'Water Heater Service',
    'Sewer Line Repair',
    'Fixture Installation',
];

function wants_json(): bool
{
    $accept = $_SERVER['HTTP_ACCEPT'] ?? '';
    $requestedWith = $_SERVER['HTTP_X_REQUESTED_WITH'] ?? '';
    return stripos($accept, 'application/json') !== false || strtolower($requestedWith) === 'xmlhttprequest';
}

function clean_text(string $value, int $limit): string
{
    $value = trim($value);
    $value = str_replace(["\r\n", "\r"], "\n", $value);
    $value = preg_replace('/[^\P{C}\n\t]+/u', '', $value) ?? '';
    return substr($value, 0, $limit);
}

function clean_header(string $value, int $limit): string
{
    return substr(str_replace(["\r", "\n"], ' ', trim($value)), 0, $limit);
}

function respond(bool $ok, string $message, int $status = 200): void
{
    http_response_code($status);
    if (wants_json()) {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['ok' => $ok, 'message' => $message], JSON_UNESCAPED_SLASHES);
        exit;
    }

    $title = $ok ? 'Request received' : 'Request not sent';
    $safeTitle = htmlspecialchars($title, ENT_QUOTES, 'UTF-8');
    $safeMessage = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');
    echo "<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"><title>{$safeTitle}</title><link rel=\"stylesheet\" href=\"assets/css/styles.css\"></head><body><main class=\"section\"><div class=\"container article\"><h1 style=\"color: var(--ink);\">{$safeTitle}</h1><p>{$safeMessage}</p><p><a class=\"btn\" href=\"contact.html\">Back to contact</a></p></div></main></body></html>";
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(false, 'This endpoint accepts form submissions only.', 405);
}

if (!empty($_POST['company_website'] ?? '')) {
    respond(true, 'Thank you. Your request was received.');
}

$name = clean_header((string)($_POST['name'] ?? ''), 120);
$phone = clean_header((string)($_POST['phone'] ?? ''), 80);
$email = clean_header((string)($_POST['email'] ?? ''), 180);
$service = clean_header((string)($_POST['service'] ?? ''), 80);
$message = clean_text((string)($_POST['message'] ?? ''), 3000);

$errors = [];
if ($name === '') $errors[] = 'Please enter your name.';
if ($phone === '') $errors[] = 'Please enter your phone number.';
if ($message === '') $errors[] = 'Please describe the plumbing issue.';
if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'Please enter a valid email address.';
if (!in_array($service, $allowedServices, true)) $service = 'Plumbing Request';

if ($errors) {
    respond(false, implode(' ', $errors), 422);
}

$submittedAt = date('Y-m-d H:i:s T');
$ip = $_SERVER['REMOTE_ADDR'] ?? 'Unknown';
$subject = "{$companyName} request: {$service}";
$body = implode("\n", [
    "New provider match request",
    "",
    "Name: {$name}",
    "Phone: {$phone}",
    "Email: " . ($email !== '' ? $email : 'Not provided'),
    "Service: {$service}",
    "Submitted: {$submittedAt}",
    "IP: {$ip}",
    "",
    "Message:",
    $message,
    "",
]);

$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'From: Website Request <no-reply@' . ($_SERVER['SERVER_NAME'] ?? 'localhost') . '>',
];
if ($email !== '') {
    $headers[] = "Reply-To: {$email}";
}

$sent = mail($recipientEmail, $subject, $body, implode("\r\n", $headers));
if (!$sent) {
    respond(false, 'We could not send your request online. Please call or email the priority line directly.', 500);
}

respond(true, 'Thank you. Your request was received.');
