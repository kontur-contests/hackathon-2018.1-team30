using System;
using System.Drawing;

namespace Cowl.Backend.DataModel.GameObjects
{
    public abstract class GameObject
    {
        public string Id { get; set; }
        public abstract GameObjectType Type { get; }
        public ObjectPosition Position { get; set; }
        public Size Size { get; set; }
    }
}