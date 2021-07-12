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


export interface Book {
  title: string;
  authors: string;
  categories?: string;
  description: string;
  publishedDate: string;
  publisher: string;
  imageLinks: string,
  countries?: Country[];
  movie?: Omit<Movie, "countries">;
}


export type fireBookDataWithId = fireBookBody & { id: string };

export interface BookApiResult {
  items: {
    volumeInfo: {
      title: string;
      authors: string[];
      categories: string[];
      description: string;
      publishedDate: string;
      publisher: string;
      imageLinks: { smallThumbnail: string }
    }
  }[]
}


export interface MovieApiResult {
  Response: string;
  Country: string;
  Released: string;
  Director: string;
  Year: string;
}

export interface Movie {
  response: string;
  countries: string[];
  released: string;
  director: string;
  year: number;
}

export interface CountryApiResult {
  alpha2Code: string;
  population: number;
}

export interface Country {
  code: string,
  population: number,
}

export interface fireBookBody {
  uid: string;
  title: string;
  rating: number;
  review: string;
  status: Status;
  whenToRead?: WhenToRead;
}


export interface ListData {
  fireData: fireBookDataWithId;
  allData: Book
}
