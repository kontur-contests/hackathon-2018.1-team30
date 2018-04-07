using System;
using System.Linq;
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
            var id = Context.ConnectionId;
            var name = Guid.NewGuid().ToString();

            var player = new Player {Id = id, Name = name, Position = GetRandomPosition()};

            await Clients.Caller.SendAsync("me", player);
            await Clients.Caller.SendAsync("players", _gameService.GetMap().Players);
            await Clients.Caller.SendAsync("fowls", _gameService.GetMap().Fowls);
            await Clients.Others.SendAsync("playerJoin", player);

            _gameService.Join(player);
        }

        public override async Task OnDisconnectedAsync(Exception ex)
        {
            var player = _gameService.GetPlayer(Context.ConnectionId);
            _gameService.GetMap().Players.Remove(player);
            await Clients.All.SendAsync("playerLeave", player);
        }

        public async Task MovePlayer(int number, ObjectPosition objectPosition)
        {
            var player = _gameService.GetPlayer(Context.ConnectionId);
            player.Position = objectPosition;

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

            _gameService.GetMap().Fowls.Add(fowl.Id, fowl);
            await Clients.All.SendAsync("fowlJoin", fowl).ConfigureAwait(false);
        }

        public async Task KillFowl(string fowlId)
        {
            await Clients.All.SendAsync("fowlKill", fowlId).ConfigureAwait(false);
            _gameService.GetMap().Fowls.Remove(fowlId);

            var player = _gameService.GetPlayer(Context.ConnectionId);
            player.Points++;

            await Clients.Others.SendAsync("playerState", player);
        }
    }
}