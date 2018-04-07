using System;
using FluentScheduler;
using Microsoft.AspNetCore.SignalR.Client;

namespace Cowl.Backend.Schedule.Job
{
    internal abstract class SpawnFowlJob : IJob
    {
        public void Execute()
        {
            Console.WriteLine("execute job");

            var connection = new HubConnectionBuilder()
                .WithUrl("/game")
                .WithConsoleLogger()
                .Build();


            connection.InvokeAsync("SpawnFowl").GetAwaiter().GetResult();
        }
    }
}