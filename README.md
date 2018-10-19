# IH-P3-API

# Bistro

## Description

The object of the app is to create a social network environment to share menu bars. From a list of bars and restaurants that have daily menu service and are around the user, create a ranking and collect the opinions of users.
The ownwers can register their businesses, publish their offers and daily menus.

## User Stories

- **404:** generic error for access without logging and non-existent pages.
- **SignUp:** Access for new users. User and owner roles.
- **Login:** login with signup credentials.
- **Log out:** end of the session.
- **List of restaurants** you get the list of daily menu restaurants that exist around the user (max 15" walking).
- **Search in list of restaurants** filtering of the results to the search of the user.
- **Add / remove bookmarks** include and remove restaurant from the user's favorite list
- **View favorites** See list of user favorites

## Owner Stories
- **Add / remove Restaurant:** The owner will register the restaurant (s) that he owns.
- **Add daily menu:** Daily incorporation of the menu, using form or image.
- **Modify restaurant information:** The owner can modify the data and images of the restaurant.


## Backlog

##### Interface:
- geolocation and maps
- promotions carousel
- search for locations in the list
- Signup and login with social networks
- Add restaurants with validation from the system administrator or owner.

##### User profile:
- include images of places and dishes.
- rate the place.
- rate the menu.
- rate the price.
- rate cleaning.
- rate the service.
- count visits to restaurant

##### Owner profile:
- OCR of the menu image
- Custom promotions to users who have the restaurant in favorites.
- Mark restaurant created by users as your own.

# Client

## Routes

- `/`
  - HomePageComponent
  - public
  - just promotional copy
- `/auth/signup`
  - SignupPageComponent
  - anon only
  - signup form, link to login
  - navigate to homepage after signup
- `/auth/login`
  - LoginPageComponent
  - anon only
  - login form, link to signup
  - navigate to homepage after login
- `/restaurants`
  - RestaurantListPageComponent
  - public
  - shows all restaurants, links to details
  - search restaurants by name
- `/restaurants/create`
  - RestaurantCreatePageComponent
  - user only
  - creates a new restaurant
  - navigates to restaurant's detail page after creation
- `/restaurants/:id`
  - RestaurantDetailPageComponent
  - public
  - details of one restaurant
  - button to add to favorite
  - show star if in favorites already
- `/profile/me`
  - ProfilePageComponent
  - user only
  - my details
  - my favorite restaurants
  - restaurants created by me
- `**`
  - NotFoundPageComponent


## Components

- Restaurant Card component
  - Input: restaurant: any
  - Output: favorite(restaurantId: string, on: boolean)
- Map component
  - Input: [restaurant]
  - Output: selectedRestaurant(restaurantId:string)
- Search component
  - Output: change(terms: string)


## Services

- Auth Service
  - auth.login(user)
  - auth.signup(user)
  - auth.logout()
  - auth.me()
  - auth.getUser() // synchronous
- Restaurant Service
  - restaurant.list()
  - restaurant.search(terms)
  - restaurant.create(data)
  - restaurant.detail(id)
  - restaurant.addFavorite(id)
  - restaurant.removeFavorite(id)
- Owner Service
  - restaurant.addDailyMenu(id, date)

# Server

## Models

User model

```json
{
  username: { type: String, trim: true, required: true },
  email: {
    type: String,
    unique: true,
  },
  password: String,
  favorites: [{ type: ObjectId, ref: 'Place' }],
  comments: [{ type: ObjectId, ref: 'Comment' }],
  following: [{ type: ObjectId, ref: 'User' }],
}
```

Location model

```json
{
  id: Number,
  name: String,
  address: String,
  category: String,
  location: String,
  lat: Double,
  lng: Double,
  coordinates: {
    type: 'Point',
    coordinates: [{
      longitude: Double,
      latitude: Double,
    }],
  },
  numReviews: Number,
  polarity: Number,
  reviews: String,
  details: String,
  rev: String,
  det: String,
}
```
Place model
```json
{
  id: Number,
  name: String,
  address: String,
  category: String,
  location: String,
  lat: Double,
  lng: Double,
  coordinates: {
    type: 'Point',
    coordinates: [{
      longitude: Double,
      latitude: Double,
    }],
  },
  services: {
    en: [String],
    it: [String],
    fr: [String],
    nl: [String],
    de: [String],
    es: [String],
  },
  phone_number: String,
  international_phone_number: String,
  website: String,
  icon: String,
  description: {
    en: String,
    it: String,
    fr: String,
    nl: String,
    de: String,
    es: String,
    unidentified: String,
  },
  external_urls: {
    Foursquare: String,
    Facebook: String,
    GooglePlaces: String,
    Booking: String,
  },
  statistics: {
    Foursquare: {
      checkinsCount: Number,
      usersCount: Number,
      tipCount: Number,
      price: Number,
      likes: Number,
      hereNow: {
        count: Number,
        summary: Number,
        groups: [Number],
      },
    },
    Facebook: {
      checkins: Number,
      talking_about_count: Number,
      were_here_count: Number,
      fan_count: Number,
    },
  },
  numReviews: Number,
  reviews: [String],
  polarity: Number,
}
```
Comment model

```json
{
  id: Number,
  restaurant: { type: ObjectId, ref: 'Place' },
  postedBy: { type: ObjectId, ref: 'User' },
  source: String,
  text: String,
  language: String,
  polarity: Number,
  rating: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  shared: { type: Number, default: 0 },
  timeStamp: { type: Date, default: Date.now },
  wordsCount: Number,
}
```
Menu model

```json
{
  id: Number,
  restaurant: { type: ObjectId, ref: 'Place' },
  postedBy: { type: ObjectId, ref: 'User' },
  menu: String,
  language: String,
  rating: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  shared: { type: Number, default: 0 },
  timeStamp: { type: Date, default: Date.now },
}
```

## API Endpoints (backend routes)

AUTH
- GET /auth/me
  - 404 if no user in session
  - 200 with user object
- POST /auth/signup
  - 401 if user logged in
  - body:
    - username
    - email
    - password
  - validation
    - fields not empty
    - user duplicated
  - create user with encrypted password
  - store user in session
  - 200 with user object
- POST /auth/login
  - 401 if user logged in
  - body:
    - username
    - password
  - validation
    - fields not empty (400)
    - user not exists (404)
    - passdword not match (404)
  - store user in session
  - 200 with user object
- POST /auth/logout
  - body: (empty)
  - 204

MEMBERS
- POST /me/favorite
  - body:
    - restaurantId
  - validation
    - id is invalid (404)
    - id not exists (404)
  - add to favorites if not there yet
  - updates user in session
- DELETE /me/favorite/:restaurantId
  - validation
    - id not exists (404)
  - body: (empty - the user is already stored in the session)
  - remove from favorites
  - updates user in session
- PUT /me/comment/:restaurantId
   - validation
    - id not exists (404)
    - body: (empty - the user is already stored in the session)
- DELETE /me/comment/:placeId/:commentId
  - validation
    - placeId is not valid (404)
    - commentId not exists (404)
  - body: (empty - the user is already stored in the session)

PLACE
- GET /places?terms=foo
  - use search criteria if terms provided
  - return 200 with array of restaurants
- GET /places/:restaurantId
  - validation
    - placeId is not valid (404)
  - return 200 with place object
- POST /places
  - body:
    - place fields
  - validation
    - fields not empty
  - create restaurant
  - return 200 with place object

-API RETURN CODES
- 200 OK
- 201 Created
- 204 Logout
- 400 Bad Request
- 401 Unauthorized
- 404 Not Found
- 405 Method Not Allowed
- 409 Conflict
- 500 Internal Server Error


## Links

### Trello/Kanban
#### [Trello board](https://trello.com/b/nxkr1g84/project3) - <https://trello.com/b/nxkr1g84/project3>

### Git

#### [Client repository](https://github.com/xavifserra/IH-P3-BISTRO)
#### [Server repository](https://github.com/xavifserra/IH-P3-API)

#### [Deploy Front](https://dailybistro.herokuapp.com/)
#### [Deploy API](https://api-dailybistro.herokuapp.com/)


### Slides


#### [Slides Link](https://slides.com/xavifs/deck-b7698b58-94da-431b-a5b4-9cc6281dcc7a/edit)
