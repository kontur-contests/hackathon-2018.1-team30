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
           
        }
    }
}