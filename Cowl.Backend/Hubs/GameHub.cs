using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Cowl.Backend.DataModel;
using Cowl.Backend.Service;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;

namespace Cowl.Backend.Hubs
{
    public class GameHub : Hub
    {
        private readonly GameService _gameService;

        public GameHub(GameService gameService)
        {
            _gameService = gameService;
        }


        public async Task Join()
        {
        }

        public override async Task OnConnectedAsync()
        {
            var id = Guid.NewGuid().ToString();
            var name = Guid.NewGuid().ToString();

            var player = new Player {Id = id, Name = name,};

            await _gameService.Join(Clients.Caller, player);
            await Clients.All.SendAsync("join", player);
        }

        public override async Task OnDisconnectedAsync(Exception ex)
        {
            var player = await _gameService.GetPlayer(Clients.Caller);

            await _gameService.Leave(Clients.Caller);
            await Clients.All.SendAsync("leave", player);
        }
    }
}