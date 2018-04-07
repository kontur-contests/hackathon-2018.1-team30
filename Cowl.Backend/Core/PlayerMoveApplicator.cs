using System.Linq;
using Cowl.Backend.DataModel;

namespace Cowl.Backend.Core
{
    public class PlayerMoveApplicator : IActionApplicator<PlayerMove>
    {
        private const int Step = 5;

        public void Apply(Map map, PlayerMove action)
        {
            var player = map.Players.SingleOrDefault(x => x.Id == action.PlayerId);

            if (player == null)
            {
                return;
            }

            var direction = GetVector(action.Direction);
            player.Position += direction * Step;
        }

        private static Vector GetVector(MoveDirection direction)
        {
            var x = 0;
            var y = 0;

            if (direction.HasFlag(MoveDirection.Down))
                y++;

            if (direction.HasFlag(MoveDirection.Up))
                y--;

            if (direction.HasFlag(MoveDirection.Right))
                x++;

            if (direction.HasFlag(MoveDirection.Left))
                x--;

            return new Vector(x, y);
        }
    }
}