<?php

function aliases(string $action, $db) {

    if($action === 'get') {

        if(isset($_GET['domain'])) {
            if(isDomainAllowedForAccount($_GET['domain'], $db)) {
                $stmt = $db->prepare("SELECT * FROM aliases WHERE source_domain = :domain");
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
        $alias = json_decode($body);

        if(isDomainAllowedForAccount($alias->source_domain, $db)) {
            $stmt = $db->prepare("UPDATE aliases SET "
            ."source_username = :source_username, "
            ."source_domain = :source_domain, "
            ."destination_username = :destination_username, "
            ."destination_domain = :destination_domain, "
            ."enabled = :enabled "
            ."WHERE id = :id;");

            $stmt->bindParam(':source_username', $source_username);
            $stmt->bindParam(':source_domain', $source_domain);
            $stmt->bindParam(':destination_username', $destination_username);
            $stmt->bindParam(':destination_domain', $destination_domain);
            $stmt->bindParam(':enabled', $enabled);
            $stmt->bindParam(':id', $id);

            $source_username = $alias->source_username;
            $source_domain = $alias->source_domain;
            $destination_username = $alias->destination_username;
            $destination_domain = $alias->destination_domain;
            $enabled = $alias->enabled;
            $id = $alias->id;



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
        $alias = json_decode($body);

        if(isDomainAllowedForAccount($alias->source_domain, $db)) {
            $stmt = $db->prepare("INSERT INTO aliases "
            ."(source_username, source_domain, destination_username, destination_domain, enabled)"
            ."VALUES"
            ."(:source_username, :source_domain, :destination_username, :destination_domain, :enabled);"
            );

            $stmt->bindParam(':source_username', $source_username);
            $stmt->bindParam(':source_domain', $source_domain);
            $stmt->bindParam(':destination_username', $destination_username);
            $stmt->bindParam(':destination_domain', $destination_domain);
            $stmt->bindParam(':enabled', $enabled);

            $source_username = $alias->source_username;
            $source_domain = $alias->source_domain;
            $destination_username = $alias->destination_username;
            $destination_domain = $alias->destination_domain;
            $enabled = $alias->enabled;


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
        $alias = json_decode($body);

        if(isDomainAllowedForAccount($alias->source_domain, $db)) {
            $stmt = $db->prepare("DELETE FROM aliases WHERE id = :id");
            $stmt->bindParam(':id', $alias->id);
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