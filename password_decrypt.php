<?php
error_reporting(E_ALL);

class Crypto
{

//    private $encryptKey = 'MySecretKey12345';
//    private $iv = '1234567890123456';
    private $encryptKey = 'ezRTZaPUkr0XqEib';
    private $iv = 't4QKb1xx7tKRAluu';
    private $blocksize = 16;

    public function decrypt($data)
    {
        return $this->unpad(mcrypt_decrypt(MCRYPT_RIJNDAEL_128, $this->encryptKey, hex2bin($data), MCRYPT_MODE_CBC,
                                                                                           $this->iv), $this->blocksize);
    }

    public function encrypt($data)
    {
        //don't use default php padding which is '\0'
        $pad = $this->blocksize - (strlen($data) % $this->blocksize);
        $data = $data . str_repeat(chr($pad), $pad);
        return bin2hex(mcrypt_encrypt(MCRYPT_RIJNDAEL_128, $this->encryptKey, $data, MCRYPT_MODE_CBC, $this->iv));
    }

    private function unpad($str, $blocksize)
    {
        $len = mb_strlen($str);
        $pad = ord($str[$len - 1]);
        if ($pad && $pad < $blocksize) {
            $pm = preg_match('/' . chr($pad) . '{' . $pad . '}$/', $str);
            if ($pm) {
                return mb_substr($str, 0, $len - $pad);
            }
        }
        return $str;
    }

}

$crypto = new Crypto();
$text = 'plain text';
//$encrypted = $crypto->encrypt($text);
////$encrypted = '9eb6c9052d1de4474fb52d829360d5af';
//echo "Encrypted: " . $encrypted . "\n";

$encrypted = '58b24d58b3dea8aeed591b0a6b756263';
$decrypted = $crypto->decrypt($encrypted);
echo "Decrypted: $decrypted\n";


$encryptKey = 'ezRTZaPUkr0XqEib';
$iv = 't4QKb1xx7tKRAluu';

$decrypt2 = openssl_decrypt ( hex2bin($encrypted) , "aes-256-cbc" , $encryptKey , OPENSSL_RAW_DATA, $iv);
echo "Decrypted: $decrypt2\n";
echo openssl_error_string();
