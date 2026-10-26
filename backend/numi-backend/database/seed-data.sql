-- =====================================================================
-- Numi - adatbázis feltöltő szkript (seed)
-- =====================================================================
-- Tartalma:
--   1. A `foods` és `food_allergens` táblák (ha még nem léteznek)
--   2. A 113 alapanyag (kalória és makrók 100 grammra vetítve)
--   3. Az allergén-besorolás (az AllergenType enum értékeivel)
--
-- Futtatás: az alkalmazás első indítása UTÁN (a Hibernate létrehozza a
-- többi táblát), a numi_db adatbázison (pgAdmin Query Tool vagy psql).
--
-- A szkript TÖBBSZÖR IS FUTTATHATÓ: csak azt szúrja be, ami még nincs
-- benne, ezért nem duplikálja az adatokat.
-- =====================================================================

SET client_encoding = 'UTF8';

-- ---------------------------------------------------------------------
-- 1. TÁBLÁK
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS foods (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    calories_100g NUMERIC(6,2) NOT NULL,
    protein_100g NUMERIC(6,2) NOT NULL,
    carbs_100g NUMERIC(6,2) NOT NULL,
    fat_100g NUMERIC(6,2) NOT NULL,
    fiber_100g NUMERIC(6,2) DEFAULT 0.0,
    is_custom BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_foods_name ON foods (name);
CREATE INDEX IF NOT EXISTS idx_foods_category ON foods (category);

-- Az allergének kapcsolótáblája (a Food entitás @ElementCollection mezője)
CREATE TABLE IF NOT EXISTS food_allergens (
    food_id BIGINT NOT NULL REFERENCES foods(id) ON DELETE CASCADE,
    allergen VARCHAR(50) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_food_allergens_food_id ON food_allergens (food_id);

-- ---------------------------------------------------------------------
-- 2. ALAPANYAGOK (113 db)
-- ---------------------------------------------------------------------
INSERT INTO foods (name, category, calories_100g, protein_100g, carbs_100g, fat_100g, fiber_100g, is_custom)
SELECT v.name, v.category, v.calories_100g, v.protein_100g, v.carbs_100g, v.fat_100g, v.fiber_100g, v.is_custom
FROM (VALUES
    -- HÚSOK ÉS HALAK
    ('Csirkemellfilé (nyers)', 'Húsok és halak', 120.0, 22.5, 0.0, 2.6, 0.0, false),
    ('Csirkecomb (bőr nélkül, nyers)', 'Húsok és halak', 140.0, 19.0, 0.0, 7.0, 0.0, false),
    ('Pulykamellfilé (nyers)', 'Húsok és halak', 110.0, 24.0, 0.0, 1.5, 0.0, false),
    ('Sertéskaraj (sovány, nyers)', 'Húsok és halak', 145.0, 21.5, 0.0, 6.5, 0.0, false),
    ('Sertéscomb (nyers)', 'Húsok és halak', 135.0, 21.0, 0.0, 5.5, 0.0, false),
    ('Marha hátszín (sovány, nyers)', 'Húsok és halak', 150.0, 22.0, 0.0, 6.8, 0.0, false),
    ('Marhacomb (nyers)', 'Húsok és halak', 135.0, 21.5, 0.0, 5.0, 0.0, false),
    ('Darált marhahús (sovány, 10% zsír)', 'Húsok és halak', 175.0, 20.0, 0.0, 10.5, 0.0, false),
    ('Darált sertéshús (20% zsír)', 'Húsok és halak', 260.0, 17.0, 0.0, 21.0, 0.0, false),
    ('Lazacfilé (nyers)', 'Húsok és halak', 208.0, 20.0, 0.0, 13.5, 0.0, false),
    ('Tonhal (saját lében, konzerv)', 'Húsok és halak', 110.0, 25.5, 0.0, 0.8, 0.0, false),
    ('Tőkehalfilé (nyers)', 'Húsok és halak', 82.0, 17.8, 0.0, 0.7, 0.0, false),
    ('Pisztráng (nyers)', 'Húsok és halak', 140.0, 19.5, 0.0, 6.5, 0.0, false),
    ('Garnélarák (nyers)', 'Húsok és halak', 85.0, 18.0, 0.5, 1.0, 0.0, false),
    ('Csirkemellsonka (csemege)', 'Húsok és halak', 95.0, 18.5, 1.5, 1.8, 0.0, false),

    -- TEJTERMÉKEK ÉS TOJÁS
    ('Tojás (egész, nyers)', 'Tejtermékek és tojás', 143.0, 12.6, 0.7, 9.5, 0.0, false),
    ('Tojásfehérje', 'Tejtermékek és tojás', 52.0, 11.0, 0.7, 0.2, 0.0, false),
    ('Tehéntúró (félzsíros)', 'Tejtermékek és tojás', 145.0, 16.0, 3.5, 7.0, 0.0, false),
    ('Tehéntúró (sovány)', 'Tejtermékek és tojás', 80.0, 17.5, 3.8, 0.5, 0.0, false),
    ('Cottage cheese (félzsíros)', 'Tejtermékek és tojás', 98.0, 11.5, 3.5, 4.3, 0.0, false),
    ('Cottage cheese (light)', 'Tejtermékek és tojás', 75.0, 12.5, 3.0, 1.5, 0.0, false),
    ('Trappista sajt', 'Tejtermékek és tojás', 350.0, 26.0, 1.0, 27.5, 0.0, false),
    ('Gouda sajt', 'Tejtermékek és tojás', 356.0, 25.0, 2.2, 27.0, 0.0, false),
    ('Mozzarella (félzsíros)', 'Tejtermékek és tojás', 280.0, 20.0, 2.0, 21.0, 0.0, false),
    ('Mozzarella light', 'Tejtermékek és tojás', 165.0, 19.0, 1.5, 9.0, 0.0, false),
    ('Feta sajt', 'Tejtermékek és tojás', 264.0, 14.2, 4.1, 21.3, 0.0, false),
    ('Parmezán sajt (reszelt)', 'Tejtermékek és tojás', 431.0, 38.4, 4.1, 28.6, 0.0, false),
    ('Görög joghurt (10%)', 'Tejtermékek és tojás', 120.0, 5.0, 3.5, 10.0, 0.0, false),
    ('Natúr joghurt (3%)', 'Tejtermékek és tojás', 62.0, 3.5, 4.7, 3.0, 0.0, false),
    ('Kefir', 'Tejtermékek és tojás', 55.0, 3.2, 4.0, 3.0, 0.0, false),
    ('Tej (1.5%)', 'Tejtermékek és tojás', 44.0, 3.2, 4.7, 1.5, 0.0, false),
    ('Tej (2.8%)', 'Tejtermékek és tojás', 56.0, 3.1, 4.7, 2.8, 0.0, false),
    ('Tejföl (12%)', 'Tejtermékek és tojás', 135.0, 3.0, 3.8, 12.0, 0.0, false),
    ('Tejföl (20%)', 'Tejtermékek és tojás', 205.0, 2.7, 3.6, 20.0, 0.0, false),
    ('Tejszínhab (30%)', 'Tejtermékek és tojás', 292.0, 2.4, 3.0, 30.0, 0.0, false),

    -- GABONAFÉLÉK, PÉKÁRUK, TÉSZTÁK ÉS RIZS
    ('Basmati rizs (nyers)', 'Gabonafélék és pékáruk', 355.0, 8.5, 77.0, 1.0, 1.5, false),
    ('Jázmin rizs (nyers)', 'Gabonafélék és pékáruk', 350.0, 7.0, 78.0, 0.8, 1.0, false),
    ('Barna rizs (nyers)', 'Gabonafélék és pékáruk', 360.0, 7.5, 75.0, 2.5, 3.5, false),
    ('Zabpehely (finomszemű)', 'Gabonafélék és pékáruk', 370.0, 13.5, 60.0, 7.0, 10.0, false),
    ('Zabkorpa', 'Gabonafélék és pékáruk', 246.0, 17.3, 66.2, 7.0, 15.4, false),
    ('Kuszkusz (nyers)', 'Gabonafélék és pékáruk', 350.0, 12.0, 72.0, 1.2, 4.0, false),
    ('Bulgur (nyers)', 'Gabonafélék és pékáruk', 342.0, 12.3, 69.0, 1.3, 8.0, false),
    ('Köles (nyers)', 'Gabonafélék és pékáruk', 360.0, 11.0, 68.0, 3.8, 8.5, false),
    ('Hajdina (nyers)', 'Gabonafélék és pékáruk', 343.0, 13.2, 71.5, 3.4, 10.0, false),
    ('Kinoa (nyers)', 'Gabonafélék és pékáruk', 368.0, 14.1, 64.2, 6.1, 7.0, false),
    ('Durum tészta (száraz)', 'Gabonafélék és pékáruk', 355.0, 12.5, 72.0, 1.5, 3.0, false),
    ('Teljes kiőrlésű tészta (száraz)', 'Gabonafélék és pékáruk', 340.0, 14.0, 65.0, 2.5, 9.0, false),
    ('Tojásos tészta (4 tojásos, száraz)', 'Gabonafélék és pékáruk', 380.0, 13.0, 74.0, 3.5, 2.5, false),
    ('Búzaliszt (BL55 finomliszt)', 'Gabonafélék és pékáruk', 345.0, 10.5, 73.0, 1.0, 2.5, false),
    ('Teljes kiőrlésű búzaliszt', 'Gabonafélék és pékáruk', 330.0, 13.0, 62.0, 2.2, 10.5, false),
    ('Fehér kenyér', 'Gabonafélék és pékáruk', 265.0, 8.5, 52.0, 1.5, 2.5, false),
    ('Félbarna kenyér', 'Gabonafélék és pékáruk', 250.0, 8.8, 49.0, 1.8, 4.5, false),
    ('Teljes kiőrlésű kenyér', 'Gabonafélék és pékáruk', 235.0, 9.5, 43.0, 2.5, 7.0, false),
    ('Rozskenyér', 'Gabonafélék és pékáruk', 240.0, 8.0, 46.0, 1.5, 6.5, false),
    ('Tortilla lap (búza)', 'Gabonafélék és pékáruk', 305.0, 8.5, 53.0, 6.5, 3.0, false),
    ('Puffasztott rizs szelet', 'Gabonafélék és pékáruk', 380.0, 8.0, 81.0, 2.5, 3.5, false),

    -- HÜVELYESEK ÉS NÖVÉNYI FEHÉRJÉK
    ('Csicseriborsó (száraz)', 'Hüvelyesek', 364.0, 19.3, 60.6, 6.0, 17.4, false),
    ('Csicseriborsó (konzerv, lecsöpögtetett)', 'Hüvelyesek', 120.0, 7.0, 17.0, 2.0, 5.5, false),
    ('Vöröslencse (száraz)', 'Hüvelyesek', 340.0, 24.0, 54.0, 1.5, 11.0, false),
    ('Barna lencse (száraz)', 'Hüvelyesek', 330.0, 23.5, 52.0, 1.5, 12.0, false),
    ('Bab (száraz tarkabab)', 'Hüvelyesek', 310.0, 21.0, 48.0, 1.5, 16.0, false),
    ('Vörösbab (konzerv, lecsöpögtetett)', 'Hüvelyesek', 105.0, 8.0, 15.0, 0.6, 6.0, false),
    ('Zöldborsó (fagyasztott)', 'Hüvelyesek', 81.0, 5.4, 14.5, 0.4, 5.7, false),
    ('Tofu (natúr)', 'Hüvelyesek', 80.0, 8.5, 1.5, 4.5, 0.8, false),
    ('Szójagranulátum (száraz)', 'Hüvelyesek', 320.0, 48.0, 20.0, 1.5, 15.0, false),

    -- ZÖLDSÉGEK ÉS GOMBÁK
    ('Burgonya (nyers)', 'Zöldségek', 77.0, 2.0, 17.0, 0.1, 2.2, false),
    ('Édesburgonya (nyers)', 'Zöldségek', 86.0, 1.6, 20.1, 0.1, 3.0, false),
    ('Brokkoli (nyers)', 'Zöldségek', 34.0, 2.8, 6.6, 0.4, 2.6, false),
    ('Karfiol (nyers)', 'Zöldségek', 25.0, 1.9, 5.0, 0.3, 2.0, false),
    ('Sárgarépa (nyers)', 'Zöldségek', 41.0, 0.9, 9.6, 0.2, 2.8, false),
    ('Paradicsom (nyers)', 'Zöldségek', 18.0, 0.9, 3.9, 0.2, 1.2, false),
    ('Kígyóuborka (nyers)', 'Zöldségek', 15.0, 0.7, 3.6, 0.1, 0.5, false),
    ('Cukkini (nyers)', 'Zöldségek', 17.0, 1.2, 3.1, 0.3, 1.0, false),
    ('Paprika (TV / tölteni való)', 'Zöldségek', 20.0, 1.0, 3.5, 0.2, 1.5, false),
    ('Kápia paprika', 'Zöldségek', 30.0, 1.2, 5.8, 0.3, 2.0, false),
    ('Vöröshagyma (nyers)', 'Zöldségek', 40.0, 1.1, 9.3, 0.1, 1.7, false),
    ('Fokhagyma (nyers)', 'Zöldségek', 149.0, 6.4, 33.0, 0.5, 2.1, false),
    ('Spenót (nyers)', 'Zöldségek', 23.0, 2.9, 3.6, 0.4, 2.2, false),
    ('Fejes saláta (nyers)', 'Zöldségek', 15.0, 1.4, 2.9, 0.2, 1.3, false),
    ('Csiperkegomba (nyers)', 'Zöldségek', 22.0, 3.1, 3.3, 0.3, 1.0, false),
    ('Cékla (nyers)', 'Zöldségek', 43.0, 1.6, 9.6, 0.2, 2.8, false),
    ('Kukorica (csemege, konzerv)', 'Zöldségek', 80.0, 2.8, 15.0, 1.2, 2.4, false),
    ('Zöldbab (fagyasztott)', 'Zöldségek', 31.0, 1.8, 7.0, 0.2, 3.4, false),

    -- GYÜMÖLCSÖK
    ('Alma (nyers)', 'Gyümölcsök', 52.0, 0.3, 13.8, 0.2, 2.4, false),
    ('Banán (nyers)', 'Gyümölcsök', 89.0, 1.1, 22.8, 0.3, 2.6, false),
    ('Narancs (nyers)', 'Gyümölcsök', 47.0, 0.9, 11.8, 0.1, 2.4, false),
    ('Körte (nyers)', 'Gyümölcsök', 57.0, 0.4, 15.2, 0.1, 3.1, false),
    ('Eper (nyers)', 'Gyümölcsök', 32.0, 0.7, 7.7, 0.3, 2.0, false),
    ('Áfonya (nyers)', 'Gyümölcsök', 57.0, 0.7, 14.5, 0.3, 2.4, false),
    ('Málna (nyers)', 'Gyümölcsök', 52.0, 1.2, 11.9, 0.7, 6.5, false),
    ('Görögdinnye (nyers)', 'Gyümölcsök', 30.0, 0.6, 7.6, 0.2, 0.4, false),
    ('Őszibarack (nyers)', 'Gyümölcsök', 39.0, 0.9, 9.5, 0.3, 1.5, false),
    ('Szilva (nyers)', 'Gyümölcsök', 46.0, 0.7, 11.4, 0.3, 1.4, false),
    ('Szőlő (nyers)', 'Gyümölcsök', 69.0, 0.7, 18.1, 0.2, 0.9, false),
    ('Citrom (nyers)', 'Gyümölcsök', 29.0, 1.1, 9.3, 0.3, 2.8, false),
    ('Avokádó (nyers)', 'Gyümölcsök', 160.0, 2.0, 8.5, 14.7, 6.7, false),

    -- ZSÍROK ÉS OLAJOK
    ('Olívaolaj (extra szűz)', 'Zsírok és olajok', 884.0, 0.0, 0.0, 100.0, 0.0, false),
    ('Napraforgóolaj', 'Zsírok és olajok', 884.0, 0.0, 0.0, 100.0, 0.0, false),
    ('Kókuszzsír / Kókuszolaj', 'Zsírok és olajok', 862.0, 0.0, 0.0, 99.0, 0.0, false),
    ('Sertészsír', 'Zsírok és olajok', 900.0, 0.0, 0.0, 100.0, 0.0, false),
    ('Vaj (82% zsírtartalom)', 'Zsírok és olajok', 740.0, 0.7, 0.7, 82.0, 0.0, false),

    -- MAGVAK ÉS DIÓFÉLÉK
    ('Mandula', 'Magvak és diófélék', 579.0, 21.2, 21.6, 49.9, 12.5, false),
    ('Dió', 'Magvak és diófélék', 654.0, 15.2, 13.7, 65.2, 6.7, false),
    ('Mogyoró (földimogyoró, pirított)', 'Magvak és diófélék', 567.0, 25.8, 16.1, 49.2, 8.5, false),
    ('Mogyoróvaj (100% natúr)', 'Magvak és diófélék', 588.0, 25.0, 20.0, 50.0, 6.0, false),
    ('Tökmag (hámozott)', 'Magvak és diófélék', 559.0, 30.2, 10.7, 49.1, 6.0, false),
    ('Napraforgómag (hántolt)', 'Magvak és diófélék', 584.0, 20.8, 20.0, 51.5, 8.6, false),
    ('Chiamag', 'Magvak és diófélék', 486.0, 16.5, 42.1, 30.7, 34.4, false),
    ('Lenmag', 'Magvak és diófélék', 534.0, 18.3, 28.9, 42.2, 27.3, false),

    -- EGYÉB ÉS KIEGÉSZÍTŐK
    ('Méz', 'Egyéb', 304.0, 0.3, 82.4, 0.0, 0.2, false),
    ('Kristálycukor', 'Egyéb', 387.0, 0.0, 100.0, 0.0, 0.0, false),
    ('Holland kakaópor (zsírszegény)', 'Egyéb', 310.0, 20.0, 15.0, 11.0, 32.0, false),
    ('Tejsavófehérje por (Whey 80%)', 'Egyéb', 390.0, 78.0, 6.0, 6.0, 1.5, false)
) AS v(name, category, calories_100g, protein_100g, carbs_100g, fat_100g, fiber_100g, is_custom)
WHERE NOT EXISTS (SELECT 1 FROM foods f WHERE f.name = v.name);

-- ---------------------------------------------------------------------
-- 3. ALLERGÉN-BESOROLÁS
-- Az értékek az AllergenType enum neveivel egyeznek:
-- GLUTEN, LACTOSE, EGG, NUTS, PEANUT, SOY, FISH, SHELLFISH, SESAME, MUSTARD
-- (SESAME és MUSTARD: jelenleg nincs olyan alapanyag, amelyhez tartozna)
-- ---------------------------------------------------------------------

-- TEJTERMÉKEK (LACTOSE)
INSERT INTO food_allergens (food_id, allergen)
SELECT f.id, 'LACTOSE' FROM foods f
WHERE f.name IN (
    'Tehéntúró (félzsíros)', 'Tehéntúró (sovány)',
    'Cottage cheese (félzsíros)', 'Cottage cheese (light)',
    'Trappista sajt', 'Gouda sajt', 'Mozzarella (félzsíros)', 'Mozzarella light',
    'Feta sajt', 'Parmezán sajt (reszelt)',
    'Görög joghurt (10%)', 'Natúr joghurt (3%)', 'Kefir',
    'Tej (1.5%)', 'Tej (2.8%)',
    'Tejföl (12%)', 'Tejföl (20%)', 'Tejszínhab (30%)',
    'Vaj (82% zsírtartalom)',
    'Tejsavófehérje por (Whey 80%)'
)
AND NOT EXISTS (SELECT 1 FROM food_allergens a WHERE a.food_id = f.id AND a.allergen = 'LACTOSE');

-- TOJÁS (EGG)
INSERT INTO food_allergens (food_id, allergen)
SELECT f.id, 'EGG' FROM foods f
WHERE f.name IN (
    'Tojás (egész, nyers)', 'Tojásfehérje',
    'Tojásos tészta (4 tojásos, száraz)'
)
AND NOT EXISTS (SELECT 1 FROM food_allergens a WHERE a.food_id = f.id AND a.allergen = 'EGG');

-- HALAK (FISH)
INSERT INTO food_allergens (food_id, allergen)
SELECT f.id, 'FISH' FROM foods f
WHERE f.name IN (
    'Lazacfilé (nyers)', 'Tonhal (saját lében, konzerv)',
    'Tőkehalfilé (nyers)', 'Pisztráng (nyers)'
)
AND NOT EXISTS (SELECT 1 FROM food_allergens a WHERE a.food_id = f.id AND a.allergen = 'FISH');

-- RÁKFÉLÉK (SHELLFISH)
INSERT INTO food_allergens (food_id, allergen)
SELECT f.id, 'SHELLFISH' FROM foods f
WHERE f.name IN ('Garnélarák (nyers)')
AND NOT EXISTS (SELECT 1 FROM food_allergens a WHERE a.food_id = f.id AND a.allergen = 'SHELLFISH');

-- GLUTÉNTARTALMÚ GABONÁK (GLUTEN)
-- A zabot szándékosan kihagytuk: önmagában nem tartalmaz glutént.
INSERT INTO food_allergens (food_id, allergen)
SELECT f.id, 'GLUTEN' FROM foods f
WHERE f.name IN (
    'Durum tészta (száraz)', 'Teljes kiőrlésű tészta (száraz)', 'Tojásos tészta (4 tojásos, száraz)',
    'Búzaliszt (BL55 finomliszt)', 'Teljes kiőrlésű búzaliszt',
    'Fehér kenyér', 'Félbarna kenyér', 'Teljes kiőrlésű kenyér', 'Rozskenyér',
    'Tortilla lap (búza)', 'Kuszkusz (nyers)', 'Bulgur (nyers)'
)
AND NOT EXISTS (SELECT 1 FROM food_allergens a WHERE a.food_id = f.id AND a.allergen = 'GLUTEN');

-- SZÓJA (SOY)
INSERT INTO food_allergens (food_id, allergen)
SELECT f.id, 'SOY' FROM foods f
WHERE f.name IN ('Tofu (natúr)', 'Szójagranulátum (száraz)')
AND NOT EXISTS (SELECT 1 FROM food_allergens a WHERE a.food_id = f.id AND a.allergen = 'SOY');

-- DIÓFÉLÉK (NUTS)
INSERT INTO food_allergens (food_id, allergen)
SELECT f.id, 'NUTS' FROM foods f
WHERE f.name IN ('Mandula', 'Dió')
AND NOT EXISTS (SELECT 1 FROM food_allergens a WHERE a.food_id = f.id AND a.allergen = 'NUTS');

-- FÖLDIMOGYORÓ (PEANUT)
INSERT INTO food_allergens (food_id, allergen)
SELECT f.id, 'PEANUT' FROM foods f
WHERE f.name IN ('Mogyoró (földimogyoró, pirított)', 'Mogyoróvaj (100% natúr)')
AND NOT EXISTS (SELECT 1 FROM food_allergens a WHERE a.food_id = f.id AND a.allergen = 'PEANUT');

-- ---------------------------------------------------------------------
-- 4. ELLENŐRZÉS (futtasd le külön, az eredményt nézd meg)
-- ---------------------------------------------------------------------
-- SELECT COUNT(*) FROM foods;            -- 113
-- SELECT COUNT(*) FROM food_allergens;   -- 46
-- SELECT a.allergen, COUNT(*) FROM food_allergens a GROUP BY a.allergen ORDER BY a.allergen;
