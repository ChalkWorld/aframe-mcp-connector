---
title: Aframe API Reference — 8. Tasks
parent_doc: API-REF-001
version_date: 2026-06-16
status: Active — Living Document (subdocument)
project: AAR-TC Aframe Connector
---

# 8. Tasks
### Aframe API Endpoint Reference — Category File | Parent: [API-REF-001](README.md)

*Assignable to-do items owned by Team Members, optionally scoped to a Contact or Transaction.*

---

#### `POST /v1/tasks` — Create a task
**Status:** Not extracted

_Schema TBD. See [master](README.md#endpoint-schema-template) for fill-in format._

---

#### `POST /v1/tasks/search` — Search tasks
**Status:** Not extracted

_Schema TBD. See [master](README.md#endpoint-schema-template) for fill-in format._

---

#### `GET /v1/tasks/{taskId}` — Get a task
**Status:** Not extracted

_Schema TBD. See [master](README.md#endpoint-schema-template) for fill-in format._

---

#### `PATCH /v1/tasks/{taskId}` — Update a Task
**Status:** ✅ Extracted 2026-06-18

**Summary:** Update a Task

**Description:** Updates the specified Task using JSON Patch (RFC 6902) operations. Returns an abbreviated Task representation (`APITaskDigestDto`).

**Request**
- Content-Type: `application/json-patch+json`
- Path params:

  | Name | Type | Required | Description |
  |---|---|---|---|
  | `taskId` | integer | yes | ID of the Task to update |

- Body schema (`APITaskPatchDto` — all fields optional, include only fields being patched):

  | Field | Type | Constraints | Description |
  |---|---|---|---|
  | `status` | string (enum) | — | Task status — see Enums |
  | `taskType` | string (enum) | — | Task type — see Enums |
  | `subject` | string | ≤255 chars | Task subject/title |
  | `note` | string | ≤65535 chars | Task description |
  | `appUserId` | integer | — | ID of the AppUser assigned to the task |
  | `appUserIdCompletedBy` | integer | — | ID of the AppUser who completed the task |
  | `agentVisible` | boolean | — | Whether the task is visible on the agent portal |
  | `buyerSellerVisible` | boolean | — | Whether the task is visible on the buyer/seller portal |
  | `prospecting` | boolean | — | Whether the task is a prospecting task |
  | `onCalendar` | boolean | — | Whether the task is included in the calendar feed |
  | `milestone` | boolean | — | Whether the task is a milestone |
  | `color` | string (enum) | default `"NONE"` | Task color — see Enums |
  | `expense` | number | — | Task expense amount |
  | `dueDateAdjustRefTaskIdParent` | integer | — | ID of the parent Task for due date adjustment |
  | `dueDateAdjustRefTaskParentContingent` | boolean | — | Whether task is hidden when parent task is not complete |
  | `dateAdjustReferenceCode` | string | ≤255 chars | Merge field code for auto-adjusting the date |
  | `dueDateAdjustmentRulesId` | integer | — | ID of the date adjustment rules (date calculator) |
  | `dueDateAdjustActive` | boolean | — | Whether auto-adjusting due date is enabled |
  | `dueDateAdjustType` | string (enum) | — | Due date adjustment type — see Enums |
  | `dueDateAdjustDelta` | integer | — | Number of days to auto-adjust the due date |
  | `dueDateAdjustReminderDelta` | integer | — | Number of days to auto-adjust the reminder date |
  | `dueDate` | string (date) | — | Due date (e.g., `"2026-01-15"`) |
  | `dueTime` | string | — | Due time (e.g., `"14:30"`) |
  | `taskTZ` | string | ≤100 chars | Time zone for the task |
  | `completeDate` | string (date) | — | Completion date |
  | `reminderSet` | boolean | — | Whether a reminder is set |
  | `reminderDate` | string (date) | — | Reminder date |
  | `reminderTime` | string | — | Reminder time |
  | `folderId` | integer | — | ID of the associated Folder |
  | `newFolderName` | string | ≤255 chars | Create a new folder with this name |

**Response (2xx payload)**

Returns the updated `APITaskDigestDto` object (abbreviated task view).

  | Field | Type | Description |
  |---|---|---|
  | `taskId` | integer | ID of the Task |
  | `xaction.xactionId` | integer | ID of the associated Transaction |
  | `xaction.xactionStatus.xactionStatusId` | integer | ID of the transaction status |
  | `xaction.xactionStatus.name` | string | Transaction status name |
  | `xaction.xactionStatus.sort` | integer | Status sort order |
  | `xaction.xactionStatus.xactionStage` | string (enum) | Transaction stage — see Enums |
  | `xaction.xactionStatus.xactionStatusSystemType` | string (enum) | System status type — see Enums |
  | `xaction.xactionStatus.colorHex` | string | Color hex code for the status |
  | `xaction.xactionStatus.agentVisible` | boolean | Status visible to agent team members |
  | `xaction.xactionStatus.buyerSellerVisible` | boolean | Status visible on buyer/seller portal |
  | `xaction.address.address1` | string | Address line 1 |
  | `xaction.address.address2` | string | Address line 2 |
  | `xaction.address.city` | string | City |
  | `xaction.address.state` | string | State |
  | `xaction.address.zip` | string | Zip/postal code |
  | `xaction.address.country` | string | Country |
  | `xaction.address.county` | string | County |
  | `xaction.address.latitude` | number (double) | Latitude |
  | `xaction.address.longitude` | number (double) | Longitude |
  | `xaction.xactionSide` | string (enum) | Transaction side — see Enums |
  | `xaction.closingDate` | string (date) | Closing date |
  | `xaction.closedDate` | string (date) | Closed date |
  | `xaction.currentPrice` | number | Current price (list or contract depending on stage) |
  | `xaction.timeZone.zoneId` | string | Transaction time zone ID (e.g., `"America/New_York"`) |
  | `xaction.timeZone.fullName` | string | Time zone full name (e.g., `"America/New_York (ET)"`) |
  | `xaction.timeZone.shortName` | string | Time zone short name (e.g., `"ET"`) |
  | `xaction.editDateTime` | string (date-time) | Transaction last edit date/time |
  | `contact.contactId` | integer | ID of the associated Contact |
  | `contact.associatedAppUserId` | integer | ID of the associated AppUser if Contact is a team member |
  | `contact.namesDisplay` | string | Display name(s) of the contact |
  | `contact.name.company` | string | Contact company |
  | `contact.name.title` | string | Contact title (e.g., `"Mr."`) |
  | `contact.name.firstName` | string | Contact first name |
  | `contact.name.middleName` | string | Contact middle name |
  | `contact.name.lastName` | string | Contact last name |
  | `contact.nameAltContact.company` | string | Alt contact company |
  | `contact.nameAltContact.title` | string | Alt contact title |
  | `contact.nameAltContact.firstName` | string | Alt contact first name |
  | `contact.nameAltContact.middleName` | string | Alt contact middle name |
  | `contact.nameAltContact.lastName` | string | Alt contact last name |
  | `contact.editDateTime` | string (date-time) | Contact last edit date/time |
  | `folder.folderId` | integer | ID of the associated Folder |
  | `folder.teamId` | integer | Team ID |
  | `folder.contactId` | integer | Contact ID |
  | `folder.xactionId` | integer | Transaction ID |
  | `folder.name` | string | Folder name |
  | `folder.folderType` | string (enum) | Folder type — see Enums |
  | `folder.renderClosed` | boolean | Whether folder renders initially closed |
  | `folder.sort` | integer | Folder sort order |
  | `appUser.appUserId` | integer | ID of the AppUser assigned to the task |
  | `appUser.name` | string | AppUser full name |
  | `appUser.initials` | string | AppUser initials |
  | `appUser.profileUrl` | string (uri) | AppUser profile picture URL |
  | `appUser.timeZone.zoneId` | string | AppUser time zone ID |
  | `appUser.timeZone.fullName` | string | AppUser time zone full name |
  | `appUser.timeZone.shortName` | string | AppUser time zone short name |
  | `taskType` | string (enum) | Task type — see Enums |
  | `status` | string (enum) | Task status — see Enums |
  | `subject` | string | Task subject/title |
  | `note` | string | Task notes/description |
  | `color` | string (enum) | Task color — see Enums |
  | `dueDate` | string (date) | Due date |
  | `dueTime` | string | Due time |
  | `timeZone.zoneId` | string | Due date time zone ID |
  | `timeZone.fullName` | string | Due date time zone full name |
  | `timeZone.shortName` | string | Due date time zone short name |
  | `completeDate` | string (date) | Completion date |
  | `completedBy.appUserId` | integer | ID of the AppUser who completed the task |
  | `completedBy.name` | string | Completing AppUser full name |
  | `completedBy.initials` | string | Completing AppUser initials |
  | `completedBy.profileUrl` | string (uri) | Completing AppUser profile picture URL |
  | `completedBy.timeZone.zoneId` | string | Completing AppUser time zone ID |
  | `completedBy.timeZone.fullName` | string | Completing AppUser time zone full name |
  | `completedBy.timeZone.shortName` | string | Completing AppUser time zone short name |
  | `recurring` | boolean | Whether the task is recurring |
  | `dueDateAdjustActive` | boolean | Whether due date adjustment is active |
  | `dueDateAdjustStatus` | string (enum) | Due date adjustment status (computed) — see Enums |
  | `dueDateAdjustRefTaskParentContingent` | boolean | Whether the parent task is contingent |
  | `dueDateAdjustRefTaskIdParent` | integer | ID of the parent task for due date adjustment |
  | `dueDateAdjustRefTaskParentSubject` | string | Subject of the parent task for due date adjustment |
  | `dueDateAdjustRefMergeFieldCode` | string | Due date adjustment reference merge field code |
  | `is_contingentChildHidden` | boolean | Whether the contingent child is hidden |
  | `reminderSet` | boolean | Whether a reminder is set |
  | `prospecting` | boolean | Whether the task is a prospecting task |
  | `onCalendar` | boolean | Whether the task appears on the calendar |
  | `milestone` | boolean | Whether the task is a milestone |
  | `agentVisible` | boolean | Whether the task is visible to the agent |
  | `buyerSellerVisible` | boolean | Whether the task is visible to the buyer/seller |
  | `editDateTime` | string (date-time) | Last edit date/time |
  | `createDateTime` | string (date-time) | Creation date/time |
  | `taskNoteCount` | integer | Number of task notes |
  | `taskLetterTemplateCount` | integer | Number of associated letter templates |

**Enums / constants:**

`status` (request + response): `"OPEN"`, `"IN_PROGRESS"`, `"COMPLETE"`

`taskType` (request + response): `"TODO"`, `"PHONE"`, `"LETTER"`, `"EMAIL"`

`color` (request + response, default `"NONE"`): `"NONE"`, `"RED"`, `"TANGERINE"`, `"TAUPE"`, `"YELLOW"`, `"LIME"`, `"GREEN"`, `"CYAN"`, `"TEAL"`, `"COBALT"`, `"PURPLE"`, `"MAGENTA"`

`dueDateAdjustType` (request): `"TEMPLATE_START_DATE"`, `"PARENT_TASK"`, `"XACTION_LIST_DATE"`, `"XACTION_ON_MARKET_DATE"`, `"XACTION_EXPIRE_DATE"`, `"XACTION_EFFECTIVE_DATE"`, `"EVENT_MERGE_FIELD_CODE"`

`dueDateAdjustStatus` (response, computed): `"INCOMPLETE"`, `"WAITING"`, `"SET"`, `"NOT_ADJUSTING"`

`xaction.xactionStage` (response): `"PRE_ACTIVE"`, `"ACTIVE"`, `"UNDER_CONTRACT"`, `"SOLD"`, `"NOT_SOLD"`, `"NOT_ACTIVE"`

`xaction.xactionStatus.xactionStatusSystemType` (response): `"XACTION_STATUS_SYSTEM_ACTIVE"`, `"XACTION_STATUS_SYSTEM_CLOSED"`, `"XACTION_STATUS_SYSTEM_FELL_APART"`, `"XACTION_STATUS_SYSTEM_DRAFT"`

`xaction.xactionSide` (response): `"BUYER"`, `"SELLER"`, `"DUAL"`

`folder.folderType` (response): `"TEAM_ATTACHMENTS"`, `"LETTER_TEMPLATES"`, `"TASK_TEMPLATES"`, `"EVENT_TEMPLATES"`, `"ATTACHMENT_TEMPLATES"`, `"XACTION_ATTACHMENTS"`, `"TASKS"`, `"EVENTS"`

**Notable errors:**

All error responses use the `APIResponse` envelope with fields: `payload` (any), `error.requestId` (string), `error.messages[]` (string), `error.details[]` (string), `error.validationErrors[]` (`fieldName`, `message`).

| Code | Description |
|---|---|
| 400 | Bad Request — invalid JSON Patch format or operation |
| 403 | Forbidden — authenticated user does not have permission to update this Task |
| 404 | Not Found — Task with the supplied ID does not exist |
| 422 | Unprocessable Content — validation errors occurred while updating the Task |
| 429 | Too Many Requests — rate limit exceeded |

**Quirks & notes:**
- Uses JSON Patch (RFC 6902) — body is an array of patch operations, not a partial object.
- The response is `APITaskDigestDto` (abbreviated), not a full task DTO — it omits some fields present on the full task.
- `newFolderName` in the request creates a new folder and assigns the task to it in one operation.
- `is_contingentChildHidden` uses snake_case (vs. camelCase for all other response fields) — likely a Swagger/API inconsistency.
- Authentication: global `X-AFrame-API-Key` header.

---

