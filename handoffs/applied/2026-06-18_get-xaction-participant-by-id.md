<!-- TARGET: GET /v1/xaction-participants/{xactionParticipantId} -->
<!-- FORMAT: RAW_PASTE -->

<!-- SUMMARY -->
Get a Transaction Participant

<!-- DESCRIPTION -->
Returns the Transaction Participant with the supplied ID.

<!-- PARAMETERS (Schema view) -->


<!-- RESPONSES (Schema view) -->
Responses
Code	Description	Links
200	
The Transaction Participant details.

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
403	
Forbidden - The authenticated user does not have permission to access this Transaction Participant.

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