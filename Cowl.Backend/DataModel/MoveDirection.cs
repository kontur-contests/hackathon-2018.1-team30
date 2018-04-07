using System;

namespace Cowl.Backend.DataModel
{
    [Flags]
    public enum MoveDirection
    {
        Up = 1 << 0,
        Right = 1 << 1,
        Down = 1 << 2,
        Left = 1 << 3
    }
}