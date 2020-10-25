<?php

function accounts(string $action, $db) {
    
    if($action === 'get') {

        if(isset($_GET['domain'])) {
            if(isDomainAllowedForAccount($_GET['domain'], $db)) {
                $stmt = $db->prepare("SELECT * FROM accounts WHERE domain = :domain");
                $stmt->bindParam(':domain', $domain);
                $domain = $_GET['domain'];

                $stmt->setFetchMode(PDO::FETCH_OBJ);
                if($stmt->execute()) {
                    $rows = $stmt->fetchAll();
                    echo(json_encode($rows));
                }

            } else {
                echo("No access to domain");
            }
        }

        

    }

    if($action === 'update') {
        $body = file_get_contents('php://input');
        $account = json_decode($body);

        if(isDomainAllowedForAccount($account->domain, $db)) {
            $stmt = $db->prepare("UPDATE accounts SET "
            ."username = :username, "
            ."domain = :domain, "
            ."password = :password, "
            ."quota = :quota, "
            ."enabled = :enabled, "
            ."sendonly = :sendonly "
            ."WHERE id = :id;");

            $stmt->bindParam(':username', $username);
            $stmt->bindParam(':domain', $domain);
            $stmt->bindParam(':password', $password);
            $stmt->bindParam(':quota', $quota);
            $stmt->bindParam(':enabled', $enabled);
            $stmt->bindParam(':sendonly', $sendonly);
            $stmt->bindParam(':id', $id);

            $username = $account->username;
            $domain = $account->domain;
            $password = $account->password;
            $quota = $account->quota;
            $enabled = $account->enabled;
            $sendonly = $account->sendonly;
            $id = $account->id;



            if($stmt->execute()) {
                echo("ok");
            } else {
            echo($stmt->errorInfo()[2]);
            }
        } else {
            echo("No access to domain");
        }
        


    }

    if($action === 'insert') {
        $body = file_get_contents('php://input');
        $account = json_decode($body);

        if(isDomainAllowedForAccount($account->domain, $db)) {
            $stmt = $db->prepare("INSERT INTO accounts "
            ."(username, domain, password, quota, enabled, sendonly)"
            ."VALUES"
            ."(:username, :domain, :password, :quota, :enabled, :sendonly);"
            );

            $stmt->bindParam(':username', $username);
            $stmt->bindParam(':domain', $domain);
            $stmt->bindParam(':password', $password);
            $stmt->bindParam(':quota', $quota);
            $stmt->bindParam(':enabled', $enabled);
            $stmt->bindParam(':sendonly', $sendonly);

            $username = $account->username;
            $domain = $account->domain;
            $password = $account->password;
            $quota = $account->quota;
            $enabled = $account->enabled;
            $sendonly = $account->sendonly;


            if($stmt->execute()) {
                echo("ok");
            } else {
            echo($stmt->errorInfo()[2]);
            }

        } else {
            echo('Domain not allowed for domain');
        }

    }

    if($action === 'delete') {
        $body = file_get_contents('php://input');
        $account = json_decode($body);

        if(isDomainAllowedForAccount($account->domain, $db)) {
            $stmt = $db->prepare("DELETE FROM accounts WHERE id = :id");
            $stmt->bindParam(':id', $account->id);
            if($stmt->execute()) {
                echo("ok");
            } else {
                echo($stmt->errorInfo()[2]);
            }
        } else {
            echo("Domain not allowed for account");
        }
    }

}

?>