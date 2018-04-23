<?php

// get the HTTP method, path and body of the request
$method = $_SERVER['REQUEST_METHOD'];
$request = explode('/', trim($_SERVER['PATH_INFO'], '/'));

// connect to the mysql database
$link = mysqli_connect('localhost:3306', 'root', '123456', 'db_personagens');
mysqli_set_charset($link, 'utf8');

// retrieve the table and key from the path
$table = $request[0];
$key = sizeof($request) > 1 ? $request[1] : null;


// create SQL based on HTTP method
if ($method == 'GET') {
    $sql = "Select * from `$table` WHERE nome like '%$key%' ";
}

// execute SQL statement
$result = mysqli_query($link, $sql);

// die if SQL statement failed
if (!$result) {
    http_response_code(404);
    die(mysqli_error());
}

// print results, insert id or affected row count
if ($method == 'GET') {
    if (mysqli_num_rows($result) > 0)
        echo '[';
    for ($i = 0; $i < mysqli_num_rows($result); $i++) {
        echo ($i > 0 ? ',' : '') . json_encode(mysqli_fetch_object($result));
    }
    if (mysqli_num_rows($result) > 0)
        echo ']';
}

// close mysql connection
mysqli_close($link);


