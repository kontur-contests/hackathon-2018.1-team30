using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Cowl.Backend.DataModel;
using Cowl.Backend.DataModel.GameObjects;
using Microsoft.AspNetCore.SignalR.Client;

namespace Cowl.Console
{
    class Program
    {
        public static async Task Main(string[] args)
        {
            var connection = new HubConnectionBuilder()
                .WithUrl("http://10.33.94.6:4844/game")
                .WithConsoleLogger()
                .Build();
            await connection.StartAsync();

            var fowls = new List<Fowl>();
            var players = new List<Player>();

            connection.On<Player>("playerJoin", player => { });
            connection.On<Player>("playerLeave", player => { });
            connection.On<Player, ObjectPosition>("playerAttack", (player, position) => { });
            connection.On<Fowl>("fowlJoin", fowl => { });
            connection.On<string>("fowlKill", number => { });
            connection.On<Player>("playerState", player => { });
            connection.On<Fowl>("fowlState", fowl => { });
            connection.On<List<Fowl>>("fowls", fs => { fowls = fs; });
            connection.On<List<Player>>("players", ps => { players = ps; });
            connection.On<Player>("me", player => { });

            while (true)
            {
                foreach (var t in fowls)
                {
                    await Move(connection, players, t).ConfigureAwait(false);
                }

                await Task.Delay(25).ConfigureAwait(false);
            }
        }

        private static async Task Move(HubConnection connection, IEnumerable<Player> players, Fowl fowl)
        {
            Player nearest = null;
            var minDelta = 9999;

            foreach (var player in players)
            {
                var position = player.Position;

                var delta = Math.Abs(position.X - fowl.Position.X) + Math.Abs(position.Y - fowl.Position.Y);
                if (delta >= minDelta)
                    continue;

                minDelta = delta;
                nearest = player;
            }

            if (nearest == null)
                return;

            var x = (nearest.Position.X - fowl.Position.X) % 2;
            var y = (nearest.Position.Y - fowl.Position.Y) % 2;

            fowl.Position = new ObjectPosition {X = fowl.Position.X + x, Y = fowl.Position.Y + y};

            await connection.InvokeAsync("fowlState", fowl).ConfigureAwait(false);
        }
    }
}