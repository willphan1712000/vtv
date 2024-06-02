<?php
class Router {
    private $routes = [];

    function addRoute($uri, $controller) {
        $this->routes[] = [
            'uri' => $uri,
            'controller' => $controller
        ];
    }

    function route($uri) {
        foreach($this->routes as $route) {
            if($route['uri'] === $uri) {
                return require $route['controller'];
            }
        }

        $this->abort();
    }

    private function abort() {
        http_response_code(404);
        require 'dist/404.php';
        die();
    }

    function removeLastRoute() {
        array_pop($this->routes);
    }
}

class SystemConfig {
    public static function globalVariables() {
        return [
            'v' => self::getVersion(),
            'license' => '© '.date("Y").' Allinclicks. All rights reserved. Version: '.self::getVersion(),
            'sessionDuration' => 60 * 10,
            'multiImgMax' => 30,
            'multiVideoMax' => 2,
            'title' => self::getCurrentDir(),
            'maxVideoDuration' => 60,
        ];
    }

    public static function getVersion() {
        return 6.21;
    }

    public static function getCurrentDir() {
        return basename(dirname(__DIR__));
    }
    
    // dump and die function used for debug process
    public static function dd($value) {
        echo "<pre>";
        var_dump($value);
        echo "</pre>";
    
        die();
    }
    
    public static function isPassVaild($password) {
        $isLengthValid = false;
        $hasUpperCase = false;
        $hasDigit = false;
        $hasSpecialChar = true; // Bypass special character requirement
        $isLengthValid = (strlen($password) >= 12) ? true : false;
        for($i = 0; $i < strlen($password); $i++) {
            $position = ord($password[$i]); // Get ASCII Value
            if($position >= 65 && $position <= 90) {
                $hasUpperCase = true;
            }
            if($position >= 48 && $position <= 57) {
                $hasDigit = true;
            }
            if($position >= 33 && $position <= 47) {
                $hasSpecialChar = true;
            }
            if($hasUpperCase && $hasDigit && $hasSpecialChar) {
                return true;
            }
        }
    }
}
class Database {
    private static $servername = "localhost:3306";
    // private static $username = "root";
    // private static $password = "";
    private static $username = "allincli_ssadmin";
    private static $password = "123456"; // Default password used by Allinclicks
    public static function databaseName() {
        return "allincli_vtv_".str_replace('.','_',basename(dirname(__DIR__)));
    }
    public static function connection() {
        return mysqli_connect(self::$servername, self::$username, self::$password, self::databaseName());
    }
}
?>