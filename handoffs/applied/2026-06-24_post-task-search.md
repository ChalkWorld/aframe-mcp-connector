<!-- TARGET: POST /v1/tasks/search -->
<!-- FORMAT: Path B — raw paste -->

<!-- SUMMARY -->
Search Tasks

<!-- DESCRIPTION -->
Search for Tasks using the supplied criteria. Pagination via `page` (0-based) and `pageSize` (max 100) is supported.

<!-- PARAMETERS (Schema view) -->
Request body

application/json
Search criteria and pagination settings.

Examples: 
Open Tasks Due This Year
Example Value
Schema
APITaskPagedQueryDtoCollapse allobject
Request wrapper for paginated Task search containing search criteria and pagination parameters

taskSearchCriteriaDtoCollapse allobject
Task search criteria

taskStatusesCollapse allarray<string>unique
Filter by task statuses

ItemsCollapse allstring
EnumCollapse allarray
#0"OPEN"
#1"IN_PROGRESS"
#2"COMPLETE"
EnumCollapse allarray
#0"OPEN"
#1"IN_PROGRESS"
#2"COMPLETE"
ExampleCollapse allarray
#0"OPEN"
#1"IN_PROGRESS"
dueDateCollapse allobject
Filter by due date range

fromCollapse allstringdate
From date (inclusive)

Example"2021-01-01"
toCollapse allstringdate
To date (inclusive)

Example"2021-01-01"
completeDateCollapse allobject
Filter by complete date range

fromCollapse allstringdate
From date (inclusive)

Example"2021-01-01"
toCollapse allstringdate
To date (inclusive)

Example"2021-01-01"
xactionIdCollapse allintegerint32
Filter by ID of the associated Xaction

Example123
contactIdCollapse allintegerint32
Filter by ID of the associated Contact

Example456
assigneesCollapse allarray<integer>unique
Filter by IDs of the assignee AppUsers

Itemsintegerint32
ExampleCollapse allarray
#0123
#1456
completedByCollapse allarray<integer>unique
Filter by IDs of the AppUsers who completed the task

Itemsintegerint32
ExampleCollapse allarray
#0123
#1456
pageCollapse allinteger≥ 0int32
Page number (0-based)

Example0
pageSizeCollapse allinteger[1, 100]int32
Number of items per page (max 100)

Example20


<!-- RESPONSES (Schema view) -->
Responses
Code	Description	Links
200	
Paged list of Tasks matching the criteria.

Media type

application/json
Controls Accept header.
Example Value
Schema
APITaskPagedResultDtoCollapse allobject
Paged list of Task digest results

itemsCollapse allarray<object>
List of items

ItemsCollapse allobject
Task summary data

taskIdCollapse allintegerint32
ID of the Task

xactionCollapse allobject
Associated Xaction

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

xactionSideCollapse allstring
Side of the transaction

EnumCollapse allarray
#0"BUYER"
#1"SELLER"
#2"DUAL"
closingDateCollapse allstringdate
Closing date

closedDateCollapse allstringdate
Closed date

currentPriceCollapse allnumber
Current price (list or contract depending on stage)

Example1000000
timeZoneCollapse allobject
Time zone of the transaction

zoneIdCollapse allstring
Time zone ID

Example"America/New_York"
fullNameCollapse allstring
Time zone full name

Example"America/New_York (ET)"
shortNameCollapse allstring
Time zone short name

Example"ET"
editDateTimeCollapse allstringdate-time
Date and time the entity was last edited

contactCollapse allobject
Associated Contact

contactIdCollapse allintegerint32
ID of the Contact

associatedAppUserIdCollapse allintegerint32
ID of the associated AppUser, if the Contact is a team member

namesDisplayCollapse allstring
Display name(s) of the contact

nameCollapse allobject
Main contact name

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

nameAltContactCollapse allobject
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

editDateTimeCollapse allstringdate-time
Date and time the contact was last edited

folderCollapse allobject
Associated Folder

folderIdCollapse allintegerint32
Folder Id

teamIdCollapse allintegerint32
Team Id

contactIdCollapse allintegerint32
Contact Id

xactionIdCollapse allintegerint32
Xaction Id

