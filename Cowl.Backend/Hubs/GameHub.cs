using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Cowl.Backend.DataModel;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;

namespace Cowl.Backend.Hubs
{
    public class GameHub : Hub
    {
        public async Task Join()
        {
            var id = Guid.NewGuid().ToString();
            var name = Guid.NewGuid().ToString();

            var player = new Player {Id = id, Name = name};
            await Clients.All.SendAsync("join", player).ConfigureAwait(false);
        }
    }
}