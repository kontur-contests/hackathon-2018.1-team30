using System.Collections.Generic;
using System.Linq;
using Cowl.Backend.DataModel;
using Cowl.Backend.DataModel.GameObjects;

namespace Cowl.Backend.Service
{
    public class GameService
    {
        private readonly Map _map;

        public GameService()
        {
            _map = new Map
            {
                GameObjects = new List<GameObject>(),
                Players = new List<Player>(),
                Fowls = new List<Fowl>()
            };
        }

        public void Join(Player player)
        {
            _map.Players.Add(player);
        }

        public Map GetMap()
        {
            return _map;
        }

        public Player GetPlayer(string playerId)
        {
            return _map.Players.First(p => p.Id == playerId);
        }
    }
}