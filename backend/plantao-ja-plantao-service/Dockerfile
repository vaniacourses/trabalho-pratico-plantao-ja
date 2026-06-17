FROM maven:3.9.6-eclipse-temurin-17

WORKDIR /app

COPY .mvn .mvn
COPY mvnw .
COPY pom.xml .
COPY src ./src

RUN chmod +x mvnw

# Mudamos para refletir a nova porta do seu colega
EXPOSE 8083

CMD ["./mvnw", "spring-boot:run", "-Dspring-boot.run.arguments=--server.address=0.0.0.0"]