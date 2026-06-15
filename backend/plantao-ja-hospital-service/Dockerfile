FROM maven:3.9.16-eclipse-temurin-25

WORKDIR /app

COPY .mvn .mvn
COPY mvnw .
COPY pom.xml .
COPY src ./src

RUN chmod +x mvnw

EXPOSE 8080

CMD ["./mvnw", "spring-boot:run"]