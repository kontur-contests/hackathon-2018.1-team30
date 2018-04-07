using System;
using System.Drawing;
using Cowl.Backend.DataModel;
using Cowl.Backend.DataModel.GameObjects;

namespace Cowl.Backend.Core
{
    public class PlayerMoveApplicator
    {
        private const int Step = 5;

        public static void Apply(Map map, Player player, MoveDirection moveDirection)
        {
            var direction = GetVector(moveDirection);
            var target = player.Position + direction * Step;
            player.Position = Normalize(map.Size, target, player.Size);
        }

        private static ObjectPosition Normalize(Size mapSize, ObjectPosition point, Size size)
        {
            var x = Math.Min(Math.Max(0, point.X), mapSize.Width - size.Width);
            var y = Math.Min(Math.Max(0, point.Y), mapSize.Height - size.Height);
            return new ObjectPosition(x, y);
        }

        private static Vector GetVector(MoveDirection direction)
        {
            var x = 0;
            var y = 0;

            switch (direction)
            {
                case MoveDirection.Up:
                    y--;
                    break;
                case MoveDirection.Down:
                    y++;
                    break;
                case MoveDirection.Left:
                    x--;
                    break;
                case MoveDirection.Right:
                    x++;
                    break;
                case MoveDirection.DownLeft:
                    y++;
                    x--;
                    break;
                case MoveDirection.DownRigth:
                    y++;
                    x++;
                    break;
                case MoveDirection.UpLeft:
                    y--;
                    x--;
                    break;
                case MoveDirection.UpRight:
                    y--;
                    x++;
                    break;
            }


            return new Vector(x, y);
        }
    }
}