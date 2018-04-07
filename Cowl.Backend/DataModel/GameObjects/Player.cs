using System.Drawing;
using Cowl.Backend.DataModel.Tiles;
using Newtonsoft.Json;

namespace Cowl.Backend.DataModel
{
    [JsonObject]
    public class Player : GameObject
    {
        public string Id { get; set; }

        public string Name { get; set; }

        public void Move(MoveDirection direction)
        {
            var deltaX = 0;
            var deltaY = 0;

            if (direction.HasFlag(MoveDirection.Down))
                deltaY++;

            if (direction.HasFlag(MoveDirection.Up))
                deltaY--;

            if (direction.HasFlag(MoveDirection.Right))
                deltaX++;

            if (direction.HasFlag(MoveDirection.Left))
                deltaX--;

            Position = new Point(Position.X + deltaX, Position.Y + deltaY);
        }

        public override string ToString()
        {
            return $"{nameof(Id)}: {Id}, {nameof(Name)}: {Name}, {nameof(Position)}: {Position}";
        }
    }
}