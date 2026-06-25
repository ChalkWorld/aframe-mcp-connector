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

#### `POST /v1/tasks/search` — Search Tasks
**Status:** ✅ Extracted 2026-06-24

**Summary:** Search Tasks

**Description:** Search for Tasks using the supplied criteria. Pagination via `page` (0-based) and `pageSize` (max 100) is supported.

**Request**
- Content-Type: `application/json`
- Path params: None
- Query params: None
- Body schema (`APITaskPagedQueryDto` — request wrapper for paginated Task search):

  | Field | Type | Constraints | Description |
  |---|---|---|---|
  | `taskSearchCriteriaDto` | object | — | Task search criteria (all sub-fields optional) |
  | `taskSearchCriteriaDto.taskStatuses` | array\<string\> (unique) | — | Filter by task statuses — see Enums |
  | `taskSearchCriteriaDto.dueDate.from` | string (date) | — | Due date range from (inclusive), e.g. `"2021-01-01"` |
  | `taskSearchCriteriaDto.dueDate.to` | string (date) | — | Due date range to (inclusive) |
  | `taskSearchCriteriaDto.completeDate.from` | string (date) | — | Complete date range from (inclusive) |
  | `taskSearchCriteriaDto.completeDate.to` | string (date) | — | Complete date range to (inclusive) |
  | `taskSearchCriteriaDto.xactionId` | integer (int32) | — | Filter by ID of the associated Xaction |
  | `taskSearchCriteriaDto.contactId` | integer (int32) | — | Filter by ID of the associated Contact |
  | `taskSearchCriteriaDto.assignees` | array\<integer\> (unique) | — | Filter by IDs of the assignee AppUsers |
  | `taskSearchCriteriaDto.completedBy` | array\<integer\> (unique) | — | Filter by IDs of the AppUsers who completed the task |
  | `page` | integer (int32) | ≥ 0 | Page number (0-based) |
  | `pageSize` | integer (int32) | [1, 100] | Number of items per page (max 100) |

**Response (2xx payload)**

