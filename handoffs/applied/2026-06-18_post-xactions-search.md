<!-- TARGET: POST /v1/xactions/search -->
<!-- FORMAT: PATH_B -->
<!-- SUMMARY: Search Transactions -->
<!-- DESCRIPTION: Search for Transactions using the supplied criteria. Pagination via `page` (0-based) and `pageSize` (max 100) is supported. Use the `includes` array to eagerly load related data (Participants, Events, Attachments) in a single response. -->

<!-- PARAMETERS (Schema view) -->
Request body

application/json
Search criteria, includes list, and pagination settings.

Examples: 
Active Transactions with Participants
Example Value
Schema
APIXactionPagedQueryDtoCollapse allobject
Paged query for xactions

searchCriteriaXactionDtoCollapse allobject
Search criteria for xactions

xactionIdCollapse allintegerint32
Filter by Xaction ID

Example1001
xactionIdsCollapse allarray<integer>unique
Filter by multiple Xaction IDs (limited to 100)

Itemsintegerint32
xactionStagesCollapse allarray<string>unique
Filter by Xaction stage

ItemsCollapse allstring
EnumCollapse allarray
#0"PRE_ACTIVE"
#1"ACTIVE"
#2"UNDER_CONTRACT"
#3"SOLD"
#4"NOT_SOLD"
#5"NOT_ACTIVE"
EnumCollapse allarray
#0"PRE_ACTIVE"
#1"ACTIVE"
#2"UNDER_CONTRACT"
#3"SOLD"
#4"NOT_SOLD"
#5"NOT_ACTIVE"
searchAddressCollapse allstring
General address search across propNum, propStreetDir, propStreet, and propStreetUnit

Example35
propNumCollapse allstring
Filter by property address number

Example123
propStreetDirCollapse allstring
Filter by property street direction

Example"SW"
propStreetCollapse allstring
Filter by property street name

Example"Main"
propStreetUnitCollapse allstring
Filter by property street unit

Example"Apt 4B"
cityCollapse allstring
Filter by property city

Example"Dallas"
stateCollapse allstring
Filter by property state

Example"TX"
zipCollapse allstring
Filter by property zip code

Example75225
xactionEditDateTimeCollapse allobject
Filter by transaction last edit date/time range

fromCollapse allstringdate-time
From date time in ISO-8601 format (inclusive)

Example"2021-01-01T00:00:00Z"
toCollapse allstringdate-time
To date time in ISO-8601 format (inclusive)

Example"2021-01-01T00:00:00Z"
xactionCreateDateTimeCollapse allobject
Filter by transaction creation date/time range

fromCollapse allstringdate-time
From date time in ISO-8601 format (inclusive)

Example"2021-01-01T00:00:00Z"
toCollapse allstringdate-time
To date time in ISO-8601 format (inclusive)

Example"2021-01-01T00:00:00Z"
includesCollapse allarray<string>unique
Specifies additional data / related entities to include in the response

ItemsCollapse allstring
EnumCollapse allarray
#0"PARTICIPANTS"
#1"EVENTS"
#2"ATTACHMENTS"
Example"['PARTICIPANTS', 'EVENTS', 'ATTACHMENTS']"
pageCollapse allinteger≥ 0int32
Page number (0-based)

Default0
Example0
pageSizeCollapse allinteger[1, 100]int32
Page size (max 100)

Default20
Example20


<!-- RESPONSES (Schema view) -->
Responses
Code	Description	Links
200	
Paged list of Transactions matching the criteria.

Media type

application/json
Controls Accept header.
Example Value
Schema
APIXactionPagedResultDtoCollapse allobject
Paged list of APIXactionDigestDto objects

itemsCollapse allarray<object>
List of items

ItemsCollapse allobject
Mid-level Xaction data summary

xactionIdCollapse allintegerint32
ID of the Xaction

xactionStatusCollapse allobject
Status of the transaction

xactionStatusIdCollapse allintegerint32
ID for the transaction status

nameCollapse allstring
Name

sortCollapse allintegerint32
Sort order

xactionStageCollapse allstring
Stage of the transaction

EnumCollapse allarray
#0"PRE_ACTIVE"
#1"ACTIVE"
#2"UNDER_CONTRACT"
#3"SOLD"
#4"NOT_SOLD"
#5"NOT_ACTIVE"
xactionStatusSystemTypeCollapse allstring
Is the status a system type, and if so, which type?

