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
    public class FowlService : IHostedService
    {
        private readonly GameService _gameService;

        public FowlService(GameService gameService)
        {
            _gameService = gameService;
        }

        public FowlService()
        {
            Console.WriteLine();
        }

        public async Task StartAsync(CancellationToken cancellationToken)
        {
            await Task.Delay(10000);
            var connection = new HubConnectionBuilder()
                .WithUrl("http://10.33.94.6:4844/game")
                .WithConsoleLogger()
                .Build();
            await connection.StartAsync();

            connection.On("playerJoin", () => { });
            connection.On<Player, ObjectPosition>("playerAttack", (player, position) => { });
            connection.On<Fowl>("fowlJoin", fowl => { });
            connection.On<int>("fowlKill", (number) => { });
            connection.On<Player>("playerState", (player) => { });
            connection.On<List<Fowl>>("fowls", (fowls) => { });
            connection.On<List<Player>>("players", (players) => { });
            connection.On<Player>("me", (player) => { });

            while (!cancellationToken.IsCancellationRequested)
            {
                if (_gameService.GetMap().Fowls.Count < 300)
                {
                    await connection.InvokeAsync("spawnFowl", cancellationToken);
                }

                await Task.Delay(25, cancellationToken);
            }
        }

        public async Task StopAsync(CancellationToken cancellationToken)
        {
        }
    }
}