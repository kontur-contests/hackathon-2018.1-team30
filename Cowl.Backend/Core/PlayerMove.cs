using System;
using Cowl.Backend.DataModel;

namespace Cowl.Backend.Core
{
    public class PlayerMove : IGameAction
    {
        public Guid PlayerId { get; set; }
        public MoveDirection Direction { get; set; }
    }
}