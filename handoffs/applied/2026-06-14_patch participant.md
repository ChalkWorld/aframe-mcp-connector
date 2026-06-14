<!-- TARGET: /v1/xaction-participants/{xactionParticipantId}/contact-info -->
<!-- FORMAT: RAW_PASTE -->

<!-- SUMMARY -->
Applies patch operations to the participant's contact-info. Only use when the participant has no linked Contact (linkedContactId is null). Returns 409 Conflict otherwise — use PATCH /xaction-participants/{id}/linked-contact instead.

<!-- DESCRIPTION -->
Name	Description
xactionParticipantId *
integer
(path)
ID of the Transaction Participant.

Example : 123

<!-- PARAMETERS (Schema view) -->
JSON Patch operations targeting contact-info fields. See APIContactInfoPatchDto for available paths.

Examples: 
Rename the participant's snapshot
Example Value
Schema
[
  {
    "op": "replace",
    "path": "/firstName",
    "value": "John"
  }
]
Example Description
Rename the participant's snapshot


Responses
Code	Description	Links
200	
The updated Transaction Participant.

Media type

application/json
Controls Accept header.
Example Value
Schema
{
  "xactionParticipantId": 0,
  "xactionId": 0,
  "xactionParticipantRoleId": 0,
  "xactionParticipantRole": "string",
  "linkedContactId": 0,
  "contactInfo": {
    "contactId": 0,
    "name": {
      "company": "string",
      "title": "Mr.",
      "firstName": "string",
      "middleName": "string",
      "lastName": "string"
    },
    "company": "string",
    "teamName": "string",
    "jobTitle": "string",
    "primaryEmail": "user@example.com",
    "phone1": {
      "phone": "string",
      "formattedPhoneString": "string",
      "phoneType": "CELL",
      "phoneDesc": "string"
    },
    "phone2": {
      "phone": "string",
      "formattedPhoneString": "string",
      "phoneType": "CELL",
      "phoneDesc": "string"
    },
    "altContactName": {
      "company": "string",
      "title": "Mr.",
      "firstName": "string",
      "middleName": "string",
      "lastName": "string"
    },
    "altContactJobTitle": "string",
    "altContactPrimaryEmail": "user@example.com",
    "altContactPhone1": {
      "phone": "string",
      "formattedPhoneString": "string",
      "phoneType": "CELL",
      "phoneDesc": "string"
    },
    "altContactPhone2": {
      "phone": "string",
      "formattedPhoneString": "string",
      "phoneType": "CELL",
      "phoneDesc": "string"
    },
    "brokerNum": "string",
    "licenseNum": "string",
    "createDateTime": "2026-06-14T20:16:34.413Z",
    "editDateTime": "2026-06-14T20:16:34.414Z"
  },
  "sort": 0,
  "agentVisible": true,
  "buyerSellerVisible": true
}
No links
400	
Bad Request - Invalid JSON Patch format or operation.

Media type

application/json
Example Value
Schema
{
  "error": {
    "messages": [
      "Unable to update."
    ],
    "details": [
      "Error: Invalid JSON Patch operation 'add' on path '/unknownField'"
    ]
  }
}
No links
403	
Forbidden - The authenticated user does not have permission to update this Transaction Participant.

Media type

application/json
Example Value
Schema
{
  "error": {
    "messages": [
      "Forbidden"
    ],
    "details": [
      "AppUser is not allowed to access this resource."
    ]
  }
}
No links
404	
Not Found - Transaction Participant with the supplied ID does not exist.

Media type

application/json
Example Value
Schema
{
  "error": {
    "messages": [
      "Resource not found"
    ],
    "details": [
      "The requested resource does not exist or has been deleted."
    ]
  }
}
No links
409	
Conflict - The participant has a linked Contact. Use PATCH /linked-contact instead.

Media type

application/json
Example Value
Schema
{
  "payload": "string",
  "error": {
    "requestId": "string",
    "messages": [
      "string"
    ],
    "details": [
      "string"
    ],
    "validationErrors": [
      {
        "fieldName": "string",
        "message": "string"
      }
    ]
  }
}
No links
422	
Unprocessable Content - Validation errors occurred while updating the snapshot.

Media type

application/json
Example Value
Schema
{
  "error": {
    "validationErrors": [
      {
        "fieldName": "firstName",
        "message": "must not be blank"
      },
      {
        "fieldName": "email1",
        "message": "must be a well-formed email address"
      }
    ]
  }
}
No links
429	
Too Many Requests - Rate limit exceeded.

Media type

application/json
Example Value
Schema
{
  "error": {
    "messages": [
      "Rate limit exceeded."
    ]
  }
}

<!-- RESPONSES (Schema view) -->
JSON Patch operations targeting contact-info fields. See APIContactInfoPatchDto for available paths.

