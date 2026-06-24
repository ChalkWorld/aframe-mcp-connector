<!-- TARGET: PATCH /v1/xaction-attachments/{xactionAttachmentId}/file/unassign -->
<!-- FORMAT: RAW_PASTE -->

<!-- SUMMARY -->
Unassign a file from a Transaction Attachment

<!-- DESCRIPTION -->
Removes the file from the Transaction Attachment and creates a new, untitled Transaction Attachment that owns the file. The original Attachment is marked incomplete. Only applies when the original has a file and is a placeholder (the title is non-blank). The newly created Attachment is returned.

<!-- PARAMETERS (Schema view) -->


<!-- RESPONSES (Schema view) -->