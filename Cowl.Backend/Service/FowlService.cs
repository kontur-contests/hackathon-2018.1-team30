using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR.Client;

namespace Cowl.Backend.Service
{
    public class FowlService
    {
        private bool started;

        public async Task Spawn()
        {
            if (started)
                return;

            started = true;
           
        }
    }
}