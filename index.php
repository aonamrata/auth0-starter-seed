<?php

  // Require composer autoloader
  require __DIR__ . '/vendor/autoload.php';

  require __DIR__ . '/dotenv-loader.php';

  use Auth0\SDK\Auth0;

  $domain        = getenv('AUTH0_DOMAIN');
  $client_id     = getenv('AUTH0_CLIENT_ID');
  $client_secret = getenv('AUTH0_CLIENT_SECRET');
  $redirect_uri  = getenv('AUTH0_CALLBACK_URL');
  $audience      = getenv('AUTH0_AUDIENCE');

  if($audience == ''){
    $audience = 'https://' . $domain . '/userinfo';
  }

  $auth0 = new Auth0([
   'domain' => 'orch-labs.auth0.com',
  'client_id' => 'fLUjCyXeJsoOLgNGxZBz12TLfsFMWEQa',
  'client_secret' => 'yF3Q74pdO3Fy5khu9XWvPGMaZTjxrV4MkLYoBOal3zCyhDRNWXHovYQoWaE0hbsx',
  'redirect_uri' => 'http://localhost:3003/index.php',
  'audience' => 'https://orch-labs.auth0.com/userinfo',
  'scope' => 'openid profile',
  'persist_id_token' => true,
  'persist_access_token' => true,
  'persist_refresh_token' => true,
      "realm" => "art-relations",
      "database" => "art-relations"
  ]);


  $userInfo = $auth0->getUser();


?>
<html>
    <head>
        <script src="http://code.jquery.com/jquery-3.1.0.min.js" type="text/javascript"></script>

        <meta name="viewport" content="width=device-width, initial-scale=1">

        <!-- font awesome from BootstrapCDN -->
        <link href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" rel="stylesheet">
        <link href="//maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css" rel="stylesheet">

        <link href="public/app.css" rel="stylesheet">



    </head>
    <body class="home">
        <div class="container">
            <div class="login-page clearfix">
              <?php if(!$userInfo): ?>
              <div class="login-box auth0-box before">
                <img src="http://www.theorchard.com/wp-content/themes/skm-framework/assets/images/orchard-dark.svg" width="20%" />
                <h3>Orchard index page that does login and logged in both.</h3>
                <a id="qsLoginBtn" class="btn btn-primary btn-lg btn-login" href="login.php">Sign In</a>
              </div>
              <?php else: ?>
              <div class="logged-in-box auth0-box logged-in">
                <h1 id="logo"><img src="http://www.theorchard.com/wp-content/themes/skm-framework/assets/images/orchard-dark.svg" width="20%" /></h1>
                <img class="avatar" src="<?php echo $userInfo['picture'] ?>"  width="100px" />
                <h2>Welcome <span class="nickname"><?php echo $userInfo['nickname'] ?></span></h2>
                <a id="qsLogoutBtn" class="btn btn-warning btn-logout" href="/logout.php">Logout</a>
              </div>
                <p>
              <?php
              print_R($userInfo);
              endif ?>
                </p>
            </div>
        </div>
    </body>
</html>