Examples: 
Rename the participant's snapshot
Example Value
Schema
APIContactInfoPatchDtoCollapse allobject
Patch model for updating Transaction Participant contact details

companyCollapse allstring
Company

Example"Johnson Realty"
teamNameCollapse allstring
Team name

Example"The Johnson Team"
titleCollapse allstring
Name title

Example"Mr."
firstNameCollapse allstring
First name

Example"John"
middleNameCollapse allstring
Middle name

lastNameCollapse allstring
Last name

Example"Johnson"
jobTitleCollapse allstring
Job title

Example"Realtor"
email1Collapse allstring
Email 1 (primary)

Example"john@example.com"
phone1Collapse allstring
Phone 1

Example"555-555-1234"
phone1TypeCollapse allstring
Phone 1 type

EnumCollapse allarray
#0"CELL"
#1"HOME"
#2"WORK"
#3"PAGER"
#4"ASSISTANT"
#5"COMPANY"
#6"OTHER"
phone1DescCollapse allstring
Phone 1 description / extension

Example"x1234"
phone2Collapse allstring
Phone 2

Example"555-555-1234"
phone2TypeCollapse allstring
Phone 2 type

EnumCollapse allarray
#0"CELL"
#1"HOME"
#2"WORK"
#3"PAGER"
#4"ASSISTANT"
#5"COMPANY"
#6"OTHER"
phone2DescCollapse allstring
Phone 2 description / extension

Example"x1234"
phone3Collapse allstring
Phone 3

Example"555-555-1234"
phone3TypeCollapse allstring
Phone 3 type

EnumCollapse allarray
#0"CELL"
#1"HOME"
#2"WORK"
#3"PAGER"
#4"ASSISTANT"
#5"COMPANY"
#6"OTHER"
phone3DescCollapse allstring
Phone 3 description / extension

Example"x1234"
phone4Collapse allstring
Phone 4

Example"555-555-1234"
phone4TypeCollapse allstring
Phone 4 type

EnumCollapse allarray
#0"CELL"
#1"HOME"
#2"WORK"
#3"PAGER"
#4"ASSISTANT"
#5"COMPANY"
#6"OTHER"
phone4DescCollapse allstring
Phone 4 description / extension

Example"x1234"
faxCollapse allstring
Fax number

Example"555-555-1234"
faxDescCollapse allstring
Fax description / extension

Example"x1234"
altContactTitleCollapse allstring
Alt contact name title

Example"Mrs."
altContactFirstNameCollapse allstring
Alt contact first name

altContactMiddleNameCollapse allstring
Alt contact middle name

altContactLastNameCollapse allstring
Alt contact last name

altContactJobTitleCollapse allstring
Alt contact job title

Example"Realtor"
altContactEmail1Collapse allstring
Alt contact email 1 (primary)

Example"alt@example.com"
altContactPhone1Collapse allstring
Alt contact phone 1

Example"555-555-1234"
altContactPhone1TypeCollapse allstring
Alt contact phone 1 type

EnumCollapse allarray
#0"CELL"
#1"HOME"
#2"WORK"
#3"PAGER"
#4"ASSISTANT"
#5"COMPANY"
#6"OTHER"
altContactPhone1DescCollapse allstring
Alt contact phone 1 description / extension

Example"x1234"
altContactPhone2Collapse allstring
Alt contact phone 2

Example"555-555-1234"
altContactPhone2TypeCollapse allstring
Alt contact phone 2 type

EnumCollapse allarray
#0"CELL"
#1"HOME"
#2"WORK"
#3"PAGER"
#4"ASSISTANT"
#5"COMPANY"
#6"OTHER"
altContactPhone2DescCollapse allstring
Alt contact phone 2 description / extension

Example"x1234"
altContactPhone3Collapse allstring
Alt contact phone 3

Example"555-555-1234"
altContactPhone3TypeCollapse allstring
Alt contact phone 3 type

EnumCollapse allarray
#0"CELL"
#1"HOME"
#2"WORK"
#3"PAGER"
#4"ASSISTANT"
#5"COMPANY"
#6"OTHER"
altContactPhone3DescCollapse allstring
Alt contact phone 3 description / extension

Example"x1234"
addressLine1Collapse allstring
Primary address line 1

addressLine2Collapse allstring
Primary address line 2

addressCityCollapse allstring
Primary address city

addressStateCollapse allstring
Primary address state

addressZipCollapse allstring
Primary address zip or postal code

addressCountryCollapse allstring
Primary address country

websiteCollapse allstringuri
Website URL

Example"https://example.com"
Example Description
Rename the participant's snapshot


Responses
Code	Description	Links
200	
The updated Transaction Participant.

