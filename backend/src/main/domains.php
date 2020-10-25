<?php

function domains(string $action, $db) {


    if($action === 'get') {

        $adminAccount = getAdminUser($db);

        $stmt = $db->prepare("SELECT * FROM domains WHERE id IN (SELECT domain FROM `domainaccess` WHERE user = :userid);");
        $stmt->bindParam(':userid', $userid);
        $userid = $adminAccount->id;

        
        
        if($stmt->execute()) {
            $rows = $stmt->fetchAll(PDO::FETCH_OBJ);
            echo(json_encode($rows));
        } else {
            echo($stmt->errorInfo()[2]);
        }

    }

}
?>