export enum Status {
  Read = "Read",
  ReadLater = "Read Later"
}


export enum WhenToRead {
  today = "today",
  tomorrow = "tomorrow",
  thisWeek = "thisWeek",
  thisMonth = "thisMonth"
}


export interface WhenToReadSelect {
  label: string;
  value: WhenToRead
}



export const TIME_TO_READ: WhenToReadSelect[] = [
  {
    label: 'catalogue.searchPage.TODAY',
    value: WhenToRead.today
  },
  {
    label: 'catalogue.searchPage.TOMORROW',
    value: WhenToRead.tomorrow
  },
  {
    label: 'catalogue.searchPage.THIS_WEEK',
    value: WhenToRead.thisWeek
  },
  {
    label: 'catalogue.searchPage.THIS_MONTH',
    value: WhenToRead.thisMonth
  },
];
