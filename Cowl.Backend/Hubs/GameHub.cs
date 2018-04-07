using System;
using System.Drawing;
using System.Threading.Tasks;
using Cowl.Backend.Core;
using Cowl.Backend.DataModel;
using Cowl.Backend.DataModel.GameObjects;
using Cowl.Backend.Service;
using Microsoft.AspNetCore.SignalR;

namespace Cowl.Backend.Hubs
{
    public class GameHub : Hub
    {
        private readonly GameService _gameService;
        private readonly ActionApplicator _actionApplicator;

        public GameHub(GameService gameService, ActionApplicator actionApplicator)
        {
            _gameService = gameService;
            _actionApplicator = actionApplicator;
        }

        public override async Task OnConnectedAsync()
        {
            var id = Guid.NewGuid();
            var name = Guid.NewGuid().ToString();

            var random = new Random();
            var x = random.Next(0, 1200);
            var y = random.Next(0, 800);


            var player = new Player {Id = id, Name = name, Position = new ObjectPosition{X = x, Y = y}};

            await _gameService.Join(player);
            await Clients.All.SendAsync("playerJoin", player);
        }


        public async Task MovePlayer(PlayerMove playerMove)
        {
            _actionApplicator.Apply(_gameService.GetMap(), playerMove);

            var player = _gameService.GetPlayer(playerMove.PlayerId);

            await Clients.All.SendAsync("playerState", player);
        }
    }
}