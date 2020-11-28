<?php

$to      = 'm@elorle.ru';
$subject = 'Обратный звонок с лендинга';
$headers = 'From: mail-from@gmail.com'."\r\n".'X-Mailer: PHP/'.phpversion();

$message = implode("\r\n", $_POST);

$res = mail($to, $subject, $message, $headers);

if ($res) {
    echo "success";
    return;
}

echo "error";