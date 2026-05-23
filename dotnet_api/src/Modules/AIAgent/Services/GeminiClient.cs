// using System.Net.Http.Json;

// namespace WebApp_API.Services
// {
//     public class GeminiClient
//     {
//         private readonly HttpClient _http;
//         private readonly string _apiKey;

//         public GeminiClient(HttpClient http, IConfiguration config)
//         {
//             _http = http;
//             _apiKey = config["Gemini:ApiKey"]!;  // API key stored in appsettings.json under "Gemini:ApiKey"
//         }

//         public async Task<string> GenerateAsync(string prompt)
//         {
//             var url = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={_apiKey}";

//             var payload = new
//             {
//                 contents = new[]
//                 {
//                 new {
//                     parts = new[]{ new { text = prompt } }
//                 }
//             }
//             };

//             var res = await _http.PostAsJsonAsync(url, payload);

//             var result = await res.Content.ReadFromJsonAsync<GeminiResponse>();
//             return result?.Candidates?.FirstOrDefault()
//                          ?.Content?.Parts?.FirstOrDefault()?.Text ?? "";
//         }
//     }

//     public class GeminiResponse
//     {
//         public List<Candidate> Candidates { get; set; }
//     }

//     public class Candidate
//     {
//         public Content Content { get; set; }
//     }

//     public class Content
//     {
//         public List<Part> Parts { get; set; }
//     }

//     public class Part
//     {
//         public string Text { get; set; }
//     }
// }