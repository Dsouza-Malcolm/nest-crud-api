export enum SortQuery {
  CREATED_AT = 'created_at',
  DUE_DATE = 'due_date',
  PRIORITY = 'priority',
  TITLE = 'title',
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export const TASK_SORT_FIELDS: Record<SortQuery, string> = {
  [SortQuery.CREATED_AT]: 'task.createdAt',

  [SortQuery.DUE_DATE]: 'task.dueDate',

  [SortQuery.TITLE]: 'task.title',

  [SortQuery.PRIORITY]: 'task.priority',
};
