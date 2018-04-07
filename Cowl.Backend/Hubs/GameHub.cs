using System;
using System.Drawing;
using System.Threading.Tasks;
using Cowl.Backend.DataModel;
using Cowl.Backend.DataModel.GameObjects;
using Cowl.Backend.Service;
using Microsoft.AspNetCore.SignalR;

namespace Cowl.Backend.Hubs
{
    public class GameHub : Hub
    {
        private readonly GameService _gameService;

        public GameHub(GameService gameService)
        {
            _gameService = gameService;
        }

        public override async Task OnConnectedAsync()
        {
            var id = Guid.NewGuid();
            var name = Guid.NewGuid().ToString();

            var random = new Random();
            var x = random.Next(0, 1200);
            var y = random.Next(0, 800);


            var player = new Player { Id = id, Name = name, Position = new Point(x, y) };

            await _gameService.Join(player);
            await Clients.All.SendAsync("join", player);
        }

        public async Task MovePlayer(Guid playerId, int flags)
        {
            var direction = (MoveDirection)flags;

            var player = await _gameService.GetPlayer(playerId);
            player.Move(direction);

            await Clients.All.SendAsync("state", player);
        }
    }
}