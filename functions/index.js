const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();
const {
  getAuthToken,
  getSpreadSheet,
  getSpreadSheetValues
} = require('./googleSheetService.js');

async function testGetSpreadSheetValues() {
  const spreadsheetId = '1b24KQyVqmxqN3DbiXsE-N2Uh-IAxckTtoI8jab4uTTo';
  const sheetName = 'Sheet1';
  try {
    const auth = await getAuthToken();
    const response = await getSpreadSheetValues({
      spreadsheetId,
      sheetName,
      auth
    })
    console.log('output for getSpreadSheetValues', JSON.stringify(response.data, null, 2));    
    }
    catch(error) {
    console.log(error.message, error.stack);
    }
}

exports.readSpreadSheet = functions.https.onRequest((request, response) => {
  testGetSpreadSheetValues();
  response.send("Just Testing ");
 });

exports.matchMe = functions.https.onRequest((request, response) => {
    let usersCollection = db.collection('users');
    usersCollection.where('CanChat', '==', true).get()
    .then(userSnapshot => {
        if (userSnapshot.empty) {
            console.log("Did not find anyone available to chat at this time");
            response.send("Did not find anyone available to chat at this time");
            }
        else {  
            let docList=[];
            userSnapshot.forEach(doc => {
                docList.push(doc);
                });
            numOfMatches = docList.length;
            console.log("Number of matches: " + numOfMatches);
            randomSelction = Math.floor((Math.random() * numOfMatches) + 0);
            console.log("Selected entry number: " + randomSelction);
            console.log(docList[randomSelction].data().PhoneNumber);
            selectedDocID = docList[randomSelction].id;
            console.log ("the id: " + selectedDocID);
            usersCollection.doc(selectedDocID).update({CanChat: false});
            response.send("Found ");
            }
    }) 
  .catch(err => {
    console.log('Error getting documents', err);
    response.send(err, 500);
  });
});

exports.updateUserAvailability = functions.https.onRequest((request, response) => {
  userID = request.body.userID;
  isAvailable = request.body.isAvailable;
  db.collection('users').doc(userID).update({CanChat: isAvailable});
  response.send("Done ");
});