nameCollapse allstring
Folder Name

folderTypeCollapse allstring
Folder Type

EnumCollapse allarray
#0"TEAM_ATTACHMENTS"
#1"LETTER_TEMPLATES"
#2"TASK_TEMPLATES"
#3"EVENT_TEMPLATES"
#4"ATTACHMENT_TEMPLATES"
#5"XACTION_ATTACHMENTS"
#6"TASKS"
#7"EVENTS"
Example"XACTION_ATTACHMENTS"
renderClosedCollapse allboolean
Render folder initially closed?

sortCollapse allintegerint32
Sort number

appUserCollapse allobject
AppUser assigned to the task

appUserIdCollapse allintegerint32
ID of the AppUser

nameCollapse allstring
Full name of the AppUser

initialsCollapse allstring
Initials of the AppUser

profileUrlCollapse allstringuri
URL to the AppUser's profile picture

timeZoneCollapse allobject
Time zone for the AppUser

zoneIdCollapse allstring
Time zone ID

Example"America/New_York"
fullNameCollapse allstring
Time zone full name

Example"America/New_York (ET)"
shortNameCollapse allstring
Time zone short name

Example"ET"
taskTypeCollapse allstring
Task type

EnumCollapse allarray
#0"TODO"
#1"PHONE"
#2"LETTER"
#3"EMAIL"
statusCollapse allstring
Task status

EnumCollapse allarray
#0"OPEN"
#1"IN_PROGRESS"
#2"COMPLETE"
subjectCollapse allstring
Task subject/title

noteCollapse allstring
Task notes/description

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
dueDateCollapse allstringdate
Due date

Example"2026-01-15"
dueTimeCollapse allstring
Due time

Example"14:30"
timeZoneCollapse allobject
Time zone for due date/time

zoneIdCollapse allstring
Time zone ID

Example"America/New_York"
fullNameCollapse allstring
Time zone full name

Example"America/New_York (ET)"
shortNameCollapse allstring
Time zone short name

Example"ET"
completeDateCollapse allstringdate
Completion date

Example"2026-01-15"
completedByCollapse allobject
AppUser who completed the task

appUserIdCollapse allintegerint32
ID of the AppUser

nameCollapse allstring
Full name of the AppUser

initialsCollapse allstring
Initials of the AppUser

profileUrlCollapse allstringuri
URL to the AppUser's profile picture

timeZoneCollapse allobject
Time zone for the AppUser

zoneIdCollapse allstring
Time zone ID

Example"America/New_York"
fullNameCollapse allstring
Time zone full name

Example"America/New_York (ET)"
shortNameCollapse allstring
Time zone short name

Example"ET"
recurringCollapse allboolean
Whether the task is recurring

dueDateAdjustActiveCollapse allboolean
Whether due date adjustment is active

dueDateAdjustStatusCollapse allstring
Due date adjustment status (computed)

EnumCollapse allarray
#0"INCOMPLETE"
#1"WAITING"
#2"SET"
#3"NOT_ADJUSTING"
dueDateAdjustRefTaskParentContingentCollapse allboolean
Whether the parent task is contingent

dueDateAdjustRefTaskIdParentCollapse allintegerint32
ID of the parent Task for due date adjustment

dueDateAdjustRefTaskParentSubjectCollapse allstring
Subject of the parent task for due date adjustment

dueDateAdjustRefMergeFieldCodeCollapse allstring
Due date adjustment reference merge field code

is_contingentChildHiddenCollapse allboolean
Whether the contingent child is hidden

reminderSetCollapse allboolean
Whether a reminder is set

prospectingCollapse allboolean
Whether the task is a prospecting task

onCalendarCollapse allboolean
Whether the task appears on the calendar

milestoneCollapse allboolean
Whether the task is a milestone

agentVisibleCollapse allboolean
Whether the task is visible to the agent

buyerSellerVisibleCollapse allboolean
Whether the task is visible to the buyer/seller

editDateTimeCollapse allstringdate-time
Last edit date/time

createDateTimeCollapse allstringdate-time
Creation date/time

taskNoteCountCollapse allintegerint32
Number of task notes

taskLetterTemplateCountCollapse allintegerint32
Number of associated letter templates

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