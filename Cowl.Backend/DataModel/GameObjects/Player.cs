using Newtonsoft.Json;

namespace Cowl.Backend.DataModel.GameObjects
{
    [JsonObject]
    public class Player : GameObject
    {
        public override GameObjectType Type => GameObjectType.Player;
        public string Name { get; set; }

        public override string ToString()
        {
            return $"{nameof(Id)}: {Id}, {nameof(Name)}: {Name}, {nameof(Position)}: {Position}";
        }
    }
}