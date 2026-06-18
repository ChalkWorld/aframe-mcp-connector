<!-- TARGET: POST /v1/xaction-participants -->
<!-- FORMAT: RAW_PASTE -->

<!-- SUMMARY -->
Create a Transaction Participant

<!-- DESCRIPTION -->
Creates a new Transaction Participant assigned to a Transaction with a specified role. You may either provide `linkedContactId` to link an existing Contact, or provide `contactInfo` to create a brand-new Contact and link it at the same time. If both are supplied, `linkedContactId` wins and `contactInfo` is ignored.

<!-- PARAMETERS (Schema view) -->
Request body

application/json
Transaction Participant creation data.

Examples: 
Link Existing Contact
Example Value
Schema
APIXactionParticipantCreateDtoCollapse allobject
Data for creating a Transaction Participant.

Provide either:

linkedContactId to link an existing Contact to the participant, or
contactInfo to supply the contact data inline.
If both are supplied, linkedContactId wins and the contactInfo payload is ignored.

xactionIdCollapse allintegerint32
ID of the Xaction

Example123
xactionParticipantRoleIdCollapse allintegerint32
ID of the XactionParticipantRole

Example456
linkedContactIdCollapse allintegerint32
ID of an existing Contact to link to the participant; if provided, contactInfo is ignored

contactInfoCollapse allobject
Inline contact data for the participant; required if linkedContactId is not provided, otherwise ignored

companyCollapse allstring≤ 100 characters
Company name

Example"Johnson Realty"
teamNameCollapse allstring≤ 100 characters
Team name

Example"The Johnson Team"
titleCollapse allstring≤ 20 characters
Name title

Example"Mr."
firstNameCollapse allstring≤ 75 characters
First name

Example"John"
middleNameCollapse allstring≤ 25 characters
Middle name

lastNameCollapse allstring≤ 75 characters
Last name

Example"Doe"
jobTitleCollapse allstring≤ 75 characters
Job title

Example"Realtor"
email1Collapse allstringemail≤ 255 characters
Email 1 (primary)

Example"john.doe@example.com"
email2Collapse allstringemail≤ 255 characters
Email 2

email3Collapse allstringemail≤ 255 characters
Email 3

phone1Collapse allstring≤ 30 characters
Phone 1

Example"555-123-4567"
phone1TypeCollapse allstring≤ 20 characters
Phone 1 type

EnumCollapse allarray
#0"CELL"
#1"HOME"
#2"WORK"
#3"COMPANY"
#4"PAGER"
#5"ASSISTANT"
#6"FAX"
#7"OTHER"
phone1DescCollapse allstring≤ 20 characters
Phone 1 description / extension

Example"x1234"
phone2Collapse allstring≤ 30 characters
Phone 2

phone2TypeCollapse allstring≤ 20 characters
Phone 2 type

EnumCollapse allarray
#0"CELL"
#1"HOME"
#2"WORK"
#3"COMPANY"
#4"PAGER"
#5"ASSISTANT"
#6"FAX"
#7"OTHER"
phone2DescCollapse allstring≤ 20 characters
Phone 2 description / extension

Example"x1234"
phone3Collapse allstring≤ 30 characters
Phone 3

phone3TypeCollapse allstring≤ 20 characters
Phone 3 type

EnumCollapse allarray
#0"CELL"
#1"HOME"
#2"WORK"
#3"COMPANY"
#4"PAGER"
#5"ASSISTANT"
#6"FAX"
#7"OTHER"
phone3DescCollapse allstring≤ 20 characters
Phone 3 description / extension

Example"x1234"
phone4Collapse allstring≤ 30 characters
Phone 4

phone4TypeCollapse allstring≤ 20 characters
Phone 4 type

EnumCollapse allarray
#0"CELL"
#1"HOME"
#2"WORK"
#3"COMPANY"
#4"PAGER"
#5"ASSISTANT"
#6"FAX"
#7"OTHER"
phone4DescCollapse allstring≤ 20 characters
Phone 4 description / extension

Example"x1234"
faxCollapse allstring≤ 30 characters
Fax number

faxDescCollapse allstring≤ 20 characters
Fax description / extension

Example"x1234"
altContactTitleCollapse allstring≤ 20 characters
Alt contact name title

Example"Mrs."
altContactFirstNameCollapse allstring≤ 75 characters
Alt contact first name

altContactMiddleNameCollapse allstring≤ 25 characters
Alt contact middle name

altContactLastNameCollapse allstring≤ 75 characters
Alt contact last name

altContactJobTitleCollapse allstring≤ 75 characters
Alt contact job title

Example"Realtor"
altContactEmail1Collapse allstringemail≤ 255 characters
Alt contact email 1 (primary)

