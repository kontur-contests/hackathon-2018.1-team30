using System.Drawing;

namespace Cowl.Backend.DataModel.Tiles
{
    public abstract class GameObject
    {
        public Point Position { get; set; }
        public Size Size { get; set; }
    }
}