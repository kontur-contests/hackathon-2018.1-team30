using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Cowl.Backend.DataModel;
using Microsoft.AspNetCore.SignalR;

namespace Cowl.Backend.Service
{
    public class GameService
    {
        private readonly Dictionary<IClientProxy, Player> _players;

        public GameService()
        {
            _players = new Dictionary<IClientProxy, Player>();
        }


        public async Task Join(IClientProxy clientProxy, Player player)
        {
            if (_players.Count >= 4)
                throw new Exception("too many players");

            _players.Add(clientProxy, player);
        }

        public async Task<Player> GetPlayer(IClientProxy clientProxy)
        {
            if (_players.ContainsKey(clientProxy))
                return _players[clientProxy];

            throw new Exception("");
        }

        public async Task Leave(IClientProxy clientProxy)
        {
            _players.Remove(clientProxy);
        }
    }
}