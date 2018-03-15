# Github Projects Firebase EBS

This project is the Extension Backend Server (EBS) for the Github Project Twitch Extension.

### Information:
* Google Firebase Cloud Functions used as server
* Google Firebase Firestore used as noSQL database

### Running Code

Code is written using the latest es7 features but these new features are not supported by Firebase. So all code must be transpiled before running locally or deployed to production.

The transpile step will automatically before ```yarn serve``` or ```yarn deploy``` step to ensure that this require is met.

If you would like to transpile the code manually you can do so with ```yarn prepare```.


### Commands
| Action | Command |
| ------------- |:-------------:|
| Run Locally   | yarn serve |
| Transpile Code | yarn prepare |
| Deploy Production | yarn deploy | 
