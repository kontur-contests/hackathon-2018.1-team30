using System.Drawing;
using Cowl.Backend.DataModel;

namespace Cowl.Backend.Core
{
    public class Vector
    {
        public Vector(int x, int y)
        {
            X = x;
            Y = y;
        }

        public int X { get; }
        public int Y { get; }

        public static Vector operator *(Vector vector, int multiplyer)
        {
            return new Vector(vector.X * multiplyer, vector.Y * multiplyer);
        }

        public static ObjectPosition operator +(ObjectPosition position, Vector vector)
        {
            return new ObjectPosition(position.X + vector.X, position.Y + vector.Y);
        }
    }
}