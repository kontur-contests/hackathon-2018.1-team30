using System;
using Newtonsoft.Json;

namespace Cowl.Backend.DataModel
{
    [JsonObject]
    public class ObjectPosition
    {
        public int X { get; set; }
        public int Y { get; set; }


        public override string ToString()
        {
            return $"{nameof(X)}: {X}, {nameof(Y)}: {Y}";
        }

        public static ObjectPosition GetRandom()
        {
            var random = new Random();
            var x = random.Next(100, 3100);
            var y = random.Next(100, 1500);

            return new ObjectPosition {X = x, Y = y};
        }
    }
}