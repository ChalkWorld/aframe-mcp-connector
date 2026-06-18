<!-- TARGET: PATCH /v1/contacts/{contactId} -->
<!-- FORMAT: RAW_PASTE -->

<!-- SUMMARY -->
Update a Contact

<!-- DESCRIPTION -->
Updates the specified Contact using JSON Patch (RFC 6902) operations. The authenticated user must have permission to edit the Contact.

<!-- PARAMETERS (Schema view) -->
Request body

application/json-patch+json
JSON Patch operations describing the changes to apply. See APIContactPatchDto for available paths.

Examples: 
Patch Example
Example Value
Schema
APIContactPatchDtoCollapse allobject
Patch model for updating contact details

companyCollapse allstring
Company name

Example"Johnson Realty"
teamNameCollapse allstring
Team name

Example"The Johnson Team"
titleCollapse allstring
Name title

Example"Mr."
firstNameCollapse allstring
First name

middleNameCollapse allstring
Middle name

lastNameCollapse allstring
Last name

jobTitleCollapse allstring
Job title

Example"Realtor"
email1Collapse allstringemail
Email 1 (primary)

email2Collapse allstringemail
Email 2

email3Collapse allstringemail
Email 3

phone1Collapse allstring
Phone 1

phone1TypeCollapse allstring
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
phone1DescCollapse allstring
Phone 1 description / extension

Example"x1234"
phone2Collapse allstring
Phone 2

phone2TypeCollapse allstring
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
phone2DescCollapse allstring
Phone 2 description / extension

Example"x1234"
phone3Collapse allstring
Phone 3

phone3TypeCollapse allstring
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
phone3DescCollapse allstring
Phone 3 description / extension

Example"x1234"
phone4Collapse allstring
Phone 4

phone4TypeCollapse allstring
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
phone4DescCollapse allstring
Phone 4 description / extension

Example"x1234"
faxCollapse allstring
Fax number

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
altContactEmail1Collapse allstringemail
Alt contact email 1 (primary)

altContactEmail2Collapse allstringemail
Alt contact email 2

altContactEmail3Collapse allstringemail
Alt contact email 3

altContactPhone1Collapse allstring
Alt contact phone 1

altContactPhone1TypeCollapse allstring
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
altContactPhone1DescCollapse allstring
Alt contact phone 1 description / extension

Example"x1234"
altContactPhone2Collapse allstring
Alt contact phone 2

altContactPhone2TypeCollapse allstring
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
altContactPhone2DescCollapse allstring
Alt contact phone 2 description / extension

Example"x1234"
altContactPhone3Collapse allstring
Alt contact phone 3

altContactPhone3TypeCollapse allstring
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
altContactPhone3DescCollapse allstring
Alt contact phone 3 description / extension

Example"x1234"
homeAddressLine1Collapse allstring
Home address line 1

homeAddressLine2Collapse allstring
Home address line 2

homeAddressCityCollapse allstring
Home address city

homeAddressStateCollapse allstring
Home address state

homeAddressZipCollapse allstring
Home address zip or postal code

homeAddressCountryCollapse allstring
Home address country

workAddressLine1Collapse allstring
Work address line 1

workAddressLine2Collapse allstring
Work address line 2

workAddressCityCollapse allstring
Work address city

workAddressStateCollapse allstring
Work address state

workAddressZipCollapse allstring
Work address zip or postal code

workAddressCountryCollapse allstring
Work address country

primaryAddressCollapse allstring
Primary address used for communication

EnumCollapse allarray
#0"HOME"
#1"WORK"
Example"WORK"
websiteCollapse allstringuri
Website URL

Example"https://www.aframesoftware.com"
brokerNumCollapse allstring
Broker license number

licenseNumCollapse allstring
Contact license number

relationshipRatingCollapse allstring
Relationship rating

EnumCollapse allarray
#0"A"
#1"B"
#2"C"
#3"D"
#4"E"
Example"A"
salutationLtrCollapse allstring
Letter salutation

Example"John & Jane"
salutationEnvCollapse allstring
Envelope salutation

Example"Mr & Mrs. John Doe"

<!-- RESPONSES (Schema view) -->
Responses
Code	Description	Links
200	
The updated Contact.

Media type

application/json
Controls Accept header.
Example Value
Schema
APIContactDtoCollapse allobject
Contact data

contactIdCollapse allintegerint32
ID of the Contact

teamIdCollapse allintegerint32
ID of the Team

associatedAppUserIdCollapse allintegerint32
ID of the associated AppUser, populated when the Contact is a team member

companyCollapse allstring
Company name

teamNameCollapse allstring
Team name

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

jobTitleCollapse allstring
Job title

email1Collapse allstringemail
Email 1

email2Collapse allstringemail
Email 2

email3Collapse allstringemail
Email 3

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

phone3Collapse allobject
Phone 3

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

phone4Collapse allobject
Phone 4

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

faxCollapse allobject
Fax

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

altContactEmail1Collapse allstringemail
Alt contact email 1

altContactEmail2Collapse allstringemail
Alt contact email 2

altContactEmail3Collapse allstringemail
Alt contact email 3

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

altContactPhone3Collapse allobject
Alt contact phone 3

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

homeAddressCollapse allobject
Home full address

address1Collapse allstring
Address Line 1

address2Collapse allstring
Address Line 2

cityCollapse allstring
City

stateCollapse allstring
State

zipCollapse allstring
Zip or Postal Code

countryCollapse allstring
Country

countyCollapse allstring
County

latitudeCollapse allnumberdouble
Latitude

longitudeCollapse allnumberdouble
Longitude

workAddressCollapse allobject
Work full address

address1Collapse allstring
Address Line 1

address2Collapse allstring
Address Line 2

cityCollapse allstring
City

stateCollapse allstring
State

zipCollapse allstring
Zip or Postal Code

countryCollapse allstring
Country

countyCollapse allstring
County

latitudeCollapse allnumberdouble
Latitude

longitudeCollapse allnumberdouble
Longitude

primaryAddressCollapse allstring
Primary address used for communication

EnumCollapse allarray
#0"HOME"
#1"WORK"
Example"WORK"
websiteCollapse allstringuri
Website URL

Example"https://www.aframesoftware.com"
brokerNumCollapse allstring
Broker license number

licenseNumCollapse allstring
Contact license number

salutationLtrCollapse allstring
Letter salutation

Example"John & Jane"
salutationEnvCollapse allstring
Envelope salutation

Example"Mr & Mrs. John Doe"
relationshipRatingCollapse allstring
Relationship rating

EnumCollapse allarray
#0"A"
#1"B"
#2"C"
#3"D"
#4"E"
Example"A"
createDateTimeCollapse allstringdate-time
Date and time the Contact was created

editDateTimeCollapse allstringdate-time
Date and time the Contact was last edited

appUserIdOwnersCollapse allarray<integer>unique
AppUser IDs that own the Contact

Itemsintegerint32
categoriesCollapse allarray<object>
Categories the Contact is associated with

ItemsCollapse allobject
Category data

categoryIdCollapse allintegerint32
Category Id

Example1
teamIdCollapse allintegerint32
Team Id

Example1
nameCollapse allstring
Category Name

Example"Sphere of Influence"
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
Forbidden - The authenticated user does not have permission to update this Contact.

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
Not Found - Contact with the supplied ID does not exist.

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
Unprocessable Content - Validation errors occurred while updating the Contact.

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