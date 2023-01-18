# Shop API

Hi everyone, here is one of my Uni project. It's a shop API written in TypeScript, connected to MongoDB. API contains few CRUD collections like Items, but also some bises logic like for example peppering orderer form.

## Stack

| Package | Description |
| --- | --- |
| TypeScript| A typed superset of JavaScript that adds optional static typing and other features. |
| Node.js | A JavaScript runtime for building server-side applications. |
| Express.js | A web framework for building APIs and web applications with Node.js. |
| MongoDB | A NoSQL database that stores data in a flexible, JSON-like format. |

## API Documentation

Below is part of endpoint documentation. If u are looking for more go to [documenter.getpostman.com](https://documenter.getpostman.com/view/17903248/2s8ZDVa3cT).

- `GET /items` - Retrieves all items from the Items collection.
- `GET /items?sort={"price":-1}&filter={"delivery": "UPS"}` - Retrieves all items from the Items collection, sorted by price in descending order and filtered by delivery method of UPS.
- `GET /items/:id` - Retrieves a specific item from the Items collection by its id.
- `POST /items` - Creates a new item in the Items collection, with the JSON payload of the request body containing the item details.
- `PUT /items` - Updates an existing item in the Items collection, with the JSON payload of the request body containing the updated item details.
- `DELETE /items` - Deletes all items from the Items collection.

*Item interface*
```js
interface Item {
    name: string,
    imageUrl: URL,
    price: number,
    delivery: string[],
    description: string,
    quantity: number,
    categories: string[],
    rating: Rating[]
}
```

## Installation Manual


1. Download the project by cloning the repository or downloading the zip file from the source.

```bash
git clone
```

2. Navigate to the project directory.

```bash
cd shop-api
```

3. Install the necessary dependencies using npm.

```
npm install
```

4. Create a .env file in the root directory of the project and add the following environment variables.

```
MONGO_URI=mongodb://localhost:27017
PORT=3000
```

5. Start the server by running the following command:

```bash
npm start
```

The server will now be running on the specified port in the .env file. You can now make requests to the API using the endpoints specified in the README.

### Support ME

- BTC: `1AKLzsQPdhbj9fSwfE5iHAC9ctmspKihRp`
- ERC20: `0x3C9aC26fD984C05fD1cDBD40c293495624Eb79a2`
- BEP20: `0x3C9aC26fD984C05fD1cDBD40c293495624Eb79a2`