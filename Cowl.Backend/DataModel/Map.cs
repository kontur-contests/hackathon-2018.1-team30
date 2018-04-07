using System.Collections.Generic;
using System.Drawing;
using Cowl.Backend.DataModel.GameObjects;
using Newtonsoft.Json;

namespace Cowl.Backend.DataModel
{
    [JsonObject]
    public class Map
    {
        public List<GameObject> GameObjects { get; set; }
        
        public Size Size { get; set; }
        
    }
}
