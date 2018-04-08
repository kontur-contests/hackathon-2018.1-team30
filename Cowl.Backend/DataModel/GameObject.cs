namespace Cowl.Backend.DataModel.GameObjects
{
    public class GameObject
    {
        public string Id { get; set; }
        public virtual GameObjectType Type { get; set; } = GameObjectType.Wtf;
        public ObjectPosition Position { get; set; }
        public virtual int Cost { get; set; } = 0;

        public override string ToString()
        {
            return $"{nameof(Id)}: {Id}, {nameof(Type)}: {Type}, {nameof(Position)}: {Position}";
        }
    }
}