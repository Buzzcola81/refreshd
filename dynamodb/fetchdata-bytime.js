var AWS = require("aws-sdk");
var dateFormat = require('dateformat');

var lambda = new AWS.Lambda(
    {
        "region": "us-east-1"
    }
);

AWS.config.update({
    region: "us-east-1"
});

AWS.config.apiVersions = {
    dynamodb: '2012-08-10',
    // other service API versions
};

var now = new Date();

//const RemindTime = dateFormat(now, "UTC:HHMM");
const RemindTime = "0900";

const UtcDay = dateFormat(now, "UTC:d");
const UtcMonth = dateFormat(now, "UTC:m");
const UtcYear = dateFormat(now, "UTC:yyyy");
const UtcWeekDay = dateFormat(now, "UTC:ddd").toLowerCase();

var dynamodb = new AWS.DynamoDB();

var table = "Reminders";

Array.prototype.contains = function (needle) {
    for (i in this) {
        if (this[i] == needle) return true;
    }
    return false;
};

function reducerFunction(myArray, val) {
    myArray.push(val.S);
    return myArray;
};


var params = {
    TableName: table,
    //IndexName: 'Time-index',
    KeyConditionExpression: 'RemindTime = :RemindTime',
    ExpressionAttributeValues: {
        ':RemindTime': {S: RemindTime}
    }
};

var getMatched = function (data) {
    var matched = [];

    var phoneNumber = /^\+\d+$/;

    data.Items.forEach(function (item) {
        var isAction = true;

        if (item.DaysOfWeek) {
            var DaysOfWeek = item.DaysOfWeek.L.reduce(reducerFunction, []);

            if (!DaysOfWeek.contains(UtcWeekDay)) {
                isAction = false;
            }
        } else if (item.Day) {
            if (item.Day.N != UtcDay) {
                isAction = false;
            } else if (item.Month) {
                if (item.Month.N != UtcMonth) {
                    isAction = false;
                } else {
                    if (item.Year) {
                        if (item.Year.N != UtcYear) {
                            isAction = false;
                        }
                    }
                    //Yes if Year not defined
                }
            }
        }
        else {
            // neither Day nor DaysOfWeek defined
            isAction = false
        }

        if (isAction === true) {
            if (phoneNumber.exec(item.PatientId.S)) {
                matched.push({
                    "PatientId": item.PatientId.S,
                    "Messages": item.Context.L.reduce(reducerFunction, [])
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

        item.Messages.forEach(function (message) {
            //console.log(message);
            indexedMessages[item.PatientId].push(message);
        });

    });

    Object.keys(indexedMessages).forEach(function (PatientId) {
        merged.push({
                "PatientId": PatientId,
                "Messages": indexedMessages[PatientId]
            }
        );
    })

    return merged;
}

var invokeLambda = function (event) {
    return new Promise((resolve, reject) => {

        var payload = {
            "message": event.Messages,
            "phonenumber": event.PatientId
        };

        var params = {
            FunctionName: "callTwilio",
            InvocationType: "Event",
            Payload: JSON.stringify(payload)
        };
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

console.log("Query Reminders table for time: ", RemindTime);
dynamodb.query(params, function (err, data) {
    if (err) {
        console.log("Unable to query. Error:", JSON.stringify(err, null, 2));
    } else {
        console.log("Query succeeded.");
        var matched = getMatched(data);
        var merged = mergeMatched(matched);


        sent(merged).then(() => {
            console.log('All Done');
        })

    }
});