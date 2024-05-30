# Foodstyles Challenge

This is a Node.js API built with Express. The aim is to generate a search algorithm using permutations of varying entities from a random search query.

## Installation

To get started with this project, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone git@github.com:EntropicDev/foodstyles-challenge.git
   ```

2. **Set up MySQL schema:**

   - Make sure you have MySQL installed and create a schema for the project.
   - Copy the `.env.sample` file to `.env` and update it with your MySQL connection details.

3. **Install dependencies:**

   ```bash
   npm install
   ```

4. **Migrate and seed database:**
   ```bash
   npm run syncDB-prod
   ```

## Usage

To start the server, run (simple method):

```bash
npm run start
```

If you have Docker installed, you can also run the server using Docker with (advanced method):

```bash
npm run start-docker
```

Make sure that docker is able to access your mysql server. Alternatively run this with the simple method.

The server will be running at `http://localhost:8001`.

To interact with the API, you can use tools like Postman. Make a GET request to `http://localhost:8001/search/:searchTerm`, where `:searchTerm` is any string value, which may include spaces.

An alternative to the UNION query is tested through a GET request to `http://localhost:8001/searchConcurrent/:searchTerm`, where `:searchTerm` is any string value, which may include spaces.

## Contributing

Contributions are welcome! If you'd like to contribute to this project, please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Make changes and commit them (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Create a new Pull Request

## License

This project is licensed under the MIT License.
