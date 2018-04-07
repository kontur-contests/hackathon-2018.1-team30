// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.

using Microsoft.AspNet.SignalR;

namespace Fowl.Backend.Hubs
{
    public class Chat : Hub
    {
        public void Send(string message)
        {
            Clients.All.send(message);
        }
    }

}