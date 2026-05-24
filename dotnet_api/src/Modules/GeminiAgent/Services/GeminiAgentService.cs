using System.Text;
using WebApp_API.Repositories;

namespace WebApp_API.Services
{
    public class GeminiAgentService : IGeminiAgentService
    {
        private readonly HttpClient _http;
        private readonly string _apiKey;
        private readonly string _agentModel;
        private readonly IGeminiAgentRepository _geminiAgentRepo;
        private readonly ILogger<GeminiAgentService> _logger;

        private readonly int _botUserId;

        public GeminiAgentService(
            HttpClient http,
            IConfiguration config,
            IGeminiAgentRepository geminiAgentRepo,
            ILogger<GeminiAgentService> logger)
        {
            _http = http;
            _apiKey = config["Gemini:ApiKey"] ?? throw new InvalidOperationException("Gemini:ApiKey is not configured.");
            _agentModel = config["Gemini:Model"] ?? throw new InvalidOperationException("Gemini:Model is not configured.");
            _geminiAgentRepo = geminiAgentRepo;
            _logger = logger;
            _botUserId = config.GetValue("Gemini:BotUserId", 1);
        }

        // ─────────────────────────────────────────────────────────────────────
        public async Task<string> GetChatReplyAsync(string customerMessage, int chatId)
        {
            var systemPrompt = await BuildSystemPromptAsync();

            // Fetch chat history from DB
            var history = await BuildHistoryContentsAsync(chatId, customerMessage);

            var url = $"https://generativelanguage.googleapis.com/v1beta/models/{_agentModel}:generateContent?key={_apiKey}";

            var payload = new
            {
                system_instruction = new
                {
                    parts = new[] { new { text = systemPrompt } }
                },

                contents = history,

                generationConfig = new
                {
                    temperature = 0.7,      // Adjust creativity
                    maxOutputTokens = 2048, // Adjust Request/Response length
                    topP = 0.9              // Nucleus sampling parameter
                },

                safetySettings = new[]
                {
                    new { category = "HARM_CATEGORY_HARASSMENT",        threshold = "BLOCK_MEDIUM_AND_ABOVE" },
                    new { category = "HARM_CATEGORY_HATE_SPEECH",       threshold = "BLOCK_MEDIUM_AND_ABOVE" },
                    new { category = "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold = "BLOCK_MEDIUM_AND_ABOVE" },
                    new { category = "HARM_CATEGORY_DANGEROUS_CONTENT", threshold = "BLOCK_MEDIUM_AND_ABOVE" }
                }
            };

            try
            {
                var response = await _http.PostAsJsonAsync(url, payload);
                response.EnsureSuccessStatusCode();

                var result = await response.Content.ReadFromJsonAsync<GeminiChatResponse>();
                var text = result?.Candidates?.FirstOrDefault()
                                 ?.Content?.Parts?.FirstOrDefault()?.Text;

                return string.IsNullOrWhiteSpace(text)
                    ? "I'm sorry, I couldn't generate a response right now. Please try again or wait for a human agent."
                    : text.Trim();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "[GeminiAgent] Failed to get reply for chatId={ChatId}", chatId);
                return "I'm having trouble connecting right now. A human agent will assist you shortly.";
            }
        }

        // Build Gemini `contents` array from persisted history + latest message.
        // History already contains the stored messages
        private async Task<object[]> BuildHistoryContentsAsync(int chatId, string latestCustomerMessage)
        {
            var history = await _geminiAgentRepo.GetChatHistoryAsync(chatId);

            var contents = history
                .Select(m => (object)new
                {
                    role = m.Role,
                    parts = new[] { new { text = m.Content } }
                })
                .ToList();

            // Ensure the very latest customer message is the last turn.
            // (It will already be there if MessageRepository.CreateAsync ran first.)
            bool alreadyAppended = history.Count > 0
                && history[^1].Role == "user"
                && history[^1].Content == latestCustomerMessage;

            if (!alreadyAppended)
            {
                contents.Add(new
                {
                    role = "user",
                    parts = new[] { new { text = latestCustomerMessage } }
                });
            }

            return contents.ToArray();
        }

        // Build a product-aware system prompt from live DB data
        private async Task<string> BuildSystemPromptAsync()
        {
            var sb = new StringBuilder();

            sb.AppendLine("""
                You are a friendly and knowledgeable shopping assistant for our e-commerce store.

                Your goals:
                    1. Answer customer questions about products, categories, pricing, availability, and orders.
                    2. Suggest relevant products that match the customer's needs or preferences.
                    3. Keep every reply SHORT — 1 to 3 sentences max for general questions.
                    4. When recommending or listing products, show ONLY the product name and price. Format each as: "• {Name} — {Price} VND"
                    5. Be concise, warm, and helpful. Avoid jargon.
                    6. If you cannot answer something (e.g. live order tracking), politely say so and offer to connect the customer with a human agent.
                    7. Never make up product details that are not listed below.
                    8. Format prices in Vietnamese Dong (VND) when known.
                    9. IMPORTANT: Only say a product or category does not exist if it is truly absent from the catalogue below. Search the full list carefully before concluding something is unavailable.
                === STORE CATALOGUE (live snapshot) ===
            """);

            // ── Categories ──────────────────────────────────────────────────
            var categories = await _geminiAgentRepo.GetCategorySnapshotAsync();
            sb.AppendLine($"\nCategories ({categories.Count} total):");
            foreach (var cat in categories)
                sb.AppendLine($"  - [{cat.Id}] {cat.Name} (slug: {cat.Slug})");

            // ── Products ─────────────────────────────────────────────────────
            var products = await _geminiAgentRepo.GetProductSnapshotAsync(200);
            sb.AppendLine($"\nProducts ({products.Count} total):");
            foreach (var p in products)
            {
                sb.AppendLine($"""
                      • [{p.Id}] {p.Name}
                          Category  : {p.CategoryName ?? "N/A"}
                          Base Price: {p.BasePrice:N0} VND
                          Has Variants: {p.HasVariants}
                          Short Desc: {p.ShortDescription ?? "—"}
                          Slug      : {p.Slug}
                    """);
            }

            sb.AppendLine("""
                =========================================
                REMINDER: Recommendations → name + price only, one line each.
                Only add detail if the customer asks for it about a specific product.
                If unsure about stock or shipping, say so in one short sentence.
                """);

            return sb.ToString();
        }
    }

    // ── Gemini response shapes ────────────────────────────────────────────────
    internal class GeminiChatResponse
    {
        public List<GeminiChatCandidate>? Candidates { get; set; }
    }

    internal class GeminiChatCandidate
    {
        public GeminiChatContent? Content { get; set; }
    }

    internal class GeminiChatContent
    {
        public List<GeminiChatPart>? Parts { get; set; }
    }

    internal class GeminiChatPart
    {
        public string? Text { get; set; }
    }
}