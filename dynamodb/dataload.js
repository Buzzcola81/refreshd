var AWS = require("aws-sdk");
var fs = require('fs');

AWS.config.update({
    region: "us-east-1"
});

var docClient = new AWS.DynamoDB.DocumentClient();

console.log("Importing RemindEvent Data into DynamoDB. Please wait.");

var allReminders = JSON.parse(fs.readFileSync('test-data.json', 'utf8'));
allReminders.forEach(function(Reminder) {
    var params = {
        TableName: "Reminders",
        Item: {
            "RemindTime":  Reminder.RemindTime,
            "PatientFrequency": Reminder.PatientFrequency,
            "Comments":  Reminder.Comments,
            "Year":  Reminder.Year,
            "Month":  Reminder.Month,
            "Day":  Reminder.Day,
            "DaysOfWeek":  Reminder.DaysOfWeek,
            "Context":  Reminder.Context,
            "PatientId": Reminder.PatientId
        }
    };

    docClient.put(params, function(err, data) {
        if (err) {
            console.error("Unable to add Reminder", Reminder.RemindTime, " ", Reminder.PatientFrequency, ". Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("PutItem succeeded:", Reminder.RemindTime, " ", Reminder.PatientFrequency);
        }
    });
});