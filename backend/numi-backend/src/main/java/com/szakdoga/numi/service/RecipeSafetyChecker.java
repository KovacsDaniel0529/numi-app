package com.szakdoga.numi.service;

import com.szakdoga.numi.model.AllergenType;
import org.springframework.stereotype.Component;

import java.text.Normalizer;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static com.szakdoga.numi.model.AllergenType.*;

/**
 * Az AI válasza után ellenőrzi, hogy a recept alapanyagai között nincs-e olyan,
 * ami a felhasználó allergiájába ütközik. Az AI-ra allergiánál nem bízhatjuk a döntést.
 *
 * Szabály: a kulcsszó végén lévő * azt jelenti, hogy "ezzel kezdődő szó" (pl. "tej*" -> tejföl, tejszín).
 * Csillag nélkül a szónak pontosan egyeznie kell (pl. "rak" nem találja meg a "rakott" szót).
 * Az ékezeteket és a nagybetűket az összehasonlítás előtt eltávolítjuk.
 */
@Component
public class RecipeSafetyChecker {

    private static final Map<AllergenType, List<String>> KEYWORDS = Map.ofEntries(
            Map.entry(GLUTEN, List.of("buza*", "liszt*", "kenyer*", "teszta*", "spagetti", "penne", "kuszkusz",
                    "bulgur", "arpa*", "rozs*", "zab*", "tortilla*", "zsemle*", "kifli*", "panir*", "morzsa*",
                    "szeitan", "dinkel*", "tarhonya*", "galuska*")),
            Map.entry(LACTOSE, List.of("tej*", "sajt*", "joghurt*", "turo*", "vaj", "vajat", "tejszin*", "kefir*",
                    "mozzarella*", "parmezan*", "feta*", "ricotta*", "mascarpone*", "paneer", "sovanyitott*", "cottage*")),
            Map.entry(EGG, List.of("tojas*", "majonez*")),
            Map.entry(NUTS, List.of("dio*", "mandula*", "mogyoro*", "kesu*", "pisztacia*", "pekan*", "makadamia*")),
            Map.entry(PEANUT, List.of("foldimogyoro*")),
            Map.entry(SOY, List.of("szoja*", "tofu*", "tempeh*", "edamame*", "miso*")),
            Map.entry(FISH, List.of("hal", "halfile*", "tonhal*", "lazac*", "pisztrang*", "szardinia*", "szardella*",
                    "hering*", "makrela*", "tokehal*", "ponty*", "harcsa*", "tilapia*")),
            Map.entry(SHELLFISH, List.of("garnela*", "rak", "rakok", "homar*", "languszta*")),
            Map.entry(SESAME, List.of("szezam*", "tahini*")),
            Map.entry(MUSTARD, List.of("mustar*")),
            Map.entry(CELERY, List.of("zeller*")),
            Map.entry(SULPHITES, List.of("szulfit*", "kensav*")),
            Map.entry(LUPIN, List.of("lupin*", "csillagfurt*")),
            Map.entry(MOLLUSCS, List.of("kagylo*", "csiga*", "kalamari*", "tintahal*", "polip*", "osztriga*"))
    );

    /** Visszaadja a talált problémákat (üres lista = nincs tiltott alapanyag). */
    public List<String> findViolations(List<String> ingredients, List<AllergenType> allergies) {
        List<String> violations = new ArrayList<>();
        if (ingredients == null || allergies == null) {
            return violations;
        }

        for (String ingredient : ingredients) {
            String[] words = normalize(ingredient).split("[^a-z]+");

            for (AllergenType allergen : allergies) {
                for (String keyword : KEYWORDS.getOrDefault(allergen, List.of())) {
                    if (anyWordMatches(words, keyword)) {
                        violations.add(ingredient + " (" + allergen + ")");
                        break;
                    }
                }
            }
        }
        return violations;
    }

    private boolean anyWordMatches(String[] words, String keyword) {
        boolean prefix = keyword.endsWith("*");
        String base = prefix ? keyword.substring(0, keyword.length() - 1) : keyword;

        for (String word : words) {
            if (word.isEmpty()) continue;
            if (prefix ? word.startsWith(base) : word.equals(base)) {
                return true;
            }
        }
        return false;
    }

    // "Tejföl" -> "tejfol"
    private String normalize(String text) {
        String lower = text == null ? "" : text.toLowerCase();
        return Normalizer.normalize(lower, Normalizer.Form.NFD).replaceAll("\\p{M}", "");
    }
}