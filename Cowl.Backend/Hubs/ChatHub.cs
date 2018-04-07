using Microsoft.AspNetCore.SignalR;

namespace Cowl.Backend.Hubs
{
    public class ChatHub : Hub
    {
        public void Send(string name, string message)
        {
            // Call the broadcastMessage method to update clients.
            Clients.All.SendAsync(name, message);
        }
    }
}