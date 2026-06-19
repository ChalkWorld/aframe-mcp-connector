<!-- TARGET: GET /v1/xaction-statuses -->
<!-- FORMAT: PATH_B -->
<!-- SUMMARY: List Transaction Statuses -->
<!-- DESCRIPTION: Returns every Transaction Status defined for the Team. Optionally supply xactionStages to restrict the result to statuses that belong to the given Stages (e.g. ACTIVE, UNDER_CONTRACT). -->

<!-- PARAMETERS (Schema view) -->
Name: xactionStages | Type: string | Location: query | Required: no | Description: Optional list of Transaction Stages to filter by. Supply the query parameter once per value (?xactionStages=ACTIVE&xactionStages=UNDER_CONTRACT). | Enum: PRE_ACTIVE, ACTIVE, UNDER_CONTRACT, SOLD, NOT_SOLD, NOT_ACTIVE

<!-- RESPONSES (Schema view) -->