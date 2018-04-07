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
        }

        private static async Task JoinLeaveCase(int delay)
        {
            var game = new HubConnectionBuilder()
                .WithUrl("http://10.33.94.6:4844/game")
                .WithConsoleLogger()
                .Build();
            var connection = new HubConnectionBuilder()
                .WithUrl("http://10.33.94.6:4844/game")
                .WithConsoleLogger()
                .Build();

            var player = new HubConnectionBuilder()
                .WithUrl("http://10.33.94.6:4844/player")
                .WithConsoleLogger()
                .Build();


            game.On<Player>("join", data => { System.Console.WriteLine($"join: {data}"); });
            game.On<Player>("leave", data => { System.Console.WriteLine($"leave: {data}"); });
            player.On<Player>("state", data => { System.Console.WriteLine($"player-state: {data}"); });

            await game.StartAsync().ConfigureAwait(false);
            await player.StartAsync().ConfigureAwait(false);

            var random = new Random(111);
            for (var i = 0; i < 50; i++)
            {
                switch (random.Next(9))
                {
                    case 1:
                        await player.InvokeAsync("move", JsonConvert.SerializeObject(MoveDirection.Down))
                            .ConfigureAwait(false);
                        break;
                    case 2:
                        await player.InvokeAsync("move", JsonConvert.SerializeObject(MoveDirection.Up))
                            .ConfigureAwait(false);
                        break;
                    case 3:
                        await player.InvokeAsync("move", JsonConvert.SerializeObject(MoveDirection.Left))
                            .ConfigureAwait(false);
                        break;
                    case 4:
                        await player.InvokeAsync("move", JsonConvert.SerializeObject(MoveDirection.Right))
                            .ConfigureAwait(false);
                        break;
                    case 5:
                        await player.InvokeAsync("move",
                                JsonConvert.SerializeObject(MoveDirection.Down | MoveDirection.Left))
                            .ConfigureAwait(false);
                        break;
                    case 6:
                        await player.InvokeAsync("move",
                                JsonConvert.SerializeObject(MoveDirection.Down | MoveDirection.Right))
                            .ConfigureAwait(false);
                        break;
                    case 7:
                        await player.InvokeAsync("move",
                                JsonConvert.SerializeObject(MoveDirection.Up | MoveDirection.Left))
                            .ConfigureAwait(false);
                        break;
                    case 8:
                        await player.InvokeAsync("move",
                                JsonConvert.SerializeObject(MoveDirection.Up | MoveDirection.Right))
                            .ConfigureAwait(false);
                        break;
                }
            }

            await Task.Delay(delay).ConfigureAwait(false);

            await game.StopAsync().ConfigureAwait(false);
        }
    }
}