using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Cowl.Backend.DataModel;
using Cowl.Backend.DataModel.GameObjects;
using Microsoft.AspNetCore.SignalR.Client;
using Microsoft.Extensions.Hosting;

namespace Cowl.Backend.Service
{
    public class GameObjectService : IHostedService
    {
        private readonly GameService _gameService;

        public GameObjectService(GameService gameService)
        {
            _gameService = gameService;
        }

        public async Task StartAsync(CancellationToken cancellationToken)
        {
            // Для корректной инициализации бэкенда
            await Task.Delay(10000);

            var connection = new HubConnectionBuilder()
                .WithUrl("http://10.33.94.6:4844/game")
                .Build();

            await connection.StartAsync().ConfigureAwait(false);

            while (!cancellationToken.IsCancellationRequested)
            {
                var fowlsCount = _gameService.AllFowls.ToArray().Length;
                var shitCount = _gameService.AllShits.ToArray().Length;

                var gameObjects = new List<GameObject>();

                for (var i = 300 - fowlsCount; i >= 0; i--)
                {
                    var fowl = new Fowl
                    {
                        Id = Guid.NewGuid().ToString(),
                        Position = ObjectPosition.GetRandom()
                    };
                    gameObjects.Add(fowl);
                }

                for (var i = 300 - shitCount; i >= 0; i--)
                {
                    var shit = new Shit
                    {
                        Id = Guid.NewGuid().ToString(),
                        Position = ObjectPosition.GetRandom()
                    };
                    gameObjects.Add(shit);
                }

                if (gameObjects.Count > 0)
                    await connection.InvokeAsync("spawnGameObjects", gameObjects, cancellationToken: cancellationToken);
                await Task.Delay(25, cancellationToken);
            }
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            return Task.Delay(1, cancellationToken);
        }
    }
}