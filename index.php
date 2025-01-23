<?php
require_once "data/core.php";
// SystemConfig::dd(Database::connection());
$conn = Database::connection();

$uri = parse_url($_SERVER['REQUEST_URI'])['path'];

$router = new Router();
$router->addRoute('/','dist/index.php');
$router->addRoute('/admin','dist/admin.php');
$router->addRoute('/admin/','dist/admin.php');
$router->addRoute('/aicadmin','dist/aicindex.php');
$router->addRoute('/aicadmin/','dist/aicindex.php');
$router->addRoute('/aic','dist/aicadmin.php');
$router->addRoute('/aic/','dist/aicadmin.php');
$router->addRoute('/expire','dist/sessionExpired.php');
$router->addRoute('/expire/','dist/sessionExpired.php');
$router->addRoute('/logout','dist/logOutPage.php');
$router->addRoute('/logout/','dist/logOutPage.php');
$router->addRoute('/tv','dist/tv.php');
$router->addRoute('/tv/','dist/tv.php');
$router->addRoute('/subsTerminated','dist/subsTerminated.php');
$router->addRoute('/subsTerminated/','dist/subsTerminated.php');
$router->route($uri);