EnumCollapse allarray
#0"XACTION_STATUS_SYSTEM_ACTIVE"
#1"XACTION_STATUS_SYSTEM_CLOSED"
#2"XACTION_STATUS_SYSTEM_FELL_APART"
#3"XACTION_STATUS_SYSTEM_DRAFT"
colorHexCollapse allstring
Color hex code for the status

agentVisibleCollapse allboolean
Flag indicating if the status is visible to agent Team Members

buyerSellerVisibleCollapse allboolean
Flag indicating if the status is visible on the Buyer/Seller portal

addressCollapse allobject
Property address

address1string
address2string
citystring
statestring
zipstring
countrystring
countystring
latitudenumberdouble
longitudenumberdouble
usstateCollapse allstring
EnumCollapse allarray
#0"ALABAMA"
#1"ALASKA"
#2"ARIZONA"
#3"ARKANSAS"
#4"CALIFORNIA"
#5"COLORADO"
#6"CONNECTICUT"
#7"DELAWARE"
#8"FLORIDA"
#9"GEORGIA"
#10"HAWAII"
#11"IDAHO"
#12"ILLINOIS"
#13"INDIANA"
#14"IOWA"
#15"KANSAS"
#16"KENTUCKY"
#17"LOUISIANA"
#18"MAINE"
#19"MARYLAND"
#20"MASSACHUSETTS"
#21"MICHIGAN"
#22"MINNESOTA"
#23"MISSISSIPPI"
#24"MISSOURI"
#25"MONTANA"
#26"NEBRASKA"
#27"NEVADA"
#28"NEW_HAMPSHIRE"
#29"NEW_JERSEY"
#30"NEW_MEXICO"
#31"NEW_YORK"
#32"NORTH_CAROLINA"
#33"NORTH_DAKOTA"
#34"OHIO"
#35"OKLAHOMA"
#36"OREGON"
#37"PENNSYLVANIA"
#38"RHODE_ISLAND"
#39"SOUTH_CAROLINA"
#40"SOUTH_DAKOTA"
#41"TENNESSEE"
#42"TEXAS"
#43"UTAH"
#44"VERMONT"
#45"VIRGINIA"
#46"WASHINGTON"
#47"WEST_VIRGINIA"
#48"WISCONSIN"
#49"WYOMING"
#50"AMERICAN_SAMOA"
#51"DISTRICT_OF_COLUMBIA"
#52"FEDERATED_STATES_OF_MICRONESIA"
#53"GUAM"
#54"MARSHALL_ISLANDS"
#55"NORTHERN_MARIANA_ISLANDS"
#56"PALAU"
#57"PUERTO_RICO"
#58"VIRGIN_ISLANDS"
#59"UNKNOWN"
cszstringstring
propNumCollapse allstring
Street number

Example123
propStreetDirCollapse allstring
Street direction

Example"N"
propStreetCollapse allstring
Street name

Example"Main"
propStreetUnitCollapse allstring
Unit number

Example"Apt 22"
cityCollapse allstring
City

Example"Springfield"
stateCollapse allstring
State

Example"IL"
zipCollapse allstring
Zip code

Example62701
timeZoneCollapse allstring
Default time zone of the transaction

Example"America/Chicago"
xactionSideCollapse allstring
Side of the transaction

EnumCollapse allarray
#0"BUYER"
#1"SELLER"
#2"DUAL"
listPriceCollapse allnumber
List price of the property

Example1000000
listPriceOriginalCollapse allnumber
Original list price of the property

Example1100000
contractPriceCollapse allnumber
Contract price of the property

Example1000000
percentageCommissionCollapse allnumber
Percentage commission for 'your side' of the transaction in decimal format (e.g. 0.03 for 3%)

Example0.03
listDateCollapse allstringdate
Date when the property was listed

onMarketDateCollapse allstringdate
Date the property was put on the market

Example"2026-04-02"
expireDateCollapse allstringdate
Date when the listing expires

effectiveDateCollapse allstringdate
Effective date of the transaction

closingDateCollapse allstringdate
Closing date of the transaction

closedDateCollapse allstringdate
Date when the transaction was closed

createDateTimeCollapse allstringdate-time
Date and time when the transaction was created

editDateTimeCollapse allstringdate-time
Date and time when the transaction was last edited

xactionFieldDataCollapse allobject
Custom fields for the transaction mapped by MergeFieldCode (or FieldId if no MergeFieldCode is available)

Additional propertiesstring
appUserPrimaryAgentCollapse allobject
Primary agent

appUserIdCollapse allintegerint32
ID of the AppUser

profileUrlCollapse allstringuri
URL to the AppUser's profile picture

contactCollapse allobject
Contact information for the AppUser

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

