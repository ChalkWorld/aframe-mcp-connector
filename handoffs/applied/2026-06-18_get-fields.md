<!-- TARGET: GET /v1/fields -->
<!-- FORMAT: PATH_B -->
<!-- SUMMARY: List custom Field definitions -->
<!-- DESCRIPTION: Returns a flat, alphabetically-sorted list of every custom Field defined for the Team. Custom Fields store additional structured data on Transactions. -->

<!-- PARAMETERS (Schema view) -->


<!-- RESPONSES (Schema view) -->
Responses
Code	Description	Links
200	
List of custom Field definitions.

Media type

application/json
Controls Accept header.
Example Value
Schema
Collapse allarray<object>
ItemsCollapse allobject
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