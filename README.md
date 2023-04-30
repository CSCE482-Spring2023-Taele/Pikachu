# Pikachu
UNIT TESTING

To run our unit tests, please go into /pave_pikachu/package.json and add the following line:

"type":"module"

on line 5 or behind the line

"scripts": {

Note: adding this line will prevent the app from working on an emulator, to regain the 
ability to run on an emulator, remove the line.

After adding the line, run the following command in your console/terminal in the \pave_pikachu directory:

npx c8 mocha

This will print out which tests passed and the overall code coverage in the console.


STARTING THE APPLICATION

To start the application, you must first have an Android emulator installed in your system. 
If you do not have one, go to 

https://developer.android.com/studio/run/emulator

and follow the instructions to install an emulator.

After installation, make sure you can start the emulator through Android Studio. After that,
run the following command in the /pave_pikachu directory to start the application:

npx react-native start

This will prompt you to enter one of four options. Enter 'a' to run on Android. It might take a while
for the application to show up on the emulator depending on how fast your computer is.

After a few seconds or minutes, the app should have successfully installed on the emulator and started up.
