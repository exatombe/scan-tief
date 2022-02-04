# Scan-Tief

Scan-Tief est une application développé avec react-native afin de lire des manga, manhua, manhwa gratuitement !

## Installation

- [#ANDROID](Android)

- [#](IOS)

## ANDROID

L'installation sur android ce passe comme suit :
Installé au préalalble pour Window
- [https://redirector.gvt1.com/edgedl/android/studio/install/2021.1.1.21/android-studio-2021.1.1.21-windows.exe](Android Studio) 

- [https://nodejs.org/dist/v16.13.2/node-v16.13.2-x64.msi](NodeJs)

Depuis un CMD/PowerShell(Terminal) effectuer
```bash
npm i -g yarn
yarn install
```
(Si vous n'utilisez pas yarn, des problèmes de compatibilité pourrais survenir)

Suite à ça effectué les manipulation suivantes comme indiqué sur la documentation react native :

[https://reactnative.dev/docs/environment-setup](https://reactnative.dev/docs/environment-setup)

Vous devrez effectué cette manipulation en supplément si vous souhaitez démarré l'application en mode "release" sur votre téléphone : 

Depuis un terminal à nouveau :

```bash
keytool -genkeypair -v -storetype PKCS12 -keystore my-upload-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```
Vous devez generé une clé de signature, cette commande en crée une avec une validité de 10 000 jours.
Vous devrez entrez un mot de passe souvenez vous en, il est important pour la suite

Suite à cela placé le fichier "my-upload-key.keystore" au sein du dossier "android/app" et modifié le fichier gradle.properties comme suit à la fin du fichier :
```properties
MYAPP_UPLOAD_STORE_FILE=my-upload-key.keystore
MYAPP_UPLOAD_KEY_ALIAS=my-key-alias
MYAPP_UPLOAD_STORE_PASSWORD=*****
MYAPP_UPLOAD_KEY_PASSWORD=*****
```

Pensez à remplacé les `*****` par le mot de passe que nous avons cité plus haut


Une fois tout cela fini, vous pourrez simplement branché votre telephone à votre ordinateur et entré la commande 

```bash
yarn android --variant=release
```

## IOS

Cette partie est à documenté...