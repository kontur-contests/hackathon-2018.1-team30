using System;
using System.ComponentModel;
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
        private readonly ILogger _logger;

        public GameHub(GameService gameService, ILoggerFactory loggerFactory)
        {
            _gameService = gameService;
            _logger = loggerFactory.CreateLogger(nameof(GameService));
        }

        public override async Task OnConnectedAsync()
        {
            var id = Context.ConnectionId;
            var name = Guid.NewGuid().ToString();

            var player = new Player {Id = id, Name = name, Position = GetRandomPosition()};

            _logger.LogDebug("playerJoin" + player);

            await _gameService.Join(player);
            await Clients.Caller.SendAsync("playerJoin", player);
            await Clients.All.SendAsync("players", _gameService.GetMap().Players);
        }

        public override async Task OnDisconnectedAsync(Exception ex)
        {
            var player = _gameService.GetPlayer(Context.ConnectionId);
            _gameService.GetMap().Players.Remove(player);

            _logger.LogDebug("Disconnect:" + player);
            await Clients.All.SendAsync("playerLeave", player);
        }

        public async Task MovePlayer(int number, ObjectPosition objectPosition)
        {
            var player = _gameService.GetPlayer(Context.ConnectionId);
            player.Position = objectPosition;

            _logger.LogDebug("MovePlayer" + player);

            await Clients.Others.SendAsync("playerState", player);
            await Clients.Caller.SendAsync("playerStateNumber", number);
        }

        public async Task AttackPlayer(ObjectPosition objectPosition)
        {
            var player = _gameService.GetPlayer(Context.ConnectionId);

            await Clients.All.SendAsync("playerAttack", player, objectPosition);
        }


        private static ObjectPosition GetRandomPosition()
        {
            var random = new Random();
            var x = random.Next(100, 3100);
            var y = random.Next(100, 1500);

            return new ObjectPosition(x, y);
        }

        public async Task SpawnFowl()
        {
            var fowl = new Fowl();
            fowl.Position = GetRandomPosition();
            fowl.Id = Guid.NewGuid().ToString();

            await Clients.All.SendAsync("fowlJoin", fowl).ConfigureAwait(false);
            Console.WriteLine("SpawnFowl: " + fowl);
        }

        public async Task KillFowl(string number)
        {
            await Clients.All.SendAsync("fowlKill", number).ConfigureAwait(false);
        }
    }
}