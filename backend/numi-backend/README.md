# Numi – dietetikus és kalóriakövető alkalmazás (backend)

A Numi egy táplálkozás-nyilvántartó alkalmazás, amellyel a felhasználó követheti a napi étkezéseit és a vízfogyasztását, a rendszer pedig a profilja (testsúly, magasság, kor, aktivitás, cél) alapján kiszámolja a napi kalória- és vízcélját. Az alapanyagoknál figyelmeztet, ha az adott étel a felhasználó allergiáját érinti.

Szakdolgozati projekt. Ez a repository a **Spring Boot backendet** tartalmazza.

## Technológiák

- Java, Spring Boot 3 (Spring Web, Spring Data JPA)
- PostgreSQL
- Lombok
- Maven
- Frontend (külön): React + Vite + Tailwind CSS

## Indítás

### Előfeltételek

- JDK 17 vagy újabb
- PostgreSQL (alapértelmezetten a `localhost:5432` címen)

### Lépések

1. **Adatbázis létrehozása.** Hozz létre egy `numi_db` nevű adatbázist PostgreSQL-ben.
2. **Kapcsolat beállítása.** Az `src/main/resources/application.properties` fájlban add meg a saját PostgreSQL felhasználónevedet és jelszavadat:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/numi_db
   spring.datasource.username=<felhasználónév>
   spring.datasource.password=<jelszó>
   spring.jpa.hibernate.ddl-auto=update
   ```
3. **A backend első indítása.** A Hibernate (`ddl-auto=update`) ilyenkor létrehozza a táblákat.
   ```bash
   ./mvnw spring-boot:run
   ```
   (Windowson: `mvnw.cmd spring-boot:run`, vagy az IDE-ből a `NumiBackendApplication` futtatása.)
4. **Alapadatok betöltése.** Futtasd le a `database/seed-data.sql` fájlt a `numi_db` adatbázison (pgAdmin Query Tool vagy `psql`). Ez betölti a **113 alapanyagot** és az **allergén-besorolást**.
   ```bash
   psql -U <felhasználónév> -d numi_db -f database/seed-data.sql
   ```
   A szkript többször is futtatható, nem duplikálja az adatokat.
5. A backend a **http://localhost:8080** címen érhető el.

> A seed szkript nélkül a Kajapédia üres lesz, és az allergén-figyelmeztetés sem működik.

### Gyors ellenőrzés

```sql
SELECT COUNT(*) FROM foods;           -- 113
SELECT COUNT(*) FROM food_allergens;  -- 46
```

## API áttekintés

A felhasználót jelenleg a `username` azonosítja az URL-ben.

| Metódus | Útvonal | Leírás |
|---|---|---|
| POST | `/api/register` | Regisztráció |
| POST | `/api/login` | Bejelentkezés |
| GET | `/api/stats/{username}` | Felhasználó és profil lekérdezése |
| POST | `/api/profile/{username}` | Profil mentése/módosítása (kalória- és vízcél újraszámolása) |
| GET | `/api/foods?search=&username=` | Alapanyagok keresése; `username` megadásakor allergén-figyelmeztetéssel |
| POST | `/api/food-logs/{username}` | Étel rögzítése a naplóba |
| GET | `/api/food-logs/{username}?date=YYYY-MM-DD` | Napi napló (dátum nélkül: a mai nap) |
| DELETE | `/api/food-logs/{id}` | Naplóbejegyzés törlése |
| POST | `/api/water-logs/{username}` | Vízbevitel rögzítése (ml) |
| GET | `/api/water-logs/{username}?date=YYYY-MM-DD` | Napi vízösszesítés a célhoz viszonyítva |

### Hibaválaszok

Minden hiba egységes JSON formátumban érkezik:

```json
{
  "timestamp": "2026-10-27T10:15:30.123",
  "status": 401,
  "message": "Hibás felhasználónév vagy jelszó!"
}
```

| Kód | Jelentés |
|---|---|
| 400 | Hibás vagy hiányzó adat (pl. negatív mennyiség, ismeretlen allergén-név) |
| 401 | Hibás bejelentkezési adatok |
| 404 | A keresett felhasználó, alapanyag vagy bejegyzés nem létezik |
| 409 | Foglalt felhasználónév vagy email |
| 500 | Váratlan szerverhiba |

## Főbb elemek

- **Napi kalóriacél:** Mifflin–St Jeor képlet (BMR) × aktivitási szorzó, a cél (fogyás / tartás / hízás) szerint módosítva.
- **Napi vízcél:** kb. 33 ml / testsúly-kilogramm.
- **Naplózás:** az alapanyagok adatai 100 grammra vannak megadva, a napló a megevett mennyiségre arányosítva adja vissza a kalóriát és a makrókat.
- **Allergének:** az `AllergenType` enum (`GLUTEN`, `LACTOSE`, `EGG`, `NUTS`, `PEANUT`, `SOY`, `FISH`, `SHELLFISH`, `SESAME`, `MUSTARD`) mind az alapanyagoknál, mind a felhasználói profilban ugyanaz, így az összevetés pontos.

## Mappastruktúra

```
src/main/java/com/szakdoga/numi/
├── controller/   REST végpontok
├── service/      üzleti logika
├── repository/   adatbázis-elérés (Spring Data JPA)
├── model/        JPA entitások és enumok
├── dto/          kérés/válasz objektumok
├── mapper/       entitás ↔ DTO átalakítás
└── exception/    saját kivételek és központi hibakezelés
database/
└── seed-data.sql alapanyagok és allergén-besorolás
```

## Ismert egyszerűsítések

A projekt szakdolgozati prototípus, ezért néhány dolog szándékosan egyszerű:

- A jelszavak jelenleg nyers szövegként tárolódnak (éles rendszerben hashelés szükséges, pl. BCrypt).
- Nincs token- vagy session-alapú hitelesítés, a felhasználót az URL-ben megadott `username` azonosítja.
- A `ddl-auto=update` fejlesztői beállítás, éles környezetben migrációs eszköz (pl. Flyway) javasolt.