Returns `APITaskPagedResultDto` — paged list of Task digest results.

  | Field | Type | Description |
  |---|---|---|
  | `items[].taskId` | integer | ID of the Task |
  | `items[].xaction.xactionId` | integer | ID of the associated Xaction |
  | `items[].xaction.xactionStatus.xactionStatusId` | integer | ID for the transaction status |
  | `items[].xaction.xactionStatus.name` | string | Transaction status name |
  | `items[].xaction.xactionStatus.sort` | integer | Status sort order |
  | `items[].xaction.xactionStatus.xactionStage` | string (enum) | Stage of the transaction — see Enums |
  | `items[].xaction.xactionStatus.xactionStatusSystemType` | string (enum) | System status type — see Enums |
  | `items[].xaction.xactionStatus.colorHex` | string | Color hex code for the status |
  | `items[].xaction.xactionStatus.agentVisible` | boolean | Status visible to agent Team Members |
  | `items[].xaction.xactionStatus.buyerSellerVisible` | boolean | Status visible on Buyer/Seller portal |
  | `items[].xaction.address.address1` | string | Address Line 1 |
  | `items[].xaction.address.address2` | string | Address Line 2 |
  | `items[].xaction.address.city` | string | City |
  | `items[].xaction.address.state` | string | State |
  | `items[].xaction.address.zip` | string | Zip or Postal Code |
  | `items[].xaction.address.country` | string | Country |
  | `items[].xaction.address.county` | string | County |
  | `items[].xaction.address.latitude` | number (double) | Latitude |
  | `items[].xaction.address.longitude` | number (double) | Longitude |
  | `items[].xaction.xactionSide` | string (enum) | Side of the transaction — see Enums |
  | `items[].xaction.closingDate` | string (date) | Closing date |
  | `items[].xaction.closedDate` | string (date) | Closed date |
  | `items[].xaction.currentPrice` | number | Current price (list or contract depending on stage) |
  | `items[].xaction.timeZone.zoneId` | string | Time zone ID (e.g., `"America/New_York"`) |
  | `items[].xaction.timeZone.fullName` | string | Time zone full name (e.g., `"America/New_York (ET)"`) |
  | `items[].xaction.timeZone.shortName` | string | Time zone short name (e.g., `"ET"`) |
  | `items[].xaction.editDateTime` | string (date-time) | Transaction last edit date/time |
  | `items[].contact.contactId` | integer | ID of the associated Contact |
  | `items[].contact.associatedAppUserId` | integer | ID of the associated AppUser if Contact is a team member |
  | `items[].contact.namesDisplay` | string | Display name(s) of the contact |
  | `items[].contact.name.company` | string | Contact company |
  | `items[].contact.name.title` | string | Contact title (e.g., `"Mr."`) |
  | `items[].contact.name.firstName` | string | Contact first name |
  | `items[].contact.name.middleName` | string | Contact middle name |
  | `items[].contact.name.lastName` | string | Contact last name |
  | `items[].contact.nameAltContact.company` | string | Alt contact company |
  | `items[].contact.nameAltContact.title` | string | Alt contact title |
  | `items[].contact.nameAltContact.firstName` | string | Alt contact first name |
  | `items[].contact.nameAltContact.middleName` | string | Alt contact middle name |
  | `items[].contact.nameAltContact.lastName` | string | Alt contact last name |
  | `items[].contact.editDateTime` | string (date-time) | Contact last edit date/time |
  | `items[].folder.folderId` | integer | Folder ID |
  | `items[].folder.teamId` | integer | Team ID |
  | `items[].folder.contactId` | integer | Contact ID |
  | `items[].folder.xactionId` | integer | Xaction ID |
  | `items[].folder.name` | string | Folder name |
  | `items[].folder.folderType` | string (enum) | Folder type — see Enums |
  | `items[].folder.renderClosed` | boolean | Whether folder renders initially closed |
  | `items[].folder.sort` | integer | Folder sort order |
  | `items[].appUser.appUserId` | integer | ID of the AppUser assigned to the task |
  | `items[].appUser.name` | string | AppUser full name |
  | `items[].appUser.initials` | string | AppUser initials |
  | `items[].appUser.profileUrl` | string (uri) | AppUser profile picture URL |
  | `items[].appUser.timeZone.zoneId` | string | AppUser time zone ID |
  | `items[].appUser.timeZone.fullName` | string | AppUser time zone full name |
  | `items[].appUser.timeZone.shortName` | string | AppUser time zone short name |
  | `items[].taskType` | string (enum) | Task type — see Enums |
  | `items[].status` | string (enum) | Task status — see Enums |
  | `items[].subject` | string | Task subject/title |
  | `items[].note` | string | Task notes/description |
  | `items[].color` | string (enum) | Task color — see Enums |
  | `items[].dueDate` | string (date) | Due date (e.g., `"2026-01-15"`) |
  | `items[].dueTime` | string | Due time (e.g., `"14:30"`) |
  | `items[].timeZone.zoneId` | string | Due date time zone ID |
  | `items[].timeZone.fullName` | string | Due date time zone full name |
  | `items[].timeZone.shortName` | string | Due date time zone short name |
  | `items[].completeDate` | string (date) | Completion date |
  | `items[].completedBy.appUserId` | integer | ID of the AppUser who completed the task |
  | `items[].completedBy.name` | string | Completing AppUser full name |
  | `items[].completedBy.initials` | string | Completing AppUser initials |
  | `items[].completedBy.profileUrl` | string (uri) | Completing AppUser profile picture URL |
  | `items[].completedBy.timeZone.zoneId` | string | Completing AppUser time zone ID |
  | `items[].completedBy.timeZone.fullName` | string | Completing AppUser time zone full name |
  | `items[].completedBy.timeZone.shortName` | string | Completing AppUser time zone short name |
  | `items[].recurring` | boolean | Whether the task is recurring |
  | `items[].dueDateAdjustActive` | boolean | Whether due date adjustment is active |
  | `items[].dueDateAdjustStatus` | string (enum) | Due date adjustment status (computed) — see Enums |
  | `items[].dueDateAdjustRefTaskParentContingent` | boolean | Whether the parent task is contingent |
  | `items[].dueDateAdjustRefTaskIdParent` | integer | ID of the parent task for due date adjustment |
  | `items[].dueDateAdjustRefTaskParentSubject` | string | Subject of the parent task for due date adjustment |
  | `items[].dueDateAdjustRefMergeFieldCode` | string | Due date adjustment reference merge field code |
  | `items[].is_contingentChildHidden` | boolean | Whether the contingent child is hidden |
  | `items[].reminderSet` | boolean | Whether a reminder is set |
  | `items[].prospecting` | boolean | Whether the task is a prospecting task |
  | `items[].onCalendar` | boolean | Whether the task appears on the calendar |
  | `items[].milestone` | boolean | Whether the task is a milestone |
  | `items[].agentVisible` | boolean | Whether the task is visible to the agent |
  | `items[].buyerSellerVisible` | boolean | Whether the task is visible to the buyer/seller |
  | `items[].editDateTime` | string (date-time) | Last edit date/time |
  | `items[].createDateTime` | string (date-time) | Creation date/time |
  | `items[].taskNoteCount` | integer | Number of task notes |
  | `items[].taskLetterTemplateCount` | integer | Number of associated letter templates |
  | `pageMetadata.page` | integer | Current page number (0-based) |
  | `pageMetadata.pageSize` | integer | Current page size |
  | `pageMetadata.totalElementsOnPage` | integer | Number of elements on this page |
  | `pageMetadata.totalElements` | integer | Total number of matching elements |
  | `pageMetadata.hasNextPage` | boolean | Whether a next page exists |
  | `pageMetadata.lastPage` | integer | Last page number |
  | `pageMetadata.groupCounts` | object | Optional map of group counts if grouping is applied (values: integer) |

