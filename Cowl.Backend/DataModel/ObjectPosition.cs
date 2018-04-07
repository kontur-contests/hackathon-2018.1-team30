using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Cowl.Backend.DataModel
{
    public class ObjectPosition
    {
        public int X { get; set; }
        public int Y { get; set; }

        public ObjectPosition()
        {
        }

        public ObjectPosition(int x, int y)
        {
            X = x;
            Y = y;
        }
    }
}