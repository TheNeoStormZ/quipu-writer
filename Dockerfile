# Use an official OpenJDK 17 runtime as a parent image
FROM eclipse-temurin:17
ARG SPRING_DEVTOOLS=false
ARG SPRING_LOG=ERROR
# Set the working directory to /app
WORKDIR /app

# Copy the entire project directory into the container at /app
COPY . /app

# Install project dependencies

RUN --mount=type=secret,id=_env,dst=/etc/secrets/deploy ./mvnw clean install -DskipTests=true


# Define the command to run when the container starts
CMD ["java", "-jar", "target/quipu-0.0.1-SNAPSHOT.jar"]