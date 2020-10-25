<?php

function getAdminUser($db) {
    $auth_parts = getAuthHeaderParts();
    return getAdminUserByUsername($auth_parts[0], $db);
}

function getAuthHeaderParts() {
    $auth_raw = $_SERVER['HTTP_AUTH'];
    return explode(':', $auth_raw);
}

function getAdminUserByUsername($username, $db) {
    $stmt = $db->prepare("SELECT * FROM adminuser WHERE us = :username");
    $stmt->bindParam(':username', $usern);
    $usern = $username;

    if($stmt->execute()) {
        while($row = $stmt->fetch(PDO::FETCH_OBJ)) {
            return $row;
        }
    }

    return false;
}

function isAuthenticated(string $header, $db) {
    $parts = explode(':', $header);
    $adminuser = getAdminUserByUsername($parts[0], $db);
    
    if($adminuser != false && $adminuser->pw === $parts[1]) {
        return true;
    }
    return false;

}

function isDomainAllowedForAccount($domain, $db) {
    $authParts = getAuthHeaderParts();
    $adminUser = getAdminUserByUsername($authParts[0], $db);

    $stmt = $db->prepare("SELECT * FROM domains WHERE domain = :domain;");
    $stmt->bindParam(':domain', $dom);
    $dom = $domain;
    
    $domainObj = NULL;

    if($stmt->execute()) {
        while($row = $stmt->fetch(PDO::FETCH_OBJ)) {
            $domainObj = $row;
        }
    } else {
        echo($stmt->errorInfo()[2]);
    }

    if($domainObj == NULL) {
        return false;
    }

    $stmt = $db->prepare("SELECT * FROM domainaccess WHERE user = :userid AND domain = :domainid");
    $stmt->bindParam(':userid', $userid_bind);
    $stmt->bindParam(':domainid', $domainid_bind);


    $userid_bind = $adminUser->id;
    $domainid_bind = $domainObj->id;

    if($stmt->execute()) {
        while($row = $stmt->fetch()) {
            return true;
        } 
    } else {
        echo($stmt->errorInfo()[2]);
    }

    return false;

}

?>