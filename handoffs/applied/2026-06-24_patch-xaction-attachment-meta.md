<!-- TARGET: PATCH /v1/xaction-attachments/{xactionAttachmentId} -->
<!-- FORMAT: RAW_PASTE -->

<!-- SUMMARY -->
Patch a Transaction Attachment

<!-- DESCRIPTION -->
Updates the specified Transaction Attachment using JSON Patch (RFC 6902) operations. See APIXactionAttachmentPatchDto for the patchable fields. Attempts to patch fields outside this set return 400.

<!-- PARAMETERS (Schema view) -->
Request body

application/json-patch+json
JSON Patch operations describing the changes to apply. See APIXactionAttachmentPatchDto for allowed paths.

Examples: 
Update title
Example Value
Schema
APIXactionAttachmentPatchDtoCollapse allobject
Fields that may be targeted by a JSON Patch (RFC 6902) against a XactionAttachment; to upload, replace, remove, or reassign the file itself, use the dedicated /file sub-routes instead

attachmentTypeCollapse allstring
Attachment type

EnumCollapse allarray
#0"FILE"
#1"URL"
titleCollapse allstring≤ 300 characters
Attachment title

descriptionCollapse allstring≤ 65535 characters
Attachment description

webLinkCollapse allstringuri
URL link (applicable when attachmentType is URL)

fileNameCollapse allstring
File name of the stored file (used to rename without re-uploading; the extension must match)

requiredCollapse allboolean
Whether the attachment is required

completedCollapse allboolean
Whether the attachment is completed

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
agentVisibleCollapse allboolean
Whether the attachment is visible on the Agent Portal

buyerSellerVisibleCollapse allboolean
Whether the attachment is visible on the Buyer/Seller Portal

mergeFieldCodeCollapse allstring
Merge field code

sortCollapse allintegerint32
Sort order within the Folder

folderIdCollapse allintegerint32
ID of the Folder to move the attachment to; mutually exclusive with newFolderName

newFolderNameCollapse allstring
Name of a new Folder to create and move the attachment to; mutually exclusive with folderId


<!-- RESPONSES (Schema view) -->
Responses
Code	Description	Links
200	
The updated Transaction Attachment.

Media type

application/json
Controls Accept header.
Example Value
Schema
APIXactionAttachmentDtoCollapse allobject
XactionAttachment data

xactionAttachmentIdCollapse allintegerint32
ID of the XactionAttachment

Example12345
xactionIdCollapse allintegerint32
ID of the associated Xaction

appUserIdCollapse allintegerint32
ID of the AppUser who created the entry or uploaded the attachment

attachmentTypeCollapse allstring
Attachment type

EnumCollapse allarray
#0"FILE"
#1"URL"
titleCollapse allstring≤ 100 characters
Title

descriptionCollapse allstring≤ 500 characters
Description

fileNameCollapse allstring≤ 255 characters
File name

contentTypeCollapse allstring≤ 100 characters
Content type (MIME)

fileSizeBytesCollapse allintegerint64
File size in bytes

fileUploadDateTimeCollapse allstringdate-time
Date and time the file was uploaded

webLinkCollapse allstringuri≤ 500 characters
Web link for attachments of AttachmentType.URL

requiredCollapse allboolean
Whether the attachment is required

Exampletrue
completedCollapse allboolean
Whether the attachment is completed

Examplefalse
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
agentVisibleCollapse allboolean
Whether the attachment is visible on the Agent Portal

buyerSellerVisibleCollapse allboolean
Whether the attachment is visible on the Buyer/Seller Portal

mergeFieldCodeCollapse allstring≤ 100 characters
Merge field code

sortCollapse allintegerint32
Sort order

createDateTimeCollapse allstringdate-time
Date and time the record was created

folderCollapse allobject
Folder containing this attachment (null if not in a folder)

folderIdCollapse allintegerint32
ID of the Folder

Example12345
nameCollapse allstring
Folder name

Example"Listing Files"
sortCollapse allintegerint32
Sort order

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
Forbidden - The authenticated user does not have permission to update this Transaction Attachment.

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
Not Found - Transaction Attachment with the supplied ID does not exist.

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
Unprocessable Content - Validation errors occurred.

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