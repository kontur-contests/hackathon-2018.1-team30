using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Cowl.Backend.DataModel;
using Cowl.Backend.DataModel.GameObjects;
using Microsoft.AspNetCore.SignalR;

namespace Cowl.Backend.Service
{
    public class GameService
    {
        private readonly Dictionary<Guid, Player> _players;

        private readonly Map _map;

        public GameService()
        {
            _map = new Map();

            _players = new Dictionary<Guid, Player>();
        }


        public async Task Join(Player player)
        {
            if (_players.Count >= 4)
                throw new Exception("too many players");

            _map.Players.Add(player);
        }

        public Map GetMap()
        {
            return _map;
        }

        public Player GetPlayer(Guid playerId)
        {
            return _map.Players.First(p => p.Id == playerId);
        }
    }
}