Media type

application/json
Controls Accept header.
Example Value
Schema
APIXactionParticipantDtoCollapse allobject
Transaction Participant full data

xactionParticipantIdCollapse allintegerint32
ID of the XactionParticipant

xactionIdCollapse allintegerint32
ID of the Xaction

xactionParticipantRoleIdCollapse allintegerint32
ID of the XactionParticipantRole

xactionParticipantRoleCollapse allstring
Name of the Transaction Participant Role

linkedContactIdCollapse allintegerint32
ID of the linked Contact, or null when the participant has no linked Contact

contactInfoCollapse allobject
Contact information (digest). Sourced from the linked Contact when one exists, otherwise from the participant's snapshot.

contactIdCollapse allintegerint32
ID of the Contact

nameCollapse allobject
Contact name

companyCollapse allstring
Company

titleCollapse allstring
Title

Example"Mr."
firstNameCollapse allstring
First Name

middleNameCollapse allstring
Middle Name

lastNameCollapse allstring
Last Name

companyCollapse allstring
Company name

teamNameCollapse allstring
Team name

jobTitleCollapse allstring
Job title

primaryEmailCollapse allstringemail
Primary email used for communication

phone1Collapse allobject
Phone 1

phoneCollapse allstring
Phone Number

formattedPhoneStringCollapse allstring
Phone Number with (xxx) xxx-xxxx format, if possible.

phoneTypeCollapse allstring
Phone Type

EnumCollapse allarray
#0"CELL"
#1"HOME"
#2"WORK"
#3"COMPANY"
#4"PAGER"
#5"ASSISTANT"
#6"FAX"
#7"OTHER"
phoneDescCollapse allstring
Phone Description or Extension

phone2Collapse allobject
Phone 2

phoneCollapse allstring
Phone Number

formattedPhoneStringCollapse allstring
Phone Number with (xxx) xxx-xxxx format, if possible.

phoneTypeCollapse allstring
Phone Type

EnumCollapse allarray
#0"CELL"
#1"HOME"
#2"WORK"
#3"COMPANY"
#4"PAGER"
#5"ASSISTANT"
#6"FAX"
#7"OTHER"
phoneDescCollapse allstring
Phone Description or Extension

altContactNameCollapse allobject
Alt contact name

companyCollapse allstring
Company

titleCollapse allstring
Title

Example"Mr."
firstNameCollapse allstring
First Name

middleNameCollapse allstring
Middle Name

lastNameCollapse allstring
Last Name

altContactJobTitleCollapse allstring
Alt contact job title

altContactPrimaryEmailCollapse allstringemail
Alt contact primary email used for communication

altContactPhone1Collapse allobject
Alt contact phone 1

phoneCollapse allstring
Phone Number

formattedPhoneStringCollapse allstring
Phone Number with (xxx) xxx-xxxx format, if possible.

phoneTypeCollapse allstring
Phone Type

EnumCollapse allarray
#0"CELL"
#1"HOME"
#2"WORK"
#3"COMPANY"
#4"PAGER"
#5"ASSISTANT"
#6"FAX"
#7"OTHER"
phoneDescCollapse allstring
Phone Description or Extension

altContactPhone2Collapse allobject
Alt contact phone 2

phoneCollapse allstring
Phone Number

formattedPhoneStringCollapse allstring
Phone Number with (xxx) xxx-xxxx format, if possible.

phoneTypeCollapse allstring
Phone Type

EnumCollapse allarray
#0"CELL"
#1"HOME"
#2"WORK"
#3"COMPANY"
#4"PAGER"
#5"ASSISTANT"
#6"FAX"
#7"OTHER"
phoneDescCollapse allstring
Phone Description or Extension

brokerNumCollapse allstring
Broker license number

licenseNumCollapse allstring
Contact license number

createDateTimeCollapse allstringdate-time
Date and time the Contact was created

editDateTimeCollapse allstringdate-time
Date and time the Contact was last edited

sortCollapse allintegerint32
Sort order for display

agentVisibleCollapse allboolean
Whether the participant is visible to agents on the transaction

buyerSellerVisibleCollapse allboolean
Whether the participant is visible to buyers/sellers on the portal

No links
400	
Bad Request - Invalid JSON Patch format or operation.

Media type

application/json
Example Value
Schema
APIResponseCollapse allobject
Wrapper to responses to the client. Standardizes the response for all controllers.

payloadCollapse allany
Custom result for the response

errorCollapse allobject
Offers more details on error

requestIdCollapse allstring
Correlation ID for this request. Quote this when reporting issues to support.

messagesCollapse allarray<string>
General 'friendly' messages of the error. May be displayed to the end user.

Itemsstring
detailsCollapse allarray<string>
Detailed list of errors

