using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Cowl.Backend.DataModel.Tiles;
using Newtonsoft.Json;

namespace Cowl.Backend.DataModel
{
    [JsonObject]
    public class Map
    {
        public List<Tile> Tiles { get; set; }
    }
}