**Enums / constants:**

`taskSearchCriteriaDto.taskStatuses[]` (filter): `"OPEN"`, `"IN_PROGRESS"`, `"COMPLETE"`

`items[].taskType`: `"TODO"`, `"PHONE"`, `"LETTER"`, `"EMAIL"`

`items[].status`: `"OPEN"`, `"IN_PROGRESS"`, `"COMPLETE"`

`items[].color` (default `"NONE"`): `"NONE"`, `"RED"`, `"TANGERINE"`, `"TAUPE"`, `"YELLOW"`, `"LIME"`, `"GREEN"`, `"CYAN"`, `"TEAL"`, `"COBALT"`, `"PURPLE"`, `"MAGENTA"`

`items[].dueDateAdjustStatus` (computed): `"INCOMPLETE"`, `"WAITING"`, `"SET"`, `"NOT_ADJUSTING"`

`items[].xaction.xactionStatus.xactionStage`: `"PRE_ACTIVE"`, `"ACTIVE"`, `"UNDER_CONTRACT"`, `"SOLD"`, `"NOT_SOLD"`, `"NOT_ACTIVE"`

`items[].xaction.xactionStatus.xactionStatusSystemType`: `"XACTION_STATUS_SYSTEM_ACTIVE"`, `"XACTION_STATUS_SYSTEM_CLOSED"`, `"XACTION_STATUS_SYSTEM_FELL_APART"`, `"XACTION_STATUS_SYSTEM_DRAFT"`

`items[].xaction.xactionSide`: `"BUYER"`, `"SELLER"`, `"DUAL"`

`items[].folder.folderType`: `"TEAM_ATTACHMENTS"`, `"LETTER_TEMPLATES"`, `"TASK_TEMPLATES"`, `"EVENT_TEMPLATES"`, `"ATTACHMENT_TEMPLATES"`, `"XACTION_ATTACHMENTS"`, `"TASKS"`, `"EVENTS"`

**Notable errors:**

All error responses use the `APIResponse` envelope with fields: `payload` (any), `error.requestId` (string), `error.messages[]` (string), `error.details[]` (string), `error.validationErrors[]` (`fieldName`, `message`).

| Code | Description |
|---|---|
| 400 | Bad Request — Malformed JSON or unreadable payload |
| 422 | Unprocessable Content — Invalid search criteria (e.g. `pageSize` out of range) |
| 429 | Too Many Requests — Rate limit exceeded |

**Quirks & notes:**
- Request body wraps all search criteria in `taskSearchCriteriaDto` sub-object inside the `APITaskPagedQueryDto` wrapper; `page` and `pageSize` are top-level siblings.
- `page` is 0-based; `pageSize` is constrained to [1, 100].
- `taskSearchCriteriaDto.assignees` and `taskSearchCriteriaDto.completedBy` accept arrays of unique AppUser IDs.
- `dueDate` and `completeDate` criteria each accept a `from`/`to` date range (both inclusive).
- `items[].is_contingentChildHidden` uses snake_case, consistent with the same field in `PATCH /v1/tasks/{taskId}` and likely an API/Swagger inconsistency.
- Authentication: global `X-AFrame-API-Key` header.

---

#### `GET /v1/tasks/{taskId}` — Get a Task
**Status:** ✅ Extracted 2026-06-24

**Summary:** Get a Task

**Description:** Returns the Task with the supplied ID. The authenticated user must have permission to access the Task.

