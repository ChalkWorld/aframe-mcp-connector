<!-- TARGET: GET /v1/tasks/{taskId} -->
<!-- FORMAT: Path B — raw paste -->

<!-- SUMMARY -->
Get a Task

<!-- DESCRIPTION -->
Returns the Task with the supplied ID. The authenticated user must have permission to access the Task.

<!-- PARAMETERS (Schema view) -->
taskId (path, integer, required) — ID of the Task to fetch.

<!-- RESPONSES (Schema view) -->
Responses
Code	Description	Links
200	
The Task details.

Media type

application/json
Controls Accept header.
Example Value
Schema
APITaskDtoCollapse allobject
Task with detailed information

teamIdCollapse allintegerint32
ID of the Team

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
dueTimeMinutesCollapse allintegerint32
Due time in minutes from midnight

dueTimeCollapse allstring
Due time (converted from dueTimeMinutes)

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
recurringCollapse allboolean
Whether the task is recurring

recurringFrequencyCollapse allstring
Recurring frequency

EnumCollapse allarray
#0"DAILY"
#1"WEEKLY"
#2"MONTHLY"
#3"YEARLY"
recurringSeparationCountCollapse allintegerint32
Recurring separation count

recurringEndDateCollapse allstringdate
Recurring end date

recurringCountCollapse allintegerint32
Recurring count

recurringDayOfWeekCollapse allstring
Recurring day of week

EnumCollapse allarray
#0"MONDAY"
#1"TUESDAY"
#2"WEDNESDAY"
#3"THURSDAY"
#4"FRIDAY"
#5"SATURDAY"
#6"SUNDAY"
recurringDayOfMonthCollapse allintegerint32
Recurring day of month

recurringMonthOfYearCollapse allstring
Recurring month of year

EnumCollapse allarray
#0"JANUARY"
#1"FEBRUARY"
#2"MARCH"
#3"APRIL"
#4"MAY"
#5"JUNE"
#6"JULY"
#7"AUGUST"
#8"SEPTEMBER"
#9"OCTOBER"
#10"NOVEMBER"
#11"DECEMBER"
dueDateAdjustActiveCollapse allboolean
Whether due date adjustment is active

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
dueDateAdjustRefMergeFieldCodeCollapse allstring
Due date adjustment reference merge field code

dueDateAdjustRefTaskIdParentCollapse allintegerint32
ID of the parent Task for due date adjustment

dueDateAdjustRefTaskParentSubjectCollapse allstring
Subject of the parent task for due date adjustment

dueDateAdjustRefTaskParentContingentCollapse allboolean
Whether the parent task is contingent

dateAdjustReferenceCodeCollapse allstring
Date adjustment reference code

dueDateAdjustDeltaCollapse allintegerint32
Due date adjustment delta in days

dueDateAdjustReminderDeltaCollapse allintegerint32
Due date adjustment reminder delta in days

dueDateAdjustmentRulesIdCollapse allintegerint32
ID of the date adjustment rules

dueDateAdjustmentRulesNameCollapse allstring
Name of the date adjustment rules

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
editDateTimeCollapse allstringdate-time
Last edit date/time

createDateTimeCollapse allstringdate-time
Creation date/time

reminderSetCollapse allboolean
Whether a reminder is set

reminderDateCollapse allstringdate
Reminder date

Example"2026-01-15"
reminderTimeMinutesCollapse allintegerint32
Reminder time in minutes from midnight

reminderTimeCollapse allstring
Reminder time (converted from reminderTimeMinutes)

Example"14:30"
sortByDateCollapse allintegerint32
Sort by date value

sortByFolderCollapse allintegerint32
Sort by folder value

templateSortOrderCollapse allintegerint32
Template sort order

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

expenseCollapse allnumber
Task expense amount

Example100
is_contingentChildHiddenCollapse allboolean
Whether the contingent child is hidden

get_alarmDateTimeCollapse allstringdate-time
Alarm date/time

get_dueDateTimeCollapse allstringdate-time
Due date/time as instant

reminderDestinationsCollapse allarray<object>
Reminder override destinations

ItemsCollapse allobject
methodCollapse allstring
Reminder Destination Method

EnumCollapse allarray
#0"EMAIL_USER"
#1"SMS_USER"
#2"EMAIL_CUSTOM"
#3"SMS_CUSTOM"
appUserIdCollapse allintegerint32
AppUser Id for custom destinations. Required when method is EMAIL_USER or SMS_USER

destinationCollapse allstring
Custom destination. Required when method is EMAIL_CUSTOM or SMS_CUSTOM and must be a valid email or phone number

taskLetterTemplatesCollapse allarray<object>
Associated letter templates

ItemsCollapse allobject
Task Letter Template data

taskLetterTemplateIdCollapse allintegerint32
Task Letter Template Id

taskIdCollapse allintegerint32
Task Id

letterTemplateCollapse allobject
Letter Template

letterTemplateIdCollapse allintegerint32
Entity Id

Example1
teamIdCollapse allintegerint32
Team Id

Example1
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

typeCollapse allstring
Is this templates used for Contacts or Xactions?

EnumCollapse allarray
#0"TEAM"
#1"CONTACT"
#2"XACTION"
#3"EVENT"
#4"TASK"
#5"CONTACT_NOTE"
#6"EMAIL_QUEUE"
#7"APPUSER"
#8"FOLDER"
#9"XACTION_ATTACHMENT"
#10"XACTION_ACTIVITY"
#11"XACTION_PARTICIPANT"
Example"CONTACT, XACTION"
nameCollapse allstring
Name

descriptionCollapse allstring
Description

noteCollapse allstring
Note

systemTemplateCollapse allboolean
True if system template

Exampletrue
sortCollapse allintegerint32
Sort Order

No links
403	
Forbidden - The authenticated user does not have permission to access this Task.

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