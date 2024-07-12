# Nest Insurance Policy

## Overview

Nest Insurance Policy is an API service built with NestJS for managing insurance policies. It provides a robust framework for creating, updating, querying, and validating insurance policies within an insurance context.

## Features

- **Policy Management**: CRUD operations for insurance policies (Create, Read, Update, Delete).
- **Validation**: Ensures policy data is valid before processing.
- **Querying**: Flexible querying capabilities to retrieve policy details.

## Architecture

### Components:

1. **Controllers**: Expose API endpoints to handle HTTP requests related to policy management.

2. **Services**: Business logic layer responsible for processing policy data, applying validation rules, and interacting with repositories.

3. **Repositories**: Data access layer (integrating with databases) to perform CRUD operations on policy data.

4. **DTOs (Data Transfer Objects)**: Objects used to define the structure of data exchanged between clients and the server.

5. **Middleware**: Implements cross-cutting concerns such as logging, error handling, and validation.

### Technologies Used:

- **NestJS**: A progressive Node.js framework for building efficient, reliable, and scalable server-side applications.
- **TypeScript**: Primary language for development, providing type safety and modern JavaScript features.
- **MongoDB**: Chosen non-relational database for storing policy data.
- **Jest**: Testing framework used for unit and integration testing to ensure code quality and reliability.

## Installation

Before starting the application, make sure to have docker installed, as we use docker to run mongoDB locally and Node version 16 (or [NVM](https://github.com/nvm-sh/nvm) and install node version 16)

To install and run Nest Insurance Policy locally, follow these steps:

1. Clone the repository:

   ```
   git clone https://github.com/JvPy/nest-insurence-policy.git
   ```

2. Navigate into the project directory:

   ```
   cd nest-insurence-policy
   ```

3. Install dependencies:

   ```
   npm install
   ```

4. Start the application:

   ```
   npm run start
   ```

5. The application will be accessible at `http://localhost:3000`.

## License

This project is licensed under the MIT License