**Request**
- Content-Type: N/A
- Path params:

  | Name | Type | Required | Description |
  |---|---|---|---|
  | `taskId` | integer | yes | ID of the Task to fetch |

- Query params: None
- Body schema: None

**Response (2xx payload)**

Returns `APITaskDto` — Task with detailed information. This is the full task DTO (richer than `APITaskDigestDto` returned by PATCH).

  | Field | Type | Description |
  |---|---|---|
  | `teamId` | integer | ID of the Team |
  | `taskId` | integer | ID of the Task |
  | `xaction.xactionId` | integer | ID of the associated Xaction |
  | `xaction.xactionStatus.xactionStatusId` | integer | ID for the transaction status |
  | `xaction.xactionStatus.name` | string | Transaction status name |
  | `xaction.xactionStatus.sort` | integer | Status sort order |
  | `xaction.xactionStatus.xactionStage` | string (enum) | Stage of the transaction — see Enums |
  | `xaction.xactionStatus.xactionStatusSystemType` | string (enum) | System status type — see Enums |
  | `xaction.xactionStatus.colorHex` | string | Color hex code for the status |
  | `xaction.xactionStatus.agentVisible` | boolean | Status visible to agent Team Members |
  | `xaction.xactionStatus.buyerSellerVisible` | boolean | Status visible on Buyer/Seller portal |
  | `xaction.address.address1` | string | Address Line 1 |
  | `xaction.address.address2` | string | Address Line 2 |
  | `xaction.address.city` | string | City |
  | `xaction.address.state` | string | State |
  | `xaction.address.zip` | string | Zip or Postal Code |
  | `xaction.address.country` | string | Country |
  | `xaction.address.county` | string | County |
  | `xaction.address.latitude` | number (double) | Latitude |
  | `xaction.address.longitude` | number (double) | Longitude |
  | `xaction.xactionSide` | string (enum) | Side of the transaction — see Enums |
  | `xaction.closingDate` | string (date) | Closing date |
  | `xaction.closedDate` | string (date) | Closed date |
  | `xaction.currentPrice` | number | Current price (list or contract depending on stage) |
  | `xaction.timeZone.zoneId` | string | Time zone ID (e.g., `"America/New_York"`) |
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
  | `folder.folderId` | integer | Folder ID |
  | `folder.teamId` | integer | Team ID |
  | `folder.contactId` | integer | Contact ID |
  | `folder.xactionId` | integer | Xaction ID |
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
  | `dueDate` | string (date) | Due date (e.g., `"2026-01-15"`) |
  | `dueTimeMinutes` | integer | Due time in minutes from midnight |
  | `dueTime` | string | Due time as string, converted from `dueTimeMinutes` (e.g., `"14:30"`) |
  | `timeZone.zoneId` | string | Due date time zone ID |
  | `timeZone.fullName` | string | Due date time zone full name |
  | `timeZone.shortName` | string | Due date time zone short name |
  | `recurring` | boolean | Whether the task is recurring |
  | `recurringFrequency` | string (enum) | Recurring frequency — see Enums |
  | `recurringSeparationCount` | integer | Recurring separation count |
  | `recurringEndDate` | string (date) | Recurring end date |
  | `recurringCount` | integer | Recurring count |
  | `recurringDayOfWeek` | string (enum) | Recurring day of week — see Enums |
  | `recurringDayOfMonth` | integer | Recurring day of month |
  | `recurringMonthOfYear` | string (enum) | Recurring month of year — see Enums |
  | `dueDateAdjustActive` | boolean | Whether due date adjustment is active |
  | `dueDateAdjustType` | string (enum) | Due date adjustment type — see Enums |
  | `dueDateAdjustRefMergeFieldCode` | string | Due date adjustment reference merge field code |
  | `dueDateAdjustRefTaskIdParent` | integer | ID of the parent Task for due date adjustment |
  | `dueDateAdjustRefTaskParentSubject` | string | Subject of the parent task for due date adjustment |
  | `dueDateAdjustRefTaskParentContingent` | boolean | Whether the parent task is contingent |
  | `dateAdjustReferenceCode` | string | Date adjustment reference code |
  | `dueDateAdjustDelta` | integer | Due date adjustment delta in days |
  | `dueDateAdjustReminderDelta` | integer | Due date adjustment reminder delta in days |
  | `dueDateAdjustmentRulesId` | integer | ID of the date adjustment rules |
  | `dueDateAdjustmentRulesName` | string | Name of the date adjustment rules |
  | `completeDate` | string (date) | Completion date (e.g., `"2026-01-15"`) |
  | `completedBy.appUserId` | integer | ID of the AppUser who completed the task |
  | `completedBy.name` | string | Completing AppUser full name |
  | `completedBy.initials` | string | Completing AppUser initials |
  | `completedBy.profileUrl` | string (uri) | Completing AppUser profile picture URL |
  | `completedBy.timeZone.zoneId` | string | Completing AppUser time zone ID |
  | `completedBy.timeZone.fullName` | string | Completing AppUser time zone full name |
  | `completedBy.timeZone.shortName` | string | Completing AppUser time zone short name |
  | `editDateTime` | string (date-time) | Last edit date/time |
  | `createDateTime` | string (date-time) | Creation date/time |
  | `reminderSet` | boolean | Whether a reminder is set |
  | `reminderDate` | string (date) | Reminder date (e.g., `"2026-01-15"`) |
  | `reminderTimeMinutes` | integer | Reminder time in minutes from midnight |
  | `reminderTime` | string | Reminder time as string, converted from `reminderTimeMinutes` (e.g., `"14:30"`) |
  | `sortByDate` | integer | Internal sort-by-date value |
  | `sortByFolder` | integer | Internal sort-by-folder value |
  | `templateSortOrder` | integer | Template sort order |
  | `prospecting` | boolean | Whether the task is a prospecting task |
  | `onCalendar` | boolean | Whether the task appears on the calendar |
  | `milestone` | boolean | Whether the task is a milestone |
  | `agentVisible` | boolean | Whether the task is visible to the agent |
  | `buyerSellerVisible` | boolean | Whether the task is visible to the buyer/seller |
  | `expense` | number | Task expense amount |
  | `is_contingentChildHidden` | boolean | Whether the contingent child is hidden |
  | `get_alarmDateTime` | string (date-time) | Alarm date/time (computed) |
  | `get_dueDateTime` | string (date-time) | Due date/time as instant (computed) |
  | `reminderDestinations[].method` | string (enum) | Reminder destination method — see Enums |
  | `reminderDestinations[].appUserId` | integer | AppUser ID (required when method is `EMAIL_USER` or `SMS_USER`) |
  | `reminderDestinations[].destination` | string | Custom destination (required when method is `EMAIL_CUSTOM` or `SMS_CUSTOM`; valid email or phone) |
  | `taskLetterTemplates[].taskLetterTemplateId` | integer | Task Letter Template ID |
  | `taskLetterTemplates[].taskId` | integer | Task ID |
  | `taskLetterTemplates[].letterTemplate.letterTemplateId` | integer | Letter Template entity ID |
  | `taskLetterTemplates[].letterTemplate.teamId` | integer | Team ID |
  | `taskLetterTemplates[].letterTemplate.folder.folderId` | integer | Folder ID |
  | `taskLetterTemplates[].letterTemplate.folder.teamId` | integer | Team ID |
  | `taskLetterTemplates[].letterTemplate.folder.contactId` | integer | Contact ID |
  | `taskLetterTemplates[].letterTemplate.folder.xactionId` | integer | Xaction ID |
  | `taskLetterTemplates[].letterTemplate.folder.name` | string | Folder name |
  | `taskLetterTemplates[].letterTemplate.folder.folderType` | string (enum) | Folder type — see Enums |
  | `taskLetterTemplates[].letterTemplate.folder.renderClosed` | boolean | Whether folder renders initially closed |
  | `taskLetterTemplates[].letterTemplate.folder.sort` | integer | Folder sort number |
  | `taskLetterTemplates[].letterTemplate.type` | string (enum) | Template entity type — see Enums |
  | `taskLetterTemplates[].letterTemplate.name` | string | Template name |
  | `taskLetterTemplates[].letterTemplate.description` | string | Template description |
  | `taskLetterTemplates[].letterTemplate.note` | string | Template note |
  | `taskLetterTemplates[].letterTemplate.systemTemplate` | boolean | True if system template |
  | `taskLetterTemplates[].letterTemplate.sort` | integer | Template sort order |

