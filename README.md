# NanoMailAdmin

todo

# Develop

## Backend

For developing on the backend you need a php Webserver and a Mysql database running.
You can use a docker image which provides this feature.
For example this one (assuming you are currently in the root directory of this repository):

```
docker run -d -p 8080:80 -p 3306:3306 -v $PWD:/var/www/html mrxder/docker-apache-php7.2-mysql-phpmyadmin

```

Now you can load the default database schema which you can find in backend/dev_db.sql.
To do this you can use phpmyadmin which you can reach over http://127.0.0.1:8080/phpmyadmin.
The default login is devroot:123.
