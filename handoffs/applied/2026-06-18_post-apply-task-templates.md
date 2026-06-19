<!-- TARGET: POST /v1/xactions/{xactionId}/apply-task-templates -->
<!-- FORMAT: PATH_B -->
<!-- SUMMARY: Apply TaskTemplates to a Transaction -->
<!-- DESCRIPTION: Applies one or more TaskTemplates to the specified Transaction. Each TaskTemplate's entries are converted into individual Tasks attached to the Transaction. Invalid TaskTemplate IDs are skipped and reported as warnings in the response; if all IDs are invalid the request fails with a validation error. -->

<!-- PARAMETERS (Schema view) -->
Name: xactionId | Type: integer (int32) | Location: path | Required: yes | Description: ID of the Transaction to apply the TaskTemplates to. Example: 123

Request body | Content-Type: application/json | DTO: APIXactionApplyTaskTemplatesRequestDto
Description: Request to apply one or more TaskTemplates to an existing Xaction; each TaskTemplate's entries are converted into individual Tasks attached to the Xaction.

| Field | Type | Required | Description |
|---|---|---|---|
| taskTemplateIds | array<integer (int32)> | yes | IDs of the TaskTemplates to apply; invalid IDs are skipped with a warning, and if all IDs are invalid the request fails with a validation error. Example: [123, 456] |
| startDate | string (date) | no | Start date used when computing due dates for generated Tasks; if omitted, defaults to today in the authenticated user's time zone. Example: "2026-04-23" |

<!-- RESPONSES (Schema view) -->
Responses
Code	Description	Links
200	
The Tasks created from the applied TaskTemplates.

Media type

application/json
Controls Accept header.
Example Value
Schema
APITaskBriefDtoCollapse allobject
Minimal Task summary

taskIdCollapse allintegerint32
ID of the Task

contactIdCollapse allintegerint32
ID of the associated Contact

xactionIdCollapse allintegerint32
ID of the associated Xaction

appUserIdCollapse allintegerint32
ID of the AppUser assigned to the task

folderIdCollapse allintegerint32
ID of the associated Folder

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
completeDateCollapse allstringdate
Completion date

Example"2026-01-15"
appUserIdCompletedByCollapse allintegerint32
ID of the AppUser who completed the task

editDateTimeCollapse allstringdate-time
Last edit date/time

createDateTimeCollapse allstringdate-time
Creation date/time

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
Forbidden - The authenticated user does not have permission to access this Transaction.

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
Not Found - Transaction with the supplied ID does not exist.

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
Unprocessable Content - No valid TaskTemplate IDs were supplied.

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