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
                if (_gameService.AllFowls.ToArray().Length < 300)
                {
                    var fowl = new Fowl
                    {
                        Id = Guid.NewGuid().ToString(),
                        Position = ObjectPosition.GetRandom()
                    };

                    await connection.InvokeAsync("spawnGameObject", fowl, cancellationToken: cancellationToken);
                }
                else if (_gameService.AllShits.ToArray().Length < 300)
                {
                    var shit = new Shit
                    {
                        Id = Guid.NewGuid().ToString(),
                        Position = ObjectPosition.GetRandom()
                    };

                    await connection.InvokeAsync("spawnGameObject", shit, cancellationToken: cancellationToken);
                }

                await Task.Delay(25, cancellationToken);
            }
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            return Task.Delay(1, cancellationToken);
        }
    }
}