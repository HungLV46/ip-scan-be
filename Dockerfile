# Use the official Node.js image as the base image
FROM node:20.12.0

# Define a build-time argument for the port
ARG PORT=3000

# Expose the port the app runs on
EXPOSE ${PORT}

# Set the working directory in the container
WORKDIR /ip-scan-be

# Copy the rest of the application files
ADD . /ip-scan-be

# Command to run the application
CMD ["yarn", "start"]