Itemsstring
validationErrorsCollapse allarray<object>
Detailed list of validation errors. When validation fails, status should be UNPROCESSABLE_CONTENT

ItemsCollapse allobject
fieldNameCollapse allstring
Field name that failed validation. May be empty if general validation error is present

messageCollapse allstring
Validation error message

No links
403	
Forbidden - The authenticated user does not have permission to update this Transaction Participant.

Media type

application/json
Example Value
Schema
APIResponseCollapse allobject
Wrapper to responses to the client. Standardizes the response for all controllers.

payloadCollapse allany
Custom result for the response

errorCollapse allobject
Offers more details on error

requestIdCollapse allstring
Correlation ID for this request. Quote this when reporting issues to support.

messagesCollapse allarray<string>
General 'friendly' messages of the error. May be displayed to the end user.

Itemsstring
detailsCollapse allarray<string>
Detailed list of errors

Itemsstring
validationErrorsCollapse allarray<object>
Detailed list of validation errors. When validation fails, status should be UNPROCESSABLE_CONTENT

ItemsCollapse allobject
fieldNameCollapse allstring
Field name that failed validation. May be empty if general validation error is present

messageCollapse allstring
Validation error message

No links
404	
Not Found - Transaction Participant with the supplied ID does not exist.

Media type

application/json
Example Value
Schema
APIResponseCollapse allobject
Wrapper to responses to the client. Standardizes the response for all controllers.

payloadCollapse allany
Custom result for the response

errorCollapse allobject
Offers more details on error

requestIdCollapse allstring
Correlation ID for this request. Quote this when reporting issues to support.

messagesCollapse allarray<string>
General 'friendly' messages of the error. May be displayed to the end user.

Itemsstring
detailsCollapse allarray<string>
Detailed list of errors

Itemsstring
validationErrorsCollapse allarray<object>
Detailed list of validation errors. When validation fails, status should be UNPROCESSABLE_CONTENT

ItemsCollapse allobject
fieldNameCollapse allstring
Field name that failed validation. May be empty if general validation error is present

messageCollapse allstring
Validation error message

No links
409	
Conflict - The participant has a linked Contact. Use PATCH /linked-contact instead.

Media type

application/json
Example Value
Schema
APIResponseCollapse allobject
Wrapper to responses to the client. Standardizes the response for all controllers.

payloadCollapse allany
Custom result for the response

errorCollapse allobject
Offers more details on error

requestIdCollapse allstring
Correlation ID for this request. Quote this when reporting issues to support.

messagesCollapse allarray<string>
General 'friendly' messages of the error. May be displayed to the end user.

Itemsstring
detailsCollapse allarray<string>
Detailed list of errors

Itemsstring
validationErrorsCollapse allarray<object>
Detailed list of validation errors. When validation fails, status should be UNPROCESSABLE_CONTENT

ItemsCollapse allobject
fieldNameCollapse allstring
Field name that failed validation. May be empty if general validation error is present

messageCollapse allstring
Validation error message

No links
422	
Unprocessable Content - Validation errors occurred while updating the snapshot.

Media type

application/json
Example Value
Schema
APIResponseCollapse allobject
Wrapper to responses to the client. Standardizes the response for all controllers.

payloadCollapse allany
Custom result for the response

errorCollapse allobject
Offers more details on error

requestIdCollapse allstring
Correlation ID for this request. Quote this when reporting issues to support.

messagesCollapse allarray<string>
General 'friendly' messages of the error. May be displayed to the end user.

Itemsstring
detailsCollapse allarray<string>
Detailed list of errors

Itemsstring
validationErrorsCollapse allarray<object>
Detailed list of validation errors. When validation fails, status should be UNPROCESSABLE_CONTENT

ItemsCollapse allobject
fieldNameCollapse allstring
Field name that failed validation. May be empty if general validation error is present

messageCollapse allstring
Validation error message

No links
429	
Too Many Requests - Rate limit exceeded.

Media type

application/json
Example Value
Schema
APIResponseCollapse allobject
Wrapper to responses to the client. Standardizes the response for all controllers.

payloadCollapse allany
Custom result for the response

errorCollapse allobject
Offers more details on error

requestIdCollapse allstring
Correlation ID for this request. Quote this when reporting issues to support.

messagesCollapse allarray<string>
General 'friendly' messages of the error. May be displayed to the end user.

Itemsstring
detailsCollapse allarray<string>
Detailed list of errors

Itemsstring
validationErrorsCollapse allarray<object>
Detailed list of validation errors. When validation fails, status should be UNPROCESSABLE_CONTENT

ItemsCollapse allobject
fieldNameCollapse allstring
Field name that failed validation. May be empty if general validation error is present

messageCollapse allstring
Validation error message