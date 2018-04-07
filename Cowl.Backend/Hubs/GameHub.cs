using System;
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
            var player = new Player {Id = Context.ConnectionId, Position = ObjectPosition.GetRandom()};

            await Clients.Caller.SendAsync("me", player);
            await Clients.Caller.SendAsync("gameObjects", _gameService.AllGameObjects);

            await SpawnGameObject(player);
            Console.WriteLine("OnConnect:    " + player);
        }

        public async Task SpawnGameObject(GameObject gameObject)
        {
            _gameService.AddGameObject(gameObject);
            await Clients.All.SendAsync("gameObjectJoin", gameObject);
            Console.WriteLine("SpawnGameObject:    " + gameObject);
        }

        public override async Task OnDisconnectedAsync(Exception ex)
        {
            await KillGameObject(Context.ConnectionId);
        }

        public async Task MoveGameObject(string gameObjectId, ObjectPosition objectPosition)
        {
            var gameObject = _gameService.GetGameObject(gameObjectId);

            if (gameObject is null)
                return;

            gameObject.Position = objectPosition;
            await Clients.Others.SendAsync("gameObjectMove", gameObjectId, objectPosition);
        }

        public async Task AttackGameObject(string gameObjectId, ObjectPosition objectPosition)
        {
            await Clients.Others.SendAsync("gameObjectAttack", gameObjectId, objectPosition);
        }

        public async Task LeaveGameObject(string gameObjectId)
        {
            var gameObject = _gameService.RemoveGameObject(gameObjectId);
            if (gameObject is null)
                return;

            await Clients.All.SendAsync("gameObjectLeave", gameObject);
        }

        public async Task KillGameObject(string gameObjectId)
        {
            var gameObject = _gameService.RemoveGameObject(gameObjectId);

            if (gameObject is null)
                return;

            if (!(_gameService.GetGameObject(Context.ConnectionId) is Player player))
                return;

            player.Scores += gameObject.Cost;

            await LeaveGameObject(gameObjectId);
        }
    }
}