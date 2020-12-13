<?php
header('Access-Control-Allow-Origin: *');

$to      = 'gorodamnet@clevergrad.ru';
$subject = 'Обратный звонок с gorodam.net - '.$_POST['phone'];
$headers = 'From: no-reply@gorodam.net'."\r\n".'X-Mailer: PHP/'.phpversion();

$message = implode("\r\n", $_POST);

$res = mail($to, $subject, $message, $headers);

if ($res) {
    echo "success";
    return;
}

echo "error";