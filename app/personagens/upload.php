<?php

if (!empty($_FILES)) {
    $request = explode('/', trim($_SERVER['PATH_INFO'], '/'));
    $name = $request[0];
    $path = 'imagens/' . $name;
    if (!(move_uploaded_file($_FILES['file']['tmp_name'], $path))) {
        echo "Não foi possível concluir a operação.";
    }
} else {
    echo 'Não foi possível realizar a operação.';
}
?>  
