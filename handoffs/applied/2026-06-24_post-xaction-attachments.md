<!-- TARGET: POST /v1/xaction-attachments -->
<!-- FORMAT: RAW_PASTE -->

<!-- SUMMARY -->
Create a Transaction Attachment

<!-- DESCRIPTION -->
Creates a new Transaction Attachment record (metadata only). To attach a file, first create the attachment with this endpoint, then upload the file to `PATCH /xaction-attachments/{id}/file`.

<!-- PARAMETERS (Schema view) -->
Request body

application/json
Transaction Attachment creation data.

Example Value
Schema
APIXactionAttachmentCreateDtoCollapse allobject
XactionAttachment create model (metadata only; upload the file separately via PATCH /xaction-attachments/{id}/file)

xactionIdCollapse allintegerint32
ID of the Xaction the attachment belongs to

Example123
folderIdCollapse allintegerint32
ID of the Folder to place the attachment in; mutually exclusive with newFolderName

Example456
newFolderNameCollapse allstring
Name of a new Folder to create and place the attachment in; mutually exclusive with folderId

attachmentTypeCollapse allstring
Attachment type

EnumCollapse allarray
#0"FILE"
#1"URL"
titleCollapse allstring≤ 300 characters
Attachment title

Example"Purchase Agreement"
descriptionCollapse allstring≤ 65535 characters
Attachment description

webLinkCollapse allstringuri
URL link (required when attachmentType is URL)

Example"https://example.com"
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


<!-- RESPONSES (Schema view) -->
Responses
Code	Description	Links
200	
Transaction Attachment created.

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
Forbidden - The authenticated user does not have permission.

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
Not Found - A related entity (Xaction, Folder) was not found.

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