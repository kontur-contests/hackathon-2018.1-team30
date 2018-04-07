using System;
using System.Threading.Tasks;
using Cowl.Backend.DataModel;
using Cowl.Backend.DataModel.GameObjects;
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

            await Task.WhenAll(p1, p2, p3, p4);
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

            var random = new Random(111);
            for (var i = 0; i < 50; i++)
            {
                switch (random.Next(9))
                {
                    case 0:
                        break;
                    case 1:
                        await connection.InvokeAsync("move", MoveDirection.Down).ConfigureAwait(false);
                        break;
                    case 2:
                        await connection.InvokeAsync("move", MoveDirection.Up).ConfigureAwait(false);
                        break;
                    case 3:
                        await connection.InvokeAsync("move", MoveDirection.Left).ConfigureAwait(false);
                        break;
                    case 4:
                        await connection.InvokeAsync("move", MoveDirection.Right).ConfigureAwait(false);
                        break;
                    case 5:
                        await connection.InvokeAsync("move", MoveDirection.Down | MoveDirection.Left).ConfigureAwait(false);
                        break;
                    case 6:
                        await connection.InvokeAsync("move", MoveDirection.Down | MoveDirection.Right).ConfigureAwait(false);
                        break;
                    case 7:
                        await connection.InvokeAsync("move", MoveDirection.Down).ConfigureAwait(false);
                        break;
                    case 8:
                        await connection.InvokeAsync("move", MoveDirection.Down).ConfigureAwait(false);
                        break;
                }
            }

            await Task.Delay(delay).ConfigureAwait(false);

            await connection.StopAsync().ConfigureAwait(false);
        }
    }
}