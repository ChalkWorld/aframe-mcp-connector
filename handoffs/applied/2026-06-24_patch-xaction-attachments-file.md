<!-- TARGET: PATCH /v1/xaction-attachments/{xactionAttachmentId}/file -->
<!-- FORMAT: RAW_PASTE -->

<!-- SUMMARY -->
Upload or replace the file on a Transaction Attachment

<!-- DESCRIPTION -->
Uploads a file to a Transaction Attachment of type FILE. If a file is already present it is replaced.

<!-- PARAMETERS (Schema view) -->
Path: xactionAttachmentId (integer, required) — ID of the Transaction Attachment.
Query: newFileName (string, optional) — Optional override of the uploaded file's name. Extension must match the uploaded file's extension.
Query: completeMode (string, optional) — Optional override of the implicit "mark as complete" mutation after upload. Enum: DEFAULT, COMPLETE, INCOMPLETE, UNCHANGED.
Request body: multipart/form-data — binary file upload. No JSON schema available; Example Value view is not available for multipart/form-data media types.

<!-- RESPONSES (Schema view) -->
