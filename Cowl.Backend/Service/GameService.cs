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

        public GameService()
        {
            _players = new Dictionary<Guid, Player>();
        }


        public async Task Join(Player player)
        {
            if (_players.Count >= 4)
                throw new Exception("too many players");

            _players.Add(player.Id, player);
        }

        public async Task<Player> GetPlayer(Guid id)
        {
            if (_players.ContainsKey(id))
                return _players[id];

            throw new Exception("");
        }
    }
}