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
            var p1 = JoinLeaveCase(3000);
            var p2 = JoinLeaveCase(5000);
            var p3 = JoinLeaveCase(2500);
            var p4 = JoinLeaveCase(4000);
            var p5 = JoinLeaveCase(5000);

            await Task.WhenAll(p1, p2, p3, p4, p5);
            System.Console.ReadLine();
        }

        private static async Task JoinLeaveCase(int delay)
        {
            var connection = new HubConnectionBuilder()
                .WithUrl("http://10.33.94.6:4844/game")
                .WithConsoleLogger()
                .Build();

            connection.On<Player>("join", data => { System.Console.WriteLine($"join: {data}"); });
            connection.On<Player>("leave", data => { System.Console.WriteLine($"leave: {data}"); });

            await connection.StartAsync().ConfigureAwait(false);
            await connection.InvokeAsync("join").ConfigureAwait(false);

            await Task.Delay(delay).ConfigureAwait(false);

            await connection.StopAsync().ConfigureAwait(false);
        }
    }
}