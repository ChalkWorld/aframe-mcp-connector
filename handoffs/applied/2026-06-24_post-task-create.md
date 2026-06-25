<!-- TARGET: POST /v1/tasks -->
<!-- FORMAT: Path B — raw paste -->

<!-- SUMMARY -->
Create a Task

<!-- DESCRIPTION -->
Creates a new Task assigned to a Team Member. A Task must have at least a subject and an `appUserId` (assignee). See `APITaskCreateDto` for all supported fields.

<!-- PARAMETERS (Schema view) -->
Request body

application/json
Task creation data.

Examples: 
Simple Example
Example Value
Schema
APITaskCreateDtoCollapse allobject
Data for creating a Task

appUserIdCollapse allintegerint32
ID of the AppUser assigned to the task

xactionIdCollapse allintegerint32
ID of the related Xaction

contactIdCollapse allintegerint32
ID of the related Contact

folderIdCollapse allintegerint32
ID of the associated Folder

newFolderNameCollapse allstring≤ 255 characters
Create a new folder with this name (instead of using folderId)

subjectCollapse allstring≤ 255 characters
Task subject/title

Example"Call John Doe"
noteCollapse allstring≤ 65535 characters
Task description

Example"Call John Doe to discuss the new listing"
taskTypeCollapse allstring
Task type

EnumCollapse allarray
#0"TODO"
#1"PHONE"
#2"LETTER"
#3"EMAIL"
Default"TODO"
statusCollapse allstring
Task status

EnumCollapse allarray
#0"OPEN"
#1"IN_PROGRESS"
#2"COMPLETE"
Default"OPEN"
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
dueDateCollapse allstringdate
Due date

Example"2026-01-15"
dueTimeCollapse allstring
Due time

Example"14:30"
reminderSetCollapse allboolean
Whether a reminder is set for the task

reminderDateCollapse allstringdate
Reminder date

Example"2026-01-15"
reminderTimeCollapse allstring
Reminder time

Example"14:30"
agentVisibleCollapse allboolean
Whether the task is visible on the agent portal

buyerSellerVisibleCollapse allboolean
Whether the task is visible on the buyer/seller portal

prospectingCollapse allboolean
Whether the task is a prospecting task

onCalendarCollapse allboolean
Whether the task is included in the calendar feed

milestoneCollapse allboolean
Whether the task is a milestone

recurringCollapse allboolean
Whether the task is recurring

recurringFrequencyCollapse allstring
Recurring frequency

EnumCollapse allarray
#0"DAILY"
#1"WEEKLY"
#2"MONTHLY"
#3"YEARLY"
Default"DAILY"
recurringSeparationCountCollapse allintegerint32
Recurring separation count (1-based)

recurringEndDateCollapse allstringdate
Recurring end date

recurringCountCollapse allintegerint32
Recurring count

recurringDayOfWeekCollapse allstring
Recurring day of week

EnumCollapse allarray
#0"MONDAY"
#1"TUESDAY"
#2"WEDNESDAY"
#3"THURSDAY"
#4"FRIDAY"
#5"SATURDAY"
#6"SUNDAY"
recurringDayOfMonthCollapse allintegerint32
Recurring day of month

recurringMonthOfYearCollapse allstring
Recurring month of year

EnumCollapse allarray
#0"JANUARY"
#1"FEBRUARY"
#2"MARCH"
#3"APRIL"
#4"MAY"
#5"JUNE"
#6"JULY"
#7"AUGUST"
#8"SEPTEMBER"
#9"OCTOBER"
#10"NOVEMBER"
#11"DECEMBER"
expenseCollapse allnumber
Task expense amount

Example100
dueDateAdjustRefTaskIdParentCollapse allintegerint32
ID of the parent Task for due date adjustment

dueDateAdjustRefTaskParentContingentCollapse allboolean
Whether the task is hidden when the parent task is not complete

dueDateAdjustActiveCollapse allboolean
Whether auto-adjusting due date is enabled

dateAdjustReferenceCodeCollapse allstring≤ 255 characters
Merge field code for auto-adjusting the date (relevant when dueDateAdjustType is EVENT_MERGE_FIELD_CODE)

dueDateAdjustDeltaCollapse allintegerint32
Number of days to auto-adjust the due date

dueDateAdjustReminderDeltaCollapse allintegerint32
Number of days to auto-adjust the reminder date

dueDateAdjustmentRulesIdCollapse allintegerint32
ID of the date adjustment rules (date calculator)

completeDateCollapse allstringdate
Completion date

Example"2026-01-15"
taskTZCollapse allstring≤ 100 characters
Time zone for the task (if null, uses current user's time zone)

reminderDestinationsCollapse allarray<object>
Reminder override destinations

ItemsCollapse allobject
methodCollapse allstring
Reminder Destination Method

EnumCollapse allarray
#0"EMAIL_USER"
#1"SMS_USER"
#2"EMAIL_CUSTOM"
#3"SMS_CUSTOM"
appUserIdCollapse allintegerint32
AppUser Id for custom destinations. Required when method is EMAIL_USER or SMS_USER

destinationCollapse allstring
Custom destination. Required when method is EMAIL_CUSTOM or SMS_CUSTOM and must be a valid email or phone number

taskLetterTemplatesCollapse allarray<object>
Associated letter templates

ItemsCollapse allobject
TaskLetterTemplate Create DTO

taskIdCollapse allintegerint32
Task Id

letterTemplateIdCollapse allintegerint32
Letter Template Id

sortCollapse allintegerint32
Sort Order


<!-- RESPONSES (Schema view) -->