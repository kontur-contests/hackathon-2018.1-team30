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
            //Console.WriteLine("OnConnect:" + Context.ConnectionId);
        }

        public static readonly string[] Names = {"ОлолОш", "СшвАбр", "АлЁн", "Питьр", "СлаавЯн", "КотАн", "Индуз" };

        public async Task JoinGame()
        {
            var name = Names[DateTime.Now.Ticks % Names.Length] + DateTime.Now.Ticks % 17;

            var player = new Player {Id = Context.ConnectionId, Position = ObjectPosition.GetRandom(), Name = name};

            await Clients.Caller.SendAsync("me", player);
            await Clients.Caller.SendAsync("gameObjects", _gameService.AllGameObjects);
            await Clients.Caller.SendAsync("gameStart");

            await SpawnGameObjects(new List<GameObject> {player});
            //Console.WriteLine("JoinGame:" + player);
        }


        public async Task SpawnGameObjects(ICollection<GameObject> gameObjects)
        {
            _gameService.AddRangeGameObject(gameObjects);
            await Clients.All.SendAsync("gameObjectsJoin", gameObjects);
            //Console.WriteLine("SpawnGameObjects:" + gameObjects.Count);
        }

        public override async Task OnDisconnectedAsync(Exception ex)
        {
            await LeaveGameObject(Context.ConnectionId);
            //Console.WriteLine("Leave:" + _gameService.GetGameObject(Context.ConnectionId));
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

        public async Task PunishGameObject(string punisherGameObjectId, string gameObjectId)
        {
            if (!(_gameService.GetGameObject(punisherGameObjectId) is Player punisher))
                return;

            if (!(_gameService.GetGameObject(gameObjectId) is Player gameObject))
                return;

            punisher.Scores += 100;
            gameObject.Scores -= 100;
        }

        public async Task KillGameObject(string killerGameObjectId, string gameObjectId)
        {
            var gameObject = _gameService.RemoveGameObject(gameObjectId);

            if (gameObject is null)
                return;

            if (!(_gameService.GetGameObject(killerGameObjectId) is Player player))
                return;

            player.Scores += gameObject.Cost;
            await LeaveGameObject(gameObjectId);
        }

        public Task GameStart()
        {
            return Clients.All.SendAsync("gameStart");
        }

        public Task GameEnd()
        {
            return Clients.All.SendAsync("gameEnd");
        }
        public Task Scores(List<ScoresItem> items)
        {
            return Clients.All.SendAsync("scores", items);
        }
    }
}