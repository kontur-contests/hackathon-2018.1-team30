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
    public class BotPlayersService : IHostedService
    {
        private Player me;

        public async Task StartAsync(CancellationToken cancellationToken)
        {
            var connection = new HubConnectionBuilder()
                .WithUrl("http://10.33.94.6:4844/game")
                .WithConsoleLogger()
                .Build();
            await connection.StartAsync();

            await connection.InvokeAsync("joinGame");

            connection.On<Player>("me", p => me = p);

            await Task.Delay(TimeSpan.FromSeconds(5));

            while (!cancellationToken.IsCancellationRequested)
            {
                var random = new Random(5349856);
                var x = random.Next(3);
                var y = random.Next(3);

                var modX = random.Next(1) == 1 ? 1 : -1;
                var modY = random.Next(1) == 1 ? 1 : -1;

                await connection.InvokeAsync("moveGameObject", me.Id, new ObjectPosition {X = x * modX, Y = y * modY});
                await Task.Delay(40);
            }

            await connection.StopAsync();
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            return Task.Delay(1);
        }
    }
}