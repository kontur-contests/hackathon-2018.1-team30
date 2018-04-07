// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.

using System;
using System.Threading.Tasks;
using Microsoft.AspNet.SignalR;

namespace Fowl.Backend.Raw
{
    public class SendingConnection : PersistentConnection
    {
        protected override Task OnReceived(IRequest request, string connectionId, string data)
        {            
            for (int i = 0; i < 10; i++)
            {
                Connection.Send(connectionId, String.Format("{0}{1}", data, i)).Wait();
            }

            var tcs = new TaskCompletionSource<object>();
            tcs.TrySetResult(null);
            return tcs.Task;
        }
    }
}