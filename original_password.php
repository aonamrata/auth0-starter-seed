<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$phrase = 'KmU2NNy53wSJ';
$key = 'Alw';

//prevent guessing
if (is_null($phrase)) {
    throw new Exception("Cannot hash zero-length phrase.");
}
$salt = "be5axu7u2ev5jeTuraprUsp4brap8us";;
if (is_null($key)) {
    $key = "";
}
$reHashCount = 97;
$outputHash = $phrase;
//perform key lengthening
for ($i = 0; $i < $reHashCount; $i ++) {

    $outputHash = hash('sha512', $outputHash . $salt . $key);
    echo "\n mid=".$outputHash;
}
echo "\n end";
print_R($outputHash);
