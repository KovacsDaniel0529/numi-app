package com.szakdoga.numi.service;

import com.szakdoga.numi.model.AllergenType;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;

import static com.szakdoga.numi.model.AllergenType.*;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * A RecipeSafetyChecker egységtesztjei. Nincs szükség Spring-re vagy adatbázisra:
 * az osztály tiszta logika, ezért egyszerűen példányosítjuk.
 *
 * Három dolgot ellenőrzünk:
 *  1. megtalálja a tiltott alapanyagot (allergén, étrend),
 *  2. NEM jelez feleslegesen (hamis riasztás),
 *  3. a szélső esetek (null, üres lista, ékezet, nagybetű) nem okoznak hibát.
 */
class RecipeSafetyCheckerTest {

    private final RecipeSafetyChecker checker = new RecipeSafetyChecker();

    // ---------- Allergének: találat ----------

    @Test
    @DisplayName("Laktóz: a tejföl és a tejszín is tiltott (tej* előtag)")
    void lactoseDetectsMilkProducts() {
        List<String> result = checker.findViolations(
                List.of("200 g tejföl", "100 ml tejszín", "50 g rizs"), List.of(LACTOSE));

        assertEquals(2, result.size());
        assertTrue(result.get(0).contains("tejföl"));
        assertTrue(result.get(1).contains("tejszín"));
    }

    @Test
    @DisplayName("Glutén: a búzaliszt és a tészta is találat")
    void glutenDetectsFlourAndPasta() {
        List<String> result = checker.findViolations(
                List.of("200 g búzaliszt", "150 g tészta"), List.of(GLUTEN));

        assertEquals(2, result.size());
    }

    @Test
    @DisplayName("Tojás: a majonéz is tojásos termék")
    void eggDetectsMayonnaise() {
        assertEquals(1, checker.findViolations(List.of("2 ek majonéz"), List.of(EGG)).size());
    }

    @Test
    @DisplayName("Földimogyoró allergia: a földimogyoró-vaj találat")
    void peanutDetected() {
        assertEquals(1, checker.findViolations(List.of("2 ek földimogyoró-vaj"), List.of(PEANUT)).size());
    }

    @Test
    @DisplayName("Rákfélék: a rák és a rákok (pontos egyezés) találat")
    void shellfishExactWords() {
        assertEquals(1, checker.findViolations(List.of("200 g rák"), List.of(SHELLFISH)).size());
        assertEquals(1, checker.findViolations(List.of("200 g rákok"), List.of(SHELLFISH)).size());
    }

    // ---------- Allergének: nincs hamis riasztás ----------

    @Test
    @DisplayName("A 'rakott' nem rák: a 'rak' kulcsszó csak pontos egyezésnél találat")
    void rakottIsNotShellfish() {
        assertTrue(checker.findViolations(List.of("rakott krumpli"), List.of(SHELLFISH)).isEmpty());
    }

    @Test
    @DisplayName("A kókusztej nem tejtermék (nem 'tej'-jel kezdődik)")
    void coconutMilkIsNotDairy() {
        assertTrue(checker.findViolations(List.of("200 ml kókusztej"), List.of(LACTOSE)).isEmpty());
    }

    @Test
    @DisplayName("A mogyoróvaj nem tejtermék (a 'vaj' csak pontos egyezésnél találat)")
    void nutButterIsNotDairy() {
        assertTrue(checker.findViolations(List.of("2 ek mogyoróvaj"), List.of(LACTOSE)).isEmpty());
    }

    @Test
    @DisplayName("Más allergénre nem jelez: a rizs nem glutén")
    void riceIsNotGluten() {
        assertTrue(checker.findViolations(List.of("200 g rizs"), List.of(GLUTEN)).isEmpty());
    }

    @Test
    @DisplayName("Csak a kiválasztott allergént nézi: tejföl tojásallergiánál nem gond")
    void onlyChecksSelectedAllergens() {
        assertTrue(checker.findViolations(List.of("200 g tejföl"), List.of(EGG)).isEmpty());
    }

    // ---------- Szélső esetek ----------

    @Test
    @DisplayName("Ékezet és nagybetű nem számít")
    void ignoresAccentsAndCase() {
        assertEquals(1, checker.findViolations(List.of("TEJFÖL"), List.of(LACTOSE)).size());
        assertEquals(1, checker.findViolations(List.of("tejfol"), List.of(LACTOSE)).size());
    }

    @Test
    @DisplayName("Több allergén esetén mindegyiket jelzi")
    void multipleAllergensReported() {
        List<String> result = checker.findViolations(
                List.of("200 g tejföl", "2 db tojás"), List.of(LACTOSE, EGG));

        assertEquals(2, result.size());
    }

    @Test
    @DisplayName("Üres allergiák vagy null bemenet esetén nincs hiba, nincs találat")
    void emptyOrNullInputs() {
        assertTrue(checker.findViolations(List.of("200 g tejföl"), List.of()).isEmpty());
        assertTrue(checker.findViolations(null, List.of(LACTOSE)).isEmpty());
        assertTrue(checker.findViolations(List.of("200 g tejföl"), (List<AllergenType>) null).isEmpty());
    }

    // ---------- Étrendi preferencia ----------

    @Test
    @DisplayName("Vegetáriánus: a hús és a hal tiltott, a tojás és a sajt nem")
    void vegetarianRules() {
        List<String> result = checker.findDietViolations(
                List.of("200 g csirkemell", "100 g lazac", "2 db tojás", "100 g sajt"), "vegetarian");

        assertEquals(2, result.size());
        assertTrue(result.get(0).contains("csirkemell"));
        assertTrue(result.get(1).contains("lazac"));
    }

    @Test
    @DisplayName("Vegán: hús, tojás, méz is tiltott")
    void veganRules() {
        List<String> result = checker.findDietViolations(
                List.of("200 g csirkemell", "2 db tojás", "1 ek méz", "100 g sajt"), "vegan");

        assertEquals(4, result.size());
    }

    @Test
    @DisplayName("Vegán: a növényi alapanyagok (rizs, tofu, mandulatej, kókuszvíz) rendben vannak")
    void veganAllowsPlantFoods() {
        assertTrue(checker.findDietViolations(
                List.of("100 g rizs", "150 g tofu", "200 ml mandulatej", "200 ml kókuszvíz"), "vegan").isEmpty());
    }

    @Test
    @DisplayName("Pescetáriánus: hús tiltott, a hal megengedett")
    void pescatarianRules() {
        List<String> result = checker.findDietViolations(
                List.of("200 g sertéscomb", "100 g lazac"), "pescatarian");

        assertEquals(1, result.size());
        assertTrue(result.get(0).contains("sertéscomb"));
    }

    @Test
    @DisplayName("Mindenevő, ismeretlen vagy hiányzó étrend: nincs korlátozás")
    void omnivoreAndUnknownDietAllowEverything() {
        List<String> meat = List.of("200 g csirkemell");

        assertTrue(checker.findDietViolations(meat, "omnivore").isEmpty());
        assertTrue(checker.findDietViolations(meat, "valami-mas").isEmpty());
        assertTrue(checker.findDietViolations(meat, null).isEmpty());
        assertFalse(checker.findDietViolations(meat, "vegan").isEmpty());
    }
}