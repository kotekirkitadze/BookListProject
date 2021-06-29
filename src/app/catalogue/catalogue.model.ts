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


//ჩაჰარდკორებული რომ არ გვქონდეს html-ში.
//თან ეს იმიტომაა ასე კარგი, რომ ჩამატება თუ მოგვინდება,
// პირდაპირ აქ ერთგან ჩავამატებთ და html - ში არ მოგვიწევს
// ჰარდქორებად ჩაწერა - პირდაპირ გადაუყვება.
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



// ეს არის ვიუსთვის, ქათომ ინტერფეისი. ამით უნდა დავხატოთ რაღაცეები.
// შესაბამისად ამაზე უნდა გადმოვმეპოთ //BookAPI.
//ეს არის ვიუ მოდელი.
//ჩვენს თავზე ვირგებთ, ორი ინტერფეისიდან ერთს ვმეპავთ მეორეზე
//ვმეპავთ ჩვენი ბექენდის მოდელს ფრონტზე, რომ უფრო მარტივად
// ვიმუშავოთ ფრონტზე
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

type a = Omit<Movie, 'countries'>;


//ბექენდის მოდელი, ეიპიაი მაძლევს ამას.
//და ეს ბექენდის მოდელი ფრონტშიც უნდა გვქონდეს,
// //რადგან დავახვედროთ ეიპიაიდან მოსულ დატას.
//ამ მოდელს ბექენდს ვახვედრებთ ფრონტზე
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
}

export interface Movie {
  response: string;
  countries: string[];
  released: string;
}

export interface CountryApiResult {
  alpha2Code: string;
  population: number;
}

export interface Country {
  code: string,
  population: number,
}
