using System;
using System.Linq;
using System.Threading.Tasks;
using Cowl.Backend.Core;
using Cowl.Backend.DataModel;
using Cowl.Backend.DataModel.GameObjects;
using Cowl.Backend.Service;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;

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
            var id = Context.ConnectionId;
            var name = Guid.NewGuid().ToString();

            var random = new Random();
            var x = random.Next(100, 1200);
            var y = random.Next(100, 800);


            var player = new Player {Id = id, Name = name, Position = new ObjectPosition {X = x, Y = y}};

            Console.WriteLine(player);

            await _gameService.Join(player);
            await Clients.Caller.SendAsync("playerJoin", player);
            await Clients.All.SendAsync("players", _gameService.GetMap().Players);
        }

        public override async Task OnDisconnectedAsync(Exception ex)
        {
            var player = _gameService.GetMap().Players.First(p => p.Id == Context.ConnectionId);
            _gameService.GetMap().Players.Remove(player);
        }

        public async Task MovePlayer(MoveDirection moveDirection)
        {
            var player = _gameService.GetPlayer(Context.ConnectionId);
            PlayerMoveApplicator.Apply(_gameService.GetMap(), player, moveDirection);

            Console.WriteLine(player + " " + moveDirection);

            await Clients.All.SendAsync("playerState", player);
        }
    }
}