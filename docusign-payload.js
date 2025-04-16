// This is the payload for the DocuSign signed contract webhook
export const docusignPayload = {
    "event": "envelope-completed",
    "apiVersion": "v2.1",
    "uri": "restapi/v2.1/accounts/{accountId}/envelopes/{envelopeId}",
    "retryCount": 0,
    "configurationId": "1234abcd-5678-efgh-ijkl-90mnopqrst",
    "generatedDateTime": "2023-08-15T16:05:32.1234567Z",
    "data": {
      "accountId": "12345678-abcd-1234-abcd-1234567890ab",
      "envelopeId": "98765432-dcba-4321-dcba-0987654321zy",
      "envelopeSummary": {
        "status": "completed",
        "documentsUri": "/accounts/{accountId}/envelopes/{envelopeId}/documents",
        "recipientsUri": "/accounts/{accountId}/envelopes/{envelopeId}/recipients",
        "envelopeUri": "/accounts/{accountId}/envelopes/{envelopeId}",
        "templateId": "New_Contract",
        "templateRoles": [
          {
            "name": "Jane Smith",
            "email": "signer@example.com",
            "roleName": "Signer"
          }
        ],
        "emailSubject": "Please sign this document",
        "emailBlurb": "Please sign this document at your earliest convenience",
        "envelopeId": "98765432-dcba-4321-dcba-0987654321zy",
        "customFieldsUri": "/accounts/{accountId}/envelopes/{envelopeId}/custom_fields",
        "notificationUri": "/accounts/{accountId}/envelopes/{envelopeId}/notification",
        "createdDateTime": "2023-08-15T14:30:15.1234567Z",
        "sentDateTime": "2023-08-15T14:31:22.4567890Z",
        "completedDateTime": "2023-08-15T16:05:30.7890123Z",
        "statusChangedDateTime": "2023-08-15T16:05:30.7890123Z",
        "documentsCombinedUri": "/accounts/{accountId}/envelopes/{envelopeId}/documents/combined",
        "certificateUri": "/accounts/{accountId}/envelopes/{envelopeId}/documents/certificate",
        "templatesUri": "/accounts/{accountId}/envelopes/{envelopeId}/templates",
        "recipients": {
          "signers": [
            {
              "email": "signer@example.com",
              "name": "Jane Smith",
              "recipientId": "1",
              "recipientIdGuid": "00001111-2222-3333-4444-555566667777",
              "status": "completed",
              "signedDateTime": "2023-08-15T16:05:30.7890123Z",
              "deliveredDateTime": "2023-08-15T14:31:30.1111111Z",
              "deliveryMethod": "email",
              "address": {
                "street1": "123 Main Street",
                "street2": "Apt 4B",
                "city": "San Francisco",
                "state": "CA",
                "zipCode": "94105",
                "country": "US"
              }
            }
          ]
        },
        "purgeState": "unpurged"
      }
    }
  }