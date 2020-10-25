<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Headers: *');

$config = include('config.php');

$db = new PDO('mysql:host='.$config['db_host'].';dbname='.$config['db_vmail'], $config['db_user'], $config['db_pw']);

include('auth.php');
include('main/accounts.php');
include('main/domains.php');
include('main/aliases.php');

if(isset($_SERVER['HTTP_AUTH'])) {
    $auth_raw = $_SERVER['HTTP_AUTH'];
    if(isAuthenticated($auth_raw, $db)) {

        if(isset($_GET["res"])) {
            $res = $_GET["res"];
            if(isset($_GET["action"])) {
                $action = $_GET["action"];

                if($res === "accounts") {
                    accounts($action, $db);
                }

                if($res === "domains") {
                    domains($action, $db);
                }

                if($res === "aliases")  {
                    aliases($action, $db);
                }
        
            } else {
                echo("action missing");
            }
        } else {
            echo("res is missing");
        }

    } else {
        http_response_code(401);
        echo("not authorized");
    }

} else {
    echo("auth header missing");
}


?>