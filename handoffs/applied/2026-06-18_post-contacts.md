<!-- TARGET: POST /v1/contacts -->
<!-- FORMAT: RAW_PASTE -->

<!-- SUMMARY -->
Create a Contact

<!-- DESCRIPTION -->
Creates a new Contact on the authenticated user's Team. A Contact must have either a first & last name, or a company name, to be valid. See `APIContactCreateDto` for the full list of accepted fields.

<!-- PARAMETERS (Schema view) -->
APIContactCreateDtoCollapse allobject
Data for creating a Contact

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


<!-- RESPONSES (Schema view) -->
Responses
Code	Description	Links
201	
Contact created successfully.

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
404	
Not Found - A referenced resource (such as a Category) could not be found.

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
Unprocessable Content - The Contact data is invalid or missing required fields.

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