altContactEmail2Collapse allstringemail≤ 255 characters
Alt contact email 2

altContactEmail3Collapse allstringemail≤ 255 characters
Alt contact email 3

altContactPhone1Collapse allstring≤ 30 characters
Alt contact phone 1

altContactPhone1TypeCollapse allstring≤ 20 characters
Alt contact phone 1 type

EnumCollapse allarray
#0"CELL"
#1"HOME"
#2"WORK"
#3"COMPANY"
#4"PAGER"
#5"ASSISTANT"
#6"FAX"
#7"OTHER"
altContactPhone1DescCollapse allstring≤ 20 characters
Alt contact phone 1 description / extension

Example"x1234"
altContactPhone2Collapse allstring≤ 30 characters
Alt contact phone 2

altContactPhone2TypeCollapse allstring≤ 20 characters
Alt contact phone 2 type

EnumCollapse allarray
#0"CELL"
#1"HOME"
#2"WORK"
#3"COMPANY"
#4"PAGER"
#5"ASSISTANT"
#6"FAX"
#7"OTHER"
altContactPhone2DescCollapse allstring≤ 20 characters
Alt contact phone 2 description / extension

Example"x1234"
altContactPhone3Collapse allstring≤ 30 characters
Alt contact phone 3

altContactPhone3TypeCollapse allstring≤ 20 characters
Alt contact phone 3 type

EnumCollapse allarray
#0"CELL"
#1"HOME"
#2"WORK"
#3"COMPANY"
#4"PAGER"
#5"ASSISTANT"
#6"FAX"
#7"OTHER"
altContactPhone3DescCollapse allstring≤ 20 characters
Alt contact phone 3 description / extension

Example"x1234"
homeAddressLine1Collapse allstring≤ 100 characters
Home address line 1

homeAddressLine2Collapse allstring≤ 100 characters
Home address line 2

homeAddressCityCollapse allstring≤ 75 characters
Home address city

homeAddressStateCollapse allstring≤ 4 characters
Home address state

homeAddressZipCollapse allstring≤ 10 characters
Home address zip or postal code

homeAddressCountryCollapse allstring≤ 50 characters
Home address country

Example"USA"
workAddressLine1Collapse allstring≤ 100 characters
Work address line 1

workAddressLine2Collapse allstring≤ 100 characters
Work address line 2

workAddressCityCollapse allstring≤ 75 characters
Work address city

workAddressStateCollapse allstring≤ 4 characters
Work address state

workAddressZipCollapse allstring≤ 10 characters
Work address zip or postal code

workAddressCountryCollapse allstring≤ 50 characters
Work address country

Example"USA"
primaryAddressCollapse allstring
Primary address used for communication

EnumCollapse allarray
#0"HOME"
#1"WORK"
Example"HOME"
websiteCollapse allstringuri≤ 255 characters
Website URL

Example"https://www.aframesoftware.com"
brokerNumCollapse allstring≤ 20 characters
Broker license number

Example"BR123456"
licenseNumCollapse allstring≤ 20 characters
Contact license number

Example"L123456"
relationshipRatingCollapse allstring
Relationship rating

EnumCollapse allarray
#0"A"
#1"B"
#2"C"
#3"D"
#4"E"
Example"A"
salutationLtrCollapse allstring≤ 255 characters
Letter salutation; auto-completed if not provided

Example"John & Jane"
salutationEnvCollapse allstring≤ 255 characters
Envelope salutation; auto-completed if not provided

Example"Mr & Mrs. John Doe"
categoriesCollapse allarray<string>≤ 100 characters
Category names to associate with the Contact (each name max 100 chars)

Itemsstring
ExampleCollapse allarray
#0"Client"
#1"Lead"
#2"Vendor"
onlySaveContactInTransactionCollapse allboolean
Only applies when contactInfo is provided (ignored when linkedContactId is set). If false (default), a new Contact entity is created and linked to the participant. If true, the contactInfo is stored only on the participant's snapshot — no Contact entity is created and linkedContactId on the response will be null. Useful for keeping the Contact list clean when adding one-time participants.

agentVisibleCollapse allboolean
Whether the participant is visible on the Agent portal. Defaults to true.

buyerSellerVisibleCollapse allboolean
Whether the participant is visible on the Buyer/Seller portal. Defaults to true.

<!-- RESPONSES (Schema view) -->
Responses
Code	Description	Links
201	
Transaction Participant created successfully.

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
Bad Request - Malformed JSON or unreadable payload.

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
Forbidden - The authenticated user does not have permission to access the Transaction.

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
Not Found - Transaction, Role, or Contact does not exist.

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
Unprocessable Content - Validation errors occurred while creating the Transaction Participant.

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