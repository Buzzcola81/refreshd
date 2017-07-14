var AWS = require("aws-sdk");
var dateFormat = require('dateformat');


const table = "reminders";

var dynamodb = new AWS.DynamoDB();
var lambda = new AWS.Lambda();

Array.prototype.contains = function (needle) {
    for (i in this) {
        if (this[i] == needle) return true;
    }
    return false;
};

function reducerFunction(myArray, val) {
    myArray.push(val.S.toLowerCase());
    return myArray;
};


var getMatched = function (data) {
    var matched = [];

    var now = new Date();

    const UtcDay = dateFormat(now, "UTC:d");
    const UtcMonth = dateFormat(now, "UTC:m");
    const UtcYear = dateFormat(now, "UTC:yyyy");
    const UtcWeekDay = dateFormat(now, "UTC:ddd").toLowerCase();

    var phoneNumber = /^\+\d+$/;

    data.Items.forEach(function (item) {
        var isAction = false;



        var frequency = item.frequency.S;

        if ( frequency === 'daily') {
            isAction = true;
        }
        // Weekly, monthly, yearly, once ...
        else {

            var frequencySplit = frequency.split(',');

            for ( var i = 0; i < frequencySplit.length; i++) {

                var d = frequencySplit[i];

                // weekly or monthly  - bug exist: UTC date different from Australia/Melbourne
                if  (( d === UtcWeekDay) || (d === UtcDay)) {
                    isAction = true;
                    break;
                }
                else {
                    var d_split = d.split('/');
                    // yearly
                    if (d_split.length === 2 ) {
                        if ((d_split[0] === UtcDay) && (d_split[1] === UtcMonth)) {
                            isAction = true;
                            break;
                        }
                    }
                    // once
                    else if (d_split.length === 3 ) {
                        if ((d_split[0] === UtcDay) && (d_split[1] === UtcMonth) && (d_split[2] === UtcYear)) {
                            isAction = true;
                            break;
                        }
                    }
                }
            };
        }

        if (isAction === true) {
            if (phoneNumber.exec(item.telephone.S)) {
                matched.push({
                    "PatientId": item.telephone.S,
                    "Messages": item.message.S
                });
            } else {
                console.log("Invalid Patient Id/Phone Number:", item.PatientId.S)
            }
        }
    })

    return matched;
}

var mergeMatched = function (matched) {

    var indexedMessages = {};
    var merged = [];

    //for every object if carer matches then merge into new object
    matched.forEach(function (item) {
        if (!(item.PatientId in indexedMessages)) {
            indexedMessages[item.PatientId] = []
        }

        indexedMessages[item.PatientId].push(item.Messages);


    });

    Object.keys(indexedMessages).forEach(function (PatientId) {
        merged.push({
                "phonenumber": PatientId,
                "message":indexedMessages[PatientId]
            }
        );
    })

    return merged;
}

var invokeLambda = function (event) {
    return new Promise((resolve, reject) => {

        var params = {
            FunctionName: "callTwilio",
            InvocationType: "Event",
            Payload: JSON.stringify(event)
        };

        console.log(`Make phone call to ${event.phonenumber} ...`);
        lambda.invoke(params, function (err, data) {
            if (err) {
                console.log(err, err.stack); // an error occurred
                reject();
            }
            else {
                console.log(data);           // successful response
                resolve();
            }
        });

    })
}

var sent = function (merged) {
    return new Promise((resolve, reject) => {
        var promises = [];

        merged.forEach(function (event) {
            promises.push(invokeLambda(event))
        });

        //for loop end
        Promise.all(promises).then(() => {
                // for all in
                resolve()
            }
        )
    });
}


exports.handler = (event, context, callback) => {

    var now = new Date();

    const RemindTime = dateFormat(now, "UTC:HHMM");

    console.log("Query Reminders table for time: ", RemindTime);

    var params = {
        TableName: table,
        IndexName: 'remindTime-index',
        KeyConditionExpression: 'remindTime = :RemindTime',
        ExpressionAttributeValues: {
            ':RemindTime': {S: RemindTime}
        }
    };

    dynamodb.query(params, function (err, data) {
        if (err) {
            console.log("Unable to query. Error:", JSON.stringify(err, null, 2));
        } else {
            console.log("Query succeeded.");
            var matched = getMatched(data);
            var merged = mergeMatched(matched);
            sent(merged).then(() => {
               console.log('All Done');
                callback(null);
            }).catch((err)=> {
               console.log(err);
               callback(err)
            })
        }
    });
}