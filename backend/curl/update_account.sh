curl \
    -H 'Auth: admin:c7ad44cbad762a5da0a452f9e854fdc1e0e7a52a38015f23f3eab1d80b931dd472634dfac71cd34ebc35d16ab7fb8a90c81f975113d6c7538dc69dd8de9077ec' \
    -d '{"id":1,"username":"abc","password":"def","domain":"sdfsd.de","quota":201,"enabled":0,"sendonly":1}' \
    '127.0.0.1:8080/backend/src/index.php?res=accounts&action=update'