using System.Collections.Generic;
using Cowl.Backend.DataModel.Tiles;
using Newtonsoft.Json;

namespace Cowl.Backend.DataModel
{
    [JsonObject]
    public class Map
    {
        public List<GameObject> GameObjects { get; set; }
    }
}
