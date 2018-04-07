using Cowl.Backend.DataModel;

namespace Cowl.Backend.Core
{
    public class ActionApplicator
    {
        public void Apply(Map map, IGameAction action)
        {
            switch (action)
            {
                case PlayerMove playerMove:
                {
                    new PlayerMoveApplicator().Apply(map, playerMove);
                    return;
                }
            }
        }
    }
}