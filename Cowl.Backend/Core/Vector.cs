using System.Drawing;

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

        public static Point operator +(Point point, Vector vector)
        {
            return new Point(point.X + vector.X, point.Y + vector.Y);
        }
    }
}