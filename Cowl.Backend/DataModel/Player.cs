using Newtonsoft.Json;

namespace Cowl.Backend.DataModel
{
    [JsonObject]
    public class Player
    {
        public string Id { get; set; }

        public string Name { get; set; }
    }
}
