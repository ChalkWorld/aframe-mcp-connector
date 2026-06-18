<!-- TARGET: GET /v1/xaction-participant-roles -->
<!-- FORMAT: RAW_PASTE -->

<!-- SUMMARY -->
List Transaction Participant Roles

<!-- DESCRIPTION -->
Returns every Transaction Participant Role defined for the authenticated user's Team. Roles identify the part each Participant plays in a Transaction (e.g. Buyer, Listing Agent, Lender).

<!-- PARAMETERS (Schema view) -->


<!-- RESPONSES (Schema view) -->
Responses
Code	Description	Links
200	
List of Transaction Participant Roles.

Media type

application/json
Controls Accept header.
Example Value
Schema
Collapse allarray<object>
ItemsCollapse allobject
Transaction Participant Role

xactionParticipantRoleIdCollapse allintegerint32
ID of the XactionParticipantRole

nameCollapse allstring
Name of the role

sortCollapse allintegerint32
Sort order for display

mergeFieldCodePrefixCollapse allstring
Merge field code prefix used in templates

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