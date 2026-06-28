using MediatR;

namespace WebApp_API.Modules.Products.Queries.GetProductSuggestions
{
    public class GetProductSuggestionsQuery : IRequest<List<string>>
    {
        public string QueryPhrase { get; set; }
        public int Limit { get; set; } = 10;

        public GetProductSuggestionsQuery(string queryPhrase, int limit = 10)
        {
            QueryPhrase = queryPhrase;
            Limit = limit;
        }
    }
}
