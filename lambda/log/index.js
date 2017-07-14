var AWS = require("aws-sdk");

exports.handler = (event, context, callback) => {
    console.log(event);
    console.log(JSON.stringify(event));
    console.log(event.Details.ContactData.CustomerEndpoint.Address);
    console.log(event.Details.Parameters.firstName);

    const inboundnumber = event.Details.ContactData.CustomerEndpoint.Address;
    const lookupcontact = event.Details.Parameters.firstName.toLowerCase();

    let contactph = "default";

    const dynamodb = new AWS.DynamoDB();
    const params = {
        ExpressionAttributeValues: {
            ':v1': {
                S: inboundnumber
            }
        },
        KeyConditionExpression: 'patientId = :v1',
        IndexName: 'patientId-index',
        TableName: 'contacts'
    };
    dynamodb.query(params, function (err, data) {
        if (err) {
            console.log(err, err.stack);
        } else {
            console.log(JSON.stringify(data));
            for(var i = 0; i < data.Items.length; i++) {
                if (data.Items[i].contactName.S.toLowerCase() === lookupcontact){
                    console.log("Match found in DynamoDB");
                    console.log(data.Items[i].contactName.S);
                    console.log(data.Items[i].contactTel.S);
                    contactph = data.Items[i].contactTel.S;
                }
            }
            console.log(`contactph value ${contactph}`);
            console.log(`lookupcontact value ${lookupcontact}`);
            let voicemessage = "Default";
            let supportnumber = "123456";
            if (contactph === "default"){
                voicemessage = "I am unable to locate a contact, calling refreshed support"
                callnumber = supportnumber;
            } else {
                voicemessage = `Calling ${lookupcontact}`;
                callnumber = contactph;
            }
            console.log(`voicemessage value ${voicemessage}`);
            console.log(`callnumber value ${callnumber}`);

            callback(null, { message : voicemessage,
                number: callnumber});
        }
    });

};