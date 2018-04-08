using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Cowl.Backend.DataModel;
using Cowl.Backend.DataModel.GameObjects;
using Cowl.Backend.Service;
using Microsoft.AspNetCore.SignalR;

namespace Cowl.Backend.Hubs
{
    public class GameHub : Hub
    {
        private readonly GameStorageService _gameService;

        public GameHub(GameStorageService gameService)
        {
            _gameService = gameService;
        }

        public override async Task OnConnectedAsync()
        {
            Console.WriteLine("OnConnect:" + Context.ConnectionId);
        }

        public async Task JoinGame()
        {
            var player = new Player {Id = Context.ConnectionId, Position = ObjectPosition.GetRandom()};

            await Clients.Caller.SendAsync("me", player);
            await Clients.Caller.SendAsync("gameObjects", _gameService.AllGameObjects);

            await SpawnGameObjects(new List<GameObject> {player});
            Console.WriteLine("JoinGame:" + player);
        }


        public async Task SpawnGameObjects(ICollection<GameObject> gameObjects)
        {
            _gameService.AddRangeGameObject(gameObjects);
            await Clients.All.SendAsync("gameObjectsJoin", gameObjects);
            Console.WriteLine("SpawnGameObjects:" + gameObjects.Count);
        }

        public override async Task OnDisconnectedAsync(Exception ex)
        {
            await LeaveGameObject(Context.ConnectionId);
            Console.WriteLine("Leave:" + _gameService.GetGameObject(Context.ConnectionId));
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

            await Clients.All.SendAsync("gameObjectLeave", gameObject.Id);
        }

        public async Task KillGameObject(string gameObjectId)
        {
            var gameObject = _gameService.RemoveGameObject(gameObjectId);

            if (gameObject is null)
                return;

            if (!(_gameService.GetGameObject(Context.ConnectionId) is Player player))
                return;

            player.Scores += gameObject.Cost;

            Console.WriteLine("KillObject: " + gameObject + " : " + player);

            await LeaveGameObject(gameObjectId);
        }
    }
}