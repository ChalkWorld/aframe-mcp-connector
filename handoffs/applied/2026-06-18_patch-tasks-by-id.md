<!-- TARGET: PATCH /v1/tasks/{taskId} -->
<!-- FORMAT: RAW_PASTE -->

<!-- SUMMARY -->
Update a Task

<!-- DESCRIPTION -->
Updates the specified Task using JSON Patch (RFC 6902) operations. Returns an abbreviated Task representation (APITaskDigestDto).

<!-- PARAMETERS (Schema view) -->
Request body

application/json-patch+json
JSON Patch operations describing the changes to apply. See APITaskPatchDto for available paths.

Examples: 
Complete a Task
Example Value
Schema
APITaskPatchDtoCollapse allobject
Data for patching/updating a Task (limited fields)

statusCollapse allstring
Task status

EnumCollapse allarray
#0"OPEN"
#1"IN_PROGRESS"
#2"COMPLETE"
taskTypeCollapse allstring
Task type

EnumCollapse allarray
#0"TODO"
#1"PHONE"
#2"LETTER"
#3"EMAIL"
subjectCollapse allstring≤ 255 characters
Task subject/title

noteCollapse allstring≤ 65535 characters
Task description

appUserIdCollapse allintegerint32
ID of the AppUser assigned to the task

appUserIdCompletedByCollapse allintegerint32
ID of the AppUser who completed the task

agentVisibleCollapse allboolean
Whether the task is visible on the agent portal

buyerSellerVisibleCollapse allboolean
Whether the task is visible on the buyer/seller portal

prospectingCollapse allboolean
Whether the task is a prospecting task

onCalendarCollapse allboolean
Whether the task is included in the calendar feed

milestoneCollapse allboolean
Whether the task is a milestone

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
expenseCollapse allnumber
Task expense amount

Example100
dueDateAdjustRefTaskIdParentCollapse allintegerint32
ID of the parent Task for due date adjustment

dueDateAdjustRefTaskParentContingentCollapse allboolean
Whether the task is hidden when the parent task is not complete

dateAdjustReferenceCodeCollapse allstring≤ 255 characters
Merge field code for auto-adjusting the date

dueDateAdjustmentRulesIdCollapse allintegerint32
ID of the date adjustment rules (date calculator)

dueDateAdjustActiveCollapse allboolean
Whether auto-adjusting due date is enabled

dueDateAdjustTypeCollapse allstring
Due date adjustment type

EnumCollapse allarray
#0"TEMPLATE_START_DATE"
#1"PARENT_TASK"
#2"XACTION_LIST_DATE"
#3"XACTION_ON_MARKET_DATE"
#4"XACTION_EXPIRE_DATE"
#5"XACTION_EFFECTIVE_DATE"
#6"EVENT_MERGE_FIELD_CODE"
dueDateAdjustDeltaCollapse allintegerint32
Number of days to auto-adjust the due date

dueDateAdjustReminderDeltaCollapse allintegerint32
Number of days to auto-adjust the reminder date

dueDateCollapse allstringdate
Due date

Example"2026-01-15"
dueTimeCollapse allstring
Due time

Example"14:30"
taskTZCollapse allstring≤ 100 characters
Time zone for the task

completeDateCollapse allstringdate
Completion date

Example"2026-01-15"
reminderSetCollapse allboolean
Whether a reminder is set for the task

reminderDateCollapse allstringdate
Reminder date

Example"2026-01-15"
reminderTimeCollapse allstring
Reminder time

Example"14:30"
folderIdCollapse allintegerint32
ID of the associated Folder

newFolderNameCollapse allstring≤ 255 characters
Create a new folder with this name

<!-- RESPONSES (Schema view) -->
Responses
Code	Description	Links
200	
The updated Task (abbreviated view).

Media type

application/json
Controls Accept header.
Example Value
Schema
APITaskDigestDtoCollapse allobject
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
Forbidden - The authenticated user does not have permission to update this Task.

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
Not Found - Task with the supplied ID does not exist.

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
Unprocessable Content - Validation errors occurred while updating the Task.

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