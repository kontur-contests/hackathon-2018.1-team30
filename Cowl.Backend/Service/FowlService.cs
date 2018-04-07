using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR.Client;

namespace Cowl.Backend.Service
{
    public class FowlService
    {
        public FowlService()
        {
            var connection = new HubConnectionBuilder()
                .WithUrl("/game")
                .WithConsoleLogger()
                .Build();

            connection.On("playerAttack", () =>
            {

            })
        }

       
    }
}