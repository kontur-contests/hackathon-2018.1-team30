using Newtonsoft.Json;

namespace Cowl.Backend.DataModel.GameObjects
{
    [JsonObject]
    public class Player : GameObject
    {
        public int Scores { get; set; }

        public override GameObjectType Type => GameObjectType.Player;
        public override int Cost => 0;

        public override string ToString()
        {
            return $"{base.ToString()}, {nameof(Scores)}: {Scores}, {nameof(Type)}: {Type}, {nameof(Cost)}: {Cost}";
        }
    }
}