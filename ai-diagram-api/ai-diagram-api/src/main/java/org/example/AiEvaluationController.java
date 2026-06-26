/*******************************************************************************
 * Copyright (c) 2026 Obeo.
 * This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v2.0
 * which accompanies this distribution, and is available at
 * https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Contributors:
 *     Obeo - initial API and implementation
 *******************************************************************************/
package org.example;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class AiEvaluationController {

    public static class AiRequest {
        private String instruction;
        private String diagramData;

        public String getInstruction() { return instruction; }
        public void setInstruction(String instruction) { this.instruction = instruction; }

        public String getDiagramData() { return diagramData; }
        public void setDiagramData(String diagramData) { this.diagramData = diagramData; }
    }

    public static class AiResponse {
        private String answer;

        public AiResponse(String answer) { this.answer = answer; }

        public String getAnswer() { return answer; }
        public void setAnswer(String answer) { this.answer = answer; }
    }

    @PostMapping("/evaluate-diagram")
    public ResponseEntity<AiResponse> evaluateDiagram(@RequestBody AiRequest request) {
        String prompt = request.getInstruction();
        String img = request.getDiagramData();

        System.out.println("Instruction : " + prompt);

        if (img == null || img.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(new AiResponse("Erreur : Aucune image n'a été reçue."));
        }

        String aiAnswer = callGeminiApi(prompt, img);

        System.out.println("Réponse reçue");

        return ResponseEntity.ok(new AiResponse(aiAnswer));
    }

    private String callGeminiApi(String prompt, String base64Image) {

        String apiKey = "API_KEY"; // Remplacez par votre clé API

        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=" + apiKey;

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                        Map.of(
                                "parts", List.of(
                                        Map.of("text", prompt),
                                        Map.of(
                                                "inline_data", Map.of(
                                                        "mime_type", "image/png",
                                                        "data", base64Image 
                                                )
                                        )
                                )
                        )
                )
        );

        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);

        try {
            Map<String, Object> response = restTemplate.postForObject(url, requestEntity, Map.class);

            List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
            Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
            List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");

            return (String) parts.get(0).get("text");

        } catch (Exception e) {
            e.printStackTrace();
            return "Erreur Gemini : " + e.getMessage();
        }
    }

}