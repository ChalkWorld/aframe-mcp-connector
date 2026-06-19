<!-- TARGET: GET /v1/task-templates -->
<!-- FORMAT: PATH_B -->
<!-- SUMMARY: List Task Templates -->
<!-- DESCRIPTION: Returns every Task Template defined for the Team. Optionally filter by taskTemplateType to return only templates for Contacts or Transactions. -->

<!-- PARAMETERS (Schema view) -->
Name: taskTemplateType | Type: string | Location: query | Required: no | Description: Scope the results to templates that apply to Contacts or Transactions. Omit for all templates. | Enum: CONTACT, XACTION | Example: XACTION

<!-- RESPONSES (Schema view) -->
Responses
Code	Description	Links
200	
List of Task Templates.

Media type

application/json
Controls Accept header.
Example Value
Schema
Collapse allarray<object>
ItemsCollapse allobject
Represents a TaskTemplate record.

taskTemplateIdCollapse allintegerint32
ID for the Task Template

teamIdCollapse allintegerint32
ID for the team the user belongs to

nameCollapse allstring
Task Template Name

descriptionCollapse allstring
Task Template Description

taskTemplateTypeCollapse allstring
Specifies if the Task Template is for a Contact or Transaction.

EnumCollapse allarray
#0"CONTACT"
#1"XACTION"
folderCollapse allobject
Containing folder for the Task Template

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

taskFolderNameCollapse allstring
The folder that will be created when the Task Template is applied to a Contact or Transaction.

sortCollapse allintegerint32
Sort order for the Task Template

No links
400	
Bad Request - taskTemplateType value is not a recognized enum.

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