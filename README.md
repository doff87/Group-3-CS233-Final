# USDA Nutrition Search App

A Node.js Express application that integrates with the USDA Food Data Central API to retrieve nutritional information including serving size, calories, protein, carbs, and fat.

## Features

- MVC architecture
- Web client interface
- API endpoint for programmatic access
- Search for food items and get nutritional data

## Setup

1. Get an API key from [USDA Food Data Central](https://fdc.nal.usda.gov/api-key-signup.html)
2. Create a `.env` file with:
   ```
   FDC_API_KEY=your_actual_api_key_here
   PORT=3000
   ```
3. Install dependencies: `npm install`
4. Start the server: `npm start`
5. Open http://localhost:3000 in your browser

## Usage

- Enter a food name in the search box (e.g., "banana")
- View the nutritional information displayed

## API Endpoint

GET /api/nutrition?query=food_name

Returns JSON with nutritional data.

# How the project worked:
Amandaleeanne Took meeting notes, arranged meetings and took lead as PM for smooth transition. Not much can be shown for this other than the Meeting notes submitted in the Meeting notes folder. However, within the first meeting notes you can see the genreal timeline and what everyone should have been doing and contributing to the project.

In general:
Dannika and Amandaleeanne worked in Figma for planning out the Presentation of the application.

Dannika worked on implementing the client side looks of the application (Client side and folder)

You can refer to the planning of the Figma design here:
https://www.figma.com/design/1Go7Kibzn3ZIlcXXexVATO/CS233-Final?node-id=0-1&p=f&t=CSgbBWftpDXAwxHB-0

Joel and David worked on the Application layer and implementation of API's and the business logic controlling what happens when something in the client is interacted with.

Amandaleeanne worked on the Database layer by setting up AWS, and linking the database together and making sure the models were in-line with what was expected to happen with data as well as security. 