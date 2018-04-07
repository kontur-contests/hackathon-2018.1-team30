using System;
using System.Drawing;

namespace Cowl.Backend.DataModel.GameObjects
{
    public abstract class GameObject
    {
        public Guid Id { get; set; }
        public GameObjectType Type { get; set; }
        public Point Position { get; set; }
        public Size Size { get; set; }
    }
}