**Enums / constants:**

`taskType`: `"TODO"`, `"PHONE"`, `"LETTER"`, `"EMAIL"`

`status`: `"OPEN"`, `"IN_PROGRESS"`, `"COMPLETE"`

`color` (default `"NONE"`): `"NONE"`, `"RED"`, `"TANGERINE"`, `"TAUPE"`, `"YELLOW"`, `"LIME"`, `"GREEN"`, `"CYAN"`, `"TEAL"`, `"COBALT"`, `"PURPLE"`, `"MAGENTA"`

`recurringFrequency`: `"DAILY"`, `"WEEKLY"`, `"MONTHLY"`, `"YEARLY"`

`recurringDayOfWeek`: `"MONDAY"`, `"TUESDAY"`, `"WEDNESDAY"`, `"THURSDAY"`, `"FRIDAY"`, `"SATURDAY"`, `"SUNDAY"`

`recurringMonthOfYear`: `"JANUARY"`, `"FEBRUARY"`, `"MARCH"`, `"APRIL"`, `"MAY"`, `"JUNE"`, `"JULY"`, `"AUGUST"`, `"SEPTEMBER"`, `"OCTOBER"`, `"NOVEMBER"`, `"DECEMBER"`

`dueDateAdjustType`: `"TEMPLATE_START_DATE"`, `"PARENT_TASK"`, `"XACTION_LIST_DATE"`, `"XACTION_ON_MARKET_DATE"`, `"XACTION_EXPIRE_DATE"`, `"XACTION_EFFECTIVE_DATE"`, `"EVENT_MERGE_FIELD_CODE"`

