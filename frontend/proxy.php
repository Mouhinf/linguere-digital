<?php
error_reporting(0);

$path = isset($_SERVER['PATH_INFO']) ? $_SERVER['PATH_INFO'] : '';
if ($path === '' || $path === '/') {
    http_response_code(404);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'API endpoint not found']);
    exit;
}

$qs = isset($_SERVER['QUERY_STRING']) && $_SERVER['QUERY_STRING'] !== '' ? ('?' . $_SERVER['QUERY_STRING']) : '';
$method = $_SERVER['REQUEST_METHOD'];
$url = 'http://127.0.0.1:PORT_PLACEHOLDER/api' . $path . $qs;

$forwardHeaders = [];
$skip = ['host', 'content-length', 'transfer-encoding', 'connection', 'accept-encoding'];
if (function_exists('getallheaders')) {
    foreach (getallheaders() as $name => $value) {
        if (!in_array(strtolower($name), $skip)) {
            $forwardHeaders[] = "$name: $value";
        }
    }
}
$clientIp = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? '';
if ($clientIp) {
    $forwardHeaders[] = "X-Forwarded-For: $clientIp";
}
$headerStr = implode("\r\n", $forwardHeaders);

$opts = [
    'http' => [
        'method' => $method,
        'ignore_errors' => true,
        'timeout' => 30,
        'header' => $headerStr,
    ]
];
if ($method === 'POST' || $method === 'PUT' || $method === 'PATCH') {
    $body = file_get_contents('php://input');
    $opts['http']['content'] = $body;
}

$context = stream_context_create($opts);
$response = @file_get_contents($url, false, $context);
if ($response === false) {
    http_response_code(502);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Backend unavailable']);
    exit;
}
$status_line = $http_response_header[0] ?? '';
preg_match('{\b(\d{3})\b}', $status_line, $m);
$code = intval($m[1] ?? 200);
http_response_code($code);
header('Content-Type: application/json');
echo $response;
