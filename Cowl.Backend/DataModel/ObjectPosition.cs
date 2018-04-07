namespace Cowl.Backend.DataModel
{
    public class ObjectPosition
    {
        public ObjectPosition()
        {
        }

        public ObjectPosition(int x, int y)
        {
            X = x;
            Y = y;
        }

        public int X { get; set; }
        public int Y { get; set; }


        public override string ToString()
        {
            return $"{nameof(X)}: {X}, {nameof(Y)}: {Y}";
        }
    }
}