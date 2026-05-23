using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using WebApp_API.Repositories;

namespace WebApp_API.Services
{
    public class GeminiAgentService : IGeminiAgentService
    {
        private readonly HttpClient _http;
        private readonly string _apiKey;
        private readonly IProductRepository _productRepo;
        private readonly ICategoryRepository _categoryRepo;
        private readonly ILogger<GeminiAgentService> _logger;

        // Bot user ID – reserve a fixed ID in your DB for the AI assistant account.
        // If you prefer a config value, inject IConfiguration and read "GeminiBot:UserId".
        public const int BotUserId = 0; // 0 = synthetic / never a real FK in Users

        public GeminiAgentService(
            HttpClient http,
            IConfiguration config,
            IProductRepository productRepo,
            ICategoryRepository categoryRepo,
            ILogger<GeminiAgentService> logger)
        {
            _http = http;
            _apiKey = config["Gemini:ApiKey"]
                      ?? throw new InvalidOperationException("Gemini:ApiKey is not configured.");
            _productRepo = productRepo;
            _categoryRepo = categoryRepo;
            _logger = logger;
        }

        // ─────────────────────────────────────────────────────────────────────
        public async Task<string> GetChatReplyAsync(string customerMessage, int chatId)
        {
            var systemPrompt = await BuildSystemPromptAsync();
            var url = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={_apiKey}";

            var payload = new
            {
                system_instruction = new
                {
                    parts = new[] { new { text = systemPrompt } }
                },
                contents = new[]
                {
                    new
                    {
                        role = "user",
                        parts = new[] { new { text = customerMessage } }
                    }
                },
                generationConfig = new
                {
                    temperature = 0.7,
                    maxOutputTokens = 800,
                    topP = 0.9
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

        // ─────────────────────────────────────────────────────────────────────
        // Build a product-aware system prompt from live DB data
        // ─────────────────────────────────────────────────────────────────────
        private async Task<string> BuildSystemPromptAsync()
        {
            var sb = new StringBuilder();

            sb.AppendLine("""
                You are a friendly and knowledgeable shopping assistant for our e-commerce store.
                Your goals:
                  1. Answer customer questions about products, categories, pricing, availability, and orders.
                  2. Suggest relevant products that match the customer's needs or preferences.
                  3. Be concise, warm, and helpful. Avoid jargon.
                  4. If you cannot answer something (e.g. live order tracking), politely say so and offer to connect the customer with a human agent.
                  5. Never make up product details that are not listed below.
                  6. Format prices in Vietnamese Dong (VND) when known.

                === STORE CATALOGUE (live snapshot) ===
                """);

            // ── Categories ──────────────────────────────────────────────────
            var categories = await _categoryRepo.GetAllCategoriesAsync();
            sb.AppendLine($"\nCategories ({categories.Count} total):");
            foreach (var cat in categories)
                sb.AppendLine($"  - [{cat.Id}] {cat.Name} (slug: {cat.Slug})");

            // ── Products (top 80 to stay within token budget) ────────────────
            var spec = new WebApp_API.Specifications.ProductFilterSpec();   // default: newest, no filter
            var (products, total) = await _productRepo.GetPaginatedAsync(
                new WebApp_API.Specifications.ProductFilterSpec
                {
                    Page     = 1,
                    PageSize = 80,
                    SortOrder = "newest"
                });

            sb.AppendLine($"\nProducts ({total} total; showing up to 80 most recent):");
            foreach (var p in products)
            {
                sb.AppendLine($"""
                      • [{p.Id}] {p.Name}
                          Category : {p.Category?.Name ?? "N/A"}
                          Base Price: {p.BasePrice:N0} VND
                          Has Variants: {p.HasVariants}
                          Short Desc: {p.ShortDescription ?? "—"}
                          Slug: {p.Slug}
                    """);
            }

            sb.AppendLine("""
                =========================================
                When recommending products, always mention the product name and price.
                If the customer asks for a comparison, list pros/cons based on the description.
                If you are unsure about stock or shipping times, say you don't have real-time data.
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