<!-- TARGET: GET /v1/xactions/{xactionId}/field-tree -->
<!-- FORMAT: PATH_B -->
<!-- SUMMARY: Get the full custom Field tree for a Transaction -->
<!-- DESCRIPTION: Returns the Team's custom Fields grouped as Field Collections > Field Groups > Fields, with each Field's current value on the given Transaction merged in. Fields that do not yet have a value on the Transaction are included with an empty value. -->

<!-- PARAMETERS (Schema view) -->
Name: xactionId | Type: integer (int32) | Location: path | Required: yes | Description: ID of the Transaction. Example: 123

<!-- RESPONSES (Schema view) -->
Responses
Code	Description	Links
200	
The custom Field tree for the Transaction.

Media type

application/json
Controls Accept header.
Example Value
Schema
XactionFieldTreeDtoCollapse allobject
xactionFieldCollectionsCollapse allarray<object>
ItemsCollapse allobject
fieldCollectionIdintegerint32
fieldCollectionCollapse allobject
Field Collection data. Custom field are organized by Field Collections > Field Groups > Fields.

fieldCollectionIdCollapse allintegerint32
Field Collection Id

teamIdCollapse allintegerint32
Team Id

nameCollapse allstring
Field Collection Name

mergeFieldCodeCollapse allstring
Merge Field Code

sortCollapse allintegerint32
Sort number

xactionFieldGroupsCollapse allarray<object>
ItemsCollapse allobject
fieldGroupIdintegerint32
fieldGroupCollapse allobject
Field Group data. Custom field are organized by Field Collections > Field Groups > Fields.

fieldGroupIdCollapse allintegerint32
Field Group Id

fieldCollectionIdCollapse allintegerint32
Field Collection Id

fieldCollectionNameCollapse allstring
Field Collection Name

nameCollapse allstring
Field Group Name

mergeFieldCodeCollapse allstring
Merge Field Code

sortCollapse allintegerint32
Sort number

xactionFieldsCollapse allarray<object>
ItemsCollapse allobject
fieldIdintegerint32
fieldCollapse allobject
Field data. Custom field are organized by Field Collections > Field Groups > Fields.

fieldIdCollapse allintegerint32
Field Id

teamIdCollapse allintegerint32
Team Id

fieldGroupIdCollapse allintegerint32
Field Group Id

fieldGroupNameCollapse allstring
Field Group Name

labelCollapse allstring
Field Label

placeholderCollapse allstring
Field Placeholder Text (for input fields)

mergeFieldCodeCollapse allstring
Merge Field Code

fieldTypeCollapse allstring
Field Type

EnumCollapse allarray
#0"TEXT"
#1"TEXTAREA"
#2"EMAIL"
#3"URL"
#4"NUMBER"
#5"CURRENCY"
#6"SQFT"
#7"CHOICE"
#8"SYS_MLS_ID"
#9"SYS_LOCKBOX_ID"
#10"SYS_SOURCE"
#11"SYS_PROP_TYPE"
Example"TEXT, TEXTAREA, EMAIL, CHOICE"
choicesCollapse allarray<object>
Valid choices for the field. Only for FieldType CHOICE.

ItemsCollapse allobject
valueCollapse allstring
Choice value

colorCollapse allstring
Choice color (if applicable)

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
multiChoiceCollapse allboolean
Allow multiple Choices for the field?

showDecimalCollapse allboolean
Show Decimal for the field?

sortCollapse allintegerint32
Sort order within the Field Group

xactionFieldCollapse allobject
fieldIdintegerint32
valuestring
colorCollapse allstring
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
omittedboolean
requiredboolean
agentVisibleboolean
buyerSellerVisibleboolean
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