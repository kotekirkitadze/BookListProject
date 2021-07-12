export const environment = {
  production: true,
  firebaseConfig: {
    apiKey: "AIzaSyCHOVgN0CpMJdOUSN2R46_k95BWtoPlzek",
    authDomain: "book-catalogue-d3599.firebaseapp.com",
    projectId: "book-catalogue-d3599",
    storageBucket: "book-catalogue-d3599.appspot.com",
    messagingSenderId: "345230584948",
    appId: "1:345230584948:web:002af33ec3e271682d3521"
  },
  bookApi: 'https://www.googleapis.com/books/v1/volumes?q',
  movieApi: 'http://www.omdbapi.com/?t',
  countryApi: 'https://restcountries.eu/rest/v2/name',
  deleteFn_fire_cloud: "https://us-central1-book-catalogue-d3599.cloudfunctions.net/deleteUserByEmail"
};
