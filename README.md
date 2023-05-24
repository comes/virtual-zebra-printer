# Virtual Zebra Printer

Virtual Zebra Printer is a lightweight Node.js application that straight forward emulates Browser Print with one configured printer. It allows you to simulate the behavior of a Zebra printer, making it useful for testing and development purposes without the need for a physical printer.

## Features

- **Virtual Printer**: Emulate the behavior of a Zebra printer by handling HTTP requests and providing responses similar to a real Zebra printer.

- **Preview ZPL**: Forward the ZPL to https://chrome.google.com/webstore/detail/zpl-printer/phoidlklenidapnijkabnfdgmadlcmjo to preview the label.

## Prerequisites

- Node.js (>= 14.0.0)
- npm (Node Package Manager)

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/comes/virtual-zebra-printer.git
   ```

2. Install the dependencies:

   ```bash
   cd virtual-zebra-printer
   npm install
   ```

3. Configure the environment variables:

   - Create a `.env` file in the root directory of the project.
   - Define the necessary environment variables according to your setup. Refer to the `.env.example` file for the required variables.

4. Start the server:

   ```bash
   npm start
   ```

   The server will start running on `http://localhost:9100`.

   for development:

   ```bash
   npm dev
   ```

## API Endpoints

- `GET /default`: Get information about the default printer.
- `GET /available`: Get a list of available printers.
- `GET /config`: Get the printer configuration settings.
- `POST /read`: Handle read requests and provide appropriate responses.
- `POST /write`: Handle write requests and execute the specified commands.


## Contributing

Contributions are welcome! If you encounter any issues or have suggestions for improvements, please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