appUserCoAgentCollapse allobject
Co-agent

appUserIdCollapse allintegerint32
ID of the AppUser

profileUrlCollapse allstringuri
URL to the AppUser's profile picture

contactCollapse allobject
Contact information for the AppUser

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

appUserAssistant1Collapse allobject
TC / Assistant 1

appUserIdCollapse allintegerint32
ID of the AppUser

profileUrlCollapse allstringuri
URL to the AppUser's profile picture

contactCollapse allobject
Contact information for the AppUser

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

appUserAssistant2Collapse allobject
TC / Assistant 2

appUserIdCollapse allintegerint32
ID of the AppUser

profileUrlCollapse allstringuri
URL to the AppUser's profile picture

contactCollapse allobject
Contact information for the AppUser

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

xactionParticipantsCollapse allarray<object>
Participants (Contacts) assigned to the transaction

ItemsCollapse allobject
Transaction Participant digest data

xactionParticipantIdCollapse allintegerint32
ID of the XactionParticipant

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

agentVisibleCollapse allboolean
Whether the participant is visible on the Agent portal

buyerSellerVisibleCollapse allboolean
Whether the participant is visible on the Buyer/Seller portal

eventsCollapse allarray<object>
Events (dates) for the transaction

ItemsCollapse allobject
Minimal Event data suitable for nesting inside other API DTOs

eventIdCollapse allintegerint32
ID of the Event

Example12345
titleCollapse allstring
Event title

Example"Closing Date"
locationCollapse allstring
Event location

colorCollapse allstring
Color of the event

EnumCollapse allarray
#0"NONE"
#1"RED"
#2"TANGERINE"
#3"TAUPE"
#4"YELLOW"
#5"LIME"
#6"GREEN"
#7"CYAN"
#8"TEAL"
#9"COBALT"
#10"PURPLE"
#11"MAGENTA"
Default"NONE"
allDayEventCollapse allboolean
Whether the event spans the entire day

startDateCollapse allstringdate
Date the event starts

Example"2024-01-31"
startTimeCollapse allstring
Time the event starts

Example"14:30"
durationMinutesCollapse allintegerint32
Duration of the event in minutes

Example90
timeZoneCollapse allobject
Time zone of the event

zoneIdCollapse allstring
Time zone ID

Example"America/New_York"
fullNameCollapse allstring
Time zone full name

Example"America/New_York (ET)"
shortNameCollapse allstring
Time zone short name

Example"ET"
completedCollapse allboolean
Whether the event has been completed

xactionAttachmentsCollapse allarray<object>
Attachments (files & web links) for the transaction

ItemsCollapse allobject
Minimal XactionAttachment data summary

xactionAttachmentIdCollapse allintegerint32
ID of the XactionAttachment

attachmentTypeCollapse allstring
Attachment type

EnumCollapse allarray
#0"FILE"
#1"URL"
titleCollapse allstring≤ 100 characters
Attachment title

colorCollapse allstring
Color

EnumCollapse allarray
#0"NONE"
#1"RED"
#2"TANGERINE"
#3"TAUPE"
#4"YELLOW"
#5"LIME"
#6"GREEN"
#7"CYAN"
#8"TEAL"
#9"COBALT"
#10"PURPLE"
#11"MAGENTA"
Default"NONE"
webLinkCollapse allstringuri≤ 500 characters
Web link for attachments of AttachmentType.URL

fileInfoCollapse allobject
File information for attachments of AttachmentType.FILE

fileNameCollapse allstring
File Name

Example"document.pdf"
physicalFileNameCollapse allstring
The name of the file as stored in the file store

Example"xxxx-xxxx-xxxx-xxxx.pdf"
contentTypeCollapse allstring
Content Type of the file

Example"application/pdf"
fileSizeBytesCollapse allintegerint64
File Size in bytes

Example204800
requiredCollapse allboolean
Whether the attachment is required

completedCollapse allboolean
Whether the attachment is completed

pageMetadataCollapse allobject
Page metadata

pageCollapse allintegerint32
The current page number, 0-based

pageSizeCollapse allintegerint32
The current page size

totalElementsOnPageCollapse allintegerint32
Number of elements on page

totalElementsCollapse allintegerint32
Total number of elements

hasNextPageCollapse allboolean
Has next page

lastPageCollapse allintegerint32
Last page number

groupCountsCollapse allobject
Optional map of group counts if grouping is applied

Additional propertiesintegerint32
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
422	
Unprocessable Content - Invalid search criteria (e.g. pageSize out of range).

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