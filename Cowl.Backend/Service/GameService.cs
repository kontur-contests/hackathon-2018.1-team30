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
        private readonly Map _map;

        public GameService()
        {
            _map = new Map {GameObjects = new List<GameObject>(), Players = new List<Player>()};
        }


        public async Task Join(Player player)
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