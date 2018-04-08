using Newtonsoft.Json;

namespace Cowl.Backend.DataModel.GameObjects
{
    [JsonObject]
    public class Player : GameObject
    {
        public int Scores { get; set; }

        public string Name { get; set; }

        public override GameObjectType Type => GameObjectType.Player;
        public override int Cost => 100;

        public override string ToString()
        {
            return $"{base.ToString()}, {nameof(Scores)}: {Scores}, {nameof(Type)}: {Type}, {nameof(Cost)}: {Cost}";
        }
    }
}