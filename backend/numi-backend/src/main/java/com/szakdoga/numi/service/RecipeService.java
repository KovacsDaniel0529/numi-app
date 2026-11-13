package com.szakdoga.numi.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.szakdoga.numi.dto.DailySummaryDTO;
import com.szakdoga.numi.dto.RecipeRequestDTO;
import com.szakdoga.numi.dto.RecipeResponseDTO;
import com.szakdoga.numi.exception.AiServiceException;
import com.szakdoga.numi.exception.BadRequestException;
import com.szakdoga.numi.exception.ResourceNotFoundException;
import com.szakdoga.numi.model.AllergenType;
import com.szakdoga.numi.model.AppUser;
import com.szakdoga.numi.model.ProfileDetail;
import com.szakdoga.numi.repository.AppUserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class RecipeService {

    private static final int MAX_ATTEMPTS = 3;

    // Az allergének magyar nevei a prompthoz
    private static final Map<AllergenType, String> HU_NAMES = Map.ofEntries(
            Map.entry(AllergenType.GLUTEN, "glutén (búza, liszt, tészta, kenyér stb.)"),
            Map.entry(AllergenType.LACTOSE, "laktóz / tejtermékek (tej, sajt, joghurt, vaj, tejföl stb.)"),
            Map.entry(AllergenType.EGG, "tojás"),
            Map.entry(AllergenType.NUTS, "diófélék"),
            Map.entry(AllergenType.PEANUT, "földimogyoró"),
            Map.entry(AllergenType.SOY, "szója"),
            Map.entry(AllergenType.FISH, "hal"),
            Map.entry(AllergenType.SHELLFISH, "rákfélék"),
            Map.entry(AllergenType.SESAME, "szezám"),
            Map.entry(AllergenType.MUSTARD, "mustár"),
            Map.entry(AllergenType.CELERY, "zeller"),
            Map.entry(AllergenType.SULPHITES, "szulfitok"),
            Map.entry(AllergenType.LUPIN, "csillagfürt"),
            Map.entry(AllergenType.MOLLUSCS, "puhatestűek (kagyló, csiga, tintahal)")
    );

    private final AppUserRepository appUserRepository;
    private final CalendarService calendarService;
    private final RecipeSafetyChecker safetyChecker;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${gemini.api-key:}")
    private String apiKey;

    @Value("${gemini.model:gemini-2.5-flash}")
    private String model;

    @Value("${gemini.fallback-model:}")
    private String fallbackModel;

    private final RestTemplate restTemplate = createRestTemplate();

    public RecipeResponseDTO generateRecipe(String username, RecipeRequestDTO request) {
        AppUser user = appUserRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Felhasználó nem található: " + username));

        ProfileDetail profile = user.getProfileDetail();
        if (profile == null) {
            throw new BadRequestException("Recept kéréséhez előbb töltsd ki a profilodat!");
        }

        List<AllergenType> allergies = profile.getAllergies() == null ? List.of() : profile.getAllergies();

        // Hány kalóriás legyen a recept: a mára hátralévőből indulunk ki, de egy étkezéshez észszerű keretek közé szorítjuk
        DailySummaryDTO today = calendarService.getDailySummary(username, LocalDate.now());
        Number remaining = today.getCaloriesRemaining();
        int targetKcal = remaining == null ? 600 : Math.max(300, Math.min(remaining.intValue(), 800));

        String basePrompt = buildPrompt(allergies, targetKcal, request == null ? null : request.getPreferences());
        String prompt = basePrompt;

        // Legfeljebb háromszor próbálkozunk: ha az AI tiltott alapanyagot adott, újat kérünk
        for (int attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
            RecipeResponseDTO recipe = parseRecipe(callGemini(prompt));

            List<String> violations = safetyChecker.findViolations(recipe.getIngredients(), allergies);
            if (violations.isEmpty()) {
                return recipe;
            }

            log.warn("Az AI tiltott alapanyagot javasolt ({}. próbálkozás): {}", attempt, violations);
            prompt = basePrompt + "\n\nFIGYELEM: az előző javaslatod tiltott alapanyagot tartalmazott: "
                    + String.join(", ", violations) + ". Készíts egy teljesen másik receptet, amiben ezek nincsenek!";
        }

        throw new AiServiceException("Nem sikerült biztonságos receptet készíteni. Próbáld újra egy kicsit később!");
    }

    private String buildPrompt(List<AllergenType> allergies, int targetKcal, String preferences) {
        String forbidden = allergies.isEmpty()
                ? "nincs"
                : allergies.stream().map(a -> HU_NAMES.getOrDefault(a, a.name())).collect(Collectors.joining("; "));

        String wishes = (preferences == null || preferences.isBlank()) ? "nincs külön kérés" : preferences.trim();

        return """
                Te egy dietetikus asszisztens vagy. Javasolj EGY receptet magyarul, egyetlen étkezéshez.

                SZABÁLYOK:
                - Tiltott alapanyagok (allergia vagy intolerancia, ezek SEMMILYEN formában nem szerepelhetnek, nyomokban sem): %s
                - Az adag kb. %d kalóriás legyen.
                - A felhasználó kérése: %s
                - A recept legyen egyszerű, hétköznapi alapanyagokból, a lépések rövidek.
                - Az "ingredients" lista minden eleme egy alapanyag mennyiséggel (pl. "200 g csirkemell").
                - A leírásban és a címben ne említsd az allergiákat és a tiltott alapanyagokat, a leírás a konkrét hozzávalókról szóljon.

                A válasz KIZÁRÓLAG egy érvényes JSON legyen, pontosan ebben a formában, más szöveg nélkül:
                {
                  "title": "a recept neve",
                  "description": "1-2 mondatos leírás",
                  "ingredients": ["200 g csirkemell", "..."],
                  "steps": ["első lépés", "..."],
                  "calories": 0,
                  "protein": 0,
                  "carbs": 0,
                  "fat": 0
                }
                A calories kcal-ban, a protein, carbs és fat grammban értendő, egész számok az egész adagra.
                """.formatted(forbidden, targetKcal, wishes);
    }

    // ---------- Gemini hívás ----------
    private String callGemini(String prompt) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new AiServiceException("Az AI szolgáltatás nincs beállítva (hiányzó API-kulcs).");
        }

        List<String> models = (fallbackModel == null || fallbackModel.isBlank())
                ? List.of(model)
                : List.of(model, fallbackModel);

        // Minden modellel kétszer próbálkozunk, ha túlterhelt (503) vagy túl sok a kérés (429)
        for (String modelName : models) {
            for (int attempt = 1; attempt <= 2; attempt++) {
                try {
                    return callModel(modelName, prompt);
                } catch (HttpServerErrorException | HttpClientErrorException.TooManyRequests e) {
                    log.warn("Gemini ({}) átmenetileg nem elérhető, {}. próbálkozás: {}",
                            modelName, attempt, e.getMessage());
                    try {
                        Thread.sleep(2000L * attempt);   // 2 mp, majd 4 mp várakozás
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                        throw new AiServiceException("A kérés megszakadt. Próbáld újra!");
                    }
                }
            }
        }
        throw new AiServiceException("Az AI szolgáltatás most túlterhelt. Próbáld újra egy perc múlva!");
    }

    private String callModel(String modelName, String prompt) {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/" + modelName + ":generateContent";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("x-goog-api-key", apiKey);

        Map<String, Object> body = Map.of(
                "contents", List.of(Map.of("parts", List.of(Map.of("text", prompt)))),
                "generationConfig", Map.of(
                        "responseMimeType", "application/json",
                        "temperature", 0.7
                )
        );


        try {
            ResponseEntity<String> response = restTemplate.postForEntity(
                    url, new HttpEntity<>(body, headers), String.class);

            JsonNode text = null;
            if (response.getBody() != null) {
                text = objectMapper.readTree(response.getBody())
                        .path("candidates").path(0).path("content").path("parts").path(0).path("text");
            }

            if (text == null || text.isMissingNode() || text.asText().isBlank()) {
                throw new AiServiceException("Az AI üres választ adott. Próbáld újra!");
            }
            return text.asText();

        } catch (HttpServerErrorException | HttpClientErrorException.TooManyRequests e) {
            throw e;   // ezeket a callGemini kezeli (újrapróbálkozás)
        } catch (JsonProcessingException e) {
            log.error("A Gemini válasza nem olvasható", e);
            throw new AiServiceException("Az AI válasza nem volt értelmezhető. Próbáld újra!");
        }
         catch (RestClientException e) {
            log.error("Gemini hívás sikertelen ({})", modelName, e);
            throw new AiServiceException("Az AI szolgáltatás most nem érhető el. Próbáld újra később!");
        }
    }

    private RecipeResponseDTO parseRecipe(String json) {
        try {
            RecipeResponseDTO recipe = objectMapper.readValue(json, RecipeResponseDTO.class);
            if (recipe.getTitle() == null || recipe.getIngredients() == null || recipe.getSteps() == null) {
                throw new AiServiceException("Az AI hiányos receptet adott. Próbáld újra!");
            }
            return recipe;
        } catch (AiServiceException e) {
            throw e;
        } catch (Exception e) {
            log.error("Az AI válasza nem értelmezhető: {}", json, e);
            throw new AiServiceException("Az AI válasza nem volt értelmezhető. Próbáld újra!");
        }
    }

    private static RestTemplate createRestTemplate() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(5_000);   // 5 mp a kapcsolódásra
        factory.setReadTimeout(120_000);     // 40 mp a válaszra (az AI lassú lehet)
        return new RestTemplate(factory);
    }
}