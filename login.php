<?php
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
  ]);

  $auth0->login();