`reminderDestinations[].method`: `"EMAIL_USER"`, `"SMS_USER"`, `"EMAIL_CUSTOM"`, `"SMS_CUSTOM"`

`xaction.xactionStatus.xactionStage`: `"PRE_ACTIVE"`, `"ACTIVE"`, `"UNDER_CONTRACT"`, `"SOLD"`, `"NOT_SOLD"`, `"NOT_ACTIVE"`

`xaction.xactionStatus.xactionStatusSystemType`: `"XACTION_STATUS_SYSTEM_ACTIVE"`, `"XACTION_STATUS_SYSTEM_CLOSED"`, `"XACTION_STATUS_SYSTEM_FELL_APART"`, `"XACTION_STATUS_SYSTEM_DRAFT"`

`xaction.xactionSide`: `"BUYER"`, `"SELLER"`, `"DUAL"`

`folder.folderType`: `"TEAM_ATTACHMENTS"`, `"LETTER_TEMPLATES"`, `"TASK_TEMPLATES"`, `"EVENT_TEMPLATES"`, `"ATTACHMENT_TEMPLATES"`, `"XACTION_ATTACHMENTS"`, `"TASKS"`, `"EVENTS"`

`taskLetterTemplates[].letterTemplate.type`: `"TEAM"`, `"CONTACT"`, `"XACTION"`, `"EVENT"`, `"TASK"`, `"CONTACT_NOTE"`, `"EMAIL_QUEUE"`, `"APPUSER"`, `"FOLDER"`, `"XACTION_ATTACHMENT"`, `"XACTION_ACTIVITY"`, `"XACTION_PARTICIPANT"`

**Notable errors:**

All error responses use the `APIResponse` envelope with fields: `payload` (any), `error.requestId` (string), `error.messages[]` (string), `error.details[]` (string), `error.validationErrors[]` (`fieldName`, `message`).

| Code | Description |
|---|---|
| 403 | Forbidden — Authenticated user does not have permission to access this Task |
| 404 | Not Found — Task with the supplied ID does not exist |
| 429 | Too Many Requests — Rate limit exceeded |

**Quirks & notes:**
- Returns `APITaskDto` — the full task representation, considerably richer than `APITaskDigestDto` returned by `PATCH /v1/tasks/{taskId}`. Full DTO adds: recurring fields, reminder destinations array, letter templates array, computed fields, `teamId`, `expense`, sort fields.
- `dueTime` and `reminderTime` are computed strings (e.g. `"14:30"`) derived from `dueTimeMinutes` / `reminderTimeMinutes` (integer, minutes from midnight). Both raw and converted forms are present in the response.
- `get_alarmDateTime` and `get_dueDateTime` use a `get_` prefix — getter-method names leaking into the Swagger schema; treat as computed read-only fields.
- `is_contingentChildHidden` uses snake_case, consistent with the PATCH and search endpoints.
- `reminderDestinations[].appUserId` is required when method is `EMAIL_USER` or `SMS_USER`; `reminderDestinations[].destination` is required when method is `EMAIL_CUSTOM` or `SMS_CUSTOM`.
- `sortByDate`, `sortByFolder`, `templateSortOrder` are internal sort fields; not meaningful for connector business logic.
- Authentication: global `X-AFrame-API-Key` header.

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

