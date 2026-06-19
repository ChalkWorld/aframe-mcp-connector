<!-- TARGET: GET /v1/categories -->
<!-- FORMAT: PATH_B -->
<!-- SUMMARY: List Contact Categories -->
<!-- DESCRIPTION: Returns every Contact Category defined on the authenticated user's Team. Contact Categories are the tags used throughout the app to classify Contacts for easier searching. -->

<!-- PARAMETERS (Schema view) -->
No parameters

<!-- RESPONSES (Schema view) -->
Responses
Code	Description	Links
200	
List of Contact Categories for the Team.

Media type

application/json
Controls Accept header.
Example Value
Schema
Collapse allarray<object>
ItemsCollapse allobject
Category data

categoryIdCollapse allintegerint32
Category Id

Example1
teamIdCollapse allintegerint32
Team Id

Example1
nameCollapse allstring
Category Name

Example"Sphere of Influence"
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