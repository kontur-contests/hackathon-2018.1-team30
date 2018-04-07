using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR.Client;
using Microsoft.Extensions.Hosting;

namespace Cowl.Backend.Service
{
    public class FowlService : IHostedService
    {
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

            while (!cancellationToken.IsCancellationRequested)
            {
                await connection.InvokeAsync("spawnFowl", cancellationToken);
                await Task.Delay(100, cancellationToken);
            }
        }

        public async Task StopAsync(CancellationToken cancellationToken)
        {
            
        }
    }
}