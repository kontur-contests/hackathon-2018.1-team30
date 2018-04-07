using System;
using System.Threading.Tasks;
using Cowl.Backend.DataModel;
using Cowl.Backend.DataModel.GameObjects;
using Microsoft.AspNetCore.SignalR.Client;
using Newtonsoft.Json;

namespace Cowl.Console
{
    class Program
    {
        private static Player _player;

        public static async Task Main(string[] args)
        {
            var p1 = JoinLeaveCase(3000);
            // var p2 = JoinLeaveCase(5000);
            // var p3 = JoinLeaveCase(2500);
            // var p4 = JoinLeaveCase(4000);

            await Task.WhenAll(p1);
            System.Console.ReadLine();
        }

        private static async Task JoinLeaveCase(int delay)
        {
            var game = new HubConnectionBuilder()
                .WithUrl("http://10.33.94.6:4844/game")
                .WithConsoleLogger()
                .Build();
            

            game.On<Player>("join", data => { System.Console.WriteLine($"join: {data}"); });
            game.On<Player>("leave", data => { System.Console.WriteLine($"leave: {data}"); });
            game.On<Player>("state", data =>
            {
                System.Console.WriteLine($"player-state: {data}");
            });

            await game.StartAsync().ConfigureAwait(false);

            var random = new Random(111);
            for (var i = 0; i < 50; i++)
            {
                switch (random.Next(9))
                {
                    case 1:
                        await game.InvokeAsync("movePlayer", (int) MoveDirection.Down)
                            .ConfigureAwait(false);
                        break;
                    case 2:
                        await game.InvokeAsync("movePlayer", (int) MoveDirection.Up)
                            .ConfigureAwait(false);
                        break;
                    case 3:
                        await game.InvokeAsync("movePlayer", (int) MoveDirection.Left)
                            .ConfigureAwait(false);
                        break;
                    case 4:
                        await game.InvokeAsync("movePlayer", (int) MoveDirection.Right)
                            .ConfigureAwait(false);
                        break;
                    case 5:
                        await game.InvokeAsync("movePlayer", (int) (MoveDirection.Down | MoveDirection.Left))
                            .ConfigureAwait(false);
                        break;
                    case 6:
                        await game.InvokeAsync("movePlayer", (int) (MoveDirection.Down | MoveDirection.Right))
                            .ConfigureAwait(false);
                        break;
                    case 7:
                        await game.InvokeAsync("movePlayer", (int) (MoveDirection.Up | MoveDirection.Left))
                            .ConfigureAwait(false);
                        break;
                    case 8:
                        await game.InvokeAsync("movePlayer", (int) (MoveDirection.Up | MoveDirection.Right))
                            .ConfigureAwait(false);
                        break;
                }
            }

            await Task.Delay(delay).ConfigureAwait(false);

            await game.StopAsync().ConfigureAwait(false);
        }
    }
}