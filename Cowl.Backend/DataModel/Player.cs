using System.Drawing;
using Newtonsoft.Json;

namespace Cowl.Backend.DataModel
{
    [JsonObject]
    public class Player
    {
        public string Id { get; set; }

        public string Name { get; set; }

        public Point Position { get; set; }

        public override string ToString()
        {
            return $"{nameof(Id)}: {Id}, {nameof(Name)}: {Name}, {nameof(Position)}: {Position}";
        }
    }
}
