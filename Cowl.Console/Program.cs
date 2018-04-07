using System;
using System.Threading;
using System.Threading.Tasks;
using Cowl.Backend.DataModel;
using Microsoft.AspNetCore.SignalR.Client;

namespace Cowl.Console
{
    class Program
    {
        private static Player _player;

        public static async Task Main(string[] args)
        {
            var connection = new HubConnectionBuilder()
                .WithUrl("http://10.33.94.6:4844/game")
                .WithConsoleLogger()
                .Build();

            connection.On<string>("Send", data =>
            {
                System.Console.WriteLine($"Received: {data}");
            });

            connection.On<Player>("join", data =>
            {
                _player = data;
                System.Console.WriteLine($"Received: {data}");
            });

            await connection.StartAsync().ConfigureAwait(false);
            await connection.InvokeAsync("join").ConfigureAwait(false);

            Thread.Sleep(99999);
        }
    }
}